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

import { ChartDataSectionFieldActionType } from 'app/types/ChartConfig';
import { ChartDataConfigSectionProps } from 'app/types/ChartDataConfigSection';
import { ChartDataViewFieldType } from 'app/types/ChartDataView';
import { FC, memo } from 'react';
import BaseDataConfigSection from './BaseDataConfigSection';
import { dataConfigSectionComparer } from './utils';

const MixedTypeSection: FC<ChartDataConfigSectionProps> = memo(
  ({ config, ...rest }) => {
    const defaultConfig = Object.assign(
      {},
      {
        actions: {
          [ChartDataViewFieldType.NUMERIC]: [
            ChartDataSectionFieldActionType.Alias,
            ChartDataSectionFieldActionType.Format,
            ChartDataSectionFieldActionType.Sortable,
          ],
          [ChartDataViewFieldType.STRING]: [
            ChartDataSectionFieldActionType.Alias,
            ChartDataSectionFieldActionType.Sortable,
          ],
          [ChartDataViewFieldType.DATE]: [
            ChartDataSectionFieldActionType.Alias,
            ChartDataSectionFieldActionType.Sortable,
          ],
        },
      },
      config,
    );
    return <BaseDataConfigSection {...rest} config={defaultConfig} />;
  },
  dataConfigSectionComparer,
);

export default MixedTypeSection;
