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
} from 'app/types/ChartConfig';
import ChartDataSetDTO, {
  IChartDataSet,
  IChartDataSetRow,
} from 'app/types/ChartDataSet';
import {
  getColumnRenderName,
  getExtraSeriesDataFormat,
  getExtraSeriesRowData,
  getGridStyle,
  getStyles,
  toFormattedValue,
  transformToDataSet,
  valueFormatter,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import Chart from '../../../models/Chart';
import Config from './config';
import { PieSeries, PieSeriesImpl, PieSeriesStyle } from './types';

class BasicPieChart extends Chart {
  config = Config;
  chart: any = null;

  protected isCircle = false;
  protected isRose = false;

  constructor(props?) {
    super(
      props?.id || 'pie',
      props?.name || 'viz.palette.graph.names.pieChart',
      props?.icon || 'chartpie',
    );
    this.meta.requirements = props?.requirements || [
      { group: [0, 1], aggregate: [1, 999] },
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

  private getOptions(dataset: ChartDataSetDTO, config: ChartConfig) {
    const styleConfigs = config.styles || [];
    const dataConfigs = config.datas || [];
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.INFO)
      .flatMap(config => config.rows || []);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );
    const series = this.getSeries(
      styleConfigs,
      chartDataSet,
      groupConfigs,
      aggregateConfigs,
      infoConfigs,
    );

    return {
      tooltip: {
        formatter: this.getTooltipFormatterFunc(
          groupConfigs,
          aggregateConfigs,
          infoConfigs,
          chartDataSet,
        ),
      },
      legend: this.getLegendStyle(groupConfigs, styleConfigs, series),
      series,
    };
  }

  private getSeries(
    styleConfigs: ChartStyleConfig[],
    chartDataSet: IChartDataSet<string>,
    groupConfigs: ChartDataSectionField[],
    aggregateConfigs: ChartDataSectionField[],
    infoConfigs: ChartDataSectionField[],
  ): PieSeriesStyle[] | PieSeriesStyle {
    if (!groupConfigs?.length) {
      const row = chartDataSet?.[0];
      return {
        ...this.getPieSeriesImpl(styleConfigs),
        data: aggregateConfigs.map(config => {
          return {
            ...config,
            name: getColumnRenderName(config),
            value: [config]
              .concat(infoConfigs)
              .map(config => row?.getCell(config)),
            itemStyle: this.getDataItemStyle(config, groupConfigs, row),
            ...getExtraSeriesRowData(row),
            ...getExtraSeriesDataFormat(config?.format),
          };
        }),
      };
    }

    const flatSeries = aggregateConfigs.map(config => {
      return {
        ...this.getPieSeriesImpl(styleConfigs),
        name: getColumnRenderName(config),
        data: chartDataSet?.map(row => {
          return {
            ...config,
            name: groupConfigs.map(row.getCell, row).join('-'),
            value: aggregateConfigs.concat(infoConfigs).map(row.getCell, row),
            itemStyle: this.getDataItemStyle(config, groupConfigs, row),
            ...getExtraSeriesRowData(row),
            ...getExtraSeriesDataFormat(config?.format),
          };
        }),
      };
    });
    return flatSeries;
  }

  private getDataItemStyle(
    config: ChartDataSectionField,
    colorConfigs: ChartDataSectionField[],
    row: IChartDataSetRow<string>,
  ): { color: string | undefined } | undefined {
    const colorConfig = colorConfigs?.[0];
    const columnColor = config?.color?.start;
    if (colorConfig) {
      const colorKey = row?.getCell(colorConfig);
      const itemStyleColor = colorConfigs[0]?.color?.colors?.find(
        c => c.key === colorKey,
      );

      return {
        color: itemStyleColor?.value,
      };
    } else if (columnColor) {
      return {
        color: columnColor,
      };
    }
  }

  private getPieSeriesImpl(styleConfigs: ChartStyleConfig[]): PieSeriesImpl {
    return {
      type: 'pie',
      sampling: 'average',
      avoidLabelOverlap: false,
      ...this.getLabelStyle(styleConfigs),
      ...this.getSeriesStyle(styleConfigs),
      ...getGridStyle(styleConfigs),
    };
  }

  private getLegendStyle(
    groupConfigs: ChartDataSectionField[],
    styles: ChartStyleConfig[],
    series: PieSeriesStyle | PieSeriesStyle[],
  ): LegendStyle {
    const [show, type, font, legendPos, selectAll, height] = getStyles(
      styles,
      ['legend'],
      ['showLegend', 'type', 'font', 'position', 'selectAll', 'height'],
    );
    let positions = {};
    let orient = '';

    const selected = (
      !!groupConfigs.length ? series[0].data : (series as PieSeriesStyle)?.data
    )
      .map(d => d.name)
      .reduce(
        (obj, name) => ({
          ...obj,
          [name]: selectAll,
        }),
        {},
      );

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
        positions = { right: 8, top: 16, bottom: 24 };
        break;
    }

    return {
      ...positions,
      show,
      type,
      height: height || null,
      orient,
      selected,
      textStyle: font,
    };
  }

  private getLabelStyle(styles: ChartStyleConfig[]): LabelStyle {
    const [show, position, font] = getStyles(
      styles,
      ['label'],
      ['showLabel', 'position', 'font'],
    );
    const formatter = this.getLabelFormatter(styles);
    return {
      label: {
        show: position === 'center' ? false : show,
        position,
        ...font,
        formatter,
      },
      labelLayout: { hideOverlap: true },
    };
  }

  private getLabelFormatter(styles: ChartStyleConfig[]): (params) => string {
    const [showValue, showPercent, showName] = getStyles(
      styles,
      ['label'],
      ['showValue', 'showPercent', 'showName'],
    );
    return seriesParams => {
      if (seriesParams.componentType !== 'series') {
        return seriesParams.name;
      }
      const data = seriesParams?.data || {};

      //处理 label 旧数据中没有 showValue, showPercent, showName 数据  alpha.3版本之后是 boolean 类型 后续版本稳定之后 可以移除此逻辑
      // TODO migration start
      if (showName === null || showPercent === null || showValue === null) {
        return `${seriesParams?.name}: ${seriesParams?.percent + '%'}`;
      }
      // TODO migration end --tl

      return `${showName ? seriesParams?.name : ''}${
        showName && (showValue || showPercent) ? ': ' : ''
      }${
        showValue ? toFormattedValue(seriesParams?.value[0], data?.format) : ''
      }${
        showPercent && showValue
          ? '(' + seriesParams?.percent + '%)'
          : showPercent
          ? seriesParams?.percent + '%'
          : ''
      }`;
    };
  }

  private getSeriesStyle(styles: ChartStyleConfig[]): PieSeries {
    const radiusValue =
      (!this.isCircle && !this.isRose) || (!this.isCircle && this.isRose)
        ? `70%`
        : ['50%', '70%'];
    return { radius: radiusValue, roseType: this.isRose };
  }

  private getTooltipFormatterFunc(
    groupConfigs: ChartDataSectionField[],
    aggregateConfigs: ChartDataSectionField[],
    infoConfigs: ChartDataSectionField[],
    chartDataSet: IChartDataSet<string>,
  ): (params) => string {
    return seriesParams => {
      if (seriesParams.componentType !== 'series') {
        return seriesParams.name;
      }
      const { data, value, percent } = seriesParams;
      if (!groupConfigs?.length) {
        const tooltip = [data]
          .concat(infoConfigs)
          .map((config, index) => valueFormatter(config, value?.[index]));
        tooltip[0] += '(' + percent + '%)';
        return tooltip.join('<br />');
      }
      const infoTotal = infoConfigs.map(info => {
        let total = 0;
        chartDataSet.forEach(row => {
          total += Number((row as IChartDataSetRow<string>).getCell(info));
        });
        return total;
      });
      let tooltip = aggregateConfigs
        .concat(infoConfigs)
        .map((config, index) => {
          let tooltipValue = valueFormatter(config, value?.[index]);
          if (!index) {
            return (tooltipValue += '(' + percent + '%)');
          }
          const percentNum =
            (value?.[aggregateConfigs?.length] / infoTotal?.[index - 1]) *
              100 || 0;
          return (tooltipValue += '(' + percentNum.toFixed(2) + '%)');
        });
      return tooltip.join('<br />');
    };
  }
}

export default BasicPieChart;
