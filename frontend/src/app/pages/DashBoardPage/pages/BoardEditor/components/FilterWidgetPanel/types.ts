import {
  ControllerFacadeTypes,
  RelativeOrExactTime,
} from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/FilterControlPanel/Constant';
import {
  AggregateFieldActionType,
  FilterValueOption,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { ChartDataViewFieldType } from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import {
  FilterOperatorType,
  FilterVisibilityType,
} from 'app/pages/DashBoardPage/constants';
import { FilterSqlOperator } from 'globalConstants';
import { Moment, unitOfTime } from 'moment';
import { VariableValueTypes } from './../../../../../MainPage/pages/VariablePage/constants';
export interface WidgetFilterVisibility {
  visibility: FilterVisibilityType;
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

export interface WidgetFilterFormType {
  aggregate: AggregateFieldActionType;
  operatorType: FilterOperatorType; //
  assistViewFields: string[]; //辅助添加view字段
  filterVisibility: WidgetFilterVisibility;
  sqlOperator: FilterSqlOperator;
  filterDate?: FilterDate;
  filterValues: any[];
  filterValueOptions: FilterValueOption[];
  filterFacade: ControllerFacadeTypes;
  minValue: number;
  maxValue: number;
  filterWidth: string;
}
export interface FilterDate {
  // commonTime: keyof typeof RECOMMEND_TIME;
  commonTime: string; //常用
  startTime: filterDateTime;
  endTime: filterDateTime;
}

export interface filterDateTime {
  relativeOrExact: RelativeOrExactTime;
  relative?: filterRelativeTime;
  exactTime?: Moment | string;
}
export interface filterRelativeTime {
  amount: number;
  unit: unitOfTime.DurationConstructor;
  direction: '-' | '+';
}
