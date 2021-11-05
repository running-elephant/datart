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
import { ChartDataSectionConfig } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { ChartDataViewFieldCategory } from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { ReactNode } from 'react';
import AggregateTypeSection from './AggregateTypeSection';
import BaseDataConfigSection from './BaseDataConfigSection';
import ColorTypeSection from './ColorTypeSection';
import FilterTypeSection from './FilterTypeSection';
import GroupTypeSection from './GroupTypeSection';
import InfoTypeSection from './InfoTypeSection';
import MixedTypeSection from './MixedTypeSection';
import SizeTypeSection from './SizeTypeSection';
import SortTypeSection from './SortTypeSection';

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

const ChartDataConfigSection = {
  GroupTypeSection,
  AggregateTypeSection,
  BaseDataConfigSection,
  MixedTypeSection,
  FilterTypeSection,
  SortTypeSection,
  ColorTypeSection,
  InfoTypeSection,
  SizeTypeSection,
};

export default ChartDataConfigSection;
