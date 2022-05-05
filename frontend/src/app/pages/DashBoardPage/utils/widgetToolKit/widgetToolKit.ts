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
import { createContainerWidget, createControlBtn } from '../widget';
import {
  BoardType,
  ContainerWidgetType,
  MediaWidgetType,
  WidgetBeta3,
  WidgetType,
} from './../../pages/Board/slice/types';
import { createMediaWidget } from './../widget';
import { chartWidgetToolKit } from './chart/index';
import { controllerWidgetToolKit } from './controller';
export interface CreateParamsType {
  boardType: BoardType;
  [key: string]: any;
}
export interface WidgetToolKit {
  create: (option) => WidgetBeta3;
}
export const widgetToolKit = {
  chart: chartWidgetToolKit,
  controller: controllerWidgetToolKit,
  container: {
    create: (opt: {
      dashboardId: string;
      boardType: BoardType;
      type: ContainerWidgetType;
    }) => {
      return createContainerWidget(opt);
    },
  },

  media: {
    create: (opt: {
      dashboardId: string;
      boardType: BoardType;
      type: MediaWidgetType;
    }) => {
      return createMediaWidget(opt);
    },
  },
  query: {
    create: (opt: {
      type: WidgetType;
      boardId: string;
      boardType: BoardType;
    }) => {
      return createControlBtn(opt);
    },
  },
  reset: {
    create: (opt: {
      type: WidgetType;
      boardId: string;
      boardType: BoardType;
    }) => {
      return createControlBtn(opt);
    },
  },
};
