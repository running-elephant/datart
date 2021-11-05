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
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.Set;

public class OracleDataProviderAdapter extends JdbcDataProviderAdapter {

    @Override
    public Set<String> readAllDatabases() {
        return Collections.singleton(jdbcProperties.getUser());
    }


    @Override
    protected Dataframe parseResultSet(ResultSet rs, long count) throws SQLException {

        return super.parseResultSet(rs, count);
    }
}
