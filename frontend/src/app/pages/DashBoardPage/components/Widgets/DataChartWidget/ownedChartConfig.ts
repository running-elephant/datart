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
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { initWidgetName } from '../../WidgetManager/utils/init';
import { dataChartCreator, getMeta } from './config';

const NameI18N = {
  zh: '自建数据图表',
  en: 'OwnedChart',
};
const widgetMeta = getMeta({
  icon: 'ownedChart',
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
    const widget = dataChartCreator({
      ...opt,
      widgetTypeId: widgetMeta.widgetTypeId,
    });
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
// class OwnedChartProto{
//   public widgetTypeId
//   constructor(){
//     return this;
//   }
// }
const ownedChartProto = {
  widgetTypeId: widgetMeta.widgetTypeId,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default ownedChartProto;
