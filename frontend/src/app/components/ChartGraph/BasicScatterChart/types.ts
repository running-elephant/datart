import { LabelStyle, MarkArea, MarkLine } from 'app/types/ChartConfig';

export type ScatterMetricAndSizeSerie = {
  data:
    | {
        name: string;
        rowData: { [p: string]: any };
        value: string[];
      }[]
    | undefined;
  symbolSize: (val) => number;
  name: string;
  itemStyle: { color: string | undefined };
  type: string;
  markLine: MarkLine;
  markArea: MarkArea;
} & LabelStyle;
