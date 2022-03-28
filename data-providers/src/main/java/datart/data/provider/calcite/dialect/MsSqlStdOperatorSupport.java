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
package datart.data.provider.calcite.dialect;

import datart.core.data.provider.StdSqlOperator;
import org.apache.calcite.sql.SqlCall;
import org.apache.calcite.sql.SqlWriter;
import org.apache.calcite.sql.dialect.MssqlSqlDialect;

import java.util.EnumSet;

import static datart.core.data.provider.StdSqlOperator.*;
import static datart.core.data.provider.StdSqlOperator.COALESCE;

public class MsSqlStdOperatorSupport extends MssqlSqlDialect implements SqlStdOperatorSupport {

    static {
        SUPPORTED.addAll(EnumSet.of(STDDEV, ABS, MEDIAN, ABS, CEILING, FLOOR, POWER, ROUND, SQRT,
                EXP, LN, MOD, TRUNC, SIGN, ACOS, ASIN, ATAN, ATAN2, SIN, COS, TAN,
                LENGTH, CONCAT, REPLACE, SUBSTRING, LOWER, UPPER, LTRIM, RTRIM, TRIM,
                NOW, COALESCE));
    }

    public MsSqlStdOperatorSupport() {
        this(DEFAULT_CONTEXT);
    }

    private MsSqlStdOperatorSupport(Context context) {
        super(context);
    }

    @Override
    public void unparseCall(SqlWriter writer, SqlCall call, int leftPrec, int rightPrec) {
        if (isStdSqlOperator(call) && unparseStdSqlOperator(writer, call, leftPrec, rightPrec)) {
            return;
        }
        super.unparseCall(writer, call, leftPrec, rightPrec);
    }

    @Override
    public boolean unparseStdSqlOperator(SqlWriter writer, SqlCall call, int leftPrec, int rightPrec) {
        StdSqlOperator operator = symbolOf(call.getOperator().getName());
        String column = "";
        switch (operator) {
            case AGG_DATE_YEAR:
                column = call.getOperandList().get(0).toString();
                writer.print("YEAR(" + column + ")");
                return true;
            case AGG_DATE_QUARTER:
                column = call.getOperandList().get(0).toString();
                writer.print("CONCAT_WS('-',YEAR("+column+"),(month("+column+")+2)/3)");
                return true;
            case AGG_DATE_MONTH:
                column = call.getOperandList().get(0).toString();
                writer.print("FORMAT(" + column + ",'yyyy-MM')");
                return true;
            case AGG_DATE_WEEK:
                column = call.getOperandList().get(0).toString();
                writer.print("CONCAT_WS('-', YEAR("+column+"), RIGHT(100+DATEPART(ww,"+column+"),2))");
                return true;
            case AGG_DATE_DAY:
                column = call.getOperandList().get(0).toString();
                writer.print("FORMAT(" + column + ",'yyyy-MM-dd')");
                return true;
            default:
                break;
        }
        return false;
    }
}
