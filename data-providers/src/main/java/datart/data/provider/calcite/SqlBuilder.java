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


import datart.core.base.consts.ValueType;
import datart.core.data.provider.ExecuteParam;
import datart.core.data.provider.SingleTypedValue;
import datart.core.data.provider.sql.*;
import datart.data.provider.base.DataProviderException;
import datart.data.provider.calcite.custom.CustomSqlBetweenOperator;
import datart.data.provider.calcite.dialect.FetchAndOffsetSupport;
import org.apache.calcite.sql.*;
import org.apache.calcite.sql.fun.SqlBetweenOperator;
import org.apache.calcite.sql.fun.SqlStdOperatorTable;
import org.apache.calcite.sql.parser.SqlParseException;
import org.apache.calcite.sql.parser.SqlParserPos;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;


public class SqlBuilder {

    private static final String T = "DATART_VTABLE";

    private String srcSql;

    private final Map<String, SqlNode> functionColumnMap = new HashMap<>();

    private ExecuteParam executeParam;

    private SqlDialect dialect;

    private boolean withPage;

    private SqlBuilder() {
    }

    public static SqlBuilder builder() {
        return new SqlBuilder();
    }


    public SqlBuilder withBaseSql(String sql) {
        this.srcSql = sql;
        return this;
    }


    public SqlBuilder withExecuteParam(ExecuteParam executeParam) {
        this.executeParam = executeParam;
        return this;
    }


    public SqlBuilder withDialect(SqlDialect sqlDialect) {
        this.dialect = sqlDialect;
        return this;
    }


    public SqlBuilder withPage(boolean withPage) {
        this.withPage = withPage;
        return this;
    }


