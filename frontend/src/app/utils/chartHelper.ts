/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import echartsDefaultTheme from 'app/assets/theme/echarts_default_theme.json';
import {
  ChartDataSet,
  ChartDataSetRow,
} from 'app/components/ChartGraph/models/ChartDataSet';
import {
  ChartConfig,
  ChartDataConfig,
  ChartDataSectionField,
  ChartDataSectionType,
  ChartStyleConfig,
  IFieldFormatConfig,
  SortActionType,
} from 'app/types/ChartConfig';
import { ChartStyleConfigDTO } from 'app/types/ChartConfigDTO';
import {
  ChartDatasetMeta,
  IChartDataSet,
  IChartDataSetRow,
} from 'app/types/ChartDataSet';
import ChartMetadata from 'app/types/ChartMetadata';
import { Debugger } from 'utils/debugger';
import { isEmptyArray, meanValue } from 'utils/object';
import {
  flattenHeaderRowsWithoutGroupRow,
  getColumnRenderOriginName,
  getRequiredAggregatedSections,
  getRequiredGroupedSections,
  isInRange,
} from './internalChartHelper';
import { toFormattedValue } from './number';

/**
 * Gets an array of default colors
 *
 * @example
 * const colorList = getDefaultThemeColor();
 * console.log(colorList); // ["#298ffe","#dae9ff","#fe705a","#ffdcdc","#751adb","#8663d7","#15AD31","#FAD414","#E62412"]
 *
 * @export
 * @return {*} default color array
 */
export function getDefaultThemeColor() {
  return echartsDefaultTheme.color;
}

/**
 * @deprecated This function will be removed in next versiion, please use getStyles instread
 * @see getValue
 * @param {ChartStyleConfig[]} styleConfigs
 * @param {string[]} paths
 * @return {*}  {*}
 */
export function getStyleValue(
  styleConfigs: ChartStyleConfig[],
  paths: string[],
): any {
  return getValue(styleConfigs, paths);
}

/**
 * @deprecated This function will be removed in next versiion, please use getStyles instread
 * @see getValue
 * @export
 * @param {ChartStyleConfig[]} configs
 * @param {string} path
 * @param {string} targetKey
 * @return {*}
 */
export function getSettingValue(
  configs: ChartStyleConfig[],
  path: string,
  targetKey: string,
) {
  return getValue(configs, path.split('.'), targetKey);
}

/**
 * @deprecated This function will be removed in next versiion, please use getStyles instread
 * @see getStyles
 * @export
 * @param {ChartStyleConfig[]} styles
 * @param {string} groupPath
 * @param {string} childPath
 * @return {*}
 */
export function getStyleValueByGroup(
  styles: ChartStyleConfig[],
  groupPath: string,
  childPath: string,
) {
  const childPaths = childPath.split('.');
  return getValue(styles, [groupPath, ...childPaths]);
}

/**
 * Get config style values, more example please see test cases
 * @example
 *
 * const styleConfigs = [
 *       {
 *        key: 'label',
 *        rows: [
 *           { key: 'color', value: 'red' },
 *           { key: 'font', value: 'sans-serif' },
 *         ],
 *       },
 *     ];
 * const [color, font] = getStyles(styleConfigs, ['label'], ['color', 'font']);
 * console.log(color); // red
 * console.log(font); // sans-serif
 *
 * @param {Array<ChartStyleConfig>} configs required
 * @param {Array<string>} parentKeyPaths required
 * @param {Array<string>} childTargetKeys required
 * @return {*} array of child keys with the same order
 */
export function getStyles(
  configs: Array<ChartStyleConfig>,
  parentKeyPaths: Array<string>,
  childTargetKeys: Array<string>,
) {
  const rows = getValue(configs, parentKeyPaths, 'rows');
  if (!rows) {
    return Array(childTargetKeys.length).fill(undefined);
  }
  return childTargetKeys.map(k => getValue(rows, [k]));
}

/**
 * Get style config value base funtion with default target key
 * @example
 *
 * const styleConfigs = [
 *       {
 *        key: 'label',
 *        rows: [
 *           { key: 'color', value: 'red' },
 *           { key: 'font', value: 'sans-serif' },
 *         ],
 *       },
 *     ];
 * const colorValue = getValue(styleConfigs, ['label', 'color']);
 * console.log(colorValue); // red
 *
 * @param {Array<ChartStyleConfig>} configs
 * @param {Array<string>} keyPaths
 * @param {string} [targetKey='value']
 * @return {*}
 */
