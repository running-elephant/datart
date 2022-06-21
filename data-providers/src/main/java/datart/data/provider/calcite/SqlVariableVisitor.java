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

import datart.core.data.provider.ScriptVariable;
import datart.data.provider.jdbc.SimpleVariablePlaceholder;
import datart.data.provider.script.VariablePlaceholder;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.sql.*;
import org.apache.calcite.sql.util.SqlBasicVisitor;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.*;

@Slf4j
public class SqlVariableVisitor extends SqlBasicVisitor<Object> {

    private final List<VariablePlaceholder> variablePlaceholders = new LinkedList<>();

    private final String variableQuote;

    private final Map<String, ScriptVariable> variableMap;

    private final SqlDialect sqlDialect;

    private final String srcSql;

    private SqlCall currentLogicExpressionCall;

    private final Set<SqlNode> parsedVariable = new HashSet<>();

    public SqlVariableVisitor(SqlDialect sqlDialect, String srcSql, String variableQuote, Map<String, ScriptVariable> variableMap) {
        this.srcSql = srcSql;
        this.sqlDialect = sqlDialect;
        this.variableQuote = variableQuote;
        this.variableMap = variableMap;
    }

    @Override
    public Object visit(SqlCall sqlCall) {
        if (SqlValidateUtils.isLogicExpressionSqlCall(sqlCall)) {
            currentLogicExpressionCall = sqlCall;
        }
        SqlOperator operator = sqlCall.getOperator();
        Set<SqlIdentifier> variableIdentifiers = findVariableNode(sqlCall);
        if (CollectionUtils.isNotEmpty(variableIdentifiers)) {
            createVariablePlaceholders(currentLogicExpressionCall, variableIdentifiers);
            currentLogicExpressionCall = null;
        }
        return operator.acceptCall(this, sqlCall);
    }

    private Set<SqlIdentifier> findVariableNode(SqlCall sqlCall) {

        Set<SqlIdentifier> variables = new HashSet<>();

        for (SqlNode sqlNode : sqlCall.getOperandList()) {
            if (sqlNode instanceof SqlIdentifier) {
                if (isScriptVariable(sqlNode.toString()) && !parsedVariable.contains(sqlNode)) {
                    variables.add((SqlIdentifier) sqlNode);
                    parsedVariable.add(sqlNode);
                }
            } else if (sqlNode instanceof SqlNodeList) {
                for (SqlNode node : (SqlNodeList) sqlNode) {
                    if (node instanceof SqlIdentifier) {
                        if (isScriptVariable(node.toString()) && !parsedVariable.contains(sqlNode)) {
                            variables.add((SqlIdentifier) node);
                            parsedVariable.add(node);
                        }
                    }
                }
            }
        }
        return variables;
    }

    private boolean isScriptVariable(String node) {
        return node.startsWith(variableQuote) && node.endsWith(variableQuote);
    }

    public List<VariablePlaceholder> getVariablePlaceholders() {

        if (CollectionUtils.isNotEmpty(variablePlaceholders)) {
            variablePlaceholders.sort(Comparator.comparingInt(VariablePlaceholder::getStartPos));
        }
        return variablePlaceholders;
    }

    private void createVariablePlaceholders(SqlCall logicExpressionCall, Set<SqlIdentifier> variableIdentifier) {

        if (logicExpressionCall == null) {
            if (CollectionUtils.isEmpty(variableIdentifier)) {
                return;
            }
            for (SqlIdentifier identifier : variableIdentifier) {
                ScriptVariable variable = variableMap.get(identifier.toString());
                if (variable != null) {
                    int startIndex = identifier.getParserPosition().getColumnNum();
                    int endIndex = identifier.getParserPosition().getEndColumnNum();
                    String originalSqlFragment = srcSql.substring(startIndex - 1, endIndex).trim();
                    variablePlaceholders.add(new SimpleVariablePlaceholder(variable, sqlDialect, originalSqlFragment));
                }
            }
            return;
        }

        logicExpressionCall = SpecialSqlCallConverter.convert(logicExpressionCall);
        int startIndex = logicExpressionCall.getParserPosition().getColumnNum();
        int endIndex = logicExpressionCall.getParserPosition().getEndColumnNum();
        // 处理calcite不把左右括号算进index，导致的index错位问题
        System.out.println(srcSql.charAt(startIndex - 1));
        System.out.println(srcSql.charAt(startIndex));
        if (startIndex > 1 && srcSql.charAt(startIndex - 2) == '(') {
            startIndex = startIndex - 1;
        }
        if (endIndex < srcSql.length() && srcSql.charAt(endIndex) == ')') {
            endIndex = endIndex + 1;
        }
        String originalSqlFragment = srcSql.substring(startIndex - 1, endIndex).trim();

        List<ScriptVariable> variables = new LinkedList<>();
        for (SqlIdentifier identifier : variableIdentifier) {
            ScriptVariable variable = variableMap.get(identifier.toString());
            if (variable != null) {
                variables.add(variable);
            }
            if (!StringUtils.containsIgnoreCase(originalSqlFragment, identifier.toString())) {
                variablePlaceholders.add(new SimpleVariablePlaceholder(variable, sqlDialect, identifier.toString()));
            }
        }
        variablePlaceholders.add(new VariablePlaceholder(variables, sqlDialect, logicExpressionCall, originalSqlFragment));
    }

}
