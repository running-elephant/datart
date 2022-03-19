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
      allowSameField: true,
    },
    {
      label: 'info',
      key: 'info',
      type: 'info',
    },
  ],
  styles: [
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
          default: 'outside',
          options: {
            translateItemLabel: true,
            items: [
              { label: 'label.positionOutside', value: 'outside' },
              { label: 'label.positionInside', value: 'inside' },
              { label: 'label.positionCenter', value: 'center' },
            ],
          },
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
          label: 'label.showName',
          key: 'showName',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'label.showValue',
          key: 'showValue',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'label.showPercent',
          key: 'showPercent',
          default: true,
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
          comType: 'legendType',
          default: 'scroll',
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
            translateItemLabel: true,
            items: [
              { label: 'legend.positionRight', value: 'right' },
              { label: 'legend.positionTop', value: 'top' },
              { label: 'legend.positionBottom', value: 'bottom' },
              { label: 'legend.positionLeft', value: 'left' },
            ],
          },
        },
        {
          label: 'legend.height',
          key: 'height',
          default: 0,
          comType: 'inputNumber',
          options: {
            step: 40,
            min: 0,
          },
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
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        section: {
          legend: '图例',
          detail: '详细信息',
        },
        common: {
          showLabel: '显示标签',
          rotate: '旋转角度',
          position: '位置',
        },
        pie: {
          title: '饼图',
          circle: '环状',
          roseType: '南丁格尔玫瑰',
        },
        label: {
          title: '标签',
          showLabel: '显示标签',
          position: '位置',
          positionOutside: '外侧',
          positionInside: '内部',
          positionCenter: '中心',
          showName: '维度值',
          showPercent: '百分比',
          showValue: '指标值',
        },
        legend: {
          title: '图例',
          showLegend: '显示图例',
          type: '图例类型',
          selectAll: '图例全选',
          position: '图例位置',
          positionRight: '右',
          positionTop: '上',
          positionBottom: '下',
          positionLeft: '左',
          height: '图例高度',
        },
        reference: {
          title: '参考线',
          open: '点击参考线配置',
        },
        tooltip: {
          title: '提示信息',
          showPercentage: '增加百分比显示',
        },
      },
    },
    {
      lang: 'en-US',
      translation: {
        section: {
          legend: 'Legend',
          detail: 'Detail',
        },
        common: {
          showLabel: 'Show Label',
          rotate: 'Rotate',
          position: 'Position',
          height: 'Height',
        },
        pie: {
          title: 'Pie',
          circle: 'Circle',
          roseType: 'Rose',
        },
        label: {
          title: 'Label',
          showLabel: 'Show Label',
          position: 'Position',
          positionOutside: 'Outside',
          positionInside: 'Inside',
          positionCenter: 'Center',
          showName: 'Show Name',
          showPercent: 'Show Percentage',
          showValue: 'Show Value',
        },
        legend: {
          title: 'Legend',
          showLegend: 'Show Legend',
          type: 'Type',
          selectAll: 'Select All',
          position: 'Position',
          positionRight: 'Right',
          positionTop: 'Top',
          positionBottom: 'Bottom',
          positionLeft: 'Left',
          height: 'Height',
        },
        reference: {
          title: 'Reference',
          open: 'Open',
        },
        tooltip: {
          title: 'Tooltip',
          showPercentage: 'Show Percentage',
        },
      },
    },
  ],
};

export default config;
