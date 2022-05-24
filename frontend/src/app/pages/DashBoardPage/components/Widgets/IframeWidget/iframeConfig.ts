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
import type {
  WidgetActionListItem,
  widgetActionType,
  WidgetMeta,
  WidgetProto,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { getJsonConfigs } from 'app/pages/DashBoardPage/utils';
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
  PaddingI18N,
  TitleI18N,
  WidgetEditActionI18N,
  widgetTpl,
  WidgetViewActionI18N,
} from '../../WidgetManager/utils/init';

const initIframeTpl = () => {
  return {
    label: 'iframe.iframeGroup',
    key: 'iframeGroup',
    comType: 'group',
    rows: [
      {
        label: 'iframe.src',
        key: 'src',
        value: '/login', //https://www.oschina.net/p/datart, http://www.retech.cc/product/datart
        comType: 'input',
      },
    ],
  };
};
const iframeI18N = {
  zh: {
    iframeGroup: '嵌入页配置',
    src: '嵌入地址', //资源？
  },
  en: {
    iframeGroup: 'Iframe Config',
    src: 'URL', // Source?
  },
};
const NameI18N = {
  zh: '嵌入页',
  en: 'Embed',
};
export const widgetMeta: WidgetMeta = {
  icon: '<svg t="1653391247756" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18980" width="200" height="200"><path d="M0 160v704c0 35.3 28.7 64 64 64h896c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64z m944 704H80c-8.8 0-16-7.2-16-16V360c0-4.4 3.6-8 8-8h880c4.4 0 8 3.6 8 8v488c0 8.8-7.2 16-16 16z m8-576H72c-4.4 0-8-3.6-8-8V176c0-8.8 7.2-16 16-16h864c8.8 0 16 7.2 16 16v104c0 4.4-3.6 8-8 8z" p-id="18981"></path><path d="M848 256c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zM720 256c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zM592 256c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zM439.8 767.5c-15.6-8.3-21.5-27.7-13.2-43.3l114.4-215c8.3-15.6 27.7-21.5 43.3-13.2 15.6 8.3 21.5 27.7 13.2 43.3L483 754.3c-8.3 15.6-27.6 21.5-43.2 13.2zM310.5 707.8l-61.2-61.2c-12.5-12.5-12.5-32.8 0-45.3l61.2-61.2c1.6-1.6 4.1-1.6 5.7 0l39.6 39.6c1.6 1.6 1.6 4.1 0 5.7l-27.2 27.2c-6.2 6.2-6.2 16.4 0 22.6l27.2 27.2c1.6 1.6 1.6 4.1 0 5.7l-39.6 39.6c-1.6 1.7-4.1 1.7-5.7 0.1zM707.8 707.8l-39.6-39.6c-1.6-1.6-1.6-4.1 0-5.7l27.2-27.2c6.2-6.2 6.2-16.4 0-22.6l-27.2-27.2c-1.6-1.6-1.6-4.1 0-5.7l39.6-39.6c1.6-1.6 4.1-1.6 5.7 0l61.2 61.2c12.5 12.5 12.5 32.8 0 45.3l-61.2 61.2c-1.6 1.5-4.1 1.5-5.7-0.1z" p-id="18982"></path></svg>',
  originalType: ORIGINAL_TYPE_MAP.iframe,
  canWrapped: true,
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
        desc: 'iframe',
        widgetName: NameI18N.zh,
        action: {
          ...WidgetViewActionI18N.zh,
          ...WidgetEditActionI18N.zh,
        },
        title: TitleI18N.zh,
        iframe: iframeI18N.zh,
        background: { backgroundGroup: '背景' },
        padding: PaddingI18N.zh,
        border: { borderGroup: '边框' },
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: 'iframe',
        widgetName: NameI18N.en,
        action: {
          ...WidgetViewActionI18N.en,
          ...WidgetEditActionI18N.en,
        },
        title: TitleI18N.en,
        iframe: iframeI18N.en,
        background: { backgroundGroup: 'Background' },
        padding: PaddingI18N.en,
        border: { borderGroup: 'Border' },
      },
    },
  ],
};
export interface IframeWidgetToolKit extends WidgetToolkit {
  getIframe: (props) => {
    src: string;
  };
}
const widgetToolkit: IframeWidgetToolKit = {
  create: opt => {
    const widget = widgetTpl();
    widget.id = widgetMeta.originalType + widget.id;
    widget.parentId = opt.parentId || '';
    widget.datachartId = opt.datachartId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.originalType = widgetMeta.originalType;
    widget.config.type = 'media';
    widget.config.name = opt.name || '';

    widget.config.rect = { ...initFreeWidgetRect() };
    widget.config.pRect = { ...initAutoWidgetRect() };
    widget.config.mRect = undefined;

    widget.config.customConfig.props = [
      { ...initIframeTpl() },
      { ...initTitleTpl() },
      { ...initBackgroundTpl() },
      { ...initPaddingTpl() },
      { ...initBorderTpl() },
    ];

    return widget;
  },
  getName(key) {
    return initWidgetName(NameI18N, key);
  },
  edit() {},
  save() {},
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
  getIframe(props) {
    const [src] = getJsonConfigs(props, ['iframeGroup'], ['src']);
    return {
      src,
    };
  },
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
// export const getWidgetIframe = props => {
//   const [src] = getJsonConfigs(props, ['iframeGroup'], ['src']);
//   return {
//     src,
//   };
// };
const iframeProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export const iframeWidgetToolKit = widgetToolkit;
export default iframeProto;
