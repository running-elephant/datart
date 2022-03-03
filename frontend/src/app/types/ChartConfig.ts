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
  ControllerFacadeTypes,
  ControllerVisibilityTypes,
} from 'app/types/FilterControlPanel';
import {
  FilterSqlOperator,
  NumberUnitKey,
  RECOMMEND_TIME,
} from 'globalConstants';
import { ValueOf } from 'types';
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
    | Array<RelationFilterValue>
    | TimeFilterConditionValue;
  visualType: string;
  operator?:
    | string
    | Lowercase<keyof typeof FilterRelationType>
    | Uncapitalize<keyof typeof FilterSqlOperator>;
  children?: FilterCondition[];
};

export type TimeFilterConditionValue =
  | string
  | string[]
  | Lowercase<keyof typeof RECOMMEND_TIME>
  | Array<{
      unit;
      amount;
      direction?: string;
    }>;

export type RelationFilterValue = {
  key: string;
  label: string;
  index?: number;
  isSelected?: boolean;
  children?: RelationFilterValue[];
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
  RecommendTime = 1 << 7,
  Time = 1 << 8,
  Tree = 1 << 9,

  // Logic Filters, and type of `Filter` includes all Real Filters
  Filter = List |
    Condition |
    Customize |
    RangeValue |
    Value |
    RangeTime |
    RecommendTime |
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
  FONTSTYLE: 'fontStyle',
  FONTWEIGHT: 'fontWeight',
  INPUTNUMBER: 'inputNumber',
  INPUTPERCENTAGE: 'inputPercentage',
  SLIDER: 'slider',
  GROUP: 'group',
  REFERENCE: 'reference',
  TABS: 'tabs',
  LISTTEMPLATE: 'listTemplate',
  TABLEHEADER: 'tableHeader',
  LINE: 'line',
  MARGIN_WIDTH: 'marginWidth',
  TEXT: 'text',
  CONDITIONSTYLE: 'conditionStylePanel',
  RADIO: 'radio',

  // Customize Component
  FontAlignment: 'fontAlignment',
  NameLocation: 'nameLocation',
  LegendType: 'legendType',
  ScorecardListTemplate: 'scorecardListTemplate',
  ScorecardConditionStyle: 'scorecardConditionStyle',
};

export type ChartConfigBase = {
  label?: string;
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

export interface IFieldFormatConfig {
  type: FieldFormatType;
  [FieldFormatType.NUMERIC]?: {
    decimalPlaces: number;
    unitKey?: NumberUnitKey;
    useThousandSeparator?: boolean;
    prefix?: string;
    suffix?: string;
  };
  [FieldFormatType.CURRENCY]?: {
    decimalPlaces: number;
    unitKey?: NumberUnitKey;
    useThousandSeparator?: boolean;
    currency?: string;
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

export type ChartDataConfig = ChartConfigBase & {
  type?: Lowercase<keyof typeof ChartDataSectionType>;
  allowSameField?: boolean;
  required?: boolean;
  rows?: ChartDataSectionField[];
  actions?: Array<ValueOf<typeof ChartDataSectionFieldActionType>> | object;
  limit?: null | number | string | number[] | string[];
  disableAggregate?: boolean;
  options?: {
    [key in ValueOf<typeof ChartDataSectionFieldActionType>]: {
      backendSort?: boolean;
    };
  };

  // NOTE: keep field's filter relation for filter arrangement feature
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

export type ChartStyleConfig = ChartConfigBase & ChartStyleSectionGroup & {};

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
  hidden?: boolean;
};

export type ChartStyleSectionRowOption = {
  min?: number | string;
  max?: number | string;
  step?: number | string;
  dots?: boolean;
  type?: string;
  editable?: boolean;
  modalSize?: string | number;
  expand?: boolean;
  items?: Array<ChartStyleSelectorItem> | string[] | number[];
  hideLabel?: boolean;
  style?: React.CSSProperties;
  getItems?: (cols) => Array<ChartStyleSelectorItem>;
  needRefresh?: boolean;
  fontFamilies?: string[];
  showFontSize?: boolean;
  showLineHeight?: boolean;
  showFontStyle?: boolean;
  showFontColor?: boolean;

  /**
   * Suppport Components: @see BasicRadio, @see BasicSelector and etc
   * Default is false for now, will be change in futrue version
   */
  translateItemLabel?: boolean;
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

export type ChartConfig = {
  datas?: ChartDataConfig[];
  styles?: ChartStyleConfig[];
  settings?: ChartStyleConfig[];
  i18ns?: ChartI18NSectionConfig[];
  env?: string;
};
