package datart.data.provider.calcite.dialect;

import org.apache.calcite.sql.SqlCall;
import org.apache.calcite.sql.SqlWriter;
import org.apache.calcite.sql.dialect.MssqlSqlDialect;
import org.springframework.stereotype.Component;

import java.util.EnumSet;

import static datart.core.data.provider.StdSqlOperator.*;
import static datart.core.data.provider.StdSqlOperator.COALESCE;

@Component
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
    public boolean unparseStdSqlOperator(SqlWriter writer, SqlCall call, int leftPrec, int rightPrec) {
        return false;
    }
}
