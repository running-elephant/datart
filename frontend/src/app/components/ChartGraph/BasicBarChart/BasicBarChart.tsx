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

import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import {
  getColorizeGroupSeriesColumns,
  getColumnRenderName,
  getExtraSeriesDataFormat,
  getExtraSeriesRowData,
  getGridStyle,
  getReference2,
  getSeriesTooltips4Rectangular2,
  getStyles,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { toFormattedValue, toPrecision } from 'app/utils/number';
import { init } from 'echarts';
import { UniqArray } from 'utils/object';
import Chart from '../models/Chart';
import Config from './config';

class BasicBarChart extends Chart {
  config = Config;
  chart: any = null;

  protected isHorizionDisplay = false;
  protected isStackMode = false;
  protected isPercentageYAxis = false;

  constructor(props?) {
    super(
      props?.id || 'bar',
      props?.name || 'viz.palette.graph.names.barChart',
      props?.icon || 'chart-bar',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: [0, 1],
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
    this.mouseEvents?.forEach(event => {
      this.chart.on(event.name, event.callback);
    });
  }

  onUpdated(options, context): void {
    if (!options.dataset || !options.dataset.columns || !options.config) {
      return;
    }
    if (!this.isMatchRequirement(options.config)) {
      this.chart?.clear();
      return;
    }
    const newOptions = this.getOptions(options.dataset, options.config);
    this.chart?.setOption(Object.assign({}, newOptions), true);
  }

  onUnMount(): void {
    this.chart?.dispose();
  }

  onResize(opt: any, context): void {
    this.chart?.resize({ width: context?.width, height: context?.height });
  }

  getOptions(dataset: ChartDataSetDTO, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const settingConfigs = config.settings;
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);
    const colorConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.COLOR)
      .flatMap(config => config.rows || []);
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.INFO)
      .flatMap(config => config.rows || []);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    const xAxisColumns = (groupConfigs || []).map(config => {
      return {
        type: 'category',
        tooltip: { show: true },
        data: UniqArray(chartDataSet.map(row => row.getCell(config))),
      };
    });
    const yAxisNames = aggregateConfigs.map(getColumnRenderName);
    const series = this.getSeries(
      settingConfigs,
      styleConfigs,
      colorConfigs,
      chartDataSet,
      groupConfigs,
      aggregateConfigs,
      infoConfigs,
      xAxisColumns,
    );

    const axisInfo = {
      xAxis: this.getXAxis(styleConfigs, xAxisColumns),
      yAxis: this.getYAxis(styleConfigs, yAxisNames),
    };
    if (this.isStackMode) {
      this.makeStackSeries(styleConfigs, series);
    }
    if (this.isPercentageYAxis) {
      this.makePercentageSeries(styleConfigs, series);
      this.makePercentageYAxis(axisInfo);
    }
    if (this.isHorizionDisplay) {
      this.makeTransposeAxis(axisInfo);
    }

    return {
      tooltip: {
        trigger: 'item',
        formatter: this.getTooltipFormatterFunc(
          chartDataSet,
          groupConfigs,
          aggregateConfigs,
          colorConfigs,
          infoConfigs,
        ),
      },
      legend: this.getLegendStyle(styleConfigs, series),
      grid: getGridStyle(styleConfigs),
      xAxis: axisInfo.xAxis,
      yAxis: axisInfo.yAxis,
      series,
    };
  }

  private makePercentageYAxis(axisInfo) {
    if (axisInfo.yAxis) {
      axisInfo.yAxis.min = 0;
      axisInfo.yAxis.max = 100;
    }
  }

  private makeTransposeAxis(info) {
    const temp = info.xAxis;
    info.xAxis = info.yAxis;
    info.yAxis = temp;
  }

  private getSeries(
    settingConfigs,
    styleConfigs,
    colorConfigs,
    chartDataSet: IChartDataSet<string>,
    groupConfigs,
    aggregateConfigs,
    infoConfigs,
    xAxisColumns,
  ) {
    const xAxisColumnName = chartDataSet.getFieldKey(groupConfigs?.[0]);
    const yAxisColumnNames = aggregateConfigs.map(config =>
      chartDataSet.getFieldKey(config),
    );
    const colorColumnName = chartDataSet.getFieldKey(colorConfigs[0]);
    const infoColumnNames = infoConfigs.map(config =>
      chartDataSet.getFieldKey(config),
    );

    if (!colorConfigs.length) {
      const flatSeries = aggregateConfigs.map(aggConfig => {
        return {
          ...this.getBarSeiesImpl(
            styleConfigs,
            settingConfigs,
            chartDataSet,
            aggConfig,
          ),
          name: getColumnRenderName(aggConfig),
          data: chartDataSet?.map(dc => ({
            ...getExtraSeriesRowData(dc),
            ...getExtraSeriesDataFormat(aggConfig?.format),
            name: getColumnRenderName(aggConfig),
            value: dc.getCell(aggConfig),
          })),
        };
      });
      return flatSeries;
    }

    const secondGroupInfos = getColorizeGroupSeriesColumns(
      chartDataSet,
      colorColumnName,
      xAxisColumnName,
      yAxisColumnNames,
      infoColumnNames,
    );

    const colorizeGroupedSeries = aggregateConfigs.flatMap(aggConfig => {
      return secondGroupInfos.map(sgCol => {
        const k = Object.keys(sgCol)[0];
        const v = sgCol[k];

        const itemStyleColor = colorConfigs?.[0]?.color?.colors?.find(
          c => c.key === k,
        );

        return {
          ...this.getBarSeiesImpl(
            styleConfigs,
            settingConfigs,
            chartDataSet,
            sgCol,
          ),
          name: k,
          data: xAxisColumns?.[0]?.data?.map(d => {
            const dc = v.find(col => col[xAxisColumnName] === d);
            return {
              ...getExtraSeriesRowData(dc),
              ...getExtraSeriesDataFormat(aggConfig?.format),
              name: getColumnRenderName(aggConfig),
              value: dc?.[chartDataSet.getFieldKey(aggConfig)] || 0,
            };
          }),
          itemStyle: this.getSerieItemStyle(styleConfigs, {
            color: itemStyleColor?.value,
          }),
        };
      });
    });
    return colorizeGroupedSeries;
  }

  private getBarSeiesImpl(
    styleConfigs,
    settingConfigs,
    chartDataSet: IChartDataSet<string>,
    dataConfig,
  ) {
    return {
      type: 'bar',
      sampling: 'average',
      barGap: this.getSerieBarGap(styleConfigs),
      barWidth: this.getSerieBarWidth(styleConfigs),
      itemStyle: this.getSerieItemStyle(styleConfigs, {
        color: dataConfig?.color?.start,
      }),
      ...this.getLabelStyle(styleConfigs),
      ...this.getSeriesStyle(styleConfigs),
      ...getReference2(
        settingConfigs,
        chartDataSet,
        dataConfig,
        this.isHorizionDisplay,
      ),
    };
  }

  private makeStackSeries(_, series) {
    (series || []).forEach(s => {
      s['stack'] = this.isStackMode ? this.getStackName(1) : undefined;
    });
    return series;
  }

  private makePercentageSeries(styles, series) {
    const _getAbsValue = data => {
      if (typeof data === 'object' && data !== null && 'value' in data) {
        return Math.abs(data.value || 0);
      }
      return data;
    };

    const _convertToPercentage = (data: [{ value: any }], totalArray: []) => {
      return (data || []).map((d, dataIndex) => {
        const sum = totalArray[dataIndex];
        const percentageValue = toPrecision((_getAbsValue(d) / sum) * 100, 2);
        return {
          ...d,
          value: percentageValue,
          total: sum,
        };
      });
    };

    const _sereisTotalArrayByDataIndex = (series?.[0]?.data || []).map(
      (_, index) => {
        const sum = series.reduce((acc, cur) => {
          const value = +_getAbsValue(cur.data?.[index] || 0);
          acc = acc + value;
          return acc;
        }, 0);
        return sum;
      },
    );
    (series || []).forEach(s => {
      s.data = _convertToPercentage(s.data, _sereisTotalArrayByDataIndex);
    });
    return series;
  }

  private getSerieItemStyle(styles, itemStyle?) {
    const [borderStyle, borderRadius] = getStyles(
      styles,
      ['bar'],
      ['borderStyle', 'radius'],
    );

    return {
      ...itemStyle,
      borderRadius,
      borderType: borderStyle?.type,
      borderWidth: borderStyle?.width,
      borderColor: borderStyle?.color,
    };
  }

  private getSerieBarGap(styles) {
    const [gap] = getStyles(styles, ['bar'], ['gap']);
    return gap;
  }

  private getSerieBarWidth(styles) {
    const [width] = getStyles(styles, ['bar'], ['width']);
    return width;
  }

  private getYAxis(styles, yAxisNames) {
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
    const name = showTitleAndUnit ? yAxisNames.join(' / ') : null;
    const [showHorizonLine, horizonLineStyle] = getStyles(
      styles,
      ['splitLine'],
      ['showHorizonLine', 'horizonLineStyle'],
    );

    return {
      type: 'value',
      name,
      nameLocation,
      nameGap,
      nameRotate,
      inverse,
      min,
      max,
      axisLabel: {
        show: showLabel,
        ...font,
      },
      axisLine: {
        show: showAxis,
        lineStyle,
      },
      axisTick: {
        show: showLabel,
        lineStyle,
      },
      nameTextStyle: unitFont,
      splitLine: {
        show: showHorizonLine,
        lineStyle: horizonLineStyle,
      },
    };
  }

  private getXAxis(styles, xAxisColumns) {
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
      axisLabel: {
        show: showLabel,
        rotate,
        interval: showInterval ? interval : 'auto',
        ...font,
      },
      axisLine: {
        show: showAxis,
        lineStyle,
      },
      axisTick: {
        show: showLabel,
        lineStyle,
      },
      splitLine: {
        show: showVerticalLine,
        lineStyle: verticalLineStyle,
      },
    };
  }

  private getLegendStyle(styles, series) {
    const seriesNames = (series || []).map((col: any) => col?.name);
    const [show, type, font, legendPos, selectAll] = getStyles(
      styles,
      ['legend'],
      ['showLegend', 'type', 'font', 'position', 'selectAll'],
    );
    let positions = {};
    let orient = {};

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
      selected,
      data: seriesNames,
      textStyle: font,
    };
  }

  private getLabelStyle(styles) {
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

  private getSeriesStyle(styles) {
    const [smooth, step] = getStyles(styles, ['graph'], ['smooth', 'step']);
    return { smooth, step };
  }

  private getStackName(index) {
    return `total`;
  }

  private getTooltipFormatterFunc(
    chartDataSet: IChartDataSet<string>,
    groupConfigs,
    aggregateConfigs,
    colorConfigs,
    infoConfigs,
  ) {
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

export default BasicBarChart;
