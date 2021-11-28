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
import { FilterSearchParamsWithMatch } from 'app/pages/MainPage/pages/VizPage/slice/types';
import ChartDataView from 'app/types/ChartDataView';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import { FilterSqlOperator } from 'globalConstants';
import produce from 'immer';
import { DeltaStatic } from 'quill';
import { CSSProperties } from 'react';
import { G70 } from 'styles/StyleConstants';
import { v4 as uuidv4 } from 'uuid';
import { convertImageUrl, fillPx } from '.';
import { widgetActionTypeMap } from '../components/WidgetToolBar/config';
import {
  AutoBoardWidgetBackgroundDefault,
  BackgroundDefault,
  BorderDefault,
} from '../constants';
import {
  BackgroundConfig,
  BoardType,
  BorderConfig,
  ChartWidgetContent,
  ContainerItem,
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
  WidgetType,
} from '../pages/Board/slice/types';
import { ControllerConfig } from '../pages/BoardEditor/components/ControllerWidgetPanel/types';

export const VALUE_SPLITTER = '###';

export const createDataChartWidget = (opt: {
  dashboardId: string;
  boardType: BoardType;
  dataChartId: string;
  dataChartConfig: DataChart;
  viewId: string;
  subType: WidgetContentChartType;
}) => {
  const content = createChartWidgetContent(opt.subType);
  const widgetConf = createInitWidgetConfig({
    type: 'chart',
    content: content,
    boardType: opt.boardType,
    name: opt.dataChartConfig.name,
  });
  const widget: Widget = createWidget({
    dashboardId: opt.dashboardId,
    datachartId: opt.dataChartId,
    viewIds: opt.viewId ? [opt.viewId] : [],
    config: widgetConf,
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
    type: opt.type,
    index: opt.index || 0,
    name: opt.name || `${opt.type}_${opt.content.type}`,
    linkageConfig: {
      open: false,
      chartGroupColumns: [],
    },
    autoUpdate: opt.autoUpdate || false,

    frequency: opt.frequency || 60, // 60秒
    rect: createWidgetRect(opt.boardType, opt.type),
    background:
      opt.boardType === 'auto'
        ? AutoBoardWidgetBackgroundDefault
        : BackgroundDefault,
    border: BorderDefault,
    content: opt.content,
    nameConfig: {
      show: true,
      textAlign: 'left',
      ...fontDefault,
    },
    padding: {
      left: 4,
      right: 4,
      top: 20,
      bottom: 4,
    },
  };
};

export const fontDefault = {
  fontFamily: 'PingFang SC',
  fontSize: '12',
  fontWeight: 'normal',
  fontStyle: 'normal',
  color: G70,
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
    id: option.id || uuidv4(),
    dashboardId: option.dashboardId,
    config: option.config,
    datachartId: option.datachartId || '',
    viewIds: option.viewIds || [],
    parentId: option.parentId || '',
    relations: option.relations || [],
  };
  return widget;
};
export const createWidgetInfo = (id: string): WidgetInfo => {
  const widgetInfo: WidgetInfo = {
    id: id,
    loading: false,
    editing: false,
    inLinking: false,
    selected: false,
    rendered: false,
    pageInfo: {
      pageNo: 1,
    },
    selectItems: [],
  };
  return widgetInfo;
};
export const createWidgetRect = (
  boardType: BoardType,
  widgetType: WidgetType,
): RectConfig => {
  if (widgetType === 'controller') {
    return getInitControllerWidgetRect(boardType);
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
export const getInitControllerWidgetRect = (
  boardType: BoardType,
): RectConfig => {
  if (boardType === 'auto') {
    return {
      x: 0,
      y: 0,
      width: 3,
      height: 2,
    };
  } else {
    // free
    return {
      x: 0,
      y: 0,
      width: 300,
      height: 80,
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

export const createFilterWidget = (params: {
  boardId: string;
  boardType: BoardType;
  relations: Relation[];
  name?: string;
  controllerType: ControllerFacadeTypes;
  views: RelatedView[];
  config: ControllerConfig;
  hasVariable: boolean;
}) => {
  const {
    boardId,
    boardType,
    views,
    config,
    controllerType,
    relations,
    name = 'newController',
  } = params;
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

  const widgetId = relations?.[0].sourceId || uuidv4();
  const widget: Widget = createWidget({
    id: widgetId,
    dashboardId: boardId,
    config: widgetConf,
    relations,
  });
  return widget;
};

// TODO chart widget
export const getWidgetMapByServer = (
  widgets: ServerWidget[],
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
    const viewIds = cur.datachartId
      ? [dataChartMap[cur.datachartId].viewId]
      : cur.viewIds;
    try {
      let widget: Widget = {
        ...cur,
        config: JSON.parse(cur.config),
        relations: convertWidgetRelationsToObj(cur.relations),
        viewIds,
      };
      // TODO xld migration about font 5
      widget.config.nameConfig = {
        ...fontDefault,
        ...widget.config.nameConfig,
      };
      // TODO xld migration about filter
      if ((widget.config.type as any) !== 'filter') {
        acc[cur.id] = widget;
      }
      return acc;
    } catch (error) {
      return acc;
    }
  }, {} as Record<string, Widget>);

  const wrappedDataCharts: DataChart[] = [];
  Object.values(widgetMap).forEach(widget => {
    // 处理 widget包含关系
    if (widget.parentId) {
      const parentWidgetId = widget.parentId;
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
    }

    // 处理 controller config visibility依赖关系 id, url参数修改filter
    if (widget.config.type === 'controller') {
      const content = widget.config.content as ControllerWidgetContent;
      // 根据 url参数修改filter 默认值
      if (filterSearchParams) {
        const paramsKey = Object.keys(filterSearchParams);
        const macthKey = isMatchByName ? widget.config.name : widget.id;
        if (paramsKey.includes(macthKey)) {
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
      // 适配filter 的可见性
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

      //处理 assistViewField
      if (typeof content?.config?.assistViewFields === 'string') {
        content.config.assistViewFields = (
          content.config.assistViewFields as string
        ).split(VALUE_SPLITTER);
        // value.split(VALUE_SPLITTER);
      }
    }

    // 处理 自有 chart widget

    if (widget.config.content.type === 'widgetChart') {
      widget.datachartId = widget.config.content.dataChart?.id || '';
      wrappedDataCharts.push(widget.config.content.dataChart!);
      delete widget.config.content.dataChart;
    }
  });

  return {
    widgetMap,
    wrappedDataCharts,
  };
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
    return updateAutoWidgetsRect(boardConfig, widgets, layouts || []);
  } else if (boardConfig.type === 'free') {
    return updateFreeWidgetsRect(widgets);
  }
  return widgets;
};

export const updateAutoWidgetsRect = (
  boardConfig: DashboardConfig,
  widgets: Widget[],
  layouts: ReactGridLayout.Layout[],
): Widget[] => {
  const upDatedWidgets: Widget[] = [];
  const dashWidgetRectYs = layouts.map(ele => ele.y);
  let widgetsCount = dashWidgetRectYs.length;
  let itemYs = [...dashWidgetRectYs];
  widgets.forEach(widget => {
    const itemX =
      (widgetsCount * widget.config.rect.width) % boardConfig.cols.lg;
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

export const convertWidgetRelationsToObj = (
  relations: ServerRelation[] = [],
): Relation[] => {
  return relations.map(relation => {
    try {
      return { ...relation, config: JSON.parse(relation.config) };
    } catch (error) {
      return {
        ...relation,
        config: { RelatedViewMap: {}, filterCovered: false },
      };
    }
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
    // return content.fieldValueType === ChartDataViewFieldType.STRING;
    return true;
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
        // if (!dependWidgetValue) {
        //   return false;
        // }
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

export const getNeedRefreshWidgetsByFilter = (filterWidget: Widget) => {
  const relations = filterWidget.relations;
  const widgetIds = relations
    .filter(ele => ele.config.type === 'controlToWidget')
    .map(ele => ele.targetId);
  return widgetIds;
};

// getWidgetStyle start
export const getWidgetStyle = (boardType: BoardType, widget: Widget) => {
  return boardType === 'auto'
    ? getAutoWidgetStyle(widget)
    : getFreeWidgetStyle(widget);
};

export const getAutoWidgetStyle = (widget: Widget) => {
  const widgetConf = widget.config;
  let widgetStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    ...getBackgroundCss(widgetConf.background),
    ...getBorderCss(widgetConf.border as BorderConfig),
    ...getPaddingCss(widgetConf.padding as WidgetPadding),

    transition: 'all 350ms ease',
  };
  return widgetStyle;
};

export const getFreeWidgetStyle = (widget: Widget) => {
  const widgetConf = widget.config;
  const rect = widgetConf.rect;
  let widgetStyle: CSSProperties = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    ...getBackgroundCss(widgetConf.background),
    ...getBorderCss(widgetConf.border as BorderConfig),
    ...getPaddingCss(widgetConf.padding as WidgetPadding),
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transform: `translate(${rect.x}px, ${rect.y}px)`,
    transformOrigin: ' 0 0',
  };
  return widgetStyle;
};

// getWidgetStyle end
// get some css start
export const getBackgroundCss = (bg: BackgroundConfig) => {
  let css: CSSProperties = {
    backgroundColor: bg.color,
    backgroundImage: `url(${convertImageUrl(bg.image)})`,
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
  config: WidgetConf;
  background?: boolean;
  padding?: boolean;
  border?: boolean;
}) => {
  const backgroundCss = opt.background
    ? getBackgroundCss(opt.config.background)
    : {};
  const paddingCss = opt.padding
    ? getPaddingCss(opt.config.padding as WidgetPadding)
    : {};
  const borderCss = opt.border
    ? getBorderCss(opt.config.border as BorderConfig)
    : {};
  let style: CSSProperties = {
    ...backgroundCss,
    ...paddingCss,
    ...borderCss,
  };
  return style;
};

// get some css end
// filter
export const getCanLinkFilterWidgets = (widgets: Widget[]) => {
  const CanLinkFilterWidgetTypes: WidgetType[] = ['chart', 'media'];
  const CanLinkFilterMediaWidgetTypes: MediaWidgetType[] = ['richText']; // 或者考虑加上 image
  const canLinkWidgets = widgets.filter(widget => {
    if (widget.viewIds.length === 0) {
      return false;
    }
    if (!CanLinkFilterWidgetTypes.includes(widget.config.type)) {
      return false;
    }
    if (
      widget.config.type === 'media' &&
      !CanLinkFilterMediaWidgetTypes.includes(
        widget.config.content.type as MediaWidgetType,
      )
    ) {
      return false;
    }
    return true;
  });
  return canLinkWidgets;
};

export const getWidgetActionList = (widget: Widget) => {
  const canMakeLinkage = widget.config?.jumpConfig?.open;
  const canMakeJump = widget.config?.linkageConfig?.open;
  return [
    {
      key: widgetActionTypeMap.refresh,
      label: '同步数据',
      icon: '',
      disabled: false,
    },
    {
      key: widgetActionTypeMap.fullScreen,
      label: '全屏',
      icon: '',
      disabled: false,
    },
    {
      key: widgetActionTypeMap.delete,
      label: '删除',
      icon: '',
      disabled: false,
    },
    {
      key: widgetActionTypeMap.edit,
      label: '编辑',
      icon: '',
      disabled: false,
    },
    {
      key: widgetActionTypeMap.info,
      label: '信息',
      icon: '',
      disabled: false,
    },
    {
      key: widgetActionTypeMap.makeLinkage,
      label: '设置联动',
      icon: '',
      disabled: !!canMakeLinkage,
    },
    {
      key: widgetActionTypeMap.makeJump,
      label: '设置跳转',
      icon: '',
      disabled: !!canMakeJump,
    },
  ];
};
