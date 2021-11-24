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
import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import {
  getDataColumnMaxAndMin,
  getExtraSeriesRowData,
  getScatterSymbolSizeFn,
  getSeriesTooltips4Polar2,
  getStyleValueByGroup,
  getValueByColumnKey,
  transfromToObjectArray,
} from 'app/utils/chartHelper';
import { init, registerMap } from 'echarts';
import Config from './config';
import geoChinaCity from './geo-china-city.map.json';
import geoChina from './geo-china.map.json';

// NOTE: source from: http://datav.aliyun.com/tools/atlas/index.html#&lat=31.39115752282472&lng=103.7548828125&zoom=4
registerMap('china', geoChina as any);
registerMap('china-city', geoChinaCity as any);

class BasicOutlineMapChart extends Chart {
  chart: any = null;
  config = Config;

  protected isNormalGeoMap = false;
  private geoMap;

  constructor(props?) {
    super(
      props?.id || 'outline-map',
      props?.name || '轮廓地图',
      props?.icon || 'china',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: 1,
        aggregate: 1,
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

    this.registerGeoMap(styleConfigs);

    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );

    return {
      geo: this.getGeoInfo(styleConfigs),
      visualMap: this.getVisualMap(
        objDataColumns,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
        styleConfigs,
      ),
      series: this.getGeoSeries(
        objDataColumns,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
        styleConfigs,
      ).concat(
        this.getMetricAndSizeSeries(
          objDataColumns,
          groupConfigs,
          aggregateConfigs,
          sizeConfigs,
          styleConfigs,
        ) as any,
      ),
      tooltip: this.getTooltip(
        styleConfigs,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
        infoConfigs,
      ),
    };
  }

  private registerGeoMap(styleConfigs) {
    const mapLevelName = getStyleValueByGroup(styleConfigs!, 'map', 'level');
    this.geoMap = mapLevelName === 'china' ? geoChina : geoChinaCity;
  }

  private getGeoInfo(styleConfigs) {
    const show = getStyleValueByGroup(styleConfigs, 'label', 'showLabel');
    const position = getStyleValueByGroup(styleConfigs, 'label', 'position');
    const font = getStyleValueByGroup(styleConfigs, 'label', 'font');
    const mapLevelName = getStyleValueByGroup(styleConfigs, 'map', 'level');
    const enableZoom = getStyleValueByGroup(styleConfigs, 'map', 'enableZoom');
    const areaColor = getStyleValueByGroup(styleConfigs, 'map', 'areaColor');
    const areaEmphasisColor = getStyleValueByGroup(
      styleConfigs,
      'map',
      'areaEmphasisColor',
    );
    const enableFocus = getStyleValueByGroup(styleConfigs, 'map', 'focusArea');
    const borderStyle = getStyleValueByGroup(
      styleConfigs,
      'map',
      'borderStyle',
    );

    return {
      map: mapLevelName,
      roam: enableZoom,
      emphasis: {
        focus: enableFocus ? 'self' : 'none',
        itemStyle: {
          areaColor: areaEmphasisColor,
        },
      },
      itemStyle: {
        areaColor: areaColor,
        borderType: borderStyle?.type,
        borderWidth: borderStyle?.width,
        borderColor: borderStyle?.color,
      },
      label: {
        show,
        position,
        ...font,
      },
    };
  }

  protected getGeoSeries(
    objDataColumns,
    groupConfigs,
    aggregateConfigs,
    sizeConfigs,
    styleConfigs,
  ): any[] {
    const show = getStyleValueByGroup(styleConfigs, 'visualMap', 'show');
    const mapLevelName = getStyleValueByGroup(styleConfigs, 'map', 'level');
    const enableZoom = getStyleValueByGroup(styleConfigs, 'map', 'enableZoom');
    return [
      {
        type: 'map',
        roam: enableZoom ? true : false,
        map: mapLevelName,
        geoIndex: 0,
        emphasis: {
          label: {
            show: true,
          },
        },
        data: objDataColumns
          ?.map(row => {
            return {
              ...getExtraSeriesRowData(row),
              name: this.mappingGeoName(
                row[getValueByColumnKey(groupConfigs[0])],
              ),
              value: row[getValueByColumnKey(aggregateConfigs[0])],
              visualMap: show,
            };
          })
          ?.filter(d => !!d.name && d.value !== undefined),
      },
    ];
  }

  protected getMetricAndSizeSeries(
    objDataColumns,
    groupConfigs,
    aggregateConfigs,
    sizeConfigs,
    styleConfigs,
  ): any[] {
    if (this.isNormalGeoMap) {
      return [];
    }

    const showLabel = getStyleValueByGroup(styleConfigs, 'label', 'showLabel');
    const cycleRatio = getStyleValueByGroup(styleConfigs, 'map', 'cycleRatio');
    const { min, max } = getDataColumnMaxAndMin(objDataColumns, sizeConfigs[0]);
    const defaultSizeValue = max - min;
    const defaultColorValue = 1;

    return [
      {
        type: 'scatter',
        zlevel: 2,
        coordinateSystem: 'geo',
        symbol: 'circle',
        data: objDataColumns
          ?.map(row => {
            return {
              ...getExtraSeriesRowData(row),
              name: this.mappingGeoName(
                row[getValueByColumnKey(groupConfigs[0])],
              ),
              value: this.mappingGeoCoordination(
                row[getValueByColumnKey(groupConfigs[0])],
                row[getValueByColumnKey(aggregateConfigs[0])] ||
                  defaultColorValue,
                row[getValueByColumnKey(sizeConfigs[0])] || defaultSizeValue,
              ),
            };
          })
          ?.filter(d => !!d.name && d.value !== undefined),
        symbolSize: getScatterSymbolSizeFn(3, max, min, cycleRatio),
        label: {
          formatter: '{b}',
          position: 'right',
          show: showLabel,
        },
        emphasis: {
          label: {
            show: showLabel,
          },
        },
      },
    ];
  }

  protected getTooltip(
    styleConfigs,
    groupConfigs,
    aggregateConfigs,
    sizeConfigs,
    infoConfigs,
  ) {
    return {
      trigger: 'item',
      formatter: function (seriesParams) {
        if (seriesParams.componentType !== 'series') {
          return seriesParams.name;
        }
        return getSeriesTooltips4Polar2(
          seriesParams,
          groupConfigs,
          [],
          aggregateConfigs,
          infoConfigs,
          sizeConfigs,
        );
      },
    };
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

    const { min, max } = getDataColumnMaxAndMin(
      objDataColumns,
      aggregateConfigs?.[0],
    );

    const inRange = {
      color: [
        aggregateConfigs?.[0]?.color?.start || '#1B9AEE',
        aggregateConfigs?.[0]?.color?.end || '#FA8C15',
      ],
    };

    return [
      {
        type: 'continuous',
        seriesIndex: 0,
        dimension: this.isNormalGeoMap ? undefined : 2,
        show,
        orient,
        align,
        itemWidth,
        itemHeight,
        inRange,
        text: [max, min],
        min,
        max,
        textStyle: {
          ...font,
        },
      },
    ];
  }
}

export default BasicOutlineMapChart;
