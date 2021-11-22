/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  ValueOptionType,
  ValueOptionTypes,
} from 'app/pages/DashBoardPage/constants';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
import { ControllerFacadeTypes as Opt } from 'app/types/FilterControlPanel';
import moment, { Moment } from 'moment';
import { FilterSqlOperator } from '../../../../../../../globalConstants';
import { ValueTypes, WidgetControllerOption } from './types';

export const getStringFacadeOptions = (type: ValueOptionType) => {
  switch (type) {
    case 'common':
      return [
        Opt.MultiDropdownList,
        Opt.DropdownList,
        Opt.RadioGroup,
        // Opt.Tree,
      ];
    case 'custom':
      return [Opt.MultiDropdownList, Opt.DropdownList, Opt.RadioGroup];
    default:
      return [];
  }
};

export const getNumberFacadeOptions = (
  category: ChartDataViewFieldCategory,
) => {
  switch (category) {
    case ChartDataViewFieldCategory.Field:
      // return [Opt.RangeValue, Opt.Slider, Opt.Value];
      return [Opt.Slider, Opt.Value];
    case ChartDataViewFieldCategory.Variable:
      return [Opt.Value];
    default:
      return [Opt.Slider, Opt.Value];
  }
};
export const getDateFacadeOptions = (category: ChartDataViewFieldCategory) => {
  switch (category) {
    case ChartDataViewFieldCategory.Field:
      return [Opt.RangeTime];
    case ChartDataViewFieldCategory.Variable:
      return [Opt.Time];
    default:
      return [Opt.Time];
  }
};
// 展示前处理
export const preformatWidgetFilter = (
  oldWidgetFilter: WidgetControllerOption,
) => {
  const controllerOption = JSON.parse(
    JSON.stringify(oldWidgetFilter),
  ) as WidgetControllerOption;
  if (!controllerOption.valueOptionType) {
    controllerOption.valueOptionType = ValueOptionTypes.Common;
  }
  if (!controllerOption?.visibility) {
    controllerOption.visibility = {
      visibilityType: 'show',
    };
  }

  if (controllerOption.filterDate) {
    if (controllerOption.filterDate) {
      const filterDate = controllerOption.filterDate;
      if (filterDate.startTime && filterDate.startTime.exactTime) {
        if (typeof filterDate.startTime.exactTime === 'string') {
          let exactTime = filterDate.startTime.exactTime;
          let newExactTime = moment(exactTime, 'YYYY-MM-DD HH:mm:ss');
          controllerOption.filterDate.startTime.exactTime = newExactTime;
        }
      }
      if (filterDate.endTime && filterDate.endTime.exactTime) {
        if (typeof filterDate.endTime.exactTime === 'string') {
          let exactTime = filterDate.endTime.exactTime;
          let newExactTime = moment(exactTime, 'YYYY-MM-DD HH:mm:ss');
          controllerOption.filterDate.endTime.exactTime = newExactTime;
        }
      }
    }
  }

  return controllerOption;
};
// 设置后处理
export const formatWidgetFilter = (
  controllerOption: WidgetControllerOption,
) => {
  if (!controllerOption.sqlOperator) {
    controllerOption.sqlOperator = FilterSqlOperator.In;
  }
  if (!controllerOption?.visibility) {
    controllerOption.visibility = {
      visibilityType: 'show',
    };
  }

  if (!controllerOption.valueOptionType) {
    controllerOption.valueOptionType = ValueOptionTypes.Common;
  }
  if (
    controllerOption.filterValueOptions &&
    controllerOption.filterValueOptions.length > 0
  ) {
    controllerOption.filterValues = controllerOption.filterValueOptions
      .filter(ele => ele.isSelected)
      .map(ele => ele.key);
  }
  if (controllerOption.filterDate) {
    const filterDate = controllerOption.filterDate;
    if (filterDate.startTime && filterDate.startTime.exactTime) {
      if (typeof filterDate.startTime.exactTime !== 'string') {
        filterDate.startTime.exactTime = (
          filterDate.startTime.exactTime as Moment
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    }
    if (filterDate.endTime && filterDate.endTime.exactTime) {
      if (typeof filterDate.endTime.exactTime !== 'string') {
        filterDate.endTime.exactTime = (
          filterDate.endTime.exactTime as Moment
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }

  return controllerOption;
};

export const getInitWidgetFilter = () => {
  const controllerOPtion: WidgetControllerOption = {
    valueOptionType: ValueOptionTypes.Common, //
    assistViewFields: [],
    visibility: {
      visibilityType: 'show',
    },
    minValue: 1,
    maxValue: 2,
    sqlOperator: FilterSqlOperator.In,
    filterValues: [],
    filterValueOptions: [],
  };
  return controllerOPtion;
};

export const adjustSqlOperator = (
  fieldValueType: ValueTypes,
  operatorType: ValueOptionType,
): FilterSqlOperator => {
  if (fieldValueType === ChartDataViewFieldType.STRING) {
    if (operatorType === 'common') {
      return FilterSqlOperator.Equal;
    } else {
      return FilterSqlOperator.In;
    }
  }
  if (fieldValueType === ChartDataViewFieldType.DATE) {
    return FilterSqlOperator.Between;
  }
  if (fieldValueType === ChartDataViewFieldType.NUMERIC) {
    return FilterSqlOperator.Equal;
  }
  return FilterSqlOperator.In;
};
