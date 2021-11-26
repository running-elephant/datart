import { RadioGroupOptionType } from 'antd/lib/radio';
import {
  ControllerVisibleType,
  ValueOptionType,
} from 'app/pages/DashBoardPage/constants';
import { FilterValueOption } from 'app/types/ChartConfig';
import { ChartDataViewFieldType } from 'app/types/ChartDataView';
import {
  ControllerFacadeTypes,
  RelativeOrExactTime,
} from 'app/types/FilterControlPanel';
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
  controllerValues: any[];
  required: boolean; // 是否允许空值
  canChangeSqlOperator?: boolean; // 是否显示 sqlOperator 切换
  assistViewFields?: string[]; //辅助添加view字段
  controllerDate?: ControllerDate; //存储时间

  minValue?: number; // slider min
  maxValue?: number; // slider max

  radioButtonType?: RadioGroupOptionType; //按钮样式

  sliderConfig?: SliderConfig;
}

export interface ControllerDate {
  pickerType: PickerType;
  startTime: ControllerDateType;
  endTime?: ControllerDateType;
}
export interface SliderConfig {
  step: 1;
  range: boolean;
  vertical: boolean;
  showMarks: boolean;
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

export const FixedSqlOperatorTypes = [
  ControllerFacadeTypes.RangeTime,
  ControllerFacadeTypes.RangeSlider,
  ControllerFacadeTypes.RangeValue,
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
