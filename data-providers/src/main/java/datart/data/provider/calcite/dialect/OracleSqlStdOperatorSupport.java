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
import org.apache.calcite.sql.dialect.OracleSqlDialect;
import org.springframework.stereotype.Component;

import java.util.EnumSet;

import static datart.core.data.provider.StdSqlOperator.*;

@Component
public class OracleSqlStdOperatorSupport extends OracleSqlDialect implements SqlStdOperatorSupport {

    static {
        SUPPORTED.addAll(EnumSet.of(STDDEV, ABS, CEILING, FLOOR, POWER, ROUND, SQRT, EXP, LOG10, RAND, DEGREES, RADIANS,
                SIGN, ACOS, ASIN, ATAN, ATAN2, SIN, COS, TAN, COT, LENGTH, CONCAT, REPLACE, SUBSTRING, LOWER, UPPER, LTRIM, RTRIM, TRIM,
                NOW));
    }

    public OracleSqlStdOperatorSupport() {
        this(DEFAULT_CONTEXT);
    }

    private OracleSqlStdOperatorSupport(Context context) {
        super(context);
    }

    @Override
    public void unparseCall(SqlWriter writer, SqlCall call, int leftPrec, int rightPrec) {
        if (isStdSqlOperator(call)) {
            if (unparseStdSqlOperator(writer, call, leftPrec, rightPrec)) {
                return;
            }
        }
        super.unparseCall(writer, call, leftPrec, rightPrec);
    }

    @Override
    public boolean unparseStdSqlOperator(SqlWriter writer, SqlCall call, int leftPrec, int rightPrec) {
        StdSqlOperator operator = symbolOf(call.getOperator().getName());
        switch (operator) {
            case NOW: //
                break;
            default:
                return false;
        }
        super.unparseCall(writer, call, leftPrec, rightPrec);
        return true;
    }

    @Override
    public void quoteStringLiteral(StringBuilder buf, String charsetName, String val) {
        buf.append(literalQuoteString);
        buf.append(val.replace(literalEndQuoteString, literalEscapedQuote));
        buf.append(literalEndQuoteString);
    }
}