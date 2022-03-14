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

import {
  AggregateFieldActionType,
  ChartConfig,
  ChartDataConfig,
  ChartDataSectionField,
  ChartDataSectionType,
  ChartStyleConfig,
} from 'app/types/ChartConfig';
import {
  ChartCommonConfig,
  ChartStyleConfigDTO,
} from 'app/types/ChartConfigDTO';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
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
  pipe,
} from 'utils/object';

export const transferChartConfigs = (
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
) => {
  if (!sourceConfig || !targetConfig) {
    return targetConfig || sourceConfig;
  }
  return pipe(
    transferChartDataConfig,
    transferChartStyleConfig,
    transferChartSettingConfig,
  )(targetConfig, sourceConfig);
};

const transferChartStyleConfig = (
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
): ChartConfig => {
  if (!targetConfig) {
    return sourceConfig!;
  }
  targetConfig.styles = mergeChartStyleConfigs(
    targetConfig?.styles,
    sourceConfig?.styles,
  );
  return targetConfig;
};

const transferChartSettingConfig = (
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
): ChartConfig => {
  if (!targetConfig) {
    return sourceConfig!;
  }
  targetConfig.settings = mergeChartStyleConfigs(
    targetConfig?.settings,
    sourceConfig?.settings,
  );
  return targetConfig;
};

export const transferChartDataConfig = (
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
): ChartConfig => {
  return pipe(
    ...[
      ChartDataSectionType.GROUP,
      ChartDataSectionType.AGGREGATE,
      ChartDataSectionType.COLOR,
      ChartDataSectionType.INFO,
      ChartDataSectionType.MIXED,
      ChartDataSectionType.SIZE,
      ChartDataSectionType.FILTER,
    ].map(type => curry(transferDataConfigImpl)(type)),
    ...[ChartDataSectionType.MIXED].map(type =>
      curry(transferMixedToOther)(type),
    ),
    ...[ChartDataSectionType.MIXED].map(type =>
      curry(transferOtherToMixed)(type),
    ),
  )(targetConfig, sourceConfig);
};

const transferDataConfigImpl = (
  sectionType: ChartDataSectionType,
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
): ChartConfig => {
  const targetDataConfigs = targetConfig?.datas || [];
  const sourceDataConfigs = sourceConfig?.datas || [];
  const sourceSectionConfigRows = sourceDataConfigs
    .filter(c => c.type === sectionType)
    .flatMap(config => config.rows || []);
  const targetSectionConfigs = targetDataConfigs?.filter(
    c => c.type === sectionType,
  );

  while (
    Boolean(sourceSectionConfigRows?.length) &&
    Boolean(targetSectionConfigs?.length)
  ) {
    const row = sourceSectionConfigRows.shift();
    const minimalRowConfig = [...targetSectionConfigs]
      .filter(section => {
        return isUnderUpperBound(
          section?.limit,
          (section?.rows || []).length + 1,
        );
      })
      .sort((a, b) => {
        if (
          reachLowerBoundCount(a?.limit, a?.rows?.length) !==
          reachLowerBoundCount(b?.limit, b?.rows?.length)
        ) {
          return (
            reachLowerBoundCount(b?.limit, b?.rows?.length) -
            reachLowerBoundCount(a?.limit, a?.rows?.length)
          );
        }
        return (a?.rows?.length || 0) - (b?.rows?.length || 0);
      })?.[0];
    if (minimalRowConfig && row) {
      minimalRowConfig.rows = (minimalRowConfig.rows || []).concat([row]);
    }
  }
  return targetConfig!;
};

const transferOtherToMixed = (
  sectionType: ChartDataSectionType,
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
): ChartConfig => {
  const targetDataConfigs = targetConfig?.datas || [];
  const sourceDataConfigs = sourceConfig?.datas || [];
  const sourceSectionConfigs = sourceDataConfigs.filter(
    c => c.type === sectionType,
  );
  const targetSectionConfigs = targetDataConfigs?.filter(
    c => c.type === sectionType,
  );

  if (
    isEmptyArray(sourceSectionConfigs) &&
    !isEmptyArray(targetSectionConfigs)
  ) {
    const allRows =
      sourceDataConfigs?.flatMap(config => config.rows || []) || [];
    const inUsedRows =
      targetDataConfigs?.flatMap(config => config.rows || []) || [];
    const notAssignedRows = allRows.filter(
      r => !inUsedRows.find(ur => ur?.uid === r?.uid),
    );
    while (Boolean(notAssignedRows?.length)) {
      const row = notAssignedRows.shift();
      const minimalRowConfig = [...targetSectionConfigs]
        .filter(section => {
          return isUnderUpperBound(
            section?.limit,
            (section?.rows || []).length + 1,
          );
        })
        .sort((a, b) => {
          if (
            reachLowerBoundCount(a?.limit, a?.rows?.length) !==
            reachLowerBoundCount(b?.limit, b?.rows?.length)
          ) {
            return (
              reachLowerBoundCount(b?.limit, b?.rows?.length) -
              reachLowerBoundCount(a?.limit, a?.rows?.length)
            );
          }
          return (a?.rows?.length || 0) - (b?.rows?.length || 0);
        })?.[0];
      if (minimalRowConfig && row) {
        minimalRowConfig.rows = (minimalRowConfig.rows || []).concat([row]);
      }
    }
  }

  return targetConfig!;
};

