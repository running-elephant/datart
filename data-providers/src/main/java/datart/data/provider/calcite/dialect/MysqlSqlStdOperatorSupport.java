package datart.data.provider.calcite.dialect;

import datart.core.data.provider.StdSqlOperator;
import org.apache.calcite.sql.SqlCall;
import org.apache.calcite.sql.SqlWriter;
import org.apache.calcite.sql.dialect.MysqlSqlDialect;
import org.springframework.stereotype.Component;

import java.util.EnumSet;

import static datart.core.data.provider.StdSqlOperator.*;

@Component
public class MysqlSqlStdOperatorSupport extends MysqlSqlDialect implements SqlStdOperatorSupport {

    static {
        SUPPORTED.addAll(EnumSet.of(STDDEV, ABS, CEILING, FLOOR, POWER, ROUND, SQRT, EXP, LOG10, LN, MOD, RAND, DEGREES, RADIANS, TRUNC, SIGN,
                ACOS, ASIN, ATAN, ATAN2, SIN, COS, TAN, COT, LENGTH, CONCAT, REPLACE, SUBSTRING, LOWER, UPPER, LTRIM, RTRIM, TRIM,
                NOW, DAY, SECOND, MINUTE, HOUR, DAY, WEEK, QUARTER, MONTH, YEAR, DAY_OF_WEEK, DAY_OF_MONTH, DAY_OF_YEAR,
                IF, COALESCE));
    }

    public MysqlSqlStdOperatorSupport() {
        this(DEFAULT_CONTEXT);
    }

    private MysqlSqlStdOperatorSupport(Context context) {
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
            case TRUNC:
                renameCallOperator("TRUNCATE", call);
                break;
            case DAY_OF_MONTH:
                renameCallOperator("DAYOFMONTH", call);
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
