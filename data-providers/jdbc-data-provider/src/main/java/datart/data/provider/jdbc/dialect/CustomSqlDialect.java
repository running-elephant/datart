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

package datart.data.provider.jdbc.dialect;

import datart.core.common.BeanUtils;
import datart.data.provider.base.JdbcDriverInfo;
import org.apache.calcite.avatica.util.Casing;
import org.apache.calcite.config.NullCollation;
import org.apache.calcite.sql.SqlDialect;
import org.apache.calcite.sql.validate.SqlConformanceEnum;

public class CustomSqlDialect extends SqlDialect {
    private CustomSqlDialect(Context context) {
        super(context);
    }

    public static CustomSqlDialect create(JdbcDriverInfo driverInfo) {

        BeanUtils.validate(driverInfo);

        SqlDialect.Context context = SqlDialect.EMPTY_CONTEXT
                .withDatabaseProductName(driverInfo.getName())
                .withDatabaseVersion(driverInfo.getVersion())
                .withConformance(SqlConformanceEnum.LENIENT)
                .withIdentifierQuoteString(driverInfo.getIdentifierQuote())
                .withLiteralQuoteString(driverInfo.getLiteralQuote())
                .withUnquotedCasing(Casing.UNCHANGED)
                .withNullCollation(NullCollation.LOW);
        return new CustomSqlDialect(context);
    }


}
