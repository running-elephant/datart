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
import { RectConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import type {
  WidgetMeta,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import {
  initAutoWidgetRect,
  initBackgroundTpl,
  initBorderTpl,
  initPaddingTpl,
  initTitleTpl,
  initWidgetEditActionTpl,
  initWidgetViewActionTpl,
  PaddingI18N,
  TitleI18N,
  WidgetEditActionI18N,
  widgetTpl,
  WidgetViewActionI18N,
} from '../../WidgetManager/utils/init';

export const widgetMeta: WidgetMeta = {
  icon: 'img',
  widgetTypeId: 'image',
  canWrapped: true,
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
        desc: 'img',
        widgetType: 'img',
        action: {
          ...WidgetViewActionI18N.zh,
          ...WidgetEditActionI18N.zh,
        },
        title: TitleI18N.zh,
        background: { backgroundGroup: '图片编辑' },
        padding: PaddingI18N.zh,

        border: { borderGroup: '边框' },
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: 'img',
        widgetType: 'img',
        action: {
          ...WidgetViewActionI18N.en,
          ...WidgetEditActionI18N.en,
        },
        title: TitleI18N.en,
        background: { backgroundGroup: 'Image Setting' },
        padding: PaddingI18N.en,

        border: { borderGroup: 'Border' },
      },
    },
  ],
};

export type ImageToolkit = WidgetToolkit & {};
export const widgetToolkit: ImageToolkit = {
  create: opt => {
    const widget = widgetTpl();
    widget.id = widgetMeta.widgetTypeId + widget.id;
    widget.parentId = opt.parentId || '';
    widget.dashboardId = opt.dashboardId || '';
    widget.datachartId = opt.datachartId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.widgetTypeId = widgetMeta.widgetTypeId;
    widget.config.type = 'media';
    if (opt.boardType === 'auto') {
      const rect: RectConfig = {
        x: 0,
        y: 0,
        width: 6,
        height: 9,
      };
      widget.config.rect = rect;
      widget.config.mRect = { ...initAutoWidgetRect() };
    } else {
      const rect: RectConfig = {
        x: 0,
        y: 0,
        width: 500,
        height: 400,
      };
      widget.config.rect = rect;
    }

    widget.config.jsonConfig.props = [
      { ...initBackgroundTpl() },
      { ...initTitleTpl() },
      { ...initPaddingTpl() },
      { ...initBorderTpl() },
    ];
    widget.config.jsonConfig.props?.forEach(ele => {
      if (ele.key === 'titleGroup') {
        ele.rows?.forEach(row => {
          if (row.key === 'title') {
            row.value = 'Image';
          }
        });
      }
      if (ele.key === 'backgroundGroup') {
        ele.rows?.forEach(row => {
          if (row.key === 'background') {
            row.value.image = '/images/example.png';
          }
        });
      }
    });

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

const imageProto = {
  widgetTypeId: widgetMeta.widgetTypeId,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default imageProto;
