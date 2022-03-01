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
  getColumnRenderName,
  getGridStyle,
  getStyles,
  hadAxisOverflowConfig,
  setOptionsByAxisLabelOverflow,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import { UniqArray } from 'utils/object';
import Chart from '../models/Chart';
import Config from './config';

class WaterfallChart extends Chart {
  config = Config;
  chart: any = null;

  constructor(props?) {
    super(
      props?.id || 'waterfall-chart',
      props?.name || 'viz.palette.graph.names.waterfallChart',
      props?.icon || 'waterfall',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: 1,
        aggregate: 1,
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

  onUnMount(): void {
    this.chart?.dispose();
  }

  onResize(opt: any, context): void {
    this.chart?.resize({ width: context?.width, height: context?.height });
    hadAxisOverflowConfig(this.chart?.getOption()) && this.onUpdated(opt);
  }

  private getOptions(dataset: ChartDataSetDTO, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    const series = this.getSeries(
      styleConfigs,
      chartDataSet,
      aggregateConfigs,
      groupConfigs,
    );

    return {
      barWidth: this.getSerieBarWidth(styleConfigs),
      ...series,
    };
  }

  private getSerieBarWidth(styles) {
    const [width] = getStyles(styles, ['bar'], ['width']);
    return width;
  }

  private getSeries(
    styles,
    chartDataSet: IChartDataSet<string>,
    aggregateConfigs,
    group,
  ) {
    const xAxisColumns = {
      type: 'category',
      tooltip: { show: true },
      data: UniqArray(chartDataSet.map(dc => dc.getCell(group[0]))),
    };
    const yAxisNames = aggregateConfigs.map(getColumnRenderName);
    const [isIncrement, ascendColor, descendColor] = getStyles(
      styles,
      ['bar'],
      ['isIncrement', 'ascendColor', 'descendColor'],
    );
    const label = this.getLabel(styles, aggregateConfigs[0].format);

    const dataList = chartDataSet.map(dc => dc.getCell(aggregateConfigs[0]));

    const { baseData, ascendOrder, descendOrder } = this.getDataList(
      isIncrement,
      dataList,
      xAxisColumns,
      styles,
    );

    const baseDataObj = {
      name: yAxisNames[0],
      type: 'bar',
      sampling: 'average',
      stack: 'stack',
      data: baseData,
      itemStyle: {
        normal: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)',
        },
        emphasis: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)',
        },
      },
    };

    const ascendOrderObj = {
      name: '升',
      type: 'bar',
      sampling: 'average',
      stack: 'stack',
      itemStyle: {
        color: ascendColor,
        ...this.getSeriesItemStyle(styles),
      },
      data: ascendOrder,
      label,
    };

    const descendOrderObj = {
      name: '降',
      type: 'bar',
      sampling: 'average',
      stack: 'stack',
      data: descendOrder,
      itemStyle: {
        color: descendColor,
        ...this.getSeriesItemStyle(styles),
      },
      label,
    };
    const axisInfo = {
      xAxis: this.getXAxis(styles, xAxisColumns),
      yAxis: this.getYAxis(styles, yAxisNames),
    };

    // @TM 溢出自动根据bar长度设置标尺
    const option = setOptionsByAxisLabelOverflow({
      chart: this.chart,
      xAxis: axisInfo.xAxis,
      yAxis: axisInfo.yAxis,
      grid: getGridStyle(styles),
      series: [baseDataObj, ascendOrderObj, descendOrderObj],
      yAxisNames,
    });
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: param => {
          const text = param.map((pa, index) => {
            let data = pa.value;
            if (!index && typeof param[1].value === 'number') {
              data += param[1].value;
            }
            return `${pa.seriesName}: ${toFormattedValue(
              data,
              aggregateConfigs[0].format,
            )}`;
          });
          const xAxis = param[0]['axisValue'];
          if (xAxis === '累计') {
            return '';
          } else {
            text.unshift(xAxis as string);
            return text.join('<br/>');
          }
        },
      },
      ...option,
    };
  }

  private getSeriesItemStyle(styles) {
    const [borderStyle, borderRadius] = getStyles(
      styles,
      ['bar'],
      ['borderStyle', 'radius'],
    );
    return {
      borderRadius,
      borderType: borderStyle?.type,
      borderWidth: borderStyle?.width,
      borderColor: borderStyle?.color,
    };
  }

  private getDataList(isIncrement, dataList, xAxisColumns, styles) {
    const [totalColor] = getStyles(styles, ['bar'], ['totalColor']);
    const baseData: any = [];
    const ascendOrder: any = [];
    const descendOrder: any = [];
    dataList.forEach((data, index) => {
      data = parseFloat(data);
      if (index > 0) {
        if (isIncrement) {
          const result =
            dataList[index - 1] >= 0
              ? parseFloat(dataList[index - 1] + baseData[index - 1])
              : baseData[index - 1];
          if (data >= 0) {
            baseData.push(result);
            ascendOrder.push(data);
            descendOrder.push('-');
          } else {
            baseData.push(result + data);
            ascendOrder.push('-');
            descendOrder.push(Math.abs(data));
          }
        } else {
          const result = data - parseFloat(dataList[index - 1]);
          if (result >= 0) {
            ascendOrder.push(result);
            descendOrder.push('-');
            baseData.push(parseFloat(dataList[index - 1]));
          } else {
            ascendOrder.push('-');
            descendOrder.push(Math.abs(result));
            baseData.push(parseFloat(dataList[index - 1]) - Math.abs(result));
          }
        }
      } else {
        if (data >= 0) {
          ascendOrder.push(data);
          descendOrder.push('-');
          baseData.push(0);
        } else {
          ascendOrder.push('-');
          descendOrder.push(Math.abs(data));
          baseData.push(0);
        }
      }
    });
    if (isIncrement && xAxisColumns?.data?.length) {
      xAxisColumns.data.push('累计');
      const resultData = parseFloat(
        dataList[dataList.length - 1] + baseData[baseData.length - 1],
      );
      if (resultData > 0) {
        ascendOrder.push({
          value: resultData,
          itemStyle: {
            color: totalColor,
          },
        });
        descendOrder.push('-');
      } else {
        descendOrder.push({
          value: Math.abs(resultData),
          itemStyle: {
            color: totalColor,
          },
        });
        ascendOrder.push('-');
      }
    }
    return {
      baseData,
      ascendOrder,
      descendOrder,
    };
  }

  private getLabel(styles, format) {
    const [show, position, font] = getStyles(
      styles,
      ['label'],
      ['showLabel', 'position', 'font'],
    );
    return {
      show,
      position,
      ...font,
      formatter: ({ value }) => `${toFormattedValue(value, format)}`,
    };
  }

  private getXAxis(styles, xAxisColumns) {
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
      ...xAxisColumns,
      inverse,
      axisLabel: {
        show: showLabel,
        rotate,
        interval: showInterval ? interval : 'auto',
        overflow,
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
}

export default WaterfallChart;
