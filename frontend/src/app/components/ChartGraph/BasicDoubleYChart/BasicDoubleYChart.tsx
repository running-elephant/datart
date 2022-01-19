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

import { ChartConfig,ChartDataSectionType } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import {
getAxisLabel,
getAxisLine,
getAxisTick,
getColumnRenderName,
getCustomSortableColumns,
getExtraSeriesDataFormat,
getExtraSeriesRowData,
getGridStyle,
getReference,
getSeriesTooltips4Rectangular,
getSplitLine,
getStyles,
getValueByColumnKey,
transformToObjectArray
} from 'app/utils/chartHelper';
import { toFormattedValue } from 'app/utils/number';
import { init } from 'echarts';
import Chart from '../models/Chart';
import Config from './config';

class BasicDoubleYChart extends Chart {
  dependency = [];
  config = Config;
  chart: any = null;

  constructor() {
    super(
      'double-y',
      'viz.palette.graph.names.doubleYChart',
      'fsux_tubiao_shuangzhoutu',
    );
    this.meta.requirements = [
      {
        group: 1,
        aggregate: [2, 999],
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
      return this.chart?.clear();
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

  private getOptions(dataset: ChartDataset, config: ChartConfig) {
    const dataConfigs = config.datas || [];
    const styleConfigs = config.styles || [];
    const settingConfigs = config.settings;

    const objDataColumns = transformToObjectArray(
      dataset.rows,
      dataset.columns,
    );
    const dataColumns = getCustomSortableColumns(objDataColumns, dataConfigs);
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.INFO)
      .flatMap(config => config.rows || []);

    const leftMetricsConfigs = dataConfigs
      .filter(
        c => c.type === ChartDataSectionType.AGGREGATE && c.key === 'metricsL',
      )
      .flatMap(config => config.rows || []);
    const rightMetricsConfigs = dataConfigs
      .filter(
        c => c.type === ChartDataSectionType.AGGREGATE && c.key === 'metricsR',
      )
      .flatMap(config => config.rows || []);

    if (!leftMetricsConfigs.concat(rightMetricsConfigs)?.length) {
      return {};
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: this.getTooltipFormmaterFunc(
          styleConfigs,
          groupConfigs,
          leftMetricsConfigs.concat(rightMetricsConfigs),
          [],
          infoConfigs,
          dataColumns,
        ),
      },
      grid: getGridStyle(styleConfigs),
      legend: this.getLegend(
        styleConfigs,
        leftMetricsConfigs.concat(rightMetricsConfigs).map(getColumnRenderName),
      ),
      xAxis: this.getXAxis(styleConfigs, groupConfigs, dataColumns),
      yAxis: this.getYAxis(
        styleConfigs,
        leftMetricsConfigs,
        rightMetricsConfigs,
      ),
      series: this.getSeries(
        styleConfigs,
        settingConfigs,
        leftMetricsConfigs,
        rightMetricsConfigs,
        dataColumns,
      ),
    };
  }

  private getSeries(
    styles,
    settingConfigs,
    leftDeminsionConfigs,
    rightDeminsionConfigs,
    dataColumns,
  ) {
    const _getSeriesByDemisionPostion =
      () => (config, styles, settings, data, direction) => {
        const [graphType, graphStyle] = getStyles(
          styles,
          [direction],
          ['graphType', 'graphStyle'],
        );
        return {
          name: getColumnRenderName(config),
          type: graphType || 'line',
          sampling: 'average',
          data: dataColumns.map(dc => ({
            ...config,
            ...getExtraSeriesRowData(dc),
            ...getExtraSeriesDataFormat(config?.format),
            value: dc[getValueByColumnKey(config)],
          })),
          ...this.getItemStyle(config),
          ...this.getGraphStyle(graphType, graphStyle),
          ...this.getLabelStyle(styles, direction),
          ...this.getSeriesStyle(styles),
          ...getReference(settings, data, config, false),
        };
      };

    const series = []
      .concat(
        leftDeminsionConfigs.map(lc =>
          _getSeriesByDemisionPostion()(
            lc,
            styles,
            settingConfigs,
            dataColumns,
            'leftY',
          ),
        ),
      )
      .concat(
        rightDeminsionConfigs.map(rc =>
          _getSeriesByDemisionPostion()(
            rc,
            styles,
            settingConfigs,
            dataColumns,
            'rightY',
          ),
        ),
      )
      .map((config, index) => {
        (config as any).yAxisIndex = index;
        return config;
      });
    return series;
  }

  private getItemStyle(config) {
    const color = config?.color?.start;
    return {
      itemStyle: {
        color,
      },
    };
  }

  private getGraphStyle(graphType, style) {
    if (graphType === 'line') {
      return { lineStyle: style };
    } else {
      return {
        barWidth: style?.width,
        color: style?.color,
      };
    }
  }

  private getXAxis(styles, xAxisConfigs, dataColumns) {
    const fisrtXAxisConfig = xAxisConfigs[0];
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
      type: 'category',
      tooltip: { show: true },
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
      data: dataColumns.map(d => d[getValueByColumnKey(fisrtXAxisConfig)]),
    };
  }

