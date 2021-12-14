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
  datas: [
    {
      label: 'dimension',
      key: 'dimension',
      type: 'group',
    },
    {
      label: 'metrics',
      key: 'metrics',
      type: 'aggregate',
      actions: {
        NUMERIC: ['alias', 'sortable', 'format', 'aggregate'],
        STRING: ['alias', 'sortable', 'format', 'aggregate'],
      },
    },
    {
      label: 'filter',
      key: 'filter',
      type: 'filter',
      allowSameField: true,
    },
  ],
  styles: [
    {
      label: 'delta.title',
      hidden: true,
      key: 'delta',
      comType: 'group',
      rows: [
        {
          label: 'delta.richText',
          key: 'richText',
          default: '',
          comType: 'input',
        },
      ],
    },
  ],
  settings: [],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        delta: {
          title: '富文本',
          text: '内容',
        },
      },
    },
    {
      lang: 'en-US',
      translation: {},
    },
  ],
};

export default config;
