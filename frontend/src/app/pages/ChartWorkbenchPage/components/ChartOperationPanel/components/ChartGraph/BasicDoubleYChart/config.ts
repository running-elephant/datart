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
      limit: 1,
    },
    {
      label: 'axis.y.left',
      key: 'metricsL',
      required: true,
      type: 'aggregate',
      limit: [1, 999],
    },
    {
      label: 'axis.y.right',
      key: 'metricsR',
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
      label: 'graph.title',
      key: 'graph',
      comType: 'group',
      rows: [
        {
          label: 'graph.smooth',
          key: 'smooth',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'graph.step',
          key: 'step',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'graph.symbol',
          key: 'symbol',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'graph.label',
          key: 'label',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'graph.stack',
          key: 'stack',
          default: false,
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
          default: true,
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
      label: 'leftY.title',
      key: 'leftY',
      comType: 'group',
      rows: [
        {
          label: 'leftY.title',
          key: 'graphType',
          default: 'bar',
          comType: 'select',
          options: {
            items: [
              { label: '折线图', value: 'line' },
              { label: '柱状图', value: 'bar' },
            ],
          },
        },
        {
          label: 'common.graphStyle',
          key: 'graphStyle',
          comType: 'line',
          default: {
            type: 'solid',
            width: 0,
            color: null,
          },
        },
        {
          label: 'common.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
          options: [],
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
      label: 'rightY.title',
      key: 'rightY',
      comType: 'group',
      rows: [
        {
          label: 'rightY.title',
          key: 'graphType',
          default: 'line',
          comType: 'select',
          options: {
            items: [
              { label: '折线图', value: 'line' },
              { label: '柱状图', value: 'bar' },
            ],
          },
        },
        {
          label: 'common.graphStyle',
          key: 'graphStyle',
          comType: 'line',
          default: {
            type: 'solid',
            width: 1,
            color: null,
          },
        },
        {
          label: 'common.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
          options: [],
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
            type: 'dashed',
            width: 1,
            color: '#ced4da',
          },
        },
        {
          label: 'common.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
          options: [],
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
          graphStyle: '图形样式',
          lineStyle: '线条样式',
          borderType: '边框线条类型',
          borderWidth: '边框线条宽度',
          borderColor: '边框线条颜色',
          backgroundColor: '背景颜色',
          showLabel: '显示标签',
          fontFamily: '字体',
          fontSize: '字号',
          fontColor: '字体颜色',
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
        graph: {
          title: '图形设置',
          smooth: '平滑',
          step: '阶梯',
          symbol: '标记',
          label: '数值',
          stack: '堆叠',
        },
        legend: {
          title: '图例',
          showLegend: '显示图例',
          type: '图例类型',
          selectAll: '图例全选',
          position: '图例位置',
        },
        leftY: {
          graph: '显示图形',
          title: '左Y轴',
        },
        rightY: {
          graph: '显示图形',
          title: '右Y轴',
        },
        xAxis: {
          title: 'X轴',
        },
        splitLine: {
          title: '分割线',
          showHorizonLine: '显示横向分割线',
          showVerticalLine: '显示纵向风格线',
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
