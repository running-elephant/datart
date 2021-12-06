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

import datart.core.base.consts.Const;
import datart.core.data.provider.ScriptVariable;
import datart.data.provider.calcite.SqlNodeUtils;
import datart.data.provider.script.ReplacementPair;
import datart.data.provider.script.VariablePlaceholder;
import org.apache.calcite.sql.SqlCall;
import org.apache.calcite.sql.SqlDialect;
import org.springframework.util.CollectionUtils;

import java.io.Serializable;

public class PermissionVariablePlaceholder extends VariablePlaceholder {

    public PermissionVariablePlaceholder(ScriptVariable variable, SqlDialect sqlDialect, SqlCall sqlCall, String originalSqlFragment) {
        super(variable, sqlDialect, sqlCall, originalSqlFragment);
    }

    @Override
    public ReplacementPair replacementPair() {

        if (CollectionUtils.isEmpty(variable.getValues())) {
            return new ReplacementPair(originalSqlFragment, SqlScriptRender.FALSE_CONDITION);
        }

        for (Serializable value : variable.getValues()) {
            if (Const.ALL_PERMISSION.equals(value.toString())) {
                return new ReplacementPair(originalSqlFragment, SqlScriptRender.TRUE_CONDITION);
            }
        }

        if (variable.getValues().size() == 1) {
            replaceVariable(sqlCall);

            return new ReplacementPair(originalSqlFragment, SqlNodeUtils.toSql(sqlCall, sqlDialect));
        }

        //权限变量为多值，需要解析SQL条件表达式，根据权限变量值修改关系运算符
        SqlCall fixSqlCall = autoFixSqlCall();

        return new ReplacementPair(originalSqlFragment, SqlNodeUtils.toSql(fixSqlCall, sqlDialect));

    }


}
