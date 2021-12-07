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
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import { ControllerConfig } from '../../pages/BoardEditor/components/ControllerWidgetPanel/types';
import {
  createContainerWidget,
  createControlBtn,
  createControllerWidget,
  createDataChartWidget,
} from '../widget';
import {
  BoardType,
  ContainerWidgetType,
  DataChart,
  MediaWidgetType,
  RelatedView,
  Relation,
  Widget,
  WidgetContentChartType,
  WidgetType,
} from './../../pages/Board/slice/types';
import { createMediaWidget } from './../widget';
export interface CreateParamsType {
  boardType: BoardType;
  [key: string]: any;
}
export interface WidgetToolKit {
  create: (option) => Widget;
}
export const widgetToolKit = {
  chart: {
    create: (opt: {
      boardType: BoardType;
      dashboardId: string;
      dataChartId: string;
      dataChartConfig: DataChart;
      viewId: string;
      subType: WidgetContentChartType;
    }) => {
      return createDataChartWidget(opt);
    },
  },
  container: {
    create: (opt: {
      dashboardId: string;
      boardType: BoardType;
      type: ContainerWidgetType;
    }) => {
      return createContainerWidget(opt);
    },
  },
  controller: {
    create: (opt: {
      boardId: string;
      boardType: BoardType;
      relations: Relation[];
      name?: string;
      controllerType: ControllerFacadeTypes;
      views: RelatedView[];
      config: ControllerConfig;
      hasVariable: boolean;
    }) => {
      return createControllerWidget(opt);
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
