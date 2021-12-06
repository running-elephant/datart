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

import { StateModalSize } from 'app/hooks/useStateModal';
import { ChartDataSectionConfig } from 'app/types/ChartConfig';
import { ChartDataViewFieldCategory } from 'app/types/ChartDataView';
import { ReactNode } from 'react';

export interface ChartDataConfigSectionProps {
  ancestors: number[];
  config: ChartDataSectionConfig;
  modalSize?: StateModalSize;
  category?: Lowercase<keyof typeof ChartDataViewFieldCategory>;
  extra?: () => ReactNode;
  translate?: (title: string) => string;
  onConfigChanged: (
    ancestors: number[],
    config: ChartDataSectionConfig,
    needRefresh?: boolean,
  ) => void;
}
