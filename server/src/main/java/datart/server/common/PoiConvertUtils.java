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
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.map.CaseInsensitiveMap;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class PoiConvertUtils {

    public static POISettings covertToPoiSetting(String chartConfigStr, Dataframe dataframe){
        ChartConfigDTO chartConfigDTO = JSONValidator.from(chartConfigStr).validate() ?
                JSON.parseObject(chartConfigStr, ChartConfigDTO.class) : new ChartConfigDTO();
        List<ChartColumn> dataColumns = chartConfigDTO.getColumnSettings();
        List<ChartColumn> dataStyles = chartConfigDTO.getDataHeaders();
        POISettings poiSettings = new POISettings();
        Map<String, String> aliasMap = getAliasMap(dataColumns);
        List<ChartColumn> realColumnSortList = getRealColumnSortList(dataColumns, dataStyles);
        dealHeaderDataSetting(poiSettings, dataStyles, dataframe, dataColumns, aliasMap);
        Map<Integer, ColumnSetting> columnSettingMap = dealColumnSetting(dataframe.getColumns(), realColumnSortList, aliasMap);
        poiSettings.setColumnSetting(columnSettingMap);
        // 若解析可能异常则下载不使用样式
        if (!columnSettingMap.isEmpty() && columnSettingMap.size() != dataframe.getColumns().size()){
            log.warn("Analysis of chart style may have problems, and this will download with no style.");
            poiSettings = new POISettings();
        }
        return poiSettings;
    }

    private static Map<Integer, ColumnSetting> dealColumnSetting(List<Column> columns, List<ChartColumn> dataColumns, Map<String, String> aliasMap) {
        Map<Integer, ColumnSetting> resultMap = new HashMap<>(columns.size());
        Map<String, Integer> oriSort = new CaseInsensitiveMap(columns.size());
        for (int i = 0; i < columns.size(); i++) {
            Integer put = oriSort.put(columns.get(i).getName(), i);
            if (put!=null){
                log.warn("CaseInsensitive column may have conflicts: {}.", columns.get(i).getName());
            }
        }
        for (int i = 0; i < dataColumns.size(); i++) {
            ChartColumn dataColumn = dataColumns.get(i);
            String columnName = dataColumn.getDisplayName();
            Integer index = oriSort.get(columnName);
            ColumnSetting res = new ColumnSetting();
            res.setIndex(i);
            res.setNumFormat(dataColumn.getNumFormat());
            res.setLength(aliasMap.getOrDefault(columnName, columnName).length());
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
        // 记录已使用Column uid
        Set<String> hadUsedColumnNameSet = new HashSet<>(dataStyles.size());
        if (dataStyles.size() > 0) {
            int deepNum = dataStyles.stream().map(ChartColumn::getDeepNum).max(Comparator.comparingInt(Integer::intValue)).get();
            for (int i = 0; i < deepNum; i++) {
                rowMap.put(i, new ArrayList<>());
            }
            convertGroupHeaderData(dataStyles, rowMap, 0, cellRangeAddresses, aliasMap, hadUsedColumnNameSet);
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
            String aliasName = StringUtils.isNotBlank(item.getAlias().getName()) ? item.getAlias().getName() : item.getDisplayName();
            aliasMap.put(item.getDisplayName(), aliasName);
        });
        return aliasMap;
    }

    private static void convertGroupHeaderData(List<ChartColumn> dataStyles, Map<Integer, List<Column>> rowMap, int rowNum, List<CellRangeAddress> cellRangeAddresses, Map<String, String> aliasMap, Set<String> hadUsedColumnNameSet){
        for (ChartColumn dataStyle : dataStyles) {
            if (hadUsedColumnNameSet.contains(dataStyle.getColName())) {
                continue;
            }
            hadUsedColumnNameSet.add(dataStyle.getColName());
            // columnNum: 列索引，列下标
            // rowNum: 行索引，行下标
            int columnNum = putDataIntoListMap(rowMap, rowNum, dataStyle);
            if (dataStyle.getLeafNum() <= 1 && !dataStyle.isGroup()){
                Column column = rowMap.get(rowNum).get(columnNum);
                column.setName(aliasMap.getOrDefault(column.getName(), column.getName()));
                // 填充空行
                for (int i = rowNum + 1; i < rowMap.size(); i++) {
                    putDataIntoListMap(rowMap, i, new ChartColumn());
                }
                // 若非圆满，则单元格合并
                if (rowMap.size() - 1 > rowNum) {
                    cellRangeAddresses.add(new CellRangeAddress(rowNum, rowMap.size() - 1, columnNum, columnNum));
                }
            } else if (dataStyle.getLeafNum() > 1) {
                for (int i = 1; i < dataStyle.getLeafNum(); i++) {
                    putDataIntoListMap(rowMap, rowNum, new ChartColumn());
                }
                cellRangeAddresses.add(new CellRangeAddress(rowNum, rowNum, columnNum, columnNum+dataStyle.getLeafNum()-1));
            }
            if (dataStyle.getChildren().size() > 0){
                int row = rowNum + 1;
                convertGroupHeaderData(dataStyle.getChildren(), rowMap, row, cellRangeAddresses, aliasMap, hadUsedColumnNameSet);
                // 后递归法，补充完善本轮合并单元格 columnNum, 当前列序号，子元素列序号
                for (int j = columnNum + 1; j < rowMap.get(row).size(); j++) {
                    putDataIntoListMap(rowMap, rowNum, new ChartColumn());
                }
                // 若子单元格列大于当前单元格列，则合并
                if (columnNum + 1 < rowMap.get(rowNum).size()) {
                    cellRangeAddresses.add(new CellRangeAddress(rowNum, rowNum, columnNum, rowMap.get(rowNum).size() - 1));
                }
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
        //处理页面分组后添加列的情况
        if (list.size()!=dataColumns.size()) {
            Set<String> columnIds = list.stream().map(ChartColumn::getUid).collect(Collectors.toSet());
            for (ChartColumn dataColumn : dataColumns) {
                if (!columnIds.contains(dataColumn.getUid())) {
                    list.add(dataColumn);
                    dataHeaders.add(dataColumn);
                }
            }
        }
        return list;
    }

    private static int putDataIntoListMap(Map<Integer, List<Column>> rowMap, Integer key, ChartColumn val){
        if (!rowMap.containsKey(key)) {
            rowMap.put(key, new ArrayList<>());
        }
        Column column = new Column();
        column.setName(val.getDisplayName());
        // TODO 格式优化
        column.setType(ValueType.STRING);
        rowMap.get(key).add(column);
        return rowMap.get(key).size() - 1;
    }
}
