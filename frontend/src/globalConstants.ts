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

import { FONT_FAMILY } from 'styles/StyleConstants';

export const DATARTSEPERATOR = '@datart@';

export enum StorageKeys {
  AuthorizationToken = 'AUTHORIZATION_TOKEN',
  LoggedInUser = 'LOGGED_IN_USER',
  ShareClientId = 'SHARE_CLIENT_ID',
}
export const BASE_API_URL = '/api/v1';
export const BASE_RESOURCE_URL = '/';
// 1 hour
export const DEFAULT_AUTHORIZATION_TOKEN_EXPIRATION = 1000 * 60 * 60;

export enum CommonFormTypes {
  Add = 'add',
  Edit = 'edit',
}

export const COMMON_FORM_TITLE_PREFIX = {
  [CommonFormTypes.Add]: '新建',
  [CommonFormTypes.Edit]: '编辑',
};

export const DEFAULT_DEBOUNCE_WAIT = 300;

export const FONT_SIZES = [
  10, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 128,
];

export const FONT_FAMILIES = [
  { name: '默认字体', value: FONT_FAMILY },
  { name: '微软雅黑', value: 'Microsoft YaHei' },
  { name: '宋体', value: 'SimSun' },
  { name: '黑体', value: 'SimHei' },
  { name: 'Helvetica Neue', value: '"Helvetica Neue"' },
  { name: 'Helvetica', value: 'Helvetica' },
  { name: 'Arial', value: 'Arial' },
  { name: 'sans-serif', value: 'sans-serif' },
];

export const FONT_WEIGHT = [
  { name: '常规字号', value: 'normal' },
  { name: '粗体', value: 'bold' },
  { name: '特粗体', value: 'bolder' },
  { name: '细体', value: 'lighter' },
  { name: '100', value: '100' },
  { name: '200', value: '200' },
  { name: '300', value: '300' },
  { name: '400', value: '400' },
  { name: '500', value: '500' },
  { name: '600', value: '600' },
  { name: '700', value: '700' },
  { name: '800', value: '800' },
  { name: '900', value: '900' },
];

export const FONT_STYLE = [
  { name: '常规体', value: 'normal' },
  { name: '斜体', value: 'italic' },
  { name: '偏斜体', value: 'oblique' },
];

export const CHART_LINE_STYLES = [
  { name: '实线', value: 'solid' },
  { name: '虚线', value: 'dashed' },
  { name: '点', value: 'dotted' },
];

export const CHART_LINE_WIDTH = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const CHART_DRAG_ELEMENT_TYPE = {
  DATA_CONFIG_COLUMN: 'data_config_column',
  DATASET_COLUMN: 'dataset_column',
  DATASET_GROUP_COLUMNS: 'dataset_group_columns',
};

export const TIME_UNIT_OPTIONS = [
  { name: 'seconds', value: 's' },
  { name: 'minutes', value: 'm' },
  { name: 'hours', value: 'h' },
  { name: 'days', value: 'd' },
  { name: 'weeks', value: 'w' },
  { name: 'months', value: 'M' },
  { name: 'years', value: 'y' },
];
export const TIME_DIRECTION = [
  { name: 'ago', value: '-' },
  { name: 'fromNow', value: '+' },
];

export const RECOMMEND_TIME = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THISWEEK: 'this_week',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  LAST_1_MONTH: 'last_1_month',
  LAST_1_YEAR: 'last_1_year',
};

export enum FilterSqlOperator {
  Equal = 'EQ',
  NotEqual = 'NE',

  Null = 'IS_NULL',
  NotNull = 'NOT_NULL',

  Contain = 'LIKE',
  NotContain = 'NOT_LIKE',

  PrefixContain = 'PREFIX_LIKE',
  NotPrefixContain = 'PREFIX_NOT_LIKE',

  SuffixContain = 'SUFFIX_LIKE',
  NotSuffixContain = 'SUFFIX_NOT_LIKE',

  Between = 'BETWEEN',
  In = 'IN',
  NotIn = 'NOT_IN',
  LessThan = 'LT',
  GreaterThan = 'GT',
  LessThanOrEqual = 'LTE',
  GreaterThanOrEqual = 'GTE',
}

export const ResizeEvent = new Event('resize', {
  bubbles: false,
  cancelable: true,
});

export const FILTER_TIME_FORMATTER_IN_QUERY = 'yyyy-MM-DD HH:mm:ss';
