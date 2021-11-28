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
import {
  ControllerFacadeTypes,
  ControllerFacadeTypes as Opt,
  RelativeOrExactTime,
} from 'app/types/FilterControlPanel';
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
export const preformatWidgetFilter = (
  oldWidgetFilter: ControllerConfig,
  type: ControllerFacadeTypes = ControllerFacadeTypes.DropdownList,
) => {
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
export const postControlConfig = (
  config: ControllerConfig,
  type: ControllerFacadeTypes = ControllerFacadeTypes.DropdownList,
) => {
  if (config.valueOptions.length > 0) {
    config.controllerValues = config.valueOptions
      .filter(ele => ele.isSelected)
      .map(ele => ele.key);
  }
  if (!Array.isArray(config.controllerValues)) {
    config.controllerValues = [config.controllerValues];
  }
  const timeTypes = [
    ControllerFacadeTypes.Time,
    ControllerFacadeTypes.RangeTime,
  ];
  if (timeTypes.includes(type) && config.controllerDate) {
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

export const getInitWidgetController = (
  type: ControllerFacadeTypes = ControllerFacadeTypes.DropdownList,
) => {
  switch (type) {
    case ControllerFacadeTypes.MultiDropdownList:
      return getMultiDropdownListControllerConfig();
    case ControllerFacadeTypes.Time:
      return getTimeControllerConfig();
    case ControllerFacadeTypes.RangeTime:
      return getRangeTimeControllerConfig();
    case ControllerFacadeTypes.RangeValue:
      return getRangeValueControllerConfig();
    case ControllerFacadeTypes.RangeSlider:
      return getRangeSliderControllerConfig();
    case ControllerFacadeTypes.RadioGroup:
      return getTimeControllerConfig();
    case ControllerFacadeTypes.DropdownList:
    default:
      return getInitControllerConfig();
  }
};
export const getInitControllerConfig = () => {
  const config: ControllerConfig = {
    valueOptionType: ValueOptionTypes.Common, //
    assistViewFields: [],
    visibility: {
      visibilityType: 'show',
    },
    required: false,
    canChangeSqlOperator: false,
    minValue: 1,
    maxValue: 2,
    sqlOperator: FilterSqlOperator.Equal,
    controllerValues: [],
    valueOptions: [],
  };
  return config;
};

export const getTimeControllerConfig = () => {
  const config = getInitControllerConfig();
  config.controllerDate = {
    pickerType: 'date',
    startTime: {
      relativeOrExact: RelativeOrExactTime.Exact,
      exactValue: null,
    },
  };
  return config;
};
export const getRangeTimeControllerConfig = () => {
  const config = getInitControllerConfig();
  config.sqlOperator = FilterSqlOperator.Between;
  config.controllerDate = {
    pickerType: 'date',
    startTime: {
      relativeOrExact: RelativeOrExactTime.Exact,
      exactValue: null,
    },
    endTime: {
      relativeOrExact: RelativeOrExactTime.Exact,
      exactValue: null,
    },
  };
  return config;
};
export const getMultiDropdownListControllerConfig = () => {
  const config = getInitControllerConfig();
  config.sqlOperator = FilterSqlOperator.In;
  return config;
};
export const getRadioGroupControllerConfig = () => {
  const config = getInitControllerConfig();
  config.sqlOperator = FilterSqlOperator.Equal;
  config.radioButtonType = 'default';
  return config;
};
export const getSliderControllerConfig = () => {
  const config = getInitControllerConfig();
  config.sqlOperator = FilterSqlOperator.Equal;
  config.minValue = 1;
  config.minValue = 200;
  config.sliderConfig = {
    step: 1,
    range: false,
    vertical: false,
    showMarks: false,
  };
  return config;
};
export const getRangeSliderControllerConfig = () => {
  const config = getInitControllerConfig();
  config.sqlOperator = FilterSqlOperator.Between;
  config.minValue = 1;
  config.minValue = 200;
  config.sliderConfig = {
    step: 1,
    range: true,
    vertical: false,
    showMarks: false,
  };
  return config;
};

export const getRangeValueControllerConfig = () => {
  const config = getInitControllerConfig();
  config.sqlOperator = FilterSqlOperator.Between;
  return config;
};
