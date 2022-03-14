package datart.server.common;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONValidator;
import datart.core.base.consts.ValueType;
import datart.core.data.provider.Column;
import datart.core.data.provider.Dataframe;
import datart.core.entity.poi.ColumnSetting;
import datart.core.entity.poi.POISettings;
import datart.server.base.dto.chart.ChartColumn;
import datart.server.base.dto.chart.ChartConfigDTO;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

public class PoiConvertUtils {

    public static POISettings covertToPoiSetting(String chartConfigStr, Dataframe dataframe){
        ChartConfigDTO chartConfigDTO = JSONValidator.from(chartConfigStr).validate() ?
                JSON.parseObject(chartConfigStr, ChartConfigDTO.class) : new ChartConfigDTO();
        List<ChartColumn> dataColumns = chartConfigDTO.getColumnSettings();
        List<ChartColumn> dataStyles = chartConfigDTO.getDataHeaders();
        POISettings poiSettings = new POISettings();
        Map<String, String> aliasMap = getAliasMap(dataColumns);
        dealHeaderDataSetting(poiSettings, dataStyles, dataframe, dataColumns, aliasMap);
        List<ChartColumn> realColumnSortList = getRealColumnSortList(dataColumns, dataStyles);
        Map<Integer, ColumnSetting> columnSettingMap = dealColumnSetting(dataframe.getColumns(), realColumnSortList);
        poiSettings.setColumnSetting(columnSettingMap);
        return poiSettings;
    }

    private static Map<Integer, ColumnSetting> dealColumnSetting(List<Column> columns, List<ChartColumn> dataColumns) {
        Map<Integer, ColumnSetting> resultMap = new HashMap<>(columns.size());
        Map<String, Integer> oriSort = new HashMap<>(columns.size());
        for (int i = 0; i < columns.size(); i++) {
            oriSort.put(columns.get(i).getName(), i);
        }
        for (int i = 0; i < dataColumns.size(); i++) {
            ChartColumn dataColumn = dataColumns.get(i);
            Integer index = oriSort.get(dataColumn.getColName());
            ColumnSetting res = new ColumnSetting();
            res.setIndex(i);
            res.setNumFormat(dataColumn.getNumFormat());
            res.setLength(dataColumn.getColName().length());
            resultMap.put(index, res);
        }
        return resultMap;
    }

    /**
     * 处理表头信息、列别名及合并信息
     */
    private static void dealHeaderDataSetting(POISettings poiSettings, List<ChartColumn> dataStyles, Dataframe dataframe, List<ChartColumn> dataColumns, Map<String, String> aliasMap){
        Map<Integer, List<Column>> rowMap = new HashMap<>();
        List<CellRangeAddress> cellRangeAddresses = new ArrayList<>();
        if (dataStyles.size()>0){
            int deepNum = dataStyles.stream().map(ChartColumn::getDeepNum).max(Comparator.comparingInt(Integer::intValue)).get();
            for (int i = 0; i < deepNum; i++) {
                rowMap.put(i, new ArrayList<>());
            }
            convertGroupHeaderData(dataStyles, rowMap, 0, cellRangeAddresses, aliasMap);
        } else {
            if (CollectionUtils.isEmpty(dataColumns)){
                rowMap.put(0, dataframe.getColumns());
            }else {
                dataColumns.stream().forEach(item -> {
                    putDataIntoListMap(rowMap, 0, item);
                });
                rowMap.get(0).stream().forEach(item -> item.setName(aliasMap.getOrDefault(item.getName(), item.getName())));
            }
        }
        poiSettings.setHeaderRows(rowMap);
        poiSettings.setMergeCells(cellRangeAddresses);
    }

    /**
     * 获取列别名
     */
    private static Map<String, String> getAliasMap(List<ChartColumn> dataColumns){
        Map<String, String> aliasMap = new HashMap<>();
        dataColumns.stream().forEach(item -> {
            String aliasName = StringUtils.isNotBlank(item.getAlias().getName()) ? item.getAlias().getName() : item.getColName();
            aliasMap.put(item.getColName(), aliasName);
        });
        return aliasMap;
    }

    private static void convertGroupHeaderData(List<ChartColumn> dataStyles, Map<Integer, List<Column>> rowMap, int rowNum, List<CellRangeAddress> cellRangeAddresses, Map<String, String> aliasMap){
        for (ChartColumn dataStyle : dataStyles) {
            int columnNum = putDataIntoListMap(rowMap, rowNum, dataStyle);
            if (dataStyle.getLeafNum()<=1 && !dataStyle.isGroup()){
                Column column = rowMap.get(rowNum).get(columnNum);
                column.setName(aliasMap.getOrDefault(column.getName(), column.getName()));
                for (int i = rowNum+1; i < rowMap.size(); i++) {
                    putDataIntoListMap(rowMap, i, new ChartColumn());
                }
                if (rowMap.size()-1 > rowNum){
                    cellRangeAddresses.add(new CellRangeAddress(rowNum, rowMap.size()-1, columnNum, columnNum));
                }
            } else if (dataStyle.getLeafNum()>1){
                for (int i = 1; i < dataStyle.getLeafNum(); i++) {
                    putDataIntoListMap(rowMap, rowNum, new ChartColumn());
                }
                cellRangeAddresses.add(new CellRangeAddress(rowNum, rowNum, columnNum, columnNum+dataStyle.getLeafNum()-1));
            }
            if (dataStyle.getChildren().size()>0){
                int row = rowNum+1;
                convertGroupHeaderData(dataStyle.getChildren(), rowMap, row, cellRangeAddresses, aliasMap);
            }
        }
    }

    private static List<ChartColumn> getRealColumnSortList(List<ChartColumn> dataColumns, List<ChartColumn> dataHeaders){
        if (CollectionUtils.isEmpty(dataHeaders)){
            return dataColumns;
        }
        List<ChartColumn> list = new ArrayList<>();
        for (ChartColumn dataHeader : dataHeaders) {
            list.addAll(dataHeader.getLeafNodes());
        }
        Map<String, ChartColumn> columnMap = dataColumns.stream().collect(Collectors.toMap(ChartColumn::getUid, item -> item));
        for (ChartColumn chartColumn : list) {
            if (columnMap.containsKey(chartColumn.getUid())){
                chartColumn.setFormat(columnMap.get(chartColumn.getUid()).getFormat());
            }
        }
        return list;
    }

    private static int putDataIntoListMap(Map<Integer, List<Column>> rowMap, Integer key, ChartColumn val){
        if (!rowMap.containsKey(key)) {
            rowMap.put(key, new ArrayList<>());
        }
        Column column = new Column();
        column.setName(val.getColName());
        column.setType(ValueType.STRING);
        rowMap.get(key).add(column);
        return rowMap.get(key).size()-1;
    }
}
