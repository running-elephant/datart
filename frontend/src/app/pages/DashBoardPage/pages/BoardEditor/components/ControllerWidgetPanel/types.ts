import {
  ControllerVisibleType,
  ValueOptionType,
} from 'app/pages/DashBoardPage/constants';
import { FilterValueOption } from 'app/types/ChartConfig';
import { ChartDataViewFieldType } from 'app/types/ChartDataView';
import { RelativeOrExactTime } from 'app/types/FilterControlPanel';
import { FilterSqlOperator } from 'globalConstants';
import { Moment, unitOfTime } from 'moment';
import { VariableValueTypes } from '../../../../../MainPage/pages/VariablePage/constants';

export interface ControllerVisibility {
  visibilityType: ControllerVisibleType;
  condition?: VisibilityCondition;
}
export type ValueTypes = ChartDataViewFieldType | VariableValueTypes;
export interface ControlOption {
  label: string;
  value: string;
  id?: string;
  type?: string;
  variables?: {
    [viewId: string]: string;
  };
}
export interface VisibilityCondition {
  dependentControllerId: string;
  relation: FilterSqlOperator.Equal | FilterSqlOperator.NotEqual; //等于或这不等于
  value: any; // any type
}

export interface ControllerConfig {
  valueOptionType: ValueOptionType; //
  visibility: ControllerVisibility;
  sqlOperator: FilterSqlOperator;
  valueOptions: FilterValueOption[];
  filterValues: any[];
  required?: boolean;
  assistViewFields?: string[]; //辅助添加view字段
  controllerDate?: ControllerDate;
  minValue?: number;
  maxValue?: number;
}
export interface ControllerDate {
  pickerType: PickerType;
  startTime: ControllerDateType;
  endTime?: ControllerDateType;
}
export const enum PickerTypes {
  Year = 'year',
  Quarter = 'quarter',
  Month = 'month',
  Week = 'week',
  Date = 'date',
  DateTime = 'dateTime',
}
export type PickerType = Uncapitalize<keyof typeof PickerTypes>;

export const PickerTypeOptions = [
  { name: '日期', value: PickerTypes.Date },
  { name: '日期时间', value: PickerTypes.DateTime },
  { name: '年', value: PickerTypes.Year },
  { name: '月', value: PickerTypes.Month },
  { name: '季度', value: PickerTypes.Quarter },
  { name: '周', value: PickerTypes.Week },
];
export interface ControllerDateType {
  relativeOrExact: RelativeOrExactTime;
  relativeValue?: RelativeDate;
  exactValue?: Moment | string | null;
}

export interface RelativeDate {
  amount: number;
  unit: unitOfTime.DurationConstructor;
  direction: '-' | '+';
}
