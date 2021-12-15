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
      label: 'datas.row',
      key: 'row',
      type: 'group',
    },
    {
      label: 'datas.column',
      key: 'column',
      type: 'group',
    },
    {
      label: 'metrics',
      key: 'metrics',
      type: 'aggregate',
      actions: {
        NUMERIC: ['aggregate', 'alias', 'format', 'sortable'],
        STRING: ['aggregate', 'alias', 'format', 'sortable'],
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
    {
      label: 'column.title',
      key: 'column',
      comType: 'group',
      rows: [
        {
          label: 'column.open',
          key: 'modal',
          comType: 'group',
          options: { type: 'modal', modalSize: 'middle' },
          rows: [
            {
              label: 'column.list',
              key: 'list',
              comType: 'listTemplate',
              rows: [],
              options: {
                getItems: cols => {
                  const columns = (cols || [])
                    .filter(col =>
                      ['aggregate', 'group', 'mixed'].includes(col.type),
                    )
                    .reduce((acc, cur) => acc.concat(cur.rows || []), [])
                    .map(c => ({
                      key: c.uid,
                      value: c.uid,
                      label:
                        c.label || c.aggregate
                          ? `${c.aggregate}(${c.colName})`
                          : c.colName,
                    }));
                  return columns;
                },
              },
              template: {
                label: 'column.listItem',
                key: 'listItem',
                comType: 'group',
                rows: [
                  {
                    label: 'column.conditionStyle',
                    key: 'conditionStyle',
                    comType: 'group',
                    options: { expand: true },
                    rows: [],
                  },
                ],
              },
            },
          ],
        },
      ],
    },
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
        // {
        //   label: 'style.enableAdjustRowHeight',
        //   key: 'enableAdjustRowHeight',
        //   default: false,
        //   comType: 'checkbox',
        // },
        // {
        //   label: 'style.enableAdjustColumnWidth',
        //   key: 'enableAdjustColumnWidth',
        //   default: false,
        //   comType: 'checkbox',
        // },
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
          default: '#f0f0f0',
          comType: 'fontColor',
        },
        {
          label: 'style.font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: 12,
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#6c757d',
          },
        },
        {
          label: 'style.align',
          key: 'align',
          default: 'left',
          comType: 'select',
          options: {
            items: [
              { label: '左对齐', value: 'left' },
              { label: '居中对齐', value: 'center' },
              { label: '右对齐', value: 'right' },
            ],
          },
        },
      ],
    },
    {
      label: 'style.tableBodyStyle',
      key: 'tableBodyStyle',
      comType: 'group',
      rows: [
        {
          label: 'style.bgColor',
          key: 'bgColor',
          default: '#fafafa',
          comType: 'fontColor',
        },
        {
          label: 'style.font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: 12,
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#6c757d',
          },
        },
        {
          label: 'style.align',
          key: 'align',
          default: 'left',
          comType: 'select',
          options: {
            items: [
              { label: '左对齐', value: 'left' },
              { label: '居中对齐', value: 'center' },
              { label: '右对齐', value: 'right' },
            ],
          },
        },
      ],
    },
  ],
  settings: [
    {
      label: 'summary.title',
      key: 'summary',
      comType: 'group',
      rows: [
        {
          label: 'summary.aggregateFields',
          key: 'aggregateFields',
          comType: 'select',
          options: {
            mode: 'multiple',
            getItems: cols => {
              const columns = (cols || [])
                .filter(col => ['mixed'].includes(col.type))
                .reduce((acc, cur) => acc.concat(cur.rows || []), [])
                .filter(c => c.type === 'NUMERIC')
                .map(c => ({
                  key: c.uid,
                  value: c.uid,
                  label:
                    c.label || c.aggregate
                      ? `${c.aggregate}(${c.colName})`
                      : c.colName,
                }));
              return columns;
            },
          },
        },
      ],
    },
    {
      label: 'paging.title',
      key: 'paging',
      comType: 'group',
      rows: [
        {
          label: 'paging.enablePaging',
          key: 'enablePaging',
          default: true,
          comType: 'checkbox',
          options: {
            needRefresh: true,
          },
        },

        {
          label: 'paging.pageSize',
          key: 'pageSize',
          default: 2000,
          comType: 'inputNumber',
          options: {
            needRefresh: true,
            step: 1,
            min: 0,
          },
          watcher: {
            deps: ['enablePaging'],
            action: props => {
              return {
                disabled: !props.enablePaging,
              };
            },
          },
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        datas: {
          row: '行',
          column: '列',
        },
        style: {
          title: '表格样式',
          enableExpandRow: '行表头折叠',
          enableHoverHighlight: '启用联动高亮',
          enableSelectedHighlight: '启用选中高亮',
          enableAdjustRowHeight: '启用调整行高',
          enableAdjustColumnWidth: '启用调整列宽',
          tableSize: '表格大小',
          tableHeaderStyle: '表头样式',
          tableBodyStyle: '表体样式',
          bgColor: '背景颜色',
          font: '字体',
          align: '对齐方式',
        },
        summary: {
          title: '数据汇总',
          aggregateFields: '汇总列',
        },
        paging: {
          title: '分页设置',
          enablePaging: '启用分页',
          pageSize: '分页大小',
        },
      },
    },
    {
      lang: 'en-US',
      translation: {
        datas: {
          row: 'Row',
          column: 'Column',
        },
        style: {
          title: 'Table Style',
          enableExpandRow: 'Fold Row',
          enableHoverHighlight: 'Enable Hover Highlight',
          enableSelectedHighlight: 'Enable Selected Highlight',
          enableAdjustRowHeight: 'Enable Adjust Row Height',
          enableAdjustColumnWidth: 'Enable Adjust Column Width',
          tableSize: 'Table Size',
          tableHeaderStyle: 'Table Header Style',
          tableBodyStyle: 'Table Body Style',
          bgColor: 'Background Color',
          font: 'Font',
          align: 'Align',
        },
        summary: {
          title: 'Summary',
          aggregateFields: 'Summary Fields',
        },
        paging: {
          title: 'Paging',
          enablePaging: 'Enable Paging',
          pageSize: 'Page Size',
        },
      },
    },
  ],
};

export default config;
