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
  BackgroundConfig,
  BorderConfig,
  strEnumType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import { FilterSqlOperator } from 'globalConstants';
import i18next from 'i18next';
import { PRIMARY, WHITE } from 'styles/StyleConstants';
import { WidgetType } from './pages/Board/slice/types';
export const RGL_DRAG_HANDLE = 'dashboard-draggableHandle';
export const STORAGE_BOARD_KEY_PREFIX = 'DATART_BOARD_DATA_';
export const STORAGE_IMAGE_KEY_PREFIX = 'DATART_IMAGE_';
export const BASE_VIEW_WIDTH = 1024;
export const BASE_ROW_HEIGHT = 32;
export const MIN_ROW_HEIGHT = 24;
export const MIN_MARGIN = 8;
export const MIN_PADDING = 8;
/** lg: 12,md: 12,sm: 8,xs: 2,xxs: 2 */
export const LAYOUT_COLS_MAP = {
  lg: 12,
  md: 12,
  sm: 12,
  xs: 6,
  xxs: 6,
};
/** lg: 12,md: 10,sm: 6,xs: 4,xxs: 2 */

export const BREAK_POINT_MAP = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
};
export const INIT_COLS = 12;
export const DEVICE_LIST = {
  '华为 Mate 30': [360, 780],
  '华为 Mate 30 Pro': [392, 800],
  '小米 12': [393, 851],
  'iPhone X': [375, 812],
  'iPhone XR': [414, 896],
  'iPhone 12 Pro': [390, 844],
  'iPhone SE': [375, 667],
  'Pixel 5': [393, 851],
  'Samsung Galaxy S8+': [360, 740],
  'iPad Mini': [768, 1024],
  custom: null,
};

// DASH_UNDO
export const BOARD_UNDO = {
  undo: 'EDITOR_UNDO',
  redo: 'EDITOR_REDO',
};

export const BackgroundDefault: BackgroundConfig = {
  color: 'transparent',
  image: '',
  size: '100% 100%', // 'auto' | 'contain' | 'cover'|,
  repeat: 'no-repeat', //'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat',
};

export const ControllerWidthSize = {
  '16.67%': 4,
  '25%': 6,
  '33.33%': 8,
  '50%': 12,
  '100%': 24,
};

export const AutoBoardWidgetBackgroundDefault: BackgroundConfig = {
  ...BackgroundDefault,
  color: WHITE,
};

export const QueryButtonWidgetBackgroundDefault: BackgroundConfig = {
  ...BackgroundDefault,
  color: PRIMARY,
};

export const BorderDefault: BorderConfig = {
  radius: 1,
  width: 1,
  style: 'solid',
  color: 'transparent',
};

export const ButtonBorderDefault: BorderConfig = {
  ...BorderDefault,
  width: 0,
};

export const CanDropToWidgetTypes: WidgetType[] = ['chart', 'media'];
export const CanFullScreenWidgetTypes: WidgetType[] = ['chart', 'media'];

export const CONTAINER_TAB = 'containerTab';

//
export const NeedFetchWidgetTypes: WidgetType[] = ['chart', 'controller'];

// setting

export const TEXT_ALIGN_ENUM = strEnumType(['left', 'center', 'right']);
export type TextAlignType = keyof typeof TEXT_ALIGN_ENUM;

export const BORDER_STYLE_ENUM = strEnumType([
  'none',
  'solid',
  'dashed',
  'dotted',
  'double',
  'hidden',
  'ridge',
  'groove',
  'inset',
  'outset',
]);
export type BorderStyleType = keyof typeof BORDER_STYLE_ENUM;

export const BORDER_STYLE_OPTIONS = [
  { value: BORDER_STYLE_ENUM.none },
  { value: BORDER_STYLE_ENUM.solid },
  { value: BORDER_STYLE_ENUM.dashed },
  { value: BORDER_STYLE_ENUM.dotted },
  { value: BORDER_STYLE_ENUM.double },
  { value: BORDER_STYLE_ENUM.hidden },
  { value: BORDER_STYLE_ENUM.groove },
  { value: BORDER_STYLE_ENUM.ridge },
  { value: BORDER_STYLE_ENUM.inset },
  { value: BORDER_STYLE_ENUM.outset },
];

export const SCALE_MODE_ENUM = strEnumType([
  'scaleWidth',
  'scaleHeight',
  'scaleFull',
  'noScale',
]);

export type ScaleModeType = keyof typeof SCALE_MODE_ENUM;
export const SCALE_MODE__OPTIONS = [
  { value: SCALE_MODE_ENUM.scaleWidth },
  { value: SCALE_MODE_ENUM.scaleHeight },
  { value: SCALE_MODE_ENUM.scaleFull },
  { value: SCALE_MODE_ENUM.noScale },
];

export const enum ValueOptionTypes {
  Common = 'common',
  Custom = 'custom',
}
export type ValueOptionType = Uncapitalize<keyof typeof ValueOptionTypes>;
export const OPERATOR_TYPE_OPTION = [
  { name: '常规', value: ValueOptionTypes.Common },
  { name: '自定义', value: ValueOptionTypes.Custom },
];

export const enum ControllerVisibleTypes {
  Show = 'show',
  Hide = 'hide',
  Condition = 'condition',
}

export const enum ControllerPositionTypes {
  Fixed = 'fixed',
  Normal = 'normal',
  Affix = 'affix',
}

