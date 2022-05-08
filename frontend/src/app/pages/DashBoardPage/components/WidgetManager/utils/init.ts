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
import { APP_CURRENT_VERSION } from 'app/migration/constants';
import type {
  BoardType,
  RectConfig,
  WidgetType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import type { ChartStyleConfig } from 'app/types/ChartConfig';
import { uuidv4 } from 'utils/utils';

export const initTitleTpl = () => {
  const titleTpl: ChartStyleConfig = {
    label: 'title.titleGroup',
    key: 'titleGroup',
    comType: 'group',
    rows: [
      {
        label: 'title.title',
        key: 'title',
        value: '',
        comType: 'input',
      },
      {
        label: 'title.showTitle',
        key: 'showTitle',
        value: false,
        comType: 'switch',
      },
      {
        label: 'title.textAlign.textAlign',
        key: 'textAlign',
        value: 'left',
        comType: 'select',
        options: {
          translateItemLabel: true,
          items: [
            {
              label: '@global@.title.textAlign.left',
              key: 'left',
              value: 'left',
            },
            {
              label: '@global@.title.textAlign.center',
              key: 'center',
              value: 'center',
            },
          ],
        },
      },
      {
        label: 'title.font',
        key: 'font',
        value: FontDefault,
        comType: 'font',
      },
    ],
  };
  return titleTpl;
};
export const TitleI18N = {
  zh: {
    titleGroup: '标题配置',
    title: '标题',
    showTitle: '显示标题',
    font: '标题字体',
    textAlign: {
      textAlign: '对齐方式',
      left: '左对齐',
      center: '居中',
    },
  },
  en: {
    titleGroup: 'Title Config',
    title: 'Title',
    showTitle: 'Show Title',
    font: 'Title Font',
    textAlign: {
      textAlign: 'Align',
      left: 'Left',
      center: 'Center',
    },
  },
};
export const initPaddingTpl = () => {
  const paddingTpl: ChartStyleConfig = {
    label: 'padding.paddingGroup',
    key: 'paddingGroup',
    comType: 'group',
    rows: [
      {
        label: 'padding.top',
        key: 'top',
        value: '8',
        comType: 'inputNumber',
      },
      {
        label: 'padding.bottom',
        key: 'bottom',
        value: '8',
        comType: 'inputNumber',
      },
      {
        label: 'padding.left',
        key: 'left',
        value: '8',
        comType: 'inputNumber',
      },
      {
        label: 'padding.right',
        key: 'right',
        value: '8',
        comType: 'inputNumber',
      },
    ],
  };
  return paddingTpl;
};

export const PaddingI18N = {
  zh: {
    paddingGroup: '内边距',
    top: '上',
    bottom: '下',
    left: '左',
    right: '右',
  },
  en: {
    paddingGroup: 'Padding',
    top: 'Top',
    bottom: 'Bottom',
    left: 'Left',
    right: 'Right',
  },
};
export const initLoopFetchTpl = () => {
  const loopFetchTpl: ChartStyleConfig = {
    label: 'loopFetch.loopFetchGroup',
    key: 'loopFetchGroup',
    comType: 'group',
    rows: [
      {
        label: 'loopFetch.enable',
        key: 'enable',
        value: false,
        comType: 'switch',
      },
      {
        label: 'loopFetch.interval',
        key: 'interval',
        value: '60', //60s
        comType: 'inputNumber',
      },
    ],
  };
  return loopFetchTpl;
};

export const LoopFetchI18N = {
  zh: {
    loopFetchGroup: '自动刷新数据',
    enable: '启用',
    interval: '间隔(s)',
  },
  en: {
    loopFetchGroup: 'Loop Fetch',
    enable: 'Enable',
    interval: 'Interval (s)',
  },
};
export const initBackgroundTpl = () => {
  const backgroundTpl: ChartStyleConfig = {
    label: 'background.backgroundGroup',
    key: 'backgroundGroup',
    comType: 'group',
    rows: [
      {
        label: 'background.background',
        key: 'background',
        value: {
          color: 'transparent', // TODO 根据当前主题色配置
          image: '',
          size: '100% 100%',
          repeat: 'no-repeat',
        },
        comType: 'background',
      },
    ],
  };
  return backgroundTpl;
};
export const initBorderTpl = () => {
  const borderTpl: ChartStyleConfig = {
    label: 'border.borderGroup',
    key: 'borderGroup',
    comType: 'group',
    rows: [
      {
        label: 'border.border',
        key: 'border',
        value: {
          color: 'transparent', // TODO 根据当前主题色配置
          width: '0',
          style: 'solid',
          radius: '0',
        },
        comType: 'widgetBorder',
      },
    ],
  };
  return borderTpl;
};
export const initWidgetViewActionTpl = () => {
  return {
    fullScreen: {
      label: 'action.fullScreen',
      icon: 'fullscreen', //svg TODO
      key: 'fullScreen',
    },
    refresh: {
      label: 'action.refresh',
      icon: 'refresh',
      key: 'refresh',
    },
  };
};

export const WidgetViewActionI18N = {
  zh: {
    fullScreen: '全屏',
    refresh: '刷新',
  },
  en: {
    fullScreen: 'Full Screen',
    refresh: 'Refresh',
  },
};
export const initWidgetEditActionTpl = () => {
  const widgetEditActionTpl = {
    copy: {
      label: 'action.copy',
      icon: 'copy',
      key: 'copy',
    },
    delete: {
      label: 'action.delete',
      icon: 'delete',
      key: 'delete',
      danger: true,
    },
    lock: {
      label: 'action.lock',
      icon: 'lock',
      key: 'lock',
    },
    unLock: {
      label: 'action.unLock',
      icon: 'unLock',
      key: 'unLock',
    },
  };
  return widgetEditActionTpl;
};

export const WidgetEditActionI18N = {
  zh: {
    copy: '复制',
    paste: '粘贴',
    delete: '删除',
    lock: '锁定',
    unLock: '解锁',
  },
  en: {
    copy: 'Copy',
    paste: 'Paste',
    delete: 'Delete',
    lock: 'Lock',
    unLock: 'UnLock',
  },
};

export const initAutoWidgetRect = (): RectConfig => ({
  x: 0,
  y: 0,
  width: 6,
  height: 6,
});
export const initFreeWidgetRect = (): RectConfig => ({
  x: 0,
  y: 0,
  width: 400,
  height: 300,
});

export const widgetTpl = (): Widget => {
  return {
    id: uuidv4(),
    dashboardId: '',
    datachartId: '',
    relations: [],
    viewIds: [],
    parentId: '',
    config: {
      clientId: initClientId(),
      version: APP_CURRENT_VERSION,
      index: 0,
      name: '',
      boardType: '' as BoardType,
      type: '' as WidgetType,
      widgetTypeId: '',

      // visible: true,
      lock: false,
      content: {} as any,
      rect: { x: 0, y: 0, width: 0, height: 0 },
      jsonConfig: {
        props: [],
      },
    },
  };
};

export const initClientId = () => {
  return 'client_' + uuidv4();
};
