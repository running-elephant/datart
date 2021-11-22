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
  dependentFilterId: string;
  relation: FilterSqlOperator.Equal | FilterSqlOperator.NotEqual; //等于或这不等于
  value: any; // any type
}

export interface WidgetControllerOption {
  valueOptionType: ValueOptionType; //
  assistViewFields: string[]; //辅助添加view字段
  visibility: ControllerVisibility;
  sqlOperator: FilterSqlOperator;
  filterDate?: FilterDate;
  filterValues: any[];
  filterValueOptions: FilterValueOption[];
  minValue?: number;
  maxValue?: number;
}
export interface FilterDate {
  // commonTime: keyof typeof RECOMMEND_TIME;
  commonTime: string | null; //常用
  startTime: filterDateTime;
  endTime: filterDateTime;
}

export interface filterDateTime {
  relativeOrExact: RelativeOrExactTime;
  relative?: filterRelativeTime;
  exactTime?: Moment | string | null;
}
export interface filterRelativeTime {
  amount: number;
  unit: unitOfTime.DurationConstructor;
  direction: '-' | '+';
}
