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

import datart.core.data.provider.Dataframe;
import datart.core.data.provider.ExecuteParam;
import datart.core.data.provider.QueryScript;
import datart.core.data.provider.sql.OrderOperator;
import org.apache.commons.collections4.CollectionUtils;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class ImpalaDataProviderAdapter extends JdbcDataProviderAdapter {

    @Override
    public Set<String> readAllTables(String database) throws SQLException {
        try (Connection conn = getConn()) {
            Set<String> tables = new HashSet<>();
            DatabaseMetaData metadata = conn.getMetaData();
            try (ResultSet rs = metadata.getTables(null, null, "%", new String[]{"TABLE", "VIEW"})) {
                while (rs.next()) {
                    String tableName = rs.getString(3);
                    tables.add(tableName);
                }
            }
            return tables;
        }
    }

    @Override
    public Dataframe executeOnSource(QueryScript script, ExecuteParam executeParam) throws Exception {
        if (CollectionUtils.isEmpty(executeParam.getOrders())) {
            executeParam.setOrders(Collections.singletonList(new OrderOperator()));
        }
        return super.executeOnSource(script, executeParam);
    }
}
