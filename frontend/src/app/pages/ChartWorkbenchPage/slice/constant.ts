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
import { ChartDataViewFieldCategory, DateLevelType } from 'app/constants';
import i18n from 'i18next';

const prefix = 'viz.workbench.dataview.';

export const ChartConfigReducerActionType = {
  INIT: 'init',
  STYLE: 'style',
  DATA: 'data',
  SETTING: 'setting',
  INTERACTION: 'interaction',
  I18N: 'i18n',
};

export const DATE_LEVELS = [
  {
    category: ChartDataViewFieldCategory.DateLevelComputedField,
    expression: DateLevelType.AggDateYear,
    name: i18n.t(prefix + DateLevelType.AggDateYear),
    type: 'DATE',
  },
  {
    category: ChartDataViewFieldCategory.DateLevelComputedField,
    expression: DateLevelType.AggDateQuarter,
    name: i18n.t(prefix + DateLevelType.AggDateQuarter),
    type: 'DATE',
  },
  {
    category: ChartDataViewFieldCategory.DateLevelComputedField,
    expression: DateLevelType.AggDateMonth,
    name: i18n.t(prefix + DateLevelType.AggDateMonth),
    type: 'DATE',
  },
  {
    category: ChartDataViewFieldCategory.DateLevelComputedField,
    expression: DateLevelType.AggDateWeek,
    name: i18n.t(prefix + DateLevelType.AggDateWeek),
    type: 'DATE',
  },
  {
    category: ChartDataViewFieldCategory.DateLevelComputedField,
    expression: DateLevelType.AggDateDay,
    name: i18n.t(prefix + DateLevelType.AggDateDay),
    type: 'DATE',
  },
];
