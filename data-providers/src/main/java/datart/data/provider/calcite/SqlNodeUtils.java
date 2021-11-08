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
import datart.core.data.provider.SingleTypedValue;
import datart.data.provider.base.DataProviderException;
import datart.data.provider.calcite.custom.SqlSimpleStringLiteral;
import org.apache.calcite.sql.*;
import org.apache.calcite.sql.fun.SqlStdOperatorTable;
import org.apache.calcite.sql.parser.SqlParserPos;
import org.apache.calcite.sql.type.SqlTypeName;
import org.apache.calcite.util.DateString;
import org.apache.calcite.util.TimestampString;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class SqlNodeUtils {

    public static SqlBasicCall createSqlBasicCall(SqlOperator sqlOperator, List<SqlNode> sqlNodes) {
        return new SqlBasicCall(sqlOperator, sqlNodes.toArray(new SqlNode[0]), SqlParserPos.ZERO);
    }

    public static SqlBasicCall createSqlBasicCall(SqlOperator sqlOperator,
                                                  List<SqlNode> sqlNodes,
                                                  SqlLiteral functionQualifier) {
        return new SqlBasicCall(sqlOperator, sqlNodes.toArray(new SqlNode[0]),
                SqlParserPos.ZERO,
                false,
                functionQualifier);
    }

    public static SqlIdentifier createSqlIdentifier(String name, String... names) {
        ArrayList<String> nms = new ArrayList<>();
        if (names != null) {
            nms.addAll(Arrays.asList(names));
        }
        nms.add(name);
        return new SqlIdentifier(nms, SqlParserPos.ZERO);
    }


    public static SqlNode createAliasNode(SqlNode node, String alias) {
        return createSqlBasicCall(SqlStdOperatorTable.AS, Arrays.asList(node, new SqlIdentifier(alias, SqlParserPos.ZERO)));
    }

    public static SqlNode toSingleSqlLiteral(ScriptVariable variable, SqlParserPos sqlParserPos) {
        List<SqlNode> sqlLiterals = createSqlNodes(variable, sqlParserPos);
        if (sqlLiterals.size() == 1) {
            return sqlLiterals.get(0);
        } else {
            return new SqlNodeList(sqlLiterals, sqlParserPos);
        }
    }

    public static List<SqlNode> createSqlNodes(ScriptVariable variable, SqlParserPos sqlParserPos) {
        switch (variable.getValueType()) {
            case STRING:
                return variable.getValues().stream()
                        .map(SqlSimpleStringLiteral::new)
                        .collect(Collectors.toList());
            case NUMERIC:
                return variable.getValues().stream().map(v ->
                        SqlLiteral.createExactNumeric(v, sqlParserPos)).collect(Collectors.toList());
            case BOOLEAN:
                return variable.getValues().stream().map(v ->
                        SqlLiteral.createBoolean(Boolean.parseBoolean(v), sqlParserPos)).collect(Collectors.toList());
            case DATE:
                return variable.getValues().stream().map(v ->
                        SqlLiteral.createDate(new DateString(v), sqlParserPos)).collect(Collectors.toList());
            case FRAGMENT:
                return variable.getValues().stream().map(SqlFragment::new).collect(Collectors.toList());
            default:
                throw new DataProviderException();
        }
    }

    public static SqlNode createSqlNode(SingleTypedValue value, String... names) {
        switch (value.getValueType()) {
            case STRING:
                return new SqlSimpleStringLiteral(value.getValue().toString());
            case NUMERIC:
                return SqlLiteral.createExactNumeric(value.getValue().toString(), SqlParserPos.ZERO);
            case BOOLEAN:
                return SqlLiteral.createBoolean(Boolean.parseBoolean(value.getValue().toString()), SqlParserPos.ZERO);
            case DATE:
                return SqlLiteral.createTimestamp(new TimestampString(value.getValue().toString()), 0, SqlParserPos.ZERO);
            case FRAGMENT:
                return new SqlFragment(value.getValue().toString());
            case IDENTIFIER:
                return createSqlIdentifier(value.getValue().toString(), names);
            default:
                throw new DataProviderException();
        }
    }

    public static SqlNode createSqlNode(SingleTypedValue value) {
        return createSqlNode(value, null);
    }

}
