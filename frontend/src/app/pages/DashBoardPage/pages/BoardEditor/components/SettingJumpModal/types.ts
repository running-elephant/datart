import { ChartDataViewFieldType } from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
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
