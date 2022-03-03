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
import { Modal } from 'antd';
import { ChartEditorBaseProps } from 'app/components/ChartEditor';
import { boardActions } from 'app/pages/DashBoardPage/pages/Board/slice';
import {
  ContainerWidgetContent,
  ControllerWidgetContent,
  Dashboard,
  DataChart,
  RelatedView,
  Relation,
  Widget,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { editWidgetInfoActions } from 'app/pages/DashBoardPage/pages/BoardEditor/slice';
import {
  createInitWidgetConfig,
  createWidget,
} from 'app/pages/DashBoardPage/utils/widget';
import { Variable } from 'app/pages/MainPage/pages/VariablePage/slice/types';
import ChartDataView, { ChartDataViewFieldType } from 'app/types/ChartDataView';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import i18next from 'i18next';
import produce from 'immer';
import { RootState } from 'types';
import { uuidv4 } from 'utils/utils';
import { editBoardStackActions, editDashBoardInfoActions } from '..';
import { BoardType } from '../../../Board/slice/types';
import { ControllerConfig } from '../../components/ControllerWidgetPanel/types';
import { addWidgetsToEditBoard, getEditChartWidgetDataAsync } from '../thunk';
import { HistoryEditBoard } from '../types';
import { editWidgetsQueryAction } from './controlActions';
const { confirm } = Modal;
export const clearEditBoardState = () => async (dispatch, getState) => {
  await dispatch(
    editBoardStackActions.setBoardToEditStack({
      dashBoard: {} as Dashboard,
      widgetRecord: {},
    }),
  );
  await dispatch(editDashBoardInfoActions.clearEditBoardInfo());
  await dispatch(editWidgetInfoActions.clearWidgetInfo());
};
export const deleteWidgetsAction = () => (dispatch, getState) => {
  const editBoard = getState().editBoard as HistoryEditBoard;
  let selectedIds = Object.values(editBoard.widgetInfoRecord)
    .filter(WidgetInfo => WidgetInfo.selected)
    .map(WidgetInfo => WidgetInfo.id);
  dispatch(editBoardStackActions.deleteWidgets(selectedIds));
  let childWidgetIds: string[] = [];
  const widgetMap = editBoard.stack.present.widgetRecord;
  selectedIds.forEach(id => {
    const widgetType = widgetMap[id].config.type;
    if (widgetType === 'container') {
      const content = widgetMap[id].config.content as ContainerWidgetContent;
      Object.values(content.itemMap).forEach(item => {
        if (item.childWidgetId) {
          childWidgetIds.push(item.childWidgetId);
        }
      });
    }
    if (widgetType === 'query') {
      dispatch(editBoardStackActions.changeBoardHasQueryControl(false));
    }
    if (widgetType === 'reset') {
      dispatch(editBoardStackActions.changeBoardHasResetControl(false));
    }
    if (widgetType === 'controller') {
      dispatch(editWidgetsQueryAction({ boardId: editBoard.boardInfo.id }));
    }
  });

  if (childWidgetIds.length > 0) {
    const perStr = 'viz.widget.action.';
    confirm({
      title: i18next.t(perStr + 'confirmDel'),
      content: i18next.t(perStr + 'confirmDel1'),
      onOk() {
        dispatch(editBoardStackActions.deleteWidgets(selectedIds));
      },
      onCancel() {
        childWidgetIds = [];
        return;
      },
    });
  }
};

/* widgetToPositionAsync */
export const widgetToPositionAction =
  (position: 'top' | 'bottom') => async (dispatch, getState) => {
    const editBoard = getState().editBoard as HistoryEditBoard;
    const widgetMap = editBoard.stack.present.widgetRecord;

    let curId = Object.values(editBoard.widgetInfoRecord).find(
      WidgetInfo => WidgetInfo.selected,
    )?.id;

    const sortedWidgets = Object.values(widgetMap)
      .filter(item => !item.parentId)
      .sort((w1, w2) => {
        return w1.config.index - w2.config.index;
      });
    let targetId: string = '';
    if (position === 'top') {
      targetId = sortedWidgets[sortedWidgets.length - 1].id;
    } else {
      targetId = sortedWidgets[0].id;
    }
    if (!curId || targetId === curId) return;
    dispatch(editBoardStackActions.changeTwoWidgetIndex({ curId, targetId }));
  };

export const updateWidgetControllerAction =
  (params: {
    boardId: string;
    boardType: BoardType;
    relations: Relation[];
    name?: string;
    fieldValueType: ChartDataViewFieldType;
    controllerFacadeType: ControllerFacadeTypes;
    views: RelatedView[];
    config: ControllerConfig;
  }) =>
  async (dispatch, getState) => {
    const {
      boardId,
      boardType,
      views,
      config,
      controllerFacadeType,
      relations,
      name,
    } = params;
    const content: ControllerWidgetContent = {
      type: controllerFacadeType,
      relatedViews: views,
      name: name || 'newController',
      config: config,
    };

    const widgetConf = createInitWidgetConfig({
      name: name || 'newController',
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
    dispatch(addWidgetsToEditBoard([widget]));
    dispatch(
      editDashBoardInfoActions.changeControllerPanel({
        type: 'hide',
        widgetId: '',
        controllerType: undefined,
      }),
    );
  };
// changeChartEditorProps

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

export const toggleLockWidgetAction =
  (widget: Widget, bool: boolean) => dispatch => {
    const nextConf = produce(widget.config, draft => {
      draft.lock = bool;
    });
    dispatch(
      editBoardStackActions.updateWidgetConfig({
        wid: widget.id,
        config: nextConf,
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