  private getYAxis(styles, leftDeminsionConfigs, rightDeminsionConfigs) {
    const [showAxis, inverse, showLabel, font] = getStyles(
      styles,
      ['doubleY'],
      ['showAxis', 'inverseAxis', 'showLabel', 'font'],
    );
    const [showHorizonLine, horizonLineStyle] = getStyles(
      styles,
      ['splitLine'],
      ['showHorizonLine', 'horizonLineStyle'],
    );

    const _yAxisTemplate = (position, index, name) => {
      return {
        type: 'value',
        // min: 0,
        // max: 250,
        // min: leftExtentMin,
        // max: leftExtentMax,
        // interval: +leftInterval,
        position,
        offset: index * 20,
        showTitleAndUnit: true,
        name,
        nameLocation: 'middle',
        nameGap: 50,
        nameRotate: 90,
        nameTextStyle: {
          color: '#666',
          fontFamily: 'PingFang SC',
          fontSize: 12,
        },
        inverse,
        axisLine: getAxisLine(showAxis, null),
        axisLabel: getAxisLabel(showLabel, font),
        splitLine: getSplitLine(showHorizonLine, horizonLineStyle),
      };
    };

    const leftYAxis = leftDeminsionConfigs.map((c, index) =>
      _yAxisTemplate('left', index, getColumnRenderName(c)),
    );

    const rightYAxis = rightDeminsionConfigs.map((c, index) =>
      _yAxisTemplate('right', index, getColumnRenderName(c)),
    );
    return leftYAxis.concat(rightYAxis);
  }

  private getLegend(styles, seriesNames) {
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

  private getLabelStyle(styles, direction) {
    const [showLabel, position, LabelFont] = getStyles(
      styles,
      ['label'],
      ['showLabel', 'position', 'font'],
    );

    return {
      label: {
        show: showLabel,
        position,
        ...LabelFont,
        formatter: params => {
          const { value, data } = params;
          const formattedValue = toFormattedValue(value, data.format);
          const labels: string[] = [];
          labels.push(formattedValue);
          return labels.join('\n');
        },
      },
    };
  }

  private getTooltipFormmaterFunc(
    styleConfigs,
    groupConfigs,
    aggregateConfigs,
    colorConfigs,
    infoConfigs,
    dataColumns,
  ) {
    return seriesParams => {
      const tooltips = !!groupConfigs.length
        ? [`${getColumnRenderName(groupConfigs[0])}: ${seriesParams[0].name}`]
        : [];

      return tooltips
        .concat(
          getSeriesTooltips4Rectangular(
            seriesParams,
            groupConfigs,
            []
              .concat(aggregateConfigs)
              .concat(colorConfigs)
              .concat(infoConfigs),
            dataColumns,
          ),
        )
        .join('<br />');
    };
  }

  private getSeriesStyle(styles) {
    const [smooth, stack, step, symbol] = getStyles(
      styles,
      ['graph'],
      ['smooth', 'stack', 'step', 'symbol'],
    );
    return { smooth, step, symbol: symbol ? 'emptyCircle' : 'none', stack };
  }
}

export default BasicDoubleYChart;
