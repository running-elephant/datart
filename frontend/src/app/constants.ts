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

import { FONT_FAMILY } from '@antv/s2';
import { G90 } from 'styles/StyleConstants';
import { IFontDefault } from 'types';

export enum TenantManagementMode {
  Team = 'TEAM',
  Platform = 'PLATFORM',
}

export enum ControllerFacadeTypes {
  DropdownList = 'dropdownList',
  MultiDropdownList = 'multiDropdownList',

  RadioGroup = 'radioGroup',
  CheckboxGroup = 'checkboxGroup',
  Text = 'text',

  Value = 'value',
  RangeValue = 'rangeValue',
  Slider = 'slider',
  RangeSlider = 'rangeSlider',

  Time = 'time',
  RangeTime = 'rangeTime',
  RangeTimePicker = 'rangeTimePicker',
  RecommendTime = 'recommendTime',

  Tree = 'tree',
}

export enum ControllerRadioFacadeTypes {
  Default = 'default',
  Button = 'button',
}

export enum TimeFilterValueCategory {
  Relative = 'relative',
  Exact = 'exact',
}

export enum ControllerVisibilityTypes {
  Hide = 'hide',
  Show = 'show',
  Condition = 'condition',
}

export enum ChartLifecycle {
  MOUNTED = 'mounted',
  UPDATED = 'updated',
  RESIZE = 'resize',
  UNMOUNTED = 'unmount',
}

export enum DataViewFieldType {
  STRING = 'STRING',
  NUMERIC = 'NUMERIC',
  DATE = 'DATE',
}

export enum ChartDataViewSubType {
  UnCategorized = 'UNCATEGORIZED',
  Country = 'COUNTRY',
  ProvinceOrState = 'PROVINCEORSTATE',
  City = 'CITY',
  County = 'COUNTY',
}

export enum ChartDataViewFieldCategory {
  Field = 'field',
  Hierarchy = 'hierarchy',
  Variable = 'variable',
  ComputedField = 'computedField',
  AggregateComputedField = 'aggregateComputedField',
  DateLevelComputedField = 'dateLevelComputedField',
}

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

export enum ChartDataSectionType {
  GROUP = 'group',
  AGGREGATE = 'aggregate',
  MIXED = 'mixed',
  FILTER = 'filter',
  COLOR = 'color',
  INFO = 'info',
  SIZE = 'size',
}

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
  DateLevel: 'dateLevel',
};

export const FilterRelationType = {
  AND: 'and',
  OR: 'or',
  BETWEEN: 'between',
  IN: 'in',
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
  CONDITIONALSTYLE: 'conditionalStylePanel',
  RADIO: 'radio',

  // Customize Component
  FontAlignment: 'fontAlignment',
  NameLocation: 'nameLocation',
  LabelPosition: 'labelPosition',
  LegendType: 'legendType',
  LegendPosition: 'legendPosition',
  ScorecardListTemplate: 'scorecardListTemplate',
  ScorecardConditionalStyle: 'scorecardConditionalStyle',
  PivotSheetTheme: 'pivotSheetTheme',
  BACKGROUND: 'background',
  WIDGET_BORDER: 'widgetBorder',
  TIMER_FORMAT: 'timerFormat',
};

export enum DownloadFileType {
  'Pdf' = 'PDF',
  'Excel' = 'EXCEL',
  'Image' = 'IMAGE',
}

export const RUNTIME_DATE_LEVEL_KEY = Symbol('DateLevel');

export const FontDefault: IFontDefault = {
  fontFamily: FONT_FAMILY,
  fontSize: '14',
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: G90,
};
