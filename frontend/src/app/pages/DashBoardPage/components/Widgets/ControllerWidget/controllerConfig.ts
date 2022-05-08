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

import {
  RectConfig,
  Relation,
  RelationConfigType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { RelatedWidgetItem } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/RelatedWidgets';
import { ControllerConfig } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import {
  Widget,
  WidgetCreateProps,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { getTheWidgetFiltersAndParams } from 'app/pages/DashBoardPage/utils';
import { ChartDataRequest } from 'app/types/ChartDataRequest';
import ChartDataView from 'app/types/ChartDataView';
import { transformToViewConfig } from 'app/utils/internalChartHelper';
import { uuidv4 } from 'utils/utils';
import widgetManager from '../../WidgetManager';
import { initTitleTpl, widgetTpl } from '../../WidgetManager/utils/init';

export const controlWidgetTpl = (opt: WidgetCreateProps) => {
  const widget = widgetTpl();
  widget.id = opt.relations?.[0]?.sourceId || widget.id;
  widget.parentId = opt.parentId || '';
  widget.dashboardId = opt.dashboardId || '';
  widget.datachartId = opt.datachartId || '';
  widget.viewIds = opt.viewIds || [];
  widget.relations = opt.relations || [];
  // widget.config.controllable = true;
  // widget.config.canWrapped = false;
  widget.config.content = opt.content;
  widget.config.type = 'controller';
  if (opt.boardType === 'auto') {
    const rect: RectConfig = {
      x: 0,
      y: 0,
      width: 3,
      height: 1,
    };
    widget.config.rect = rect;
    widget.config.mRect = { ...rect, width: 6 };
  } else {
    const rect: RectConfig = {
      x: 0,
      y: 0,
      width: 300,
      height: 32,
    };
    widget.config.rect = rect;
  }
  widget.config.content = opt.content; //controller
  widget.config.jsonConfig.props = [{ ...initTitleTpl() }];

  return widget;
};
export const getCanLinkControlWidgets = (widgets: Widget[]) => {
  const canLinkWidgets = widgets.filter(widget => {
    const controllable = widgetManager.meta(
      widget.config.widgetTypeId,
    ).controllable;
    if (!controllable) return false;
    if (widget.viewIds.length === 0) return false;
    return true;
  });
  return canLinkWidgets;
};
export const makeControlRelations = (obj: {
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
export const getControlOptionQueryParams = (obj: {
  view: ChartDataView;
  columns: string[];
  curWidget: Widget;
  widgetMap: Record<string, Widget>;
}) => {
  const viewConfigs = transformToViewConfig(obj.view?.config);
  const { filterParams, variableParams } = getTheWidgetFiltersAndParams({
    chartWidget: obj.curWidget,
    widgetMap: obj.widgetMap,
    params: undefined,
  });
  const requestParams: ChartDataRequest = {
    ...viewConfigs,
    aggregators: [],
    filters: filterParams,
    groups: [],
    columns: [...new Set(obj.columns)],
    pageInfo: {
      pageNo: 1,
      pageSize: 99999999,
      total: 99999999,
    },
    orders: [],
    keywords: ['DISTINCT'],
    viewId: obj.view.id,
  };
  if (variableParams) {
    requestParams.params = variableParams;
  }
  return requestParams;
};
