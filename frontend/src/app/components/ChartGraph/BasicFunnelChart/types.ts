import { ChartDataSectionField, LabelStyle } from 'app/types/ChartConfig';

export type SeriesData = {
  itemStyle?: {
    color?: string | undefined;
  };
  name: string;
  rowData: { [key: string]: any };
  select: boolean;
  value: string[];
} & ChartDataSectionField;

export interface Series {
  top: string;
  left: string;
  right: string;
  bottom: string;
  containLabel: boolean;
  data: SeriesData[];
  funnelAlign: string;
  gap: number;
  itemStyle: {
    shadowBlur: number;
    shadowColor: string;
    shadowOffsetX: number;
  };
  label: LabelStyle;
  labelLine: {
    length: number;
    lineStyle: {
      width: number;
      type: string;
    };
  };
  labelLayout?: { hideOverlap: true };
  sort: string;
  type: string;
}
