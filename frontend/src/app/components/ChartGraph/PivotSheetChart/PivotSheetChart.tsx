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

import { Data, DefaultCellTheme, Meta, SortParam, Style } from '@antv/s2';
import { ChartDataSectionType, SortActionType } from 'app/constants';
import { ChartDrillOption } from 'app/models/ChartDrillOption';
import ReactChart from 'app/models/ReactChart';
import {
  ChartConfig,
  ChartDataConfig,
  ChartDataSectionField,
  ChartStyleConfig,
} from 'app/types/ChartConfig';
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import {
  getColumnRenderName,
  getStyles,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { isUndefined } from 'utils/object';
import { PIVOT_THEME_LIST } from '../../FormGenerator/Customize/PivotSheetTheme/theme';
import AntVS2Wrapper from './AntVS2Wrapper';
import Config from './config';
import { AndvS2Config } from './types';

class PivotSheetChart extends ReactChart {
  static icon = `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' aria-hidden='true' role='img' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24'><path d='M10 8h11V5c0-1.1-.9-2-2-2h-9v5zM3 8h5V3H5c-1.1 0-2 .9-2 2v3zm2 13h3V10H3v9c0 1.1.9 2 2 2zm8 1l-4-4l4-4zm1-9l4-4l4 4zm.58 6H13v-2h1.58c1.33 0 2.42-1.08 2.42-2.42V13h2v1.58c0 2.44-1.98 4.42-4.42 4.42z' fill='gray'/></svg>`;

  useIFrame = false;
  isISOContainer = 'piovt-sheet';
  config = Config;
  chart: any = null;
  updateOptions: any = {};
  oldRowsConfig: ChartDataSectionField[] = [];
  hierarchyCollapse: boolean = true;
  drillLevel: number = 0;
  collapsedRows: Record<string, boolean> = {};

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
      options.drillOption,
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

  onUnMount(options: any, context?: any): void {
    this.oldRowsConfig = [];
    this.hierarchyCollapse = true;
    this.drillLevel = 0;
    this.collapsedRows = {};
    this.adapter?.unmount();
  }

  getOptions(
    context,
    dataset: ChartDataSetDTO,
    config: ChartConfig,
    drillOption: ChartDrillOption,
  ): AndvS2Config {
    if (!dataset || !config) {
      return {
        options: {},
      };
    }

    const dataConfigs: ChartDataConfig[] = config.datas || [];
    const styleConfigs = config.styles || [];
    const settingConfigs = config.settings || [];
    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    const rowSectionConfigRows: ChartDataSectionField[] = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'row')
      .flatMap(config => config.rows || []);

    const columnSectionConfigRows: ChartDataSectionField[] = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'column')
      .flatMap(config => config.rows || []);

    const metricsSectionConfigRows: ChartDataSectionField[] = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);

    const infoSectionConfigRows: ChartDataSectionField[] = dataConfigs
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
    const [summaryAggregation] = getStyles(
      settingConfigs,
      ['summaryAggregation'],
      ['aggregation'],
    );
    const [calcSubAggregation] = getStyles(
      settingConfigs,
      ['calcSubAggregation'],
      ['aggregation'],
    );
    const [
      enableRowTotal,
      rowTotalPosition,
      enableRowSubTotal,
      rowSubTotalPosition,
    ] = getStyles(
      settingConfigs,
      ['rowSummary'],
      ['enableTotal', 'totalPosition', 'enableSubTotal', 'subTotalPosition'],
    );
    const [
      enableColTotal,
      colTotalPosition,
      enableColSubTotal,
      colSubTotalPosition,
    ] = getStyles(
      settingConfigs,
      ['colSummary'],
      ['enableTotal', 'totalPosition', 'enableSubTotal', 'subTotalPosition'],
    );

    if (!!enableExpandRow) {
      if (
        JSON.stringify(this.oldRowsConfig) !==
        JSON.stringify(rowSectionConfigRows)
      ) {
        this.getCollapsedRows(rowSectionConfigRows, chartDataSet, true);
        this.oldRowsConfig = rowSectionConfigRows;
      }
      this.getCollapsedRows(rowSectionConfigRows, chartDataSet);
    } else {
      if (Object.keys(this.collapsedRows).length) {
        this.oldRowsConfig = [];
        this.hierarchyCollapse = true;
        this.drillLevel = 0;
        this.collapsedRows = {};
      }
    }

    return {
      options: {
        hierarchyType: enableExpandRow ? 'tree' : 'grid',
        hierarchyCollapse: this.hierarchyCollapse,
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
            showGrandTotals: Boolean(enableRowTotal),
            reverseLayout: Boolean(rowTotalPosition),
            showSubTotals: Boolean(enableRowSubTotal),
            reverseSubLayout: Boolean(rowSubTotalPosition),
            subTotalsDimensions: [
              rowSectionConfigRows.map(
                chartDataSet.getFieldKey,
                chartDataSet,
              )?.[0],
            ],
            label: context.translator('summary.total'),
            subLabel: context.translator('summary.subTotal'),
            calcTotals: {
              aggregation: summaryAggregation,
            },
            calcSubTotals: {
              aggregation: calcSubAggregation,
            },
          },
          col: {
            showGrandTotals: Boolean(enableColTotal),
            reverseLayout: Boolean(colTotalPosition),
            showSubTotals: Boolean(enableColSubTotal),
            reverseSubLayout: Boolean(colSubTotalPosition),
            subTotalsDimensions: [
              columnSectionConfigRows.map(
                chartDataSet.getFieldKey,
                chartDataSet,
              )?.[0],
            ],
            label: context.translator('summary.total'),
            subLabel: context.translator('summary.subTotal'),
            calcTotals: {
              aggregation: summaryAggregation,
            },
            calcSubTotals: {
              aggregation: calcSubAggregation,
            },
          },
        },
        supportCSSTransform: true,
        style: this.getRowAndColStyle(
          styleConfigs,
          metricsSectionConfigRows,
          columnSectionConfigRows,
          chartDataSet,
        ),
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
          valueInCols: !!enableExpandRow || !!metricNameShowIn,
        },
        meta: rowSectionConfigRows
          .concat(columnSectionConfigRows)
          .concat(metricsSectionConfigRows)
          .concat(infoSectionConfigRows)
          .map(config => {
            return {
              field: chartDataSet.getFieldKey(config),
              name: getColumnRenderName(config),
              formatter: (value?: string | number) =>
                toFormattedValue(value, config?.format),
            } as Meta;
          }),
        data: chartDataSet?.map(row => row.convertToObject()) as Data[],
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
        background: {
          opacity: 0,
        },
      },
      palette: {
        basicColors: this.getThemeColorList(styleConfigs),
        semanticColors: {
          red: '#FF4D4F',
          green: '#29A294',
        },
      },
      eventConfig: {
        onRowCellCollapseTreeRows: ({ isCollapsed, node }) => {
          this.collapsedRows[node.id] = isCollapsed;
          this.changeDrillConfig(rowSectionConfigRows, drillOption);
        },
        onCollapseRowsAll: hierarchyCollapse => {
          this.hierarchyCollapse = !hierarchyCollapse;
          Object.keys(this.collapsedRows).forEach(k => {
            this.collapsedRows[k] = this.hierarchyCollapse;
          });
          this.changeDrillConfig(rowSectionConfigRows, drillOption);
        },
      },
    };
  }

  changeDrillConfig(
    rowSectionConfigRows: ChartDataSectionField[],
    drillOption: ChartDrillOption,
  ) {
    const collapsedConfig: Record<string, boolean[]> = {};
    Object.keys(this.collapsedRows).forEach(k => {
      const pathArr = k.split('[&]');
      if (isUndefined(collapsedConfig[pathArr.length])) {
        collapsedConfig[pathArr.length] = [this.collapsedRows[k]];
      } else {
        collapsedConfig[pathArr.length].push(this.collapsedRows[k]);
      }
    });
    let level: number = 0;
    while (level < rowSectionConfigRows.length) {
      if (
        collapsedConfig[level + 2] &&
        collapsedConfig[level + 2].every(c => c)
      ) {
        break;
      }
      level++;
    }
    if (this.drillLevel < level) {
      let index = 0;
      while (level - this.drillLevel > index) {
        drillOption?.expandDown();
        index++;
      }
    } else if (this.drillLevel > level) {
      drillOption?.expandUp(rowSectionConfigRows[level]);
    }
    this.drillLevel = level;
    this.mouseEvents
      ?.find(v => v.name === 'click')
      ?.callback({
        seriesName: 'drillOptionChange',
        value: drillOption,
      });
  }

  getCollapsedRows(
    rowSectionConfigRows: ChartDataSectionField[],
    chartDataSet: IChartDataSet<string>,
    initState?: boolean,
  ) {
    chartDataSet.forEach(dc => {
      let path = 'root';
      rowSectionConfigRows.forEach((rc, index) => {
        if (
          !isUndefined(dc.getCell(rc)) &&
          index < rowSectionConfigRows.length - 1
        ) {
          path = path + '[&]' + dc.getCell(rc);
          this.collapsedRows[path] = !isUndefined(initState)
            ? Boolean(initState)
            : isUndefined(this.collapsedRows?.[path])
            ? this.hierarchyCollapse
            : this.collapsedRows[path];
        }
      });
    });
    if (Object.values(this.collapsedRows).every(v => v)) {
      this.hierarchyCollapse = true;
    } else if (Object.values(this.collapsedRows).every(v => !v)) {
      this.hierarchyCollapse = false;
    }
  }

  private getThemeColorList(style: ChartStyleConfig[]): Array<string> {
    const [basicColors] = getStyles(style, ['theme'], ['themeType']);
    return basicColors?.colors || PIVOT_THEME_LIST[basicColors?.themeType || 0];
  }

  private getRowAndColStyle(
    style: ChartStyleConfig[],
    metricsSectionConfigRows: ChartDataSectionField[],
    columnSectionConfigRows: ChartDataSectionField[],
    chartDataSet: IChartDataSet<string>,
  ): Partial<Style> {
    const [bodyHeight, bodyWidth] = getStyles(
      style,
      ['tableBodyStyle'],
      ['height', 'width'],
    );

    const [headerHeight, headerWidth] = getStyles(
      style,
      ['tableHeaderStyle'],
      ['height', 'width'],
    );
    const [enableExpandRow, metricNameShowIn] = getStyles(
      style,
      ['style'],
      ['enableExpandRow', 'metricNameShowIn'],
    );
    return {
      colCfg: {
        height: headerHeight || 30,
        widthByFieldValue:
          !!enableExpandRow || !!metricNameShowIn
            ? metricsSectionConfigRows.reduce((allConfig, config) => {
                return {
                  ...allConfig,
                  [chartDataSet.getFieldKey(config)]: bodyWidth,
                };
              }, {})
            : chartDataSet.reduce((dataSetAllConfig, dataSetConfig) => {
                return {
                  ...dataSetAllConfig,
                  [dataSetConfig?.getCell(
                    columnSectionConfigRows[columnSectionConfigRows.length - 1],
                  )]: bodyWidth,
                };
              }, {}),
      },
      rowCfg: {
        width: headerWidth,
      },
      cellCfg: {
        height: bodyHeight || 30,
      },
      collapsedRows: enableExpandRow ? this.collapsedRows : {},
    };
  }

  private getTableSorters(
    sectionConfigRows: ChartDataSectionField[],
    chartDataSet: IChartDataSet<string>,
  ): Array<SortParam> {
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
      .filter(Boolean) as Array<SortParam>;
  }

  private getBodyStyle(styleConfigs: ChartStyleConfig[]): DefaultCellTheme {
    const [bodyFont, bodyTextAlign] = getStyles(
      styleConfigs,
      ['tableBodyStyle'],
      ['font', 'align'],
    );
    return {
      text: {
        fontFamily: bodyFont?.fontFamily,
        fontSize: bodyFont?.fontSize,
        fontWeight: bodyFont?.fontWeight,
        textAlign: bodyTextAlign,
      },
    };
  }

  private getHeaderStyle(styleConfigs: ChartStyleConfig[]): DefaultCellTheme {
    const [headerFont, headerTextAlign] = getStyles(
      styleConfigs,
      ['tableHeaderStyle'],
      ['font', 'align'],
    );
    return {
      text: {
        fontFamily: headerFont?.fontFamily,
        fontSize: headerFont?.fontSize,
        fontWeight: headerFont?.fontWeight,
        textAlign: headerTextAlign,
      },
      bolderText: {
        fontFamily: headerFont?.fontFamily,
        fontSize: headerFont?.fontSize,
        fontWeight: headerFont?.fontWeight,
        textAlign: headerTextAlign,
      },
    };
  }
}

export default PivotSheetChart;
