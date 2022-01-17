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

import { ChartDataViewMeta } from 'app/types/ChartDataViewMeta';
import { ChartDataSectionConfig } from './ChartConfig';

export type ChartStyleConfigDTO = {
  label: string; // TODO(Stephen): to be check if needed
  key: string;
  value?: any;
  rows?: ChartStyleConfigDTO[];
};

export type ChartDataConfigDTO = ChartDataSectionConfig & {};

export type ChartConfigDTO = {
  datas?: ChartDataSectionConfig[];
  styles?: ChartStyleConfigDTO[];
  settings?: ChartStyleConfigDTO[];
};

export type ChartDetailConfigDTO = {
  chartConfig: ChartConfigDTO;
  chartGraphId: string;
  computedFields: ChartDataViewMeta[];
  aggregation: boolean;
};
