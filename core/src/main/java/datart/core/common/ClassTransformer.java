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

package datart.core.common;

import org.apache.ibatis.javassist.ClassPool;
import org.apache.ibatis.javassist.CtClass;
import org.apache.ibatis.javassist.CtMethod;

public class ClassTransformer {

    public static void transform() {
        transformSqlWriter();
        transformFlyway();
    }

    private static void transformSqlWriter() {
        try {
            ClassPool classPool = ClassPool.getDefault();
            CtClass ctClass = classPool.get("org.apache.calcite.sql.pretty.SqlPrettyWriter");
            CtMethod keyword = ctClass.getDeclaredMethod("keyword");
            keyword.setBody("{    maybeWhitespace($1);" +
                    "    buf.append($1);" +
                    "    if (!$1.equals(\"\")) {" +
                    "      setNeedWhitespace(needWhitespaceAfter($1));" +
                    "    } " +
                    "return;} ");
            ctClass.toClass();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void transformFlyway() {
        try {
            ClassPool classPool = ClassPool.getDefault();
            CtClass ctClass = classPool.get("org.flywaydb.core.internal.database.mysql.MySQLConnection");
            CtMethod getIntVariableValue = ctClass.getDeclaredMethod("getIntVariableValue");
            getIntVariableValue.setBody("return 0;");

            CtMethod doRestoreOriginalState = ctClass.getDeclaredMethod("doRestoreOriginalState");
            doRestoreOriginalState.setBody("return;");

            CtMethod hasUserVariableResetCapability = ctClass.getDeclaredMethod("hasUserVariableResetCapability");
            hasUserVariableResetCapability.setBody("{return false;}");
            ctClass.toClass();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