export function getValue(
  configs: Array<ChartStyleConfig | ChartStyleConfigDTO>,
  keyPaths: Array<string>,
  targetKey = 'value',
) {
  let iterators = configs || [];
  while (!isEmptyArray(iterators)) {
    const key = keyPaths?.shift();
    const group = iterators?.find(sc => sc.key === key);
    if (!group) {
      return undefined;
    }
    if (isEmptyArray(keyPaths)) {
      return group[targetKey];
    }
    iterators = group.rows || [];
  }
}

export function getCustomSortableColumns(columns, dataConfigs) {
  const sortConfigs = dataConfigs
    .filter(
      c =>
        c.type === ChartDataSectionType.AGGREGATE ||
        c.type === ChartDataSectionType.GROUP,
    )
    .flatMap(config => config.rows || []);

  if (!sortConfigs || sortConfigs.length === 0) {
    return columns;
  }
  const sortConfig = sortConfigs[0];
  if (!sortConfig.colName || !sortConfig.sort) {
    return columns;
  }
  const sort = sortConfig.sort;
  if (!sort || sort.type !== SortActionType.CUSTOMIZE) {
    return columns;
  }
  const sortValues = sortConfig.sort.value || [];
  return columns.sort(
    (prev, next) =>
      sortValues.indexOf(prev[sortConfig.colName]) -
      sortValues.indexOf(next[sortConfig.colName]),
  );
}

export function getReference(
  settingConfigs,
  dataColumns,
  dataConfig,
  isHorizionDisplay,
) {
  const referenceTabs = getSettingValue(
    settingConfigs,
    'reference.panel.configuration',
    'rows',
  );

  return {
    markLine: getMarkLine(
      referenceTabs,
      dataColumns,
      dataConfig,
      isHorizionDisplay,
    ),
    markArea: getMarkArea(referenceTabs, dataColumns, isHorizionDisplay),
  };
}

export function getReference2(
  settingConfigs,
  dataSetRows: IChartDataSetRow<string>[],
  dataConfig,
  isHorizionDisplay,
) {
  const referenceTabs = getSettingValue(
    settingConfigs,
    'reference.panel.configuration',
    'rows',
  );

  return {
    markLine: getMarkLine2(
      referenceTabs,
      dataSetRows,
      dataConfig,
      isHorizionDisplay,
    ),
    markArea: getMarkArea2(referenceTabs, dataSetRows, isHorizionDisplay),
  };
}

function getMarkLine(refTabs, dataColumns, dataConfig, isHorizionDisplay) {
  const markLineData = refTabs
    ?.reduce((acc, cur) => {
      const markLineConfigs = cur?.rows?.filter(r => r.key === 'markLine');
      acc.push(...markLineConfigs);
      return acc;
    }, [])
    .map(ml => {
      return getMarkLineData(
        ml,
        dataColumns,
        'valueType',
        'constantValue',
        'metric',
        dataConfig,
        isHorizionDisplay,
      );
    })
    .filter(Boolean);

  return {
    data: markLineData,
  };
}

function getMarkLineData(
  mark,
  dataColumns,
  valueTypeKey,
  constantValueKey,
  metricKey,
  dataConfig,
  isHorizionDisplay,
) {
  const name = mark.label;
  const valueKey = isHorizionDisplay ? 'xAxis' : 'yAxis';
  const show = getSettingValue(mark.rows, 'showLabel', 'value');
  const enableMarkLine = getSettingValue(mark.rows, 'enableMarkLine', 'value');
  const position = getSettingValue(mark.rows, 'position', 'value');
  const font = getSettingValue(mark.rows, 'font', 'value');
  const lineStyle = getSettingValue(mark.rows, 'lineStyle', 'value');
  const valueType = getSettingValue(mark.rows, valueTypeKey, 'value');
  const metricUid = getSettingValue(mark.rows, metricKey, 'value');
  const metr = getValueByColumnKey(dataConfig);

  const metricDatas =
    dataConfig.uid === metricUid ? dataColumns.map(d => +d[metr]) : [];
  const constantValue = getSettingValue(mark.rows, constantValueKey, 'value');
  let yAxis = 0;
  switch (valueType) {
    case 'constant':
      yAxis = constantValue;
      break;
    case 'average':
      yAxis = meanValue(metricDatas);
      break;
    case 'max':
      yAxis = Math.max(...metricDatas);
      break;
    case 'min':
      yAxis = Math.min(...metricDatas);
      break;
  }

  if (!enableMarkLine) {
    return null;
  }

  return {
    [valueKey]: yAxis,
    name,
    label: {
      show,
      position,
      ...font,
    },
    lineStyle,
  };
}

