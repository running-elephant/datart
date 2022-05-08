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
import { TabWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import type {
  WidgetMeta,
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
  initWidgetViewActionTpl,
  LoopFetchI18N,
  PaddingI18N,
  TitleI18N,
  WidgetEditActionI18N,
  widgetTpl,
  WidgetViewActionI18N,
} from '../../WidgetManager/utils/init';

export const widgetMeta: WidgetMeta = {
  icon: '',
  widgetTypeId: 'tab',
  canWrapped: false,
  controllable: false,
  linkable: false,
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
        widgetType: '标签卡',
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
        widgetType: 'Tab',
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
    widget.dashboardId = opt.dashboardId || '';
    widget.datachartId = opt.datachartId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.widgetTypeId = widgetMeta.widgetTypeId;
    widget.config.type = 'container';
    if (opt.boardType === 'auto') {
      widget.config.rect = { ...initAutoWidgetRect() };
      widget.config.mRect = { ...initAutoWidgetRect() };
    } else {
      widget.config.rect = { ...initFreeWidgetRect() };
    }

    widget.config.jsonConfig.props = [
      { ...initTitleTpl() },
      { ...initPaddingTpl() },
      { ...initBackgroundTpl() },
      { ...initBorderTpl() },
    ];
    widget.config.jsonConfig.props?.forEach(ele => {
      if (ele.key === 'titleGroup') {
        ele.rows?.forEach(row => {
          if (row.key === 'title') {
            row.value = 'Tab';
          }
        });
      }
    });
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
const tabProto = {
  widgetTypeId: widgetMeta.widgetTypeId,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default tabProto;
