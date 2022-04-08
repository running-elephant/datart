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
      label: 'start',
      key: 'start',
      type: 'group',
      limit: 1,
      required: true,
      options: {
        sortable: { backendSort: false },
      },
      actions: {
        DATE: ['alias', 'format', 'sortable'],
      },
    },
    {
      label: 'end',
      key: 'end',
      type: 'group',
      limit: 1,
      required: true,
      options: {
        sortable: { backendSort: false },
      },
      actions: {
        DATE: ['alias', 'format', 'sortable'],
      },
    },
    {
      label: 'dimension',
      key: 'dimension',
      type: 'group',
      limit: [1, 999],
      required: true,
      actions: {
        NUMERIC: ['alias', 'format', 'sortable'],
        STRING: ['alias', 'format', 'sortable'],
      },
      options: {
        sortable: { backendSort: false },
      },
    },
    {
      label: 'metrics',
      key: 'metrics',
      type: 'aggregate',
      required: true,
      limit: [1, 999],
      actions: {
        NUMERIC: ['aggregate', 'alias', 'format', 'sortable'],
        STRING: ['aggregate', 'alias', 'format', 'sortable'],
      },
      options: {
        sortable: { backendSort: false },
      },
    },
    {
      label: 'colorize',
      key: 'color',
      type: 'color',
      limit: [0, 1],
    },
    {
      label: 'filter',
      key: 'filter',
      type: 'filter',
    },
    {
      label: 'info',
      key: 'info',
      type: 'info',
    },
  ],
  styles: [
    {
      label: 'view.title',
      key: 'view',
      comType: 'group',
      rows: [
        {
          label: 'view.mode',
          key: 'mode',
          default: 'default',
          comType: 'select',
          options: {
            items: [
              { label: '默认', value: 'default' },
              { label: 'Tabs', value: 'tabs' },
            ],
          },
        },
      ],
    },
    {
      label: 'week.title',
      key: 'week',
      comType: 'group',
      rows: [
        {
          label: 'week.first',
          key: 'first',
          default: 1,
          comType: 'select',
          options: {
            items: [
              { label: '周一', value: 1 },
              { label: '周日', value: 0 },
            ],
          },
        },
      ],
    },
  ],
  settings: [
    {
      label: 'viz.palette.setting.paging.title',
      key: 'paging',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.setting.paging.pageSize',
          key: 'pageSize',
          default: 1000,
          comType: 'inputNumber',
          options: {
            needRefresh: true,
            step: 1,
            min: 0,
          },
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        viz: {
          palette: {
            data: {
              start: '开始时间',
              end: '结束时间',
            },
            graph: {
              names: {
                scheduler: '任务日历',
              },
            },
          },
        },
        view: {
          title: '视图',
          mode: '默认视图',
        },
        week: {
          title: '周视图',
          first: '首日',
        },
      },
    },
    {
      lang: 'en',
      translation: {
        viz: {
          palette: {
            data: {
              start: 'Start Date',
              end: 'End Date',
            },
            graph: {
              names: {
                scheduler: 'Calendar Scheduler',
              },
            },
          },
        },
        view: {
          title: 'View',
          mode: 'Default View',
        },
        week: {
          title: 'Week',
          first: 'First Day',
        },
      },
    },
  ],
};

export default config;
