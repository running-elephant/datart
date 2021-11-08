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

package datart.server.service.impl;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import datart.core.base.PageInfo;
import datart.core.base.consts.Const;
import datart.core.base.consts.ValueType;
import datart.core.base.consts.VariableTypeEnum;
import datart.core.data.provider.*;
import datart.core.entity.RelSubjectColumns;
import datart.core.entity.Source;
import datart.core.entity.View;
import datart.core.mappers.ext.RelSubjectColumnsMapperExt;
import datart.security.util.AESUtil;
import datart.server.base.dto.VariableValue;
import datart.server.base.exception.ServerException;
import datart.server.base.params.TestExecuteParam;
import datart.server.base.params.ViewExecuteParam;
import datart.server.service.BaseService;
import datart.server.service.DataProviderService;
import datart.server.service.VariableService;
import datart.server.service.ViewService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DataProviderServiceImpl extends BaseService implements DataProviderService {


    // build in variables
    private static final String VARIABLE_NAME = "DATART.USER.NAME";

    private static final String VARIABLE_USERNAME = "DATART.USER.USERNAME";

    private static final String VARIABLE_EMAIL = "DATART.USER.EMAIL";

    private static final String VARIABLE_ID = "DATART.USER.ID";

    private static final String SERVER_AGGREGATE = "serverAggregate";

    private ObjectMapper objectMapper;

    private final DataProviderManager dataProviderManager;

    private final RelSubjectColumnsMapperExt rscMapper;

    private final VariableService variableService;

    private final ViewService viewService;

    public DataProviderServiceImpl(DataProviderManager dataProviderManager,
                                   RelSubjectColumnsMapperExt rscMapper,
                                   VariableService variableService,
                                   ViewService viewService) {
        this.dataProviderManager = dataProviderManager;
        this.rscMapper = rscMapper;
        this.variableService = variableService;
        this.viewService = viewService;
    }

    @PostConstruct
    public void init() {
        objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public List<DataProviderInfo> getSupportedDataProviders() {
        return dataProviderManager.getSupportedDataProviders();
    }

    @Override
    public DataProviderConfigTemplate getSourceConfigTemplate(String type) throws IOException {
        return dataProviderManager.getSourceConfigTemplate(type);
    }

    @Override
    public Object testConnection(DataProviderSource source) throws Exception {
        Map<String, Object> properties = source.getProperties();
        if (!CollectionUtils.isEmpty(properties)) {
            for (String key : properties.keySet()) {
                Object val = properties.get(key);
                if (val instanceof String) {
                    properties.put(key, decryptValue(val.toString()));
                }
            }
        }
        return dataProviderManager.testConnection(source);
    }

    @Override
    public Set<String> readAllDatabases(String sourceId) {
        Source source = retrieve(sourceId, Source.class, false);
        return dataProviderManager.readAllDatabases(toDataProviderConfig(source));
    }

    @Override
    public Set<String> readTables(String sourceId, String database) {
        Source source = retrieve(sourceId, Source.class, false);
        return dataProviderManager.readTables(toDataProviderConfig(source), database);
    }

    @Override
    public Set<Column> readTableColumns(String sourceId, String database, String table) {
        Source source = retrieve(sourceId, Source.class, false);
        return dataProviderManager.readTableColumns(toDataProviderConfig(source), database, table);
    }


    private DataProviderSource toDataProviderConfig(Source source) {
        DataProviderSource providerSource = new DataProviderSource();
        try {
            providerSource.setSourceId(source.getId());
            providerSource.setType(source.getType());
            providerSource.setName(source.getName());
            Map<String, Object> properties = objectMapper.readValue(source.getConfig(), HashMap.class);
            // decrypt values
            for (String key : properties.keySet()) {
                Object val = properties.get(key);
                if (val instanceof String) {
                    String dq = decryptValue(val.toString());
                    properties.put(key, dq);
                }
            }
            providerSource.setProperties(properties);
        } catch (Exception e) {
            log.error("Data Provider configuration resolves error.", e);
            throw new ServerException("Data Provider configuration resolves error.", e);
        }
        return providerSource;
    }


    /**
     * 测试执行。
     * : 权限变量不生效。
     * : 系统变量不生效。
     * : 查询变量使用默认值。
     *
     * @return 执行结果
     */
    @Override
    public Dataframe testExecute(TestExecuteParam testExecuteParam) throws Exception {
        Source source = retrieve(testExecuteParam.getSourceId(), Source.class, true);

        List<ScriptVariable> variables = getOrgVariables(source.getOrgId());
        if (!CollectionUtils.isEmpty(testExecuteParam.getVariables())) {
            variables.addAll(testExecuteParam.getVariables());
        }
        if (securityManager.isOrgOwner(source.getOrgId())) {
            variables = removePermissionVariables(variables);
        }
        QueryScript queryScript = QueryScript.builder()
                .test(true)
                .script(testExecuteParam.getScript())
                .variables(variables)
                .build();
        DataProviderSource providerSource = toDataProviderConfig(source);

        ExecuteParam executeParam = ExecuteParam
                .builder()
                .pageInfo(PageInfo.builder().pageNo(1).pageSize(testExecuteParam.getSize()).build())
                .includeColumns(Collections.singleton("*"))
                .serverAggregate((boolean) providerSource.getProperties().getOrDefault(SERVER_AGGREGATE, false))
                .cacheEnable(false)
                .build();
        return dataProviderManager.execute(providerSource, queryScript, executeParam);
    }

    @Override
    public Dataframe execute(ViewExecuteParam viewExecuteParam) throws Exception {

        if (viewExecuteParam.isEmpty()) {
            return Dataframe.empty();
        }

        View view = retrieve(viewExecuteParam.getViewId(), View.class, true);
        //datasource
        Source source = retrieve(view.getSourceId(), Source.class, false);

        DataProviderSource providerSource = toDataProviderConfig(source);

        Set<String> columns = parseColumnPermission(view);

        List<ScriptVariable> variables = parseVariables(view, viewExecuteParam);

        if (securityManager.isOrgOwner(view.getOrgId())) {
            variables = removePermissionVariables(variables);
        }

        QueryScript queryScript = QueryScript.builder()
                .test(false)
                .script(view.getScript())
                .variables(variables)
                .build();

        if (viewExecuteParam.getPageInfo().getPageNo() < 1) {
            viewExecuteParam.getPageInfo().setPageNo(1);
        }

        if (viewExecuteParam.getPageInfo().getPageSize() == 0) {
            viewExecuteParam.getPageInfo().setPageSize(10_000);
        }

        viewExecuteParam.getPageInfo().setCountTotal(true);

        ExecuteParam queryParam = ExecuteParam.builder()
                .columns(viewExecuteParam.getColumns())
                .keywords(viewExecuteParam.getKeywords())
                .functionColumns(viewExecuteParam.getFunctionColumns())
                .aggregators(viewExecuteParam.getAggregators())
                .filters(viewExecuteParam.getFilters())
                .groups(viewExecuteParam.getGroups())
                .orders(viewExecuteParam.getOrders())
                .pageInfo(viewExecuteParam.getPageInfo())
                .includeColumns(columns)
                .concurrencyOptimize(viewExecuteParam.isConcurrencyControl())
                .serverAggregate((boolean) providerSource.getProperties().getOrDefault(SERVER_AGGREGATE, false))
                .cacheEnable(viewExecuteParam.isCache())
                .cacheExpires(viewExecuteParam.getCacheExpires())
                .build();

        Dataframe dataframe = dataProviderManager.execute(providerSource, queryScript, queryParam);

        if (viewExecuteParam.isScript()) {
            try {
                viewService.requirePermission(view, Const.MANAGE);
            } catch (Exception e) {
                dataframe.setScript(null);
            }
        } else {
            dataframe.setScript(null);
        }
        return dataframe;
    }

    @Override
    public Set<StdSqlOperator> supportedStdFunctions(String sourceId) {

        Source source = retrieve(sourceId, Source.class, false);

        DataProviderSource dataProviderSource = toDataProviderConfig(source);

        return dataProviderManager.supportedStdFunctions(dataProviderSource);
    }

    @Override
    public boolean validateFunction(String sourceId, String snippet) {
        Source source = retrieve(sourceId, Source.class);
        DataProviderSource dataProviderSource = toDataProviderConfig(source);
        return dataProviderManager.validateFunction(dataProviderSource, snippet);
    }

    @Override
    public String decryptValue(String value) {
        if (StringUtils.isEmpty(value)) {
            return value;
        }
        if (!value.startsWith(Const.ENCRYPT_FLAG)) {
            return value;
        }
        String res = AESUtil.decrypt(value.replaceFirst(Const.ENCRYPT_FLAG, ""));
        return res;
    }

    @Override
    public void updateSource(DataProviderSource source) {
        dataProviderManager.updateSource(source);
    }

    private List<ScriptVariable> removePermissionVariables(List<ScriptVariable> variables) {
        return variables
                .stream()
                .filter(var -> !VariableTypeEnum.PERMISSION.equals(var.getType()))
                .collect(Collectors.toList());
    }

    private List<ScriptVariable> parseVariables(View view, ViewExecuteParam param) {
        //通用变量
        List<ScriptVariable> variables = new LinkedList<>();
        variables.addAll(getOrgVariables(view.getOrgId()));
        // view自定义变量
        variables.addAll(getViewVariables(view.getId()));
        // 用执行参数替换查询变量
        variables.stream()
                .filter(v -> v.getType().equals(VariableTypeEnum.QUERY))
                .forEach(v -> {
                    if (!CollectionUtils.isEmpty(param.getParams()) && param.getParams().containsKey(v.getName())) {
                        v.setValues(param.getParams().get(v.getName()));
                    }
                });
        return variables;
    }

    private List<ScriptVariable> getSysVariables() {
        LinkedList<ScriptVariable> variables = new LinkedList<>();
        variables.add(new ScriptVariable(VARIABLE_NAME,
                VariableTypeEnum.PERMISSION,
                ValueType.STRING,
                Collections.singleton(getCurrentUser().getUsername()),
                false));
        variables.add(new ScriptVariable(VARIABLE_EMAIL,
                VariableTypeEnum.PERMISSION,
                ValueType.STRING,
                Collections.singleton(getCurrentUser().getEmail()),
                false));
        variables.add(new ScriptVariable(VARIABLE_ID,
                VariableTypeEnum.PERMISSION,
                ValueType.STRING,
                Collections.singleton(getCurrentUser().getId()),
                false));
        variables.add(new ScriptVariable(VARIABLE_USERNAME,
                VariableTypeEnum.PERMISSION,
                ValueType.STRING,
                Collections.singleton(getCurrentUser().getUsername()),
                false));
        return variables;
    }

    private List<ScriptVariable> getViewVariables(String viewId) {
        return variableService.listViewVarValuesByUser(getCurrentUser().getId(), viewId)
                .stream()
                .map(this::convertScriptValue)
                .collect(Collectors.toList());
    }

    private List<ScriptVariable> getOrgVariables(String orgId) {
        // 内置变量
        List<ScriptVariable> variables = new LinkedList<>(getSysVariables());
        // 组织变量
        variables.addAll(variableService.listOrgValue(orgId)
                .stream()
                .map(this::convertScriptValue)
                .collect(Collectors.toList()));
        return variables;
    }

    private ScriptVariable convertScriptValue(VariableValue var) {
        return new ScriptVariable(var.getName(),
                VariableTypeEnum.valueOf(var.getType()),
                ValueType.valueOf(var.getValueType()),
                var.getValues(),
                var.isExpression());
    }

    private Set<String> parseColumnPermission(View view) {
        if (securityManager.isOrgOwner(view.getOrgId())) {
            return Collections.singleton("*");
        }
        try {
            Set<String> columns = new HashSet<>();
            List<RelSubjectColumns> relSubjectColumns = rscMapper.listByUser(view.getId(), getCurrentUser().getId());
            for (RelSubjectColumns relSubjectColumn : relSubjectColumns) {
                List<String> cols = (List<String>) objectMapper.readValue(relSubjectColumn.getColumnPermission(), ArrayList.class);
                columns.addAll(cols);
            }
            return columns;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
