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
import datart.data.provider.calcite.dialect.H2Dialect;
import datart.data.provider.jdbc.DataTypeUtils;
import datart.data.provider.jdbc.ResultSetMapper;
import datart.data.provider.jdbc.SqlScriptRender;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.sql.SqlDialect;
import org.apache.calcite.sql.type.SqlTypeName;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.h2.tools.DeleteDbFiles;
import org.h2.tools.SimpleResultSet;

import java.sql.*;
import java.sql.Date;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
public class LocalDB {

    private static final String MEM_URL = "jdbc:h2:mem:/LOG=0;DATABASE_TO_UPPER=false;CACHE_SIZE=65536;LOCK_MODE=0;UNDO_LOG=0";

    private static String fileUrl;

    private static final String TABLE_CREATE_SQL_TEMPLATE = "CREATE TABLE `%s` ( %s )";

    public static final SqlDialect SQL_DIALECT = new H2Dialect();

    private static final String SELECT_START_SQL = "SELECT * FROM `%s` ";

    private static final String INSERT_SQL = "INSERT INTO `%s` VALUES %s";

    private static final String CREATE_TEMP_TABLE = "CREATE TABLE IF NOT EXISTS `%s` AS (SELECT * FROM FUNCTION_TABLE('%s'))";

    private static final int MAX_INSERT_BATCH = 5_000;

    private static final String CACHE_EXPIRE_TABLE_SQL = "CREATE TABLE IF NOT EXISTS `cache_expire` ( `source_id` VARCHAR(128),`expire_time` DATETIME )";

    private static final String SET_EXPIRE_SQL = "INSERT INTO `cache_expire` VALUES( '%s', PARSEDATETIME('%s','%s')) ";

    private static final String DELETE_EXPIRE_SQL = "DELETE FROM `cache_expire` WHERE `source_id`='%s' ";

    private static final Map<String, Dataframe> TEMP_RS_CACHE = new ConcurrentHashMap<>();

    static {
        init();
    }

    private static void init() {
        try {
            Class.forName("org.h2.Driver");
            try (Connection connection = getConnection(true, null)) {
                Statement statement = connection.createStatement();
                statement.execute(CACHE_EXPIRE_TABLE_SQL);
            }
        } catch (Exception e) {
            log.error("H2 init error", e);
        }
    }

    /**
     * 函数表对应函数，直接从Dataframe 返回一个 ResultSet.
     *
     * @param conn   ResultSet 对应连接
     * @param dataId ResultSet 对应 Dataframe
     */
    public static ResultSet dataframeTable(Connection conn, String dataId) throws SQLException {
        Dataframe dataframe = TEMP_RS_CACHE.get(dataId);
        if (dataframe == null) {
            throw new RuntimeException("The dataframe " + dataId + " does not exist");
        }
        SimpleResultSet rs = new SimpleResultSet();
        if (!CollectionUtils.isEmpty(dataframe.getColumns())) {
            // add columns
            for (Column column : dataframe.getColumns()) {
                rs.addColumn(column.getName(), DataTypeUtils.valueType2SqlTypes(column.getType()), -1, -1);
            }
        }
        if (conn.getMetaData().getURL().equals("jdbc:columnlist:connection")) {
            return rs;
        }
        // add rows
        if (!CollectionUtils.isEmpty(dataframe.getRows())) {
            for (List<Object> row : dataframe.getRows()) {
                rs.addRow(row.toArray());
            }
        }
        return rs;
    }

    /**
     * 把数据注册注册为临时表，用于SQL查询
     *
     * @param dataframe 二维表数据
     */
    private static void registerDataAsTable(Dataframe dataframe, Connection connection) throws SQLException {
        if (Objects.isNull(dataframe)) {
            throw new RuntimeException("Empty data cannot be registered as a temporary table");
        }

        // 处理脏数据
        dataframe.getRows().parallelStream().forEach(row -> {
            for (int i = 0; i < row.size(); i++) {
                Object val = row.get(i);
                if (val instanceof String && StringUtils.isBlank(val.toString())) {
                    row.set(i, null);
                }
            }
        });

        createFunctionTableIfNotExists(connection);

        TEMP_RS_CACHE.put(dataframe.getId(), dataframe);
        // register temporary table
        String sql = String.format(CREATE_TEMP_TABLE, dataframe.getName(), dataframe.getId());
        connection.prepareStatement(sql).execute();
    }

    /**
     * 清除临时数据
     *
     * @param dataId data id
     */
    private static void unregisterData(String dataId) {
        TEMP_RS_CACHE.remove(dataId);
    }

    private static void createFunctionTableIfNotExists(Connection connection) {
        try {
            Statement statement = connection.createStatement();
            statement.execute("CREATE ALIAS FUNCTION_TABLE  FOR \"datart.data.provider.local.LocalDB.dataframeTable\"");
        } catch (SQLException ignored) {
        }
    }

    public static Dataframe executeLocalQuery(QueryScript queryScript, ExecuteParam executeParam, List<Dataframe> srcData) throws Exception {
        return executeLocalQuery(queryScript, executeParam, srcData, false, null);
    }

    /**
     * 对给定的数据进行本地聚合：将原始数据插入到H2数据库，然后在H2数据库上执行SQL进行数据查询
     *
     * @param queryScript  查询脚本
     * @param executeParam 执行参数
     * @param persistent   原始数据是持久化
     * @param srcData      原始数据
     * @return 查询脚本+执行参数 执行后结果
     */
    public static Dataframe executeLocalQuery(QueryScript queryScript, ExecuteParam executeParam, List<Dataframe> srcData, boolean persistent, java.util.Date expire) throws Exception {
        if (queryScript == null) {
            // 直接以指定数据源为表进行查询，生成一个默认的SQL查询全部数据
            queryScript = new QueryScript();
            queryScript.setScript(String.format(SELECT_START_SQL, srcData.get(0).getName()));
            queryScript.setVariables(Collections.emptyList());
        }
        return persistent ? executeInLocalDB(queryScript, executeParam, srcData, expire) : executeInMemDB(queryScript, executeParam, srcData);
    }

