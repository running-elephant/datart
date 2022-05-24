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
  zh: '重置按钮',
  en: 'ResetBtn',
};
export const widgetMeta: WidgetMeta = {
  icon: '<svg t="1653390558283" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10589" width="200" height="200"><path d="M591.963942 6.17051C409.548578-22.304204 233.4705 49.707042 121.688176 182.211672l-3.617789-81.387966a59.065957 59.065957 0 0 0-61.625482-56.4326A59.065957 59.065957 0 0 0 0.061527 106.016588l9.610523 216.365983a59.065957 59.065957 0 0 0 61.625482 56.383378l216.365983-9.610524a59.065957 59.065957 0 0 0 56.346462-61.613176 59.065957 59.065957 0 0 0-61.588566-56.420294l-66.793752 2.965603c84.242821-97.05275 213.941818-150.445914 349.067499-132.52924 227.908456 30.234387 382.341322 250.279687 333.193524 474.853376-45.160846 206.373992-246.243513 341.290482-455.607719 302.909915a393.071637 393.071637 0 0 1-278.680568-206.263243 58.942903 58.942903 0 0 0-78.237782-25.533721 59.065957 59.065957 0 0 0-26.395099 80.428145c70.411543 135.359484 200.319732 237.925057 362.012788 267.568784 274.287537 50.218369 537.561734-128.210043 593.600561-399.901138C1073.536071 329.765815 880.34117 51.183691 591.963942 6.17051z" p-id="10590"></path></svg>',
  originalType: ORIGINAL_TYPE_MAP.resetBtn,
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
        desc: '重置按钮',
        widgetName: '重置',
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
        desc: 'resetBtn',
        widgetName: 'reset',
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
    widget.config.type = 'button';
    widget.config.name = opt.name || '';
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
      { ...initBackgroundTpl('#fff') },
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

const resetBtnProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default resetBtnProto;
