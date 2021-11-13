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
