import { ChartDataConfig } from 'app/types/ChartConfig';

export enum GroupLayoutMode {
  INNER = 'inner',
  OUTER = 'outter',
}

export enum ItemComponentType {
  MODAL = 'modal',
}

export interface ItemLayoutProps<T> {
  ancestors: number[];
  data: T;
  translate?: (title: string, disablePrefix?: boolean, options?: any) => string;
  onChange?: (
    ancestors: number[],
    value: T | any,
    needRefresh?: boolean,
  ) => void;
  dataConfigs?: ChartDataConfig[];
  flatten?: boolean;
  context?: any;
}

export interface FormGeneratorLayoutProps<T> extends ItemLayoutProps<T> {
  mode?: GroupLayoutMode; // NOTE: inner means this group panel whether wrap into a panel. Default is outer, no parent panel.
  dependency?: string;
}
