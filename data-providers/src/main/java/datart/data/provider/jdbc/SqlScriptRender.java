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

package datart.data.provider.jdbc;

import com.google.common.collect.Iterables;
import datart.core.base.consts.ValueType;
import datart.core.base.exception.Exceptions;
import datart.core.base.exception.SqlParseError;
import datart.core.common.MessageResolver;
import datart.core.common.RequestContext;
import datart.core.data.provider.ExecuteParam;
import datart.core.data.provider.QueryScript;
import datart.core.data.provider.ScriptVariable;
import datart.data.provider.base.DataProviderException;
import datart.data.provider.calcite.SqlBuilder;
import datart.data.provider.calcite.SqlNodeUtils;
import datart.data.provider.calcite.SqlParserUtils;
import datart.data.provider.calcite.SqlValidateUtils;
import datart.data.provider.freemarker.FreemarkerContext;
import datart.data.provider.script.ReplacementPair;
import datart.data.provider.script.ScriptRender;
import datart.data.provider.script.VariablePlaceholder;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.sql.SqlDialect;
import org.apache.calcite.sql.SqlNode;
import org.apache.calcite.sql.parser.SqlParseException;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.map.CaseInsensitiveMap;
import org.apache.commons.lang3.StringUtils;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static datart.core.base.consts.Const.VARIABLE_PATTERN;

@EqualsAndHashCode(callSuper = true)
@Slf4j
public class SqlScriptRender extends ScriptRender {

    public static final String TRUE_CONDITION = "1=1";

    public static final String FALSE_CONDITION = "1=0";

    public static final char SQL_SEP = ';';

    private final SqlDialect sqlDialect;

    // special sql execute permission config from datasource
    private final boolean enableSpecialSQL;

    // default all identifiers
    private final boolean quoteIdentifiers;

    public SqlScriptRender(QueryScript queryScript, ExecuteParam executeParam, SqlDialect sqlDialect) {
        this(queryScript, executeParam, sqlDialect, false);
    }

    public SqlScriptRender(QueryScript queryScript, ExecuteParam executeParam, SqlDialect sqlDialect, boolean enableSpecialSQL) {
        this(queryScript, executeParam, sqlDialect, enableSpecialSQL, true);
    }

    public SqlScriptRender(QueryScript queryScript, ExecuteParam executeParam, SqlDialect sqlDialect, boolean enableSpecialSQL, boolean quoteIdentifiers) {
        super(queryScript, executeParam);
        this.sqlDialect = sqlDialect;
        this.enableSpecialSQL = enableSpecialSQL;
        this.quoteIdentifiers = quoteIdentifiers;
    }


    public String render(boolean withExecuteParam, boolean withPage, boolean onlySelectStatement) throws SqlParseException {

        String script;

        //用freemarker处理脚本中的条件表达式
        Map<String, ?> dataMap = queryScript.getVariables()
                .stream()
                .collect(Collectors.toMap(ScriptVariable::getName,
                        variable -> {
                            if (CollectionUtils.isEmpty(variable.getValues())) {
                                return "";
                            } else if (variable.getValues().size() == 1) {
                                return variable.getValues().iterator().next();
                            } else return variable.getValues();
                        }));
        script = FreemarkerContext.process(queryScript.getScript(), dataMap);

        script = replaceFragmentVariables(script);

        final String selectSql0 = parseSelectSql(script);

        if (StringUtils.isEmpty(selectSql0)) {
            Exceptions.tr(DataProviderException.class, "message.no.valid.sql");
        }

        String selectSql = SqlNodeUtils.cleanupSql(selectSql0);

        // build with execute params
        if (withExecuteParam) {
            selectSql = SqlBuilder.builder()
                    .withExecuteParam(executeParam)
                    .withDialect(sqlDialect)
                    .withBaseSql(selectSql)
                    .withPage(withPage)
                    .withQuoteIdentifiers(quoteIdentifiers)
                    .build();
        }

        selectSql = SqlNodeUtils.cleanupSql(selectSql);

        selectSql = replaceFragmentVariables(selectSql);

        selectSql = replaceVariables(selectSql);

        selectSql = onlySelectStatement ? selectSql : script.replace(selectSql0, selectSql);

        RequestContext.setSql(selectSql);

        return selectSql;
    }


    public String replaceVariables(String selectSql) throws SqlParseException {

        if (StringUtils.isBlank(selectSql)
                || CollectionUtils.isEmpty(queryScript.getVariables())
                || !containsVariable(selectSql)) {
            return selectSql;
        }

        Map<String, ScriptVariable> variableMap = new CaseInsensitiveMap<>();

        if (CollectionUtils.isNotEmpty(queryScript.getVariables())) {
            for (ScriptVariable variable : queryScript.getVariables()) {
                variableMap.put(variable.getNameWithQuote(), variable);
            }
        }

        List<VariablePlaceholder> placeholders = null;
        try {
            placeholders = SqlParserVariableResolver.resolve(sqlDialect, selectSql, variableMap);
        } catch (SqlParseException e) {
            SqlParseError sqlParseError = new SqlParseError(e);
            sqlParseError.setSql(selectSql);
            sqlParseError.setDbType(sqlDialect.getDatabaseProduct().name());
            RequestContext.putWarning(MessageResolver.getMessage("message.provider.sql.parse.failed"), sqlParseError);
            placeholders = RegexVariableResolver.resolve(sqlDialect, selectSql, variableMap);
        }

        placeholders = placeholders.stream()
                .sorted(Comparator.comparingDouble(holder -> (holder instanceof SimpleVariablePlaceholder) ? 1000 + holder.getOriginalSqlFragment().length() : -holder.getOriginalSqlFragment().length()))
                .collect(Collectors.toList());

        if (CollectionUtils.isNotEmpty(placeholders)) {
            for (VariablePlaceholder placeholder : placeholders) {
                ReplacementPair replacementPair = placeholder.replacementPair();
                selectSql = StringUtils.replaceIgnoreCase(selectSql, replacementPair.getPattern(), replacementPair.getReplacement());
            }
        }

        return selectSql;
    }


    private String parseSelectSql(String script) {
        String selectSql = null;
        List<String> sqls = SqlSplitter.splitEscaped(script, SQL_SEP);
        for (String sql : sqls) {
            SqlNode sqlNode;
            try {
                sqlNode = parseSql(sql);
            } catch (Exception e) {
                if (SqlValidateUtils.validateQuery(sql, enableSpecialSQL)) {
                    if (selectSql != null) {
                        Exceptions.tr(DataProviderException.class, "message.provider.sql.multi.query");
                    }
                    selectSql = sql;
                }
                continue;
            }
            if (SqlValidateUtils.validateQuery(sqlNode, enableSpecialSQL)) {
                if (selectSql != null) {
                    Exceptions.tr(DataProviderException.class, "message.provider.sql.multi.query");
                }
                selectSql = sql;
            }
        }

        if (selectSql == null) {
            selectSql = sqls.get(sqls.size() - 1);
        }

        return selectSql;
    }

    private String replaceFragmentVariables(String sql) {
        // 替换脚本中的表达式类型变量
        for (ScriptVariable variable : queryScript.getVariables()) {
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

    private SqlNode parseSql(String sql) throws SqlParseException {
        return SqlParserUtils.createParser(sql, sqlDialect).parseQuery();
    }

    private boolean containsVariable(String sql) {
        if (StringUtils.isBlank(sql)) {
            return false;
        }
        return VARIABLE_PATTERN.matcher(sql).find();
    }

}
