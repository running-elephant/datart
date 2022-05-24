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
  WidgetActionListItem,
  widgetActionType,
  WidgetProto,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { initWidgetName } from '../../WidgetManager/utils/init';
import { dataChartCreator, getMeta } from './config';

const NameI18N = {
  zh: '自建数据图表',
  en: 'OwnedChart',
};
const widgetMeta = getMeta({
  icon: '<svg t="1653391790607" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="36021" width="200" height="200"><path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z m-616-64h536c4.4 0 8-3.6 8-8V284c0-7.2-8.7-10.7-13.7-5.7L592 488.6l-125.4-124c-3.1-3.1-8.2-3.1-11.3 0l-189 189.6c-1.5 1.5-2.3 3.5-2.3 5.6V720c0 4.4 3.6 8 8 8z" p-id="36022"></path></svg>',
  widgetTypeId: ORIGINAL_TYPE_MAP.ownedChart,
  zh: {
    desc: '自建数据图表的内部是一个独立的数据图表 ',
    widgetName: NameI18N.zh,
  },
  en: {
    desc: 'ownedChart Widget core is a independent dataChart',
    widgetName: NameI18N.en,
  },
});
export type OwnedChartToolkit = WidgetToolkit & {};
const widgetToolkit: OwnedChartToolkit = {
  create: opt => {
    const widget = dataChartCreator(opt);
    widget.config.originalType = ORIGINAL_TYPE_MAP.ownedChart;
    widget.id = widget.config.originalType + widget.id;
    return widget;
  },
  getName(key) {
    return initWidgetName(NameI18N, key);
  },
  getDropDownList(widgetConf, supportTrigger?) {
    let disabledMakeLinkage = false;
    let showCloseLinkage = false;
    let disabledMakeJump = false;
    let showCloseJump = false;
    if (supportTrigger) {
      if (widgetConf.jumpConfig?.open) {
        showCloseJump = true;
        disabledMakeLinkage = true;
      } else {
        showCloseJump = false;
        disabledMakeLinkage = false;
      }

      if (widgetConf.linkageConfig?.open) {
        showCloseLinkage = true;
        disabledMakeJump = true;
      } else {
        showCloseLinkage = false;
        disabledMakeJump = false;
      }
    }
    const list: WidgetActionListItem<widgetActionType>[] = [
      {
        key: 'refresh',
        renderMode: ['edit', 'read', 'share', 'schedule'],
      },
      {
        key: 'fullScreen',
        renderMode: ['read', 'share', 'schedule'],
      },
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

      {
        key: 'makeLinkage',
        label: 'makeLinkage',
        renderMode: ['edit'],
        show: supportTrigger,
        disabled: disabledMakeLinkage,
      },
      {
        key: 'closeLinkage',
        renderMode: ['edit'],
        show: supportTrigger && showCloseLinkage,
      },
      {
        key: 'makeJump',
        label: 'makeJump',
        renderMode: ['edit'],
        show: supportTrigger,
        disabled: disabledMakeJump,
      },
      {
        key: 'closeJump',
        renderMode: ['edit'],
        show: supportTrigger && showCloseJump,
      },
    ];
    return list;
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
  // setLinkage() {},
  // closeLinkage() {},
  // setJump() {},
  // closeJump() {},
};

const ownedChartProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default ownedChartProto;
