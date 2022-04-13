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
  ContainerItem,
  WidgetType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { FilterSearchParamsWithMatch } from 'app/pages/MainPage/pages/VizPage/slice/types';
import { ChartsEventData } from 'app/types/Chart';
import ChartDataView from 'app/types/ChartDataView';
import { FilterSqlOperator } from 'globalConstants';
import produce from 'immer';
import { DeltaStatic } from 'quill';
import { CSSProperties } from 'react';
import { FONT_FAMILY, G90, WHITE } from 'styles/StyleConstants';
import { uuidv4 } from 'utils/utils';
import { fillPx, getBackgroundImage } from '.';
import {
  AutoBoardWidgetBackgroundDefault,
  BackgroundDefault,
  BorderDefault,
  ButtonBorderDefault,
  LAYOUT_COLS_MAP,
  QueryButtonWidgetBackgroundDefault,
} from '../constants';
import {
  BackgroundConfig,
  BoardType,
  BorderConfig,
  ChartWidgetContent,
  ContainerWidgetContent,
  ContainerWidgetType,
  ControllerWidgetContent,
  DashboardConfig,
  DataChart,
  MediaWidgetContent,
  MediaWidgetType,
  RectConfig,
  RelatedView,
  Relation,
  ServerRelation,
  ServerWidget,
  Widget,
  WidgetConf,
  WidgetContent,
  WidgetContentChartType,
  WidgetInfo,
  WidgetPadding,
} from '../pages/Board/slice/types';
import { StrControlTypes } from '../pages/BoardEditor/components/ControllerWidgetPanel/constants';
import { ControllerConfig } from '../pages/BoardEditor/components/ControllerWidgetPanel/types';
import { BtnActionParams } from '../pages/BoardEditor/slice/actions/controlActions';

export const VALUE_SPLITTER = '###';

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
  });
  return widget;
};
export const createMediaWidget = (opt: {
  dashboardId: string;
  boardType: BoardType;
  type: MediaWidgetType;
}) => {
  const content = createMediaContent(opt.type);
  const widgetConf = createInitWidgetConfig({
    type: 'media',
    content: content,
    boardType: opt.boardType,
  });
  const widget: Widget = createWidget({
    dashboardId: opt.dashboardId,
    config: widgetConf,
  });
  return widget;
};
export const createContainerWidget = (opt: {
  dashboardId: string;
  boardType: BoardType;
  type: ContainerWidgetType;
}) => {
  const content = createContainerWidgetContent(opt.type);
  const widgetConf = createInitWidgetConfig({
    type: 'container',
    content: content,
    boardType: opt.boardType,
  });
  const widget: Widget = createWidget({
    dashboardId: opt.dashboardId,
    config: widgetConf,
  });
  return widget;
};
export const createControlBtn = (opt: BtnActionParams) => {
  const content = { type: opt.type };
  const widgetConf = createInitWidgetConfig({
    name: '',
    type: opt.type as WidgetType,
    content: content,
    boardType: opt.boardType,
  });
  const widget: Widget = createWidget({
    dashboardId: opt.boardId,
    config: widgetConf,
  });
  return widget;
};
export const createInitWidgetConfig = (opt: {
  type: WidgetType;
  content: WidgetContent;
  boardType: BoardType;
  index?: number;
  name?: string;
  autoUpdate?: boolean;
  frequency?: number;
}): WidgetConf => {
  return {
    version: '',
    type: opt.type,
    index: opt.index || 0,
    name: opt.name || '',
    linkageConfig: {
      open: false,
      chartGroupColumns: [],
    },
    autoUpdate: opt.autoUpdate || false,
    lock: false,
    frequency: opt.frequency || 60, // 60秒
    rect: createWidgetRect(opt.boardType, opt.type),
    background:
      opt.boardType === 'auto'
        ? opt.type === 'query'
          ? QueryButtonWidgetBackgroundDefault
          : AutoBoardWidgetBackgroundDefault
        : BackgroundDefault,
    border: ['query', 'reset'].includes(opt.type)
      ? ButtonBorderDefault
      : BorderDefault,
    content: opt.content,
    nameConfig: {
      show: true,
      textAlign: 'left',
      ...fontDefault,
      color: opt.type === 'query' ? WHITE : G90,
    },
    padding: createWidgetPadding(opt.type),
  };
};
export const createWidget = (option: {
  dashboardId: string;
  config: WidgetConf;
  datachartId?: string;
  id?: string;
  viewIds?: string[];
  parentId?: string;
  relations?: Relation[];
}) => {
  const widget: Widget = {
    id: option.id || 'newWidget_' + uuidv4(),
    dashboardId: option.dashboardId,
    config: option.config,
    datachartId: option.datachartId || '',
    viewIds: option.viewIds || [],
    parentId: option.parentId || '',
    relations: option.relations || [],
  };
  return widget;
};
export const fontDefault = {
  fontFamily: FONT_FAMILY,
  fontSize: '14',
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: G90,
};