    /**
     * 根据页面操作生成的Aggregator,Filter,Group By, Order By等操作符，重新构建SQL。
     * <p>
     * SELECT [[group columns],[agg columns]] FROM (SQL) T <filters> <groups> <orders>
     */
    public String build() throws SqlParseException {

        final SqlNodeList selectList = new SqlNodeList(SqlParserPos.ZERO);

        final SqlNodeList orderBy = new SqlNodeList(SqlParserPos.ZERO);

        final SqlNodeList groupBy = new SqlNodeList(SqlParserPos.ZERO);

        SqlNode where = null;

        SqlNode having = null;

        HashMap<String, String> columnAlias = new HashMap<>();

        //function columns
        if (!CollectionUtils.isEmpty(executeParam.getFunctionColumns())) {
            for (FunctionColumn functionColumn : executeParam.getFunctionColumns()) {
                functionColumnMap.put(functionColumn.getAlias(), parseSnippet(functionColumn, T));
            }
        }

        //columns
        if (!CollectionUtils.isEmpty(executeParam.getColumns())) {
            for (String column : executeParam.getColumns()) {
                if (functionColumnMap.containsKey(column)) {
                    selectList.add(functionColumnMap.get(column));
                } else {
                    selectList.add(SqlNodeUtils.createAliasNode(SqlNodeUtils.createSqlIdentifier(column, T), column));
                }
            }
        }

        // filters
        if (!CollectionUtils.isEmpty(executeParam.getFilters())) {
            for (FilterOperator filter : executeParam.getFilters()) {
                SqlNode filterSqlNode = filterSqlNode(filter);
                if (filter.getAggOperator() != null) {
                    if (having == null) {
                        having = filterSqlNode;
                    } else {
                        having = new SqlBasicCall(SqlStdOperatorTable.AND, new SqlNode[]{having, filterSqlNode}, SqlParserPos.ZERO);
                    }
                } else {
                    if (where == null) {
                        where = filterSqlNode;
                    } else {
                        where = new SqlBasicCall(SqlStdOperatorTable.AND, new SqlNode[]{where, filterSqlNode}, SqlParserPos.ZERO);
                    }
                }
            }
        }

        // aggregators
        if (!CollectionUtils.isEmpty(executeParam.getAggregators())) {
            for (AggregateOperator aggregator : executeParam.getAggregators()) {
                String alias;
                if (aggregator.getSqlOperator() == null) {
                    alias = aggregator.getColumn();
                } else {
                    alias = aggregator.getSqlOperator().name() + "(" + aggregator.getColumn() + ")";
                }
                columnAlias.put(aggregator.getColumn(), alias);
                selectList.add(createAggNode(aggregator.getSqlOperator(), aggregator.getColumn(), alias));
            }
        }

        //group by
        if (!CollectionUtils.isEmpty(executeParam.getGroups())) {
            for (GroupByOperator group : executeParam.getGroups()) {
                SqlNode sqlNode = null;
                if (functionColumnMap.containsKey(group.getColumn())) {
                    sqlNode = functionColumnMap.get(group.getColumn());
                } else {
                    sqlNode = SqlNodeUtils.createSqlIdentifier(group.getColumn(), T);
                }
                selectList.add(sqlNode);
                groupBy.add(sqlNode);
            }
        }

        //order
        if (!CollectionUtils.isEmpty(executeParam.getOrders())) {
            for (OrderOperator order : executeParam.getOrders()) {
//                String columnName = columnAlias.containsKey(order.getColumn()) ? columnAlias.get(order.getColumn()) : order.getColumn();
                orderBy.add(createOrderNode(order));
            }
        }

        //keywords
        SqlNodeList keywordList = new SqlNodeList(SqlParserPos.ZERO);
        if (!CollectionUtils.isEmpty(executeParam.getKeywords())) {
            for (SelectKeyword keyword : executeParam.getKeywords()) {
                keywordList.add(SqlLiteral.createSymbol(SqlSelectKeyword.valueOf(keyword.name()), SqlParserPos.ZERO));
            }
        }

        SqlNode from = new SqlBasicCall(SqlStdOperatorTable.AS
                , new SqlNode[]{new SqlFragment("(" + srcSql + ")"), new SqlIdentifier(T, SqlParserPos.ZERO)}
                , SqlParserPos.ZERO);

        if (selectList.size() == 0) {
            selectList.add(SqlIdentifier.star(SqlParserPos.ZERO));
        }

        SqlNode fetch = null;
        SqlNode offset = null;
        if (withPage && (dialect instanceof FetchAndOffsetSupport) && executeParam.getPageInfo() != null) {
            fetch = SqlLiteral.createExactNumeric(executeParam.getPageInfo().getPageSize() + "", SqlParserPos.ZERO);
            offset = SqlLiteral.createExactNumeric((executeParam.getPageInfo().getPageNo() - 1) * executeParam.getPageInfo().getPageSize() + "", SqlParserPos.ZERO);
        }

        SqlSelect sqlSelect = new SqlSelect(SqlParserPos.ZERO,
                keywordList,
                selectList,
                from,
                where,
                groupBy.size() > 0 ? groupBy : null,
                having,
                null,
                orderBy.size() > 0 ? orderBy : null,
                offset,
                fetch,
                null);

        return sqlSelect.toSqlString(this.dialect).getSql();
    }

    private SqlNode createAggNode(AggregateOperator.SqlOperator sqlOperator, String column, String alias) {
        SqlOperator sqlOp = mappingSqlAggFunction(sqlOperator);
        SqlNode sqlNode;
        if (functionColumnMap.containsKey(column)) {
            sqlNode = functionColumnMap.get(column);
        } else {
            sqlNode = SqlNodeUtils.createSqlIdentifier(column, T);
        }

        SqlNode aggCall;
        if (sqlOperator == null) {
            aggCall = sqlNode;
        } else if (sqlOperator == AggregateOperator.SqlOperator.COUNT_DISTINCT) {
            aggCall = SqlNodeUtils
                    .createSqlBasicCall(sqlOp, Collections.singletonList(sqlNode),
                            SqlLiteral.createSymbol(SqlSelectKeyword.DISTINCT, SqlParserPos.ZERO));
        } else {
            aggCall = SqlNodeUtils
                    .createSqlBasicCall(sqlOp, Collections.singletonList(sqlNode));
        }

        if (StringUtils.isNotBlank(alias)) {
            return SqlNodeUtils.createAliasNode(aggCall, alias);
        } else {
            return aggCall;
        }
    }

