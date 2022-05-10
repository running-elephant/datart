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
import { WidgetToolkit } from 'app/pages/DashBoardPage/types/widgetTypes';
import { initWidgetName } from '../../WidgetManager/utils/init';
import { dataChartCreator, getMeta } from './config';

const NameI18N = {
  zh: '引用图表',
  en: 'LinkedChart',
};
export const widgetMeta = getMeta({
  icon: 'linkedChart',
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
    const widget = dataChartCreator({
      ...opt,
      widgetTypeId: widgetMeta.widgetTypeId,
    });
    return widget;
  },
  getName(key) {
    return initWidgetName(NameI18N, key);
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

const linkedChartProto = {
  widgetTypeId: widgetMeta.widgetTypeId,
  meta: widgetMeta,
  toolkit: linkedChartToolkit,
};
export default linkedChartProto;
