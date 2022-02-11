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
  getAxisLabel,
  getAxisLine,
  getAxisTick,
  getColorizeGroupSeriesColumns,
  getColumnRenderName,
  getExtraSeriesDataFormat,
  getExtraSeriesRowData,
  getGridStyle,
  getNameTextStyle,
  getReference2,
  getSeriesTooltips4Rectangular2,
  getSplitLine,
  getStyles,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import { UniqArray } from 'utils/object';
import Chart from '../models/Chart';
import Config from './config';

class BasicLineChart extends Chart {
  config = Config;
  chart: any = null;

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
    this.mouseEvents?.forEach(event => {
      this.chart.on(event.name, event.callback);
    });
  }

  onUpdated(props): void {
    if (!props.dataset || !props.dataset.columns || !props.config) {
      return;
    }
    if (!this.isMatchRequirement(props.config)) {
      this.chart?.clear();
      return;
    }
    const newOptions = this.getOptions(props.dataset, props.config);
    this.chart?.setOption(Object.assign({}, newOptions), true);
  }

  onResize(opt: any, context): void {
    this.chart?.resize({ width: context?.width, height: context?.height });
  }

  onUnMount(): void {
    this.chart?.dispose();
  }

  private getOptions(dataset: ChartDataSetDTO, config: ChartConfig) {
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
        data: UniqArray(chartDataSet.map(dc => dc.getCell(config))),
      };
    });
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
    const yAxisNames = aggregateConfigs.map(getColumnRenderName);

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
      grid: getGridStyle(styleConfigs),
      xAxis: this.getXAxis(styleConfigs, xAxisColumns),
      yAxis: this.getYAxis(styleConfigs, yAxisNames),
      series,
    };
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
    if (!colorConfigs?.length) {
      return aggregateConfigs.map(aggConfig => {
        const color = aggConfig?.color?.start;
        return {
          name: getColumnRenderName(aggConfig),
          type: 'line',
          sampling: 'average',
          areaStyle: this.isArea ? { color } : undefined,
          stack: this.isStack ? 'total' : undefined,
          data: chartDataSet?.map(dc => ({
            ...getExtraSeriesRowData(dc),
            ...getExtraSeriesDataFormat(aggConfig?.format),
            name: getColumnRenderName(aggConfig),
            value: dc.getCell(aggConfig),
          })),
          itemStyle: {
            color,
          },
          ...this.getLabelStyle(styleConfigs),
          ...this.getSeriesStyle(styleConfigs),
          ...getReference2(settingConfigs, chartDataSet, aggConfig, false),
        };
      });
    }

    const xAxisColumnName = chartDataSet.getFieldKey(groupConfigs?.[0]);
    const yAxisColumnNames = aggregateConfigs.map(config =>
      chartDataSet.getFieldKey(config),
    );
    const colorColumnName = chartDataSet.getFieldKey(colorConfigs[0]);
    const infoColumnNames = infoConfigs.map(config =>
      chartDataSet.getFieldKey(config),
    );

    const secondGroupInfos = getColorizeGroupSeriesColumns(
      chartDataSet,
      colorColumnName,
      xAxisColumnName,
      yAxisColumnNames,
      infoColumnNames,
    );

    return aggregateConfigs.flatMap(aggConfig => {
      return secondGroupInfos.map(sgCol => {
        const k = Object.keys(sgCol)[0];
        const v = sgCol[k];

        const itemStyleColor = colorConfigs[0]?.color?.colors?.find(
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
          data: xAxisColumns[0].data.map(d => {
            const target = v.find(col => col[xAxisColumnName] === d);
            return {
              ...getExtraSeriesRowData(target),
              ...getExtraSeriesDataFormat(aggConfig?.format),
              name: getColumnRenderName(aggConfig),
              value: target?.[chartDataSet.getFieldKey(aggConfig)] || 0,
            };
          }),
          ...this.getLabelStyle(styleConfigs),
          ...this.getSeriesStyle(styleConfigs),
        };
      });
    });
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
      axisLabel: getAxisLabel(
        showLabel,
        font,
        showInterval ? interval : null,
        rotate,
      ),
      axisLine: getAxisLine(showAxis, lineStyle),
      axisTick: getAxisTick(showLabel, lineStyle),
      splitLine: getSplitLine(showVerticalLine, verticalLineStyle),
    };
  }

  private getLegendStyle(styles, seriesNames) {
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

  private getTooltipFormmaterFunc(
    chartDataSet,
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

export default BasicLineChart;
