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
} from 'app/types/ChartConfig';
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import {
  getDataColumnMaxAndMin2,
  getExtraSeriesRowData,
  getScatterSymbolSizeFn,
  getSeriesTooltips4Polar2,
  getStyles,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { init, registerMap } from 'echarts';
import Chart from '../../../models/Chart';
import Config from './config';
import geoChinaCity from './geo-china-city.map.json';
import geoChina from './geo-china.map.json';
import {
  GeoInfo,
  GeoSeries,
  GeoVisualMapStyle,
  MetricAndSizeSeriesStyle,
} from './types';

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
      props?.name || 'viz.palette.graph.names.outlineMap',
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
    const sizeConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.SIZE)
      .flatMap(config => config.rows || []);
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.INFO)
      .flatMap(config => config.rows || []);

    this.registerGeoMap(styleConfigs);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    return {
      geo: this.getGeoInfo(styleConfigs),
      visualMap: this.getVisualMap(
        chartDataSet,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
        styleConfigs,
      ),
      series: this.getGeoSeries(
        chartDataSet,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
        styleConfigs,
      ).concat(
        this.getMetricAndSizeSeries(
          chartDataSet,
          groupConfigs,
          aggregateConfigs,
          sizeConfigs,
          styleConfigs,
        ) as any,
      ),
      tooltip: this.getTooltip(
        chartDataSet,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
        infoConfigs,
      ),
    };
  }

  private registerGeoMap(styleConfigs: ChartStyleConfig[]) {
    const [mapLevelName] = getStyles(styleConfigs, ['map'], ['level']);
    this.geoMap = mapLevelName === 'china' ? geoChina : geoChinaCity;
  }

  private getGeoInfo(styleConfigs: ChartStyleConfig[]): GeoInfo {
    const [show, position, font] = getStyles(
      styleConfigs,
      ['label'],
      ['showLabel', 'position', 'font'],
    );
    const [
      mapLevelName,
      enableZoom,
      areaColor,
      areaEmphasisColor,
      enableFocus,
      borderStyle,
    ] = getStyles(
      styleConfigs,
      ['map'],
      [
        'level',
        'enableZoom',
        'areaColor',
        'areaEmphasisColor',
        'focusArea',
        'borderStyle',
      ],
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
      labelLayout: { hideOverlap: true },
    };
  }

  protected getGeoSeries(
    chartDataSet: IChartDataSet<string>,
    groupConfigs: ChartDataSectionField[],
    aggregateConfigs: ChartDataSectionField[],
    sizeConfigs: ChartDataSectionField[],
    styleConfigs: ChartStyleConfig[],
  ): GeoSeries[] {
    const [show] = getStyles(styleConfigs, ['visualMap'], ['show']);
    const [mapLevelName, enableZoom] = getStyles(
      styleConfigs,
      ['map'],
      ['level', 'enableZoom'],
    );
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
        data: chartDataSet
          ?.map(row => {
            return {
              ...getExtraSeriesRowData(row),
              name: this.mappingGeoName(row.getCell(groupConfigs[0])),
              value: row.getCell(aggregateConfigs[0]),
              visualMap: show,
            };
          })
          ?.filter(d => !!d.name && d.value !== undefined),
      },
    ];
  }

  protected getMetricAndSizeSeries(
    chartDataSet: IChartDataSet<string>,
    groupConfigs: ChartDataSectionField[],
    aggregateConfigs: ChartDataSectionField[],
    sizeConfigs: ChartDataSectionField[],
    styleConfigs: ChartStyleConfig[],
  ): MetricAndSizeSeriesStyle[] {
    if (this.isNormalGeoMap) {
      return [];
    }

    const [showLabel] = getStyles(styleConfigs, ['label'], ['showLabel']);
    const [cycleRatio] = getStyles(styleConfigs, ['map'], ['cycleRatio']);
    const { min, max } = getDataColumnMaxAndMin2(chartDataSet, sizeConfigs[0]);
    const defaultSizeValue = max - min;
    const defaultColorValue = 1;

    return [
      {
        type: 'scatter',
        zlevel: 2,
        coordinateSystem: 'geo',
        symbol: 'circle',
        data: chartDataSet
          ?.map(row => {
            return {
              ...getExtraSeriesRowData(row),
              name: this.mappingGeoName(row.getCell(groupConfigs[0])),
              value: this.mappingGeoCoordination(
                row.getCell(groupConfigs[0]),
                row.getCell(aggregateConfigs[0]) || defaultColorValue,
                row.getCell(sizeConfigs[0]) || defaultSizeValue,
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
    chartDataSet: IChartDataSet<string>,
    groupConfigs: ChartDataSectionField[],
    aggregateConfigs: ChartDataSectionField[],
    sizeConfigs: ChartDataSectionField[],
    infoConfigs: ChartDataSectionField[],
  ): {
    trigger: string;
    formatter: (params) => string;
  } {
    return {
      trigger: 'item',
      formatter: function (seriesParams) {
        if (seriesParams.componentType !== 'series') {
          return seriesParams.name;
        }
        return getSeriesTooltips4Polar2(
          chartDataSet,
          seriesParams,
          groupConfigs,
          aggregateConfigs,
          infoConfigs,
          sizeConfigs,
        );
      },
    };
  }

  protected mappingGeoName(sourceName: string): string {
    const targetName = this.geoMap.features.find(f =>
      f.properties.name.includes(sourceName),
    )?.properties.name;
    return targetName;
  }

  protected mappingGeoCoordination(
    sourceName: string,
    ...values: Array<number | string>
  ): Array<number[] | number | string> {
    const properties = this.geoMap.features.find(f =>
      f.properties.name.includes(sourceName),
    )?.properties;

    return (properties?.cp || properties?.center)?.concat(values) || [];
  }

  protected getVisualMap(
    chartDataSet: IChartDataSet<string>,
    groupConfigs: ChartDataSectionField[],
    aggregateConfigs: ChartDataSectionField[],
    sizeConfigs: ChartDataSectionField[],
    styleConfigs: ChartStyleConfig[],
  ): GeoVisualMapStyle[] {
    const [show, orient, align, itemWidth, itemHeight, font] = getStyles(
      styleConfigs,
      ['visualMap'],
      ['show', 'orient', 'align', 'itemWidth', 'itemHeight', 'font'],
    );
    if (!aggregateConfigs?.length) {
      return [];
    }

    const { min, max } = getDataColumnMaxAndMin2(
      chartDataSet,
      aggregateConfigs?.[0],
    );
    const format = aggregateConfigs?.[0]?.format;
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
        // NOTE 映射最大值和最小值如果一致，会导致map所有区域全部映射成中间颜色，这里做兼容处理
        text: [
          toFormattedValue(max, format),
          toFormattedValue(min !== max ? min : min - 1, format),
        ],
        min: min !== max ? min : min - 1,
        max,
        textStyle: {
          ...font,
        },
        formatter: value => toFormattedValue(value, format),
      },
    ];
  }
}

export default BasicOutlineMapChart;
