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

import { FilterSqlOperator } from 'globalConstants';
import { ValueOf } from 'types';
import {
  ControllerFacadeTypes,
  ControllerVisibilityTypes,
} from '../components/ChartOperationPanel/components/ChartFieldAction/FilterControlPanel/Constant';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from './ChartDataView';

export enum SortActionType {
  NONE = 'NONE',
  ASC = 'ASC',
  DESC = 'DESC',
  CUSTOMIZE = 'CUSTOMIZE',
}

export enum FieldFormatType {
  DEFAULT = 'default',
  NUMERIC = 'numeric',
  CURRENCY = 'currency',
  PERCENTAGE = 'percentage',
  SCIENTIFIC = 'scientificNotation',
  DATE = 'date',
  CUSTOM = 'custom',
}

export enum AggregateFieldActionType {
  NONE = 'NONE',
  SUM = 'SUM',
  AVG = 'AVG',
  COUNT = 'COUNT',
  COUNT_DISTINCT = 'COUNT_DISTINCT',
  MAX = 'MAX',
  MIN = 'MIN',
}

export type FilterFieldAction = {
  condition?: FilterCondition;
  visibility?: FilterVisibility;
  facade?: FilterFacade;
  width?: string;
};

export type FilterVisibility =
  | Lowercase<ControllerVisibilityTypes>
  | {
      visibility: ControllerVisibilityTypes.Condition;
      fieldUid: string;
      relation: string;
      value: string;
    };

export type FilterFacade =
  | Uncapitalize<keyof typeof ControllerFacadeTypes>
  | {
      facade: Uncapitalize<keyof typeof ControllerFacadeTypes>;
      [key: string]: string | number;
    };

export type FilterCondition = {
  name: string;
  type: FilterConditionType;
  value?:
    | Lowercase<keyof typeof FilterRelationType>
    | string
    | number
    | [number, number]
    | string[]
    | Array<FilterValueOption>;
  visualType: string;
  operator?:
    | string
    | Lowercase<keyof typeof FilterRelationType>
    | Uncapitalize<keyof typeof FilterSqlOperator>;
  children?: FilterCondition[];
};

export type FilterValueOption = {
  key: string;
  label: string;
  index?: number;
  isSelected?: boolean;
  children?: FilterValueOption[];
};

export const FilterRelationType = {
  AND: 'and',
  OR: 'or',
  BETWEEN: 'between',
  IN: 'in',
};

export enum FilterConditionType {
  // Real Filters
  List = 1 << 1,
  Customize = 1 << 2,
  Condition = 1 << 3,
  RangeValue = 1 << 4,
  Value = 1 << 5,
  RangeTime = 1 << 6,
  RelativeTime = 1 << 7,
  Time = 1 << 8,
  Tree = 1 << 9,

  // Logic Filters, and type of `Filter` includes all Real Filters
  Filter = List |
    Condition |
    Customize |
    RangeValue |
    Value |
    RangeTime |
    RelativeTime |
    Time |
    Tree,
  Relation = 1 << 50,
}

export type AggregateLimit = Pick<typeof AggregateFieldActionType, 'COUNT'>;

export const ChartDataSectionFieldActionType = {
  Sortable: 'sortable',
  Alias: 'alias',
  Format: 'format',
  Aggregate: 'aggregate',
  AggregateLimit: 'aggregateLimit',
  Filter: 'filter',
  CategoryFilter: 'categoryFilter',
  Colorize: 'colorize',
  ColorRange: 'colorRange',
  ColorizeSingle: 'colorSingle',
  Size: 'size',
};

export const AggregateFieldSubAggregateType = {
  [ChartDataSectionFieldActionType.Aggregate]: [
    AggregateFieldActionType.SUM,
    AggregateFieldActionType.AVG,
    AggregateFieldActionType.COUNT,
    AggregateFieldActionType.COUNT_DISTINCT,
    AggregateFieldActionType.MAX,
    AggregateFieldActionType.MIN,
  ],
  [ChartDataSectionFieldActionType.AggregateLimit]: [
    AggregateFieldActionType.COUNT,
    AggregateFieldActionType.COUNT_DISTINCT,
  ],
};

export const ChartStyleSectionComponentType = {
  CHECKBOX: 'checkbox',
  INPUT: 'input',
  SWITCH: 'switch',
  SELECT: 'select',
  FONT: 'font',
  FONTFAMILY: 'fontFamily',
  FONTSIZE: 'fontSize',
  FONTCOLOR: 'fontColor',
  INPUTNUMBER: 'inputNumber',
  SLIDER: 'slider',
  GROUP: 'group',
  CACHE: 'cache',
  REFERENCE: 'reference',
  TABS: 'tabs',
  LISTTEMPLATE: 'listTemplate',
  TABLEHEADER: 'tableHeader',
  LINE: 'line',
  MARGIN_WIDTH: 'marginWidth',
};

