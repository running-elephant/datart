package datart.data.provider.calculator;

import com.alibaba.fastjson.JSONObject;
import datart.core.base.consts.ValueType;
import datart.core.common.DateUtils;
import datart.core.data.provider.*;
import datart.core.data.provider.sql.ColumnOperator;
import datart.core.data.provider.sql.FilterOperator;
import datart.core.data.provider.sql.FunctionColumn;
import datart.core.data.provider.sql.GroupByOperator;
import lombok.Data;
import org.apache.commons.collections4.ListUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.FastDateFormat;
import org.springframework.beans.BeanUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;

public class DateRatioCalculator extends AbstractCalculator {

    private static final EnumSet<StdSqlOperator> DATE_OPERATORS = EnumSet.of(StdSqlOperator.AGG_DATE_YEAR, StdSqlOperator.AGG_DATE_QUARTER, StdSqlOperator.AGG_DATE_MONTH, StdSqlOperator.AGG_DATE_WEEK, StdSqlOperator.AGG_DATE_DAY);

    private DateRatioConfig config;

    @Override
    public String type() {
        return "dateRatio";
    }

    @Override
    public void setConfig(Object config) {
        super.setConfig(config);
        JSONObject json = (JSONObject) config;
        this.config = json.toJavaObject(DateRatioConfig.class);
    }

