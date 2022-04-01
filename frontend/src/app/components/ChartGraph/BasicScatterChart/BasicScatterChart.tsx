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

import { ChartDataSectionType } from 'app/constants';
import {
  ChartConfig,
  ChartDataSectionField,
  ChartStyleConfig,
  LabelStyle,
  LegendStyle,
  YAxis,
} from 'app/types/ChartConfig';
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import {
  getColumnRenderName,
  getDataColumnMaxAndMin2,
  getExtraSeriesRowData,
  getGridStyle,
  getReference2,
  getScatterSymbolSizeFn,
  getSeriesTooltips4Polar2,
  getStyles,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import Chart from '../../../models/Chart';
import Config from './config';
import { ScatterMetricAndSizeSerie } from './types';

class BasicScatterChart extends Chart {
  dependency = [];
  config = Config;
  chart: any = null;

  constructor() {
    super('scatter', 'viz.palette.graph.names.scatterChart', 'sandiantu');
    this.meta.requirements = [
      {
        group: [0, 999],
        aggregate: 2,
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
    this.chart?.resize(opt, context);
  }

  private getOptions(dataset: ChartDataSetDTO, config: ChartConfig) {
    const styleConfigs = config.styles || [];
    const dataConfigs = config.datas || [];
    const settingConfigs = config.settings || [];
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);
    const sizeConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.SIZE)
      .flatMap(config => config.rows || []);
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.INFO)
      .flatMap(config => config.rows || []);
    const colorConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.COLOR)
      .flatMap(config => config.rows || []);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    const axisColumns = aggregateConfigs.map(config => {
      return {
        type: 'value',
        name: getColumnRenderName(config),
      };
    });

    const series = this.getSeriesGroupByColorConfig(
      chartDataSet,
      groupConfigs,
      aggregateConfigs,
      sizeConfigs,
      colorConfigs,
      infoConfigs,
      styleConfigs,
      settingConfigs,
    );

    return {
      tooltip: {
        formatter: this.getTooltipFormmaterFunc(
          groupConfigs,
          aggregateConfigs,
          colorConfigs,
          sizeConfigs,
          infoConfigs,
          chartDataSet,
        ),
      },
      legend: this.getLegendStyle(
        styleConfigs,
        series?.map(s => s.name),
      ),
      grid: getGridStyle(styleConfigs),
      xAxis: this.getAxis(styleConfigs, axisColumns[0], 'xAxis'),
      yAxis: this.getAxis(styleConfigs, axisColumns[1], 'yAxis'),
      series,
    };
  }

  protected getSeriesGroupByColorConfig(
    chartDataSetRows: IChartDataSet<string>,
    groupConfigs: ChartDataSectionField[],
    aggregateConfigs: ChartDataSectionField[],
    sizeConfigs: ChartDataSectionField[],
    colorConfigs: ChartDataSectionField[],
    infoConfigs: ChartDataSectionField[],
    styleConfigs: ChartStyleConfig[],
    settingConfigs: ChartStyleConfig[],
  ): ScatterMetricAndSizeSerie[] {
    const { min, max } = getDataColumnMaxAndMin2(
      chartDataSetRows,
      sizeConfigs[0],
    );
    if (!colorConfigs?.length) {
      return [
        this.getMetricAndSizeSerie(
          {
            max,
            min,
          },
          chartDataSetRows,
          groupConfigs,
          aggregateConfigs,
          sizeConfigs,
          infoConfigs,
          styleConfigs,
          settingConfigs,
        ),
      ];
    }

    const colors: Array<{ key; value }> =
      colorConfigs?.[0]?.color?.colors || [];

    // TODO(Stephen): should be refactor by ChartDataSet groupBy function
    const groupedObjDataColumns: {
      [key: string]: { color: string; datas: IChartDataSet<string> };
    } = chartDataSetRows?.reduce((acc, cur) => {
      const key = cur.getCell(colorConfigs?.[0]);
      if (acc?.[key]) {
        acc[key].datas.push(cur);
      } else {
        acc[key] = {
          color: colors?.find(c => c.key === key)?.value,
          datas: [cur],
        };
      }
      return acc;
    }, {});

    return Object.keys(groupedObjDataColumns).map(k => {
      return this.getMetricAndSizeSerie(
        {
          max,
          min,
        },
        groupedObjDataColumns?.[k]?.datas,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
        infoConfigs,
        styleConfigs,
        settingConfigs,
        k,
        groupedObjDataColumns?.[k]?.color,
      );
    });
  }

  protected getMetricAndSizeSerie(
    { max, min }: { max: number; min: number },
    dataSetRows: IChartDataSet<string>,
    groupConfigs: ChartDataSectionField[],
    aggregateConfigs: ChartDataSectionField[],
    sizeConfigs: ChartDataSectionField[],
    infoConfigs: ChartDataSectionField[],
    styleConfigs: ChartStyleConfig[],
    settingConfigs: ChartStyleConfig[],
    colorSeriesName?: string,
    color?: string,
  ): ScatterMetricAndSizeSerie {
    const [cycleRatio] = getStyles(styleConfigs, ['scatter'], ['cycleRatio']);
    const seriesName = groupConfigs
      ?.map(gc => getColumnRenderName(gc))
      .join('-');
    const seriesDatas = dataSetRows?.map(row => {
      const sizeValue = row.getCell(sizeConfigs?.[0]) || min;
      return {
        ...getExtraSeriesRowData(row),
        name: groupConfigs?.map(row.getCell, row).join('-'),
        value: aggregateConfigs
          .map(row.getCell, row)
          .concat(infoConfigs?.map(row.getCell, row))
          .concat([sizeValue, colorSeriesName] as any),
      };
    });

    const sizeValueIndex = ([] as ChartDataSectionField[])
      .concat(aggregateConfigs)
      .concat(infoConfigs)?.length;

    return {
      name: colorSeriesName || seriesName,
      type: 'scatter',
      data: seriesDatas,
      symbolSize: getScatterSymbolSizeFn(sizeValueIndex, max, min, cycleRatio),
      itemStyle: {
        color,
      },
      ...this.getLabelStyle(styleConfigs),
      ...getReference2(
        settingConfigs,
        dataSetRows,
        aggregateConfigs?.[1],
        true,
      ),
    };
  }

  private getAxis(
    styles: ChartStyleConfig[],
    xAxisColumn: { type: string; name: string },
    axisKey: string,
  ): YAxis {
    const [
      showAxis,
      inverse,
      lineStyle,
      showLabel,
      font,
      unitFont,
      showTitleAndUnit,
      nameLocation,
      nameGap,
      nameRotate,
      min,
      max,
    ] = getStyles(
      styles,
      [axisKey],
      [
        'showAxis',
        'inverseAxis',
        'lineStyle',
        'showLabel',
        'font',
        'unitFont',
        'showTitleAndUnit',
        'nameLocation',
        'nameGap',
        'nameRotate',
        'min',
        'max',
      ],
    );
    const name = showTitleAndUnit
      ? [xAxisColumn].map(c => c.name).join(' / ')
      : null;
    const splitLineProps =
      axisKey === 'xAxis'
        ? ['showHorizonLine', 'horizonLineStyle']
        : ['showVerticalLine', 'verticalLineStyle'];
    const [showSplitLine, splitLineStyle] = getStyles(
      styles,
      ['splitLine'],
      [splitLineProps[0], splitLineProps[1]],
    );

    return {
      type: 'value',
      inverse,
      name,
      nameLocation,
      nameGap,
      nameRotate,
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
        show: showSplitLine,
        lineStyle: splitLineStyle,
      },
    };
  }

  private getLegendStyle(
    styles: ChartStyleConfig[],
    seriesNames: string[],
  ): LegendStyle {
    const [show, type, font, legendPos, selectAll, height] = getStyles(
      styles,
      ['legend'],
      ['showLegend', 'type', 'font', 'position', 'selectAll', 'height'],
    );
    let positions = {};
    let orient = '';

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
      height: height || null,
      orient,
      selected,
      data: seriesNames,
      textStyle: font,
    };
  }

  private getLabelStyle(styles: ChartStyleConfig[]): LabelStyle {
    const [show, position, font] = getStyles(
      styles,
      ['label'],
      ['showLabel', 'position', 'font'],
    );
    return {
      label: { show, position, ...font, formatter: '{b}' },
      labelLayout: { hideOverlap: true },
    };
  }

  private getTooltipFormmaterFunc(
    groupConfigs: ChartDataSectionField[],
    aggregateConfigs: ChartDataSectionField[],
    colorConfigs: ChartDataSectionField[],
    sizeConfigs: ChartDataSectionField[],
    infoConfigs: ChartDataSectionField[],
    chartDataSet: IChartDataSet<string>,
  ): (params) => string {
    return seriesParams => {
      return getSeriesTooltips4Polar2(
        chartDataSet,
        seriesParams,
        groupConfigs,
        colorConfigs,
        aggregateConfigs,
        infoConfigs,
        sizeConfigs,
      );
    };
  }
}

export default BasicScatterChart;
