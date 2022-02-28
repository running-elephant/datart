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
      label: 'column',
      key: 'column',
      type: 'group',
      options: {
        sortable: { backendSort: false },
      },
    },
    {
      label: 'row',
      key: 'row',
      type: 'group',
      options: {
        sortable: { backendSort: false },
      },
    },
    {
      label: 'metrics',
      key: 'metrics',
      type: 'aggregate',
      actions: {
        NUMERIC: ['aggregate', 'alias', 'format', 'sortable'],
        STRING: ['aggregate', 'alias', 'format', 'sortable'],
      },
      options: {
        sortable: { backendSort: false },
      },
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
    // {
    //   label: 'column.title',
    //   key: 'column',
    //   comType: 'group',
    //   rows: [
    //     {
    //       label: 'column.open',
    //       key: 'modal',
    //       comType: 'group',
    //       options: { type: 'modal', modalSize: 'middle' },
    //       rows: [
    //         {
    //           label: 'column.list',
    //           key: 'list',
    //           comType: 'listTemplate',
    //           rows: [],
    //           options: {
    //             getItems: cols => {
    //               const columns = (cols || [])
    //                 .filter(col =>
    //                   ['aggregate', 'group', 'mixed'].includes(col.type),
    //                 )
    //                 .reduce((acc, cur) => acc.concat(cur.rows || []), [])
    //                 .map(c => ({
    //                   key: c.uid,
    //                   value: c.uid,
    //                   label:
    //                     c.label || c.aggregate
    //                       ? `${c.aggregate}(${c.colName})`
    //                       : c.colName,
    //                 }));
    //               return columns;
    //             },
    //           },
    //           template: {
    //             label: 'column.listItem',
    //             key: 'listItem',
    //             comType: 'group',
    //             rows: [
    //               {
    //                 label: 'column.conditionStyle',
    //                 key: 'conditionStyle',
    //                 comType: 'group',
    //                 options: { expand: true },
    //                 rows: [],
    //               },
    //             ],
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      label: 'style.title',
      key: 'style',
      comType: 'group',
      rows: [
        {
          label: 'style.enableExpandRow',
          key: 'enableExpandRow',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'style.enableHoverHighlight',
          key: 'enableHoverHighlight',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'style.enableSelectedHighlight',
          key: 'enableSelectedHighlight',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'style.metricNameShowIn.label',
          key: 'metricNameShowIn',
          default: true,
          comType: 'radio',
          options: {
            translateItemLabel: true,
            items: [
              {
                key: 'inCol',
                label: 'style.metricNameShowIn.inCol',
                value: true,
              },
              {
                key: 'inRow',
                label: 'style.metricNameShowIn.inRow',
                value: false,
              },
            ],
          },
        },
      ],
    },
    {
      label: 'style.tableHeaderStyle',
      key: 'tableHeaderStyle',
      comType: 'group',
      rows: [
        {
          label: 'style.bgColor',
          key: 'bgColor',
          comType: 'fontColor',
        },
        {
          label: 'style.font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFangSC',
            fontSize: 12,
            fontWeight: 'normal',
            color: '#495057',
          },
          options: {
            fontFamilies: [
              'Roboto',
              'PingFangSC',
              'BlinkMacSystemFont',
              'Microsoft YaHei',
              'Arial',
              'sans-serif',
            ],
          },
        },
        {
          label: 'style.align',
          key: 'align',
          default: 'right',
          comType: 'fontAlignment',
        },
      ],
    },
    {
      label: 'style.tableBodyStyle',
      key: 'tableBodyStyle',
      comType: 'group',
      rows: [
        {
          label: 'style.oddBgColor',
          key: 'oddBgColor',
          comType: 'fontColor',
        },
        {
          label: 'style.evenBgColor',
          key: 'evenBgColor',
          comType: 'fontColor',
        },
        {
          label: 'style.font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFangSC',
            fontSize: 12,
            fontWeight: 'normal',
            color: '#495057',
          },
          options: {
            fontFamilies: [
              'Roboto',
              'PingFangSC',
              'BlinkMacSystemFont',
              'Microsoft YaHei',
              'Arial',
              'sans-serif',
            ],
          },
        },
        {
          label: 'style.align',
          key: 'align',
          default: 'left',
          comType: 'fontAlignment',
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
    {
      label: 'summary.rowSummary',
      key: 'rowSummary',
      comType: 'group',
      rows: [
        {
          label: 'summary.enableTotal',
          key: 'enableTotal',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'summary.totalPosition',
          key: 'totalPosition',
          default: true,
          comType: 'select',
          options: {
            items: [
              { label: '顶部', value: true },
              { label: '底部', value: false },
            ],
          },
        },
        {
          label: 'summary.enableSubTotal',
          key: 'enableSubTotal',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'summary.subTotalPosition',
          key: 'subTotalPosition',
          default: true,
          comType: 'select',
          options: {
            items: [
              { label: '顶部', value: true },
              { label: '底部', value: false },
            ],
          },
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        style: {
          title: '表格样式',
          enableExpandRow: '行表头折叠',
          enableHoverHighlight: '启用联动高亮',
          enableSelectedHighlight: '启用选中高亮',
          enableAdjustRowHeight: '启用调整行高',
          enableAdjustColumnWidth: '启用调整列宽',
          metricNameShowIn: {
            label: '指标名称位置',
            inCol: '列表头',
            inRow: '行表头',
          },
          tableSize: '表格大小',
          tableHeaderStyle: '表头样式',
          tableBodyStyle: '表体样式',
          bgColor: '背景颜色',
          evenBgColor: '偶数行背景颜色',
          oddBgColor: '奇数行背景颜色',
          font: '字体',
          align: '对齐方式',
        },
        summary: {
          title: '数据汇总',
          rowSummary: '行总计',
          columnSummary: '列总计',
          enableTotal: '启用总计',
          enableSubTotal: '启用小计',
          totalPosition: '总计位置',
          subTotalPosition: '小计位置',
          aggregateFields: '汇总列',
        },
      },
    },
    {
      lang: 'en-US',
      translation: {
        style: {
          title: 'Table Style',
          enableExpandRow: 'Fold Row',
          enableHoverHighlight: 'Enable Hover Highlight',
          enableSelectedHighlight: 'Enable Selected Highlight',
          enableAdjustRowHeight: 'Enable Adjust Row Height',
          enableAdjustColumnWidth: 'Enable Adjust Column Width',
          metricNameShowIn: {
            label: 'Metric Name Position',
            inCol: 'Col Header',
            inRow: 'Row Header',
          },
          tableSize: 'Table Size',
          tableHeaderStyle: 'Table Header Style',
          tableBodyStyle: 'Table Body Style',
          bgColor: 'Background Color',
          evenBgColor: 'Even Row Background Color',
          oddBgColor: 'Odd Row Background Color',
          font: 'Font',
          align: 'Align',
        },
        summary: {
          title: 'Summary',
          rowSummary: 'Row Total',
          columnSummary: 'Column Total',
          enableTotal: 'Enable Total',
          enableSubTotal: 'Enable Sub Total',
          totalPosition: 'Total Position',
          subTotalPosition: 'Sub Total Position',
          aggregateFields: 'Summary Fields',
        },
      },
    },
  ],
};

export default config;
