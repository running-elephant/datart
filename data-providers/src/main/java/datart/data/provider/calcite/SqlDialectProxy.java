///*
// * Datart
// * <p>
// * Copyright 2021
// * <p>
// * Licensed under the Apache License, Version 2.0 (the "License");
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// * <p>
// * http://www.apache.org/licenses/LICENSE-2.0
// * <p>
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.
// */
//package datart.data.provider.calcite;
//
//
//import datart.core.common.ReflectUtils;
//import lombok.extern.slf4j.Slf4j;
//import net.sf.cglib.proxy.Enhancer;
//import net.sf.cglib.proxy.MethodInterceptor;
//import net.sf.cglib.proxy.MethodProxy;
//import org.apache.calcite.sql.SqlDialect;
//
//import java.lang.reflect.Method;
//
//@Slf4j
//public class SqlDialectProxy implements MethodInterceptor {
//
//    private static Method quoteStringLiteral;
//
//    static {
//        try {
//            quoteStringLiteral = SqlDialect.class.getDeclaredMethod("quoteStringLiteral", StringBuilder.class, String.class, String.class);
//        } catch (NoSuchMethodException e) {
//            log.error(e.getMessage(), e);
//        }
//    }
//
//    @Override
//    public Object intercept(Object o, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
//        if (method.equals(quoteStringLiteral)) {
//            quoteStringLiteral((SqlDialect) o, (StringBuilder) args[0], (String) args[1], (String) args[2]);
//            return null;
//        } else {
//            return methodProxy.invokeSuper(o, args);
//        }
//    }
//
//    private void quoteStringLiteral(SqlDialect sqlDialect, StringBuilder buf, String charsetName, String val) {
//        buf.append(ReflectUtils.getFieldValue(sqlDialect, "literalQuoteString"));
//        buf.append(val.replace(ReflectUtils.getFieldValue(sqlDialect, "literalEndQuoteString").toString()
//                , ReflectUtils.getFieldValue(sqlDialect, "literalEscapedQuote").toString()));
//        buf.append(ReflectUtils.getFieldValue(sqlDialect, "literalEndQuoteString"));
//    }
//
//    public static SqlDialect createSqlDialectProxy(SqlDialect sqlDialect) {
//        Enhancer enhancer = new Enhancer();
//        enhancer.setSuperclass(sqlDialect.getClass());
//        enhancer.setCallback(new SqlDialectProxy());
//        try {
//            Object context = sqlDialect.getClass().getDeclaredField("DEFAULT_CONTEXT").get(sqlDialect);
//            return (SqlDialect) enhancer.create(new Class[]{SqlDialect.Context.class}, new Object[]{context});
//        } catch (IllegalAccessException | NoSuchFieldException ignored) {
//        }
//        return null;
//    }
//
//}
