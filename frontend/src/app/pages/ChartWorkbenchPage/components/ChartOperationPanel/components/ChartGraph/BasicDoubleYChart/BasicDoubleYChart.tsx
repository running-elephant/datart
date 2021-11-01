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
import ChartConfig, {
  ChartDataSectionType,
  ChartStyleSectionConfig,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import {
  getAxisLabel,
  getAxisLine,
  getAxisTick,
  getColumnRenderName,
  getCustomSortableColumns,
  getReference,
  getSeriesTooltips4Rectangular,
  getSplitLine,
  getStyleValueByGroup,
  getValueByColumnKey,
  transfromToObjectArray,
} from 'app/utils/chart';
import { toFormattedValue } from 'app/utils/number';
import { init } from 'echarts';
import Config from './config';

class BasicDoubleYChart extends Chart {
  dependency = [];
  config = Config;
  chart: any = null;

  constructor() {
    super('double-y', '双Y轴图', 'fsux_tubiao_shuangzhoutu');
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
    this._mouseEvents?.forEach(event => {
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

  getOptions(dataset: ChartDataset, config: ChartConfig) {
    const dataConfigs = config.datas || [];
    const styleConfigs = config.styles || [];
    const settingConfigs = config.settings;

    const objDataColumns = transfromToObjectArray(
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

    const leftDeminsionConfigs = dataConfigs
      .filter(
        c =>
          c.type === ChartDataSectionType.AGGREGATE && c.key === 'deminsionL',
      )
      .flatMap(config => config.rows || []);
    const rightDeminsionConfigs = dataConfigs
      .filter(
        c =>
          c.type === ChartDataSectionType.AGGREGATE && c.key === 'deminsionR',
      )
      .flatMap(config => config.rows || []);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: this.getTooltipFormmaterFunc(
          styleConfigs,
          groupConfigs,
          leftDeminsionConfigs.concat(rightDeminsionConfigs),
          [],
          infoConfigs,
          dataColumns,
        ),
      },
      grid: this.getGrid(styleConfigs),
      legend: this.getLegend(
        styleConfigs,
        leftDeminsionConfigs
          .concat(rightDeminsionConfigs)
          .map(getColumnRenderName),
      ),
      xAxis: this.getXAxis(styleConfigs, groupConfigs, dataColumns),
      yAxis: this.getYAxis(
        styleConfigs,
        leftDeminsionConfigs,
        rightDeminsionConfigs,
      ),
      series: this.getSeries(
        styleConfigs,
        settingConfigs,
        leftDeminsionConfigs,
        rightDeminsionConfigs,
        dataColumns,
      ),
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

  getSeries(
    styleConfigs,
    settingConfigs,
    leftDeminsionConfigs,
    rightDeminsionConfigs,
    dataColumns,
  ) {
    const _getSeriesByDemisionPostion =
      () => (config, styles, settings, data, direction) => {
        const graphType = getStyleValueByGroup(
          styleConfigs,
          direction,
          'graphType',
        );
        const graphStyle = getStyleValueByGroup(
          styles,
          direction,
          'graphStyle',
        );

        return {
          name: getColumnRenderName(config),
          type: graphType || 'line',
          sampling: 'average',
          data: dataColumns.map(dc => ({
            ...config,
            value: dc[getValueByColumnKey(config)],
          })),
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
            styleConfigs,
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
            styleConfigs,
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

  getGraphStyle(graphType, style) {
    if (graphType === 'line') {
      return { lineStyle: style };
    } else {
      return {
        barWidth: style?.width,
        color: style?.color,
      };
    }
  }

  getXAxis(styleConfigs, xAxisConfigs, dataColumns) {
    const fisrtXAxisConfig = xAxisConfigs[0];
    const showAxis = getStyleValueByGroup(styleConfigs, 'xAxis', 'showAxis');
    const inverse = getStyleValueByGroup(styleConfigs, 'xAxis', 'inverseAxis');
    const lineStyle = getStyleValueByGroup(styleConfigs, 'xAxis', 'lineStyle');
    const showLabel = getStyleValueByGroup(styleConfigs, 'xAxis', 'showLabel');
    const font = getStyleValueByGroup(styleConfigs, 'xAxis', 'font');
    const rotate = getStyleValueByGroup(styleConfigs, 'xAxis', 'rotate');
    const showInterval = getStyleValueByGroup(
      styleConfigs,
      'xAxis',
      'showInterval',
    );
    const interval = getStyleValueByGroup(styleConfigs, 'xAxis', 'interval');
    const showVerticalLine = getStyleValueByGroup(
      styleConfigs,
      'splitLine',
      'showVerticalLine',
    );
    const verticalLineStyle = getStyleValueByGroup(
      styleConfigs,
      'splitLine',
      'verticalLineStyle',
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

  getYAxis(styles, leftDeminsionConfigs, rightDeminsionConfigs) {
    const showAxis = getStyleValueByGroup(styles, 'doubleY', 'showAxis');
    const inverse = getStyleValueByGroup(styles, 'doubleY', 'inverseAxis');
    const showLabel = getStyleValueByGroup(styles, 'doubleY', 'showLabel');
    const font = getStyleValueByGroup(styles, 'doubleY', 'font');
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

  getLegend(styles, seriesNames) {
    const show = getStyleValueByGroup(styles, 'legend', 'showLegend');
    const type = getStyleValueByGroup(styles, 'legend', 'type');
    const font = getStyleValueByGroup(styles, 'legend', 'font');
    const legendPos = getStyleValueByGroup(styles, 'legend', 'position');
    const selectAll = getStyleValueByGroup(styles, 'legend', 'selectAll');
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

  getLabelStyle(styles, direction) {
    const position = getStyleValueByGroup(styles, 'label', 'position');
    const showLabel = getStyleValueByGroup(styles, direction, 'showLabel');
    const LabelFont = getStyleValueByGroup(styles, direction, 'font');

    return {
      label: {
        show: showLabel,
        position,
        ...LabelFont,
        formatter: params => {
          const { name, value, data } = params;
          const formattedValue = toFormattedValue(value, data.format);
          const labels: string[] = [];
          labels.push(`${name}: ${formattedValue}`);
          return labels.join('\n');
        },
      },
    };
  }

  getTooltipFormmaterFunc(
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

  getSeriesStyle(styles) {
    const smooth = getStyleValueByGroup(styles, 'graph', 'smooth');
    const stack = getStyleValueByGroup(styles, 'graph', 'stack');
    const step = getStyleValueByGroup(styles, 'graph', 'step');
    const symbol = getStyleValueByGroup(styles, 'graph', 'symbol')
      ? 'emptyCircle'
      : 'none';
    return { smooth, step, symbol, stack };
  }

  getStyleValueByGroup(
    styles: ChartStyleSectionConfig[],
    groupPath: string,
    childPath: string,
  ) {
    const childPaths = childPath.split('.');
    return this.getStyleValue(styles, [groupPath, ...childPaths]);
  }
}

export default BasicDoubleYChart;
