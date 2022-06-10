///*
// * Datart
// * <p>
// * Copyright 2021
// * <p>
// * Licensed under the Apache License, Version 2.0 (the "License");
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// * <p>
// * http://www.apache.org/licenses/LICENSE-2.0
// * <p>
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.
// */
//package datart.data.provider.calcite;
//
//
//import com.alibaba.fastjson.JSON;
//import datart.core.base.consts.ValueType;
//import datart.core.base.exception.Exceptions;
//import datart.core.data.provider.SingleTypedValue;
//import datart.core.data.provider.sql.FilterOperator;
//import datart.data.provider.base.dto.SimpleViewConfig;
//import datart.data.provider.base.dto.SimpleViewJoinDto;
//import org.apache.calcite.sql.*;
//import org.apache.calcite.sql.fun.SqlStdOperatorTable;
//import org.apache.calcite.sql.parser.SqlParseException;
//import org.apache.calcite.sql.parser.SqlParserPos;
//import org.apache.commons.collections4.CollectionUtils;
//import org.apache.commons.lang3.StringUtils;
//
//import java.util.Arrays;
//import java.util.List;
//import java.util.stream.Collectors;
//
//
//public class ViewSqlBuilder {
//
//    private String script;
//
//    private SqlDialect dialect;
//
//    private ViewSqlBuilder() {
//    }
//
//    public static ViewSqlBuilder builder() {
//        return new ViewSqlBuilder();
//    }
//
//    public ViewSqlBuilder withScript(String script) {
//        this.script = script;
//        return this;
//    }
//
//    public ViewSqlBuilder withDialect(SqlDialect sqlDialect) {
//        this.dialect = sqlDialect;
//        return this;
//    }
//
//
//    public String build() throws SqlParseException {
//        if (StringUtils.isBlank(script)) {
//            return "";
//        }
//        SimpleViewConfig simpleViewConfig = JSON.parseObject(script, SimpleViewConfig.class);
//
//        SqlNodeList selectList = new SqlNodeList(SqlParserPos.ZERO);
//        selectList.add(SqlNodeUtils.createSqlIdentifier(""));
//
//        SqlNode joinSqlNode = createJoinSqlNode(simpleViewConfig);
//        SqlSelect sqlSelect = new SqlSelect(SqlParserPos.ZERO,
//                null,
//                selectList,
//                joinSqlNode,
//                null,
//                null,
//                null,
//                null,
//                null,
//                null,
//                null,
//                null);
//        return sqlSelect.toSqlString(dialect).getSql();
//    }
//
//    private SqlNode createJoinSqlNode(SimpleViewConfig config) {
//        if (StringUtils.isBlank(config.getMainTable())) {
//            return null;
//        }
//        SqlNode sqlNode = null;
//        sqlNode = SqlNodeUtils.createSqlNode(new SingleTypedValue(config.getMainTable(), ValueType.IDENTIFIER));
//        if (CollectionUtils.isEmpty(config.getJoinTables())) {
//            return sqlNode;
//        }
//        for (SimpleViewJoinDto joinTable : config.getJoinTables()) {
//            SqlNode conditionNode = createConditionSqlNode(joinTable.getConditions());
//            sqlNode = new SqlJoin(SqlParserPos.ZERO,
//                    sqlNode,
//                    SqlLiteral.createBoolean(false,SqlParserPos.ZERO),
//                    SqlLiteral.createSymbol(joinTable.getJoinType(), SqlParserPos.ZERO),
//                    SqlNodeUtils.createSqlNode(new SingleTypedValue(joinTable.getTableName(),ValueType.IDENTIFIER)),
//                    SqlLiteral.createSymbol(JoinConditionType.ON, SqlParserPos.ZERO),
//                    conditionNode);
//        }
//        return sqlNode;
//    }
//
//    private SqlNode createConditionSqlNode(List<FilterOperator> conditions) {
//        if (CollectionUtils.isEmpty(conditions)) {
//            return null;
//        }
//        SqlNode on = null;
//        for (FilterOperator condition : conditions) {
//            SqlNode sqlNode = conditionSqlNode(condition);
//            if (on == null) {
//                on = sqlNode;
//            } else {
//                on = new SqlBasicCall(SqlStdOperatorTable.AND, new SqlNode[]{on, sqlNode}, SqlParserPos.ZERO);
//            }
//        }
//        return on;
//    }
//
//    private SqlNode conditionSqlNode(FilterOperator operator) {
//        SqlNode column = null;
//        if (StringUtils.isNotBlank(operator.getTablePrefix())) {
//            column = SqlNodeUtils.createSqlIdentifier(operator.getColumnNames(), operator.getTablePrefix());
//        } else {
//            column = SqlNodeUtils.createSqlIdentifier(operator.getColumnNames());
//        }
//        List<SqlNode> nodes = Arrays.stream(operator.getValues())
//                .map(this::convertTypedValue)
//                .collect(Collectors.toList());
//        SqlNode[] sqlNodes = null;
//        org.apache.calcite.sql.SqlOperator sqlOp = null;
//        switch (operator.getSqlOperator()) {
//            case EQ:
//                sqlOp = SqlStdOperatorTable.EQUALS;
//                sqlNodes = new SqlNode[]{column, nodes.get(0)};
//                break;
//            case GT:
//                sqlOp = SqlStdOperatorTable.GREATER_THAN;
//                sqlNodes = new SqlNode[]{column, nodes.get(0)};
//                break;
//            case LT:
//                sqlOp = SqlStdOperatorTable.LESS_THAN;
//                sqlNodes = new SqlNode[]{column, nodes.get(0)};
//                break;
//            case NE:
//                sqlOp = SqlStdOperatorTable.NOT_EQUALS;
//                sqlNodes = new SqlNode[]{column, nodes.get(0)};
//                break;
//            case GTE:
//                sqlOp = SqlStdOperatorTable.GREATER_THAN_OR_EQUAL;
//                sqlNodes = new SqlNode[]{column, nodes.get(0)};
//                break;
//            case LTE:
//                sqlOp = SqlStdOperatorTable.LESS_THAN_OR_EQUAL;
//                sqlNodes = new SqlNode[]{column, nodes.get(0)};
//                break;
//            default:
//                Exceptions.msg("message.provider.sql.type.unsupported", operator.getSqlOperator().name());
//        }
//        return new SqlBasicCall(sqlOp, sqlNodes, SqlParserPos.ZERO);
//    }
//
//    private SqlNode convertTypedValue(SingleTypedValue typedValue) {
//        if (typedValue.getValueType().equals(ValueType.IDENTIFIER) && StringUtils.isNotBlank(typedValue.getTablePrefix())) {
//            return SqlNodeUtils.createSqlNode(typedValue, typedValue.getTablePrefix());
//        }
//        return SqlNodeUtils.createSqlNode(typedValue);
//    }
//
//}
