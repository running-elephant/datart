package datart.data.provider.script;

import datart.core.data.provider.ScriptVariable;
import datart.data.provider.base.DataProviderException;
import datart.data.provider.calcite.SqlNodeUtils;
import datart.data.provider.calcite.custom.SqlSimpleStringLiteral;
import org.apache.calcite.sql.*;
import org.apache.calcite.sql.fun.SqlLikeOperator;
import org.apache.calcite.sql.fun.SqlStdOperatorTable;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public abstract class VariablePlaceholder {

    protected final ScriptVariable variable;

    protected final SqlDialect sqlDialect;

    protected final SqlCall sqlCall;

    protected final String originalSqlFragment;

    public abstract ReplacementPair replacementPair();

    public VariablePlaceholder(ScriptVariable variable, SqlDialect sqlDialect, SqlCall sqlCall, String originalSqlFragment) {
        this.variable = variable;
        this.sqlDialect = sqlDialect;
        this.sqlCall = sqlCall;
        this.originalSqlFragment = originalSqlFragment;
    }


    protected SqlCall autoFixSqlCall() {
        //SqlNode to build a new SqlCall
        SqlOperator sqlOperator = sqlCall.getOperator();
        List<SqlNode> operandList = new ArrayList<>();

        SqlKind kind = sqlCall.getOperator().kind;

        switch (kind) {
            case GREATER_THAN:
            case GREATER_THAN_OR_EQUAL:
                reduceVariableToMin();
                replaceVariable(sqlCall);
                operandList.addAll(sqlCall.getOperandList());
                break;
            case LESS_THAN:
            case LESS_THAN_OR_EQUAL:
                reduceVariableToMax();
                replaceVariable(sqlCall);
                operandList.addAll(sqlCall.getOperandList());
                break;
            case EQUALS:
                sqlOperator = SqlStdOperatorTable.IN;
                replaceVariable(sqlCall);
                operandList.addAll(sqlCall.getOperandList());
                break;
            case NOT_EQUALS:
                sqlOperator = SqlStdOperatorTable.NOT_IN;
                replaceVariable(sqlCall);
                operandList.addAll(sqlCall.getOperandList());
                break;
            case LIKE:
                SqlLikeOperator likeOperator = (SqlLikeOperator) sqlCall.getOperator();
                if (likeOperator.isNegated()) {
                    sqlOperator = SqlStdOperatorTable.AND;
                    operandList = variable.getValues().stream().map(val -> {
                        ArrayList<SqlNode> operands = new ArrayList<>();
                        operands.add(sqlCall.getOperandList().get(0));
                        operands.add(new SqlSimpleStringLiteral(val));
                        return SqlNodeUtils
                                .createSqlBasicCall(SqlStdOperatorTable.NOT_LIKE, operands);
                    }).collect(Collectors.toList());
                } else {
                    sqlOperator = SqlStdOperatorTable.OR;

                    operandList = variable.getValues().stream().map(val -> {
                        ArrayList<SqlNode> operands = new ArrayList<>();
                        operands.add(sqlCall.getOperandList().get(0));
                        operands.add(new SqlSimpleStringLiteral(val));
                        return SqlNodeUtils
                                .createSqlBasicCall(SqlStdOperatorTable.LIKE, operands);
                    }).collect(Collectors.toList());
                }
                break;
            default:
                replaceVariable(sqlCall);
                operandList.addAll(sqlCall.getOperandList());
                break;
        }
        return SqlNodeUtils.createSqlBasicCall(sqlOperator, operandList);
    }

    protected void reduceVariableToMin() {
        String minVal;
        switch (variable.getValueType()) {
            case DATE:
            case STRING:
                minVal = variable.getValues().stream().map(Object::toString).min(String::compareTo).get();
                break;
            case NUMERIC:
                minVal = variable.getValues().stream().mapToDouble(v -> Double.parseDouble(v.toString())).min().getAsDouble() + "";
                break;
            default:
                minVal = variable.getValues().toArray()[0].toString();
        }
        variable.getValues().clear();
        variable.getValues().add(minVal);
    }

    protected void reduceVariableToMax() {
        String maxVal;
        switch (variable.getValueType()) {
            case DATE:
            case STRING:
                maxVal = variable.getValues().stream().map(Object::toString).max(String::compareTo).get();
                break;
            case NUMERIC:
                maxVal = variable.getValues().stream().mapToDouble(v -> Double.parseDouble(v.toString())).max().getAsDouble() + "";
                break;
            default:
                maxVal = variable.getValues().toArray()[0].toString();
        }
        variable.getValues().clear();
        variable.getValues().add(maxVal);
    }

    protected SqlCall createIsNullSqlCall(SqlNode sqlNode) {
        return new SqlBasicCall(SqlStdOperatorTable.IS_NULL, new SqlNode[]{sqlNode}, sqlNode.getParserPosition());
    }

    protected void replaceVariable(SqlCall sqlCall) {
        for (int i = 0; i < sqlCall.operandCount(); i++) {
            SqlNode sqlNode = sqlCall.getOperandList().get(i);
            if (sqlNode == null) {
                continue;
            }
            if (sqlNode instanceof SqlCall) {
                replaceVariable((SqlCall) sqlNode);
            } else if (sqlNode instanceof SqlIdentifier) {
                if (sqlNode.toString().equals(variable.getName())) {
                    sqlCall.setOperand(i, SqlNodeUtils.toSingleSqlLiteral(variable, sqlNode.getParserPosition()));
                }
            } else if (sqlNode instanceof SqlNodeList) {
                SqlNodeList nodeList = (SqlNodeList) sqlNode;
                List<SqlNode> otherNodes = Arrays.stream(nodeList.toArray())
                        .filter(node -> !node.toString().equals(variable.getName()))
                        .collect(Collectors.toList());

                if (otherNodes.size() == nodeList.size()) {
                    continue;
                }
                List<SqlNode> variableNodes = SqlNodeUtils.createSqlNodes(variable, sqlCall.getParserPosition());
                nodeList = new SqlNodeList(otherNodes, nodeList.getParserPosition());
                for (SqlNode node : variableNodes) {
                    nodeList.add(node);
                }
                sqlCall.setOperand(i, nodeList);
            } else {
                throw new RuntimeException("variable parse error,unexpected Sql Node " + sqlNode.toSqlString(sqlDialect));
            }
        }
    }


}