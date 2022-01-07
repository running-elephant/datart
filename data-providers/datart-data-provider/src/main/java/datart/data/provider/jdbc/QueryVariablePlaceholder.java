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

package datart.data.provider.jdbc;

import datart.core.data.provider.ScriptVariable;
import datart.data.provider.calcite.SqlNodeUtils;
import datart.data.provider.script.ReplacementPair;
import datart.data.provider.script.VariablePlaceholder;
import org.apache.calcite.sql.SqlCall;
import org.apache.calcite.sql.SqlDialect;
import org.springframework.util.CollectionUtils;

public class QueryVariablePlaceholder extends VariablePlaceholder {

    public QueryVariablePlaceholder(ScriptVariable variable, SqlDialect sqlDialect, SqlCall sqlCall, String originalSqlFragment) {
        super(variable, sqlDialect, sqlCall, originalSqlFragment);
    }

    @Override
    public ReplacementPair replacementPair() {
        if (CollectionUtils.isEmpty(variable.getValues())) {
            SqlCall isNullSqlCall = createIsNullSqlCall(sqlCall.getOperandList().get(0));
            return new ReplacementPair(originalSqlFragment, SqlNodeUtils.toSql(isNullSqlCall, sqlDialect));
        }
        if (variable.getValues().size() == 1) {
            replaceVariable(sqlCall);
            return new ReplacementPair(originalSqlFragment, SqlNodeUtils.toSql(sqlCall, sqlDialect));
        }
        SqlCall fixedCall = autoFixSqlCall();
        return new ReplacementPair(originalSqlFragment, SqlNodeUtils.toSql(fixedCall, sqlDialect));
    }
}
