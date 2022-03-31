import { BorderStyle, FontStyle, LabelStyle } from '../../../types/ChartConfig';

export type GeoInfo = {
  map: string;
  roam: boolean;
  emphasis: {
    focus: string;
    itemStyle: {
      areaColor: string;
    };
  };
  itemStyle: {
    areaColor: string;
  } & BorderStyle;
} & LabelStyle;

export interface GeoVisualMapStyle {
  type: string;
  seriesIndex: number;
  dimension: undefined | number;
  show: boolean;
  orient: string;
  align: string;
  itemWidth: number;
  itemHeight: number;
  inRange: {
    color: string[];
  };
  text: string[];
  min: number;
  max: number;
  textStyle: FontStyle;
  formatter: (value) => string;
}

export interface GeoSeries {
  type: string;
  roam: boolean;
  map: string;
  geoIndex: number;
  emphasis: {
    label: {
      show: boolean;
    };
  };
  data:
    | Array<{
        rowData: { [key: string]: any };
        name: string;
        value: string;
        visualMap: boolean;
      }>
    | undefined;
}

export type MetricAndSizeSeriesStyle = {
  data: Array<{
    rowData: { [key: string]: any };
    name: string;
    value: Array<number[] | number | string>;
  }>;
  type: string;
  zlevel: number;
  coordinateSystem: string;
  symbol: string;
  symbolSize: (value: number) => number;
  emphasis: {
    label: {
      show: boolean;
    };
  };
} & LabelStyle;
