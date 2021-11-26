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
  ChartConfig,
  ChartDataSectionConfig,
  ChartDataSectionField,
  ChartDataSectionType,
  ChartStyleSectionConfig,
  IFieldFormatConfig,
  SortActionType,
} from 'app/types/ChartConfig';
import { ChartDatasetMeta } from 'app/types/ChartDataset';
import { ChartDataViewFieldCategory } from 'app/types/ChartDataView';
import ChartMetadata from 'app/types/ChartMetadata';
import {
  cond,
  curry,
  isEmpty,
  isEmptyArray,
  isInPairArrayRange,
  isNumerical,
  isNumericEqual,
  isPairArray,
  isUndefined,
  meanValue,
} from 'utils/object';
import { toFormattedValue } from './number';

export function getDefaultThemeColor() {
  return echartsDefaultTheme.color;
}
export function isInRange(
  limit?: ChartDataSectionConfig['limit'],
  count: number = 0,
) {
  return cond(
    [isEmpty, true],
    [isNumerical, curry(isNumericEqual)(count)],
    [isPairArray, curry(isInPairArrayRange)(count)],
  )(limit, true);
}

export function isUnderUpperBound(
  limit?: ChartDataSectionConfig['limit'],
  count: number = 0,
) {
  return cond(
    [isEmpty, true],
    [isNumerical, limit => limit >= +count],
    [isPairArray, limit => count <= +limit[1]],
  )(limit, true);
}

export function reachLowerBoundCount(
  limit?: ChartDataSectionConfig['limit'],
  count: number = 0,
) {
  return cond(
    [isEmpty, 0],
    [isNumerical, limit => limit - count],
    [isPairArray, limit => +limit[0] - count],
  )(limit, 0);
}

export function getStyleValue(
  styleConfigs: ChartStyleSectionConfig[],
  paths: string[],
): any {
  return getValue(styleConfigs, paths, 'value');
}

export function getStyleValueByGroup(
  styles: ChartStyleSectionConfig[],
  groupPath: string,
  childPath: string,
) {
  const childPaths = childPath.split('.');
  return getStyleValue(styles, [groupPath, ...childPaths]);
}

export function getSettingValue(
  configs: ChartStyleSectionConfig[],
  path: string,
  targetKey: string,
) {
  return getValue(configs, path.split('.'), targetKey);
}

export function getValue(
  configs: ChartStyleSectionConfig[],
  paths: string[],
  targetKey,
) {
  const key = paths?.shift();
  const group = configs?.find(sc => sc.key === key);
  if (!group) {
    return null;
  }
  if (paths?.length === 0) {
    return isEmpty(group) ? null : group[targetKey];
  }
  return getValue(group.rows || [], paths, targetKey);
}

export function getColNameByValueColName(series) {
  return series?.data?.valueColName || series.seriesName;
}

