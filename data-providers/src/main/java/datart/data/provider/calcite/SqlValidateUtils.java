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

import com.google.common.collect.Sets;
import datart.core.base.exception.Exceptions;
import datart.data.provider.base.DataProviderException;
import org.apache.calcite.sql.*;
import org.apache.commons.lang3.StringUtils;

import java.util.EnumSet;
import java.util.Set;

public class SqlValidateUtils {

    /**
     * SQL expressions that return bool values and can be replaced as 1=1 or 1=1 during processing
     */
    private static final Set<SqlKind> logicOperator = EnumSet.of(
            SqlKind.IN, SqlKind.NOT_IN,
            SqlKind.EQUALS, SqlKind.NOT_EQUALS,
            SqlKind.LESS_THAN, SqlKind.GREATER_THAN,
            SqlKind.GREATER_THAN_OR_EQUAL, SqlKind.LESS_THAN_OR_EQUAL,
            SqlKind.LIKE,
            SqlKind.BETWEEN);

    private static final Set<String> DDML = Sets.newHashSet(
            "CREATE", "DROP", "ALTER", "COMMIT", "ROLLBACK", "INSERT", "DELETE", "UPDATE", "MERGE"
    );

    /**
     * Validate SqlNode. Only query statements can pass validation
     */
    public static boolean validateQuery(SqlNode sqlCall) {
        // check select sql

        if (sqlCall.getKind().belongsTo(SqlKind.QUERY)) {
            return true;
        }

        // check union
        if (sqlCall instanceof SqlBasicCall && SqlKind.UNION.equals(sqlCall.getKind())) {
            return true;
        }

        // check sql with
        if (sqlCall instanceof SqlWith) {
            return true;
        }

        Exceptions.tr(DataProviderException.class, "message.sql.op.forbidden", sqlCall.getKind() + ":" + sqlCall);
        return false;
    }

    /**
     * filter DDL and DML sql operators
     * <p>
     * throw sql exception if sql is one kind of dml or ddl
     */
    public static void checkDMSql(String sql) {
        if (StringUtils.isBlank(sql)) {
            return;
        }
        String trim = sql.toUpperCase().trim();
        if (DDML.stream().anyMatch(trim::startsWith)) {
            Exceptions.tr(DataProviderException.class, "message.sql.op.forbidden", sql);
        }
    }

    public static boolean isLogicExpressionSqlCall(SqlCall sqlCall) {
        return sqlCall.getOperator().getKind().belongsTo(logicOperator);
    }

}
