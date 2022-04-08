/*
 * @Author: minsion
 * @Date: 2022-03-03 17:56:34
 * @LastEditTime: 2022-03-25 17:34:07
 * @Description: config配置
 */
import { ChartConfig } from 'app/types/ChartConfig';

const config: ChartConfig = {
  datas: [
    {
      label: 'mixed',
      key: 'mixed',
      required: true,
      type: 'mixed',
    },
    {
      label: 'colorize',
      key: 'color',
      type: 'color',
      limit: [0, 1],
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
          default: 'inside',
          options: {
            items: [
              { label: '外侧', value: 'outside' },
              { label: '内部', value: 'inside' },
              { label: '中心', value: 'center' },
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
            color: '#ffffff',
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
