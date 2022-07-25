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
      limit: 1,
      type: 'group',
    },
    {
      label: 'metrics',
      key: 'metrics',
      required: true,
      limit: 1,
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
      label: 'bar.title',
      key: 'bar',
      comType: 'group',
      rows: [
        {
          label: 'bar.isIncrement',
          key: 'isIncrement',
          comType: 'select',
          default: true,
          options: {
            translateItemLabel: true,
            items: [
              { label: '@global@.bar.accumulative', value: true },
              { label: '@global@.bar.difference', value: false },
            ],
          },
        },
        {
          label: 'common.borderStyle',
          key: 'borderStyle',
          comType: 'line',
          default: {
            type: 'solid',
            width: 0,
            color: '#ced4da',
          },
        },
        {
          label: 'bar.radius',
          key: 'radius',
          comType: 'inputNumber',
        },
        {
          label: 'bar.width',
          key: 'width',
          default: 0,
          comType: 'inputNumber',
        },
        {
          label: 'bar.ascendColor',
          key: 'ascendColor',
          default: '#298ffe',
          comType: 'fontColor',
        },
        {
          label: 'bar.descendColor',
          key: 'descendColor',
          default: '#15AD31',
          comType: 'fontColor',
        },
        {
          label: 'bar.totalColor',
          key: 'totalColor',
          default: '#ced4da',
          comType: 'fontColor',
        },
      ],
    },
    {
      label: 'label.title',
      key: 'label',
      comType: 'group',
      rows: [
        {
          label: 'common.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.position',
          key: 'position',
          comType: 'labelPosition',
          default: 'top',
        },
        {
          label: 'viz.palette.style.font',
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
      label: 'xAxis.title',
      key: 'xAxis',
      comType: 'group',
      rows: [
        {
          label: 'common.showAxis',
          key: 'showAxis',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.inverseAxis',
          key: 'inverseAxis',
          comType: 'checkbox',
        },
        {
          label: 'common.lineStyle',
          key: 'lineStyle',
          comType: 'line',
          default: {
            type: 'solid',
            width: 1,
            color: '#ced4da',
          },
        },
        {
          label: 'common.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'viz.palette.style.font',
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
          label: 'common.rotate',
          key: 'rotate',
          default: 0,
          comType: 'inputNumber',
        },
        {
          label: 'common.showInterval',
          key: 'showInterval',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'common.overflow',
          key: 'overflow',
          comType: 'select',
          default: 'break',
          options: {
            translateItemLabel: true,
            items: [
              { label: '@global@.common.overflowType.none', value: 'none' },
              {
                label: '@global@.common.overflowType.truncate',
                value: 'truncate',
              },
              { label: '@global@.common.overflowType.break', value: 'break' },
              {
                label: '@global@.common.overflowType.breakAll',
                value: 'breakAll',
              },
            ],
          },
        },
        {
          label: 'common.interval',
          key: 'interval',
          default: 0,
          comType: 'inputNumber',
        },
      ],
    },
    {
      label: 'yAxis.title',
      key: 'yAxis',
      comType: 'group',
      rows: [
        {
          label: 'common.showAxis',
          key: 'showAxis',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.inverseAxis',
          key: 'inverseAxis',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'common.lineStyle',
          key: 'lineStyle',
          comType: 'line',
          default: {
            type: 'solid',
            width: 1,
            color: '#ced4da',
          },
        },
        {
          label: 'common.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'viz.palette.style.font',
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
          label: 'common.showTitleAndUnit',
          key: 'showTitleAndUnit',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.unitFont',
          key: 'unitFont',
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
          label: 'common.nameLocation',
          key: 'nameLocation',
          default: 'center',
          comType: 'nameLocation',
        },
        {
          label: 'common.nameRotate',
          key: 'nameRotate',
          default: 90,
          comType: 'inputNumber',
        },
        {
          label: 'common.nameGap',
          key: 'nameGap',
          default: 20,
          comType: 'inputNumber',
        },
        {
          label: 'common.min',
          key: 'min',
          comType: 'inputNumber',
        },
        {
          label: 'common.max',
          key: 'max',
          comType: 'inputNumber',
        },
        {
          label: 'yAxis.open',
          key: 'modal',
          comType: 'group',
          options: {
            type: 'modal',
            modalSize: 'middle',
            flatten: true,
            title: 'yAxis.numberFormat',
          },
          rows: [
            {
              label: 'yAxis.open',
              key: 'YAxisNumberFormat',
              comType: 'YAxisNumberFormatPanel',
            },
          ],
        },
      ],
    },
    {
      label: 'splitLine.title',
      key: 'splitLine',
      comType: 'group',
      rows: [
        {
          label: 'splitLine.showHorizonLine',
          key: 'showHorizonLine',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.lineStyle',
          key: 'horizonLineStyle',
          comType: 'line',
          default: {
            type: 'dashed',
            width: 1,
            color: '#ced4da',
          },
        },
        {
          label: 'splitLine.showVerticalLine',
          key: 'showVerticalLine',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'common.lineStyle',
          key: 'verticalLineStyle',
          comType: 'line',
          default: {
            type: 'dashed',
            width: 1,
            color: '#ced4da',
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
          label: 'viz.palette.style.margin.containLabel',
          key: 'containLabel',
          default: true,
          comType: 'checkbox',
        },
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
    {
      label: 'reference.title',
      key: 'reference',
      comType: 'group',
      rows: [
        {
          label: 'reference.open',
          key: 'panel',
          comType: 'reference',
          options: { type: 'modal' },
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        common: {
          showAxis: '显示坐标轴',
          inverseAxis: '反转坐标轴',
          lineStyle: '线条样式',
          borderStyle: '边框样式',
          borderType: '边框线条类型',
          borderWidth: '边框线条宽度',
          showLabel: '显示标签',
          unitFont: '刻度字体',
          rotate: '旋转角度',
          position: '位置',
          showInterval: '显示刻度',
          interval: '刻度间隔',
          overflow: '文本溢出',
          showTitleAndUnit: '显示标题和刻度',
          nameLocation: '标题位置',
          nameRotate: '标题旋转',
          nameGap: '标题与轴线距离',
          min: '最小值',
          max: '最大值',
          overflowType: {
            none: '溢出',
            truncate: '截断',
            break: '换行',
            breakAll: '强制换行',
          },
          increase: '升',
          decrease: '降',
          total: '累计',
        },
        label: {
          title: '标签',
        },
        bar: {
          title: '瀑布图',
          isIncrement: '计算方式',
          radius: '边框圆角',
          width: '柱条宽度',
          ascendColor: '上升背景色',
          descendColor: '下降背景色',
          totalColor: '累计背景色',
          accumulative: '累计',
          difference: '差异',
        },
        splitLine: {
          title: '分割线',
          showHorizonLine: '显示横向分割线',
          showVerticalLine: '显示纵向分割线',
        },
        xAxis: {
          title: 'X轴',
        },
        yAxis: {
          title: 'Y轴',
          numberFormat: '数据格式设置',
          open: '打开',
        },
        reference: {
          title: '参考线',
          open: '点击参考线配置',
        },
      },
    },
    {
      lang: 'en-US',
      translation: {
        common: {
          showAxis: 'Show Axis',
          inverseAxis: 'Inverse Axis',
          lineStyle: 'Line Style',
          borderStyle: 'Border Style',
          borderType: 'Border Type',
          borderWidth: 'Border Width',
          borderColor: 'Border Color',
          backgroundColor: 'Background Color',
          showLabel: 'Show Label',
          unitFont: 'Unit Font',
          rotate: 'Rotate',
          position: 'Position',
          showInterval: 'Show Interval',
          interval: 'Interval',
          overflow: 'Overflow',
          showTitleAndUnit: 'Show Title and Unit',
          nameLocation: 'Name Location',
          nameRotate: 'Name Rotate',
          nameGap: 'Name Gap',
          min: 'Min',
          max: 'Max',
          overflowType: {
            none: 'None',
            truncate: 'Truncate',
            break: 'Break',
            breakAll: 'BreakAll',
          },
          increase: 'Increase',
          decrease: 'Decrease',
          total: 'Total',
        },
        label: {
          title: 'Label',
        },
        bar: {
          title: 'Waterfall Chart',
          radius: 'Bar Radius',
          width: 'Bar Width',
          ascendColor: 'Ascend Color',
          descendColor: 'Descend Color',
          totalColor: 'Total Color',
          isIncrement: 'Formula Mode',
          accumulative: 'Accumulative',
          difference: 'Difference',
        },
        xAxis: {
          title: 'X Axis',
        },
        yAxis: {
          title: 'Y Axis',
          numberFormat: 'Number Format',
          open: 'Open',
        },
        splitLine: {
          title: 'Split Line',
          showHorizonLine: 'Show Horizontal Line',
          showVerticalLine: 'Show Vertical Line',
        },
        reference: {
          title: 'Reference Line',
          open: 'Open',
        },
      },
    },
  ],
};

export default config;
