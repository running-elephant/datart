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

import { ControllerFacadeTypes } from 'app/constants';
import {
  WidgetMeta,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import {
  initBackgroundTpl,
  initBorderTpl,
  initPaddingTpl,
  initWidgetEditActionTpl,
  initWidgetViewActionTpl,
  PaddingI18N,
  TitleI18N,
  WidgetEditActionI18N,
  WidgetViewActionI18N,
} from '../../WidgetManager/utils/init';
import { controlWidgetTpl } from './controllerConfig';

export const widgetMeta: WidgetMeta = {
  icon: '',
  widgetTypeId: ControllerFacadeTypes.Value,
  canWrapped: true,
  controllable: true,
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
        desc: '',
        widgetType: '',
        action: {
          ...WidgetViewActionI18N.zh,
          ...WidgetEditActionI18N.zh,
        },
        title: TitleI18N.zh,
        background: { backgroundGroup: '背景' },
        padding: PaddingI18N.zh,

        border: { borderGroup: '边框' },
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: '',
        widgetType: '',
        action: {
          ...WidgetViewActionI18N.en,
          ...WidgetEditActionI18N.en,
        },
        title: TitleI18N.en,
        background: { backgroundGroup: 'Background' },
        padding: PaddingI18N.en,

        border: { borderGroup: 'Border' },
      },
    },
  ],
};

export const widgetToolkit: WidgetToolkit = {
  create: opt => {
    const widget = controlWidgetTpl(opt);
    widget.id = widgetMeta.widgetTypeId + widget.id;
    widget.config.widgetTypeId = widgetMeta.widgetTypeId;
    const addProps = [
      { ...initBackgroundTpl() },
      { ...initPaddingTpl() },
      { ...initBorderTpl() },
    ];
    widget.config.jsonConfig.props?.forEach(ele => {
      if (ele.key === 'titleGroup') {
        ele.rows?.forEach(row => {
          if (row.key === 'title') {
            row.value = widget.config.content?.name;
          }
          if (row.key === 'showTitle') {
            row.value = true;
          }
        });
      }
    });
    widget.config.jsonConfig.props =
      widget.config.jsonConfig.props?.concat(addProps);
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

const valueProto = {
  widgetTypeId: widgetMeta.widgetTypeId,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default valueProto;