export const createWidgetInfo = (id: string): WidgetInfo => {
  const widgetInfo: WidgetInfo = {
    id: id,
    loading: false,
    editing: false,
    inLinking: false,
    selected: false,
    errInfo: {} as WidgetInfo['errInfo'],
    rendered: false,
    pageInfo: {
      pageNo: 1,
    },
  };
  return widgetInfo;
};
export const createWidgetPadding = (widgetType: WidgetType) => {
  if (widgetType === 'query' || widgetType === 'reset') {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
  } else if (widgetType === 'controller') {
    return {
      left: 8,
      right: 0,
      top: 0,
      bottom: 0,
    };
  }
  return {
    left: 8,
    right: 8,
    top: 8,
    bottom: 8,
  };
};
export const createWidgetRect = (
  boardType: BoardType,
  widgetType: WidgetType,
): RectConfig => {
  if (widgetType === 'controller') {
    return getInitControllerWidgetRect(boardType);
  }
  if (widgetType === 'query' || widgetType === 'reset') {
    return getInitButtonWidgetRect(boardType);
  }
  if (boardType === 'auto') {
    return {
      x: 0,
      y: 0,
      width: 6,
      height: 6,
    };
  } else {
    // free
    return {
      x: 0,
      y: 0,
      width: 400,
      height: 300,
    };
  }
};

export const getInitButtonWidgetRect = (boardType: BoardType): RectConfig => {
  if (boardType === 'auto') {
    return {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    };
  } else {
    // free
    return {
      x: 0,
      y: 0,
      width: 128,
      height: 32,
    };
  }
};
export const getInitControllerWidgetRect = (
  boardType: BoardType,
): RectConfig => {
  if (boardType === 'auto') {
    return {
      x: 0,
      y: 0,
      width: 3,
      height: 1,
    };
  } else {
    // free
    return {
      x: 0,
      y: 0,
      width: 300,
      height: 32,
    };
  }
};
export const createContainerWidgetContent = (type: ContainerWidgetType) => {
  let content: ContainerWidgetContent = {
    type: type,
    itemMap: {},
  };
  switch (type) {
    case 'tab':
      content.tabConfig = {};
      break;
    case 'carousel':
      content.carouselConfig = {};
      break;
    default:
      break;
  }
  return content;
};

export const createChartWidgetContent = (subType: WidgetContentChartType) => {
  let content: ChartWidgetContent = {
    type: subType,
  };
  return content;
};

export const createMediaContent = (type: MediaWidgetType) => {
  let content: MediaWidgetContent = {
    type: type,
  };
  switch (type) {
    case 'richText':
      content.richTextConfig = {
        content: {
          ops: [
            {
              insert: '\n',
            },
          ],
        } as DeltaStatic,
      };
      break;
    case 'image':
      content.imageConfig = {
        type: 'WIDGET_SIZE',
        src: '',
      };
      break;
    case 'iframe':
      content.iframeConfig = {
        src: '',
      };
      break;
    case 'timer':
      content.iframeConfig = {
        src: '',
      };
      break;
    case 'video':
      content.videoConfig = {
        src: '',
      };
      break;
    default:
      break;
  }
  return content;
};

export const getWidgetInfoMapByServer = (widgetMap: Record<string, Widget>) => {
  const widgetInfoMap = {};
  Object.values(widgetMap).forEach(item => {
    widgetInfoMap[item.id] = createWidgetInfo(item.id);
  });
  return widgetInfoMap;
};

export const updateWidgetsRect = (
  widgets: Widget[],
  boardConfig: DashboardConfig,
  layouts?: ReactGridLayout.Layout[],
) => {
  if (boardConfig.type === 'auto') {
    return updateAutoWidgetsRect(widgets, layouts || []);
  } else if (boardConfig.type === 'free') {
    return updateFreeWidgetsRect(widgets);
  }
  return widgets;
};

