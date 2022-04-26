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
import { APP_CURRENT_VERSION } from 'app/migration/constants';
import { DashboardConfig } from '../types/boardTypes';

export const initFreeBoardConfig = () => {
  const config: DashboardConfig = {
    type: 'auto',
    version: APP_CURRENT_VERSION,
    maxWidgetIndex: 0,
    jsonConfig: {
      props: [
        {
          label: 'basic',
          key: 'basic',
          comType: 'group',
          rows: [
            {
              label: 'basic.initialQuery',
              key: 'initialQuery',
              default: true,
              comType: 'switch',
            },
            {
              label: 'basic.scaleMode',
              key: 'scaleMode',
              default: 'single',
              comType: 'select',
              options: {
                items: [
                  { label: 'basic.scaleMode.scaleWidth', value: 'scaleWidth' },
                  {
                    label: 'basic.scaleMode.scaleHeight',
                    value: 'scaleHeight',
                  },
                  { label: 'basic.scaleMode.scaleFull', value: 'scaleFull' },
                  { label: 'basic.scaleMode.noScale', value: 'noScale' },
                ],
              },
            },
          ],
        },

        {
          label: 'size',
          key: 'size',
          comType: 'group',
          rows: [
            {
              label: 'size.width',
              key: 'width',
              default: 1920,
              comType: 'inputNumber',
            },
            {
              label: 'size.height',
              key: 'height',
              default: 1080,
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'background',
          key: 'background',
          comType: 'group',
          rows: [
            {
              label: 'background.color',
              key: 'color',
              default: '#fff', // TODO 根据当前主题色配置
              comType: 'fontColor',
            },
            {
              label: 'background.url',
              key: 'url',
              default: '',
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'background',
          key: 'background',
          comType: 'group',
          rows: [
            {
              label: 'background.color',
              key: 'color',
              default: '#fff', // TODO 根据当前主题色配置
              comType: 'fontColor',
            },
            {
              label: 'background.url',
              key: 'url',
              default: '',
              comType: 'inputNumber',
            },
          ],
        },
      ],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            basic: {
              initialQuery: '开启初始化查询',
            },
            space: {
              paddingTB: '上下间距',
              paddingLR: '左右间距',
              marginTB: '上下边距',
              marginLR: '左右边距',
            },
            background: {
              color: '背景颜色',
              url: '背景图片',
            },
          },
        },
        {
          lang: 'en-US',
          translation: {
            basic: {
              initialQuery: 'Open Init Query',
            },
            space: {
              paddingTB: 'Padding TB',
              paddingLR: 'Padding LR',
              marginTB: 'Margin TB',
              marginLR: 'Margin LR',
            },
            background: {
              color: 'Background Color',
              url: 'Background Image',
            },
          },
        },
      ],
    },
  };
  return config;
};
