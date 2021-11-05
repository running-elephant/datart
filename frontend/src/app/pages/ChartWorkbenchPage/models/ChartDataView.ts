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

import { View } from 'app/pages/MainPage/pages/ViewPage/slice/types';

export enum ChartDataViewFieldType {
  STRING = 'STRING',
  NUMERIC = 'NUMERIC',
  DATE = 'DATE',
}

export enum ChartDataViewFieldCategory {
  Field = 'field',
  Variable = 'variable',
  ComputedField = 'computedField',
  AggregateComputedField = 'aggregateComputedField',
}

export type ChartDataViewMeta = {
  id: string;
  name: string;
  primaryKey?: boolean;
  category?: Uncapitalize<keyof typeof ChartDataViewFieldCategory>;
  type?: ChartDataViewFieldType;
  expression?: string;
};

export type ChartDataView = View & {
  meta?: ChartDataViewMeta[];
  computedFields?: ChartDataViewMeta[];
  view?: { config?: string };
};

export default ChartDataView;
