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
package datart.data.provider.local;

import com.google.common.collect.Lists;
import datart.core.base.PageInfo;
import datart.core.base.consts.Const;
import datart.core.common.Application;
import datart.core.data.provider.Column;
import datart.core.data.provider.Dataframe;
import datart.core.data.provider.ExecuteParam;
import datart.core.data.provider.QueryScript;
import datart.data.provider.calcite.SqlBuilder;
import datart.data.provider.calcite.dialect.H2Dialect;
import datart.data.provider.jdbc.DataTypeUtils;
import datart.data.provider.jdbc.ResultSetMapper;
import datart.data.provider.jdbc.SqlScriptRender;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.sql.SqlDialect;
import org.apache.calcite.sql.parser.SqlParseException;
import org.apache.calcite.sql.type.SqlTypeName;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.time.DateFormatUtils;

import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.StringJoiner;
import java.util.stream.Collectors;

@Slf4j
public class LocalDB {

    private static final String MEM_URL = "jdbc:h2:mem:/LOG=0;CACHE_SIZE=65536;LOCK_MODE=0;UNDO_LOG=0";

    private static String fileUrl;

    private static final String TABLE_CREATE_SQL_TEMPLATE = "CREATE TABLE `%s` ( %s )";

    public static final SqlDialect SQL_DIALECT = new H2Dialect();

    private static final String SELECT_START_SQL = "SELECT * FROM %s";

    private static final String INSERT_SQL = "INSERT INTO %s VALUES %s";

    private static final int MAX_INSERT_BATCH = 5_000;

    static {
        try {
            Class.forName("org.h2.Driver");
        } catch (ClassNotFoundException e) {
            log.error("H2 driver not found", e);
        }
    }


    public static Dataframe executeLocalQuery(QueryScript queryScript, ExecuteParam executeParam, boolean persistent, List<Dataframe> srcData) throws Exception {
        String sql;
        if (queryScript == null) {
            sql = "SELECT * FROM `" + srcData.get(0).getName() + "`";
        } else {
            SqlScriptRender render = new SqlScriptRender(queryScript
                    , executeParam
                    , SQL_DIALECT
                    , Const.DEFAULT_VARIABLE_QUOTE);
            sql = render.render(true, true, false);
        }

        try (Connection connection = getConnection(persistent)) {
            for (Dataframe dataframe : srcData) {
                insertTableData(dataframe, connection);
            }
            return executeQuery(sql, connection, executeParam.getPageInfo());
        }
    }

    /**
     * 对已有的数据根据查询参数进行本地聚合
     *
     * @param queryId      查询条件的MD5摘要
     * @param executeParam 查询参数
     * @param persistent   是否持久化传入的数据
     * @param srcData      给定的格式化数据
     * @return 根据查询参数进行二次查询后的数据
     * @throws SQLException 本地查询异常
     */
    public static Dataframe queryFromLocal(String queryId, ExecuteParam executeParam, boolean persistent, List<Dataframe> srcData) throws Exception {
        try (Connection connection = getConnection(persistent)) {
            for (Dataframe dataframe : srcData) {
                insertTableData(dataframe, connection);
            }
            return queryFromLocal(queryId, executeParam, connection);
        }
    }

    private static Dataframe queryFromLocal(String queryId, ExecuteParam executeParam, Connection connection) throws Exception {
        String sql = localQuerySql(queryId, executeParam);
        return executeQuery(sql, connection, executeParam.getPageInfo());
    }

    private static Dataframe executeQuery(String sql, Connection connection, PageInfo pageInfo) throws SQLException {
        ResultSet resultSet = connection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY).executeQuery(sql);

        resultSet.last();
        pageInfo.setTotal(resultSet.getRow());
        resultSet.first();

