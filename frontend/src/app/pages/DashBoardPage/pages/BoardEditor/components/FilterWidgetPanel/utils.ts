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

import { AggregateFieldActionType } from 'app/types/ChartConfig';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
import {
  FilterOperatorType,
  OPERATOR_TYPE_ENUM,
} from 'app/pages/DashBoardPage/constants';
import { FilterWidgetContent } from 'app/pages/DashBoardPage/pages/Dashboard/slice/types';
import { ControllerFacadeTypes as Opt } from 'app/types/FilterControlPanel';
import moment, { Moment } from 'moment';
import { FilterSqlOperator } from './../../../../../../../globalConstants';
import { ValueTypes, WidgetFilterFormType } from './types';
// export const getFilterFacadeTool = (fieldType: ChartDataViewFieldType) => {
//   switch (fieldType) {
//     case ChartDataViewFieldType.STRING:
//       return getStringFacadeOptions;
//     case ChartDataViewFieldType.NUMERIC:
//       return getNumberFacadeOptions;
//     case ChartDataViewFieldType.DATE:
//       return getDateFacadeOptions;
//     default:
//       return getStringFacadeOptions;
//   }
// };

export const getStringFacadeOptions = (type: FilterOperatorType) => {
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
    case 'condition':
      return [Opt.Text];
    default:
      return [Opt.Text];
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
  oldWidgetFilter: WidgetFilterFormType,
) => {
  const widgetFilter = JSON.parse(JSON.stringify(oldWidgetFilter));
  if (!widgetFilter.operatorType) {
    widgetFilter.operatorType = OPERATOR_TYPE_ENUM.common;
  }
  if (!widgetFilter?.filterVisibility) {
    widgetFilter.filterVisibility = {
      visibility: 'show',
    };
  }

  if (!widgetFilter?.filterWidth) {
    widgetFilter.filterWidth = '25%';
  }

  if (widgetFilter.filterDate) {
    if (widgetFilter.filterDate) {
      const filterDate = widgetFilter.filterDate;
      if (filterDate.startTime && filterDate.startTime.exactTime) {
        if (typeof filterDate.startTime.exactTime === 'string') {
          let exactTime = filterDate.startTime.exactTime;
          let newExactTime = moment(exactTime, 'YYYY-MM-DD HH:mm:ss');
          widgetFilter.filterDate.startTime.exactTime = newExactTime;
        }
      }
      if (filterDate.endTime && filterDate.endTime.exactTime) {
        if (typeof filterDate.endTime.exactTime === 'string') {
          let exactTime = filterDate.endTime.exactTime;
          let newExactTime = moment(exactTime, 'YYYY-MM-DD HH:mm:ss');
          widgetFilter.filterDate.endTime.exactTime = newExactTime;
        }
      }
    }
  }

  return widgetFilter;
};
// 设置后处理
export const formatWidgetFilter = (widgetFilter: WidgetFilterFormType) => {
  if (!widgetFilter.sqlOperator) {
    widgetFilter.sqlOperator = FilterSqlOperator.In;
  }
  if (!widgetFilter?.filterVisibility) {
    widgetFilter.filterVisibility = {
      visibility: 'show',
    };
  }
  if (!widgetFilter?.filterWidth) {
    widgetFilter.filterWidth = '25%';
  }
  if (!widgetFilter.operatorType) {
    widgetFilter.operatorType = OPERATOR_TYPE_ENUM.common;
  }
  if (
    widgetFilter.filterValueOptions &&
    widgetFilter.filterValueOptions.length > 0
  ) {
    widgetFilter.filterValues = widgetFilter.filterValueOptions
      .filter(ele => ele.isSelected)
      .map(ele => ele.key);
  }
  if (widgetFilter.filterDate) {
    const filterDate = widgetFilter.filterDate;
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

  return widgetFilter;
};

export const getInitWidgetFilter = () => {
  const widgetFilter: WidgetFilterFormType = {
    aggregate: AggregateFieldActionType.NONE,
    operatorType: OPERATOR_TYPE_ENUM.common, //
    assistViewFields: [],
    filterVisibility: {
      visibility: 'show',
    },
    minValue: 1,
    maxValue: 2,
    sqlOperator: FilterSqlOperator.In,
    filterValues: [],
    filterValueOptions: [],
    filterFacade: Opt.DropdownList,
    filterWidth: '25%',
  };
  return widgetFilter;
};
export const getFixedFilterWidth = (content: FilterWidgetContent) => {
  const { widgetFilter } = content;
  if (!widgetFilter?.filterWidth || widgetFilter?.filterWidth === 'auto') {
    return '25%';
  } else {
    return (Number(widgetFilter?.filterWidth) / 24) * 100 + '%';
  }
};

export const adjustSqlOperator = (
  fieldValueType: ValueTypes,
  operatorType: FilterOperatorType,
): FilterSqlOperator => {
  if (fieldValueType === ChartDataViewFieldType.STRING) {
    if (operatorType === 'condition') {
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
