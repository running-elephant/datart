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
  ChartStyleSectionConfig,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import {
  getColumnRenderName,
  getExtraSeriesRowData,
  getStyleValueByGroup,
  getValueByColumnKey,
  transfromToObjectArray,
  valueFormatter,
} from 'app/utils/chart';
import { init } from 'echarts';
import { UniqArray } from 'utils/object';
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
      { group: [1, 999], aggregate: 1 },
      { group: 0, aggregate: [2, 999] },
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
    const dataColumns = transfromToObjectArray(dataset.rows, dataset.columns);
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

    const xAxisColumns = groupConfigs.map(config => {
      return {
        name: getColumnRenderName(config),
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
      xAxisColumns,
    );

    return {
      tooltip: {
        formatter: this.getTooltipFormmaterFunc(
          styleConfigs,
          groupConfigs,
          aggregateConfigs,
          colorConfigs,
          infoConfigs,
          dataColumns,
        ),
      },
      legend: this.getLegendStyle(
        groupConfigs,
        colorConfigs,
        styleConfigs,
        series,
      ),
      series,
    };
  }

  private getSeries(
    settingConfigs,
    styleConfigs,
    colorConfigs,
    dataColumns,
    groupConfigs,
    aggregateConfigs,
    xAxisColumns,
  ) {
    if (![].concat(groupConfigs).concat(colorConfigs)?.length) {
      const dc = dataColumns?.[0];
      return {
        ...this.getBarSeiesImpl(styleConfigs),
        data: aggregateConfigs.map(config => {
          return {
            ...getExtraSeriesRowData({
              [getValueByColumnKey(config)]: dc[getValueByColumnKey(config)],
            }),
            name: getColumnRenderName(config),
            value: dc[getValueByColumnKey(config)],
            itemStyle: this.getDataItemStyle(config, colorConfigs, dc),
          };
        }),
      };
    }

    const groupedConfigNames = groupConfigs
      .concat(colorConfigs)
      .map(config => config?.colName);

    const flatSeries = aggregateConfigs.map(config => {
      return {
        ...this.getBarSeiesImpl(styleConfigs),
        name: getColumnRenderName(config),
        data: dataColumns.map(dc => {
          return {
            ...getExtraSeriesRowData(dc),
            name: groupedConfigNames.map(config => dc[config]).join('-'),
            value: dc[getValueByColumnKey(config)],
            itemStyle: this.getDataItemStyle(config, colorConfigs, dc),
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
      ...this.getSeriesStyle(styleConfigs),
      ...this.getGrid(styleConfigs),
    };
  }

  getLegendStyle(groupConfigs, colorConfigs, styles, series) {
    const show = getStyleValueByGroup(styles, 'legend', 'showLegend');
    const type = getStyleValueByGroup(styles, 'legend', 'type');
    const font = getStyleValueByGroup(styles, 'legend', 'font');
    const legendPos = getStyleValueByGroup(styles, 'legend', 'position');
    const selectAll = getStyleValueByGroup(styles, 'legend', 'selectAll');
    let positions = {};
    let orient = {};

    const selected = !![].concat(groupConfigs).concat(colorConfigs).length
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
    return { show, position, ...font, formatter: '{b}: {d}%' };
  }

  getSeriesStyle(styles) {
    const radiusValue =
      (!this.isCircle && !this.isRose) || (!this.isCircle && this.isRose)
        ? `70%`
        : ['50%', '70%'];
    return { radius: radiusValue, roseType: this.isRose };
  }

  getStyleValueByGroup(
    styles: ChartStyleSectionConfig[],
    groupPath: string,
    childPath: string,
  ) {
    const childPaths = childPath.split('.');
    return this.getStyleValue(styles, [groupPath, ...childPaths]);
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
      let dataRow = dataColumns?.find(
        dc =>
          groupConfigs
            .concat(colorConfigs)
            .map(config => dc?.[getValueByColumnKey(config)])
            .join('-') === seriesParams?.name,
      );
      if (dataColumns?.length === 1) {
        dataRow = dataColumns[0];
      }

      const toolTips = []
        .concat(groupConfigs)
        .concat(colorConfigs)
        .concat(
          aggregateConfigs?.filter(
            aggConfig =>
              getValueByColumnKey(aggConfig) === seriesParams?.name ||
              getValueByColumnKey(aggConfig) === seriesParams?.seriesName,
          ),
        )
        .concat(infoConfigs)
        .map(config =>
          valueFormatter(config, dataRow?.[getValueByColumnKey(config)]),
        );

      return toolTips.join('<br />');
    };
  }
}

export default BasicPieChart;
