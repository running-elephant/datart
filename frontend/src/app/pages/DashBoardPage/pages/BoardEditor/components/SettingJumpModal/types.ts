import { ChartDataViewFieldType } from 'app/types/ChartDataView';
export interface ControlOptionItem {
  label: string;
  value: string;
  filterType?: ChartDataViewFieldType;
}
export interface TargetValueType {
  relId: string;
  relType: string;
  id: string;
}