function getMarkLine2(
  refTabs,
  dataSetRows: IChartDataSetRow<string>[],
  dataConfig,
  isHorizionDisplay,
) {
  const markLineData = refTabs
    ?.reduce((acc, cur) => {
      const markLineConfigs = cur?.rows?.filter(r => r.key === 'markLine');
      acc.push(...markLineConfigs);
      return acc;
    }, [])
    .map(ml => {
      return getMarkLineData2(
        ml,
        dataSetRows,
        'valueType',
        'constantValue',
        'metric',
        dataConfig,
        isHorizionDisplay,
      );
    })
    .filter(Boolean);

  return {
    data: markLineData,
  };
}

function getMarkLineData2(
  mark,
  dataSetRows: IChartDataSetRow<string>[],
  valueTypeKey,
  constantValueKey,
  metricKey,
  dataConfig,
  isHorizionDisplay,
) {
  const name = mark.label;
  const valueKey = isHorizionDisplay ? 'xAxis' : 'yAxis';
  const show = getSettingValue(mark.rows, 'showLabel', 'value');
  const enableMarkLine = getSettingValue(mark.rows, 'enableMarkLine', 'value');
  const position = getSettingValue(mark.rows, 'position', 'value');
  const font = getSettingValue(mark.rows, 'font', 'value');
  const lineStyle = getSettingValue(mark.rows, 'lineStyle', 'value');
  const valueType = getSettingValue(mark.rows, valueTypeKey, 'value');
  const metricUid = getSettingValue(mark.rows, metricKey, 'value');

  const metricDatas =
    dataConfig.uid === metricUid
      ? dataSetRows.map(d => +d.getCell(dataConfig))
      : [];
  const constantValue = getSettingValue(mark.rows, constantValueKey, 'value');
  let yAxis = 0;
  switch (valueType) {
    case 'constant':
      yAxis = constantValue;
      break;
    case 'average':
      yAxis = meanValue(metricDatas);
      break;
    case 'max':
      yAxis = Math.max(...metricDatas);
      break;
    case 'min':
      yAxis = Math.min(...metricDatas);
      break;
  }

  if (!enableMarkLine) {
    return null;
  }

  return {
    [valueKey]: yAxis,
    name,
    label: {
      show,
      position,
      ...font,
    },
    lineStyle,
  };
}

function getMarkAreaData2(
  mark,
  dataSetRows: IChartDataSetRow<string>[],
  valueTypeKey,
  constantValueKey,
  metricKey,
  isHorizionDisplay,
) {
  const valueKey = isHorizionDisplay ? 'xAxis' : 'yAxis';
  const show = getSettingValue(mark.rows, 'showLabel', 'value');
  const enableMarkArea = getSettingValue(mark.rows, 'enableMarkArea', 'value');
  const position = getSettingValue(mark.rows, 'position', 'value');
  const font = getSettingValue(mark.rows, 'font', 'value');
  const borderStyle = getSettingValue(mark.rows, 'borderStyle', 'value');
  const opacity = getSettingValue(mark.rows, 'opacity', 'value');
  const backgroundColor = getSettingValue(
    mark.rows,
    'backgroundColor',
    'value',
  );
  const name = mark.value;
  const valueType = getSettingValue(mark.rows, valueTypeKey, 'value');
  const metric = getSettingValue(mark.rows, metricKey, 'value');
  const metricDatas = dataSetRows.map(d => +d.getCellByKey(metric));
  const constantValue = getSettingValue(mark.rows, constantValueKey, 'value');
  let yAxis = 0;
  switch (valueType) {
    case 'constant':
      yAxis = constantValue;
      break;
    case 'average':
      yAxis = meanValue(metricDatas);
      break;
    case 'max':
      yAxis = Math.max(...metricDatas);
      break;
    case 'min':
      yAxis = Math.min(...metricDatas);
      break;
  }

  if (!enableMarkArea) {
    return null;
  }

  return {
    [valueKey]: yAxis,
    name,
    label: {
      show,
      position,
      ...font,
    },
    itemStyle: {
      opacity,
      color: backgroundColor,
      borderColor: borderStyle.color,
      borderWidth: borderStyle.width,
      borderType: borderStyle.type,
    },
  };
}

