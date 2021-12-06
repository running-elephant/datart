import { ChartDataSectionConfig } from 'app/types/ChartConfig';

export enum GroupLayoutMode {
  INNER = 'inner',
  OUTTER = 'outter',
}

export enum ItemComponentType {
  MODAL = 'modal',
}

export interface ItemLayoutProps<T> {
  ancestors: number[];
  data: T;
  translate?: (title: string, options?: any) => string;
  onChange?: (
    ancestors: number[],
    value: T | any,
    needRefresh?: boolean,
  ) => void;
  dataConfigs?: ChartDataSectionConfig[];
  flatten?: boolean;
}

export interface FormGeneratorLayoutProps<T> extends ItemLayoutProps<T> {
  mode?: GroupLayoutMode; // NOTE: inner means this group panel whether wrap into a panel. Default is outter, no parent panel.
  dependency?: string;
}
