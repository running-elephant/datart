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
package datart.data.provider.calcite;

import datart.data.provider.base.DataProviderException;
import org.apache.calcite.sql.*;

public class SqlValidateUtils {


    /**
     * Validate SqlNode. Only query statements can pass validation
     */
    public static boolean validateQuery(SqlNode sqlCall) {
        // check select sql
        if (sqlCall instanceof SqlSelect || sqlCall instanceof SqlOrderBy) {
            return true;
        }

        // check union
        if (sqlCall instanceof SqlBasicCall && SqlKind.UNION.equals(sqlCall.getKind())) {
            return true;
        }

        if (sqlCall instanceof SqlDdl || sqlCall instanceof SqlDelete || sqlCall instanceof SqlUpdate) {
            throw new DataProviderException("Operation (" + sqlCall.getKind() + ":" + sqlCall + ") is not allowed");
        }
        return false;
    }

}
