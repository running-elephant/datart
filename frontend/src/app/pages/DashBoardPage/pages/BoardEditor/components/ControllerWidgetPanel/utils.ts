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
import { ChartDataViewFieldCategory } from 'app/types/ChartDataView';
import { ControllerFacadeTypes as Opt } from 'app/types/FilterControlPanel';
import moment, { Moment } from 'moment';
import { FilterSqlOperator } from '../../../../../../../globalConstants';
import { ControllerConfig } from './types';

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
export const preformatWidgetFilter = (oldWidgetFilter: ControllerConfig) => {
  const config = JSON.parse(
    JSON.stringify(oldWidgetFilter),
  ) as ControllerConfig;
  if (!config.valueOptionType) {
    config.valueOptionType = ValueOptionTypes.Common;
  }
  if (!config?.visibility) {
    config.visibility = {
      visibilityType: 'show',
    };
  }

  if (config.controllerDate) {
    if (config.controllerDate) {
      const filterDate = config.controllerDate;
      if (filterDate.startTime && filterDate.startTime.exactValue) {
        if (typeof filterDate.startTime.exactValue === 'string') {
          let exactTime = filterDate.startTime.exactValue;
          let newExactTime = moment(exactTime, 'YYYY-MM-DD HH:mm:ss');
          config.controllerDate.startTime.exactValue = newExactTime;
        }
      }
      if (filterDate.endTime && filterDate.endTime.exactValue) {
        if (typeof filterDate.endTime.exactValue === 'string') {
          let exactTime = filterDate.endTime.exactValue;
          let newExactTime = moment(exactTime, 'YYYY-MM-DD HH:mm:ss');
          config.controllerDate.endTime!.exactValue = newExactTime;
        }
      }
    }
  }

  return config;
};
// 设置后处理
export const formatWidgetFilter = (config: ControllerConfig) => {
  if (!config.sqlOperator) {
    config.sqlOperator = FilterSqlOperator.In;
  }
  if (!config?.visibility) {
    config.visibility = {
      visibilityType: 'show',
    };
  }

  if (!config.valueOptionType) {
    config.valueOptionType = ValueOptionTypes.Common;
  }
  if (config.valueOptions && config.valueOptions.length > 0) {
    config.filterValues = config.valueOptions
      .filter(ele => ele.isSelected)
      .map(ele => ele.key);
  }
  if (config.controllerDate) {
    const filterDate = config.controllerDate;
    if (filterDate.startTime && filterDate.startTime.exactValue) {
      if (typeof filterDate.startTime.exactValue !== 'string') {
        filterDate.startTime.exactValue = (
          filterDate.startTime.exactValue as Moment
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    }
    if (filterDate.endTime && filterDate.endTime.exactValue) {
      if (typeof filterDate.endTime.exactValue !== 'string') {
        filterDate.endTime.exactValue = (
          filterDate.endTime.exactValue as Moment
        ).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }

  return config;
};

export const getInitWidgetFilter = () => {
  const config: ControllerConfig = {
    valueOptionType: ValueOptionTypes.Common, //
    assistViewFields: [],
    visibility: {
      visibilityType: 'show',
    },
    minValue: 1,
    maxValue: 2,
    sqlOperator: FilterSqlOperator.In,
    filterValues: [],
    valueOptions: [],
  };
  return config;
};
