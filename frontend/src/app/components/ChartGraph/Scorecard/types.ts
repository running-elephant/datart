import { FontStyle } from '../../../types/ChartConfig';

interface FontConfig {
  color: string;
  fontFamily: string;
  fontSize: string;
  fontStyle: string;
  fontWeight: string;
  lineHeight: number;
}

export interface ScorecardConfig {
  dataConfig: FontConfig;
  labelConfig: {
    show: boolean;
    font: FontConfig;
    position: string;
    alignment: string;
  };
  padding: string;
  context: {
    width: number;
    height: number;
  };
  width: number;
  data: {
    label: string;
    value: number | string;
  };
  background: string;
}

export interface ScorecardBoxProp {
  padding: string | number;
}

export interface AggregateBoxProp {
  position: string;
  alignment: string;
}

export interface LabelConfig {
  show: boolean;
  font: FontStyle;
  position: string;
  alignment: string;
}

export interface PaddingConfig {
  width: number;
  padding: string;
}