function getMarkAreaData(
  mark,
  dataColumns,
  valueTypeKey,
  constantValueKey,
  metricKey,
  isHorizionDisplay,
) {
  const valueKey = isHorizionDisplay ? 'xAxis' : 'yAxis';
  const show = getSettingValue(mark.rows, 'showLabel', 'value');
  const enableMarkArea = getSettingValue(mark.rows, 'enableMarkArea', 'value');
  const position = getSettingValue(mark.rows, 'position', 'value');
  const font = getSettingValue(mark.rows, 'font', 'value');
  const borderStyle = getSettingValue(mark.rows, 'borderStyle', 'value');
  const opacity = getSettingValue(mark.rows, 'opacity', 'value');
  const backgroundColor = getSettingValue(
    mark.rows,
    'backgroundColor',
    'value',
  );
  const name = mark.value;
  const valueType = getSettingValue(mark.rows, valueTypeKey, 'value');
  const metric = getSettingValue(mark.rows, metricKey, 'value');
  const metricDatas = dataColumns.map(d => +d[metric]);
  const constantValue = getSettingValue(mark.rows, constantValueKey, 'value');
  let yAxis = 0;
  switch (valueType) {
    case 'constant':
      yAxis = constantValue;
      break;
    case 'average':
      yAxis = meanValue(metricDatas);
      break;
    case 'max':
      yAxis = Math.max(...metricDatas);
      break;
    case 'min':
      yAxis = Math.min(...metricDatas);
      break;
  }

  if (!enableMarkArea) {
    return null;
  }

  return {
    [valueKey]: yAxis,
    name,
    label: {
      show,
      position,
      ...font,
    },
    itemStyle: {
      opacity,
      color: backgroundColor,
      borderColor: borderStyle.color,
      borderWidth: borderStyle.width,
      borderType: borderStyle.type,
    },
  };
}

function getMarkArea(refTabs, dataColumns, isHorizionDisplay) {
  const refAreas = refTabs?.reduce((acc, cur) => {
    const markLineConfigs = cur?.rows?.filter(r => r.key === 'markArea');
    acc.push(...markLineConfigs);
    return acc;
  }, []);
  return {
    data: refAreas
      ?.map(mark => {
        const markAreaData = ['start', 'end']
          .map(prefix => {
            return getMarkAreaData(
              mark,
              dataColumns,
              `${prefix}ValueType`,
              `${prefix}ConstantValue`,
              `${prefix}Metric`,
              isHorizionDisplay,
            );
          })
          .filter(Boolean);
        return markAreaData;
      })
      .filter(m => Boolean(m?.length)),
  };
}

function getMarkArea2(
  refTabs,
  dataSetRows: IChartDataSetRow<string>[],
  isHorizionDisplay,
) {
  const refAreas = refTabs?.reduce((acc, cur) => {
    const markLineConfigs = cur?.rows?.filter(r => r.key === 'markArea');
    acc.push(...markLineConfigs);
    return acc;
  }, []);
  return {
    data: refAreas
      ?.map(mark => {
        const markAreaData = ['start', 'end']
          .map(prefix => {
            return getMarkAreaData2(
              mark,
              dataSetRows,
              `${prefix}ValueType`,
              `${prefix}ConstantValue`,
              `${prefix}Metric`,
              isHorizionDisplay,
            );
          })
          .filter(Boolean);
        return markAreaData;
      })
      .filter(m => Boolean(m?.length)),
  };
}

