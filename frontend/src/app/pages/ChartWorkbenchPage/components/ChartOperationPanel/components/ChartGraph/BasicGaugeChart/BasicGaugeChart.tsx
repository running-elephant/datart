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
  getStyleValueByGroup,
  getValueByColumnKey,
  transfromToObjectArray,
} from 'app/utils/chartHelper';
import { toFormattedValue } from 'app/utils/number';
import { init } from 'echarts';
import Config from './config';

class BasicGaugeChart extends Chart {
  config = Config;
  chart: any = null;

  protected isArea = false;
  protected isStack = false;

  constructor(props?) {
    super(
      props?.id || 'gauge',
      props?.name || '仪表盘',
      props?.icon || 'gauge',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: 0,
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
    this._mouseEvents?.forEach(event => {
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

  onUnMount(): void {
    this.chart?.dispose();
  }

  onResize(opt: any, context): void {
    this.chart?.resize(context);
  }

  getOptions(dataset: ChartDataset, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);
    const dataColumns = transfromToObjectArray(dataset.rows, dataset.columns);
    const series = this.getSeries(
      styleConfigs,
      dataColumns,
      aggregateConfigs[0],
    );
    const [prefix, suffix] = this.getArrStyleValueByGroup(
      ['prefix', 'suffix'],
      styleConfigs,
      'gauge',
    );
    return {
      tooltip: {
        formatter: ({ data }) => {
          return `${data.name} : ${prefix}${toFormattedValue(
            data.value,
            aggregateConfigs[0].format,
          )}${suffix}`;
        },
      },
      series,
    };
  }

  private getSeries(styleConfigs, dataColumns, aggConfig) {
    const detail = this.getDetail(styleConfigs, aggConfig);
    const title = this.getTitle(styleConfigs);
    const pointer = this.getPointer(styleConfigs);
    const axis = this.getAxis(styleConfigs);
    const splitLine = this.getSplitLine(styleConfigs);
    const progress = this.getProgress(styleConfigs);

    const pointerColor = getStyleValueByGroup(
      styleConfigs,
      'pointer',
      'pointerColor',
    );

    const center = this.getArrStyleValueByGroup(
      ['marginLeft', 'marginTop'],
      styleConfigs,
      'center',
    );
    return {
      ...this.getGauge(styleConfigs),
      data: dataColumns.map(dc => {
        const dataConfig: { name: string; value: string; itemStyle: any } = {
          name: getColumnRenderName(aggConfig),
          value: dc[getValueByColumnKey(aggConfig)] || 0,
          itemStyle: {
            color: pointerColor,
          },
        };
        if (aggConfig?.color?.start) {
          dataConfig.itemStyle.color = aggConfig.color.start;
        }
        return dataConfig;
      }),
      pointer,
      ...axis,
      title,
      splitLine,
      detail,
      progress,
      center,
    };
  }

  private getProgress(styleConfigs) {
    const [show, roundCap] = this.getArrStyleValueByGroup(
      ['showProgress', 'roundCap'],
      styleConfigs,
      'progress',
    );
    const width = getStyleValueByGroup(styleConfigs, 'axis', 'axisLineSize');
    return {
      show,
      roundCap,
      width,
    };
  }

  private getSplitLine(styleConfigs) {
    const [show, lineStyle, distance, length] = this.getArrStyleValueByGroup(
      ['showSplitLine', 'lineStyle', 'distance', 'splitLineLength'],
      styleConfigs,
      'splitLine',
    );

    return {
      show,
      length,
      distance,
      lineStyle,
    };
  }

  private getGauge(styleConfigs) {
    const [max, radius, startAngle, endAngle, splitNumber] =
      this.getArrStyleValueByGroup(
        ['max', 'radius', 'startAngle', 'endAngle', 'splitNumber'],
        styleConfigs,
        'gauge',
      );

    return {
      type: 'gauge',
      max,
      splitNumber,
      radius,
      startAngle,
      endAngle,
    };
  }

  private getAxis(styleConfigs) {
    const [axisWidth, axisLineColor] = this.getArrStyleValueByGroup(
      ['axisLineSize', 'axisLineColor'],
      styleConfigs,
      'axis',
    );
    const [showAxisTick, lineStyle, distance, splitNumber] =
      this.getArrStyleValueByGroup(
        ['showAxisTick', 'lineStyle', 'distance', 'splitNumber'],
        styleConfigs,
        'axisTick',
      );
    const [showAxisLabel, font, axisLabelDistance] =
      this.getArrStyleValueByGroup(
        ['showAxisLabel', 'font', 'distance'],
        styleConfigs,
        'axisLabel',
      );

    return {
      axisLine: {
        lineStyle: {
          width: axisWidth,
          color: [[1, axisLineColor]],
        },
      },
      axisTick: {
        show: showAxisTick,
        splitNumber,
        distance,
        lineStyle,
      },
      axisLabel: {
        show: showAxisLabel,
        distance: axisLabelDistance,
        ...font,
      },
    };
  }

  private getPointer(styleConfigs) {
    const list = [
      'showPointer',
      'pointerLength',
      'pointerWidth',
      'customPointerColor',
      'pointerColor',
      'lineStyle',
    ];
    const [
      show,
      pointerLength,
      pointerWidth,
      customPointerColor,
      pointerColor,
      { type, color, width },
    ] = this.getArrStyleValueByGroup(list, styleConfigs, 'pointer');

    return {
      show,
      length: pointerLength ? pointerLength : 0,
      width: pointerWidth ? `${pointerWidth}px` : 0,
      itemStyle: {
        color: customPointerColor ? pointerColor : 'auto',
        borderType: type,
        borderWidth: width,
        borderColor: color,
      },
    };
  }

  private getDetail(styleConfigs, aggConfig) {
    const [show, font, detailOffsetLeft, detailOffsetTop] =
      this.getArrStyleValueByGroup(
        ['showData', 'font', 'detailOffsetLeft', 'detailOffsetTop'],
        styleConfigs,
        'data',
      );
    const [suffix, prefix] = this.getArrStyleValueByGroup(
      ['suffix', 'prefix'],
      styleConfigs,
      'gauge',
    );

    return {
      show,
      ...font,
      offsetCenter: [
        detailOffsetLeft ? detailOffsetLeft : 0,
        detailOffsetTop ? detailOffsetTop : 0,
      ],
      formatter: value =>
        `${prefix}${toFormattedValue(value || 0, aggConfig.format)}${suffix}`,
    };
  }

  private getTitle(styleConfigs) {
    const list = ['showLabel', 'font', 'detailOffsetLeft', 'detailOffsetTop'];
    const [show, font, detailOffsetLeft, detailOffsetTop] =
      this.getArrStyleValueByGroup(list, styleConfigs, 'label');
    return {
      show,
      ...font,
      offsetCenter: [
        detailOffsetLeft ? detailOffsetLeft : 0,
        detailOffsetTop ? detailOffsetTop : 0,
      ],
    };
  }

  private getArrStyleValueByGroup(childPathList: string[], style, groupPath) {
    return childPathList.map(child => {
      return getStyleValueByGroup(style, groupPath, child);
    });
  }
}

export default BasicGaugeChart;
