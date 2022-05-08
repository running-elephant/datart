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
import type {
  WidgetMeta,
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
export const widgetMeta: WidgetMeta = {
  icon: 'video',
  widgetTypeId: 'video',
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
        desc: 'video',
        widgetType: 'video',
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
        widgetType: 'video',
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
    widget.id = widgetMeta.widgetTypeId + widget.id;
    widget.parentId = opt.parentId || '';
    widget.dashboardId = opt.dashboardId || '';
    widget.datachartId = opt.datachartId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.widgetTypeId = widgetMeta.widgetTypeId;
    widget.config.type = 'media';
    if (opt.boardType === 'auto') {
      widget.config.rect = { ...initAutoWidgetRect() };
      widget.config.mRect = { ...initAutoWidgetRect() };
    } else {
      widget.config.rect = { ...initFreeWidgetRect() };
    }

    widget.config.jsonConfig.props = [
      { ...initVideoTpl() },
      { ...initTitleTpl() },
      { ...initBackgroundTpl() },
      { ...initPaddingTpl() },
      { ...initBorderTpl() },
    ];
    widget.config.jsonConfig.props?.forEach(ele => {
      if (ele.key === 'titleGroup') {
        ele.rows?.forEach(row => {
          if (row.key === 'title') {
            row.value = 'video';
          }
        });
      }
    });

    return widget;
  },
  edit() {},
  save() {},
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

const videoProto = {
  widgetTypeId: widgetMeta.widgetTypeId,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};

export const videoWidgetToolKit = widgetToolkit;
export default videoProto;
