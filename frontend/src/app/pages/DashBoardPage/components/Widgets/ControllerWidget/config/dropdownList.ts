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
import {
  WidgetMeta,
  WidgetProto,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { controlWidgetTpl, getControlDropDownList } from '.';
import {
  ImmediateQueryI18N,
  initBackgroundTpl,
  initBorderTpl,
  initLoopFetchTpl,
  initPaddingTpl,
  initWidgetEditActionTpl,
  initWidgetName,
  initWidgetViewActionTpl,
  LoopFetchI18N,
  PaddingI18N,
  TitleI18N,
  WidgetEditActionI18N,
  WidgetViewActionI18N,
} from '../../../WidgetManager/utils/init';
const NameI18N = {
  zh: '下拉列表',
  en: 'DropdownList',
};
export const widgetMeta: WidgetMeta = {
  icon: '<svg t="1653390315565" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3989" width="200" height="200"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32z m-40 728H184V184h656v656zM340 683v77c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-77c-10.1 3.3-20.8 5-32 5s-21.9-1.8-32-5z m64-198V264c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v221c10.1-3.3 20.8-5 32-5s21.9 1.8 32 5z m-64 198c10.1 3.3 20.8 5 32 5s21.9-1.8 32-5c41.8-13.5 72-52.7 72-99s-30.2-85.5-72-99c-10.1-3.3-20.8-5-32-5s-21.9 1.8-32 5c-41.8 13.5-72 52.7-72 99s30.2 85.5 72 99z m0.1-115.7c0.3-0.6 0.7-1.2 1-1.8v-0.1l1.2-1.8c0.1-0.2 0.2-0.3 0.3-0.5 0.3-0.5 0.7-0.9 1-1.4 0.1-0.1 0.2-0.3 0.3-0.4 0.5-0.6 0.9-1.1 1.4-1.6l0.3-0.3 1.2-1.2 0.4-0.4c0.5-0.5 1-0.9 1.6-1.4 0.6-0.5 1.1-0.9 1.7-1.3 0.2-0.1 0.3-0.2 0.5-0.3 0.5-0.3 0.9-0.7 1.4-1 0.1-0.1 0.3-0.2 0.4-0.3 0.6-0.4 1.2-0.7 1.9-1.1 0.1-0.1 0.3-0.1 0.4-0.2 0.5-0.3 1-0.5 1.6-0.8l0.6-0.3c0.7-0.3 1.3-0.6 2-0.8 0.7-0.3 1.4-0.5 2.1-0.7 0.2-0.1 0.4-0.1 0.6-0.2 0.6-0.2 1.1-0.3 1.7-0.4 0.2 0 0.3-0.1 0.5-0.1 0.7-0.2 1.5-0.3 2.2-0.4 0.2 0 0.3 0 0.5-0.1 0.6-0.1 1.2-0.1 1.8-0.2h0.6c0.8 0 1.5-0.1 2.3-0.1s1.5 0 2.3 0.1h0.6c0.6 0 1.2 0.1 1.8 0.2 0.2 0 0.3 0 0.5 0.1 0.7 0.1 1.5 0.2 2.2 0.4 0.2 0 0.3 0.1 0.5 0.1 0.6 0.1 1.2 0.3 1.7 0.4 0.2 0.1 0.4 0.1 0.6 0.2 0.7 0.2 1.4 0.4 2.1 0.7 0.7 0.2 1.3 0.5 2 0.8l0.6 0.3c0.5 0.2 1.1 0.5 1.6 0.8 0.1 0.1 0.3 0.1 0.4 0.2 0.6 0.3 1.3 0.7 1.9 1.1 0.1 0.1 0.3 0.2 0.4 0.3 0.5 0.3 1 0.6 1.4 1 0.2 0.1 0.3 0.2 0.5 0.3 0.6 0.4 1.2 0.9 1.7 1.3s1.1 0.9 1.6 1.4l0.4 0.4 1.2 1.2 0.3 0.3c0.5 0.5 1 1.1 1.4 1.6 0.1 0.1 0.2 0.3 0.3 0.4 0.4 0.4 0.7 0.9 1 1.4 0.1 0.2 0.2 0.3 0.3 0.5l1.2 1.8s0 0.1 0.1 0.1c0.4 0.6 0.7 1.2 1 1.8 2.6 5 4.1 10.7 4.1 16.7s-1.5 11.7-4.1 16.7c-0.3 0.6-0.7 1.2-1 1.8 0 0 0 0.1-0.1 0.1l-1.2 1.8c-0.1 0.2-0.2 0.3-0.3 0.5-0.3 0.5-0.7 0.9-1 1.4-0.1 0.1-0.2 0.3-0.3 0.4-0.5 0.6-0.9 1.1-1.4 1.6l-0.3 0.3-1.2 1.2-0.4 0.4c-0.5 0.5-1 0.9-1.6 1.4-0.6 0.5-1.1 0.9-1.7 1.3-0.2 0.1-0.3 0.2-0.5 0.3-0.5 0.3-0.9 0.7-1.4 1-0.1 0.1-0.3 0.2-0.4 0.3-0.6 0.4-1.2 0.7-1.9 1.1-0.1 0.1-0.3 0.1-0.4 0.2-0.5 0.3-1 0.5-1.6 0.8l-0.6 0.3c-0.7 0.3-1.3 0.6-2 0.8-0.7 0.3-1.4 0.5-2.1 0.7-0.2 0.1-0.4 0.1-0.6 0.2-0.6 0.2-1.1 0.3-1.7 0.4-0.2 0-0.3 0.1-0.5 0.1-0.7 0.2-1.5 0.3-2.2 0.4-0.2 0-0.3 0-0.5 0.1-0.6 0.1-1.2 0.1-1.8 0.2h-0.6c-0.8 0-1.5 0.1-2.3 0.1s-1.5 0-2.3-0.1h-0.6c-0.6 0-1.2-0.1-1.8-0.2-0.2 0-0.3 0-0.5-0.1-0.7-0.1-1.5-0.2-2.2-0.4-0.2 0-0.3-0.1-0.5-0.1-0.6-0.1-1.2-0.3-1.7-0.4-0.2-0.1-0.4-0.1-0.6-0.2-0.7-0.2-1.4-0.4-2.1-0.7-0.7-0.2-1.3-0.5-2-0.8l-0.6-0.3c-0.5-0.2-1.1-0.5-1.6-0.8-0.1-0.1-0.3-0.1-0.4-0.2-0.6-0.3-1.3-0.7-1.9-1.1-0.1-0.1-0.3-0.2-0.4-0.3-0.5-0.3-1-0.6-1.4-1-0.2-0.1-0.3-0.2-0.5-0.3-0.6-0.4-1.2-0.9-1.7-1.3s-1.1-0.9-1.6-1.4l-0.4-0.4-1.2-1.2-0.3-0.3c-0.5-0.5-1-1.1-1.4-1.6-0.1-0.1-0.2-0.3-0.3-0.4-0.4-0.4-0.7-0.9-1-1.4-0.1-0.2-0.2-0.3-0.3-0.5l-1.2-1.8v-0.1c-0.4-0.6-0.7-1.2-1-1.8-2.6-5-4.1-10.7-4.1-16.7s1.5-11.7 4.1-16.7zM620 539v221c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V539c-10.1 3.3-20.8 5-32 5s-21.9-1.8-32-5z m64-198v-77c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v77c10.1-3.3 20.8-5 32-5s21.9 1.8 32 5z m-64 198c10.1 3.3 20.8 5 32 5s21.9-1.8 32-5c41.8-13.5 72-52.7 72-99s-30.2-85.5-72-99c-10.1-3.3-20.8-5-32-5s-21.9 1.8-32 5c-41.8 13.5-72 52.7-72 99s30.2 85.5 72 99z m0.1-115.7c0.3-0.6 0.7-1.2 1-1.8v-0.1l1.2-1.8c0.1-0.2 0.2-0.3 0.3-0.5 0.3-0.5 0.7-0.9 1-1.4 0.1-0.1 0.2-0.3 0.3-0.4 0.5-0.6 0.9-1.1 1.4-1.6l0.3-0.3 1.2-1.2 0.4-0.4c0.5-0.5 1-0.9 1.6-1.4 0.6-0.5 1.1-0.9 1.7-1.3 0.2-0.1 0.3-0.2 0.5-0.3 0.5-0.3 0.9-0.7 1.4-1 0.1-0.1 0.3-0.2 0.4-0.3 0.6-0.4 1.2-0.7 1.9-1.1 0.1-0.1 0.3-0.1 0.4-0.2 0.5-0.3 1-0.5 1.6-0.8l0.6-0.3c0.7-0.3 1.3-0.6 2-0.8 0.7-0.3 1.4-0.5 2.1-0.7 0.2-0.1 0.4-0.1 0.6-0.2 0.6-0.2 1.1-0.3 1.7-0.4 0.2 0 0.3-0.1 0.5-0.1 0.7-0.2 1.5-0.3 2.2-0.4 0.2 0 0.3 0 0.5-0.1 0.6-0.1 1.2-0.1 1.8-0.2h0.6c0.8 0 1.5-0.1 2.3-0.1s1.5 0 2.3 0.1h0.6c0.6 0 1.2 0.1 1.8 0.2 0.2 0 0.3 0 0.5 0.1 0.7 0.1 1.5 0.2 2.2 0.4 0.2 0 0.3 0.1 0.5 0.1 0.6 0.1 1.2 0.3 1.7 0.4 0.2 0.1 0.4 0.1 0.6 0.2 0.7 0.2 1.4 0.4 2.1 0.7 0.7 0.2 1.3 0.5 2 0.8l0.6 0.3c0.5 0.2 1.1 0.5 1.6 0.8 0.1 0.1 0.3 0.1 0.4 0.2 0.6 0.3 1.3 0.7 1.9 1.1 0.1 0.1 0.3 0.2 0.4 0.3 0.5 0.3 1 0.6 1.4 1 0.2 0.1 0.3 0.2 0.5 0.3 0.6 0.4 1.2 0.9 1.7 1.3s1.1 0.9 1.6 1.4l0.4 0.4 1.2 1.2 0.3 0.3c0.5 0.5 1 1.1 1.4 1.6 0.1 0.1 0.2 0.3 0.3 0.4 0.4 0.4 0.7 0.9 1 1.4 0.1 0.2 0.2 0.3 0.3 0.5l1.2 1.8v0.1c0.4 0.6 0.7 1.2 1 1.8 2.6 5 4.1 10.7 4.1 16.7s-1.5 11.7-4.1 16.7c-0.3 0.6-0.7 1.2-1 1.8v0.1l-1.2 1.8c-0.1 0.2-0.2 0.3-0.3 0.5-0.3 0.5-0.7 0.9-1 1.4-0.1 0.1-0.2 0.3-0.3 0.4-0.5 0.6-0.9 1.1-1.4 1.6l-0.3 0.3-1.2 1.2-0.4 0.4c-0.5 0.5-1 0.9-1.6 1.4-0.6 0.5-1.1 0.9-1.7 1.3-0.2 0.1-0.3 0.2-0.5 0.3-0.5 0.3-0.9 0.7-1.4 1-0.1 0.1-0.3 0.2-0.4 0.3-0.6 0.4-1.2 0.7-1.9 1.1-0.1 0.1-0.3 0.1-0.4 0.2-0.5 0.3-1 0.5-1.6 0.8l-0.6 0.3c-0.7 0.3-1.3 0.6-2 0.8-0.7 0.3-1.4 0.5-2.1 0.7-0.2 0.1-0.4 0.1-0.6 0.2-0.6 0.2-1.1 0.3-1.7 0.4-0.2 0-0.3 0.1-0.5 0.1-0.7 0.2-1.5 0.3-2.2 0.4-0.2 0-0.3 0-0.5 0.1-0.6 0.1-1.2 0.1-1.8 0.2h-0.6c-0.8 0-1.5 0.1-2.3 0.1s-1.5 0-2.3-0.1h-0.6c-0.6 0-1.2-0.1-1.8-0.2-0.2 0-0.3 0-0.5-0.1-0.7-0.1-1.5-0.2-2.2-0.4-0.2 0-0.3-0.1-0.5-0.1-0.6-0.1-1.2-0.3-1.7-0.4-0.2-0.1-0.4-0.1-0.6-0.2-0.7-0.2-1.4-0.4-2.1-0.7-0.7-0.2-1.3-0.5-2-0.8l-0.6-0.3c-0.5-0.2-1.1-0.5-1.6-0.8-0.1-0.1-0.3-0.1-0.4-0.2-0.6-0.3-1.3-0.7-1.9-1.1-0.1-0.1-0.3-0.2-0.4-0.3-0.5-0.3-1-0.6-1.4-1-0.2-0.1-0.3-0.2-0.5-0.3-0.6-0.4-1.2-0.9-1.7-1.3s-1.1-0.9-1.6-1.4l-0.4-0.4-1.2-1.2-0.3-0.3c-0.5-0.5-1-1.1-1.4-1.6-0.1-0.1-0.2-0.3-0.3-0.4-0.4-0.4-0.7-0.9-1-1.4-0.1-0.2-0.2-0.3-0.3-0.5l-1.2-1.8v-0.1c-0.4-0.6-0.7-1.2-1-1.8-2.6-5-4.1-10.7-4.1-16.7s1.5-11.7 4.1-16.7z" p-id="3990"></path></svg>',
  originalType: ORIGINAL_TYPE_MAP.dropdownList,
  canWrapped: true,
  canFullScreen: false,
  controllable: true,
  linkable: false,
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
        desc: NameI18N.zh,
        widgetName: NameI18N.zh,
        action: {
          ...WidgetViewActionI18N.zh,
          ...WidgetEditActionI18N.zh,
        },
        title: TitleI18N.zh,
        immediateQuery: ImmediateQueryI18N.zh,
        background: { backgroundGroup: '背景' },
        padding: PaddingI18N.zh,
        loopFetch: LoopFetchI18N.zh,
        border: { borderGroup: '边框' },
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: 'dropdownList',
        widgetName: NameI18N.en,
        action: {
          ...WidgetViewActionI18N.en,
          ...WidgetEditActionI18N.en,
        },
        title: TitleI18N.en,
        immediateQuery: ImmediateQueryI18N.en,
        background: { backgroundGroup: 'Background' },
        padding: PaddingI18N.en,
        loopFetch: LoopFetchI18N.en,
        border: { borderGroup: 'Border' },
      },
    },
  ],
};

export const widgetToolkit: WidgetToolkit = {
  create: opt => {
    const widget = controlWidgetTpl(opt);
    widget.id = widgetMeta.originalType + widget.id;
    widget.config.originalType = widgetMeta.originalType;

    const addProps = [
      { ...initBackgroundTpl('#fff') },
      { ...initPaddingTpl() },
      { ...initBorderTpl() },
      { ...initLoopFetchTpl() },
    ];
    widget.config.customConfig.props?.forEach(ele => {
      if (ele.key === 'titleGroup') {
        ele.rows?.forEach(row => {
          if (row.key === 'showTitle') {
            row.value = true;
          }
        });
      }
    });
    widget.config.customConfig.props =
      widget.config.customConfig.props?.concat(addProps);
    return widget;
  },
  getName(key) {
    return initWidgetName(NameI18N, key);
  },
  getDropDownList(...arg) {
    return getControlDropDownList(true);
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

const dropdownListProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default dropdownListProto;