    private SqlNode createOrderNode(OrderOperator operator) {
        SqlNode sqlNode;
        if (functionColumnMap.containsKey(operator.getColumn())) {
            sqlNode = functionColumnMap.get(operator.getColumn());
        } else {
            sqlNode = SqlNodeUtils.createSqlIdentifier(operator.getColumn(), T);
        }
        if (operator.getAggOperator() != null) {
            SqlOperator aggOperator = mappingSqlAggFunction(operator.getAggOperator());
            sqlNode = new SqlBasicCall(aggOperator,
                    new SqlNode[]{sqlNode}, SqlParserPos.ZERO);
        }
        if (operator.getOperator() == OrderOperator.SqlOperator.DESC) {
            return new SqlBasicCall(SqlStdOperatorTable.DESC,
                    new SqlNode[]{sqlNode}, SqlParserPos.ZERO);
        } else {
            return sqlNode;
        }
    }


    private SqlNode filterSqlNode(FilterOperator operator) {

        //
        SqlNode column;
        if (operator.getAggOperator() != null) {
            column = createAggNode(operator.getAggOperator(), operator.getColumn(), null);
        } else {
            column = SqlNodeUtils.createSqlIdentifier(operator.getColumn());
        }
        List<SqlNode> nodes = Arrays.stream(operator.getValues())
                .map(this::convertTypedValue)
                .collect(Collectors.toList());

        SqlNode[] sqlNodes = null;

        org.apache.calcite.sql.SqlOperator sqlOp;
        switch (operator.getSqlOperator()) {
            case IN:
                sqlOp = SqlStdOperatorTable.IN;
                sqlNodes = new SqlNode[]{column, new SqlNodeList(nodes, SqlParserPos.ZERO)};
                break;
            case NOT_IN:
                sqlOp = SqlStdOperatorTable.NOT_IN;
                sqlNodes = new SqlNode[]{column, new SqlNodeList(nodes, SqlParserPos.ZERO)};
                break;
            case EQ:
                sqlOp = SqlStdOperatorTable.EQUALS;
                sqlNodes = new SqlNode[]{column, nodes.get(0)};
                break;
            case GT:
                sqlOp = SqlStdOperatorTable.GREATER_THAN;
                sqlNodes = new SqlNode[]{column, nodes.get(0)};
                break;
            case LT:
                sqlOp = SqlStdOperatorTable.LESS_THAN;
                sqlNodes = new SqlNode[]{column, nodes.get(0)};
                break;
            case NE:
                sqlOp = SqlStdOperatorTable.NOT_EQUALS;
                sqlNodes = new SqlNode[]{column, nodes.get(0)};
                break;
            case GTE:
                sqlOp = SqlStdOperatorTable.GREATER_THAN_OR_EQUAL;
                sqlNodes = new SqlNode[]{column, nodes.get(0)};
                break;
            case LTE:
                sqlOp = SqlStdOperatorTable.LESS_THAN_OR_EQUAL;
                sqlNodes = new SqlNode[]{column, nodes.get(0)};
                break;
            case LIKE:
                operator.getValues()[0].setValue("%" + operator.getValues()[0].getValue() + "%");
                sqlOp = SqlStdOperatorTable.LIKE;
                sqlNodes = new SqlNode[]{column, convertTypedValue(operator.getValues()[0])};
                break;
            case PREFIX_LIKE:
                operator.getValues()[0].setValue(operator.getValues()[0].getValue() + "%");
                sqlOp = SqlStdOperatorTable.LIKE;
                sqlNodes = new SqlNode[]{column, convertTypedValue(operator.getValues()[0])};
                break;
            case SUFFIX_LIKE:
                operator.getValues()[0].setValue("%" + operator.getValues()[0].getValue());
                sqlOp = SqlStdOperatorTable.LIKE;
                sqlNodes = new SqlNode[]{column, convertTypedValue(operator.getValues()[0])};
                break;
            case NOT_LIKE:
                operator.getValues()[0].setValue("%" + operator.getValues()[0].getValue() + "%");
                sqlOp = SqlStdOperatorTable.NOT_LIKE;
                sqlNodes = new SqlNode[]{column, convertTypedValue(operator.getValues()[0])};
                break;
            case PREFIX_NOT_LIKE:
                operator.getValues()[0].setValue(operator.getValues()[0].getValue() + "%");
                sqlOp = SqlStdOperatorTable.NOT_LIKE;
                sqlNodes = new SqlNode[]{column, convertTypedValue(operator.getValues()[0])};
                break;
            case SUFFIX_NOT_LIKE:
                operator.getValues()[0].setValue("%" + operator.getValues()[0].getValue());
                sqlOp = SqlStdOperatorTable.NOT_LIKE;
                sqlNodes = new SqlNode[]{column, convertTypedValue(operator.getValues()[0])};
                break;
            case IS_NULL:
                sqlOp = SqlStdOperatorTable.IS_NULL;
                sqlNodes = new SqlNode[]{column};
                break;
            case NOT_NULL:
                sqlOp = SqlStdOperatorTable.IS_NOT_NULL;
                sqlNodes = new SqlNode[]{column};
                break;
            case BETWEEN:
                sqlOp = new CustomSqlBetweenOperator(
                        SqlBetweenOperator.Flag.ASYMMETRIC,
                        false);
                nodes.add(0, column);
                sqlNodes = nodes.toArray(new SqlNode[0]);
                break;
            case NOT_BETWEEN:
                sqlOp = new CustomSqlBetweenOperator(
                        SqlBetweenOperator.Flag.ASYMMETRIC,
                        true);
                nodes.add(0, column);
                sqlNodes = nodes.toArray(new SqlNode[0]);
                break;
            default:
                throw new DataProviderException("Unsupported filtering operation :" + operator);
        }
        return new SqlBasicCall(sqlOp, sqlNodes, SqlParserPos.ZERO);
    }