export function getAxisLine(show, lineStyle) {
  return {
    show,
    lineStyle,
  };
}

export function getAxisLabel(
  show,
  font: { fontFamily; fontSize; color },
  interval = null,
  rotate = null,
) {
  return {
    show,
    interval,
    rotate,
    ...font,
  };
}

export function getSplitLine(show, lineStyle) {
  return {
    show,
    lineStyle,
  };
}

export function getAxisTick(show, lineStyle) {
  return {
    show,
    lineStyle,
  };
}

export function getNameTextStyle(fontFamily, fontSize, color) {
  return {
    fontFamily,
    fontSize,
    color,
  };
}

/**
 * Create ChartDataSet Model with sorted values
 * @export
 * @template T
 * @param {T[][]} [datas]
 * @param {ChartDatasetMeta[]} [metas]
 * @param {ChartDataConfig[]} [sortedConfigs]
 * @return {*}  {IChartDataSet<T>}
 */
export function transformToDataSet<T>(
  datas?: T[][],
  metas?: ChartDatasetMeta[],
  sortedConfigs?: ChartDataConfig[],
): IChartDataSet<T> {
  const ds = new ChartDataSet(datas || [], metas || []);
  ds.sortBy(sortedConfigs || []);
  return ds;
}

/**
 * @deprecated shoule use DataSet model, @see {@link transformToDataSet}
 * @description
 * Support:
 *  1. Case Insensitive to get value
 *  2. More util helper
 * @export
 * @param {string[][]} [columns]
 * @param {ChartDatasetMeta[]} [metas]
 * @return {*}
 */
export function transformToObjectArray(
  columns?: string[][],
  metas?: ChartDatasetMeta[],
) {
  if (!columns || !metas) {
    return [];
  }

  return Debugger.instance.measure(
    'transformToObjectArray',
    () => {
      const result: any[] = Array.apply(null, Array(columns.length));
      for (let j = 0, outterLength = result.length; j < outterLength; j++) {
        let objCol: any = {};
        for (let i = 0, innerLength = metas.length; i < innerLength; i++) {
          const key = metas?.[i]?.name;
          if (!!key) {
            objCol[key] = columns[j][i];
          }
        }
        result[j] = objCol;
      }
      return result;
    },
    false,
  );
}

/**
 * [Not Recommended] Get dataset key by field config with case-sensitive, it should only used in internal method.
 * If you want to find case-insensitive method, please @see {@link ChartDataSet}
 *
 * @example
 * const config = {
 *    colName: 'amount',
 *    aggregate: 'AVG'
 * }
 * const dataSetKey = getValueByColumnKey(config);
 * console.log(dataSetKey); // AVG(amount)
 *
 * @export
 * @param {ChartDataSectionField} [field]
 * @return {string}
 */
export function transfromToObjectArray(
  columns?: string[][],
  metas?: ChartDatasetMeta[],
) {
  console.warn(
    'This method `transfromToObjectArray` will be deprecated and can be replaced by `transformToObjectArray`',
  );
  return transformToObjectArray(columns, metas);
}

export function getValueByColumnKey(field?: {
  aggregate?;
  colName: string;
}): string {
  if (!field) {
    return '';
  }
  if (!field.aggregate) {
    return field.colName;
  }
  return `${field.aggregate}(${field.colName})`;
}

/**
 * Get data field render name by alias, colName and aggregate
 * @export
 * @param {ChartDataSectionField} [field]
 * @return {string}
 */
export function getColumnRenderName(field?: ChartDataSectionField): string {
  if (!field) {
    return '[unknown]';
  }
  if (field.alias?.name) {
    return field.alias.name;
  }
  return getColumnRenderOriginName(field);
}

export function getUnusedHeaderRows(
  allRows: Array<{
    colName?: string;
  }>,
  originalRows: Array<{
    colName?: string;
    isGroup?: boolean;
    children?: any[];
  }>,
): any[] {
  const oldFlattenedColNames = originalRows
    .flatMap(row => flattenHeaderRowsWithoutGroupRow(row))
    .map(r => r.colName);
  return (allRows || []).reduce<any[]>((acc, cur) => {
    if (!oldFlattenedColNames.includes(cur.colName)) {
      acc.push(cur);
    }
    return acc;
  }, []);
}

