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
      label: 'metrics',
      key: 'metrics',
      required: true,
      type: 'aggregate',
      limit: [1, 3],
      actions: {
        NUMERIC: ['aggregate', 'format'],
        STRING: ['aggregate', 'format'],
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
      label: 'score.headerTitle',
      key: 'header',
      comType: 'group',
      rows: [
        {
          label: 'score.show',
          key: 'show',
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
            color: 'black',
          },
        },
        {
          label: 'score.prefixText',
          key: 'prefixText',
          comType: 'input',
        },
        {
          label: 'score.prefxFont',
          key: 'prefxFont',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: 'black',
          },
        },
        {
          label: 'score.suffixText',
          key: 'suffixText',
          comType: 'input',
        },
        {
          label: 'score.suffixFont',
          key: 'suffixFont',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: 'black',
          },
        },
      ],
    },
    {
      label: 'score.bodyTitle',
      key: 'body',
      comType: 'group',
      rows: [
        {
          label: 'score.show',
          key: 'show',
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
            color: 'black',
          },
        },
        {
          label: 'score.prefixText',
          key: 'prefixText',
          comType: 'input',
        },
        {
          label: 'score.prefxFont',
          key: 'prefxFont',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: 'black',
          },
        },
        {
          label: 'score.suffixText',
          key: 'suffixText',
          comType: 'input',
        },
        {
          label: 'score.suffixFont',
          key: 'suffixFont',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: 'black',
          },
        },
      ],
    },
    {
      label: 'score.footerTitle',
      key: 'footer',
      comType: 'group',
      rows: [
        {
          label: 'score.show',
          key: 'show',
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
            color: 'black',
          },
        },
        {
          label: 'score.prefixText',
          key: 'prefixText',
          comType: 'input',
        },
        {
          label: 'score.prefxFont',
          key: 'prefxFont',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: 'black',
          },
        },
        {
          label: 'score.suffixText',
          key: 'suffixText',
          comType: 'input',
        },
        {
          label: 'score.suffixFont',
          key: 'suffixFont',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: 'black',
          },
        },
      ],
    },
    {
      label: 'score.common',
      key: 'common',
      comType: 'group',
      rows: [
        {
          label: 'score.isFixedFontSize',
          key: 'isFixedFontSize',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'score.headerFontSize',
          key: 'headerFontSize',
          default: 24,
          comType: 'inputNumber',
        },
        {
          label: 'score.bodyFontSize',
          key: 'bodyFontSize',
          default: 48,
          comType: 'inputNumber',
        },
        {
          label: 'score.footerFontSize',
          key: 'footerFontSize',
          default: 24,
          comType: 'inputNumber',
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        score: {
          headerTitle: '头部配置',
          bodyTitle: '主体配置',
          footerTitle: '尾部配置',
          show: '显示',
          prefixText: '前缀文字',
          suffixText: '后缀文字',
          prefxFont: '前缀字体',
          suffixFont: '后缀字体',
          common: '整体',
          isFixedFontSize: '开启固定字体大小',
          headerFontSize: '头部字体大小',
          bodyFontSize: '主体字体大小',
          footerFontSize: '尾部字体大小',
        },
      },
    },
  ],
};

export default config;
