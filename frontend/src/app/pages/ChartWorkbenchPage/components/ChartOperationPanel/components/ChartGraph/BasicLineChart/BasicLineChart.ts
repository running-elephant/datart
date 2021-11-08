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
  FieldFormatType,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import {
  getAxisLabel,
  getAxisLine,
  getAxisTick,
  getColorizeGroupSeriesColumns,
  getColumnRenderName,
  getCustomSortableColumns,
  getExtraSeriesRowData,
  getNameTextStyle,
  getReference,
  getSeriesTooltips4Rectangular2,
  getSplitLine,
  getStyleValueByGroup,
  getValueByColumnKey,
  transfromToObjectArray,
} from 'app/utils/chart';
import {
  toExponential,
  toFormattedValue,
  toPrecision,
  toUnit,
  toUnitDesc,
} from 'app/utils/number';
import { init } from 'echarts';
import { UniqArray } from 'utils/object';
import Config from './config';

class BasicLineChart extends Chart {
  config = Config;
  chart: any = null;

  protected isArea = false;
  protected isStack = false;

  constructor(props?) {
    super(
      props?.id || 'line',
      props?.name || 'Basic Line Chart',
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

    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );
    const dataColumns = getCustomSortableColumns(objDataColumns, dataConfigs);
    const xAxisColumns = (groupConfigs || []).map(config => {
      return {
        type: 'category',
        tooltip: { show: true },
        data: UniqArray(dataColumns.map(dc => dc[getValueByColumnKey(config)])),
      };
    });
    const series = this.getSeries(
      settingConfigs,
      styleConfigs,
      colorConfigs,
      dataColumns,
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
      grid: this.getGrid(styleConfigs),
      xAxis: this.getXAxis(styleConfigs, xAxisColumns),
      yAxis: this.getYAxis(styleConfigs, yAxisNames),
      series,
    };
  }

  getSeries(
    settingConfigs,
    styleConfigs,
    colorConfigs,
    dataColumns,
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
          data: dataColumns.map(dc => ({
            ...getExtraSeriesRowData(dc),
            name: getColumnRenderName(aggConfig),
            value: dc[getValueByColumnKey(aggConfig)],
          })),
          itemStyle: {
            color,
          },
          ...this.getLabelStyle(styleConfigs),
          ...this.getSeriesStyle(styleConfigs),
          ...getReference(settingConfigs, dataColumns, aggConfig, false),
        };
      });
    }

    const xAxisColumnName = getValueByColumnKey(groupConfigs?.[0]);
    const yAxisColumnNames = aggregateConfigs.map(getValueByColumnKey);
    const colorColumnName = getValueByColumnKey(colorConfigs[0]);
    const infoColumnNames = infoConfigs.map(getValueByColumnKey);

    const secondGroupInfos = getColorizeGroupSeriesColumns(
      dataColumns,
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
              name: getColumnRenderName(aggConfig),
              value: target?.[getValueByColumnKey(aggConfig)] || 0,
            };
          }),
          ...this.getLabelStyle(styleConfigs),
          ...this.getSeriesStyle(styleConfigs),
        };
      });
    });
  }

  getGrid(styles) {
    const containLabel = getStyleValueByGroup(styles, 'margin', 'containLabel');
    const left = getStyleValueByGroup(styles, 'margin', 'marginLeft');
    const right = getStyleValueByGroup(styles, 'margin', 'marginRight');
    const bottom = getStyleValueByGroup(styles, 'margin', 'marginBottom');
    const top = getStyleValueByGroup(styles, 'margin', 'marginTop');
    return { left, right, bottom, top, containLabel };
  }

  getYAxis(styles, yAxisNames) {
    const showAxis = getStyleValueByGroup(styles, 'yAxis', 'showAxis');
    const inverse = getStyleValueByGroup(styles, 'yAxis', 'inverseAxis');
    const lineStyle = getStyleValueByGroup(styles, 'yAxis', 'lineStyle');
    const showLabel = getStyleValueByGroup(styles, 'yAxis', 'showLabel');
    const font = getStyleValueByGroup(styles, 'yAxis', 'font');
    const unitFont = getStyleValueByGroup(styles, 'yAxis', 'unitFont');
    const showTitleAndUnit = getStyleValueByGroup(
      styles,
      'yAxis',
      'showTitleAndUnit',
    );
    const name = showTitleAndUnit ? yAxisNames.join(' / ') : null;
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

  getXAxis(styles, xAxisColumns) {
    const axisColumnInfo = xAxisColumns[0];
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

  getLegendStyle(styles, seriesNames) {
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

  getLabelStyle(styles) {
    const show = getStyleValueByGroup(styles, 'label', 'showLabel');
    const position = getStyleValueByGroup(styles, 'label', 'position');
    const font = getStyleValueByGroup(styles, 'label', 'font');
    return {
      label: {
        show,
        position,
        ...font,
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

  getSeriesStyle(styles) {
    const smooth = getStyleValueByGroup(styles, 'graph', 'smooth');
    const step = getStyleValueByGroup(styles, 'graph', 'step');
    return { smooth, step };
  }

  getStyleValueByGroup(
    styles: ChartStyleSectionConfig[],
    groupPath: string,
    childPath: string,
  ) {
    const childPaths = childPath.split('.');
    return this.getStyleValue(styles, [groupPath, ...childPaths]);
  }

  getGroupedSeriesCol(name, series, format) {
    let value = `${series.value}`;
    if (
      format?.type === FieldFormatType.NUMERIC ||
      format?.type === FieldFormatType.CURRENCY
    ) {
      if (format?.unit === 1) {
        value = toPrecision(series.value, format.precision);
      } else if (format?.unit > 1) {
        value = toUnitDesc(
          toPrecision(toUnit(series.value, format.unit), format.precision),
          format.unitDesc,
        );
      }
    } else if (format?.type === FieldFormatType.PERCENTAGE) {
      value = toUnitDesc(
        toPrecision(toUnit(series.value, format.unit), format.precision),
        format.unitDesc,
      );
    } else if (format?.type === FieldFormatType.SCIENTIFIC) {
      value = toExponential(series.value, format.precision);
    }
    return `${name}: ${value}`;
  }

  getTooltipFormmaterFunc(
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
