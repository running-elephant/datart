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

const initVideoTpl = () => {
  return {
    label: 'video.videoGroup',
    key: 'videoGroup',
    comType: 'group',
    rows: [
      {
        label: 'video.src',
        key: 'src',
        value:
          'https://prod-streaming-video-msn-com.akamaized.net/a75a7d73-21ab-4ac9-8c30-890433965c24/e9f6bdcb-eba0-4eca-b9d2-60d3415bf65f.mp4',
        comType: 'input',
      },
    ],
  };
};
const videoI18N = {
  zh: {
    videoGroup: '视频配置',
    src: '嵌入地址', //资源？
  },
  en: {
    videoGroup: 'video Config',
    src: 'URL', // Source?
  },
};
const NameI18N = {
  zh: '视频',
  en: 'Video',
};
export const widgetMeta: WidgetMeta = {
  icon: '<svg t="1653390622714" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12443" width="200" height="200"><path d="M704 320m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" p-id="12444"></path><path d="M832 864H64a32 32 0 0 1-32-32V192a32 32 0 0 1 32-32h768a32 32 0 0 1 32 32v140.16l81.92-40.96a32.64 32.64 0 0 1 30.72 0 33.28 33.28 0 0 1 15.36 28.8v384a33.28 33.28 0 0 1-15.36 27.52 32.64 32.64 0 0 1-30.72 0l-81.92-40.96V832a32 32 0 0 1-32 32z m-736-64h704V640a33.28 33.28 0 0 1 15.36-27.52 32.64 32.64 0 0 1 30.72 0l81.92 40.96v-281.6l-81.92 40.96a32.64 32.64 0 0 1-30.72 0A33.28 33.28 0 0 1 800 384V224h-704z" p-id="12445"></path><path d="M384 672a33.92 33.92 0 0 1-15.36-3.84 32.64 32.64 0 0 1-16.64-28.16V384a32 32 0 0 1 49.92-26.88l192 128a32.64 32.64 0 0 1 0 53.76l-192 128a36.48 36.48 0 0 1-17.92 5.12z m32-228.48v136.96L518.4 512z" p-id="12446"></path></svg>',
  originalType: ORIGINAL_TYPE_MAP.video,
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
        desc: 'video',
        widgetName: NameI18N.zh,
        action: {
          ...WidgetViewActionI18N.zh,
          ...WidgetEditActionI18N.zh,
        },
        title: TitleI18N.zh,
        background: { backgroundGroup: '背景' },
        padding: PaddingI18N.zh,
        video: videoI18N.zh,
        border: { borderGroup: '边框' },
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: 'video',
        widgetName: NameI18N.en,
        action: {
          ...WidgetViewActionI18N.en,
          ...WidgetEditActionI18N.en,
        },
        title: TitleI18N.en,
        background: { backgroundGroup: 'Background' },
        padding: PaddingI18N.en,
        video: videoI18N.en,
        border: { borderGroup: 'Border' },
      },
    },
  ],
};
export interface VideoWidgetToolKit extends WidgetToolkit {
  getVideo: (props) => {
    src: string;
  };
}
const widgetToolkit: VideoWidgetToolKit = {
  create: opt => {
    const widget = widgetTpl();
    widget.id = widgetMeta.originalType + widget.id;
    widget.parentId = opt.parentId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.originalType = widgetMeta.originalType;
    widget.config.type = 'media';
    widget.config.name = opt.name || '';

    widget.config.rect = { ...initFreeWidgetRect() };
    widget.config.pRect = { ...initAutoWidgetRect() };
    widget.config.mRect = undefined;

    widget.config.customConfig.props = [
      { ...initVideoTpl() },
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
  getVideo(props) {
    const [src] = getJsonConfigs(props, ['videoGroup'], ['src']);
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

const videoProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};

export const videoWidgetToolKit = widgetToolkit;
export default videoProto;
