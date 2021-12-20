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
  ChartConfig,
  ChartDataSectionType,
  SortActionType,
} from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import {
  getColumnRenderName,
  getCustomSortableColumns,
  getValueByColumnKey,
  transfromToObjectArray,
} from 'app/utils/chartHelper';
import { isNumber, toFormattedValue } from 'app/utils/number';
import groupBy from 'lodash/groupBy';
import ReactChart from '../ReactChart';
import AntVS2Wrapper from './AntVS2Wrapper';
import Config from './config';
class PivotSheetChart extends ReactChart {
  static icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M10 8h11V5c0-1.1-.9-2-2-2h-9v5zM3 8h5V3H5c-1.1 0-2 .9-2 2v3zm2 13h3V10H3v9c0 1.1.9 2 2 2zm8 1l-4-4l4-4zm1-9l4-4l4 4zm.58 6H13v-2h1.58c1.33 0 2.42-1.08 2.42-2.42V13h2v1.58c0 2.44-1.98 4.42-4.42 4.42z" fill="currentColor"/></svg>`;

  _useIFrame = false;
  isISOContainer = 'piovt-sheet';
  config = Config;
  chart: any = null;
  tableOptions: {
    dataset?;
    config?;
  } = {};

  constructor() {
    super(AntVS2Wrapper, {
      id: 'piovt-sheet',
      name: '透视表',
      icon: PivotSheetChart.icon,
    });
    this.meta.requirements = [{}];
  }

  onUpdated(options, context): void {
    this.tableOptions = options;

    if (!this.isMatchRequirement(options.config)) {
      this.adapter?.unmount();
      return;
    }

    this.adapter?.updated(
      this.getOptions(context, options.dataset, options.config),
      context,
    );
  }

  onResize(_, context) {
    this.onUpdated(this.tableOptions, context);
  }

  getOptions(context, dataset?: ChartDataset, config?: ChartConfig) {
    if (!dataset || !config) {
      return {};
    }

    const dataConfigs = config.datas || [];
    const styleConfigs = config.styles || [];
    const settingConfigs = config.settings || [];
    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );
    const dataColumns = getCustomSortableColumns(objDataColumns, dataConfigs);