export const updateAutoWidgetsRect = (
  widgets: Widget[],
  layouts: ReactGridLayout.Layout[],
): Widget[] => {
  const upDatedWidgets: Widget[] = [];
  const dashWidgetRectYs = layouts.map(ele => ele.y);
  let widgetsCount = dashWidgetRectYs.length;
  let itemYs = [...dashWidgetRectYs];
  widgets.forEach(widget => {
    const itemX =
      (widgetsCount * widget.config.rect.width) % LAYOUT_COLS_MAP.lg;
    const itemY = Math.max(...itemYs, 0);
    const nextRect = {
      ...widget.config.rect,
      x: itemX,
      y: itemY,
    };
    widget = produce(widget, draft => {
      draft.config.rect = nextRect;
    });
    upDatedWidgets.push(widget);
    widgetsCount++;
    itemYs.push(itemY);
  });
  return upDatedWidgets;
};

export const updateFreeWidgetsRect = (widgets: Widget[]) => {
  const upDatedWidgets: Widget[] = [];
  let diffValue = 0; // 避免完全重叠
  widgets.forEach(widget => {
    widget = produce(widget, draft => {
      draft.config.rect.x = draft.config.rect.x + diffValue;
      draft.config.rect.y = draft.config.rect.y + diffValue;
    });
    diffValue += 40;
    upDatedWidgets.push(widget);
  });
  return upDatedWidgets;
};

/**
 * @param widgetRecord 现有的widget
 * @param widgetIds 之前原有的widgetIds
 * @description ''
 */
export const createToSaveWidgetGroup = (
  widgets: Widget[],
  widgetIds: string[],
) => {
  const curWidgetIds = widgets.map(widget => widget.id);

  // 删除的
  const widgetToDelete = widgetIds.filter(id => !curWidgetIds.includes(id));
  // 新增的
  // widgetToCreate
  const widgetToCreate: ServerWidget[] = widgets
    .filter(widget => {
      return !widgetIds.includes(widget.id);
    })
    .map(widget => convertWidgetToSave(widget));
  // 原有的 需要更新的
  const widgetToUpdate: ServerWidget[] = widgets
    .filter(widget => {
      return widgetIds.includes(widget.id);
    })
    .map(widget => convertWidgetToSave(widget));

  return {
    widgetToCreate,
    widgetToUpdate,
    widgetToDelete,
  };
};

export const convertWidgetToSave = (widget: Widget): ServerWidget => {
  return {
    ...widget,
    config: JSON.stringify(widget.config),
    relations: convertWidgetRelationsToSave(widget.relations) || [],
  };
};

export const convertWidgetRelationsToSave = (
  relations: Relation[] = [],
): ServerRelation[] => {
  return relations.map(relation => {
    return { ...relation, config: JSON.stringify(relation.config) };
  });
};

export const convertToWidgetMap = (widgets: Widget[]) => {
  return widgets.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {} as Record<string, Widget>);
};

export const createWidgetInfoMap = (widgets: Widget[]) => {
  return widgets.reduce((acc, cur) => {
    acc[cur.id] = createWidgetInfo(cur.id);
    return acc;
  }, {} as Record<string, WidgetInfo>);
};

export const convertWrapChartWidget = (params: {
  widgetMap: Record<string, Widget>;
  dataChartMap: Record<string, DataChart>;
  viewMap: Record<string, ChartDataView>;
}) => {
  const { widgetMap, dataChartMap } = params;
  const widgets = Object.values(widgetMap).map(widget => {
    if (widget.config.content.type !== 'widgetChart') {
      return widget;
    }
    // widgetChart wrapChartWidget
    const dataChart = dataChartMap[widget.datachartId];
    const newWidget = produce(widget, draft => {
      draft.datachartId = '';
      (draft.config.content as ChartWidgetContent).dataChart = dataChart;
    });
    return newWidget;
  });
  return widgets;
};

/**
 * @param ''
 * @description 'get all filter widget of board'
 */
export const getAllControlWidget = (widgetMap: Record<string, Widget>) => {
  const controlWidgetMap = Object.values(widgetMap)
    .filter(widget => widget.config.type === 'controller')
    .reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {} as Record<string, Widget>);
  return controlWidgetMap;
};
export const getOtherStringControlWidgets = (
  allWidgets: Widget[],
  widgetId: string | undefined,
) => {
  const allFilterWidgets = allWidgets.filter(ele => {
    if (ele.config.type !== 'controller') {
      return false;
    }
    const content = ele.config.content as ControllerWidgetContent;
    return StrControlTypes.includes(content.type);
  });
  if (!widgetId) {
    return allFilterWidgets;
  } else {
    return allFilterWidgets.filter(ele => ele.id !== widgetId);
  }
};

