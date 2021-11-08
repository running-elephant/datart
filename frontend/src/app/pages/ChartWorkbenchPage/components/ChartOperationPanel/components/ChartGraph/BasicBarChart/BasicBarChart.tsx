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
  getColorizeGroupSeriesColumns,
  getColumnRenderName,
  getCustomSortableColumns,
  getExtraSeriesRowData,
  getReference,
  getSeriesTooltips4Rectangular2,
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

class BasicBarChart extends Chart {
  config = Config;
  chart: any = null;

  protected isHorizionDisplay = false;
  protected isStackMode = false;
  protected isPercentageYAxis = false;

  constructor(props?) {
    super(
      props?.id || 'bar',
      props?.name || 'Basic Bar Chart',
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
    this._mouseEvents?.forEach(event => {
      this.chart.on(event.name, event.callback);
    });
  }

  onUpdated(options): void {
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
    const yAxisNames = aggregateConfigs.map(getColumnRenderName);
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
        formatter: this.getTooltipFormmaterFunc(
          styleConfigs,
          groupConfigs,
          aggregateConfigs,
          colorConfigs,
          infoConfigs,
        ),
      },
      legend: this.getLegendStyle(styleConfigs, series),
      grid: this.getGrid(styleConfigs),
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
    dataColumns,
    groupConfigs,
    aggregateConfigs,
    infoConfigs,
    xAxisColumns,
  ) {
    const xAxisColumnName = getValueByColumnKey(groupConfigs?.[0]);
    const yAxisColumnNames = aggregateConfigs.map(getValueByColumnKey);
    const colorColumnName = getValueByColumnKey(colorConfigs[0]);
    const infoColumnNames = infoConfigs.map(getValueByColumnKey);

    if (!colorConfigs.length) {
      const flatSeries = aggregateConfigs.map(aggConfig => {
        return {
          ...this.getBarSeiesImpl(
            styleConfigs,
            settingConfigs,
            dataColumns,
            aggConfig,
          ),
          name: getColumnRenderName(aggConfig),
          data: dataColumns.map(dc => ({
            ...getExtraSeriesRowData(dc),
            name: getColumnRenderName(aggConfig),
            value: dc[getValueByColumnKey(aggConfig)],
          })),
        };
      });
      return flatSeries;
    }

    const secondGroupInfos = getColorizeGroupSeriesColumns(
      dataColumns,
      colorColumnName,
      xAxisColumnName,
      yAxisColumnNames,
      infoColumnNames,
    );

    const colorizeGroupedSeries = aggregateConfigs.flatMap(aggConfig => {
      return secondGroupInfos.map(sgCol => {
        const k = Object.keys(sgCol)[0];
        const v = sgCol[k];

        const itemStyleColor = colorConfigs[0]?.color?.colors?.find(
          c => c.key === k,
        );

        return {
          ...this.getBarSeiesImpl(
            styleConfigs,
            settingConfigs,
            dataColumns,
            sgCol,
          ),
          name: k,
          data: xAxisColumns[0].data.map(d => {
            const dc = v.find(col => col[xAxisColumnName] === d);
            return {
              ...getExtraSeriesRowData(dc),
              name: getColumnRenderName(aggConfig),
              value: dc?.[getValueByColumnKey(aggConfig)] || 0,
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
    dataColumns,
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
      ...getReference(
        settingConfigs,
        dataColumns,
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
    const borderStyle = getStyleValueByGroup(styles, 'bar', 'borderStyle');
    const borderRadius = getStyleValueByGroup(styles, 'bar', 'radius');

    return {
      ...itemStyle,
      borderRadius,
      borderType: borderStyle?.type,
      borderWidth: borderStyle?.width,
      borderColor: borderStyle?.color,
    };
  }

  private getSerieBarGap(styles) {
    return getStyleValueByGroup(styles, 'bar', 'gap');
  }

  private getSerieBarWidth(styles) {
    return getStyleValueByGroup(styles, 'bar', 'width');
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
      axisLabel: {
        show: showLabel,
        rotate,
        interval: showInterval ? interval : null,
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

  getLegendStyle(styles, series) {
    const seriesNames = (series || []).map((col: any) => col?.name);
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

  getStackName(index) {
    return `total`;
  }

  getStyleValueByGroup(
    styles: ChartStyleSectionConfig[],
    groupPath: string,
    childPath: string,
  ) {
    const childPaths = childPath.split('.');
    return this.getStyleValue(styles, [groupPath, ...childPaths]);
  }

  getGroupedSeriesCol(label, series, format) {
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
      value = toExponential(series.value, format);
    } else if (format?.type === FieldFormatType.SCIENTIFIC) {
      value = toExponential(series.value, format);
    }
    return `${label}: ${value}`;
  }

  getTooltipFormmaterFunc(
    styleConfigs,
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

export default BasicBarChart;
