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
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import {
  getStyleValueByGroup,
  getValueByColumnKey,
  transfromToObjectArray,
} from 'app/utils/chart';
import Config from './config';
import geoChinaCity from './geo-china-city.map.json';
import geoChina from './geo-china.map.json';

// NOTE: integrate with amap echart extions, more detail please check https://github.com/plainheart/echarts-extension-amap/blob/master/README.zh-CN.md
class GaodeMapChart extends Chart {
  isISOContainer = 'gaodemap-chart';
  chart: any = null;
  config = Config;
  dependency = [
    'https://webapi.amap.com/maps?v=2.0&key=576d109d607e839187ade608ff5d5149&plugin=AMap.Scale,AMap.ToolBar',
    'https://cdn.jsdelivr.net/npm/echarts@5.1.1/dist/echarts.min.js',
    'https://cdn.jsdelivr.net/npm/echarts-extension-amap@1.10.1/dist/echarts-extension-amap.min.js',
  ];
  geoMap;

  constructor(props?) {
    super(
      props?.id || 'gaodemap-chart',
      props?.name || '高德地图',
      props?.icon || 'china',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: 1,
        aggregate: [1, 2],
      },
    ];
  }

  onMount(options, context): void {
    if (options.containerId === undefined || !context.document) {
      return;
    }

    this.chart = context.window.echarts.init(
      context.document.getElementById(options.containerId),
      'default',
    );
    this._mouseEvents?.forEach(event => {
      this.chart.on(event.name, event.callback);
    });
  }

  onUpdated(props, context): void {
    if (!props.dataset || !props.dataset.columns || !props.config) {
      return;
    }
    if (!this.isMatchRequirement(props.config)) {
      this.chart?.clear();
      return;
    }

    // Node: especially clear before map dispose
    this.chart?.clear();
    const newOptions = this.getOptions(props.dataset, props.config);
    this.chart?.setOption(Object.assign({}, newOptions), true);
    // Node: should add amap controls after setOption
    this.loadMapTools(context);
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
    const sizeConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.SIZE)
      .flatMap(config => config.rows || []);

    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );

    this.registerGeoMap(styleConfigs);

    const theme = getStyleValueByGroup(styleConfigs!, 'map', 'theme');

    return {
      amap: {
        viewMode: '3D',
        center: [108.39, 39.9],
        zoom: 4,
        resizeEnable: true,
        mapStyle: `amap://styles/${theme}`,
        renderOnMoving: true,
        echartsLayerZIndex: 2000,
        echartsLayerInteractive: true,
        largeMode: false,
      },
      tooltip: {
        trigger: 'item',
      },
      animation: true,
      visualMap: this.getVisualMap(
        objDataColumns,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
        styleConfigs,
      ),
      series: this.getMetricAndSizeSeries(
        objDataColumns,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
        styleConfigs,
      ),
    };
  }

  private loadMapTools(context) {
    var amapComponent = this.chart.getModel().getComponent('amap');
    var amap = amapComponent.getAMap();
    amap.addControl(new context.window.AMap.Scale());
    amap.addControl(new context.window.AMap.ToolBar());
  }

  protected getMetricAndSizeSeries(
    objDataColumns,
    groupConfigs,
    aggregateConfigs,
    sizeConfigs,
    styleConfigs,
  ): any[] {
    const showLabel = getStyleValueByGroup(styleConfigs, 'label', 'showLabel');
    const cycleRatio = getStyleValueByGroup(styleConfigs, 'map', 'cycleRatio');
    const font = getStyleValueByGroup(styleConfigs, 'label', 'font');
    const { min, max } = this.getDataColumnMaxAndMin(
      objDataColumns,
      sizeConfigs[0],
    );
    const scaleRatio = cycleRatio || 1;
    const defaultScatterPointPixelSize = 10;
    const defaultSizeValue = max - min;
    const defaultColorValue = 1;

    return [
      {
        type: 'scatter',
        zlevel: 2,
        coordinateSystem: 'amap',
        symbol: 'circle',
        data: objDataColumns
          ?.map(row => {
            return {
              name: this.mappingGeoName(
                row[getValueByColumnKey(groupConfigs[0])],
              ),
              value: this.mappingGeoCoordination(
                row[getValueByColumnKey(groupConfigs[0])],
                row[getValueByColumnKey(sizeConfigs[0])] || defaultSizeValue,
                row[getValueByColumnKey(aggregateConfigs[0])] ||
                  defaultColorValue,
              ),
            };
          })
          ?.filter(d => !!d.name && d.value !== undefined),
        symbolSize: function (val) {
          return (
            (val[2] / (max - min)) * scaleRatio * defaultScatterPointPixelSize
          );
        },
        label: {
          formatter: '{b}',
          position: 'right',
          show: showLabel,
          ...font,
        },
        emphasis: {
          label: {
            show: showLabel,
            ...font,
          },
        },
      },
    ];
  }

  protected getVisualMap(
    objDataColumns,
    groupConfigs,
    aggregateConfigs,
    sizeConfigs,
    styleConfigs,
  ) {
    const show = getStyleValueByGroup(styleConfigs, 'visualMap', 'show');
    const orient = getStyleValueByGroup(styleConfigs, 'visualMap', 'orient');
    const align = getStyleValueByGroup(styleConfigs, 'visualMap', 'align');
    const itemWidth = getStyleValueByGroup(
      styleConfigs,
      'visualMap',
      'itemWidth',
    );
    const itemHeight = getStyleValueByGroup(
      styleConfigs,
      'visualMap',
      'itemHeight',
    );
    const font = getStyleValueByGroup(styleConfigs, 'visualMap', 'font');
    if (!show || !aggregateConfigs?.length) {
      return [];
    }

    const { min, max } = this.getDataColumnMaxAndMin(
      objDataColumns,
      aggregateConfigs?.[0],
    );

    const inRange = {
      color: [
        aggregateConfigs?.[0]?.color?.start || '#121122',
        aggregateConfigs?.[0]?.color?.end || 'rgba(3,4,5,0.4)',
      ],
    };

    return [
      {
        type: 'continuous',
        seriesIndex: 0,
        dimension: 3,
        show,
        orient,
        align,
        itemWidth,
        itemHeight,
        inRange,
        text: [max, min],
        min,
        max,
        ...font,
      },
    ];
  }

  protected getDataColumnMaxAndMin(objDataColumns, config) {
    const datas = objDataColumns.map(row => row[getValueByColumnKey(config)]);
    const min = Number.isNaN(Math.min(...datas)) ? 0 : Math.min(...datas);
    const max = Number.isNaN(Math.max(...datas)) ? 100 : Math.max(...datas);
    return { min, max };
  }

  protected mappingGeoName(sourceName) {
    const targetName = this.geoMap.features.find(f =>
      f.properties.name.includes(sourceName),
    )?.properties.name;
    return targetName;
  }

  protected mappingGeoCoordination(sourceName, ...values) {
    const properties = this.geoMap.features.find(f =>
      f.properties.name.includes(sourceName),
    )?.properties;

    return (properties?.cp || properties?.center)?.concat(values) || [];
  }

  private registerGeoMap(styleConfigs) {
    const mapLevelName = getStyleValueByGroup(styleConfigs!, 'map', 'level');
    this.geoMap = mapLevelName === 'china' ? geoChina : geoChinaCity;
  }
}

export default GaodeMapChart;
