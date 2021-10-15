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

const config = {
  data: [
    {
      label: 'metrics',
      key: 'metrics',
      type: 'group',
    },
    {
      label: 'deminsion',
      key: 'deminsion',
      columns: [],
      type: 'aggregate',
    },
    {
      label: 'filter',
      key: 'filter',
      type: 'filter',
    },
    {
      label: 'data.colorize',
      key: 'color',
      type: 'color',
    },
    {
      label: 'info',
      key: 'info',
      type: 'info',
    },
  ],
  style: [
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
          default: 'top',
          options: {
            items: [
              {
                label: '上',
                value: 'top',
              },
              {
                label: '左',
                value: 'left',
              },
              {
                label: '右',
                value: 'right',
              },
              {
                label: '下',
                value: 'bottom',
              },
              {
                label: '内',
                value: 'inside',
              },
              {
                label: '内左',
                value: 'insideLeft',
              },
              {
                label: '内右',
                value: 'insideRight',
              },
              {
                label: '内上',
                value: 'insideTop',
              },
              {
                label: '内下',
                value: 'insideBottom',
              },
              {
                label: '内左上',
                value: 'insideTopLeft',
              },
              {
                label: '内左下',
                value: 'insideBottomLeft',
              },
              {
                label: '内右上',
                value: 'insideTopRight',
              },
              {
                label: '内右下',
                value: 'insideBottomRight',
              },
            ],
          },
        },
        {
          label: 'common.fontFamily',
          key: 'fontFamily',
          comType: 'fontFamily',
          default: '苹方',
        },
        {
          label: 'common.fontSize',
          key: 'fontSize',
          comType: 'fontSize',
          default: 8,
        },
        {
          label: 'common.fontColor',
          key: 'fontColor',
          comType: 'fontColor',
          default: 'black',
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
          options: {
            items: [
              {
                label: '普通',
                value: 'plain',
              },
              {
                label: '滚动',
                value: 'scroll',
              },
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
              {
                label: '右',
                value: 'right',
              },
              {
                label: '上',
                value: 'top',
              },
              {
                label: '下',
                value: 'bottom',
              },
              {
                label: '左',
                value: 'left',
              },
            ],
          },
        },
        {
          label: 'common.fontFamily',
          key: 'fontFamily',
          comType: 'fontFamily',
          default: '苹方',
        },
        {
          label: 'common.fontSize',
          key: 'fontSize',
          comType: 'fontSize',
          default: 8,
        },
        {
          label: 'common.fontColor',
          key: 'fontColor',
          comType: 'fontColor',
          default: 'black',
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
          label: 'common.axisType',
          key: 'axisType',
          default: 'solid',
          comType: 'select',
          options: {
            items: [
              {
                label: '实线',
                value: 'solid',
              },
              {
                label: '虚线',
                value: 'dashed',
              },
              {
                label: '点',
                value: 'dotted',
              },
            ],
          },
        },
        {
          label: 'common.axisWidth',
          key: 'axisWidth',
          default: 1,
          comType: 'select',
          options: {
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        },
        {
          label: 'common.axisColor',
          key: 'axisColor',
          default: 'black',
          comType: 'fontColor',
        },
        {
          label: 'common.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
          options: [],
        },
        {
          label: 'common.fontFamily',
          key: 'fontFamily',
          comType: 'fontFamily',
          default: '黑体',
        },
        {
          label: 'common.fontSize',
          key: 'fontSize',
          comType: 'fontSize',
          default: 8,
        },
        {
          label: 'common.fontColor',
          key: 'fontColor',
          default: 'black',
          comType: 'fontColor',
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
          label: 'common.axisType',
          key: 'axisType',
          default: 'solid',
          comType: 'select',
          options: {
            items: [
              {
                label: '实线',
                value: 'solid',
              },
              {
                label: '虚线',
                value: 'dashed',
              },
              {
                label: '点',
                value: 'dotted',
              },
            ],
          },
        },
        {
          label: 'common.axisWidth',
          key: 'axisWidth',
          default: 1,
          comType: 'select',
          options: {
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        },
        {
          label: 'common.axisColor',
          key: 'axisColor',
          default: 'black',
          comType: 'fontColor',
        },
        {
          label: 'common.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
          options: [],
        },
        {
          label: 'common.fontFamily',
          key: 'fontFamily',
          comType: 'fontFamily',
          default: '黑体',
        },
        {
          label: 'common.fontSize',
          key: 'fontSize',
          comType: 'fontSize',
          default: 8,
        },
        {
          label: 'common.fontColor',
          key: 'fontColor',
          default: 'black',
          comType: 'fontColor',
        },
        {
          label: 'common.showTitleAndUnit',
          key: 'showTitleAndUnit',
          default: true,
          comType: 'checkbox',
          options: [],
        },
        {
          label: 'common.fontFamily',
          key: 'unitFontFamily',
          comType: 'fontFamily',
          default: '黑体',
        },
        {
          label: 'common.fontSize',
          key: 'unitFontSize',
          comType: 'fontSize',
          default: 8,
        },
        {
          label: 'common.fontColor',
          key: 'unitFontColor',
          default: 'black',
          comType: 'fontColor',
        },
        {
          label: 'common.nameLocation',
          key: 'nameLocation',
          default: 'center',
          comType: 'select',
          options: {
            items: [
              {
                label: '开始',
                value: 'start',
              },
              {
                label: '结束',
                value: 'end',
              },
              {
                label: '中间',
                value: 'center',
              },
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
          label: 'splitLine.splitLineType',
          key: 'horizonType',
          default: 'dashed',
          comType: 'select',
          options: {
            items: [
              {
                label: '实线',
                value: 'solid',
              },
              {
                label: '虚线',
                value: 'dashed',
              },
              {
                label: '点',
                value: 'dotted',
              },
            ],
          },
        },
        {
          label: 'splitLine.splitLineWidth',
          key: 'horizenWidth',
          default: 1,
          comType: 'select',
          options: {
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        },
        {
          label: 'splitLine.splitLineColor',
          key: 'horizenColor',
          default: 'grey',
          comType: 'fontColor',
        },
        {
          label: 'splitLine.showVerticalLine',
          key: 'showVerticalLine',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'splitLine.splitLineType',
          key: 'vertcalType',
          default: 'dashed',
          comType: 'select',
          options: {
            items: [
              {
                label: '实线',
                value: 'solid',
              },
              {
                label: '虚线',
                value: 'dashed',
              },
              {
                label: '点',
                value: 'dotted',
              },
            ],
          },
        },
        {
          label: 'splitLine.splitLineWidth',
          key: 'verticalWidth',
          default: 1,
          comType: 'select',
          options: {
            items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        },
        {
          label: 'splitLine.splitLineColor',
          key: 'verticalColor',
          default: 'grey',
          comType: 'fontColor',
        },
      ],
    },
  ],
  setting: [
    {
      label: 'reference.title',
      key: 'reference',
      comType: 'group',
      rows: [
        {
          label: 'reference.open',
          key: 'panel',
          comType: 'reference',
          options: {
            type: 'modal',
          },
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
  i18n: [
    {
      lang: 'zh',
      translation: {
        common: {
          showAxis: '显示坐标轴',
          inverseAxis: '反转坐标轴',
          axisType: '线条类型',
          axisWidth: '线条宽度',
          axisColor: '线条颜色',
          lineType: '线条类型',
          lineWidth: '线条宽度',
          lineColor: '线条颜色',
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
        label: {
          title: '标签',
          showLabel: '显示标签',
          position: '位置',
        },
        legend: {
          title: '图例',
          showLegend: '显示图例',
          type: '图例类型',
          selectAll: '图例全选',
          position: '图例位置',
        },
        data: {
          color: '颜色',
          colorize: '配色',
        },
        graph: {
          title: '折线图',
          smooth: '平滑',
          step: '阶梯',
        },
        xAxis: {
          title: 'X轴',
        },
        yAxis: {
          title: 'Y轴',
        },
        splitLine: {
          title: '分割线',
          showHorizonLine: '显示横向分割线',
          showVerticalLine: '显示纵向分割线',
          splitLineType: '分割线类型',
          splitLineWidth: '分割线宽度',
          splitLineColor: '分割线颜色',
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