    const rowSectionConfigRows = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'row')
      .flatMap(config => config.rows || []);

    const columnSectionConfigRows = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'column')
      .flatMap(config => config.rows || []);

    const metricsSectionConfigRows = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);

    const infoSectionConfigRows = dataConfigs
      .filter(c => c.type === ChartDataSectionType.INFO)
      .flatMap(config => config.rows || []);

    const enableExpandRow = this.getStyleValue(styleConfigs, [
      'style',
      'enableExpandRow',
    ]);
    const enableHoverHighlight = this.getStyleValue(styleConfigs, [
      'style',
      'enableHoverHighlight',
    ]);
    const enableSelectedHighlight = this.getStyleValue(styleConfigs, [
      'style',
      'enableSelectedHighlight',
    ]);
    const enableTotal = this.getStyleValue(settingConfigs, [
      'rowSummary',
      'enableTotal',
    ]);
    const totalPosition = this.getStyleValue(settingConfigs, [
      'rowSummary',
      'totalPosition',
    ]);
    const enableSubTotal = this.getStyleValue(settingConfigs, [
      'rowSummary',
      'enableSubTotal',
    ]);
    const subTotalPosition = this.getStyleValue(settingConfigs, [
      'rowSummary',
      'subTotalPosition',
    ]);

    return {
      options: {
        hierarchyType: enableExpandRow ? 'tree' : 'grid',
        width: context?.width,
        height: context?.height,
        tooltip: {
          showTooltip: true,
        },
        interaction: {
          hoverHighlight: Boolean(enableHoverHighlight),
          selectedCellsSpotlight: Boolean(enableSelectedHighlight),
        },
        totals: {
          row: {
            showGrandTotals: Boolean(enableTotal),
            reverseLayout: Boolean(totalPosition),
            showSubTotals: Boolean(enableSubTotal),
            reverseSubLayout: Boolean(subTotalPosition),
            subTotalsDimensions:
              rowSectionConfigRows.map(getValueByColumnKey)?.[0],
          },
        },
      },
      dataCfg: {
        fields: {
          rows: rowSectionConfigRows.map(getValueByColumnKey),
          columns: columnSectionConfigRows.map(getValueByColumnKey),
          values: metricsSectionConfigRows.map(getValueByColumnKey),
          valueInCols: true,
        },
        meta: rowSectionConfigRows
          .concat(columnSectionConfigRows)
          .concat(metricsSectionConfigRows)
          .concat(infoSectionConfigRows)
          .map(config => {
            return {
              field: getValueByColumnKey(config),
              name: getColumnRenderName(config),
              formatter: value => toFormattedValue(value, config?.format),
            };
          }),
        data: dataColumns,
        totalData: this.getCalcSummaryValues(
          dataColumns,
          rowSectionConfigRows,
          columnSectionConfigRows,
          metricsSectionConfigRows,
          enableTotal,
          enableSubTotal,
        ),
        sortParams: this.getTableSorters(
          rowSectionConfigRows
            .concat(columnSectionConfigRows)
            .concat(metricsSectionConfigRows),
        ),
      },
      theme: {
        /*
          DATA_CELL = "dataCell",
          HEADER_CELL = "headerCell",
          ROW_CELL = "rowCell",
          COL_CELL = "colCell",
          CORNER_CELL = "cornerCell",
          MERGED_CELL = "mergedCell"
        */
        cornerCell: this.getHeaderStyle(styleConfigs),
        colCell: this.getHeaderStyle(styleConfigs),
        rowCell: this.getHeaderStyle(styleConfigs),
        dataCell: this.getBodyStyle(styleConfigs),
      },
    };
  }

  private getTableSorters(sectionConfigRows) {
    return sectionConfigRows
      .map(config => {
        if (!config?.sort?.type || config?.sort?.type === SortActionType.NONE) {
          return null;
        }
        const isASC = config.sort.type === SortActionType.ASC;
        return {
          sortFieldId: getValueByColumnKey(config),
          sortFunc: params => {
            const { data } = params;
            return data?.sort((a, b) =>
              isASC ? a?.localeCompare(b) : b?.localeCompare(a),
            );
          },
        };
      })
      .filter(Boolean);
  }

  private getBodyStyle(styleConfigs) {
    const bodyFont = this.getStyleValue(styleConfigs, [
      'tableBodyStyle',
      'font',
    ]);
    const bodyBgColor = this.getStyleValue(styleConfigs, [
      'tableBodyStyle',
      'bgColor',
    ]);
    const crossBgColor = this.getStyleValue(styleConfigs, [
      'tableBodyStyle',
      'crossBgColor',
    ]);
    const bodyTextAlign = this.getStyleValue(styleConfigs, [
      'tableBodyStyle',
      'align',
    ]);

    return {
      cell: {
        crossBackgroundColor: crossBgColor,
        backgroundColor: bodyBgColor,
      },
      text: {
        fill: bodyFont?.color,
        fontFamily: bodyFont?.fontFamily,
        fontSize: bodyFont?.fontSize,
        fontWeight: bodyFont?.fontWeight,
        textAlign: bodyTextAlign,
      },
    };
  }

  private getHeaderStyle(styleConfigs) {
    const headerFont = this.getStyleValue(styleConfigs, [
      'tableHeaderStyle',
      'font',
    ]);
    const headerBgColor = this.getStyleValue(styleConfigs, [
      'tableHeaderStyle',
      'bgColor',
    ]);
    const headerTextAlign = this.getStyleValue(styleConfigs, [
      'tableHeaderStyle',
      'align',
    ]);

    return {
      cell: {
        backgroundColor: headerBgColor,
      },
      text: {
        fill: headerFont?.color,
        fontFamily: headerFont?.fontFamily,
        fontSize: headerFont?.fontSize,
        fontWeight: headerFont?.fontWeight,
        textAlign: headerTextAlign,
      },
    };
  }

  private getCalcSummaryValues(
    dataColumns,
    rowSectionConfigRows,
    columnSectionConfigRows,
    metricsSectionConfigRows,
    enableTotal,
    enableSubTotal,
  ) {
    let summarys: any[] = [];
    if (enableTotal) {
      if (!columnSectionConfigRows.length) {
        const rowTotals = metricsSectionConfigRows.map(c => {
          const values = dataColumns
            .map(dc => +dc?.[getValueByColumnKey(c)])
            .filter(isNumber);
          return {
            [getValueByColumnKey(c)]: values?.reduce((a, b) => a + b, 0),
          };
        });
        summarys.push(...rowTotals);
      } else {
        const rowTotals = this.calculateGroupedColumnTotal(
          {},
          columnSectionConfigRows.map(getValueByColumnKey),
          metricsSectionConfigRows,
          dataColumns,
        );
        summarys.push(...rowTotals);
      }
    }
    if (enableSubTotal) {
      const rowTotals = this.calculateGroupedColumnTotal(
        {},
        [rowSectionConfigRows[0]]
          .concat(columnSectionConfigRows)
          .map(getValueByColumnKey),
        metricsSectionConfigRows,
        dataColumns,
      );
      summarys.push(...rowTotals);
    }

    return summarys;
  }

  private calculateGroupedColumnTotal(
    preObj,
    groupKeys,
    metrics: any[],
    datas,
  ) {
    const _groupKeys = [...(groupKeys || [])];
    const groupKey = _groupKeys.shift();
    const groupDataSet = groupBy(datas, groupKey);

    return Object.entries(groupDataSet).flatMap(([k, v]) => {
      if (_groupKeys.length) {
        return this.calculateGroupedColumnTotal(
          Object.assign({}, preObj, { [groupKey]: k }),
          _groupKeys,
          metrics,
          v,
        );
      }
      return metrics.map(metric => {
        const values = (v as any[])
          .map(dc => +dc?.[getValueByColumnKey(metric)])
          .filter(isNumber);
        return {
          ...preObj,
          [groupKey]: k,
          [getValueByColumnKey(metric)]: values?.reduce((a, b) => a + b, 0),
        };
      });
    });
  }
}

export default PivotSheetChart;
