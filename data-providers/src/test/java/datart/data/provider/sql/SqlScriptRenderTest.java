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

package datart.data.provider.sql;

import datart.core.data.provider.QueryScript;
import datart.data.provider.ParamFactory;
import datart.data.provider.jdbc.SqlScriptRender;
import org.apache.calcite.sql.dialect.MysqlSqlDialect;
import org.apache.calcite.sql.parser.SqlParseException;
import org.junit.jupiter.api.Test;

public class SqlScriptRenderTest {


    @Test
    void testParamReplace() throws SqlParseException {

        for (QueryScript queryScriptExample : ParamFactory.getQueryScriptExamples()) {
            SqlScriptRender render = new SqlScriptRender(queryScriptExample, null, new MysqlSqlDialect(MysqlSqlDialect.DEFAULT_CONTEXT));
            String sql = render.render(false, false, false);
            System.out.println(sql);
        }

    }

}
