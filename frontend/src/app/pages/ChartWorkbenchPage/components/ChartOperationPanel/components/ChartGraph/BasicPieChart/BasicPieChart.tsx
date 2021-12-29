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
import {
  ChartConfig,
  ChartDataSectionField,
  ChartDataSectionType,
} from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import {
  getColumnRenderName,
  getExtraSeriesDataFormat,
  getExtraSeriesRowData,
  getStyleValueByGroup,
  getValueByColumnKey,
  transformToObjectArray,
  valueFormatter,
} from 'app/utils/chartHelper';
import { toFormattedValue } from 'app/utils/number';
import { init } from 'echarts';
import Config from './config';

class BasicPieChart extends Chart {
  config = Config;
  chart: any = null;

  protected isCircle = false;
  protected isRose = false;

  constructor(props?) {
    super(
      props?.id || 'pie',
      props?.name || 'Basic Pie Chart',
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
    const dataColumns = transformToObjectArray(dataset.rows, dataset.columns);
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

    const series = this.getSeries(
      styleConfigs,
      dataColumns,
      groupConfigs,
      aggregateConfigs,
      infoConfigs,
    );

    return {
      tooltip: {
        formatter: this.getTooltipFormatterFunc(
          styleConfigs,
          groupConfigs,
          aggregateConfigs,
          infoConfigs,
          dataColumns,
        ),
      },
      legend: this.getLegendStyle(groupConfigs, styleConfigs, series),
      series,
    };
  }

  private getSeries(
    styleConfigs,
    dataColumns,
    groupConfigs,
    aggregateConfigs,
    infoConfigs,
  ) {
    if (!groupConfigs?.length) {
      const dc = dataColumns?.[0];
      return {
        ...this.getBarSeiesImpl(styleConfigs),
        data: aggregateConfigs.map(config => {
          return {
            ...config,
            name: getColumnRenderName(config),
            value: [config]
              .concat(infoConfigs)
              .map(config => dc?.[getValueByColumnKey(config)]),
            itemStyle: this.getDataItemStyle(config, groupConfigs, dc),
            ...getExtraSeriesRowData(dc),
            ...getExtraSeriesDataFormat(config?.format),
          };
        }),
      };
    }

    const groupedConfigNames = groupConfigs.map(config => config?.colName);
    const flatSeries = aggregateConfigs.map(config => {
      return {
        ...this.getBarSeiesImpl(styleConfigs),
        name: getColumnRenderName(config),
        data: dataColumns.map(dc => {
          return {
            ...config,
            name: groupedConfigNames.map(config => dc[config]).join('-'),
            value: aggregateConfigs
              .concat(infoConfigs)
              .map(config => dc?.[getValueByColumnKey(config)]),
            itemStyle: this.getDataItemStyle(config, groupConfigs, dc),
            ...getExtraSeriesRowData(dc),
            ...getExtraSeriesDataFormat(config?.format),
          };
        }),
      };
    });
    return flatSeries;
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

  getGrid(styles) {
    const containLabel = getStyleValueByGroup(styles, 'margin', 'containLabel');
    const left = getStyleValueByGroup(styles, 'margin', 'marginLeft');
    const right = getStyleValueByGroup(styles, 'margin', 'marginRight');
    const bottom = getStyleValueByGroup(styles, 'margin', 'marginBottom');
    const top = getStyleValueByGroup(styles, 'margin', 'marginTop');
    return { left, right, bottom, top, containLabel };
  }

  getBarSeiesImpl(styleConfigs) {
    return {
      type: 'pie',
      sampling: 'average',
      avoidLabelOverlap: false,
      label: this.getLabelStyle(styleConfigs),
      labelLayout: { hideOverlap: true },
      ...this.getSeriesStyle(styleConfigs),
      ...this.getGrid(styleConfigs),
    };
  }

  getLegendStyle(groupConfigs, styles, series) {
    const show = getStyleValueByGroup(styles, 'legend', 'showLegend');
    const type = getStyleValueByGroup(styles, 'legend', 'type');
    const font = getStyleValueByGroup(styles, 'legend', 'font');
    const legendPos = getStyleValueByGroup(styles, 'legend', 'position');
    const selectAll = getStyleValueByGroup(styles, 'legend', 'selectAll');
    let positions = {};
    let orient = {};

    const selected = !![].concat(groupConfigs).length
      ? series[0].data
      : series?.data
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
        positions = { right: 8, top: 16, bottom: 24, width: 96 };
        break;
    }

    return {
      ...positions,
      show,
      type,
      orient,
      selected,
      textStyle: font,
    };
  }

  getLabelStyle(styles) {
    const show = getStyleValueByGroup(styles, 'label', 'showLabel');
    const position = getStyleValueByGroup(styles, 'label', 'position');
    const font = getStyleValueByGroup(styles, 'label', 'font');
    const formatter = this.getLabelFormatter(styles);
    return { show, position, ...font, formatter };
  }

  getLabelFormatter(styles) {
    const showValue = getStyleValueByGroup(styles, 'label', 'showValue');
    const showPercent = getStyleValueByGroup(styles, 'label', 'showPercent');
    const showName = getStyleValueByGroup(styles, 'label', 'showName');
    return seriesParams => {
      if (seriesParams.componentType !== 'series') {
        return seriesParams.name;
      }
      const data = seriesParams?.data || {};
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

  getSeriesStyle(styles) {
    const radiusValue =
      (!this.isCircle && !this.isRose) || (!this.isCircle && this.isRose)
        ? `70%`
        : ['50%', '70%'];
    return { radius: radiusValue, roseType: this.isRose };
  }

  getTooltipFormatterFunc(
    styleConfigs,
    groupConfigs,
    aggregateConfigs,
    infoConfigs,
    dataColumns,
  ) {
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
        dataColumns.map(dc => {
          total += dc?.[getValueByColumnKey(info)];
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
