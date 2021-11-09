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

import org.apache.calcite.sql.SqlCall;
import org.apache.calcite.sql.SqlFunction;
import org.apache.calcite.sql.SqlOperator;
import org.apache.calcite.sql.fun.SqlStdOperatorTable;
import org.apache.calcite.sql.util.SqlBasicVisitor;

public class SqlFunctionRegisterVisitor extends SqlBasicVisitor<Object> {

    @Override
    public Object visit(SqlCall call) {
        SqlOperator operator = call.getOperator();
        if (operator instanceof SqlFunction) {
            registerIfNotExists(operator);
        }
        return operator.acceptCall(this, call);
    }

    private void registerIfNotExists(SqlOperator sqlFunction) {
        SqlStdOperatorTable.instance().register(sqlFunction);
    }

}
