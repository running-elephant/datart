import { ChartDataViewFieldType } from 'app/types/ChartDataView';
export interface FilterOptionItem {
  label: string;
  value: string;
  filterType?: ChartDataViewFieldType;
}
export interface TargetValueType {
  relId: string;
  relType: string;
  id: string;
}
