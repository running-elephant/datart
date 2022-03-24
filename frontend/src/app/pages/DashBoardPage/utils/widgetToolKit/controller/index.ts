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
  BoardType,
  ControllerWidgetContent,
  RelatedView,
  Relation,
  RelationConfigType,
  Widget,
  WidgetType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { RelatedWidgetItem } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/RelatedWidgets';
import { ControllerConfig } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import { uuidv4 } from 'utils/utils';
import { createInitWidgetConfig, createWidget } from '../../widget';
export const createControllerWidget = (opt: {
  boardId: string;
  boardType: BoardType;
  relations: Relation[];
  name?: string;
  controllerType: ControllerFacadeTypes;
  views: RelatedView[];
  config: ControllerConfig;
  viewIds: string[];
}) => {
  const {
    boardId,
    boardType,
    views,
    config,
    controllerType,
    relations,
    name = 'newController',
    viewIds,
  } = opt;
  const content: ControllerWidgetContent = {
    type: controllerType,
    relatedViews: views,
    name: name,
    config: config,
  };

  const widgetConf = createInitWidgetConfig({
    name: name,
    type: 'controller',
    content: content,
    boardType: boardType,
  });

  const widgetId = relations[0]?.sourceId || uuidv4();
  const widget: Widget = createWidget({
    id: widgetId,
    dashboardId: boardId,
    config: widgetConf,
    relations,
    viewIds,
  });
  return widget;
};

export const getViewIdsInControlConfig = (
  controllerConfig: ControllerConfig,
) => {
  if (!controllerConfig.assistViewFields) return [];
  if (controllerConfig.assistViewFields?.[0]) {
    return [controllerConfig.assistViewFields[0]];
  } else {
    return [];
  }
};
export const getCanLinkControlWidgets = (widgets: Widget[]) => {
  const CanLinkControllerWidgetTypes: WidgetType[] = ['chart', 'controller'];

  const canLinkWidgets = widgets.filter(widget => {
    if (!CanLinkControllerWidgetTypes.includes(widget.config.type)) {
      return false;
    }
    if (widget.viewIds.length === 0) {
      return false;
    }
    return true;
  });
  return canLinkWidgets;
};

const makeControlRelations = (obj: {
  sourceId: string | undefined;
  relatedWidgets: RelatedWidgetItem[];
  widgetMap: Record<string, Widget>;
  config: ControllerConfig;
}) => {
  const sourceId = obj.sourceId || uuidv4();
  const { relatedWidgets, widgetMap, config } = obj;
  const trimRelatedWidgets = relatedWidgets.filter(relatedWidgetItem => {
    return widgetMap[relatedWidgetItem.widgetId];
  });
  let chartWidgets: Widget[] = [];
  let controllerWidgets: Widget[] = [];
  trimRelatedWidgets.forEach(relatedWidgetItem => {
    let widget = widgetMap[relatedWidgetItem.widgetId];
    if (!widget) return false;
    if (widget.config.type === 'chart') {
      chartWidgets.push(widget);
    }
    if (widget.config.type === 'controller') {
      controllerWidgets.push(widget);
    }
  });
  const controlToChartRelations: Relation[] = chartWidgets.map(widget => {
    const relationType: RelationConfigType = 'controlToWidget';
    return {
      sourceId,
      targetId: widget.id,
      config: {
        type: relationType,
        controlToWidget: {
          widgetRelatedViewIds: widget.viewIds,
        },
      },
      id: uuidv4(),
    };
  });
  const controlToCascadeRelations: Relation[] = controllerWidgets.map(
    widget => {
      const relationType: RelationConfigType = 'controlToControlCascade';
      return {
        sourceId,
        targetId: widget.id,
        config: {
          type: relationType,
        },
        id: uuidv4(),
      };
    },
  );
  let newRelations = [...controlToChartRelations, ...controlToCascadeRelations];
  const controllerVisible = (config as ControllerConfig).visibility;
  if (controllerVisible) {
    const { visibilityType, condition } = controllerVisible;
    if (visibilityType === 'condition' && condition) {
      const controlToControlRelation: Relation = {
        sourceId,
        targetId: condition.dependentControllerId,
        config: {
          type: 'controlToControl',
        },
        id: uuidv4(),
      };
      newRelations = newRelations.concat([controlToControlRelation]);
    }
  }
  return newRelations;
};

export const controllerWidgetToolKit = {
  create: createControllerWidget,
  tool: {
    getViewIdsInControlConfig,
    getCanLinkControlWidgets,
    makeControlRelations,
  },
};
