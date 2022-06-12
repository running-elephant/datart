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

package datart.data.provider.script;

import com.google.common.collect.Iterables;
import datart.core.base.consts.ValueType;
import datart.core.base.exception.Exceptions;
import datart.core.data.provider.ScriptVariable;
import datart.data.provider.base.DataProviderException;
import datart.data.provider.jdbc.SqlSplitter;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.CharUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class SqlStringUtils {

    public static final String REG_SQL_SINGLE_LINE_COMMENT = "-{2,}.*([\r\n])";

    public static final String REG_SQL_MULTI_LINE_COMMENT = "/\\*+[\\s\\S]*\\*+/";

    /**
     * 替换脚本中的表达式类型变量
     *
     * @param sql       原始SQL
     * @param variables 变量
     * @return 替换后的SQL
     */
    public static String replaceFragmentVariables(String sql, List<ScriptVariable> variables) {
        if (CollectionUtils.isEmpty(variables)) {
            return sql;
        }
        for (ScriptVariable variable : variables) {
            if (ValueType.FRAGMENT.equals(variable.getValueType())) {
                int size = Iterables.size(variable.getValues());
                if (size != 1) {
                    Exceptions.tr(DataProviderException.class, "message.provider.variable.expression.size", size + ":" + variable.getValues());
                }
                sql = sql.replace(variable.getNameWithQuote(), Iterables.get(variable.getValues(), 0));
            }
        }
        return sql;
    }

    /**
     * 移除SQL末尾的分号
     *
     * @param sql 原始SQL
     * @return 移除末尾分号的SQL
     */
    public static String removeEndDelimiter(String sql) {
        if (StringUtils.isBlank(sql)) {
            return sql;
        }
        sql = sql.trim();
        sql = StringUtils.removeEnd(sql, SqlSplitter.DEFAULT_DELIMITER + "");
        sql = sql.trim();
        if (sql.endsWith(SqlSplitter.DEFAULT_DELIMITER + "")) {
            return removeEndDelimiter(sql);
        } else {
            return sql;
        }
    }

    public static String cleanupSql(String sql) {
        sql = sql.replaceAll(REG_SQL_SINGLE_LINE_COMMENT, " ");
        sql = sql.replaceAll(REG_SQL_MULTI_LINE_COMMENT, " ");
        sql = sql.replace(CharUtils.CR, CharUtils.toChar(" "));
        sql = sql.replace(CharUtils.LF, CharUtils.toChar(" "));
        return sql.trim();
    }

}
