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

import { ChartDataSectionType } from 'app/constants';
import {
  ChartConfig,
  ChartDataSectionField,
  ChartStyleConfig,
  LabelStyle,
  LegendStyle,
  SelectedItem,
  SeriesStyle,
  XAxis,
  XAxisColumns,
  YAxis,
} from 'app/types/ChartConfig';
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import {
  getAxisLabel,
  getAxisLine,
  getAxisTick,
  getColorizeGroupSeriesColumns,
  getColumnRenderName,
  getDrillableRows,
  getExtraSeriesDataFormat,
  getExtraSeriesRowData,
  getGridStyle,
  getNameTextStyle,
  getReference2,
  getSeriesTooltips4Rectangular2,
  getSplitLine,
  getStyles,
  hadAxisLabelOverflowConfig,
  setOptionsByAxisLabelOverflow,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import { UniqArray } from 'utils/object';
import Chart from '../../../models/Chart';
import { ChartDrillOption } from '../../../models/ChartDrillOption';
import Config from './config';
import { Series } from './types';

class BasicLineChart extends Chart {
  config = Config;
  chart: any = null;
  selectable = true;
  selectedItems = [];

  protected isArea = false;
  protected isStack = false;

  constructor(props?) {
    super(
      props?.id || 'line',
      props?.name || 'viz.palette.graph.names.lineChart',
      props?.icon || 'chart-line',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: 1,
        aggregate: [1, 999],
      },
    ];
  }

  onMount(options, context): void {
    if (options.containerId === undefined || !context.document) {
      return;
    }

    this.chart = init(
      context.document.getElementById(options.containerId),
      'default',
    );
    this.chart.getZr().on('click', this.clearAllSelectedItems.bind(this));
    this.mouseEvents?.forEach(event => {
      this.chart.on(event.name, event.callback);
    });
  }

  onUpdated(props, context): void {
    if (!props.dataset || !props.dataset.columns || !props.config) {
      return;
    }
    if (!this.isMatchRequirement(props.config)) {
      this.chart?.clear();
      return;
    }
    this.selectedItems = props.selectedItems;
    const newOptions = this.getOptions(
      props.dataset,
      props.config,
      props.drillOption,
      props.selectedItems,
    );
    this.chart?.setOption(Object.assign({}, newOptions), true);
  }

  onResize(opt: any, context): void {
    this.chart?.resize({ width: context?.width, height: context?.height });
    hadAxisLabelOverflowConfig(this.chart?.getOption()) &&
      this.onUpdated(opt, context);
  }

  onUnMount(): void {
    this.chart.getZr().off('click', this.clearAllSelectedItems.bind(this));
    this.chart?.dispose();
  }

  clearAllSelectedItems(e: Event) {
    if (!e.target && this.selectedItems.length) {
      this.mouseEvents
        ?.find(v => v.name === 'click')
        ?.callback({
          interactionType: 'unselect',
        });
    }
  }

  private getOptions(
    dataset: ChartDataSetDTO,
    config: ChartConfig,
    drillOption?: ChartDrillOption,
    selectedItems?: SelectedItem[],
  ) {
    const styleConfigs = config.styles || [];
    const dataConfigs = config.datas || [];
    const settingConfigs = config.settings || [];
    const groupConfigs: ChartDataSectionField[] = getDrillableRows(
      dataConfigs,
      drillOption,
    );
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Aggregate)
      .flatMap(config => config.rows || []);
    const colorConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Color)
      .flatMap(config => config.rows || []);
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Info)
      .flatMap(config => config.rows || []);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    const xAxisColumns: XAxisColumns[] = [
      {
        type: 'category',
        tooltip: { show: true },
        data: UniqArray(
          chartDataSet?.map(row => {
            return groupConfigs.map(g => row.getCell(g)).join('-');
          }),
        ),
      },
    ];
    const series = this.getSeries(
      settingConfigs,
      styleConfigs,
      colorConfigs,
      chartDataSet,
      groupConfigs,
      aggregateConfigs,
      infoConfigs,
      xAxisColumns,
      selectedItems,
    );
    const yAxisNames: string[] = aggregateConfigs.map(getColumnRenderName);

    // @TM 溢出自动根据bar长度设置标尺
    const option = setOptionsByAxisLabelOverflow({
      chart: this.chart,
      grid: getGridStyle(styleConfigs),
      xAxis: this.getXAxis(styleConfigs, xAxisColumns),
      yAxis: this.getYAxis(styleConfigs, yAxisNames),
      series,
      yAxisNames,
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter: this.getTooltipFormmaterFunc(
          chartDataSet,
          groupConfigs,
          aggregateConfigs,
          colorConfigs,
          infoConfigs,
        ),
      },
      legend: this.getLegendStyle(
        styleConfigs,
        series?.map(s => s.name),
      ),
      ...option,
    };
  }

  private getSeries(
    settingConfigs: ChartStyleConfig[],
    styleConfigs: ChartStyleConfig[],
    colorConfigs: ChartDataSectionField[],
    chartDataSet: IChartDataSet<string>,
    groupConfigs: ChartDataSectionField[],
    aggregateConfigs: ChartDataSectionField[],
    infoConfigs: ChartDataSectionField[],
    xAxisColumns: XAxisColumns[],
    selectedItems?: SelectedItem[],
  ): Series[] {
    if (!colorConfigs?.length) {
      return aggregateConfigs.map((aggConfig, acIndex) => {
        const color = aggConfig?.color?.start;
        return {
          name: getColumnRenderName(aggConfig),
          type: 'line',
          sampling: 'average',
          areaStyle: this.isArea
            ? {
                color,
                opacity: selectedItems?.length ? 0.4 : undefined,
              }
            : undefined,
          stack: this.isStack ? 'total' : undefined,
          data: chartDataSet.map((dc, dcIndex) => ({
            ...getExtraSeriesRowData(dc),
            ...getExtraSeriesDataFormat(aggConfig?.format),
            ...this.getLineSelectItemStyle(
              acIndex,
              dcIndex,
              selectedItems || [],
            ),
            value: dc.getCell(aggConfig),
          })),
          itemStyle: {
            color,
          },
          lineStyle: {
            opacity: selectedItems?.length ? 0.5 : 1,
          },
          ...this.getLabelStyle(styleConfigs),
          ...this.getSeriesStyle(styleConfigs),
          ...getReference2(settingConfigs, chartDataSet, aggConfig, false),
        };
      });
    }

    const secondGroupInfos = getColorizeGroupSeriesColumns(
      chartDataSet,
      colorConfigs[0],
    );
    const xAxisConfig = groupConfigs?.[0];
    return aggregateConfigs.flatMap((aggConfig, acIndex) => {
      return secondGroupInfos.map((sgCol, sgcIndex) => {
        const k = Object.keys(sgCol)[0];
        const dataSet = sgCol[k];

        const itemStyleColor = colorConfigs?.[0]?.color?.colors?.find(
          c => c.key === k,
        );
        return {
          name: k,
          type: 'line',
          sampling: 'average',
          areaStyle: this.isArea ? {} : undefined,
          stack: this.isStack ? 'total' : undefined,
          itemStyle: {
            normal: { color: itemStyleColor?.value },
          },
          data: xAxisColumns[0].data.map((d, dcIndex) => {
            const row = dataSet.find(r => r.getCell(xAxisConfig) === d)!;
            return {
              ...getExtraSeriesRowData(row),
              ...getExtraSeriesDataFormat(aggConfig?.format),
              ...this.getLineSelectItemStyle(
                sgcIndex,
                acIndex * secondGroupInfos.length + dcIndex,
                selectedItems || [],
              ),
              name: getColumnRenderName(aggConfig),
              value: row?.getCell(aggConfig),
            };
          }),
          ...this.getLabelStyle(styleConfigs),
          ...this.getSeriesStyle(styleConfigs),
        };
      });
    });
  }

  getLineSelectItemStyle(
    comIndex: string | number,
    dcIndex: string | number,
    selectList: SelectedItem[],
  ) {
    const findIndex = selectList.findIndex(
      v => v.index === comIndex + ',' + dcIndex,
    );
    return findIndex >= 0 ? { symbol: 'circle', symbolSize: 10 } : {};
  }

  private getYAxis(styles, yAxisNames): YAxis {
    const [
      showAxis,
      inverse,
      lineStyle,
      showLabel,
      font,
      showTitleAndUnit,
      unitFont,
      nameLocation,
      nameGap,
      nameRotate,
      min,
      max,
    ] = getStyles(
      styles,
      ['yAxis'],
      [
        'showAxis',
        'inverseAxis',
        'lineStyle',
        'showLabel',
        'font',
        'showTitleAndUnit',
        'unitFont',
        'nameLocation',
        'nameGap',
        'nameRotate',
        'min',
        'max',
      ],
    );
    const [showHorizonLine, horizonLineStyle] = getStyles(
      styles,
      ['splitLine'],
      ['showHorizonLine', 'horizonLineStyle'],
    );
    const name = showTitleAndUnit ? yAxisNames.join(' / ') : null;

    return {
      type: 'value',
      name,
      nameLocation,
      nameGap,
      nameRotate,
      inverse,
      min,
      max,
      axisLabel: getAxisLabel(showLabel, font),
      axisLine: getAxisLine(showAxis, lineStyle),
      axisTick: getAxisTick(showLabel, lineStyle),
      nameTextStyle: getNameTextStyle(
        unitFont?.fontFamily,
        unitFont?.fontSize,
        unitFont?.color,
      ),
      splitLine: getSplitLine(showHorizonLine, horizonLineStyle),
    };
  }

  private getXAxis(styles, xAxisColumns): XAxis {
    const axisColumnInfo = xAxisColumns[0];
    const [
      showAxis,
      inverse,
      lineStyle,
      showLabel,
      font,
      rotate,
      showInterval,
      interval,
      overflow,
    ] = getStyles(
      styles,
      ['xAxis'],
      [
        'showAxis',
        'inverseAxis',
        'lineStyle',
        'showLabel',
        'font',
        'rotate',
        'showInterval',
        'interval',
        'overflow',
      ],
    );
    const [showVerticalLine, verticalLineStyle] = getStyles(
      styles,
      ['splitLine'],
      ['showVerticalLine', 'verticalLineStyle'],
    );

    return {
      ...axisColumnInfo,
      inverse,
      axisLabel: getAxisLabel(
        showLabel,
        font,
        showInterval ? interval : null,
        rotate,
        overflow,
      ),
      axisLine: getAxisLine(showAxis, lineStyle),
      axisTick: getAxisTick(showLabel, lineStyle),
      splitLine: getSplitLine(showVerticalLine, verticalLineStyle),
    };
  }

  private getLegendStyle(styles, seriesNames): LegendStyle {
    const [show, type, font, legendPos, selectAll, height] = getStyles(
      styles,
      ['legend'],
      ['showLegend', 'type', 'font', 'position', 'selectAll', 'height'],
    );
    let positions = {};
    let orient = '';

    switch (legendPos) {
      case 'top':
        orient = 'horizontal';
        positions = { top: 8, left: 8, right: 8, height: 32 };
        break;
      case 'bottom':
        orient = 'horizontal';
        positions = { bottom: 8, left: 8, right: 8, height: 32 };
        break;
      case 'left':
        orient = 'vertical';
        positions = { left: 8, top: 16, bottom: 24, width: 96 };
        break;
      default:
        orient = 'vertical';
        positions = { right: 8, top: 16, bottom: 24, width: 96 };
        break;
    }
    const selected = seriesNames.reduce(
      (obj, name) => ({
        ...obj,
        [name]: selectAll,
      }),
      {},
    );

    return {
      ...positions,
      show,
      type,
      orient,
      height: height || null,
      selected,
      data: seriesNames,
      textStyle: font,
      itemStyle: {
        opacity: 1,
      },
      lineStyle: {
        opacity: 1,
      },
    };
  }

  private getLabelStyle(styles): LabelStyle {
    const [show, position, font] = getStyles(
      styles,
      ['label'],
      ['showLabel', 'position', 'font'],
    );
    return {
      label: {
        show,
        position,
        ...font,
        formatter: params => {
          const { value, data } = params;
          const formattedValue = toFormattedValue(value, data.format);
          const labels: string[] = [];
          labels.push(formattedValue);
          return labels.join('\n');
        },
      },
      labelLayout: { hideOverlap: true },
    };
  }

  private getSeriesStyle(styles): SeriesStyle {
    const [smooth, step, connectNulls] = getStyles(
      styles,
      ['graph'],
      ['smooth', 'step', 'connectNulls'],
    );
    return { smooth, step, connectNulls };
  }

  private getTooltipFormmaterFunc(
    chartDataSet,
    groupConfigs,
    aggregateConfigs,
    colorConfigs,
    infoConfigs,
  ): (params) => string {
    return seriesParams => {
      const params = Array.isArray(seriesParams)
        ? seriesParams
        : [seriesParams];
      return getSeriesTooltips4Rectangular2(
        chartDataSet,
        params[0],
        groupConfigs,
        colorConfigs,
        aggregateConfigs,
        infoConfigs,
      );
    };
  }
}

export default BasicLineChart;
