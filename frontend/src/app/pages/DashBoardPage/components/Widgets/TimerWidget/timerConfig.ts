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
import { FONT_DEFAULT } from 'app/constants';
import {
  ORIGINAL_TYPE_MAP,
  TimeDefault,
} from 'app/pages/DashBoardPage/constants';
import { RectConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import type {
  WidgetActionListItem,
  widgetActionType,
  WidgetMeta,
  WidgetProto,
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
  initWidgetName,
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
        value: { ...FONT_DEFAULT, fontSize: '20' },
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
const NameI18N = {
  zh: '时钟',
  en: 'Timer',
};
export const widgetMeta: WidgetMeta = {
  icon: '<svg t="1653391446795" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26995" width="200" height="200"><path d="M513.365333 955.733333a443.733333 443.733333 0 1 1 443.733334-443.733333A444.279467 444.279467 0 0 1 513.365333 955.733333z m0-832.853333a389.12 389.12 0 1 0 389.12 389.12A389.5296 389.5296 0 0 0 513.365333 122.88z" fill="#cdcdcd" p-id="26996"></path><path d="M513.365333 211.3536a27.306667 27.306667 0 0 1-27.306666-27.306667V95.573333a27.306667 27.306667 0 0 1 54.613333 0v88.4736a27.306667 27.306667 0 0 1-27.306667 27.306667zM185.412267 539.306667H96.938667a27.306667 27.306667 0 1 1 0-54.613334h88.4736a27.306667 27.306667 0 0 1 0 54.613334zM929.792 539.306667h-88.4736a27.306667 27.306667 0 1 1 0-54.613334h88.4736a27.306667 27.306667 0 0 1 0 54.613334zM513.365333 955.733333a27.306667 27.306667 0 0 1-27.306666-27.306666v-88.4736a27.306667 27.306667 0 0 1 54.613333 0V928.426667a27.306667 27.306667 0 0 1-27.306667 27.306666zM712.430933 735.232a27.306667 27.306667 0 0 1-19.114666-7.918933L494.250667 531.387733a27.306667 27.306667 0 0 1-8.192-19.387733V290.133333a27.306667 27.306667 0 0 1 54.613333 0v210.397867l191.146667 188.0064a27.306667 27.306667 0 0 1-19.114667 46.6944z" fill="#cdcdcd" p-id="26997"></path></svg>',
  originalType: ORIGINAL_TYPE_MAP.timer,
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
        desc: 'timer',
        widgetName: NameI18N.zh,
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
        widgetName: NameI18N.en,
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
    widget.id = widgetMeta.originalType + widget.id;
    widget.parentId = opt.parentId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.originalType = widgetMeta.originalType;
    widget.config.type = 'media';
    widget.config.name = opt.name || '';
    if (opt.boardType === 'auto') {
      const rect: RectConfig = {
        x: 0,
        y: 0,
        width: 6,
        height: 2,
      };
      widget.config.pRect = { ...rect };
      widget.config.mRect = undefined;
    } else {
      const rect: RectConfig = {
        x: 0,
        y: 0,
        width: 400,
        height: 200,
      };
      widget.config.rect = { ...rect };
    }

    widget.config.customConfig.props = [
      { ...initTimerTpl() },
      { ...initTitleTpl() },
      { ...initBackgroundTpl('#fff') },
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

const timerProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export const timerWidgetToolkit = widgetToolkit;
export default timerProto;
