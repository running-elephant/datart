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
import { ORIGINAL_TYPE_MAP } from 'app/pages/DashBoardPage/constants';
import { TabWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import type {
  WidgetActionListItem,
  widgetActionType,
  WidgetMeta,
  WidgetProto,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { uuidv4 } from 'utils/utils';
import {
  initAutoWidgetRect,
  initBackgroundTpl,
  initBorderTpl,
  initFreeWidgetRect,
  initPaddingTpl,
  initTitleTpl,
  initWidgetEditActionTpl,
  initWidgetName,
  initWidgetViewActionTpl,
  LoopFetchI18N,
  PaddingI18N,
  TitleI18N,
  WidgetEditActionI18N,
  widgetTpl,
  WidgetViewActionI18N,
} from '../../WidgetManager/utils/init';

const NameI18N = {
  zh: '标签卡',
  en: 'Tab',
};
export const widgetMeta: WidgetMeta = {
  icon: '<svg t="1653390161807" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18605" width="200" height="200"><path d="M122.368 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384h-778.24c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872z m-32.768 684.544c0 26.112 20.992 47.104 47.104 47.104h750.08c26.112 0 47.104-20.992 47.104-47.104V162.304c0-26.112-20.992-47.104-47.104-47.104H136.704c-26.112 0-47.104 20.992-47.104 47.104v688.128z" p-id="18606"></path><path d="M397.824 393.728H319.488v257.536H266.24V393.728H184.832v-48.64h212.992v48.64zM606.72 651.264h-51.712c-5.12-6.144-8.192-13.824-10.24-23.552-12.8 19.968-32.256 29.184-57.856 28.16-43.52-1.024-65.536-22.528-66.56-65.024 1.024-43.52 24.576-69.12 71.168-76.8 21.504-3.072 37.376-7.168 47.616-13.312-1.024-22.528-11.776-34.304-32.768-35.328-19.968 0-32.768 12.8-38.4 38.4l-47.616-13.312c13.824-48.128 42.496-72.704 86.016-72.704 53.248 1.024 80.384 33.792 81.408 97.792v76.8c0.512 24.064 7.168 44.032 18.944 58.88z m-66.56-91.648v-13.312c-7.68 6.144-20.992 10.752-39.936 14.848-22.528 4.096-33.792 13.312-32.768 28.16 1.024 13.824 9.728 20.992 26.624 22.016 28.672-2.048 44.032-19.456 46.08-51.712zM689.664 651.264h-51.712V344.576h51.712v97.792c15.872-15.872 33.28-23.552 53.248-23.552 59.392 3.072 89.6 44.032 91.648 122.88-1.024 75.776-31.232 114.176-90.112 114.176-25.6 1.024-44.032-7.168-54.784-23.552v18.944z m0-129.024v28.16c0 42.496 15.36 62.976 46.08 61.952 31.744 0 47.616-23.552 47.616-71.168 0-51.2-15.872-75.776-47.616-74.24-29.696 2.56-45.056 20.992-46.08 55.296z" p-id="18607"></path></svg>',
  originalType: ORIGINAL_TYPE_MAP.tab,
  canWrapped: false,
  controllable: false,
  linkable: false,
  canFullScreen: true,
  singleton: false,
  viewAction: {
    ...initWidgetViewActionTpl(),
  },
  editAction: {
    ...initWidgetEditActionTpl(),
  },
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        desc: '标签卡 容器组件可以切换',
        widgetName: NameI18N.zh,
        action: {
          ...WidgetViewActionI18N.zh,
          ...WidgetEditActionI18N.zh,
        },
        title: TitleI18N.zh,
        background: { backgroundGroup: '背景' },
        padding: PaddingI18N.zh,
        loopFetch: LoopFetchI18N.zh,
        border: { borderGroup: '边框' },
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: 'Tab container',
        widgetName: NameI18N.en,
        action: {
          ...WidgetViewActionI18N.en,
          ...WidgetEditActionI18N.en,
        },
        title: TitleI18N.en,
        background: { backgroundGroup: 'Background' },
        padding: PaddingI18N.en,
        loopFetch: LoopFetchI18N.en,
        border: { borderGroup: 'Border' },
      },
    },
  ],
};

export type TabToolkit = WidgetToolkit & {};
export const widgetToolkit: TabToolkit = {
  create: opt => {
    const widget = widgetTpl();
    widget.parentId = opt.parentId || '';
    widget.datachartId = opt.datachartId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.originalType = widgetMeta.originalType;
    widget.config.type = 'container';
    widget.config.name = opt.name || '';

    widget.config.rect = { ...initFreeWidgetRect() };
    widget.config.pRect = { ...initAutoWidgetRect() };
    widget.config.mRect = undefined;

    widget.config.customConfig.props = [
      { ...initTitleTpl() },
      { ...initPaddingTpl() },
      { ...initBackgroundTpl('#fff') },
      { ...initBorderTpl() },
    ];

    const newTabId = `tab_${uuidv4()}`;
    const content: TabWidgetContent = {
      itemMap: {
        [newTabId]: {
          index: Date.now(),
          tabId: newTabId,
          name: 'tab',
          childWidgetId: '',
        },
      },
    };
    widget.config.content = content;
    return widget;
  },
  getName(key) {
    return initWidgetName(NameI18N, key);
  },
  getDropDownList(...arg) {
    const list: WidgetActionListItem<widgetActionType>[] = [
      {
        key: 'edit',
        renderMode: ['edit'],
      },
      {
        key: 'delete',
        renderMode: ['edit'],
      },
      {
        key: 'lock',
        renderMode: ['edit'],
      },
      {
        key: 'group',
        renderMode: ['edit'],
      },
    ];
    return list;
  },
  edit() {},
  save() {},
  // lock() {},
  // unlock() {},
  // copy() {},
  // paste() {},
  // delete() {},
  // changeTitle() {},
  // getMeta() {},
  // getWidgetName() {},
  // //
};
// {
//     "content": {
//         "type": "tab",
//         "itemMap": {
//             "e0b91da7-8f66-4fa5-bcc3-d66806b5d29f": {
//                 'index': 0,
//                 "tabId": "e0b91da7-8f66-4fa5-bcc3-d66806b5d29f",
//                 "name": "时间筛选",
//                 "childWidgetId": "newWidget_54b6abfc-b71d-423c-8c0d-d3641ff45b61",
//             },
//             "d93cb3dd-0c15-4568-97e5-aaafe85e3f17": {
//                 'index': 1,
//                 "tabId": "d93cb3dd-0c15-4568-97e5-aaafe85e3f17",
//                 "name": "图片_14",
//                 "childWidgetId": "newWidget_a2bc9c3c-22ef-4bbd-8345-3b2e8567d986",
//             },
//             "eac42b77-41be-4389-be43-202b70c4c2fd": {
//                 'index': 2,
//                 "tabId": "eac42b77-41be-4389-be43-202b70c4c2fd",
//                 "name": "iframe_17",
//                 "childWidgetId": "newWidget_3ceb5e04-f3d4-4dea-8675-680f5b7c8201",
//             }
//         },
//         "tabConfig": {}
//     }
// }
const tabProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default tabProto;
