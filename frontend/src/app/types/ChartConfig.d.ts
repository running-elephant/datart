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

import { AggregateFieldActionType, FieldFormatType } from 'app/constants';
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

export type AggregateLimit = Pick<typeof AggregateFieldActionType, 'COUNT'>;

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
   * Support Components: @see BasicRadio, @see BasicSelector and etc
   * Default is false for now, will be change in future version
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
