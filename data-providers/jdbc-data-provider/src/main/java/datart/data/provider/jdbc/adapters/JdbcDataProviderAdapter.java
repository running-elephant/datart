/*
 * Datart
 * <p>
 * Copyright 2021
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package datart.data.provider.jdbc.adapters;

import datart.core.base.PageInfo;
import datart.core.base.consts.Const;
import datart.core.base.consts.ValueType;
import datart.core.common.Application;
import datart.core.common.BeanUtils;
import datart.core.data.provider.Column;
import datart.core.data.provider.Dataframe;
import datart.data.provider.JdbcDataProvider;
import datart.data.provider.base.DataProviderException;
import datart.data.provider.base.JdbcDriverInfo;
import datart.data.provider.base.JdbcProperties;
import datart.data.provider.jdbc.DataTypeUtils;
import datart.data.provider.jdbc.ResultSetMapper;
import datart.data.provider.jdbc.dlalect.CustomSqlDialect;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.sql.SqlDialect;
import org.apache.commons.lang3.StringUtils;

import javax.sql.DataSource;
import java.io.Closeable;
import java.sql.*;
import java.util.*;

@Slf4j
@Setter
@Getter
public class JdbcDataProviderAdapter implements Closeable {

    private static final String SQL_DIALECT_PACKAGE = "datart.data.provider.calcite.dialect";

    protected static final String COUNT_SQL = "SELECT COUNT(*) FROM (%s) V_T";

    protected DataSource dataSource;

    protected JdbcProperties jdbcProperties;

    protected JdbcDriverInfo driverInfo;

    protected boolean init;

    protected SqlDialect sqlDialect;

    public void init(JdbcProperties jdbcProperties, JdbcDriverInfo driverInfo) {
        try {
            this.jdbcProperties = jdbcProperties;
            this.driverInfo = driverInfo;
            this.dataSource = JdbcDataProvider.getDataSourceFactory().createDataSource(jdbcProperties);
        } catch (Exception e) {
            log.error("data provider init error", e);
            throw new DataProviderException(e);
        }
        this.init = true;
    }

    public boolean test(JdbcProperties properties) {
        BeanUtils.validate(properties);
        try {
            Class.forName(properties.getDriverClass());
        } catch (ClassNotFoundException e) {
            String errMsg = "Driver class not found " + properties.getDriverClass();
            log.error(errMsg, e);
            throw new DataProviderException(errMsg);
        }
        try {
            DriverManager.getConnection(properties.getUrl(), properties.getUser(), properties.getPassword());
        } catch (SQLException sqlException) {
            throw new DataProviderException(sqlException);
        }
        return true;
    }

    public Set<String> readAllDatabases() throws SQLException {

        Set<String> catalogs = new HashSet<>();

        try (Connection conn = getConn()) {
            String catalog = conn.getCatalog();
            if (StringUtils.isNotBlank(catalog)) {
                return Collections.singleton(catalog);
            }
            DatabaseMetaData metadata = conn.getMetaData();
            try (ResultSet rs = metadata.getCatalogs()) {
                while (rs.next()) {
                    String catalogName = rs.getString(1);
                    catalogs.add(catalogName);
                }
            }
            return catalogs;
        }
    }

    public Set<String> readAllTables(String database) throws SQLException {
        try (Connection conn = getConn()) {
            Set<String> tables = new HashSet<>();
            DatabaseMetaData metadata = conn.getMetaData();
            try (ResultSet rs = metadata.getTables(database, conn.getSchema(), "%", new String[]{"TABLE", "VIEW"})) {
                while (rs.next()) {
                    String tableName = rs.getString(3);
                    tables.add(tableName);
                }
            }
            return tables;
        }
    }

    public Set<Column> readTableColumn(String database, String table) throws SQLException {
        try (Connection conn = getConn()) {
            HashMap<String, Column> columnMap = new HashMap<>();
            DatabaseMetaData metadata = conn.getMetaData();
            ResultSet columns = metadata.getColumns(database, null, table, null);
            while (columns.next()) {
                Column column = readTableColumn(columns);
                columnMap.put(column.getName(), column);
            }
            return new HashSet<>(columnMap.values());
        }
    }


    public String getVariableQuote() {
        return Const.DEFAULT_VARIABLE_QUOTE;
    }


    private Column readTableColumn(ResultSet columnMetadata) throws SQLException {
        Column column = new Column();
        column.setName(columnMetadata.getString(4));
        column.setType(DataTypeUtils.sqlType2DataType(columnMetadata.getString(6)));
        return column;
    }

    public Dataframe execute(String sql) throws SQLException {
        try (Connection conn = getConn()) {
            Statement statement = conn.createStatement();
            return ResultSetMapper.mapToTableData(statement.executeQuery(sql));
        }
    }

    public Dataframe execute(String selectSql, PageInfo pageInfo) throws SQLException {
        Dataframe dataframe;
        try (Connection conn = getConn()) {
            Statement statement = null;
            try {
                statement = conn.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
            } catch (SQLFeatureNotSupportedException e) {
                if (driverInfo != null) {
                    log.info(driverInfo.getDbType() + ":" + e.getMessage());
                }
                statement = conn.createStatement();
            }

            statement.setFetchSize((int) Math.min(pageInfo.getPageSize(), 10_000));

            try (ResultSet resultSet = statement.executeQuery(selectSql)) {

                // TODO paging through  sql
//                if (supportPaging()) {
//                    dataframe = ResultSetMapper.mapToTableData(resultSet);
//                    dataframe.setPageInfo(pageInfo);
//                    return dataframe;
//                }

                //paging through  jdbc
                try {
                    resultSet.absolute((int) Math.min(pageInfo.getTotal(), (pageInfo.getPageNo() - 1) * pageInfo.getPageSize()));
                } catch (Exception e) {
                    int count = 0;
                    while (count < (pageInfo.getPageNo() - 1) * pageInfo.getPageSize() && resultSet.next()) {
                        count++;
                    }
                }
                dataframe = parseResultSet(resultSet, pageInfo.getPageSize());

                // get total size
                try {
                    resultSet.last();
                    pageInfo.setTotal(resultSet.getRow());
                } catch (Exception e) {
                    pageInfo.setTotal(countTotal(conn, selectSql));
                }
                dataframe.setPageInfo(pageInfo);
                return dataframe;
            }
        }
    }

    protected Connection getConn() throws SQLException {
        return dataSource.getConnection();
    }

    @Override
    public void close() {
        if (dataSource == null) {
            return;
        }
        JdbcDataProvider.getDataSourceFactory().destroy(dataSource);
    }

    public boolean supportPaging() {
        return false;
    }

    public SqlDialect getSqlDialect() {
        if (sqlDialect != null) {
            return sqlDialect;
        }
        try {
            sqlDialect = SqlDialect.DatabaseProduct.valueOf(driverInfo.getDbType().toUpperCase()).getDialect();
        } catch (Exception ignored) {
            log.warn("DBType " + driverInfo.getDbType() + " mismatched, use custom sql dialect");
            sqlDialect = CustomSqlDialect.create(driverInfo);
        }
        try {
            return Application.getBean(sqlDialect.getClass());
        } catch (Exception e) {
            log.debug("Custom sql dialect for {} not found. using default", sqlDialect.getClass().getSimpleName());
        }
        return sqlDialect;
    }

    protected int countTotal(Connection conn, String sql) throws SQLException {
        PreparedStatement preparedStatement = conn.prepareStatement(String.format(COUNT_SQL, sql));
        ResultSet resultSet = preparedStatement.executeQuery();
        resultSet.next();
        return resultSet.getInt(1);
    }

    protected Dataframe parseResultSet(ResultSet rs, long count) throws SQLException {
        Dataframe dataframe = new Dataframe();
        List<Column> columns = getColumns(rs);
        ArrayList<List<Object>> rows = new ArrayList<>();
        int c = 0;
        while (rs.next()) {
            ArrayList<Object> row = new ArrayList<>();
            rows.add(row);
            for (int i = 1; i < columns.size() + 1; i++) {
                row.add(rs.getObject(i));
            }
            c++;
            if (c >= count) {
                break;
            }
        }
        dataframe.setColumns(columns);
        dataframe.setRows(rows);
        return dataframe;
    }

    protected List<Column> getColumns(ResultSet rs) throws SQLException {
        ArrayList<Column> columns = new ArrayList<>();
        for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
            String columnTypeName = rs.getMetaData().getColumnTypeName(i);
            String columnName = rs.getMetaData().getColumnName(i);
            ValueType valueType = DataTypeUtils.sqlType2DataType(columnTypeName);
            columns.add(new Column(columnName, valueType));
        }
        return columns;
    }

}
