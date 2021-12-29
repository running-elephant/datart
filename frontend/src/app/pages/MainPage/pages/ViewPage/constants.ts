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

export enum ColumnTypes {
  String = 'STRING',
  Number = 'NUMERIC',
  Date = 'DATE',
}

export enum ColumnCategories {
  Uncategorized = 'UNCATEGORIZED',
  Country = 'COUNTRY',
  ProvinceOrState = 'PROVINCEORSTATE',
  City = 'CITY',
  County = 'COUNTY',
}

export enum ViewViewModelStages {
  NotLoaded = -1,
  Loading = 0,
  Fresh = 1,
  Initialized = 2,
  Running = 3,
  Saveable = 4,
  Saving = 5,
  Saved = 6,
}

export enum ViewStatus {
  Archived = 0,
  Active = 1,
}

export enum ConcurrencyControlModes {
  DirtyRead = 'DIRTYREAD',
  FastFailOver = 'FASTFAILOVER',
}

export const UNPERSISTED_ID_PREFIX = 'GENERATED-';

export const DEFAULT_PREVIEW_SIZE = 1000;
export const PREVIEW_SIZE_LIST = [100, 1000, 10000, 100000];
export const MAX_RESULT_TABLE_COLUMN_WIDTH = 480;

export const COLUMN_TYPE_LABEL = {
  [ColumnTypes.String]: '字符',
  [ColumnTypes.Number]: '数值',
  [ColumnTypes.Date]: '日期',
};

export const COLUMN_CATEGORY_LABEL = {
  [ColumnCategories.Uncategorized]: '未分类',
  [ColumnCategories.Country]: '国家',
  [ColumnCategories.ProvinceOrState]: '省份',
  [ColumnCategories.City]: '城市',
  [ColumnCategories.County]: '区县',
};

export const CONCURRENCY_CONTROL_MODE_LABEL = {
  [ConcurrencyControlModes.DirtyRead]: '延迟更新',
  [ConcurrencyControlModes.FastFailOver]: '快速失败',
};
