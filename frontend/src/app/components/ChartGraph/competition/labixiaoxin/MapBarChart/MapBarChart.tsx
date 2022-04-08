/*
 * @Author: minsion
 * @Date: 2022-03-01 11:13:17
 * @LastEditTime: 2022-03-19 15:16:08
 * @Description: 3D 地图 + 柱状图
 */
import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import {
  getDataColumnMaxAndMin2,
  getExtraSeriesRowData,
  getSeriesTooltips4Polar2,
  getStyles,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { init, registerMap } from 'echarts';
import 'echarts-gl';
import Chart from '../../../models/Chart';
import Config from './config';
import geoHenan from './henan.json';

registerMap('henan', geoHenan as any);
class MapBarChart extends Chart {
  chart: any = null;
  config = Config;

  protected isNormalGeoMap = false;
  private geoMap;

  constructor(props?) {
    super(
      props?.id || 'map-bar-chart',
      props?.name || 'viz.palette.graph.names.mapBarChart',
      props?.icon || 'chart',
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

    this.geoMap = geoHenan;
    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );
    return {
      geo3D: this.getGeoInfo(styleConfigs),
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
      ),
      tooltip: this.getTooltip(
        chartDataSet,
        styleConfigs,
        groupConfigs,
        aggregateConfigs,
        sizeConfigs,
      ),
    };
  }

  private getGeoInfo(styleConfigs) {
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
      ['mapBar'],
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
      // roam: enableZoom,
      emphasis: {
        focus: enableFocus ? 'self' : 'none',
        itemStyle: {
          color: areaEmphasisColor,
        },
      },
      itemStyle: {
        color: areaColor,
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
      boxHeight: 20, // 三维地理坐标系组件在三维场景中的高度，组件高度
    };
  }
  protected getGeoCoordMap(pname) {
    const tempData = geoHenan?.features;
    const result = tempData?.filter(item => {
      return item?.properties?.name === pname;
    });
    return result?.[0]?.properties?.center;
  }
  protected getGeoSeries(
    chartDataSet: IChartDataSet<string>,
    groupConfigs,
    aggregateConfigs,
    sizeConfigs,
    styleConfigs,
  ): any[] {
    const itemData = chartDataSet?.map(row => {
      const name = this.mappingGeoName(row.getCell(groupConfigs[0]));
      const value = row.getCell(aggregateConfigs[0]);
      const currentGeoCoorMap: any = this.getGeoCoordMap(name);
      return {
        ...getExtraSeriesRowData(row),
        name: name,
        value: [...currentGeoCoorMap, value],
        regionHeight: value,
      };
    });
    const [barSize, bevelSize] = getStyles(
      styleConfigs,
      ['visualMap'],
      ['barSize', 'bevelSize'],
    );
    return [
      {
        name: 'bar3D',
        type: 'bar3D',
        coordinateSystem: 'geo3D',
        barSize: barSize, //柱子粗细
        shading: 'lambert',
        bevelSize: bevelSize, // 柱子倒角
        itemStyle: {
          color: '#f00',
          opacity: 1,
        },
        viewControl: {
          // 用于鼠标的旋转，缩放等视角控制。
          projection: 'perspective',
          autoRotate: false,
          autoRotateDirection: 'cw',
        },
        data: itemData,
      },
    ];
  }

  protected getTooltip(
    chartDataSet: IChartDataSet<string>,
    styleConfigs,
    groupConfigs,
    aggregateConfigs,
    sizeConfigs,
  ) {
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
    chartDataSet: IChartDataSet<string>,
    groupConfigs,
    aggregateConfigs,
    sizeConfigs,
    styleConfigs,
  ) {
    const [
      show,
      orient,
      align,
      itemWidth,
      itemHeight,
      font,
      startColor,
      endColor,
    ] = getStyles(
      styleConfigs,
      ['visualMap'],
      [
        'show',
        'orient',
        'align',
        'itemWidth',
        'itemHeight',
        'font',
        'startColor',
        'endColor',
      ],
    );
    if (!show || !aggregateConfigs?.length) {
      return [];
    }

    const { min, max } = getDataColumnMaxAndMin2(
      chartDataSet,
      aggregateConfigs?.[0],
    );
    const format = aggregateConfigs?.[0]?.format;
    const inRange = {
      color: [startColor, endColor],
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
        text: [toFormattedValue(max, format), toFormattedValue(min, format)],
        min,
        max,
        textStyle: {
          ...font,
        },
        formatter: value => {
          return toFormattedValue(value, format);
        },
      },
    ];
  }
}

export default MapBarChart;
