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
    },
    {
      label: 'metrics',
      key: 'metrics',
      required: true,
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
      allowSameField: true,
    },
  ],
  styles: [
    {
      label: 'column.conditionStyle',
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
                      type: c.type,
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
                    rows: [
                      {
                        label: 'column.conditionStylePanel',
                        key: 'conditionStylePanel',
                        comType: 'conditionStylePanel',
                      },
                    ],
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
          label: 'style.enableFixedHeader',
          key: 'enableFixedHeader',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'style.enableBorder',
          key: 'enableBorder',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'style.leftFixedColumns',
          key: 'leftFixedColumns',
          comType: 'select',
          options: {
            mode: 'multiple',
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
        },
        {
          label: 'style.rightFixedColumns',
          key: 'rightFixedColumns',
          comType: 'select',
          options: {
            mode: 'multiple',
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
        },
      ],
    },
    {
      label: 'data.title',
      key: 'data',
      comType: 'group',
      rows: [
        {
          label: 'data.tableSize',
          key: 'tableSize',
          default: 'default',
          comType: 'select',
          options: {
            items: [
              { label: '默认', value: 'default' },
              { label: '中', value: 'middle' },
              { label: '小', value: 'small' },
            ],
          },
        },
      ],
    },
  ],
  settings: [
    {
      label: 'paging.title',
      key: 'paging',
      comType: 'group',
      rows: [
        {
          label: 'paging.pageSize',
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
        header: {
          title: '表头样式与分组',
          open: '打开表头样式与分组',
          styleAndGroup: '表头样式与分组',
        },
        column: {
          title: '表格数据列',
          open: '打开列设置',
          list: '字段列表',
          sortAndFilter: '排序与过滤',
          enableSort: '开启列排序',
          basicStyle: '基础样式',
          conditionStyle: '条件样式',
          conditionStylePanel: '条件样式配置器',
          backgroundColor: '背景颜色',
          align: '对齐方式',
          enableFixedCol: '开启固定列宽',
          fixedColWidth: '固定列宽度设置',
          font: '字体与样式',
        },
        style: {
          title: '表格样式',
          enableFixedHeader: '固定表头',
          enableBorder: '显示边框',
          leftFixedColumns: '左侧固定列',
          rightFixedColumns: '右侧固定列',
        },
        data: {
          title: '表格数据控制',
          tableSize: '表格大小',
          autoMerge: '自动合并相同内容',
          enableRaw: '使用原始数据',
        },
        paging: {
          title: '常规',
          pageSize: '总行数',
        },
      },
    },
  ],
};

export default config;