export function getDataColumnMaxAndMin(
  dataset: [],
  config?: ChartDataSectionField,
) {
  if (!config || !dataset?.length) {
    return { min: 0, max: 100 };
  }
  const datas = dataset.map(row => row[getValueByColumnKey(config)]);
  const min = Number.isNaN(Math.min(...datas)) ? 0 : Math.min(...datas);
  const max = Number.isNaN(Math.max(...datas)) ? 100 : Math.max(...datas);
  return { min, max };
}

export function getDataColumnMaxAndMin2(
  chartDataSetRows: IChartDataSetRow<string>[],
  config?: ChartDataSectionField,
) {
  if (!config || !chartDataSetRows?.length) {
    return { min: 0, max: 100 };
  }
  const datas = (chartDataSetRows || []).map(row =>
    Number(row.getCell(config)),
  );
  const min = Number.isNaN(Math.min(...datas)) ? 0 : Math.min(...datas);
  const max = Number.isNaN(Math.max(...datas)) ? 100 : Math.max(...datas);
  return { min, max };
}

export function getSeriesTooltips4Scatter(
  params,
  tooltipItemConfigs,
  start?: number,
) {
  const dataValues = params?.[0]?.value;
  return tooltipItemConfigs.map((config, index) =>
    valueFormatter(config, dataValues?.[!!start ? start + index : index]),
  );
}

export function getSeriesTooltips4Rectangular2(
  chartDataSet: IChartDataSet<string>,
  tooltipParam: {
    componentType: string;
    data: {
      name: string;
      rowData: { [key: string]: any };
    };
  },
  groupConfigs: ChartDataSectionField[],
  colorConfigs: ChartDataSectionField[],
  aggConfigs: ChartDataSectionField[],
  infoConfigs?: ChartDataSectionField[],
  sizeConfigs?: ChartDataSectionField[],
): string {
  if (tooltipParam?.componentType !== 'series') {
    return '';
  }
  const aggConfigName = tooltipParam?.data?.name;
  const row = tooltipParam?.data?.rowData || {};

  const tooltips: string[] = ([] as any[])
    .concat(groupConfigs || [])
    .concat(colorConfigs || [])
    .concat(
      aggConfigs.filter(agg => getColumnRenderName(agg) === aggConfigName) ||
        [],
    )
    .concat(sizeConfigs || [])
    .concat(infoConfigs || [])
    .map(config =>
      valueFormatter(config, row?.[chartDataSet.getFieldKey(config)]),
    );
  return tooltips.join('<br />');
}

export function getSeriesTooltips4Polar2(
  chartDataSet: IChartDataSet<string>,
  tooltipParam: {
    data: {
      name: string;
      rowData: { [key: string]: any };
    };
  },
  groupConfigs: ChartDataSectionField[],
  colorConfigs: ChartDataSectionField[],
  aggConfigs: ChartDataSectionField[],
  infoConfigs?: ChartDataSectionField[],
  sizeConfigs?: ChartDataSectionField[],
): string {
  const row = tooltipParam?.data?.rowData || {};
  const tooltips: string[] = ([] as any[])
    .concat(groupConfigs || [])
    .concat(colorConfigs || [])
    .concat(aggConfigs || [])
    .concat(sizeConfigs || [])
    .concat(infoConfigs || [])
    .map(config =>
      valueFormatter(config, row?.[chartDataSet.getFieldKey(config)]),
    );
  return tooltips.join('<br />');
}

export function getSeriesTooltips4Rectangular(
  params,
  groupConfigs,
  aggConfigs,
  dataColumns,
) {
  if (!aggConfigs?.length) {
    return [];
  }
  if (!groupConfigs?.length) {
    return aggConfigs.map(config =>
      valueFormatter(config, dataColumns?.[0]?.[getValueByColumnKey(config)]),
    );
  }
  if (groupConfigs?.[0]) {
    const groupConfig = groupConfigs?.[0];
    const dataRow = dataColumns.find(
      dc => dc[getValueByColumnKey(groupConfig)] === params?.[0]?.axisValue,
    );
    return aggConfigs.map(config =>
      valueFormatter(config, dataRow?.[getValueByColumnKey(config)]),
    );
  }
  return [];
}
/**
 * Get chart render string with field name and value
 *
 * @export
 * @param {ChartDataSectionField} [config]
 * @param {number} [value]
 * @return {string}
 */