        resultSet.absolute((int) Math.min(pageInfo.getTotal(), (pageInfo.getPageNo() - 1) * pageInfo.getPageSize()));
        Dataframe dataframe = ResultSetMapper.mapToTableData(resultSet, pageInfo.getPageSize());
        dataframe.setPageInfo(pageInfo);
        dataframe.setScript(sql);
        return dataframe;
    }

    public static Dataframe queryFromLocal(String queryId, ExecuteParam executeParam, boolean persistent) {
        try (Connection connection = getConnection(persistent)) {
            String sql = localQuerySql(queryId, executeParam);

            ResultSet resultSet = connection.createStatement().executeQuery(sql);

            return ResultSetMapper.mapToTableData(resultSet);
        } catch (SQLException | SqlParseException e) {
            return null;
        }
    }

    public static Dataframe queryFromLocal(String queryId, ExecuteParam executeParam) {
        return queryFromLocal(queryId, executeParam, true);
    }

    private static void createTable(String tableName, List<Column> columns, Connection connection) throws SQLException {
        String sql = tableCreateSQL(tableName, columns);
        connection.createStatement().execute(sql);
    }

    private static void insertTableData(Dataframe dataframe, Connection connection) throws SQLException {
        if (dataframe == null) {
            return;
        }
        createTable(dataframe.getName(), dataframe.getColumns(), connection);

        List<String> values = createInsertValues(dataframe.getRows(), dataframe.getColumns());

        List<List<String>> partition = Lists.partition(values, MAX_INSERT_BATCH);
        for (List<String> vals : partition) {
            String insertSql = String.format(INSERT_SQL, dataframe.getName(), String.join(",", vals));
            connection.createStatement().execute(insertSql);
        }
    }

    private static Connection getConnection(boolean persistent) throws SQLException {
        return false ? DriverManager.getConnection(getFileUrl()) : DriverManager.getConnection(MEM_URL);
    }

    private static String localQuerySql(String queryId, ExecuteParam executeParam) throws SqlParseException {
        return SqlBuilder.builder()
                .withExecuteParam(executeParam)
                .withDialect(SQL_DIALECT)
                .withBaseSql(String.format(SELECT_START_SQL, queryId))
                .build();
    }

    private static String tableCreateSQL(String name, List<Column> columns) {
        StringJoiner sj = new StringJoiner(",");
        for (Column column : columns) {
            SqlTypeName sqlTypeName = DataTypeUtils.javaType2SqlType(column.getType());
            sj.add("`" + column.getName() + "`" + " " + sqlTypeName.getName());
        }
        return String.format(TABLE_CREATE_SQL_TEMPLATE, name, sj);
    }

    private static List<String> createInsertValues(List<List<Object>> data, List<Column> columns) {
        return data.parallelStream().map(row -> {
            StringJoiner stringJoiner = new StringJoiner(",", "(", ")");
            for (int i = 0; i < row.size(); i++) {
                Object val = row.get(i);
                if (val == null) {
                    stringJoiner.add(null);
                    continue;
                }
                Column column = columns.get(i);
                switch (column.getType()) {
                    case NUMERIC:
                        stringJoiner.add(val.toString());
                        break;
                    case DATE:
                        String valStr;
                        if (val instanceof Timestamp) {
                            valStr = DateFormatUtils.format((Timestamp) val, Const.DEFAULT_DATE_FORMAT);
                        } else if (val instanceof Date) {
                            valStr = DateFormatUtils.format((Date) val, Const.DEFAULT_DATE_FORMAT);
                        } else if (val instanceof LocalDateTime) {
                            valStr = ((LocalDateTime) val).format(DateTimeFormatter.ofPattern(Const.DEFAULT_DATE_FORMAT));
                        } else {
                            valStr = null;
                        }
                        if (valStr != null) {
                            valStr = "PARSEDATETIME('" + valStr + "','" + Const.DEFAULT_DATE_FORMAT + "')";
                        }
                        stringJoiner.add(valStr);
                        break;
                    default:
                        stringJoiner.add("'" + StringEscapeUtils.escapeSql(val.toString()) + "'");
                }
            }
            return stringJoiner.toString();
        }).collect(Collectors.toList());
    }

    private static String getFileUrl() {
        if (fileUrl != null) {
            return fileUrl;
        }
        return fileUrl = String.format("jdbc:h2:file:%sh2/datart_temp", Application.getFileBasePath());
    }

}