    /**
     * 非持久化查询，通过函数表注册数据为临时表，执行一次后丢弃表数据。
     */
    private static Dataframe executeInMemDB(QueryScript queryScript, ExecuteParam executeParam, List<Dataframe> srcData) throws Exception {
        Connection connection = getConnection(false, queryScript.getSourceId());
        try {
            for (Dataframe dataframe : srcData) {
                registerDataAsTable(dataframe, connection);
            }
            return execute(connection, queryScript, executeParam);
        } finally {
            try {
                connection.close();
            } catch (Exception e) {
                log.error("connection close error ", e);
            }
            for (Dataframe df : srcData) {
                unregisterData(df.getId());
            }
        }

    }

    /**
     * 持久化查询，将数据插入到H2表中，再进行查询
     */
    private static Dataframe executeInLocalDB(QueryScript queryScript, ExecuteParam executeParam, List<Dataframe> srcData, java.util.Date expire) throws Exception {
        try (Connection connection = getConnection(true, queryScript.getSourceId())) {
            if (CollectionUtils.isNotEmpty(srcData)) {

                for (Dataframe dataframe : srcData) {
                    registerDataAsTable(dataframe, connection);
                }

                if (expire != null) {
                    setCacheExpire(queryScript.getSourceId(), expire);
                }

            }
            return execute(connection, queryScript, executeParam);
        }
    }

    /**
     * 检查数据源缓存是否过期。如果过期,会删除缓存
     *
     * @param sourceId source 唯一标识
     */
    public static boolean checkCacheExpired(String sourceId) throws SQLException {
        try (Connection connection = getConnection(true, null)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("SELECT * FROM `cache_expire` WHERE `source_id`='" + sourceId + "'");
            if (resultSet.next()) {
                Timestamp cacheExpire = resultSet.getTimestamp("expire_time");
                if (cacheExpire.after(new java.util.Date())) {
                    return false;
                }
                clearCache(sourceId);
            }
        }
        return true;
    }

    private static void setCacheExpire(String sourceId, java.util.Date date) throws SQLException {
        try (Connection connection = getConnection(true, null)) {
            Statement statement = connection.createStatement();
            // delete first
            statement.execute(String.format(DELETE_EXPIRE_SQL, statement));
            // insert expire
            String sql = String.format(SET_EXPIRE_SQL, sourceId, DateFormatUtils.format(date, Const.DEFAULT_DATE_FORMAT), Const.DEFAULT_DATE_FORMAT);
            statement.execute(sql);
        }
    }

    public static void clearCache(String sourceId) throws SQLException {
        try (Connection connection = getConnection(true, null)) {
            connection.createStatement().execute(String.format(DELETE_EXPIRE_SQL, sourceId));
            DeleteDbFiles.execute(getDbFileBasePath(), toDatabase(sourceId), false);
        }
    }

    private static String toDatabase(String sourceId) {
        return "D" + sourceId;
    }

    private static Dataframe execute(Connection connection, QueryScript queryScript, ExecuteParam executeParam) throws Exception {
        SqlScriptRender render = new SqlScriptRender(queryScript
                , executeParam
                , SQL_DIALECT
                , Const.DEFAULT_VARIABLE_QUOTE);

        String sql = render.render(true, false, false);

        ResultSet resultSet = connection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY).executeQuery(sql);
        PageInfo pageInfo = executeParam.getPageInfo();
        resultSet.last();
        pageInfo.setTotal(resultSet.getRow());
        resultSet.first();

        resultSet.absolute((int) Math.min(pageInfo.getTotal(), (pageInfo.getPageNo() - 1) * pageInfo.getPageSize()));
        Dataframe dataframe = ResultSetMapper.mapToTableData(resultSet, pageInfo.getPageSize());
        dataframe.setPageInfo(pageInfo);
        dataframe.setScript(sql);
        return dataframe;

    }

    private static void createTable(String tableName, List<Column> columns, Connection connection) throws SQLException {
        String sql = tableCreateSQL(tableName, columns);
        connection.createStatement().execute(sql);
    }

    private static void insertTableData(Dataframe dataframe, Connection connection) throws SQLException {
        if (dataframe == null) {
            return;
        }
//        DeleteDbFiles.execute();
        createTable(dataframe.getName(), dataframe.getColumns(), connection);

        List<String> values = createInsertValues(dataframe.getRows(), dataframe.getColumns());

        List<List<String>> partition = Lists.partition(values, MAX_INSERT_BATCH);
        for (List<String> vals : partition) {
            String insertSql = String.format(INSERT_SQL, dataframe.getName(), String.join(",", vals));
            connection.createStatement().execute(insertSql);
        }
    }

    private static Connection getConnection(boolean persistent, String database) throws SQLException {
        String url = persistent ? getDatabaseUrl(database) : MEM_URL;
        return DriverManager.getConnection(url);
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
                if (val == null || StringUtils.isBlank(val.toString())) {
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

    private static String getDatabaseUrl(String database) {
        if (database == null) {
            database = "datart_meta";
        } else {
            database = toDatabase(database);
        }
        return fileUrl = String.format("jdbc:h2:file:%s/%s;LOG=0;DATABASE_TO_UPPER=false;CACHE_SIZE=65536;LOCK_MODE=0;UNDO_LOG=0", getDbFileBasePath(), database);
    }

    private static String getDbFileBasePath() {
        return Application.getFileBasePath() + "h2/dbs";
    }

}
