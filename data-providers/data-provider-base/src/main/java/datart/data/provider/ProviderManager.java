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

package datart.data.provider;

import datart.core.base.processor.ExtendProcessor;
import datart.core.base.exception.Exceptions;
import datart.core.base.processor.ProcessorResponse;
import datart.core.common.DateUtils;
import datart.core.data.provider.*;
import datart.core.data.provider.processor.DataProviderPostProcessor;
import datart.core.data.provider.processor.DataProviderPreProcessor;
import datart.core.data.provider.sql.AggregateOperator;
import datart.core.data.provider.sql.FunctionColumn;
import datart.core.data.provider.sql.GroupByOperator;
import datart.data.provider.optimize.DataProviderExecuteOptimizer;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.FastDateFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.SQLException;
import java.text.ParseException;
import java.util.*;
import java.util.concurrent.ConcurrentSkipListMap;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ProviderManager extends DataProviderExecuteOptimizer implements DataProviderManager {

    @Autowired(required = false)
    private List<ExtendProcessor> extendProcessors = new ArrayList<>();

    private static final Map<String, DataProvider> cachedDataProviders = new ConcurrentSkipListMap<>();

    @Override
    public List<DataProviderInfo> getSupportedDataProviders() {
        ArrayList<DataProviderInfo> providerInfos = new ArrayList<>();
        loadDataProviders();
        for (DataProvider dataProvider : cachedDataProviders.values()) {
            try {
                providerInfos.add(dataProvider.getBaseInfo());
            } catch (IOException e) {
                log.error("DataProvider init error {" + dataProvider.getClass().getName() + "}", e);
            }
        }
        return providerInfos;
    }

    @Override
    public DataProviderConfigTemplate getSourceConfigTemplate(String type) throws IOException {
        DataProvider providerService = getDataProviderService(type);
        DataProviderConfigTemplate configTemplate = providerService.getConfigTemplate();
        if (!CollectionUtils.isEmpty(configTemplate.getAttributes())) {
            for (DataProviderConfigTemplate.Attribute attribute : configTemplate.getAttributes()) {
                attribute.setDisplayName(providerService.getConfigDisplayName(attribute.getName()));
                attribute.setDescription(providerService.getConfigDescription(attribute.getName()));
                if (!CollectionUtils.isEmpty(attribute.getChildren())) {
                    for (DataProviderConfigTemplate.Attribute child : attribute.getChildren()) {
                        child.setDisplayName(providerService.getConfigDisplayName(child.getName()));
                        child.setDescription(providerService.getConfigDescription(child.getName()));
                    }
                }
            }
        }
        return configTemplate;
    }

    @Override
    public Object testConnection(DataProviderSource source) throws Exception {
        return getDataProviderService(source.getType()).test(source);
    }

    @Override
    public Set<String> readAllDatabases(DataProviderSource source) throws SQLException {
        return getDataProviderService(source.getType()).readAllDatabases(source);
    }

    @Override
    public Set<String> readTables(DataProviderSource source, String database) throws SQLException {
        return getDataProviderService(source.getType()).readTables(source, database);
    }

    @Override
    public Set<Column> readTableColumns(DataProviderSource source, String database, String table) throws SQLException {
        return getDataProviderService(source.getType()).readTableColumns(source, database, table);
    }

    @Override
    public Dataframe execute(DataProviderSource source, QueryScript queryScript, ExecuteParam param) throws Exception {

        //sql + param preprocessing
        ProcessorResponse preProcessorRes = this.preProcessorQuery(source, queryScript, param);
        if (!preProcessorRes.isSuccess()) {
            return Dataframe.empty();
        }
        Dataframe dataframe;

        DataProvider dataProvider = getDataProviderService(source.getType());

        String queryKey = dataProvider.getQueryKey(source, queryScript, param);

        if (param.isCacheEnable()) {
            dataframe = getFromCache(queryKey);
            if (dataframe != null) {
                return dataframe;
            }
        }
        if (param.isConcurrencyOptimize()) {
            dataframe = runOptimize(queryKey, source, queryScript, param);
        } else {
            dataframe = run(source, queryScript, param);
        }
        if (param.isCacheEnable()) {
            setCache(queryKey, dataframe, param.getCacheExpires());
        }
        //data postprocessing
        ProcessorResponse postProcessorRes = this.postProcessorQuery(dataframe, source, queryScript, param);
        if (!postProcessorRes.isSuccess()) {
            return Dataframe.empty();
        }

        return dataframe;

    }

    private ProcessorResponse preProcessorQuery(DataProviderSource source, QueryScript queryScript, ExecuteParam param) {
        if (!CollectionUtils.isEmpty(extendProcessors)) {
            for (ExtendProcessor processor : extendProcessors) {
                if (processor instanceof DataProviderPreProcessor) {
                    ProcessorResponse response = ((DataProviderPreProcessor) processor).preRun(source, queryScript, param);
                    if (!response.isSuccess()) {
                        return response;
                    }
                }
            }
        }
        return ProcessorResponse.success();
    }

    private ProcessorResponse postProcessorQuery(Dataframe dataframe, DataProviderSource source, QueryScript queryScript, ExecuteParam param) {
        if (!CollectionUtils.isEmpty(extendProcessors)) {
            for (ExtendProcessor processor : extendProcessors) {
                if (processor instanceof DataProviderPostProcessor) {
                    ProcessorResponse response = ((DataProviderPostProcessor) processor).postRun(dataframe, source, queryScript, param);
                    if (!response.isSuccess()) {
                        return response;
                    }
                }
            }
        }
        return ProcessorResponse.success();
    }

    @Override
    public Set<StdSqlOperator> supportedStdFunctions(DataProviderSource source) {
        return getDataProviderService(source.getType()).supportedStdFunctions(source);
    }

    @Override
    public boolean validateFunction(DataProviderSource source, String snippet) {
        DataProvider provider = getDataProviderService(source.getType());
        return provider.validateFunction(source, snippet);
    }

    @Override
    public void updateSource(DataProviderSource source) {
        DataProvider providerService = getDataProviderService(source.getType());
        providerService.resetSource(source);
    }

    private void excludeColumns(Dataframe data, Set<SelectColumn> include) {
        if (data == null
                || CollectionUtils.isEmpty(data.getColumns())
                || include == null
                || include.size() == 0
                || include.stream().anyMatch(selectColumn -> selectColumn.getColumnKey().contains("*"))) {
            return;
        }

        List<Integer> excludeIndex = new LinkedList<>();
        for (int i = 0; i < data.getColumns().size(); i++) {
            Column column = data.getColumns().get(i);
            if (include
                    .stream()
                    .noneMatch(selectColumn ->
                            column.columnKey().equals(selectColumn.getColumnKey())
                                    || column.columnKey().equals(selectColumn.getAlias())
                                    || column.columnKey().contains(selectColumn.getColumnKey()))) {
                excludeIndex.add(i);
            }
        }
        if (excludeIndex.size() > 0) {
            data.getRows().parallelStream().forEach(row -> {
                for (Integer index : excludeIndex) {
                    row.set(index, null);
                }
            });
        }
    }


    private DataProvider getDataProviderService(String type) {
        if (cachedDataProviders.size() == 0) {
            loadDataProviders();
        }
        DataProvider dataProvider = cachedDataProviders.get(type);
        if (dataProvider == null) {
            Exceptions.msg("No data provider type " + type);
        }
        return dataProvider;
    }

    private void loadDataProviders() {
        ServiceLoader<DataProvider> load = ServiceLoader.load(DataProvider.class);
        for (DataProvider dataProvider : load) {
            try {
                cachedDataProviders.put(dataProvider.getType(), dataProvider);
            } catch (IOException e) {
                log.error("", e);
            }
        }
    }

    @Override
    public Dataframe run(DataProviderSource source, QueryScript queryScript, ExecuteParam param) throws Exception {
        Dataframe dataframe = getDataProviderService(source.getType()).execute(source, queryScript, param);
        excludeColumns(dataframe, param.getIncludeColumns());
        calc(dataframe, param);
        return dataframe;
    }

    /**
     * 高级计算(运算后替换原值)
     *
     * @param dataframe
     * @param executeParam
     */
    private void calc(Dataframe dataframe, ExecuteParam executeParam) {
        //判断是否需要进行快速计算
        List<AggregateOperator> operators = executeParam.getAggregators();
        int calcIndex = ListUtils.indexOf(operators, aggregateOperator -> aggregateOperator.getCalcOperator() != null);
        if (calcIndex == -1) {
            return;
        }

        List<List<Object>> rows = dataframe.getRows();
        List<Column> columns = dataframe.getColumns();
        List<GroupByOperator> groups = executeParam.getGroups();
        int groupSize = groups.size();

        for (int i = calcIndex, j = operators.size(); i < j; i++) {
            AggregateOperator aggregateOperator = operators.get(i);
            if (aggregateOperator.getCalcOperator() == null) {
                continue;
            }
            int dataIndex = groupSize + i;

            //替换列名
            columns.get(dataIndex).setCalc(aggregateOperator.getCalcOperator());

            Map<String, BigDecimal> currentMap = new LinkedHashMap<>();
            if (aggregateOperator.getCalcOperator() == AggregateOperator.CalcOperator.RATIO_YEAR || aggregateOperator.getCalcOperator() == AggregateOperator.CalcOperator.RATIO_LAST) {
                //判断是否存在日期聚合维度,并搜索最小维度
                EnumSet<StdSqlOperator> set = EnumSet.of(StdSqlOperator.AGG_DATE_YEAR, StdSqlOperator.AGG_DATE_QUARTER, StdSqlOperator.AGG_DATE_MONTH, StdSqlOperator.AGG_DATE_WEEK, StdSqlOperator.AGG_DATE_DAY);
                List<FunctionColumn> functionColumns = executeParam.getFunctionColumns();
                List<Integer> ordinals = functionColumns.stream().map(functionColumn -> {
                    Optional<StdSqlOperator> optional = set.stream().filter(std -> functionColumn.getSnippet().startsWith(std.getSymbol())).findFirst();
                    return optional.map(Enum::ordinal).orElse(0);
                }).collect(Collectors.toList());
                //取最小粒度的时间维度
                FunctionColumn fc = functionColumns.get(ordinals.indexOf(ordinals.stream().max((Comparator.naturalOrder())).get()));
                int timeIndex = ListUtils.indexOf(executeParam.getGroups(), groupByOperator -> groupByOperator.getAlias().equals(fc.getAlias()));
                StdSqlOperator stdSqlOperator = set.stream().filter(std -> fc.getSnippet().startsWith(std.getSymbol())).findFirst().get();


                //将所有值放到 map 中以便后续快速定位
                for (List<Object> row : rows) {
                    BigDecimal origin = new BigDecimal(row.get(dataIndex).toString());

                    String date = row.get(timeIndex).toString();
                    if (stdSqlOperator == StdSqlOperator.AGG_DATE_QUARTER) {
                        // 以月份替换季度
                        currentMap.put(String.format("%s-%s", dimensions(row, groupSize, timeIndex), DateUtils.quarterToMonth(date)), origin);
                    } else {
                        currentMap.put(String.format("%s-%s", dimensions(row, groupSize, timeIndex), date), origin);
                    }
                }

                for (List<Object> row : rows) {
                    BigDecimal origin = new BigDecimal(row.get(dataIndex).toString());
                    String rowDate = row.get(timeIndex).toString();
                    String calcDate;
                    String pattern;
                    int field = Calendar.YEAR;
                    int amount = -1;

                    if (stdSqlOperator == StdSqlOperator.AGG_DATE_YEAR) {
                        pattern = "yyyy";
                    } else if (stdSqlOperator == StdSqlOperator.AGG_DATE_QUARTER) {
                        pattern = "yyyy-MM";
                        rowDate = DateUtils.quarterToMonth(rowDate);
                        if (aggregateOperator.getCalcOperator() == AggregateOperator.CalcOperator.RATIO_LAST) {
                            field = Calendar.MONTH;
                            amount = -3;
                        }
                    } else if (stdSqlOperator == StdSqlOperator.AGG_DATE_MONTH) {
                        pattern = "yyyy-MM";
                        if (aggregateOperator.getCalcOperator() == AggregateOperator.CalcOperator.RATIO_LAST) {
                            field = Calendar.MONTH;
                        }
                    } else if (stdSqlOperator == StdSqlOperator.AGG_DATE_WEEK) {
                        pattern = "yyyy-ww";
                        if (aggregateOperator.getCalcOperator() == AggregateOperator.CalcOperator.RATIO_LAST) {
                            field = Calendar.WEEK_OF_YEAR;
                        }
                    } else if (stdSqlOperator == StdSqlOperator.AGG_DATE_DAY) {
                        pattern = "yyyy-MM-dd";
                        if (aggregateOperator.getCalcOperator() == AggregateOperator.CalcOperator.RATIO_LAST) {
                            field = Calendar.DAY_OF_MONTH;
                        }
                    } else {
                        continue;
                    }
                    Calendar calendar = Calendar.getInstance();
                    try {
                        FastDateFormat dateFormat = FastDateFormat.getInstance(pattern);
                        Date date = dateFormat.parse(rowDate);
                        calendar.setTime(date);
                        calendar.add(field, amount);
                        calcDate = dateFormat.format(calendar.getTime());
                    } catch (ParseException e) {
                        calcDate = rowDate;
                    }

                    BigDecimal lastValue = currentMap.get(String.format("%s-%s", dimensions(row, groupSize, timeIndex), calcDate));
                    if (lastValue == null) {
                        row.set(dataIndex, "");
                    } else {
                        row.set(dataIndex, origin
                                .divide(lastValue, 8, RoundingMode.HALF_UP)
                                .subtract(new BigDecimal(1))
                                .setScale(8, RoundingMode.HALF_UP)
                                .doubleValue());
                    }
                }
            }
        }
    }

    private String dimensions(List<Object> row, int size, int timeIndex) {
        List<Object> dimension = new ArrayList<>();
        for (int start = 0; start < size; start++) {
            if(start != timeIndex) {
                dimension.add(row.get(start));
            }
        }
        return StringUtils.join(dimension, "-");
    }
}
