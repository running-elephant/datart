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

import datart.core.data.provider.ExecuteParam;
import datart.core.data.provider.QueryScript;
import datart.core.data.provider.ScriptVariable;
import datart.data.provider.base.DataProviderException;
import datart.data.provider.calcite.SqlBuilder;
import datart.data.provider.calcite.SqlValidateUtils;
import datart.data.provider.calcite.SqlParserUtils;
import datart.data.provider.calcite.SqlVariableVisitor;
import datart.data.provider.calcite.parser.impl.SqlParserImpl;
import datart.data.provider.freemarker.FreemarkerContext;
import datart.data.provider.local.LocalDB;
import datart.data.provider.script.ReplacementPair;
import datart.data.provider.script.ScriptRender;
import datart.data.provider.script.VariablePlaceholder;
import lombok.EqualsAndHashCode;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.config.Lex;
import org.apache.calcite.sql.SqlDialect;
import org.apache.calcite.sql.SqlNode;
import org.apache.calcite.sql.parser.SqlParseException;
import org.apache.calcite.sql.parser.SqlParser;
import org.apache.calcite.sql.validate.SqlConformanceEnum;
import org.apache.commons.lang3.CharUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@EqualsAndHashCode(callSuper = true)
@Slf4j
public class SqlScriptRender extends ScriptRender {

    public static final String TRUE_CONDITION = "1=1";

    public static final String FALSE_CONDITION = "1=0";

    public static final char SQL_SEP = ';';

    public static final String REG_SQL_SINGLE_LINE_COMMENT = "--.*\\n";

    public static final String REG_SQL_MULTI_LINE_COMMENT = "/\\*\\*(.|\\n)*\\*\\*/";

    private final SqlDialect sqlDialect;

    public SqlScriptRender(QueryScript queryScript, ExecuteParam executeParam, String variableQuote) {
        super(queryScript, executeParam, variableQuote);
        this.sqlDialect = LocalDB.SQL_DIALECT;
    }

    public SqlScriptRender(QueryScript queryScript, ExecuteParam executeParam, SqlDialect sqlDialect, String variableQuote) {
        super(queryScript, executeParam, variableQuote);
        this.sqlDialect = sqlDialect;
    }

    public String replaceVariables(String selectSql) {

        if (StringUtils.isBlank(selectSql)) {
            return selectSql;
        }

        Map<String, ScriptVariable> variableMap = queryScript.getVariables()
                .stream()
                .collect(Collectors.toMap(v -> getVariablePattern(v.getName()), variable -> variable));
        String srcSql = cleanupSql(selectSql);
        SqlNode sqlNode = null;
        try {
            sqlNode = parseSql(srcSql);
        } catch (SqlParseException e) {
            throw new DataProviderException(e);
        }
        SqlVariableVisitor visitor = new SqlVariableVisitor(sqlDialect, srcSql, variableQuote, variableMap);
        sqlNode.accept(visitor);
        List<VariablePlaceholder> placeholders = visitor.getVariablePlaceholders();
        for (VariablePlaceholder placeholder : placeholders) {
            ReplacementPair replacementPair = placeholder.replacementPair();
            srcSql = srcSql.replace(replacementPair.getPattern(), replacementPair.getReplacement());
        }
        return srcSql;
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

        // find select sql
        String selectSql0 = findSelectSql(script);

        if (StringUtils.isEmpty(selectSql0)) {
            throw new DataProviderException("No valid query statement");
        }
        String selectSql = selectSql0;

        // build with execute params
        if (withExecuteParam) {
            selectSql = SqlBuilder.builder()
                    .withExecuteParam(executeParam)
                    .withDialect(sqlDialect)
                    .withBaseSql(selectSql)
                    .withPage(withPage)
                    .build();
        }

        //replace variables
        selectSql = replaceVariables(selectSql);

        return onlySelectStatement ? selectSql : script.replace(selectSql0, selectSql);
    }

    private String findSelectSql(String script) {
        String selectSql = null;
        List<String> sqls = SqlSplitter.splitEscaped(script, SQL_SEP);
        for (String sql : sqls) {
            SqlNode sqlNode;
            try {
                sqlNode = parseSql(sql);
            } catch (Exception e) {
                continue;
            }
            if (SqlValidateUtils.validateQuery(sqlNode) && selectSql != null) {
                throw new DataProviderException("There can only be one query statement in the script.");
            }
            selectSql = sql;
        }
        return selectSql;
    }

    private SqlParser sqlParser() {
        SqlParser.Config config = SqlParser.config()
                .withLex(Lex.MYSQL)
                .withParserFactory(SqlParserImpl.FACTORY)
                .withConformance(SqlConformanceEnum.LENIENT);
        return SqlParser.create("", config);
    }

    private SqlNode parseSql(String sql) throws SqlParseException {
        return SqlParserUtils.createParser(sql, sqlDialect).parseQuery();
    }

    private String cleanupSql(String sql) {
        sql = sql.replace(CharUtils.CR, CharUtils.toChar(" "));
        sql = sql.replace(CharUtils.LF, CharUtils.toChar(" "));
        sql = sql.replaceAll(REG_SQL_SINGLE_LINE_COMMENT, " ");
        sql = sql.replaceAll(REG_SQL_MULTI_LINE_COMMENT, " ");
        return sql.trim();
    }

}