/**
 * @param ''
 * @description 'get showing controller by all filterWidget of board'
 */
export const getVisibleControlWidgetIds = (
  controlWidgetMap: Record<string, Widget>,
) => {
  const widgets = Object.values(controlWidgetMap);
  const visibleWidgets = getNoHiddenControllers(widgets);
  const visibleFreeWidgetIds = visibleWidgets
    .sort((a, b) => a.config.index - b.config.index)
    .map(w => w.id);
  return {
    visibleFreeWidgetIds,
  };
};

export const getLayoutWidgets = (widgetMap: Record<string, Widget>) => {
  const noSubWidgets = Object.values(widgetMap).filter(w => !w.parentId);
  const layoutWidgets = getNoHiddenControllers(noSubWidgets);
  return layoutWidgets;
};

export const getNoHiddenControllers = (widgets: Widget[]) => {
  const noHiddenControlWidgets = widgets.filter(w => {
    if (w.config.type !== 'controller') {
      return true;
    }
    const content = w.config.content as ControllerWidgetContent;
    const visibility = content.config.visibility;
    if (visibility.visibilityType === 'show') {
      return true;
    }
    if (visibility.visibilityType === 'hide') {
      return false;
    }
    if (visibility.visibilityType === 'condition') {
      const condition = content.config.visibility.condition;
      if (condition) {
        const {
          dependentControllerId: dependentFilterId,
          relation,
          value: targetValue,
        } = condition;
        const dependWidget = widgets.find(
          widget => widget.id === dependentFilterId,
        );
        if (!dependWidget) {
          return false;
        }
        const content = dependWidget.config.content as ControllerWidgetContent;
        const dependWidgetValue = content.config.controllerValues?.[0];
        if (relation === FilterSqlOperator.Equal) {
          return targetValue === dependWidgetValue;
        }
        if (relation === FilterSqlOperator.NotEqual) {
          return targetValue !== dependWidgetValue;
        }
        return false;
      }
      return false;
    }
    return false;
  });
  return noHiddenControlWidgets;
};

export const getNeedRefreshWidgetsByController = (controller: Widget) => {
  const relations = controller.relations;
  const widgetIds = relations
    .filter(ele => ele.config.type === 'controlToWidget')
    .map(ele => ele.targetId);
  return widgetIds;
};
export const getCascadeControllers = (controller: Widget) => {
  const relations = controller.relations;
  const ids = relations
    .filter(ele => ele.config.type === 'controlToControlCascade')
    .map(ele => ele.targetId);
  return ids;
};

export const getFreeWidgetStyle = (widget: Widget) => {
  const widgetConf = widget.config;
  const rect = widgetConf.rect;
  let widgetStyle: CSSProperties = {
    position: 'absolute',
    left: fillPx(rect.x),
    top: fillPx(rect.y),
    display: 'flex',
    flexDirection: 'column',
    width: fillPx(rect.width),
    height: fillPx(rect.height),
    zIndex: widgetConf.index,
    // transform: `translate(${rect.x}px, ${rect.y}px)`,
    transformOrigin: ' 0 0',
  };
  return widgetStyle;
};

// getWidgetStyle end
// get some css start
export const getBackgroundCss = (bg: BackgroundConfig) => {
  let css: CSSProperties = {
    backgroundColor: bg.color,
    backgroundImage: getBackgroundImage(bg.image),
    backgroundRepeat: bg.repeat,
    backgroundSize: bg.size,
  };
  return css;
};

export const getBorderCss = (bd: BorderConfig) => {
  let css: CSSProperties = {
    borderColor: bd?.color,
    borderStyle: bd?.style,
    borderWidth: fillPx(bd?.width),
    borderRadius: fillPx(bd?.radius),
  };
  return css;
};

export const getPaddingCss = (pd: WidgetPadding) => {
  let css: CSSProperties = {
    paddingTop: pd?.top,
    paddingLeft: pd?.left,
    paddingBottom: pd?.bottom,
    paddingRight: pd?.right,
  };
  return css;
};

export const getWidgetSomeStyle = (opt: {
  background: BackgroundConfig;
  padding: WidgetPadding;
  border: BorderConfig;
}) => {
  const backgroundCss = getBackgroundCss(opt.background);
  const paddingCss = getPaddingCss(opt.padding as WidgetPadding);
  const borderCss = getBorderCss(opt.border as BorderConfig);
  let style: CSSProperties = {
    ...backgroundCss,
    ...paddingCss,
    ...borderCss,
  };
  return style;
};

