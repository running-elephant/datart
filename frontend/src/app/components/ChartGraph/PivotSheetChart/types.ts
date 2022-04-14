import { FontStyle } from 'app/types/ChartConfig';

export type TextStyle = {
  cell?: { backgroundColor?: string; crossBackgroundColor?: string };
  text: { textAlign: string } & FontStyle;
  bolderText?: { textAlign: string } & FontStyle;
};

export type TableSorters = {
  sortFieldId: any;
  sortFunc: (params) => string[];
} | null;

export interface RowAndColStyle {
  colCfg: {
    height: number;
    widthByFieldValue: Record<string, number | undefined>;
  };
  rowCfg: {
    width?: number | null;
  };
  cellCfg: {
    height: number;
  };
}
