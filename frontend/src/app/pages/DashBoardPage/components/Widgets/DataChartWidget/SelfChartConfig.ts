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

import { WidgetToolkit } from 'app/pages/DashBoardPage/types/widgetTypes';
import { dataChartCreator, getMeta } from './config';

export const selfChartMeta = getMeta({
  icon: 'selfChart',
  widgetTypeId: 'selfChart',
  zh: {
    desc: '自建数据图表的内部是一个独立的数据图表 ',
    widgetTypeId: '自建数据图表',
  },
  en: {
    desc: 'selfChart Widget core is a independent dataChart',
    widgetTypeId: 'Link Chart',
  },
});
export type SelfChartToolkit = WidgetToolkit & {};
export const selfChartToolkit: SelfChartToolkit = {
  create: opt => {
    const widget = dataChartCreator({
      ...opt,
      widgetTypeId: selfChartMeta.widgetTypeId,
    });
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
  // setLinkage() {},
  // closeLinkage() {},
  // setJump() {},
  // closeJump() {},
};
// class SelfChartProto{
//   public widgetTypeId
//   constructor(){
//     return this;
//   }
// }
const selfChartProto = {
  widgetTypeId: 'selfChart',
  meta: selfChartMeta,
  toolkit: selfChartToolkit,
};
export default selfChartProto;
