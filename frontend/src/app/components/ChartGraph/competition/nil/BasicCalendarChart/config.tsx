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
  datas: [{
    label: 'date',
    key: 'date',
    type: 'group',
    limit: 1,
    required: true,
    actions: {
      NUMERIC: ['alias', 'colorize', 'format', 'sortable'],
      STRING: ['alias', 'colorize', 'format', 'sortable'],
      DATE: ['alias', 'colorize', 'sortable'],
    },
    // options: {
    //   sortable: { backendSort: true },
    // },
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
      // options: {
      //   sortable: { backendSort: true },
      // },
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
      label: 'series.title',
      key: 'series',
      comType: 'group',
      rows: [
        {
          label: 'series.type',
          key: 'type',
          default: 'heatmap',
          comType: 'select',
          options: {
            items: [
              { label: '热力图', value: 'heatmap' },
              { label: '散点', value: 'scatter' },
              { label: '动态散点', value: 'effectScatter' },
            ],
          },
        },
        {
          label: 'series.symbolSize',
          key: 'symbolSize',
          comType: 'inputNumber',
          default: 10,
        },
      ]
    },
    { label: 'calendar.title',
      key: 'calendar',
      comType: 'group',
      rows: [
        // {
        //   label: 'calendar.type',
        //   key: 'type',
        //   default: 'year',
        //   comType: 'select',
        //   options: {
        //     items: [
        //       { label: '年份', value: 'year' },
        //       { label: '月份', value: 'month' },
        //     ],
        //   },
        // },
        // {
        //   label: 'calendar.orient',
        //   key: 'orient',
        //   default: 'horizontal',
        //   comType: 'select',
        //   options: {
        //     items: [
        //       { label: '横向', value: 'horizontal' },
        //       { label: '纵向', value: 'vertical' },
        //     ],
        //   },
        // },
        // {
        //   label: 'calendar.top',
        //   key: 'top',
        //   default: 'middle',
        //   comType: 'select',
        //   options: {
        //     items: [
        //       { label: '居上', value: 'top' },
        //       { label: '居中', value: 'middle' },
        //       { label: '居下', value: 'bottom' },
        //     ],
        //   },
        //   // watcher: {
        //   //   deps: ['type'],
        //   //   action: props => {
        //   //     return {
        //   //       disabled: props.type === 'month'
        //   //     }
        //   //   },
        //   // },
        // },
        
        // {
        //   label: 'calendar.top',
        //   key: 'top',
        //   default: 100,
        //   comType: 'inputNumber',
        //   watcher: {
        //     deps: ['type'],
        //     action: props => {
        //       return {
        //         disabled: props.type === 'year'
        //       }
        //     },
        //   },
        // },
        {

          label: 'calendar.top',
          key: 'top',
          default: 130,
          comType: 'inputNumber',
        },
        {
          
          label: 'calendar.left',
          key: 'left',
          default: 60,
          comType: 'inputNumber',
        },
        // {
        //   label: 'calendar.cellSize',
        //   key: 'cellSize',
        //   comType: 'inputNumber',
        //   default: 15,
        // },
        {
          label: 'calendar.borderWidth',
          key: 'borderWidth',
          comType: 'inputNumber',
          default: 1,
        },
        {
          label: 'calendar.yearLabel',
          key: 'yearLabel',
          default: false,
          comType: 'checkbox',
        },
      ],
    },
    {
      label: 'visualMap.title',
      key: 'visualMap',
      comType: 'group',
      rows: [
        {
          label: 'visualMap.type',
          key: 'type',
          default: '',
          comType: 'select',
          options: {
            items: [
              { label: '滑动', value: '' },
              { label: '标签', value: 'piecewise' },
            ],
          },
        },
        {
          label: 'visualMap.orient',
          key: 'orient',
          default: 'horizontal',
          comType: 'select',
          options: {
            items: [
              { label: '横向', value: 'horizontal' },
              { label: '纵向', value: 'vertical' },
            ],
          },
        },
        {
          label: 'visualMap.top',
          key: 'top',
          default: 'top',
          comType: 'select',
          options: {
            items: [
              { label: '居上', value: 'top' },
              { label: '居下', value: 'bottom' },
            ],
          },
        },
        {

          label: 'visualMap.left',
          key: 'left',
          default: 'center',
          comType: 'select',
          options: {
            items: [
              { label: '居左', value: 'left' },
              { label: '居中', value: 'center' },
              { label: '居右', value: 'right' },
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
        series: {
          title: '设置',
          type: "图表类型",
          symbolSize: "散点大小",
        },
        calendar: {
          title: "日历设置",
          orient: "方向",
          top: "上下位置",
          left: "左右位置",
          cellSize: "方格大小",
          borderWidth: "边框",
          yearLabel: "显示年份(月份)",
          type: "视图"
        },
        visualMap: {
          title: "视图",
          orient: "方向",
          top: "上下位置",
          left: "左右位置",
          type: "视图类型"
        },
      },
    },
    {
      lang: 'en',
      translation: {
        series: {
          title: 'Settings',
          type: "Chart",
          symbolSize: "Scatter Size",
        },
        calendar: {
          title: "Calendar",
          orient: "Orient",
          top: "Top",
          left: "Left",
          cellSize: "Cell Size",
          borderWidth: "Border Width",
          yearLabel: "Year Label Or Month Label",
          type: "View Type"
        },
        visualMap: {
          title: "Visual Map",
          orient: "Orient",
          top: "Top",
          left: "Left",
          type: "visual Type"
        },
      },
    },
  ],
};

export default config;