export type ControllerPositionType = Uncapitalize<
  keyof typeof ControllerPositionTypes
>;
export type ControllerVisibleType = Uncapitalize<
  keyof typeof ControllerVisibleTypes
>;
const tfo = (operator: FilterSqlOperator) => {
  const preStr = 'viz.common.enum.filterOperator.';
  return i18next.t(preStr + operator);
};
const tft = (type: ControllerVisibleTypes) => {
  const preStr = 'viz.common.enum.controllerVisibilityTypes.';
  return i18next.t(preStr + type);
};
const tfp = (type: ControllerPositionTypes) => {
  const preStr = 'viz.common.enum.controllerPositionTypes.';
  return i18next.t(preStr + type);
};
const getVisibleOptionItem = (type: ControllerVisibleTypes) => {
  return {
    name: tft(type),
    value: type,
  };
};
const getOperatorItem = (value: FilterSqlOperator) => {
  return {
    name: tfo(value),
    value: value,
  };
};
const getPositionTypesItem = (value: ControllerPositionTypes) => {
  return {
    name: tfp(value),
    value: value,
  };
};
export const VISIBILITY_TYPE_OPTION = [
  getVisibleOptionItem(ControllerVisibleTypes.Show),
  getVisibleOptionItem(ControllerVisibleTypes.Hide),
  getVisibleOptionItem(ControllerVisibleTypes.Condition),
];
export const FIXED_TYPE_OPTION = {
  auto: [
    getPositionTypesItem(ControllerPositionTypes.Normal),
    getPositionTypesItem(ControllerPositionTypes.Fixed),
    getPositionTypesItem(ControllerPositionTypes.Affix),
  ],
  free: [
    getPositionTypesItem(ControllerPositionTypes.Normal),
    getPositionTypesItem(ControllerPositionTypes.Fixed),
  ],
};
export const ALL_SQL_OPERATOR_OPTIONS = [
  getOperatorItem(FilterSqlOperator.Equal),
  getOperatorItem(FilterSqlOperator.NotEqual),

  getOperatorItem(FilterSqlOperator.In),
  getOperatorItem(FilterSqlOperator.NotIn),

  getOperatorItem(FilterSqlOperator.Null),
  getOperatorItem(FilterSqlOperator.NotNull),

  getOperatorItem(FilterSqlOperator.PrefixContain),
  getOperatorItem(FilterSqlOperator.NotPrefixContain),

  getOperatorItem(FilterSqlOperator.SuffixContain),
  getOperatorItem(FilterSqlOperator.NotSuffixContain),

  getOperatorItem(FilterSqlOperator.Between),

  getOperatorItem(FilterSqlOperator.GreaterThanOrEqual),
  getOperatorItem(FilterSqlOperator.LessThanOrEqual),
  getOperatorItem(FilterSqlOperator.GreaterThan),
  getOperatorItem(FilterSqlOperator.LessThan),
];

export const SQL_OPERATOR_OPTIONS_TYPES = {
  [ControllerFacadeTypes.DropdownList]: [
    FilterSqlOperator.Equal,
    FilterSqlOperator.NotEqual,
  ],
  [ControllerFacadeTypes.MultiDropdownList]: [
    FilterSqlOperator.In,
    FilterSqlOperator.NotIn,
  ],
  [ControllerFacadeTypes.CheckboxGroup]: [
    FilterSqlOperator.In,
    FilterSqlOperator.NotIn,
  ],
  [ControllerFacadeTypes.RadioGroup]: [
    FilterSqlOperator.Equal,
    FilterSqlOperator.NotEqual,
  ],
  [ControllerFacadeTypes.Text]: [
    FilterSqlOperator.Equal,
    FilterSqlOperator.NotEqual,
    FilterSqlOperator.Contain,
    FilterSqlOperator.NotContain,
    FilterSqlOperator.PrefixContain,
    FilterSqlOperator.NotPrefixContain,
    FilterSqlOperator.SuffixContain,
    FilterSqlOperator.NotSuffixContain,
  ],
  [ControllerFacadeTypes.Value]: [
    FilterSqlOperator.Equal,
    FilterSqlOperator.NotEqual,
    FilterSqlOperator.LessThan,
    FilterSqlOperator.GreaterThan,
    FilterSqlOperator.LessThanOrEqual,
    FilterSqlOperator.GreaterThanOrEqual,
  ],
  [ControllerFacadeTypes.Time]: [
    FilterSqlOperator.Equal,
    FilterSqlOperator.NotEqual,
    FilterSqlOperator.LessThan,
    FilterSqlOperator.GreaterThan,
    FilterSqlOperator.LessThanOrEqual,
    FilterSqlOperator.GreaterThanOrEqual,
  ],
  [ControllerFacadeTypes.Slider]: [
    FilterSqlOperator.Equal,
    FilterSqlOperator.NotEqual,
    FilterSqlOperator.LessThan,
    FilterSqlOperator.GreaterThan,
    FilterSqlOperator.LessThanOrEqual,
    FilterSqlOperator.GreaterThanOrEqual,
  ],
};

export const WIDGET_TITLE_ALIGN_OPTIONS = [
  { name: '左', value: TEXT_ALIGN_ENUM.left },
  { name: '中', value: TEXT_ALIGN_ENUM.center },
];
