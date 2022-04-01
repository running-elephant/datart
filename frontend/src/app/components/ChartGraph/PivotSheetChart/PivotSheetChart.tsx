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

import { ChartDataSectionType, SortActionType } from 'app/constants';
import ReactChart from 'app/models/ReactChart';
import {
  ChartConfig,
  ChartDataSectionField,
  ChartStyleConfig,
} from 'app/types/ChartConfig';
import ChartDataSetDTO, {
  IChartDataSet,
  IChartDataSetRow,
} from 'app/types/ChartDataSet';
import {
  getColumnRenderName,
  getStyles,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { isNumber } from 'app/utils/number';
import groupBy from 'lodash/groupBy';
import AntVS2Wrapper from './AntVS2Wrapper';
import Config from './config';
import { TableSorters, TextStyle } from './types';

class PivotSheetChart extends ReactChart {
  static icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M10 8h11V5c0-1.1-.9-2-2-2h-9v5zM3 8h5V3H5c-1.1 0-2 .9-2 2v3zm2 13h3V10H3v9c0 1.1.9 2 2 2zm8 1l-4-4l4-4zm1-9l4-4l4 4zm.58 6H13v-2h1.58c1.33 0 2.42-1.08 2.42-2.42V13h2v1.58c0 2.44-1.98 4.42-4.42 4.42z" fill="gray"/></svg>`;

  useIFrame = false;
  isISOContainer = 'piovt-sheet';
  config = Config;
  chart: any = null;
  updateOptions: any = {};

  constructor() {
    super(AntVS2Wrapper, {
      id: 'piovt-sheet', // TODO(Stephen): should fix typo pivot
      name: 'viz.palette.graph.names.pivotSheet',
      icon: PivotSheetChart.icon,
    });
    this.meta.requirements = [{}];
  }

  onUpdated(options, context): void {
    if (!this.isMatchRequirement(options.config)) {
      this.adapter?.unmount();
      return;
    }

    this.updateOptions = this.getOptions(
      context,
      options.dataset,
      options.config,
    );
    this.adapter?.updated(this.updateOptions);
  }

  onResize(_, context) {
    if (this.updateOptions?.options) {
      this.updateOptions.options = Object.assign(
        {
          ...this.updateOptions.options,
        },
        { width: context.width, height: context.height },
      );
      this.adapter?.updated(this.updateOptions);
    }
  }

  getOptions(context, dataset?: ChartDataSetDTO, config?: ChartConfig) {
    if (!dataset || !config) {
      return {};
    }

    const dataConfigs = config.datas || [];
    const styleConfigs = config.styles || [];
    const settingConfigs = config.settings || [];
    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

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

    const [
      enableExpandRow,
      enableHoverHighlight,
      enableSelectedHighlight,
      metricNameShowIn,
    ] = getStyles(
      styleConfigs,
      ['style'],
      [
        'enableExpandRow',
        'enableHoverHighlight',
        'enableSelectedHighlight',
        'metricNameShowIn',
      ],
    );
    const [enableTotal, totalPosition, enableSubTotal, subTotalPosition] =
      getStyles(
        settingConfigs,
        ['rowSummary'],
        ['enableTotal', 'totalPosition', 'enableSubTotal', 'subTotalPosition'],
      );

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
            subTotalsDimensions: rowSectionConfigRows.map(
              chartDataSet.getFieldKey,
              chartDataSet,
            )?.[0],
            label: context.translator('summary.total'),
            subLabel: context.translator('summary.subTotal'),
          },
        },
        supportCSSTransform: true,
      },
      dataCfg: {
        fields: {
          rows: rowSectionConfigRows.map(config =>
            chartDataSet.getFieldKey(config),
          ),
          columns: columnSectionConfigRows.map(config =>
            chartDataSet.getFieldKey(config),
          ),
          values: metricsSectionConfigRows.map(config =>
            chartDataSet.getFieldKey(config),
          ),
          valueInCols: !!metricNameShowIn,
        },
        meta: rowSectionConfigRows
          .concat(columnSectionConfigRows)
          .concat(metricsSectionConfigRows)
          .concat(infoSectionConfigRows)
          .map(config => {
            return {
              field: chartDataSet.getFieldKey(config),
              name: getColumnRenderName(config),
              formatter: value => toFormattedValue(value, config?.format),
            };
          }),
        data: chartDataSet?.map(row => row.convertToObject()),
        totalData: this.getCalcSummaryValues(
          chartDataSet,
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
          chartDataSet,
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

  private getTableSorters(
    sectionConfigRows: ChartDataSectionField[],
    chartDataSet: IChartDataSet<string>,
  ): TableSorters[] {
    return sectionConfigRows
      .map(config => {
        if (!config?.sort?.type || config?.sort?.type === SortActionType.NONE) {
          return null;
        }
        const isASC = config.sort.type === SortActionType.ASC;
        return {
          sortFieldId: chartDataSet.getFieldKey(config),
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

  private getBodyStyle(styleConfigs: ChartStyleConfig[]): TextStyle {
    const [bodyFont, oddBgColor, evenBgColor, bodyTextAlign] = getStyles(
      styleConfigs,
      ['tableBodyStyle'],
      ['font', 'oddBgColor', 'evenBgColor', 'align'],
    );
    return {
      cell: {
        crossBackgroundColor: evenBgColor,
        backgroundColor: oddBgColor,
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

  private getHeaderStyle(styleConfigs: ChartStyleConfig[]): TextStyle {
    const [headerFont, headerBgColor, headerTextAlign] = getStyles(
      styleConfigs,
      ['tableHeaderStyle'],
      ['font', 'bgColor', 'align'],
    );
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
      bolderText: {
        fill: headerFont?.color,
        fontFamily: headerFont?.fontFamily,
        fontSize: headerFont?.fontSize,
        fontWeight: headerFont?.fontWeight,
        textAlign: headerTextAlign,
      },
    };
  }

  private getCalcSummaryValues(
    chartDataSet: IChartDataSet<string>,
    rowSectionConfigRows: ChartDataSectionField[],
    columnSectionConfigRows: ChartDataSectionField[],
    metricsSectionConfigRows: ChartDataSectionField[],
    enableTotal: boolean,
    enableSubTotal: boolean,
  ): { [key: string]: number }[] {
    let summarys: { [key: string]: number }[] = [];
    if (enableTotal) {
      if (!columnSectionConfigRows.length) {
        const rowTotals = metricsSectionConfigRows.map(c => {
          const values = chartDataSet
            .map(row => +row.getCell(c))
            .filter(isNumber);
          return {
            [chartDataSet.getFieldKey(c)]: values?.reduce((a, b) => a + b, 0),
          };
        });
        summarys.push(...rowTotals);
      } else {
        const rowTotals = this.calculateGroupedColumnTotal(
          {},
          columnSectionConfigRows.map(config =>
            chartDataSet.getFieldKey(config),
          ),
          metricsSectionConfigRows,
          chartDataSet,
        );
        summarys.push(...rowTotals);
      }
    }
    if (enableSubTotal) {
      const rowTotals = this.calculateGroupedColumnTotal(
        {},
        [rowSectionConfigRows[0]]
          .concat(columnSectionConfigRows)
          .map(chartDataSet.getFieldKey, chartDataSet),
        metricsSectionConfigRows,
        chartDataSet,
      );
      summarys.push(...rowTotals);
    }
    return summarys;
  }

  private calculateGroupedColumnTotal(
    preObj,
    groupKeys: string[],
    metrics: ChartDataSectionField[],
    datas: Array<IChartDataSetRow<string>>,
  ): { [key: string]: number }[] {
    const _groupKeys = [...(groupKeys || [])];
    const groupKey: string = _groupKeys.shift()!;
    const groupDataSet = groupBy(datas, row => row.getCellByKey(groupKey));

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
          .map(dc => +dc.getCell(metric))
          .filter(isNumber);

        return {
          ...preObj,
          [groupKey]: k,
          [v?.[0]?.getFieldKey(metric)]: values?.reduce((a, b) => a + b, 0),
        };
      });
    });
  }
}

export default PivotSheetChart;
