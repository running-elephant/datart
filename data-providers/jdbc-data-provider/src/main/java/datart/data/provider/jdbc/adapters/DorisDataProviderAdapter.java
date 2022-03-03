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

import java.util.Collections;

public class DorisDataProviderAdapter extends JdbcDataProviderAdapter {

    @Override
    protected Dataframe executeOnSource(QueryScript script, ExecuteParam executeParam) throws Exception {
        if (CollectionUtils.isEmpty(executeParam.getOrders())) {
            executeParam.setOrders(Collections.singletonList(new OrderOperator()));
        }
        return super.executeOnSource(script, executeParam);
    }
}
