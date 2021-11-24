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
import ChartThemePanel from '../ChartThemePanel.tm';
import BaseDataConfigSection from './BaseDataConfigSection';
import { dataConfigSectionComparer } from './utils';

const ColorTypeSection: FC<ChartDataConfigSectionProps> = memo(
  ({ config, extra, onConfigChanged, ancestors, ...rest }) => {
    const defaultConfig = Object.assign(
      {},
      {
        actions: {
          [ChartDataViewFieldType.STRING]: [
            ChartDataSectionFieldActionType.Alias,
            ChartDataSectionFieldActionType.Colorize,
          ],
        },
      },
      config,
    );

    const onThemeChange = (key, value) => {
      onConfigChanged(
        ancestors,
        {
          ...defaultConfig,
          extra: {
            theme: key,
          },
        },
        true,
      );
    };

    const themeNode = () => {
      const node = (
        <ChartThemePanel
          onClick={onThemeChange}
          themeValue={defaultConfig.extra?.theme}
        />
      );
      if (extra) {
        return [extra, node];
      }
      return node;
    };

    return (
      <BaseDataConfigSection
        {...rest}
        onConfigChanged={onConfigChanged}
        ancestors={ancestors}
        extra={themeNode}
        config={defaultConfig}
      />
    );
  },
  dataConfigSectionComparer,
);

export default ColorTypeSection;
