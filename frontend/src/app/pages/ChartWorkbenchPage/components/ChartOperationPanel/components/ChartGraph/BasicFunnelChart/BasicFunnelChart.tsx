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
  ChartDataSectionField,
  ChartDataSectionType,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import {
  getColumnRenderName,
  getStyleValueByGroup,
  getValueByColumnKey,
  transfromToObjectArray,
  valueFormatter,
} from 'app/utils/chart';
import { toFormattedValue } from 'app/utils/number';
import { init } from 'echarts';
import { isEmpty } from 'lodash';
import Config from './config';

class BasicFunnelChart extends Chart {
  config = Config;
  chart: any = null;

  constructor() {
    super('funnel-chart', '漏斗图', 'fsux_tubiao_loudoutu');
    this.meta.requirements = [
      {
        group: [1, 999],
        aggregate: 1,
      },
      {
        group: 0,
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

    const seriesColumn = this.getSeriesColumnStyle(
      styleConfigs,
      aggregateConfigs,
      groupConfigs,
      objDataColumns,
      colorConfigs,
    );

    return {
      tooltip: this.getFunnelChartTooltip(
        groupConfigs,
        aggregateConfigs,
        infoConfigs,
        objDataColumns,
      ),
      legend: this.getLegendStyle(
        styleConfigs,
        seriesColumn.data.map(d => d.name),
      ),
      series: [seriesColumn],
    };
  }

  private getDataItemStyle(colorConfigs: ChartDataSectionField[], dataColumn) {
    const colorColName = colorConfigs?.[0]?.colName;

    if (colorColName) {
      const colorKey = dataColumn[colorColName];
      const itemStyleColor = colorConfigs[0]?.color?.colors?.find(
        c => c.key === colorKey,
      );

      return {
        color: itemStyleColor?.value,
      };
    }
  }

  getGrid(styles) {
    const containLabel = getStyleValueByGroup(styles, 'margin', 'containLabel');
    const left = getStyleValueByGroup(styles, 'margin', 'marginLeft');
    const right = getStyleValueByGroup(styles, 'margin', 'marginRight');
    const bottom = getStyleValueByGroup(styles, 'margin', 'marginBottom');
    const top = getStyleValueByGroup(styles, 'margin', 'marginTop');
    return { left, right, bottom, top, containLabel };
  }

  getLabelStyle(styles) {
    const show = getStyleValueByGroup(styles, 'label', 'showLabel');
    const position = getStyleValueByGroup(styles, 'label', 'position');
    const font = getStyleValueByGroup(styles, 'label', 'font');
    const metric = getStyleValueByGroup(styles, 'label', 'metric');
    const deminsion = getStyleValueByGroup(styles, 'label', 'deminsion');
    const conversion = getStyleValueByGroup(styles, 'label', 'conversion');
    const arrival = getStyleValueByGroup(styles, 'label', 'arrival');
    const percentage = getStyleValueByGroup(styles, 'label', 'percentage');

    return {
      show,
      position,
      ...font,
      formatter: params => {
        const { name, value, percent, data } = params;
        const formattedValue = toFormattedValue(value, data.format);
        const labels: string[] = [];
        if (deminsion) {
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

  getLegendStyle(styles, datas: string[]) {
    const show = getStyleValueByGroup(styles, 'legend', 'showLegend');
    const type = getStyleValueByGroup(styles, 'legend', 'type');
    const font = getStyleValueByGroup(styles, 'legend', 'font');
    const legendPos = getStyleValueByGroup(styles, 'legend', 'position');
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
      data: datas,
      textStyle: font,
    };
  }

  getSeriesColumnStyle(
    styles,
    aggregateConfigs: ChartDataSectionField[],
    groupConfigs: ChartDataSectionField[],
    objDataColumns,
    colorConfigs,
  ) {
    const selectAll = getStyleValueByGroup(styles, 'legend', 'selectAll');
    const sort = getStyleValueByGroup(styles || [], 'funnel', 'sort');
    const funnelAlign = getStyleValueByGroup(styles || [], 'funnel', 'align');
    const gap = getStyleValueByGroup(styles || [], 'funnel', 'gap') || 0;

    let normalizeSerieDatas: any[] = [];
    if (!groupConfigs.concat(colorConfigs).length) {
      normalizeSerieDatas = aggregateConfigs.map(aggConfig => {
        return {
          ...aggConfig,
          select: selectAll,
          value: objDataColumns[0][getValueByColumnKey(aggConfig)],
          name: getColumnRenderName(aggConfig),
          itemStyle: {
            color: aggConfig?.color?.start,
          },
        };
      });
    } else if (aggregateConfigs.length === 1) {
      const aggConfig = aggregateConfigs[0];
      normalizeSerieDatas = objDataColumns.map(dataColumn => {
        return {
          select: selectAll,
          value: dataColumn[getValueByColumnKey(aggConfig)],
          name: groupConfigs
            .concat(colorConfigs)
            .map(config => config.colName)
            .map(name => dataColumn[name])
            .join('-'),
          itemStyle: {
            ...this.getDataItemStyle(colorConfigs, dataColumn),
            color: aggConfig?.color?.start,
          },
        };
      });
    }

    const series = {
      ...this.getGrid(styles),
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
      data: this.getFunnelSeriesData(normalizeSerieDatas),
    };
    return series;
  }

  getFunnelSeriesData(seriesData) {
    const _calculateConversionAndArrivalRatio = (data, index) => {
      if (index) {
        data.conversion = this.formatPercent(
          (data.value / seriesData[index - 1].value) * 100,
        );
        data.arrival = this.formatPercent(
          (data.value / seriesData[0].value) * 100,
        );
      }
      return data;
    };

    return seriesData.map(_calculateConversionAndArrivalRatio);
  }

  formatPercent(per) {
    const perStr = per + '';
    return perStr.length - (perStr.indexOf('.') + 1) > 2
      ? per.toFixed(2)
      : perStr;
  }

  getFunnelChartTooltip(
    groupConfigs,
    aggregateConfigs,
    infoConfigs,
    objDataColumns,
  ) {
    return {
      trigger: 'item',
      formatter(params) {
        const { color, name, value, percent, data } = params;
        const formattedValue = toFormattedValue(value, data.format);
        const tooltips: string[] = [];
        let basicInfo = `${name}: ${formattedValue}`;
        if (color) {
          basicInfo = `<span class="widget-tooltip-circle" style="background: ${color}"></span> ${basicInfo}`;
        }
        tooltips.push(basicInfo);
        if (infoConfigs?.length) {
          const group = groupConfigs?.[0];
          let dataRow = objDataColumns?.find(
            dc => dc[group?.colName] === params?.name,
          );
          if (!group) {
            dataRow = objDataColumns?.[0];
          }
          infoConfigs?.forEach(config => {
            tooltips.push(
              valueFormatter(config, dataRow?.[getValueByColumnKey(config)]),
            );
          });
        }
        if (data.conversion) {
          tooltips.push(`转化率: ${data.conversion}%`);
        }
        if (data.arrival) {
          tooltips.push(`到达率: ${data.arrival}%`);
        }
        tooltips.push(`百分比: ${percent}%`);
        return tooltips.join('<br/>');
      },
    };
  }
}

export default BasicFunnelChart;
