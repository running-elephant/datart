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
import { FontDefault } from 'app/constants';
import { TimeDefault } from 'app/pages/DashBoardPage/constants';
import { RectConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import type {
  WidgetMeta,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { getJsonConfigs } from 'app/pages/DashBoardPage/utils';
import { IFontDefault } from '../../../../../../types';
import { ITimeDefault } from '../../../types/widgetTypes';
import {
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

const initTimerTpl = () => {
  return {
    label: 'timer.timerGroup',
    key: 'timerGroup',
    comType: 'group',
    rows: [
      {
        label: 'timer.time',
        key: 'time',
        value: TimeDefault,
        comType: 'timerFormat',
      },
      {
        label: 'timer.font',
        key: 'font',
        value: { ...FontDefault, fontSize: '20' },
        comType: 'font',
      },
    ],
  };
};
const timerI18N = {
  zh: {
    timerGroup: '时间配置',
    time: '时间',
    font: '字体',
  },
  en: {
    timerGroup: 'Timer Config',
    time: 'Time',
    font: 'Font',
  },
};
export const widgetMeta: WidgetMeta = {
  icon: 'timer',
  widgetTypeId: 'timer',
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
        desc: 'timer',
        widgetType: 'timer',
        action: {
          ...WidgetViewActionI18N.zh,
          ...WidgetEditActionI18N.zh,
        },
        title: TitleI18N.zh,
        background: { backgroundGroup: '背景' },
        padding: PaddingI18N.zh,
        timer: timerI18N.zh,
        border: { borderGroup: '边框' },
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: 'timer',
        widgetType: 'timer',
        action: {
          ...WidgetViewActionI18N.en,
          ...WidgetEditActionI18N.en,
        },
        title: TitleI18N.en,
        background: { backgroundGroup: 'Background' },
        padding: PaddingI18N.en,
        timer: timerI18N.en,
        border: { borderGroup: 'Border' },
      },
    },
  ],
};
export interface TimerWidgetToolKit extends WidgetToolkit {
  getTimer: (props) => {
    time: ITimeDefault;
    font: IFontDefault;
  };
}
export const widgetToolkit: TimerWidgetToolKit = {
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
        height: 2,
      };
      widget.config.rect = { ...rect };
      widget.config.mRect = { ...rect };
    } else {
      const rect: RectConfig = {
        x: 0,
        y: 0,
        width: 400,
        height: 200,
      };
      widget.config.rect = { ...rect };
    }

    widget.config.jsonConfig.props = [
      { ...initTimerTpl() },
      { ...initTitleTpl() },
      { ...initBackgroundTpl() },
      { ...initPaddingTpl() },
      { ...initBorderTpl() },
    ];
    widget.config.jsonConfig.props?.forEach(ele => {
      if (ele.key === 'titleGroup') {
        ele.rows?.forEach(row => {
          if (row.key === 'title') {
            row.value = 'timer';
          }
        });
      }
    });

    return widget;
  },
  edit() {},
  save() {},
  getTimer(props) {
    const [time, font] = getJsonConfigs(
      props,
      ['timerGroup'],
      ['time', 'font'],
    ) as [ITimeDefault, IFontDefault];
    return {
      time,
      font,
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

const timerProto = {
  widgetTypeId: widgetMeta.widgetTypeId,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export const timerWidgetToolkit = widgetToolkit;
export default timerProto;