    @Override
    public void calc(Dataframe dataframe, int dataIndex, DataProviderSource source, QueryScript queryScript, ExecuteParam executeParam) {

        List<List<Object>> rows = dataframe.getRows();

        if (ListUtils.emptyIfNull(rows).size() == 0) {
            return;
        }

//        List<Column> columns = dataframe.getColumns();
        List<GroupByOperator> groups = executeParam.getGroups();
        int groupSize = groups.size();

//        columns.get(dataIndex).setCalc();

        Map<String, BigDecimal> currentMap = new LinkedHashMap<>();

        int timeIndex;
        StdSqlOperator stdSqlOperator;

        //判断维度是否包含日期
        if (StringUtils.isBlank(config.getSelect())) {
            //判断是否存在日期聚合维度,并搜索最小维度
            List<FunctionColumn> functionColumns = executeParam.getFunctionColumns();
            List<Integer> ordinals = functionColumns.stream().map(functionColumn -> {
                Optional<StdSqlOperator> optional = getStdSqlOperator(functionColumn.getSnippet());
                return optional.map(Enum::ordinal).orElse(0);
            }).collect(Collectors.toList());

            //取最小粒度的时间维度
            int fcIndex = ordinals.indexOf(ordinals.stream().max((Comparator.naturalOrder())).orElse(null));
            //没有时间维度就结束
            if (fcIndex == -1) {
                return;
            }
            FunctionColumn fc = functionColumns.get(fcIndex);
            timeIndex = ListUtils.indexOf(executeParam.getGroups(), groupByOperator -> groupByOperator.getAlias().equals(fc.getAlias()));
            stdSqlOperator = getStdSqlOperator(fc.getSnippet()).get();

            //将所有值放到 map 中以便后续快速定位
            currentMap.putAll(generateCurrentMap(rows, dataIndex, timeIndex, groupSize, stdSqlOperator));

        } else {
            timeIndex = rows.get(0).size();
            Optional<StdSqlOperator> optional = getStdSqlOperator(config.getSnippet());

            if (!optional.isPresent()) {
                return;
            }
            stdSqlOperator = optional.get();

            DataProvider dataProvider = getDataProvider();
            //先计算上期,再计算当期
            try {
                ExecuteParam cloneParam = new ExecuteParam();
                BeanUtils.copyProperties(executeParam, cloneParam);
                List<FilterOperator> filterOperators = cloneParam.getFilters();
                FilterOperator filterOperator = new FilterOperator();
                filterOperator.setColumn(config.getColumnNames(false, ""));
                filterOperator.setSqlOperator(FilterOperator.SqlOperator.EQ);
                String lastDate = getCalcDate(config.getSelect(), stdSqlOperator, config.ratioType);
                filterOperator.setValues(new SingleTypedValue[]{new SingleTypedValue(lastDate, ValueType.STRING)});
                filterOperators.add(filterOperator);
                List<FunctionColumn> functionColumns = cloneParam.getFunctionColumns();
                FunctionColumn fc = new FunctionColumn();
                fc.setSnippet(config.getSnippet());
                fc.setAlias(config.getColumnKey());
                functionColumns.add(fc);
                Dataframe lastData = dataProvider.execute(source, queryScript, cloneParam);
                List<List<Object>> lastRows = lastData.getRows();
                for (List<Object> row : lastRows) {
                    row.add(lastDate);
                }
                currentMap.putAll(generateCurrentMap(lastRows, dataIndex, timeIndex, groupSize, stdSqlOperator));

                filterOperator.setValues(new SingleTypedValue[]{new SingleTypedValue(config.getSelect(), ValueType.STRING)});
                Dataframe newData = dataProvider.execute(source, queryScript, cloneParam);
                List<List<Object>> newRows = newData.getRows();
                for (List<Object> row : newRows) {
                    row.add(config.getSelect());
                }
                currentMap.putAll(generateCurrentMap(newRows, dataIndex, timeIndex, groupSize, stdSqlOperator));
                for (List<Object> row : rows) {
                    BigDecimal origin = currentMap.get(String.format("%s-%s", dimensions(row, groupSize, timeIndex), config.getSelect()));
                    row.set(dataIndex, origin == null ? "" : origin);
                    row.add(config.getSelect());
                }


            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }


        for (List<Object> row : rows) {
            String dataString = row.get(dataIndex).toString();
            String rowDate = row.get(timeIndex).toString();
            BigDecimal lastValue = currentMap.get(String.format("%s-%s", dimensions(row, groupSize, timeIndex), getCalcDate(rowDate, stdSqlOperator, config.ratioType)));
            if (StringUtils.isBlank(dataString) || lastValue == null) {
                row.set(dataIndex, "");
            } else {
                BigDecimal origin = new BigDecimal(dataString);
                Object newValue = "";
                if (config.valueType == DateRatioValueType.percent) {
                    newValue = origin
                            .divide(lastValue, 8, RoundingMode.HALF_UP)
                            .subtract(new BigDecimal(1))
                            .setScale(8, RoundingMode.HALF_UP)
                            .doubleValue();
                } else if (config.valueType == DateRatioValueType.diff) {
                    newValue = origin
                            .subtract(lastValue)
                            .setScale(8, RoundingMode.HALF_UP)
                            .doubleValue();
                }
                row.set(dataIndex, newValue);
            }
        }
    }

    private String getCalcDate(String dateStr, StdSqlOperator stdSqlOperator, DateRatioType type) {
        String pattern;
        int field = Calendar.YEAR;
        int amount = -1;

        if (stdSqlOperator == StdSqlOperator.AGG_DATE_YEAR) {
            pattern = "yyyy";
        } else if (stdSqlOperator == StdSqlOperator.AGG_DATE_QUARTER) {
            pattern = "yyyy-MM";
            dateStr = DateUtils.quarterToMonth(dateStr);
            if (type == DateRatioType.Last) {
                field = Calendar.MONTH;
                amount = -3;
            }
        } else if (stdSqlOperator == StdSqlOperator.AGG_DATE_MONTH) {
            pattern = "yyyy-MM";
            if (type == DateRatioType.Last) {
                field = Calendar.MONTH;
            }
        } else if (stdSqlOperator == StdSqlOperator.AGG_DATE_WEEK) {
            pattern = "yyyy-ww";
            if (type == DateRatioType.Last) {
                field = Calendar.WEEK_OF_YEAR;
            }
        } else if (stdSqlOperator == StdSqlOperator.AGG_DATE_DAY) {
            pattern = "yyyy-MM-dd";
            if (type == DateRatioType.Last) {
                field = Calendar.DAY_OF_MONTH;
            }
        } else {
            return dateStr;
        }
        Calendar calendar = Calendar.getInstance();
        try {
            FastDateFormat dateFormat = FastDateFormat.getInstance(pattern);
            Date date = dateFormat.parse(dateStr);
            calendar.setTime(date);
            calendar.add(field, amount);
            return dateFormat.format(calendar.getTime());
        } catch (ParseException e) {
            return dateStr;
        }
    }

    private String dimensions(List<Object> row, int size, int timeIndex) {
        List<Object> dimension = new ArrayList<>();
        for (int start = 0; start < size; start++) {
            if (start != timeIndex) {
                dimension.add(row.get(start));
            }
        }
        return StringUtils.join(dimension, "-");
    }

    private Optional<StdSqlOperator> getStdSqlOperator(final String snippet) {
        return DATE_OPERATORS.stream().filter(std -> snippet.startsWith(std.getSymbol())).findFirst();
    }

    private Map<String, BigDecimal> generateCurrentMap(final List<List<Object>> rows, final int dataIndex, final int timeIndex, final int prefix, final StdSqlOperator stdSqlOperator) {
        Map<String, BigDecimal> currentMap = new LinkedHashMap<>();
        for (List<Object> row : rows) {
            BigDecimal origin = new BigDecimal(row.get(dataIndex).toString());

            String date = row.get(timeIndex).toString();
            if (stdSqlOperator == StdSqlOperator.AGG_DATE_QUARTER) {
                // 以月份替换季度
                currentMap.put(String.format("%s-%s", dimensions(row, prefix, timeIndex), DateUtils.quarterToMonth(date)), origin);
            } else {
                currentMap.put(String.format("%s-%s", dimensions(row, prefix, timeIndex), date), origin);
            }
        }
        return currentMap;
    }

    @Data
    static class DateRatioConfig extends ColumnOperator {

        private String snippet;

        private String select;

        private DateRatioType ratioType;

        private DateRatioValueType valueType;


    }

    enum DateRatioType {
        Year,
        Last
    }

    enum DateRatioValueType {
        diff,
        percent
    }
}
