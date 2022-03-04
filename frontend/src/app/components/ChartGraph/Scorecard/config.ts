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
import { FONT_FAMILY } from 'styles/StyleConstants';
import { getColumnRenderName } from '../../../utils/chartHelper';

const config: ChartConfig = {
  datas: [
    {
      label: 'metrics',
      key: 'metrics',
      required: true,
      type: 'aggregate',
      actions: {
        NUMERIC: ['aggregate', 'alias', 'format', 'sortable'],
        STRING: ['aggregate', 'alias', 'format', 'sortable'],
      },
      limit: 1,
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
      label: 'common.conditionalStyle',
      key: 'scorecardConditionalStyle',
      comType: 'group',
      rows: [
        {
          label: 'conditionalStyle.open',
          key: 'modal',
          comType: 'group',
          options: { type: 'modal', modalSize: 'middle' },
          rows: [
            {
              label: 'column.conditionalStylePanel',
              key: 'conditionalStylePanel',
              comType: 'scorecardConditionalStyle',
              options: {
                getItems: cols => {
                  const columns = (cols || [])
                    .filter(col => ['metrics'].includes(col.key))
                    .reduce((acc, cur) => acc.concat(cur.rows || []), [])
                    .map(c => ({
                      key: c.uid,
                      value: c.uid,
                      type: c.type,
                      label: getColumnRenderName(c),
                    }));
                  return columns;
                },
              },
            },
          ],
        },
      ],
    },
    {
      label: 'data.title',
      key: 'data',
      comType: 'group',
      rows: [
        {
          label: 'common.useAutoFontSize',
          key: 'useAutoFontSize',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.autoCoefficient',
          key: 'autoCoefficient',
          default: 22,
          comType: 'slider',
          options: {
            min: 1,
            max: 30,
            dots: false,
          },
          watcher: {
            deps: ['useAutoFontSize'],
            action: props => {
              return {
                disabled: !props.useAutoFontSize,
              };
            },
          },
        },
        {
          label: 'common.fixedFontSize',
          key: 'fixedFontSize',
          default: 12,
          comType: 'inputNumber',
          options: {
            min: 12,
            step: 1,
          },
          watcher: {
            deps: ['useAutoFontSize'],
            action: props => {
              return {
                disabled: props.useAutoFontSize,
              };
            },
          },
        },
        {
          label: 'viz.palette.style.font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: FONT_FAMILY,
            fontWeight: 'normal',
            fontStyle: 'normal',
            lineHeight: 1,
            color: '#495057',
          },
          options: {
            showLineHeight: true,
            showFontSize: false,
          },
        },
      ],
    },
    {
      label: 'label.title',
      key: 'label',
      comType: 'group',
      rows: [
        {
          label: 'label.show',
          key: 'show',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.useAutoFontSize',
          key: 'useAutoFontSize',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.autoCoefficient',
          key: 'autoCoefficient',
          default: 2,
          comType: 'slider',
          options: {
            min: 1,
            max: 30,
            dots: false,
          },
          watcher: {
            deps: ['useAutoFontSize'],
            action: props => {
              return {
                disabled: !props.useAutoFontSize,
              };
            },
          },
        },
        {
          label: 'common.fixedFontSize',
          key: 'fixedFontSize',
          default: 12,
          comType: 'inputNumber',
          options: {
            min: 12,
            step: 1,
          },
          watcher: {
            deps: ['useAutoFontSize'],
            action: props => {
              return {
                disabled: props.useAutoFontSize,
              };
            },
          },
        },
        {
          label: 'viz.palette.style.font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: FONT_FAMILY,
            fontWeight: 'normal',
            fontStyle: 'normal',
            lineHeight: 1,
            color: '#495057',
          },
          options: {
            showLineHeight: true,
            showFontSize: false,
          },
        },
        {
          label: 'common.position',
          key: 'position',
          comType: 'select',
          default: 'column',
          options: {
            translateItemLabel: true,
            items: [
              {
                label: 'common.positionType.top',
                value: 'column-reverse',
              },
              {
                label: 'common.positionType.bottom',
                value: 'column',
              },
              {
                label: 'common.positionType.left',
                value: 'row-reverse',
              },

              {
                label: 'common.positionType.right',
                value: 'row',
              },
            ],
          },
        },
        {
          label: 'common.alignment',
          key: 'alignment',
          default: 'center',
          comType: 'select',
          options: {
            translateItemLabel: true,
            items: [
              {
                label: '@global@.common.alignmentType.start',
                value: 'start',
              },
              {
                label: '@global@.common.alignmentType.center',
                value: 'center',
              },
              {
                label: '@global@.common.alignmentType.end',
                value: 'end',
              },
            ],
          },
        },
      ],
    },
    {
      label: 'viz.palette.style.margin.title',
      key: 'margin',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.style.margin.left',
          key: 'marginLeft',
          default: '5%',
          comType: 'marginWidth',
        },
        {
          label: 'viz.palette.style.margin.right',
          key: 'marginRight',
          default: '5%',
          comType: 'marginWidth',
        },
        {
          label: 'viz.palette.style.margin.top',
          key: 'marginTop',
          default: '5%',
          comType: 'marginWidth',
        },
        {
          label: 'viz.palette.style.margin.bottom',
          key: 'marginBottom',
          default: '5%',
          comType: 'marginWidth',
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
        common: {
          useAutoFontSize: '自适应文字大小',
          autoCoefficient: '自适应系数',
          fixedFontSize: '固定文字大小',
          position: '位置',
          positionType: {
            left: '左',
            top: '上',
            right: '右',
            bottom: '下',
          },
          conditionalStyle: '条件样式',
          alignment: '对齐方式',
          alignmentType: {
            start: '头部对齐',
            center: '中部对齐',
            end: '尾部对齐',
          },
        },
        label: {
          title: '标题',
          show: '显示标题',
        },
        data: {
          title: '数据',
        },
        conditionalStyle: {
          open: '打开样式设置',
        },
      },
    },
    {
      lang: 'en-US',
      translation: {
        common: {
          position: 'Position',
          positionType: {
            left: 'Left',
            top: 'Top',
            right: 'Right',
            bottom: 'Bottom',
          },
          conditionalStyle: 'Conditional Style',
          useAutoFontSize: 'Use Auto Font Size',
          autoCoefficient: 'Auto Coefficient',
          fixedFontSize: 'Fixed Font Size',
          alignment: 'Alignment',
          alignmentType: {
            start: 'Start',
            center: 'Center',
            end: 'End',
          },
        },
        label: {
          title: 'Label',
          show: 'showTitle',
        },
        data: {
          title: 'Data',
        },
        conditionalStyle: {
          open: 'Open Style Setting',
        },
      },
    },
  ],
};

export default config;
