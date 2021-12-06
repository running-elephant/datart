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
      required: true,
      type: 'group',
      limit: [0, 1],
      actions: {
        NUMERIC: ['alias', 'colorize', 'sortable'],
        STRING: ['alias', 'colorize', 'sortable'],
      },
    },
    {
      label: 'metrics',
      key: 'metrics',
      required: true,
      type: 'aggregate',
      limit: [1, 999],
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
      label: 'funnel.title',
      key: 'funnel',
      comType: 'group',
      rows: [
        {
          label: 'funnel.sort',
          key: 'sort',
          comType: 'select',
          default: 'descending',
          options: {
            items: [
              { label: '降序', value: 'descending' },
              { label: '升序', value: 'ascending' },
              { label: '无', value: 'none' },
            ],
          },
        },
        {
          label: 'funnel.align',
          key: 'align',
          comType: 'select',
          default: 'center',
          options: {
            items: [
              { label: '居中', value: 'center' },
              { label: '居左', value: 'left' },
              { label: '居右', value: 'right' },
            ],
          },
        },
        {
          label: 'funnel.gap',
          key: 'gap',
          default: 1,
          comType: 'inputNumber',
        },
      ],
    },
    {
      label: 'label.title',
      key: 'label',
      comType: 'group',
      rows: [
        {
          label: 'label.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'label.position',
          key: 'position',
          comType: 'select',
          default: 'inside',
          options: {
            items: [
              { label: '左', value: 'left' },
              { label: '右', value: 'right' },
              { label: '内', value: 'inside' },
            ],
          },
        },
        {
          label: 'font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#495057',
          },
        },
        {
          label: 'label.metric',
          key: 'metric',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'label.conversion',
          key: 'conversion',
          comType: 'checkbox',
        },
        {
          label: 'label.arrival',
          key: 'arrival',
          comType: 'checkbox',
        },
        {
          label: 'label.percentage',
          key: 'percentage',
          comType: 'checkbox',
        },
      ],
    },
    {
      label: 'legend.title',
      key: 'legend',
      comType: 'group',
      rows: [
        {
          label: 'legend.showLegend',
          key: 'showLegend',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'legend.type',
          key: 'type',
          comType: 'select',
          default: 'scroll',
          options: {
            items: [
              { label: '普通', value: 'plain' },
              { label: '滚动', value: 'scroll' },
            ],
          },
        },
        {
          label: 'legend.selectAll',
          key: 'selectAll',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'legend.position',
          key: 'position',
          comType: 'select',
          default: 'right',
          options: {
            items: [
              { label: '右', value: 'right' },
              { label: '上', value: 'top' },
              { label: '下', value: 'bottom' },
              { label: '左', value: 'left' },
            ],
          },
        },
        {
          label: 'font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#495057',
          },
        },
      ],
    },
    {
      label: 'margin.title',
      key: 'margin',
      comType: 'group',
      rows: [
        {
          label: 'margin.left',
          key: 'marginLeft',
          default: '5%',
          comType: 'marginWidth',
        },
        {
          label: 'margin.right',
          key: 'marginRight',
          default: '5%',
          comType: 'marginWidth',
        },
        {
          label: 'margin.top',
          key: 'marginTop',
          default: '5%',
          comType: 'marginWidth',
        },
        {
          label: 'margin.bottom',
          key: 'marginBottom',
          default: '5%',
          comType: 'marginWidth',
        },
      ],
    },
  ],
  settings: [
    {
      label: 'cache.title',
      key: 'cache',
      comType: 'group',
      rows: [
        {
          label: 'cache.title',
          key: 'panel',
          comType: 'cache',
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        section: {
          legend: '图例',
          detail: '详细信息',
          info: '提示信息',
        },
        label: {
          title: '标签',
          showLabel: '显示标签',
          position: '位置',
          metric: '指标',
          dimension: '维度',
          conversion: '转换率',
          arrival: '到达率',
          percentage: '百分比',
        },
        legend: {
          title: '图例',
          showLegend: '显示图例',
          type: '图例类型',
          selectAll: '图例全选',
          position: '图例位置',
        },
        funnel: {
          title: '漏斗图',
          sort: '排序',
          align: '对齐',
          gap: '间距',
        },
        data: {
          color: '颜色',
          colorize: '配色',
        },
        cache: {
          title: '数据处理',
        },
      },
    },
  ],
};

export default config;
