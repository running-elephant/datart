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

import {
  ChartConfig,
  ChartDataSectionField,
  ChartDataSectionType,
} from 'app/types/ChartConfig';
import ChartDataSetDTO from 'app/types/ChartDataSet';
import {
  getColumnRenderName,
  getExtraSeriesDataFormat,
  getExtraSeriesRowData,
  getGridStyle,
  getSeriesTooltips4Scatter,
  getStyles,
  getValueByColumnKey,
  transformToObjectArray,
} from 'app/utils/chartHelper';
import { toFormattedValue } from 'app/utils/number';
import { init } from 'echarts';
import isEmpty from 'lodash/isEmpty';
import Chart from '../models/Chart';
import Config from './config';

class BasicFunnelChart extends Chart {
  config = Config;
  chart: any = null;

  constructor() {
    super(
      'funnel-chart',
      'viz.palette.graph.names.funnelChart',
      'fsux_tubiao_loudoutu',
    );
    this.meta.requirements = [
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
    this.mouseEvents?.forEach(event => {
      this.chart.on(event.name, event.callback);
    });
  }

  onUpdated(props): void {
    if (!props.dataset || !props.dataset.columns || !props.config) {
      return;
    }

    this.chart?.clear();
    if (!this.isMatchRequirement(props.config)) {
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
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.INFO)
      .flatMap(config => config.rows || []);

    const objDataColumns = transformToObjectArray(
      dataset.rows,
      dataset.columns,
    );
    const dataList = !groupConfigs.length
      ? objDataColumns
      : objDataColumns?.sort(
          (a, b) =>
            b?.[getValueByColumnKey(aggregateConfigs[0])] -
            a?.[getValueByColumnKey(aggregateConfigs[0])],
        );
    const aggregateList = !groupConfigs.length
      ? aggregateConfigs?.sort(
          (a, b) =>
            objDataColumns?.[0]?.[getValueByColumnKey(b)] -
            objDataColumns?.[0]?.[getValueByColumnKey(a)],
        )
      : aggregateConfigs;

    const series = this.getSeries(
      styleConfigs,
      aggregateList,
      groupConfigs,
      dataList,
      infoConfigs,
    );

    return {
      tooltip: this.getFunnelChartTooltip(
        groupConfigs,
        aggregateList,
        infoConfigs,
      ),
      legend: this.getLegendStyle(styleConfigs),
      series,
    };
  }

  private getDataItemStyle(
    config,
    colorConfigs: ChartDataSectionField[],
    dataColumn,
  ) {
    const colorColName = colorConfigs?.[0]?.colName;
    const columnColor = config?.color?.start;
    if (colorColName) {
      const colorKey = dataColumn[colorColName];
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

  private getLabelStyle(styles) {
    const [show, position, font, metric, conversion, arrival, percentage] =
      getStyles(
        styles,
        ['label'],
        [
          'showLabel',
          'position',
          'font',
          'metric',
          'conversion',
          'arrival',
          'percentage',
        ],
      );

    return {
      show,
      position,
      ...font,
      formatter: params => {
        const { name, value, percent, data } = params;
        const formattedValue = toFormattedValue(value?.[0], data.format);
        const labels: string[] = [];
        if (metric) {
          labels.push(`${name}: ${formattedValue}`);
        }
        if (conversion && !isEmpty(data.conversion)) {
          labels.push(`转化率: ${data.conversion}%`);
        }
        if (arrival && !isEmpty(data.arrival)) {
          labels.push(`到达率: ${data.arrival}%`);
        }
        if (percentage) {
          labels.push(`百分比: ${percent}%`);
        }

        return labels.join('\n');
      },
    };
  }

  private getLegendStyle(styles) {
    const [show, type, font, legendPos] = getStyles(
      styles,
      ['legend'],
      ['showLegend', 'type', 'font', 'position'],
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

    return {
      ...positions,
      show,
      type,
      orient,
      textStyle: font,
    };
  }

  private getSeries(
    styles,
    aggregateConfigs: ChartDataSectionField[],
    groupConfigs: ChartDataSectionField[],
    objDataColumns,
    infoConfigs,
  ) {
    const [selectAll] = getStyles(styles, ['legend'], ['selectAll']);
    const [sort, funnelAlign, gap] = getStyles(
      styles,
      ['funnel'],
      ['sort', 'align', 'gap'],
    );

    if (!groupConfigs.length) {
      const dc = objDataColumns?.[0];
      const datas = aggregateConfigs.map(aggConfig => {
        return {
          ...aggConfig,
          select: selectAll,
          value: [aggConfig]
            .concat(infoConfigs)
            .map(config => dc?.[getValueByColumnKey(config)]),
          name: getColumnRenderName(aggConfig),
          itemStyle: this.getDataItemStyle(aggConfig, groupConfigs, dc),
          ...getExtraSeriesRowData(dc),
          ...getExtraSeriesDataFormat(aggConfig?.format),
        };
      });
      return {
        ...getGridStyle(styles),
        type: 'funnel',
        funnelAlign,
        sort,
        gap,
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid',
          },
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
        label: this.getLabelStyle(styles),
        labelLayout: { hideOverlap: true },
        data: this.getFunnelSeriesData(datas),
      };
    }

    const flattenedDatas = aggregateConfigs.flatMap(aggConfig => {
      const ormalizeSerieDatas = objDataColumns.map(dc => {
        return {
          ...aggConfig,
          select: selectAll,
          value: aggregateConfigs
            .concat(infoConfigs)
            .map(config => dc?.[getValueByColumnKey(config)]),
          name: groupConfigs
            .map(config => config.colName)
            .map(name => dc[name])
            .join('-'),
          itemStyle: this.getDataItemStyle(aggConfig, groupConfigs, dc),
          ...getExtraSeriesRowData(dc),
          ...getExtraSeriesDataFormat(aggConfig?.format),
        };
      });
      return ormalizeSerieDatas;
    });

    const series = {
      ...getGridStyle(styles),
      type: 'funnel',
      funnelAlign,
      sort,
      gap,
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid',
        },
      },
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
      label: this.getLabelStyle(styles),
      data: this.getFunnelSeriesData(flattenedDatas),
    };
    return series;
  }

  private getFunnelSeriesData(seriesData) {
    const _calculateConversionAndArrivalRatio = (data, index) => {
      if (index) {
        data.conversion = this.formatPercent(
          (data.value?.[0] / seriesData[index - 1].value?.[0]) * 100,
        );
        data.arrival = this.formatPercent(
          (data.value?.[0] / seriesData[0].value?.[0]) * 100,
        );
      }
      return data;
    };

    return seriesData.map(_calculateConversionAndArrivalRatio);
  }

  private formatPercent(per) {
    const perStr = per + '';
    return perStr.length - (perStr.indexOf('.') + 1) > 2
      ? per.toFixed(2)
      : perStr;
  }

  private getFunnelChartTooltip(groupConfigs, aggregateConfigs, infoConfigs) {
    return {
      trigger: 'item',
      formatter(params) {
        const { data } = params;
        let tooltips: string[] = !!groupConfigs?.length
          ? [
              `${groupConfigs?.map(gc => getColumnRenderName(gc)).join('-')}: ${
                params?.name
              }`,
            ]
          : [];
        const aggTooltips = !!groupConfigs?.length
          ? getSeriesTooltips4Scatter(
              [params],
              aggregateConfigs.concat(infoConfigs),
            )
          : getSeriesTooltips4Scatter([params], [data].concat(infoConfigs));
        tooltips = tooltips.concat(aggTooltips);
        if (data.conversion) {
          tooltips.push(`转化率: ${data.conversion}%`);
        }
        if (data.arrival) {
          tooltips.push(`到达率: ${data.arrival}%`);
        }
        return tooltips.join('<br/>');
      },
    };
  }
}

export default BasicFunnelChart;
