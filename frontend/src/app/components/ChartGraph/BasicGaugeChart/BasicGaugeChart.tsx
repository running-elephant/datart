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
  getStyles,
  getValue,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import Chart from '../models/Chart';
import Config from './config';

class BasicGaugeChart extends Chart {
  config = Config;
  chart: any = null;

  protected isArea = false;
  protected isStack = false;

  constructor(props?) {
    super(
      props?.id || 'gauge',
      props?.name || 'viz.palette.graph.names.gaugeChart',
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

  onUnMount(): void {
    this.chart?.dispose();
  }

  onResize(opt: any, context): void {
    this.chart?.resize(context);
  }

  getOptions(dataset: ChartDataSetDTO, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
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
      aggregateConfigs[0],
    );
    const tooltip = this.getTooltip(styleConfigs, aggregateConfigs);
    return {
      tooltip,
      series,
    };
  }

  private getTooltip(style, aggConfigs) {
    const [prefix, suffix] = getStyles(style, ['gauge'], ['prefix', 'suffix']);
    return {
      formatter: ({ data }) => {
        return `${data.name} : ${prefix}${toFormattedValue(
          data.value,
          aggConfigs[0].format,
        )}${suffix}`;
      },
    };
  }

  private getSeries(
    styleConfigs,
    chartDataSet: IChartDataSet<string | number>,
    aggConfig,
  ) {
    const detail = this.getDetail(styleConfigs, aggConfig);
    const title = this.getTitle(styleConfigs);
    const pointer = this.getPointer(styleConfigs);
    const axis = this.getAxis(styleConfigs);
    const splitLine = this.getSplitLine(styleConfigs);
    const progress = this.getProgress(styleConfigs);
    const pointerColor = getValue(styleConfigs, ['pointer', 'pointerColor']);
    const dataConfig: { name: string; value: string | number; itemStyle: any } =
      {
        name: getColumnRenderName(aggConfig),
        value: chartDataSet?.[0]?.getCell(aggConfig) || 0,
        itemStyle: {
          color: pointerColor,
        },
      };
    if (aggConfig?.color?.start) {
      dataConfig.itemStyle.color = aggConfig.color.start;
    }

    return {
      ...this.getGauge(styleConfigs),
      data: [dataConfig],
      pointer,
      ...axis,
      title,
      splitLine,
      detail,
      progress,
    };
  }

  private getProgress(styleConfigs) {
    const [show, roundCap] = getStyles(
      styleConfigs,
      ['progress'],
      ['showProgress', 'roundCap'],
    );
    const width = getValue(styleConfigs, ['axis', 'axisLineSize']);
    return {
      show,
      roundCap,
      width,
    };
  }

  private getSplitLine(styleConfigs) {
    const [show, lineStyle, distance, length] = getStyles(
      styleConfigs,
      ['splitLine'],
      ['showSplitLine', 'lineStyle', 'distance', 'splitLineLength'],
    );
    return {
      show,
      length,
      distance,
      lineStyle,
    };
  }

  private getGauge(styleConfigs) {
    const [max, radius, startAngle, endAngle, splitNumber] = getStyles(
      styleConfigs,
      ['gauge'],
      ['max', 'radius', 'startAngle', 'endAngle', 'splitNumber'],
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
    const [axisWidth, axisLineColor] = getStyles(
      styleConfigs,
      ['axis'],
      ['axisLineSize', 'axisLineColor'],
    );
    const [showAxisTick, lineStyle, distance, splitNumber] = getStyles(
      styleConfigs,
      ['axisTick'],
      ['showAxisTick', 'lineStyle', 'distance', 'splitNumber'],
    );
    const [showAxisLabel, font, axisLabelDistance] = getStyles(
      styleConfigs,
      ['axisLabel'],
      ['showAxisLabel', 'font', 'distance'],
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
    const [
      show,
      pointerLength,
      pointerWidth,
      customPointerColor,
      pointerColor,
      { type, color, width },
    ] = getStyles(
      styleConfigs,
      ['pointer'],
      [
        'showPointer',
        'pointerLength',
        'pointerWidth',
        'customPointerColor',
        'pointerColor',
        'lineStyle',
      ],
    );

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
    const [show, font, detailOffsetLeft, detailOffsetTop] = getStyles(
      styleConfigs,
      ['data'],
      ['showData', 'font', 'detailOffsetLeft', 'detailOffsetTop'],
    );
    const [suffix, prefix] = getStyles(
      styleConfigs,
      ['gauge'],
      ['suffix', 'prefix'],
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
    const [show, font, detailOffsetLeft, detailOffsetTop] = getStyles(
      styleConfigs,
      ['label'],
      ['showLabel', 'font', 'detailOffsetLeft', 'detailOffsetTop'],
    );
    return {
      show,
      ...font,
      offsetCenter: [
        detailOffsetLeft ? detailOffsetLeft : 0,
        detailOffsetTop ? detailOffsetTop : 0,
      ],
    };
  }
}

export default BasicGaugeChart;
