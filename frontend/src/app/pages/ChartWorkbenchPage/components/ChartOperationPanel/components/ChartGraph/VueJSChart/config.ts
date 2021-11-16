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

import { ChartConfig } from 'app/types/ChartConfig';

const config: ChartConfig = {
  styles: [
    {
      label: 'label',
      key: 'label',
      comType: 'group',
      rows: [
        {
          label: 'name',
          key: 'name',
          default: 'Friends',
          comType: 'input',
        },
        {
          label: 'font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '24',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: 'yellow',
          },
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        label: '标签',
        name: '你的姓名',
      },
    },
    {
      lang: 'en-US',
      translation: {
        label: 'Label',
        name: 'Your Name',
      },
    },
  ],
};

export default config;
