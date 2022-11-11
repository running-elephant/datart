package datart.data.provider.calcite.dialect;

import datart.core.data.provider.StdSqlOperator;
import org.apache.calcite.avatica.util.Casing;
import org.apache.calcite.sql.SqlCall;
import org.apache.calcite.sql.SqlNode;
import org.apache.calcite.sql.SqlWriter;
import org.apache.calcite.sql.dialect.PostgresqlSqlDialect;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentSkipListSet;

import static datart.core.data.provider.StdSqlOperator.*;
import static datart.core.data.provider.StdSqlOperator.symbolOf;

public class PostgresqlSqlDialectSupport extends PostgresqlSqlDialect implements SqlStdOperatorSupport,FetchAndOffsetSupport{

    static ConcurrentSkipListSet<StdSqlOperator> OWN_SUPPORTED = new ConcurrentSkipListSet<>(
            EnumSet.of(AGG_DATE_YEAR, AGG_DATE_QUARTER, AGG_DATE_MONTH, AGG_DATE_WEEK, AGG_DATE_DAY));

    static {
        OWN_SUPPORTED.addAll(SUPPORTED);
    }
    private PostgresqlSqlDialectSupport(Context context) { super(context); }

    public PostgresqlSqlDialectSupport() {
        this(PostgresqlSqlDialect.DEFAULT_CONTEXT.withUnquotedCasing(Casing.UNCHANGED).withUnquotedCasing(Casing.UNCHANGED));
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
        switch (operator) {
            case AGG_DATE_YEAR:
                writer.print("to_char(" + call.getOperandList().get(0).toSqlString(this).getSql() + ",'yyyy'::varchar)");
                return true;
            case AGG_DATE_QUARTER: {
                String columnName = call.getOperandList().get(0).toSqlString(this).getSql();
                writer.print("to_char(" + columnName + ",'yyyy-q'::varchar)");
                return true;
            }
            case AGG_DATE_MONTH:
                writer.print("to_char(" + call.getOperandList().get(0).toSqlString(this).getSql() + ",'yyyy-mm'::varchar)");
                return true;
            case AGG_DATE_WEEK: {
                String columnName = call.getOperandList().get(0).toSqlString(this).getSql();
                writer.print("to_char(" + columnName + ",'IYYY-IW'::varchar)");
                return true;
            }
            case AGG_DATE_DAY:
                writer.print("to_char(" + call.getOperandList().get(0).toSqlString(this).getSql() + ",'yyyy-mm-dd'::varchar)");
                return true;
            case DIVIDE:
                String left = call.getOperandList().get(0).toSqlString(this).getSql();
                String right = call.getOperandList().get(1).toSqlString(this).getSql();
                writer.print( left +" / NULLIF( " + right + ", 0)");
                return true;
            case IF:
                List<SqlNode> operandList = call.getOperandList();
                if (operandList.size() != 3) {
                    return false;
                }
                String caseWhen = "CASE WHEN " +
                        operandList.get(0).toSqlString(this).getSql() +
                        " THEN " + operandList.get(1).toSqlString(this).getSql() +
                        " ELSE " + operandList.get(2).toSqlString(this).getSql() +
                        " END ";
                writer.print(caseWhen);
                return true;
            default:
                break;
        }
        return false;
    }

    @Override
    public void unparseOffsetFetch(SqlWriter writer, SqlNode offset, SqlNode fetch) {
        unparseFetchUsingLimit(writer, offset, fetch);
    }

    @Override
    public Set<StdSqlOperator> supportedOperators() {
        return OWN_SUPPORTED;
    }


}
