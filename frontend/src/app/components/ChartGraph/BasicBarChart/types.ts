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
  AxisLabel,
  AxisLineStyle,
  FontStyle,
  IFieldFormatConfig,
  LabelStyle,
  MarkArea,
  MarkLine,
} from 'app/types/ChartConfig';

export interface XAxisColumns {
  type: string;
  tooltip: { show: boolean };
  data: string[];
}

export interface YAxis {
  type: string;
  name: string | null;
  nameLocation: string;
  nameGap: string;
  nameRotate: string;
  inverse: boolean;
  min: number;
  max: number;
  axisLabel: AxisLabel;
  axisLine: AxisLineStyle;
  axisTick: AxisLineStyle;
  nameTextStyle: FontStyle;
  splitLine: AxisLineStyle;
}

export type XAxis = {
  axisPointer?: {
    show: boolean;
    type: string;
  };
  axisLabel: AxisLabel;
  axisLine: AxisLineStyle;
  axisTick: AxisLineStyle;
  data: string[];
  inverse: boolean;
  splitLine: AxisLineStyle;
  tooltip: { show: boolean };
  type: string;
};

export interface BorderStyle {
  color?: string;
  borderRadius?: number;
  borderType: string;
  borderWidth: number;
  borderColor: string;
}

export type BarSeriesImpl = {
  type: string;
  sampling: string;
  barGap: number;
  barWidth: number;
  itemStyle?: BorderStyle;
  markLine: MarkLine;
  markArea: MarkArea;
} & LabelStyle;

export type Series = {
  name: string;
  data: Array<{
    rowData?: any;
    name: string;
    value: number | string;
    total?: number;
    format: IFieldFormatConfig | undefined;
  }>;
} & BarSeriesImpl;
