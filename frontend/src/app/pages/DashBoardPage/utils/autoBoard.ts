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

export const initAutoBoardConfig = () => {
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
          ],
        },
        {
          label: 'space',
          key: 'space',
          comType: 'group',
          rows: [
            {
              label: 'space.paddingTB',
              key: 'paddingTB',
              default: 8,
              comType: 'inputNumber',
            },
            {
              label: 'space.paddingLR',
              key: 'paddingLR',
              default: 8,
              comType: 'inputNumber',
            },
            {
              label: 'space.marginTB',
              key: 'marginTB',
              default: 8,
              comType: 'inputNumber',
            },
            {
              label: 'space.marginLR',
              key: 'marginLR',
              default: 8,
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
              comType: 'input',
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