export function getNumeric(numeric, defaultValue = 0) {
  if (
    numeric === null ||
    numeric === undefined ||
    numeric === Infinity ||
    numeric === -Infinity ||
    Number.isNaN(+numeric)
  ) {
    return defaultValue;
  }
  return +numeric;
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

export function transfromToObjectArray(
  columns?: string[][],
  metas?: ChartDatasetMeta[],
) {
  if (!columns || !metas) {
    return [];
  }
  return columns.map(col => {
    let objCol = {};
    for (let i = 0; i < metas.length; i++) {
      const key = metas?.[i]?.name;
      if (!!key) {
        objCol[key] = col[i];
      }
    }
    return objCol;
  });
}

export function getValueByColumnKey(col?: { aggregate?; colName: string }) {
  if (!col) {
    return '';
  }
  if (!col.aggregate) {
    return col.colName;
  }
  return `${col.aggregate}(${col.colName})`;
}

export function getColumnRenderName(c?: ChartDataSectionField) {
  if (!c) {
    return 'unkonwn name';
  }
  if (c.alias?.name) {
    return c.alias.name;
  }
  if (c.aggregate) {
    return `${c.aggregate}(${c.colName})`;
  }
  return c.colName;
}

export function diffHeaderRows(
  oldRows: Array<{ colName: string }>,
  newRows: Array<{ colName: string }>,
) {
  if (!oldRows?.length) {
    return true;
  }
  if (oldRows?.length !== newRows?.length) {
    return true;
  }
  const oldNames = oldRows.map(r => r.colName).sort();
  const newNames = newRows.map(r => r.colName).sort();
  if (oldNames.toString() !== newNames.toString()) {
    return true;
  }

  return false;
}

export function flattenHeaderRowsWithoutGroupRow<
  T extends {
    isGroup?: boolean;
    children?: T[];
  },
>(groupedHeaderRow: T) {
  const childRows = (groupedHeaderRow.children || []).flatMap(child =>
    flattenHeaderRowsWithoutGroupRow(child),
  );
  if (groupedHeaderRow.isGroup) {
    return childRows;
  }
  return [groupedHeaderRow].concat(childRows);
}

export function transformMeta(model?: string) {
  if (!model) {
    return undefined;
  }
  const jsonObj = JSON.parse(model);
  return Object.keys(jsonObj).map(colKey => ({
    ...jsonObj[colKey],
    id: colKey,
    category: ChartDataViewFieldCategory.Field,
  }));
}

export function mergeConfig<T extends ChartConfig>(target?: T, source?: T): T {
  if (!target) {
    return source!;
  }
  if (!source) {
    return target;
  }
  target.datas = mergeChartDataConfigs(target?.datas, source?.datas);
  target.styles = mergeChartStyleConfigs(target?.styles, source?.styles);
  target.settings = mergeChartStyleConfigs(target?.settings, source?.settings);
  return target;
}

export function mergeChartStyleConfigs<
  T extends { key?: string; value?: any; rows?: T[] } | undefined | null,
>(target?: T[], source?: T[], options = { useDefault: true }) {
  if (isEmptyArray(target)) {
    return target;
  }
  if (isEmptyArray(source) && !options?.useDefault) {
    return target;
  }
  for (let index = 0; index < target?.length!; index++) {
    const tEle: any = target?.[index];
    if (!tEle) {
      continue;
    }

    // options.useDefault
    if (isUndefined(tEle['value']) && options?.useDefault) {
      tEle['value'] = tEle?.['default'];
    }

    const sEle =
      'key' in tEle ? source?.find(s => s?.key === tEle.key) : source?.[index];

    if (!isUndefined(sEle?.['value'])) {
      tEle['value'] = sEle?.['value'];
    }
    if (!isEmptyArray(tEle?.rows)) {
      tEle['rows'] = mergeChartStyleConfigs(tEle.rows, sEle?.rows, options);
    } else if (sEle && !isEmptyArray(sEle?.rows)) {
      // Note: we merge all rows data when target rows is emtpy
      tEle['rows'] = sEle?.rows;
    }
  }
  return target;
}

export function mergeChartDataConfigs<
  T extends { key?: string; rows?: ChartDataSectionField[] } | undefined | null,
>(target?: T[], source?: T[]) {
  if (isEmptyArray(target) || isEmptyArray(source)) {
    return target;
  }
  return (target || []).map(tEle => {
    const sEle = (source || []).find(s => s?.key === tEle?.key);
    if (sEle) {
      return Object.assign({}, tEle, { rows: sEle?.rows });
    }
    return tEle;
  });
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
    .map(config => valueFormatter(config, row?.[getValueByColumnKey(config)]));
  return tooltips.join('<br />');
}

export function getSeriesTooltips4Polar2(
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
    .map(config => valueFormatter(config, row?.[getValueByColumnKey(config)]));
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

export function getSeriesTooltips4Polar(
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
    const rowKeyFn = dc =>
      groupConfigs?.map(config => dc[config?.colName]).join('-');
    const dataRow = dataColumns.find(dc => rowKeyFn(dc) === params?.name);
    return aggConfigs.map(config =>
      valueFormatter(config, dataRow?.[getValueByColumnKey(config)]),
    );
  }
  return [];
}

export function valueFormatter(config?: ChartDataSectionField, value?: any) {
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
  const scaleRatio = cycleRatio || 1;
  const defaultScatterPointPixelSize = 10;
  const distance = max - min === 0 ? 100 : max - min;

  return function (val) {
    return (
      (val?.[valueIndex] / distance) * scaleRatio * defaultScatterPointPixelSize
    );
  };
}

export function getExtraSeriesRowData(data) {
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
  dataColumns: any[],
  groupByKey: string,
  xAxisColumnName: string,
  aggregateKeys: string[],
  infoColumnNames: string[],
) {
  const groupedDataColumnObject = dataColumns.reduce((acc, cur) => {
    const colKey = cur[groupByKey] || 'defaultGroupKey';

    if (!acc[colKey]) {
      acc[colKey] = [];
    }
    const value = aggregateKeys
      .concat([xAxisColumnName])
      .concat(infoColumnNames || [])
      .concat([groupByKey])
      .reduce((a, k) => {
        a[k] = cur[k];
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

export function getRequiredGroupedSections(dataConfig?) {
  return (
    dataConfig
      ?.filter(
        c =>
          c.type === ChartDataSectionType.GROUP ||
          c.type === ChartDataSectionType.COLOR,
      )
      .filter(c => !!c.required) || []
  );
}

export function getRequiredAggregatedSections(dataConfigs?) {
  return (
    dataConfigs
      ?.filter(
        c =>
          c.type === ChartDataSectionType.AGGREGATE ||
          c.type === ChartDataSectionType.SIZE,
      )
      .filter(c => !!c.required) || []
  );
}

export function isMatchRequirement(meta: ChartMetadata, config: ChartConfig) {
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
