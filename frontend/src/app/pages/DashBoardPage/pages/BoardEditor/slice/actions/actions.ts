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
import { ChartEditorBaseProps } from 'app/components/ChartEditor';
import widgetManager from 'app/pages/DashBoardPage/components/WidgetManager';
import { getParentRect } from 'app/pages/DashBoardPage/components/Widgets/GroupWidget/utils';
import { boardActions } from 'app/pages/DashBoardPage/pages/Board/slice';
import {
  BoardState,
  ContainerItem,
  Dashboard,
  DataChart,
  TabWidgetContent,
  VizRenderMode,
  WidgetOfCopy,
  WidgetType,
  WidgetTypes,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { editWidgetInfoActions } from 'app/pages/DashBoardPage/pages/BoardEditor/slice';
import { Widget } from 'app/pages/DashBoardPage/types/widgetTypes';
import { createWidgetInfo } from 'app/pages/DashBoardPage/utils/widget';
import { Variable } from 'app/pages/MainPage/pages/VariablePage/slice/types';
import ChartDataView from 'app/types/ChartDataView';
import produce from 'immer';
import { ActionCreators } from 'redux-undo';
import { RootState } from 'types';
import { CloneValueDeep } from 'utils/object';
import { uuidv4 } from 'utils/utils';
import { editBoardStackActions, editDashBoardInfoActions } from '..';
import { ORIGINAL_TYPE_MAP } from '../../../../constants';
import { getChartWidgetDataAsync } from '../../../Board/slice/thunk';
import { EventLayerNode } from '../../components/LayerPanel/LayerTreeItem';
import { getNewDragNodeValue } from '../../components/LayerPanel/utils';
import { getEditChartWidgetDataAsync } from '../thunk';
import { EditBoardState, HistoryEditBoard } from '../types';
import { editWidgetsQueryAction } from './controlActions';

export const clearEditBoardState = () => async dispatch => {
  await dispatch(
    editBoardStackActions.setBoardToEditStack({
      dashBoard: {} as Dashboard,
      widgetRecord: {},
    }),
  );
  await dispatch(editDashBoardInfoActions.clearEditBoardInfo());
  await dispatch(editWidgetInfoActions.clearWidgetInfo());
  dispatch(ActionCreators.clearHistory());
};
export const deleteWidgetsAction = (ids?: string[]) => (dispatch, getState) => {
  const editBoard = getState().editBoard as HistoryEditBoard;
  let selectedIds: string[] = [];
  let shouldDeleteIds: string[] = [];
  let effectTypes: WidgetType[] = [];
  if (ids?.length) {
    selectedIds = ids;
  } else {
    selectedIds = Object.values(editBoard.widgetInfoRecord)
      .filter(WidgetInfo => WidgetInfo.selected)
      .map(WidgetInfo => WidgetInfo.id);
  }
  if (selectedIds.length === 0) return;

  const widgetMap = editBoard.stack.present.widgetRecord;

  while (selectedIds.length > 0) {
    const id = selectedIds.pop();

    if (!id) continue;
    const curWidget = widgetMap[id];
    if (!curWidget) continue;

    const widgetType = curWidget.config.type;
    shouldDeleteIds.push(id);
    effectTypes.push(widgetType);
    // 删除子节点
    (curWidget.config.children || []).forEach(id => {
      selectedIds.push(id);
    });
  }

  dispatch(editBoardStackActions.deleteWidgets(shouldDeleteIds));

  WidgetTypes.forEach(widgetType => {
    if (effectTypes.includes(widgetType)) {
      switch (widgetType) {
        case 'controller':
          dispatch(editWidgetsQueryAction());
          break;
        default:
          break;
      }
    }
  });
};

/* widgetToPositionAsync */
export const widgetsToPositionAction =
  (position: 'top' | 'bottom') => async (dispatch, getState) => {
    const editBoard = getState().editBoard as HistoryEditBoard;
    const widgetMap = editBoard.stack.present.widgetRecord;

    let curIds = Object.values(editBoard.widgetInfoRecord)
      .filter(WidgetInfo => WidgetInfo.selected)
      .map(item => item.id);

    if (curIds.length === 0) return;
    const sortedWidgetsIndex = Object.values(widgetMap)
      .sort((w1, w2) => {
        return w1.config.index - w2.config.index;
      })
      .map(item => item.config.index);
    const baseIndex =
      position === 'top'
        ? sortedWidgetsIndex[sortedWidgetsIndex.length - 1]
        : sortedWidgetsIndex[0];
    const opts = curIds.map((id, index) => {
      const diff = index + 1;
      const newIndex = position === 'top' ? baseIndex + diff : baseIndex - diff;
      return {
        id: id,
        index: newIndex,
      };
    });
    dispatch(editBoardStackActions.changeWidgetsIndex(opts));
  };

// 复制 copy widgets
export const copyWidgetsAction = (wIds?: string[]) => (dispatch, getState) => {
  const { editBoard } = getState();
  const { widgetInfoRecord } = editBoard as EditBoardState;
  const { widgetRecord } = (editBoard as HistoryEditBoard).stack.present;
  let selectedIds: string[] = [];

  if (wIds) {
    selectedIds = wIds;
  } else {
    selectedIds =
      Object.values(widgetInfoRecord)
        .filter(widgetInfo => widgetInfo.selected)
        .map(widgetInfo => widgetInfo.id) || [];
  }
  if (!selectedIds.length) return;
  // 新复制前先清空
  dispatch(editDashBoardInfoActions.clearClipboardWidgets());
  const newWidgets: Record<string, WidgetOfCopy> = {};
  selectedIds.forEach(wid => {
    const widget = widgetRecord[wid];
    newWidgets[wid] = { ...widget, selectedCopy: true };
    if (widget.config.type === 'container') {
      const content = widget.config.content as TabWidgetContent;
      Object.values(content.itemMap).forEach(item => {
        if (item.childWidgetId) {
          const subWidget = widgetRecord[item.childWidgetId];
          newWidgets[subWidget.id] = subWidget;
        }
      });
    }
  });
  dispatch(editDashBoardInfoActions.addClipboardWidgets(newWidgets));
};
// 粘贴 widgets
export const pasteWidgetsAction = () => (dispatch, getState) => {
  const state = getState();
  const {
    boardInfo: { clipboardWidgets },
  } = state.editBoard as EditBoardState;
  const boardState = state.board as BoardState;

  const clipboardWidgetList = Object.values(clipboardWidgets);
  if (!clipboardWidgetList?.length) return;

  const dataChartMap = boardState.dataChartMap;

  const newWidgets: Widget[] = [];

  clipboardWidgetList.forEach(widget => {
    if (widget.selectedCopy) {
      const newWidget = cloneWidget(widget);

      if (newWidget.config.type === 'container') {
        const content = newWidget.config.content as TabWidgetContent;
        Object.values(content.itemMap).forEach(item => {
          if (item.childWidgetId) {
            const subWidget = clipboardWidgets[item.childWidgetId];
            const newSubWidget = cloneWidget(subWidget, newWidget.id);
            item.childWidgetId = newSubWidget.id;
            newWidgets.push(newSubWidget);
          }
        });
      } else if (newWidget.config.type === 'chart') {
        // #issue #588
        let dataChart = dataChartMap[newWidget.datachartId];
        const newDataChart: DataChart = CloneValueDeep({
          ...dataChart,
          id: dataChart.id + Date.now() + '_copy',
        });
        newWidget.config.originalType = 'ownedChart';
        newWidget.datachartId = newDataChart.id;
        dispatch(boardActions.setDataChartToMap([newDataChart]));
      }
      newWidgets.push(newWidget);
    }
  });
  const widgetInfos = newWidgets.map(widget => {
    const widgetInfo = createWidgetInfo(widget.id);
    return widgetInfo;
  });

  dispatch(editWidgetInfoActions.addWidgetInfos(widgetInfos));
  dispatch(editBoardStackActions.addWidgets(newWidgets));

  //
  function cloneWidget(widget: WidgetOfCopy, pId?: string) {
    const newWidget = CloneValueDeep(widget);
    newWidget.id = newWidget.config.originalType + '_' + uuidv4();
    newWidget.parentId = pId || '';
    newWidget.relations = [];
    newWidget.config.name += '_copy';

    delete newWidget.selectedCopy;
    return newWidget as Widget;
  }
};

export const editChartInWidgetAction =
  (props: {
    orgId: string;
    widgetId: string;
    chartName?: string;
    dataChartId: string;
    chartType: 'dataChart' | 'widgetChart';
  }) =>
  async (dispatch, getState) => {
    const {
      orgId,
      widgetId,
      dataChartId,
      chartType,
      chartName = 'widget_chart',
    } = props;
    const board = (getState() as RootState).board!;

    const dataChartMap = board.dataChartMap;
    const dataChart = dataChartMap[dataChartId];
    const viewMap = board?.viewMap;
    const withViewDataChart = produce(dataChart, draft => {
      draft.view = viewMap[draft.viewId];
      draft.name = chartType === 'widgetChart' ? chartName : draft.name;
    });
    const editorProps: ChartEditorBaseProps = {
      widgetId: widgetId,
      dataChartId: dataChartId,
      orgId,
      chartType: chartType,
      container: 'widget',
      originChart: withViewDataChart,
    };
    dispatch(editDashBoardInfoActions.changeChartEditorProps(editorProps));
  };
export const editHasChartWidget =
  (props: { widgetId: string; dataChart: DataChart; view: ChartDataView }) =>
  async (dispatch, getState) => {
    const { dataChart, view, widgetId } = props;
    const editBoard = getState().editBoard as HistoryEditBoard;
    const widgetMap = editBoard.stack.present.widgetRecord;
    const curWidget = widgetMap[widgetId];
    const nextWidget = produce(curWidget, draft => {
      draft.viewIds = [dataChart.viewId];
    });
    dispatch(editBoardStackActions.updateWidget(nextWidget));
    const dataCharts = [dataChart];
    const viewViews = [view];
    dispatch(boardActions.setDataChartToMap(dataCharts));
    dispatch(boardActions.setViewMap(viewViews));
    dispatch(getEditChartWidgetDataAsync({ widgetId: curWidget.id }));
  };

export const closeJumpAction = (widget: Widget) => (dispatch, getState) => {
  const nextConf = produce(widget.config, draft => {
    draft!.jumpConfig!.open = false;
  });
  dispatch(
    editBoardStackActions.updateWidgetConfig({
      wid: widget.id,
      config: nextConf,
    }),
  );
};

export const closeLinkageAction = (widget: Widget) => (dispatch, getState) => {
  const nextConf = produce(widget.config, draft => {
    draft!.linkageConfig!.open = false;
  });
  dispatch(
    editBoardStackActions.updateWidgetConfig({
      wid: widget.id,
      config: nextConf,
    }),
  );
};
export const onComposeGroupAction = (wid?: string) => (dispatch, getState) => {
  const rootState = getState() as RootState;
  const editBoardState = rootState.editBoard as unknown as HistoryEditBoard;
  const stackState = editBoardState.stack.present;
  const curBoard = stackState.dashBoard;
  const cutBoardType = curBoard.config.type;
  const widgetMap = stackState.widgetRecord;
  const widgetInfos = Object.values(editBoardState.widgetInfoRecord || {});
  let selectedIds = widgetInfos.filter(it => it.selected).map(it => it.id);
  wid && selectedIds.push(wid);
  selectedIds = [...new Set(selectedIds)];
  if (!selectedIds.length) return;
  const selectedItemParentIds: string[] = [];
  selectedIds.forEach(id => {
    if (widgetMap[id]) {
      const pid = widgetMap[id].parentId || '';
      if (!selectedItemParentIds.includes(pid)) {
        selectedItemParentIds.push(pid);
      }
    }
  });
  // 只可以同层级的widget 成组 来自不同层级的 不可以成组
  if (selectedItemParentIds.length > 1) return;
  let groupWidget = widgetManager.toolkit(ORIGINAL_TYPE_MAP.group).create({
    boardType: curBoard.config.type,
    children: selectedIds,
    parentId: selectedItemParentIds[0],
  });
  groupWidget.config.rect = getParentRect({
    childIds: selectedIds,
    widgetMap,
    preRect: groupWidget.config.rect,
  });
  const items = selectedIds.map(id => {
    return {
      wid: id,
      nextIndex: widgetMap[id].config.index,
    };
  });
  const widgetInfo = createWidgetInfo(groupWidget.id);
  widgetInfo.selected = true;
  dispatch(editWidgetInfoActions.addWidgetInfos([widgetInfo]));
  dispatch(editBoardStackActions.addWidgets([groupWidget]));

  dispatch(
    editBoardStackActions.changeWidgetsParentId({
      items,
      parentId: groupWidget.id,
    }),
  );
};
export const addVariablesToBoard =
  (variables: Variable[]) => (dispatch, getState) => {
    if (!variables?.length) return;
    const addedViewId = variables[0].viewId;
    if (!addedViewId) return;

    const editBoard = getState().editBoard as HistoryEditBoard;
    const queryVariables = editBoard.stack.present.dashBoard.queryVariables;
    const hasAddedViewId = queryVariables.find(v => v.viewId === addedViewId);
    if (hasAddedViewId) return;
    let newVariables = queryVariables.concat(variables);
    dispatch(editBoardStackActions.updateQueryVariables(newVariables));
  };

export const clearActiveWidgets = () => dispatch => {
  dispatch(editWidgetInfoActions.clearSelectedWidgets());
  dispatch(editDashBoardInfoActions.changeShowBlockMask(true));
};
export const widgetClearLinkageAction =
  (widget: Widget, renderMode: VizRenderMode) => dispatch => {
    const { id, dashboardId } = widget;
    dispatch(
      boardActions.changeWidgetInLinking({
        boardId: dashboardId,
        widgetId: id,
        toggle: false,
      }),
    );
    dispatch(
      boardActions.changeBoardLinkFilter({
        boardId: dashboardId,
        triggerId: id,
        linkFilters: [],
      }),
    );
    const linkRelations = widget.relations.filter(
      re => re.config.type === 'widgetToWidget',
    );
    linkRelations.forEach(link => {
      dispatch(
        getChartWidgetDataAsync({
          boardId: dashboardId,
          widgetId: link.targetId,
          renderMode,
          option: {
            pageInfo: { pageNo: 1 },
          },
        }),
      );
    });
  };
export const editorWidgetClearLinkageAction = (widget: Widget) => dispatch => {
  const { id, dashboardId } = widget;
  dispatch(
    editWidgetInfoActions.changeWidgetInLinking({
      boardId: dashboardId,
      widgetId: id,
      toggle: false,
    }),
  );
  dispatch(
    editDashBoardInfoActions.changeBoardLinkFilter({
      boardId: dashboardId,
      triggerId: id,
      linkFilters: [],
    }),
  );
  const linkRelations = widget.relations.filter(
    re => re.config.type === 'widgetToWidget',
  );
  linkRelations.forEach(link => {
    dispatch(
      getEditChartWidgetDataAsync({
        widgetId: link.targetId,
        option: {
          pageInfo: { pageNo: 1 },
        },
      }),
    );
  });
};

export const dropLayerNodeAction = info => (dispatch, getState) => {
  const dragNode = info.dragNode as EventLayerNode;
  const targetNode = info.node as EventLayerNode;
  const editBoard = getState().editBoard as HistoryEditBoard;
  const widgetMap = editBoard.stack.present.widgetRecord;

  console.log('dragOver', targetNode.dragOver);
  console.log('dragOverGapBottom', targetNode.dragOverGapBottom);
  console.log('dragOverGapTop', targetNode.dragOverGapTop);

  /*
  1 -> group
  2 -> container
  */
  //拖拽节点来自 group
  const newDragVal = getNewDragNodeValue({ widgetMap, dragNode, targetNode });
  if (newDragVal.parentIsGroup) {
    // 拖进 group
    dispatch(
      editBoardStackActions.dropWidgetToGroup({
        sourceId: dragNode.key,
        newIndex: newDragVal.index,
        targetId: newDragVal.parentId,
      }),
    );
  } else {
    // 拖进 tab
    const dragWidget = widgetMap[dragNode.key];
    const newItem: ContainerItem = {
      index: newDragVal.index,
      name: dragWidget.config.name,
      tabId: dragWidget.config.clientId,
      childWidgetId: dragWidget.id,
    };
    dispatch(
      editBoardStackActions.dropWidgetToTab({
        newItem,
        targetId: newDragVal.parentId,
      }),
    );
    return;
  }
};
