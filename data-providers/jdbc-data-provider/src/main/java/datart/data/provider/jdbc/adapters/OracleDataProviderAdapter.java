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
import datart.core.base.consts.ValueType;
import datart.core.data.provider.Column;
import datart.core.data.provider.Dataframe;
import datart.core.data.provider.ExecuteParam;
import datart.core.data.provider.QueryScript;
import datart.data.provider.jdbc.DataTypeUtils;
import datart.data.provider.jdbc.SqlScriptRender;
import lombok.extern.slf4j.Slf4j;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Slf4j
public class OracleDataProviderAdapter extends JdbcDataProviderAdapter {

    private static final String PAGE_SQL = "SELECT * FROM (SELECT ROWNUM V_R_N,V_T0.* FROM (%s) V_T0 WHERE ROWNUM < %d) WHERE V_R_N>=%d";

    public Set<String> readAllDatabases() {
        return Collections.singleton(jdbcProperties.getUser());
    }

    @Override
    protected Dataframe parseResultSet(ResultSet rs, long count) throws SQLException {
        Dataframe dataframe = new Dataframe();
        List<Column> columns = getColumns(rs);
        ArrayList<List<Object>> rows = new ArrayList<>();
        int c = 0;
        while (rs.next()) {
            ArrayList<Object> row = new ArrayList<>();
            rows.add(row);
            for (int i = 2; i < columns.size() + 2; i++) {
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

    @Override
    protected Dataframe executeOnSource(QueryScript script, ExecuteParam executeParam) throws Exception {

        SqlScriptRender render = new SqlScriptRender(script
                , executeParam
                , getSqlDialect()
                , getVariableQuote());

        String sql = render.render(true, false, false);

        String wrappedSql = pageWrapper(sql, executeParam.getPageInfo());

        log.debug(wrappedSql);

        Dataframe dataframe = execute(wrappedSql);
        // fix page info
        if (executeParam.getPageInfo().isCountTotal()) {
            int total = executeCountSql(render.render(true, false, true));
            executeParam.getPageInfo().setTotal(total);
            dataframe.setPageInfo(executeParam.getPageInfo());
        }
        dataframe.setScript(wrappedSql);
        return dataframe;
    }

    private String pageWrapper(String sql, PageInfo pageInfo) {
        return String.format(PAGE_SQL,
                sql,
                (pageInfo.getPageNo()) * pageInfo.getPageSize(),
                (pageInfo.getPageNo() - 1) * pageInfo.getPageSize());
    }

    protected List<Column> getColumns(ResultSet rs) throws SQLException {
        ArrayList<Column> columns = new ArrayList<>();
        for (int i = 2; i <= rs.getMetaData().getColumnCount(); i++) {
            String columnTypeName = rs.getMetaData().getColumnTypeName(i);
            String columnName = rs.getMetaData().getColumnName(i);
            ValueType valueType = DataTypeUtils.sqlType2DataType(columnTypeName);
            columns.add(new Column(columnName, valueType));
        }
        return columns;
    }

}