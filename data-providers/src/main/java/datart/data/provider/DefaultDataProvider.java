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
package datart.data.provider;

import datart.core.base.PageInfo;
import datart.core.base.consts.ValueType;
import datart.core.data.provider.*;
import datart.data.provider.base.DataProviderException;
import datart.data.provider.calcite.SqlParserUtils;
import datart.data.provider.local.LocalDB;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;


public abstract class DefaultDataProvider extends DataProvider {

    public static final String TEST_DATA_SIZE = "size";

    public static final String SCHEMAS = "schemas";

    public static final String DEFAULT_DB = "default";

    protected static final String COLUMN_TYPE = "type";

    protected static final String COLUMN_NAME = "name";

    protected static final String TABLE = "tableName";

    protected static final String COLUMNS = "columns";

    @Override
    public Object test(DataProviderSource source) throws Exception {

        PageInfo pageInfo = PageInfo.builder()
                .pageSize(Integer.parseInt(source.getProperties().getOrDefault(TEST_DATA_SIZE, "100").toString()))
                .build();

        ExecuteParam executeParam = ExecuteParam.builder()
                .pageInfo(pageInfo)
                .cacheEnable(false)
                .build();

        return execute(source, null, executeParam);
    }

    @Override
    public Set<String> readAllDatabases(DataProviderSource source) {
        return Collections.singleton(DEFAULT_DB);
    }

    @Override
    public Set<String> readTables(DataProviderSource source, String database) {

        List<Map<String, Object>> schemas = (List<Map<String, Object>>) source.getProperties().get(SCHEMAS);

        if (CollectionUtils.isEmpty(schemas)) {
            return Collections.emptySet();
        }
        return schemas.stream()
                .map(s -> s.get(TABLE).toString())
                .collect(Collectors.toSet());
    }

    @Override
    public Set<Column> readTableColumns(DataProviderSource source, String schema, String table) {

        List<Map<String, Object>> schemas = (List<Map<String, Object>>) source.getProperties().get(SCHEMAS);

        List<Map<String, String>> columns = null;
        for (Map<String, Object> o : schemas) {
            if (table.equals(o.get(TABLE))) {
                columns = (List<Map<String, String>>) o.get(COLUMNS);
            }
        }
        if (columns == null) {
            return Collections.emptySet();
        }
        return columns.stream().map(col -> {
            Column column = new Column();
            column.setName(col.get(COLUMN_NAME));
            column.setType(ValueType.valueOf(col.get(COLUMN_TYPE).toUpperCase()));
            return column;
        }).collect(Collectors.toSet());

    }

    @Override
    public void close() throws IOException {

    }

    @Override
    public Dataframe execute(DataProviderSource config, QueryScript queryScript, ExecuteParam executeParam) throws Exception {
        Dataframe dataframe;

        if (queryScript != null) {
            String queryKey = queryScript.toQueryKey();

            if (executeParam.isCacheEnable()) {
                dataframe = LocalDB.queryFromLocal(queryKey, executeParam);
                if (dataframe != null) return dataframe;
            }
        }
        List<Dataframe> fullData = loadFullDataFromSource(config);
        return LocalDB.executeLocalQuery(queryScript, executeParam, executeParam.isCacheEnable(), fullData);
    }

    public abstract List<Dataframe> loadFullDataFromSource(DataProviderSource config) throws Exception;

    @Override
    public boolean validateFunction(DataProviderSource source, String snippet) {
        try {
            SqlParserUtils.parseSnippet(snippet);
        } catch (Exception e) {
            throw new DataProviderException(e);
        }

        return true;
    }

    protected List<List<Object>> parseValues(List<List<Object>> values, List<Column> columns) {
        if (CollectionUtils.isEmpty(values)) {
            return values;
        }
        if (values.get(0).size() != columns.size()) {
            throw new RuntimeException("schema has different columns with data");
        }
        values.parallelStream().forEach(vals -> {
            for (int i = 0; i < vals.size(); i++) {
                Object val = vals.get(i);
                if (val == null) {
                    vals.set(i, null);
                    continue;
                }
                switch (columns.get(i).getType()) {
                    case STRING:
                        val = val.toString();
                        break;
                    case NUMERIC:
                        val = Double.parseDouble(val.toString());
                        break;
                    default:
                }
                vals.set(i, val);
            }
        });
        return values;
    }

    protected void removeHeader(List<List<Object>> values) {
        if (CollectionUtils.isEmpty(values)) {
            return;
        }
        boolean isHeader = values.get(0).stream()
                .allMatch(typedValue -> typedValue instanceof String);
        if (isHeader) {
            values.remove(0);
        }
    }

}
