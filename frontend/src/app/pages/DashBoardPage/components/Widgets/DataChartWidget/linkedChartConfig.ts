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
  zh: '引用图表',
  en: 'LinkedChart',
};
export const widgetMeta = getMeta({
  icon: '<svg t="1653390252758" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3033" width="200" height="200"><path d="M278.755 777.557h89.543c22.642 0 40.96-18.318 40.96-40.96v-407.211c0-22.642-18.318-40.96-40.96-40.96h-89.543c-22.642 0-40.96 18.318-40.96 40.96v407.211c0 22.528 18.432 40.96 40.96 40.96zM292.409 343.040h62.237v379.904h-62.237v-379.904zM501.191 777.557h89.543c22.642 0 40.96-18.318 40.96-40.96v-521.102c0-22.642-18.318-40.96-40.96-40.96h-89.543c-22.642 0-40.96 18.318-40.96 40.96v521.102c0 22.528 18.432 40.96 40.96 40.96zM514.845 229.149h62.237v493.795h-62.237v-493.795zM723.627 777.557h89.543c22.642 0 40.96-18.318 40.96-40.96v-257.479c0-22.642-18.318-40.96-40.96-40.96h-89.543c-22.642 0-40.96 18.318-40.96 40.96v257.479c0 22.528 18.432 40.96 40.96 40.96zM737.28 492.771h62.237v230.173h-62.237v-230.173z" fill="" p-id="3034"></path><path d="M863.687 816.242h-676.181v-633.173c0-15.133-12.174-27.307-27.307-27.307s-27.307 12.174-27.307 27.307v659.911c0 6.258 2.048 11.947 5.575 16.498 5.006 6.827 13.085 11.378 22.187 11.378h703.147c15.133 0 27.307-12.174 27.307-27.307-0.114-15.019-12.288-27.307-27.421-27.307z" fill="" p-id="3035"></path></svg>',
  widgetTypeId: ORIGINAL_TYPE_MAP.linkedChart,
  zh: {
    desc: '引入图表部件的内部是一个引用的数据图表,原有数据图表有改动时,引入图表部件也会跟着改变',
    widgetName: NameI18N.zh,
  },
  en: {
    desc: 'linkedChart Widget core is a referenced dataChart,When the original dataChart is changed, the widget will also change',
    widgetName: NameI18N.en,
  },
});

export const linkedChartToolkit: WidgetToolkit = {
  create: opt => {
    const widget = dataChartCreator(opt);
    widget.config.originalType = ORIGINAL_TYPE_MAP.linkedChart;
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

const linkedChartProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: linkedChartToolkit,
};
export default linkedChartProto;
