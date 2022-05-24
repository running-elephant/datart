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
import { RectConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import type {
  WidgetActionListItem,
  widgetActionType,
  WidgetMeta,
  WidgetProto,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { PRIMARY } from 'styles/StyleConstants';
import {
  initBackgroundTpl,
  initBorderTpl,
  initPaddingTpl,
  initTitleTpl,
  initWidgetEditActionTpl,
  initWidgetName,
  initWidgetViewActionTpl,
  PaddingI18N,
  TitleI18N,
  WidgetEditActionI18N,
  widgetTpl,
  WidgetViewActionI18N,
} from '../../WidgetManager/utils/init';

const NameI18N = {
  zh: '查询按钮',
  en: 'queryBtn',
};
export const widgetMeta: WidgetMeta = {
  icon: '<svg t="1653390502781" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9781" width="200" height="200"><path d="M674.8 744.3c-49.4 34.6-107.1 51.9-166.1 51.1-7.8-0.1-15.6-0.5-23.2-1.2-3.1-0.3-6.3-0.8-9.4-1.2-6-0.8-12-1.6-17.9-2.8-3.6-0.7-7.2-1.6-10.7-2.5-5.7-1.3-11.5-2.7-17.1-4.4-2.7-0.8-5.3-1.8-8-2.7-6.5-2.2-12.9-4.4-19.2-7l-4.2-1.9c-7.3-3.2-14.6-6.6-21.6-10.4l-0.9-0.5c-23.8-13-45.5-29.3-64.5-48.3l-0.9-1c-5.9-6-11.6-12.1-16.9-18.6l-3.3-4.3c-38.8-48.5-62.2-110-62.2-176.8h74.7L183.5 332.7 64 511.9h74.7c0 78.5 24.5 151.4 66.1 211.6l1.4 2.6c4.3 6.2 9.1 11.8 13.7 17.7l5.1 6.6c6.8 8.3 14 16 21.5 23.6l2.1 2.2c25 25 53.2 46.1 83.9 62.9l2.5 1.4c8.9 4.8 17.9 9.1 27.2 13.1l6.8 3.1c7.9 3.3 16 6.1 24.2 8.8 3.8 1.3 7.7 2.7 11.6 3.9 7.1 2.1 14.4 3.9 21.8 5.6 4.9 1.1 9.7 2.4 14.7 3.3l6 1.4c6.9 1.2 13.9 1.9 20.8 2.7l7.5 1c12.4 1.2 24.9 2 37.3 2 75.9 0 149.9-23.2 213.5-67.7 20.3-14.2 25.2-42.1 11-62.4-14.4-20.3-42.4-25.2-62.6-11zM885.4 511.9c0-78.3-24.4-151-65.8-211.1l-1.7-3c-5.1-7.3-10.8-14.2-16.3-21.1l-2-2.5c-37.9-46-85.5-81.5-139.3-104.7l-4.4-2c-8.6-3.6-17.4-6.7-26.3-9.6-3.2-1.1-6.3-2.2-9.6-3.2-7.7-2.3-15.6-4.2-23.5-6-4.4-1-8.7-2.1-13.2-3l-6.4-1.4c-5.9-1-11.8-1.5-17.7-2.2-4.1-0.5-8.1-1.2-12.2-1.6-9.9-0.9-19.8-1.3-29.6-1.5l-5.3-0.3-1 0.1c-75.8 0.1-149.7 22.9-213.2 67.4-20.3 14.2-25.2 42.1-11 62.4 14.2 20.3 42.1 25.2 62.4 11 49-34.3 106.2-51.7 164.8-51.2 8.4 0.1 16.7 0.5 24.9 1.3l7.5 1c6.7 0.8 13.4 1.8 20 3.1 2.9 0.6 5.8 1.3 8.6 2 6.5 1.5 12.9 3 19.2 4.9l6 2c7.2 2.4 14.3 4.9 21.3 7.8l2.1 0.9c41.7 18 78.4 45.6 106.9 80.2l0.5 0.7c40.2 49 64.4 111.6 64.5 179.7h-74.7l119.5 179.2L960 511.9h-74.6z" p-id="9782"></path></svg>',
  originalType: ORIGINAL_TYPE_MAP.queryBtn,
  canWrapped: true,
  controllable: false,
  linkable: false,
  canFullScreen: false,
  singleton: true,
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
        desc: '查询按钮',
        widgetName: NameI18N.zh,
        action: {
          ...WidgetViewActionI18N.zh,
          ...WidgetEditActionI18N.zh,
        },
        title: TitleI18N.zh,
        background: { backgroundGroup: '背景' },
        padding: PaddingI18N.zh,

        border: { borderGroup: '边框' },
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: 'queryBtn',
        widgetName: NameI18N.en,
        action: {
          ...WidgetViewActionI18N.en,
          ...WidgetEditActionI18N.en,
        },
        title: TitleI18N.en,
        background: { backgroundGroup: 'Background' },
        padding: PaddingI18N.en,

        border: { borderGroup: 'Border' },
      },
    },
  ],
};

export const widgetToolkit: WidgetToolkit = {
  create: opt => {
    const widget = widgetTpl();
    widget.id = widgetMeta.originalType + widget.id;
    widget.parentId = opt.parentId || '';
    widget.datachartId = opt.datachartId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.originalType = widgetMeta.originalType;
    widget.config.name = opt.name || '';
    widget.config.type = 'button';
    if (opt.boardType === 'auto') {
      const rect: RectConfig = {
        x: 0,
        y: 0,
        width: 2,
        height: 1,
      };
      widget.config.rect = rect;
      widget.config.mRect = rect;
    } else {
      const rect: RectConfig = {
        x: 0,
        y: 0,
        width: 128,
        height: 32,
      };
      widget.config.rect = rect;
    }

    widget.config.customConfig.props = [
      { ...initTitleTpl() },
      { ...initPaddingTpl() },
      { ...initBorderTpl() },
      { ...initBackgroundTpl(PRIMARY) },
    ];

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

const queryBtnProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default queryBtnProto;
