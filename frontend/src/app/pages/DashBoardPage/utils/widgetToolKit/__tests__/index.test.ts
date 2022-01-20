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

import { RelatedView } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { ControllerConfig } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
import {
  ControllerFacadeTypes,
  TimeFilterValueCategory,
} from 'app/types/FilterControlPanel';
import { FilterSqlOperator } from 'globalConstants';
import { getWidgetControlValues } from '../..';

describe('getWidgetControlValues', () => {
  test('control DropdownList value', () => {
    const type: ControllerFacadeTypes = ControllerFacadeTypes.DropdownList;
    const relatedViewItem: RelatedView = {
      viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
      relatedCategory: ChartDataViewFieldCategory.Field,
      fieldValue: '地区',
      fieldValueType: ChartDataViewFieldType.STRING,
    };
    const config: ControllerConfig = {
      required: false,
      controllerValues: ['山东'],
      valueOptions: [],
      valueOptionType: 'common',
      assistViewFields: ['3ca2a12f09c84c8ca1a5714fc6fa44d8', '地区', '地区'],
      sqlOperator: FilterSqlOperator.Equal,
      visibility: {
        visibilityType: 'show',
      },
    };
    const opt = { type, relatedViewItem, config };
    const res = [
      {
        value: '山东',
        valueType: 'STRING',
      },
    ];
    expect(getWidgetControlValues(opt)).toEqual(res);
  });
  test('control rangeValue value', () => {
    const type: ControllerFacadeTypes = ControllerFacadeTypes.RangeValue;
    const relatedViewItem: RelatedView = {
      viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
      relatedCategory: ChartDataViewFieldCategory.Field,
      fieldValue: 'GDP第一产业（亿元）',
      fieldValueType: ChartDataViewFieldType.NUMERIC,
    };

    const config: ControllerConfig = {
      required: false,
      controllerValues: [1, 10000],
      valueOptions: [],
      valueOptionType: 'common',
      assistViewFields: ['3ca2a12f09c84c8ca1a5714fc6fa44d8', '地区', '地区'],
      sqlOperator: FilterSqlOperator.Between,
      visibility: {
        visibilityType: 'show',
      },
    };

    const opt = { type, relatedViewItem, config };
    const res = [
      {
        value: 1,
        valueType: 'NUMERIC',
      },
      {
        value: 10000,
        valueType: 'NUMERIC',
      },
    ];
    expect(getWidgetControlValues(opt)).toEqual(res);
  });
  test('control RangeTime value', () => {
    const type: ControllerFacadeTypes = ControllerFacadeTypes.RangeTime;
    const relatedViewItem: RelatedView = {
      viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
      relatedCategory: ChartDataViewFieldCategory.Field,
      fieldValue: '日期',
      fieldValueType: ChartDataViewFieldType.DATE,
    };

    const config: ControllerConfig = {
      required: false,
      controllerValues: [],
      valueOptions: [],
      controllerDate: {
        pickerType: 'date',
        startTime: {
          relativeOrExact: TimeFilterValueCategory.Exact,
          exactValue: '2021-09-01 00:00:00',
        },
        endTime: {
          relativeOrExact: TimeFilterValueCategory.Exact,
          exactValue: '2022-01-15 00:00:00',
        },
      },
      assistViewFields: [],
      valueOptionType: 'common',
      sqlOperator: FilterSqlOperator.Between,
      visibility: {
        visibilityType: 'show',
      },
    };

    const opt = { type, relatedViewItem, config };
    const res = [
      {
        value: '2021-09-01 00:00:00',
        valueType: 'DATE',
      },
      {
        value: '2022-01-16 00:00:00',
        valueType: 'DATE',
      },
    ];
    expect(getWidgetControlValues(opt)).toEqual(res);
  });
});
