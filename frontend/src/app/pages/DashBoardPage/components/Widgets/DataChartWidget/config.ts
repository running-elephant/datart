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

import {
  BoardType,
  DataChart,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { WidgetMeta } from 'app/pages/DashBoardPage/types/widgetTypes';
import {
  initAutoWidgetRect,
  initFreeWidgetRect,
  initWidgetEditActionTpl,
  initWidgetViewActionTpl,
  LoopFetchI18N,
  PaddingI18N,
  TitleI18N,
  WidgetEditActionI18N,
  widgetTpl,
  WidgetViewActionI18N,
} from '../../WidgetManager/utils/init';

export const getMeta = (opt: {
  icon: any;
  widgetTypeId: 'linkChart' | 'selfChart';
  zh: {
    desc: string;
    widgetTypeId: string;
  };
  en: {
    desc: string;
    widgetTypeId: string;
  };
}) => {
  const meta: WidgetMeta = {
    icon: opt.icon,
    widgetTypeId: opt.widgetTypeId,
    viewAction: {
      ...initWidgetViewActionTpl(),
    },
    editAction: {
      ...initWidgetEditActionTpl(),
      setLinkage: {
        label: 'action.setLinkage',
        icon: 'linkage',
        key: 'setLinkage',
      },
      closeLinkage: {
        label: 'action.closeLinkage',
        icon: 'closeLinkage',
        key: 'closeLinkage',
      },
      setJump: {
        label: 'action.setJump',
        icon: 'jump',
        key: 'setJump',
      },
      closeJump: {
        label: 'action.closeJump',
        icon: 'closeJump',
        key: 'closeJump',
      },
    },
    i18ns: [
      {
        lang: 'zh-CN',
        translation: {
          desc: opt.zh.desc,
          widgetTypeId: opt.zh.widgetTypeId,
          action: {
            ...WidgetViewActionI18N.zh,
            ...WidgetEditActionI18N.zh,

            setLinkage: '设置联动',
            closeLinkage: '关闭联动',
            setJump: '设置跳转',
            closeJump: '关闭跳转',
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
          desc: opt.en.desc,
          widgetTypeId: opt.en.widgetTypeId,
          action: {
            ...WidgetViewActionI18N.en,
            ...WidgetEditActionI18N.en,
            setLinkage: 'Set Linkage',
            closeLinkage: 'Close Linkage',
            setJump: 'Set Jump',
            closeJump: 'Close Jump',
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
  return meta;
};

export const dataChartCreator = (opt: {
  dashboardId: string;
  boardType: BoardType;
  dataChartId: string;
  dataChartConfig: DataChart;
  viewIds: string[];
  widgetTypeId: 'linkChart' | 'selfChart';
}) => {
  const widget = widgetTpl();
  widget.dashboardId = opt.dashboardId;
  widget.datachartId = opt.dataChartId;
  widget.viewIds = opt.viewIds || [];
  widget.config.widgetTypeId = opt.widgetTypeId;
  widget.config.boardType = opt.boardType;
  widget.config.type = 'chart';
  widget.config.selfConfig.dataChartConfig = opt.dataChartConfig;
  widget.config.jsonConfig.props?.forEach(ele => {
    if (ele.key === 'titleGroup') {
      ele.rows?.forEach(row => {
        if (row.key === 'title') {
          row.value = opt.dataChartConfig.name || '';
        }
      });
    }
  });
  if (opt.boardType === 'auto') {
    widget.config.rect = { ...initAutoWidgetRect() };
    widget.config.mRect = { ...initAutoWidgetRect() };
  } else {
    widget.config.rect = { ...initFreeWidgetRect() };
  }
  return widget;
};
