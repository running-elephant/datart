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

import datart.core.base.consts.VariableTypeEnum;
import datart.core.common.ReflectUtils;
import datart.core.data.provider.ScriptVariable;
import datart.data.provider.jdbc.PermissionVariablePlaceholder;
import datart.data.provider.jdbc.QueryVariablePlaceholder;
import datart.data.provider.jdbc.TrueVariablePlaceholder;
import datart.data.provider.script.VariablePlaceholder;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.avatica.util.Casing;
import org.apache.calcite.sql.*;
import org.apache.calcite.sql.util.SqlBasicVisitor;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Slf4j
public class SqlVariableVisitor extends SqlBasicVisitor<Object> {

    private final List<VariablePlaceholder> variablePlaceholders = new LinkedList<>();

    private final String variableQuote;

    private final Map<String, ScriptVariable> variableMap;

    private final SqlDialect sqlDialect;

    private final String srcSql;

    public SqlVariableVisitor(SqlDialect sqlDialect, String srcSql, String variableQuote, Map<String, ScriptVariable> variableMap) {
        this.srcSql = srcSql;
        this.sqlDialect = sqlDialect;
        this.variableQuote = variableQuote;
        this.variableMap = variableMap;
    }

    @Override
    public Object visit(SqlCall call) {
        SqlOperator operator = call.getOperator();
        if (findVariableIdentifier(call)) {
            return null;
        }
        return operator.acceptCall(this, call);
    }


    private boolean findVariableIdentifier(SqlCall sqlCall) {
        for (SqlNode sqlNode : sqlCall.getOperandList()) {
            if (sqlNode instanceof SqlIdentifier) {
                if (isScriptVariable(sqlNode.toString())) {
                    variablePlaceholders.add(createVariablePlaceholder(sqlCall, sqlNode.toString()));
                    return true;
                }
            } else if (sqlNode instanceof SqlNodeList) {
                for (SqlNode node : (SqlNodeList) sqlNode) {
                    if (node instanceof SqlIdentifier) {
                        if (isScriptVariable(node.toString())) {
                            variablePlaceholders.add(createVariablePlaceholder(sqlCall, node.toString()));
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    private boolean isScriptVariable(String node) {
        return node.startsWith(variableQuote) && node.endsWith(variableQuote);
    }

    public List<VariablePlaceholder> getVariablePlaceholders() {
        return variablePlaceholders;
    }

    private VariablePlaceholder createVariablePlaceholder(SqlCall sqlCall, String variableName) {
        int startIndex = sqlCall.getOperandList().get(0).getParserPosition().getColumnNum();
        int endIndex = sqlCall.getOperandList().get(sqlCall.operandCount() - 1).getParserPosition().getEndColumnNum();
        String originalSqlFragment = srcSql.substring(startIndex - 1, endIndex).trim();
        ScriptVariable variable = null;
        for (String key : variableMap.keySet()) {
            if (key.equalsIgnoreCase(variableName)) {
                variable = variableMap.get(key);
            }
        }

        if (variable == null) {
            return new TrueVariablePlaceholder(originalSqlFragment);
        }

        variable.setName(variableName);
        if (VariableTypeEnum.PERMISSION.equals(variable.getType())) {
            return new PermissionVariablePlaceholder(variable, sqlDialect, sqlCall, originalSqlFragment);
        } else {
            return new QueryVariablePlaceholder(variable, sqlDialect, sqlCall, originalSqlFragment);
        }
    }

}