type ChartConfigBase = {
  label: string;
  key: string;
};

export type ChartDataSectionField = {
  uid?: string;
  colName: string;
  desc?: string;
  type: ChartDataViewFieldType;
  category: Lowercase<keyof typeof ChartDataViewFieldCategory>;

  sort?: SortFieldAction;
  alias?: AliasFieldAction;
  format?: IFieldFormatConfig;
  aggregate?: AggregateFieldActionType;
  filter?: FilterFieldAction;
  color?: ColorFieldAction;
  size?: number;
};

export type SortFieldAction = {
  type: SortActionType;
  value?: any;
};

export type ColorFieldAction = {
  start?: string;
  end?: string;
  colors?: Array<{ key: string; value: string }>;
};

// export type FormatFieldAction = {
//   type?: FieldFormatType;
//   decimalPlaces?: number;
//   unit?: number;
//   unitDesc?: string;
//   useThousandSeparator?: boolean;
//   [key: ValueOf<typeof FieldFormatType>]: number;
// };

export enum NumericUnit {
  None = '无',
  Thousand = '千/K',
  TenThousand = '万',
  Million = '百万/M',
  OneHundredMillion = '亿',
  Billion = '十亿/B',
  Gigabyte = 'G',
}

export interface IFieldFormatConfig {
  type: FieldFormatType;
  [FieldFormatType.NUMERIC]?: {
    decimalPlaces: number;
    unit?: number;
    unitDesc?: NumericUnit;
    useThousandSeparator: boolean;
  };
  [FieldFormatType.CURRENCY]?: {
    decimalPlaces: number;
    unit?: number;
    unitDesc?: NumericUnit;
    useThousandSeparator: boolean;
    prefix: string;
    suffix: string;
  };
  [FieldFormatType.PERCENTAGE]?: {
    decimalPlaces: number;
  };
  [FieldFormatType.SCIENTIFIC]?: {
    decimalPlaces: number;
  };
  [FieldFormatType.DATE]?: {
    format: string;
  };
  [FieldFormatType.CUSTOM]?: {
    format: string;
  };
}

export type AliasFieldAction = {
  name?: string;
  desc?: string;
};

export type ChartDataSectionConfig = ChartConfigBase & {
  type?: Lowercase<keyof typeof ChartDataSectionType>;
  maxFieldCount?: number;
  allowSameField?: boolean;
  required?: boolean;
  rows?: ChartDataSectionField[];
  actions?: Array<ValueOf<typeof ChartDataSectionFieldActionType>> | object;

  // Question: keep field's filter relation for filter arrangement feature
  fieldRelation?: FilterCondition;
};

export enum ChartDataSectionType {
  GROUP = 'group',
  AGGREGATE = 'aggregate',
  MIXED = 'mixed',
  FILTER = 'filter',
  COLOR = 'color',
  INFO = 'info',
  SIZE = 'size',
}

export type ChartStyleSectionConfig = ChartConfigBase &
  ChartStyleSectionGroup & {};

export type ChartStyleSectionGroup = ChartStyleSectionRow & {
  rows?: ChartStyleSectionGroup[];
};

export type ChartStyleSectionRow = {
  label: string;
  key: string;
  default?: any;
  value?: any;
  disabled?: boolean;
  hide?: boolean;
  options?: ChartStyleSectionRowOption;
  watcher?: ChartStyleSectionRowWatcher;
  template?: ChartStyleSectionRow;
  comType: ValueOf<typeof ChartStyleSectionComponentType>;
};

export type ChartStyleSectionRowOption = {
  min?: number | string;
  max?: number | string;
  step?: number | string;
  type?: string;
  editable?: boolean;
  modalSize?: string;
  expand?: boolean;
  items?: Array<ChartStyleSelectorItem> | string[] | number[];
  hideLabel?: boolean;
  style?: React.CSSProperties;
  getItems?: (cols) => Array<ChartStyleSelectorItem>;
  needRefresh?: boolean;
};

export type ChartStyleSelectorItem = {
  key?: any;
  label: any;
  value: any;
};

export type ChartStyleSectionRowWatcher = {
  deps: string[];
  action: (props) => Partial<ChartStyleSectionRow>;
};

export type ChartI18NSectionConfig = {
  lang: string;
  translation: object;
};

export default class ChartConfig {
  datas?: ChartDataSectionConfig[];
  styles?: ChartStyleSectionConfig[];
  settings?: ChartStyleSectionConfig[];
  i18ns?: ChartI18NSectionConfig[];
}