    private SqlNode parseSnippet(FunctionColumn column, String tableName) throws SqlParseException {
        SqlSelect sqlSelect = (SqlSelect) SqlParserUtils.parseSnippet(column.getSnippet());
        SqlNode sqlNode = sqlSelect.getSelectList().get(0);
        if (!(sqlNode instanceof SqlCall)) {
            return sqlNode;
        }
        completionIdentifier((SqlCall) sqlNode, tableName);
        return sqlNode;
    }

    private void completionIdentifier(SqlCall call, String tableName) {
        List<SqlNode> operandList = call.getOperandList();
        for (int i = 0; i < operandList.size(); i++) {
            SqlNode sqlNode = operandList.get(i);
            if (sqlNode instanceof SqlIdentifier) {
                SqlIdentifier identifier = (SqlIdentifier) sqlNode;
                if (identifier.names.size() == 1) {
                    call.setOperand(i, SqlNodeUtils.createSqlIdentifier(identifier.names.get(0), tableName));
                }
            } else if (sqlNode instanceof SqlCall) {
                completionIdentifier((SqlCall) sqlNode, tableName);
            }
        }
    }

    private SqlNode convertTypedValue(SingleTypedValue typedValue) {
        if (typedValue.getValueType().equals(ValueType.SNIPPET) && functionColumnMap.containsKey(typedValue.getValue().toString())) {
            return functionColumnMap.get(typedValue.getValue().toString());
        }
        return SqlNodeUtils.createSqlNode(typedValue, T);
    }

    private SqlAggFunction mappingSqlAggFunction(AggregateOperator.SqlOperator sqlOperator) {
        if (sqlOperator == null) {
            return null;
        }
        switch (sqlOperator) {
            case AVG:
                return SqlStdOperatorTable.AVG;
            case MAX:
                return SqlStdOperatorTable.MAX;
            case MIN:
                return SqlStdOperatorTable.MIN;
            case SUM:
                return SqlStdOperatorTable.SUM;
            case COUNT:
            case COUNT_DISTINCT:
                return SqlStdOperatorTable.COUNT;
            default:
                throw new DataProviderException("Unsupported aggregation operation: " + sqlOperator);
        }
    }


}