const transferMixedToOther = (
  sectionType: ChartDataSectionType,
  targetConfig?: ChartConfig,
  sourceConfig?: ChartConfig,
): ChartConfig => {
  const targetDataConfigs = targetConfig?.datas || [];
  const sourceDataConfigs = sourceConfig?.datas || [];
  const sourceSectionConfigRows = sourceDataConfigs
    .filter(c => c.type === sectionType)
    .flatMap(config => config.rows || []);
  const targetSectionConfigs = targetDataConfigs?.filter(
    c => c.type === sectionType,
  );
  if (
    !isEmptyArray(sourceSectionConfigRows) &&
    isEmptyArray(targetSectionConfigs)
  ) {
    const dimensions = sourceSectionConfigRows?.filter(
      r =>
        r.type === ChartDataViewFieldType.DATE ||
        r.type === ChartDataViewFieldType.STRING,
    );
    const metrics = sourceSectionConfigRows?.filter(
      r => r.type === ChartDataViewFieldType.NUMERIC,
    );

    while (Boolean(dimensions?.length)) {
      const groupTypeSections = targetDataConfigs?.filter(
        c => c.type === ChartDataSectionType.GROUP,
      );

      const row = dimensions.shift();
      const minimalRowConfig = [...groupTypeSections]
        .filter(section => {
          return isUnderUpperBound(
            section?.limit,
            (section?.rows || []).length + 1,
          );
        })
        .sort((a, b) => {
          if (
            reachLowerBoundCount(a?.limit, a?.rows?.length) !==
            reachLowerBoundCount(b?.limit, b?.rows?.length)
          ) {
            return (
              reachLowerBoundCount(b?.limit, b?.rows?.length) -
              reachLowerBoundCount(a?.limit, a?.rows?.length)
            );
          }
          return (a?.rows?.length || 0) - (b?.rows?.length || 0);
        })?.[0];
      if (minimalRowConfig && row) {
        minimalRowConfig.rows = (minimalRowConfig.rows || []).concat([row]);
      }
    }

    while (Boolean(metrics?.length)) {
      const aggTypeSections = targetDataConfigs?.filter(
        c => c.type === ChartDataSectionType.AGGREGATE,
      );

      const row = metrics.shift();
      const minimalRowConfig = [...aggTypeSections]
        .filter(section => {
          return isUnderUpperBound(
            section?.limit,
            (section?.rows || []).length + 1,
          );
        })
        .sort((a, b) => {
          if (
            reachLowerBoundCount(a?.limit, a?.rows?.length) !==
            reachLowerBoundCount(b?.limit, b?.rows?.length)
          ) {
            return (
              reachLowerBoundCount(b?.limit, b?.rows?.length) -
              reachLowerBoundCount(a?.limit, a?.rows?.length)
            );
          }
          return (a?.rows?.length || 0) - (b?.rows?.length || 0);
        })?.[0];
      if (minimalRowConfig && row) {
        minimalRowConfig.rows = (minimalRowConfig.rows || []).concat([row]);
      }
    }
  }

  return targetConfig!;
};

export function isInRange(limit?: ChartDataConfig['limit'], count: number = 0) {
  return cond(
    [isEmpty, true],
    [isNumerical, curry(isNumericEqual)(count)],
    [isPairArray, curry(isInPairArrayRange)(count)],
  )(limit, true);
}

export function isUnderUpperBound(
  limit?: ChartDataConfig['limit'],
  count: number = 0,
) {
  return cond(
    [isEmpty, true],
    [isNumerical, limit => limit >= +count],
    [isPairArray, limit => count <= +limit[1]],
  )(limit, true);
}

