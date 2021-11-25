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
            items: [
              { label: '累计', value: true },
              { label: '差异', value: false },
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
          comType: 'select',
          default: 'top',
          options: {
            items: [
              { label: '上', value: 'top' },
              { label: '左', value: 'left' },
              { label: '右', value: 'right' },
              { label: '下', value: 'bottom' },
              { label: '内', value: 'inside' },
              { label: '内左', value: 'insideLeft' },
              { label: '内右', value: 'insideRight' },
              { label: '内上', value: 'insideTop' },
              { label: '内下', value: 'insideBottom' },
              { label: '内左上', value: 'insideTopLeft' },
              { label: '内左下', value: 'insideBottomLeft' },
              { label: '内右上', value: 'insideTopRight' },
              { label: '内右下', value: 'insideBottomRight' },
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
          comType: 'select',
          options: {
            items: [
              { label: '开始', value: 'start' },
              { label: '结束', value: 'end' },
              { label: '中间', value: 'center' },
            ],
          },
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
      label: 'margin.title',
      key: 'margin',
      comType: 'group',
      rows: [
        {
          label: 'margin.containLabel',
          key: 'containLabel',
          default: true,
          comType: 'checkbox',
        },
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
          showTitleAndUnit: '显示标题和刻度',
          nameLocation: '标题位置',
          nameRotate: '标题旋转',
          nameGap: '标题与轴线距离',
          min: '最小值',
          max: '最大值',
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
        },
        reference: {
          title: '参考线',
          open: '点击参考线配置',
        },
        cache: {
          title: '数据处理',
        },
      },
    },
  ],
};

export default config;
