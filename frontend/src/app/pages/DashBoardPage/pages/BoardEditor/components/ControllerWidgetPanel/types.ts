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
  required?: boolean;
  valueOptionType: ValueOptionType; //
  assistViewFields: string[]; //辅助添加view字段
  visibility: ControllerVisibility;
  sqlOperator: FilterSqlOperator;
  controllerDate?: ControllerDate;
  filterValues: any[];
  valueOptions: FilterValueOption[];
  minValue?: number;
  maxValue?: number;
}
export interface ControllerDate {
  pickerMode: PickerMode;
  startTime: ControllerDateType;
  endTime?: ControllerDateType;
}
export type PickerMode =
  | 'year'
  | 'month'
  | 'quarter'
  | 'week'
  | 'date'
  | 'dateTime';

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
