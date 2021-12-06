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

import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import {
  getColumnRenderName,
  getCustomSortableColumns,
  getStyleValueByGroup,
  getValueByColumnKey,
  transfromToObjectArray,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import { UniqArray } from 'utils/object';
import Config from './config';

class WaterfallChart extends Chart {
  config = Config;
  chart: any = null;

  constructor(props?) {
    super(
      props?.id || 'waterfall-chart',
      props?.name || '瀑布图',
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
    this.chart?.resize(context);
  }

  getOptions(dataset: ChartDataset, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);

    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );

    const dataColumns = getCustomSortableColumns(objDataColumns, dataConfigs);

    const series = this.getSeries(
      styleConfigs,
      dataColumns,
      aggregateConfigs,
      groupConfigs,
    );

    return {
      grid: this.getGrid(styleConfigs),
      barWidth: this.getSerieBarWidth(styleConfigs),
      ...series,
    };
  }

  getSerieBarWidth(styles) {
    return getStyleValueByGroup(styles, 'bar', 'width');
  }

  getSeries(styles, dataColumns, aggregateConfigs, group) {
    const xAxisColumns = {
      type: 'category',
      tooltip: { show: true },
      data: UniqArray(dataColumns.map(dc => dc[getValueByColumnKey(group[0])])),
    };
    const yAxisNames = aggregateConfigs.map(getColumnRenderName);
    const [isIncrement, ascendColor, descendColor] =
      this.getArrStyleValueByGroup(
        ['isIncrement', 'ascendColor', 'descendColor'],
        styles,
        'bar',
      );
    const label = this.getLabel(styles);

    const dataList = dataColumns.map(
      dc => dc[getValueByColumnKey(aggregateConfigs[0])],
    );

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
            return `${pa.seriesName}: ${data}`;
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
      xAxis: axisInfo.xAxis,
      yAxis: axisInfo.yAxis,
      series: [baseDataObj, ascendOrderObj, descendOrderObj],
    };
  }

  private getSeriesItemStyle(styles) {
    const borderStyle = getStyleValueByGroup(styles, 'bar', 'borderStyle');
    const borderRadius = getStyleValueByGroup(styles, 'bar', 'radius');

    return {
      borderRadius,
      borderType: borderStyle?.type,
      borderWidth: borderStyle?.width,
      borderColor: borderStyle?.color,
    };
  }

  getDataList(isIncrement, dataList, xAxisColumns, styles) {
    const totalColor = getStyleValueByGroup(styles, 'bar', 'totalColor');
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

  getLabel(styles) {
    const [show, position, font] = this.getArrStyleValueByGroup(
      ['showLabel', 'position', 'font'],
      styles,
      'label',
    );
    return {
      show,
      position,
      ...font,
    };
  }

  getXAxis(styles, xAxisColumns) {
    const showAxis = getStyleValueByGroup(styles, 'xAxis', 'showAxis');
    const inverse = getStyleValueByGroup(styles, 'xAxis', 'inverseAxis');
    const lineStyle = getStyleValueByGroup(styles, 'xAxis', 'lineStyle');
    const showLabel = getStyleValueByGroup(styles, 'xAxis', 'showLabel');
    const font = getStyleValueByGroup(styles, 'xAxis', 'font');
    const rotate = getStyleValueByGroup(styles, 'xAxis', 'rotate');
    const showInterval = getStyleValueByGroup(styles, 'xAxis', 'showInterval');
    const interval = getStyleValueByGroup(styles, 'xAxis', 'interval');
    const showVerticalLine = getStyleValueByGroup(
      styles,
      'splitLine',
      'showVerticalLine',
    );
    const verticalLineStyle = getStyleValueByGroup(
      styles,
      'splitLine',
      'verticalLineStyle',
    );

    return {
      ...xAxisColumns,
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

  getYAxis(styles, yAxisNames) {
    const showAxis = getStyleValueByGroup(styles, 'yAxis', 'showAxis');
    const inverse = getStyleValueByGroup(styles, 'yAxis', 'inverseAxis');
    const lineStyle = getStyleValueByGroup(styles, 'yAxis', 'lineStyle');
    const showLabel = getStyleValueByGroup(styles, 'yAxis', 'showLabel');
    const font = getStyleValueByGroup(styles, 'yAxis', 'font');
    const showTitleAndUnit = getStyleValueByGroup(
      styles,
      'yAxis',
      'showTitleAndUnit',
    );
    const name = showTitleAndUnit ? yAxisNames.join(' / ') : null;
    const unitFont = getStyleValueByGroup(styles, 'yAxis', 'unitFont');
    const nameLocation = getStyleValueByGroup(styles, 'yAxis', 'nameLocation');
    const nameGap = getStyleValueByGroup(styles, 'yAxis', 'nameGap');
    const nameRotate = getStyleValueByGroup(styles, 'yAxis', 'nameRotate');
    const min = getStyleValueByGroup(styles, 'yAxis', 'min');
    const max = getStyleValueByGroup(styles, 'yAxis', 'max');
    const showHorizonLine = getStyleValueByGroup(
      styles,
      'splitLine',
      'showHorizonLine',
    );
    const horizonLineStyle = getStyleValueByGroup(
      styles,
      'splitLine',
      'horizonLineStyle',
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

  getGrid(styles) {
    const containLabel = getStyleValueByGroup(styles, 'margin', 'containLabel');
    const left = getStyleValueByGroup(styles, 'margin', 'marginLeft');
    const right = getStyleValueByGroup(styles, 'margin', 'marginRight');
    const bottom = getStyleValueByGroup(styles, 'margin', 'marginBottom');
    const top = getStyleValueByGroup(styles, 'margin', 'marginTop');
    return { left, right, bottom, top, containLabel };
  }

  getArrStyleValueByGroup(childPathList, style, groupPath) {
    return childPathList.map(child => {
      return getStyleValueByGroup(style, groupPath, child);
    });
  }
}

export default WaterfallChart;