export function reachLowerBoundCount(
  limit?: ChartDataConfig['limit'],
  count: number = 0,
) {
  return cond(
    [isEmpty, 0],
    [isNumerical, limit => limit - count],
    [isPairArray, limit => +limit[0] - count],
  )(limit, 0);
}

export function getColumnRenderOriginName(c?: ChartDataSectionField) {
  if (!c) {
    return '[unknown]';
  }
  if (c.aggregate === AggregateFieldActionType.NONE) {
    return c.colName;
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
  const HierarchyModel = 'hierarchy' in jsonObj ? jsonObj.hierarchy : jsonObj;
  return Object.keys(HierarchyModel || {}).flatMap(colKey => {
    const column = HierarchyModel[colKey];
    if (!isEmptyArray(column?.children)) {
      return column.children.map(c => ({
        ...c,
        id: c.name,
        category: ChartDataViewFieldCategory.Field,
      }));
    }
    return {
      ...column,
      id: colKey,
      category: ChartDataViewFieldCategory.Field,
    };
  });
}

export function mergeChartStyleConfigs(
  target?: ChartStyleConfig[],
  source?: ChartStyleConfigDTO[],
  options = { useDefault: true },
): ChartStyleConfig[] | undefined {
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

// TODO(Stephen): tobe delete after use ChartDataSet Model in charts
// 兼容 impala 聚合函数小写问题
export const filterSqlOperatorName = (requestParams, widgetData) => {
  const sqlOperatorNameList = requestParams.aggregators.map(aggConfig =>
    aggConfig.sqlOperator?.toLocaleLowerCase(),
  );
  if (!sqlOperatorNameList?.length) return widgetData;
  widgetData?.columns?.forEach(item => {
    const index = item.name.indexOf('(');
    const sqlOperatorName = item.name.slice(0, index);
    sqlOperatorNameList.includes(sqlOperatorName) &&
      (item.name =
        sqlOperatorName.toLocaleUpperCase() + item.name.slice(index));
  });
  return widgetData;
};

// 获取当前echart坐标轴区域的宽度
export function getAxisLengthByConfig(config: ChartCommonConfig) {
  const { chart, xAxis, yAxis, grid, series, yAxisNames, horizon } = config;
  const axisOpts = !horizon ? xAxis : yAxis;
  // datart 布局配置分为百分比和像素
  const getPositionLengthInfo = (
    positionConfig: string | number,
  ): {
    length: number;
    type: 'percent' | 'px';
  } => {
    if (typeof positionConfig === 'string') {
      const lengthPercentInt = parseInt(positionConfig.replace('%', ''), 10);
      if (isNaN(lengthPercentInt)) {
        throw new Error(`${positionConfig} is not a number`);
      }
      return {
        length: lengthPercentInt / 100,
        type: 'percent',
      };
    }
    return {
      length: positionConfig,
      type: 'px',
    };
  };

  // 获取坐标轴宽度
  const getAxisWidth = (YAxisLength: number): number => {
    return (Array.isArray(axisOpts) ? axisOpts : [axisOpts]).reduce(
      (prev, item) => {
        const { fontSize, show } = item.axisLabel;
        // 预留一个字符长度
        const axisLabelMaxWidth = show ? (YAxisLength + 1) * fontSize : 0;
        prev += axisLabelMaxWidth;
        return prev;
      },
      0,
    );
  };

  const { containerLabel, left, right } = grid;

  // 找到轴上最大的数字长度
  let foundMaxAxisLength = 0;

  if (containerLabel && !horizon) {
    foundMaxAxisLength = series.reduce((prev, sery) => {
      sery?.data?.forEach(item => {
        yAxisNames.forEach(name => {
          if (item.name === name) {
            const yNumStr = `${item[0]}`;
            if (yNumStr.length > prev) {
              prev = yNumStr.length;
            }
          }
        });
      });
      return prev;
    }, 0);
  }

  const axisLabelMaxWidth = getAxisWidth(foundMaxAxisLength);

  const left_ = getPositionLengthInfo(left);
  const right_ = getPositionLengthInfo(right);

  const containerWidth = chart.getWidth();

  // 左右边距
  const leftWidth =
    left_.type === 'px' ? left_.length : containerWidth * left_.length;
  const rightWidth =
    right_.type === 'px' ? right_.length : containerWidth * right_.length;

  // 坐标轴区域宽度 = 容器宽度 - 最大字符所占长度 - 左右边距
  return containerWidth - axisLabelMaxWidth - leftWidth - rightWidth;
}
