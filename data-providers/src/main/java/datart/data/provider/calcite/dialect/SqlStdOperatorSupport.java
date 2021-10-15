package datart.data.provider.calcite.dialect;

import com.google.common.collect.ImmutableSet;
import datart.core.common.ReflectUtils;
import datart.core.data.provider.StdSqlOperator;
import datart.data.provider.base.DataProviderException;
import org.apache.calcite.sql.SqlCall;
import org.apache.calcite.sql.SqlOperator;
import org.apache.calcite.sql.SqlWriter;

import java.lang.reflect.Field;
import java.util.EnumSet;
import java.util.Set;
import java.util.concurrent.ConcurrentSkipListSet;

import static datart.core.data.provider.StdSqlOperator.*;

public interface SqlStdOperatorSupport {

    ConcurrentSkipListSet<StdSqlOperator> SUPPORTED = new ConcurrentSkipListSet<>(
            EnumSet.of(SUM, AVG, MAX, MIN, COUNT, DISTINCT,
                    ADD, SUBTRACT, MULTIPLY, DIVIDE, EQUALS, NOT_EQUALS, GREETER_THAN, GREETER_THAN_EQ, LESS_THAN, LESS_THAN_EQ));

    ConcurrentSkipListSet<StdSqlOperator> SPECIAL_FUNCTION = new ConcurrentSkipListSet<>();

    default boolean support(StdSqlOperator stdSqlOperator) {
        return SUPPORTED.contains(stdSqlOperator);
    }

    default Set<StdSqlOperator> supportedOperators() {
        return ImmutableSet.copyOf(SUPPORTED);
    }

    default Set<StdSqlOperator> unSupportedOperators() {
        EnumSet<StdSqlOperator> allFunctions = EnumSet.allOf(StdSqlOperator.class);
        allFunctions.removeAll(SUPPORTED);
        return allFunctions;
    }

    default boolean isStdSqlOperator(SqlCall sqlCall) {
        return StdSqlOperator.symbolOf(sqlCall.getOperator().getName()) != null;
    }

    boolean unparseStdSqlOperator(SqlWriter writer, SqlCall call, int leftPrec, int rightPrec);

    default void renameCallOperator(String newName, SqlCall call) {
        try {
            Field nameField = SqlOperator.class.getDeclaredField("name");
            nameField.setAccessible(true);
            nameField.set(call.getOperator(), newName);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new DataProviderException(e);
        }
    }

}