export const getLinkedColumn = (
  targetWidgetId: string,
  triggerWidget: Widget,
) => {
  const relations = triggerWidget.relations;
  const relation = relations.find(item => item.targetId === targetWidgetId);

  return (
    relation?.config?.widgetToWidget?.linkerColumn ||
    relation?.config?.widgetToWidget?.triggerColumn ||
    ''
  );
};

// TODO chart widget
export const getWidgetMap = (
  widgets: Widget[],
  dataCharts: DataChart[],
  filterSearchParamsMap?: FilterSearchParamsWithMatch,
) => {
  const filterSearchParams = filterSearchParamsMap?.params,
    isMatchByName = filterSearchParamsMap?.isMatchByName;
  const dataChartMap = dataCharts.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {} as Record<string, DataChart>);
  const widgetMap = widgets.reduce((acc, cur) => {
    // issues #601
    const chartViewId = dataChartMap[cur.datachartId]?.viewId;
    const viewIds = chartViewId ? [chartViewId] : cur.viewIds;
    acc[cur.id] = {
      ...cur,
      viewIds,
    };
    return acc;
  }, {} as Record<string, Widget>);

  const wrappedDataCharts: DataChart[] = [];
  const controllerWidgets: Widget[] = []; // use for reset button
  const widgetList = Object.values(widgetMap);

  // 处理 widget包含关系 containerWidget 被包含的 widget.parentId 不为空
  widgetList
    .filter(w => w.parentId)
    .forEach(widget => {
      const parentWidgetId = widget.parentId!;
      const childTabId = widget.config.tabId as string;
      const curItem = (
        widgetMap[parentWidgetId].config.content as ContainerWidgetContent
      ).itemMap[childTabId];
      if (curItem) {
        curItem.childWidgetId = widget.id;
        curItem.name = widget.config.name;
      } else {
        let newItem: ContainerItem = {
          tabId: childTabId,
          name: widget.config.name,
          childWidgetId: widget.id,
        };
        (
          widgetMap[parentWidgetId].config.content as ContainerWidgetContent
        ).itemMap[childTabId] = newItem;
      }
    });

  // 处理 controller config visibility依赖关系 id, url参数修改filter
  widgetList
    .filter(w => w.config.type === 'controller')
    .forEach(widget => {
      const content = widget.config.content as ControllerWidgetContent;
      // 根据 url参数修改filter 默认值
      if (filterSearchParams) {
        const paramsKey = Object.keys(filterSearchParams);
        const matchKey = isMatchByName ? widget.config.name : widget.id;
        if (paramsKey.includes(matchKey)) {
          const _value = isMatchByName
            ? filterSearchParams[widget.config.name]
            : filterSearchParams[widget.id];
          switch (content?.type) {
            case ControllerFacadeTypes.RangeTime:
              if (
                content.config.controllerDate &&
                content.config.controllerDate?.startTime &&
                content.config.controllerDate?.endTime
              ) {
                content.config.controllerDate.startTime.exactValue =
                  _value?.[0];
                content.config.controllerDate.endTime.exactValue = _value?.[0];
              }
              break;
            default:
              content.config.controllerValues = _value || [];
              break;
          }
        }
      }

      // 通过widget.relation 那里面的 targetId确定 关联controllerWidget 的真实ID
      const { visibilityType: visibility, condition } =
        content.config.visibility;
      const { relations } = widget;
      if (visibility === 'condition' && condition) {
        const dependentFilterId = relations
          .filter(re => re.config.type === 'controlToControl')
          .map(re => re.targetId)?.[0];
        if (dependentFilterId) {
          condition.dependentControllerId = dependentFilterId;
        }
      }
      controllerWidgets.push(widget);
    });

  // 处理 自有 chart widgetControl
  widgetList
    .filter(w => w.config.content.type === 'widgetChart')
    .forEach(widget => {
      let content = widget.config.content as ChartWidgetContent;
      const self_dataChartId = `widget_${widget.dashboardId}_${widget.id}`;
      content.dataChart!.id = self_dataChartId;
      widget.datachartId = self_dataChartId;
      wrappedDataCharts.push(content.dataChart!);
      delete content.dataChart;
    });

  return {
    widgetMap,
    wrappedDataCharts,
    controllerWidgets,
  };
};

export const getValueByRowData = (
  data: ChartsEventData | undefined,
  fieldName: string,
) => {
  let toCaseField = fieldName;
  return data?.rowData[toCaseField];
};
