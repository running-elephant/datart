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
import { CUSTOM_BTN_DEFAULT, FONT_DEFAULT } from 'app/constants';
import {
  ORIGINAL_TYPE_MAP,
  TimeDefault,
} from 'app/pages/DashBoardPage/constants';
import type {
  WidgetActionListItem,
  widgetActionType,
  WidgetMeta,
  WidgetProto,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { getJsonConfigs } from 'app/pages/DashBoardPage/utils';
import { WHITE } from 'styles/StyleConstants';
import { ICustomBtnDefault, IFontDefault } from '../../../../../../types';
import { ITimeDefault } from '../../../types/widgetTypes';
import {
  initBackgroundTpl,
  initBorderTpl,
  initInteractionTpl,
  initPaddingTpl,
  initTitleTpl,
  initWidgetName,
  InteractionI18N,
  PaddingI18N,
  TitleI18N,
  widgetTpl,
} from '../../WidgetManager/utils/init';

const initCustomBtnTpl = () => {
  return [
    {
      label: 'customBtn.meta',
      key: 'metaGroup',
      comType: 'group',
      rows: [
        {
          label: '按钮属性',
          key: 'btnFormat',
          comType: 'btnFormat',
          value: CUSTOM_BTN_DEFAULT,
        },
      ],
    },
    {
      label: 'customBtn.btnFontGroup',
      key: 'btnFontGroup',
      comType: 'group',
      rows: [
        {
          label: '按钮字体',
          key: 'btnFont',
          comType: 'font',
          value: FONT_DEFAULT,
        },
      ],
    },
  ];
};
const customBtnI18N = {
  zh: {
    meta: '按钮属性',
    btnFontGroup: '按钮字体',
  },
  en: {
    meta: 'Button Props',
    btnFontGroup: 'Button Font',
  },
};
const NameI18N = {
  zh: '按钮',
  en: 'Button',
};
export const widgetMeta: WidgetMeta = {
  icon: 'query-widget',
  originalType: ORIGINAL_TYPE_MAP.customBtn,
  canWrapped: true,
  controllable: false,
  linkable: false,
  canFullScreen: true,
  singleton: false,

  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        ...InteractionI18N.zh,
        desc: 'customBtn',
        widgetName: NameI18N.zh,
        action: {},
        title: TitleI18N.zh,
        customBtn: customBtnI18N.zh,
        background: { backgroundGroup: '背景' },
        padding: PaddingI18N.zh,
        border: { borderGroup: '边框' },
      },
    },
    {
      lang: 'en-US',
      translation: {
        ...InteractionI18N.en,
        desc: 'customBtn',
        widgetName: NameI18N.en,
        action: {},
        title: TitleI18N.en,
        background: { backgroundGroup: 'Background' },
        padding: PaddingI18N.en,
        customBtn: customBtnI18N.en,
        border: { borderGroup: 'Border' },
      },
    },
  ],
};
export interface CustomBtnWidgetToolKit extends WidgetToolkit {
  getCustomBtnConfig: (props) => ICustomBtnDefault;
  getCustomBtnFont: (props) => IFontDefault;
}
export const widgetToolkit: CustomBtnWidgetToolKit = {
  create: opt => {
    const widget = widgetTpl();
    widget.id = widgetMeta.originalType + widget.id;
    widget.parentId = opt.parentId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.originalType = widgetMeta.originalType;
    widget.config.type = 'media';
    widget.config.name = opt.name || '';
    widget.config.rect.width = 100;
    widget.config.rect.height = 60;
    widget.config.pRect.width = 2;
    widget.config.pRect.height = 1;

    widget.config.customConfig.props = [
      ...initCustomBtnTpl(),
      // { ...initTitleTpl() },
      { ...initBackgroundTpl(WHITE) },
      { ...initPaddingTpl({ top: 0, bottom: 0, left: 0, right: 0 }) },
      { ...initBorderTpl() },
    ];

    widget.config.customConfig.interactions = [...initInteractionTpl()];

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
  getCustomBtnConfig(props) {
    const [btnFormat] = getJsonConfigs(props, ['metaGroup'], ['btnFormat']) as [
      ICustomBtnDefault,
    ];
    return btnFormat;
  },
  getCustomBtnFont(props) {
    const [btnFont] = getJsonConfigs(props, ['btnFontGroup'], ['btnFont']) as [
      IFontDefault,
    ];
    return btnFont;
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

const customBtnProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export const customBtnWidgetToolKit = widgetToolkit;
export default customBtnProto;