export function valueFormatter(
  config?: ChartDataSectionField,
  value?: number,
): string {
  return `${getColumnRenderName(config)}: ${toFormattedValue(
    value,
    config?.format,
  )}`;
}

export function getScatterSymbolSizeFn(
  valueIndex: number,
  max,
  min,
  cycleRatio?: number,
) {
  min = Math.min(0, min);
  const scaleRatio = cycleRatio || 1;
  const defaultScatterPointPixelSize = 10;
  const distance = max - min === 0 ? 100 : max - min;

  return function (val) {
    return Math.max(
      3,
      ((val?.[valueIndex] - min) / distance) *
        scaleRatio *
        defaultScatterPointPixelSize *
        2,
    );
  };
}

export function getGridStyle(styles) {
  const [containLabel, left, right, bottom, top] = getStyles(
    styles,
    ['margin'],
    ['containLabel', 'marginLeft', 'marginRight', 'marginBottom', 'marginTop'],
  );
  return { left, right, bottom, top, containLabel };
}

// TODO(Stephen): tobe used chart DataSetRow model for all charts
export function getExtraSeriesRowData(data) {
  if (data instanceof ChartDataSetRow) {
    return {
      rowData: data?.convertToObject(),
    };
  }

  return {
    rowData: data,
  };
}

export function getExtraSeriesDataFormat(format?: IFieldFormatConfig) {
  return {
    format,
  };
}

export function getColorizeGroupSeriesColumns(
  chartDataSet: IChartDataSet<string>,
  groupByKey: string,
  xAxisColumnName: string,
  aggregateKeys: string[],
  infoColumnNames: string[],
) {
  const groupedDataColumnObject = chartDataSet?.reduce((acc, cur) => {
    const colKey = cur.getCellByKey(groupByKey) || 'defaultGroupKey';

    if (!acc[colKey]) {
      acc[colKey] = [];
    }
    const value = aggregateKeys
      .concat([xAxisColumnName])
      .concat(infoColumnNames || [])
      .concat([groupByKey])
      .reduce((a, k) => {
        a[k] = cur.getCellByKey(k);
        return a;
      }, {});
    acc[colKey].push(value);
    return acc;
  }, {});

  let collection = [] as any;
  Object.entries(groupedDataColumnObject).forEach(([k, v]) => {
    let a = {};
    a[k] = v;
    collection.push(a);
  });
  return collection;
}

/**
 * Check if current config with requried fields match the chart basic requirement of meta info.
 * @example
 *
 *  const meta = {
 *      requirements: [
 *        {
 *          group: [1, 999],
 *          aggregate: [1, 999],
 *        },
 *      ],
 *    };
 *    const config = {
 *     datas: [
 *        {
 *         type: 'group',
 *          required: true,
 *          rows: [
 *            {
 *              colName: 'category',
 *            },
 *          ],
 *        },
 *        {
 *          type: 'aggregate',
 *          required: true,
 *          rows: [
 *            {
 *              colName: 'amount',
 *            },
 *          ],
 *        },
 *      ],
 *    };
 *  const isMatch = isMatchRequirement(meta, config);
 *  console.log(isMatch); // true;
 *
 * @export
 * @param {ChartMetadata} meta
 * @param {ChartConfig} config
 * @return {boolean}
 */
export function isMatchRequirement(
  meta: ChartMetadata,
  config: ChartConfig,
): boolean {
  const dataConfigs = config.datas || [];
  const groupedFieldConfigs = getRequiredGroupedSections(dataConfigs).flatMap(
    config => config.rows || [],
  );
  const aggregateFieldConfigs = getRequiredAggregatedSections(
    dataConfigs,
  ).flatMap(config => config.rows || []);
  const requirements = meta.requirements || [];
  return requirements.some(r => {
    const group = r?.[ChartDataSectionType.GROUP];
    const aggregate = r?.[ChartDataSectionType.AGGREGATE];
    return (
      isInRange(group, groupedFieldConfigs.length) &&
      isInRange(aggregate, aggregateFieldConfigs.length)
    );
  });
}
