import { createAsyncThunk } from '@reduxjs/toolkit';
import { boardActions } from 'app/pages/DashBoardPage/pages/Board/slice';
import {
  BoardState,
  ContainerWidgetContent,
  ControllerWidgetContent,
  DataChart,
  getDataOption,
  SaveDashboard,
  ServerDatachart,
  Widget,
  WidgetData,
  WidgetInfo,
  WidgetOfCopy,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getChartWidgetRequestParams } from 'app/pages/DashBoardPage/utils';
import {
  getChartDataView,
  getDashBoardByResBoard,
  getDataChartsByServer,
  getInitBoardInfo,
} from 'app/pages/DashBoardPage/utils/board';
import {
  convertWrapChartWidget,
  createToSaveWidgetGroup,
  createWidgetInfo,
  createWidgetInfoMap,
  getWidgetInfoMapByServer,
  getWidgetMapByServer,
} from 'app/pages/DashBoardPage/utils/widget';
import { getControlOptionQueryParams } from 'app/pages/DashBoardPage/utils/widgetToolKit/chart';
import { widgetToolKit } from 'app/pages/DashBoardPage/utils/widgetToolKit/widgetToolKit';
import { Variable } from 'app/pages/MainPage/pages/VariablePage/slice/types';
import ChartDataView from 'app/types/ChartDataView';
import { View } from 'app/types/View';
import { filterSqlOperatorName } from 'app/utils/internalChartHelper';
import { ActionCreators } from 'redux-undo';
import { RootState } from 'types';
import { CloneValueDeep } from 'utils/object';
import { request } from 'utils/request';
import { errorHandle, uuidv4 } from 'utils/utils';
import {
  editBoardStackActions,
  editDashBoardInfoActions,
  editWidgetDataActions,
  editWidgetInfoActions,
} from '.';
import { BoardInfo, BoardType, ServerDashboard } from '../../Board/slice/types';
import { getDataChartMap } from './../../../utils/board';
import { updateWidgetsRect } from './../../../utils/widget';
import { addVariablesToBoard } from './actions/actions';
import {
  boardInfoState,
  editBoardStackState,
  selectEditBoard,
} from './selectors';
import { EditBoardState, HistoryEditBoard } from './types';

/**
 * @param ''
 * @description '先拿本地缓存，没有缓存再去服务端拉数据'
 */
export const getEditBoardDetail = createAsyncThunk<
  null,
  string,
  { state: RootState }
>(
  'editBoard/getEditBoardDetail',
  async (dashboardId, { getState, dispatch }) => {
    if (!dashboardId) {
      return null;
    }
    //2 从 editor 内存中取
    const editDashboard = selectEditBoard(
      getState() as unknown as {
        editBoard: HistoryEditBoard;
      },
    );
    if (editDashboard?.id === dashboardId) {
      return null;
    }
    dispatch(ActionCreators.clearHistory());
    dispatch(fetchEditBoardDetail(dashboardId));
    return null;
  },
);

export const fetchEditBoardDetail = createAsyncThunk<
  null,
  string,
  { state: RootState }
>('editBoard/fetchEditBoardDetail', async (dashboardId, { dispatch }) => {
  if (!dashboardId) {
    return null;
  }
  try {
    const { data } = await request<ServerDashboard>(
      `/viz/dashboards/${dashboardId}`,
    );
    const dashboard = getDashBoardByResBoard(data);

    const {
      datacharts: serverDataCharts,
      views: serverViews,
      widgets: serverWidgets,
    } = data;
    // TODO
    const dataCharts: DataChart[] = getDataChartsByServer(serverDataCharts);
    const { widgetMap, wrappedDataCharts } = getWidgetMapByServer(
      serverWidgets,
      dataCharts,
    );
    const widgetInfoMap = getWidgetInfoMapByServer(widgetMap);
    // TODO xld migration about filter
    const widgetIds = serverWidgets.map(w => w.id);
    const boardInfo = getInitBoardInfo({ id: dashboard.id, widgetIds });
    // datacharts

    const allDataCharts: DataChart[] = dataCharts.concat(wrappedDataCharts);
    dispatch(boardActions.setDataChartToMap(allDataCharts));

    const viewViews = getChartDataView(serverViews, allDataCharts);

    dispatch(boardActions.updateViewMap(viewViews));
    // BoardInfo
    dispatch(editDashBoardInfoActions.initEditBoardInfo(boardInfo));
    // widgetInfoRecord
    dispatch(editWidgetInfoActions.addWidgetInfos(widgetInfoMap));
    //dashBoard,widgetRecord
    dispatch(
      editBoardStackActions.setBoardToEditStack({
        dashBoard: dashboard,
        widgetRecord: widgetMap,
      }),
    );
    return null;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

/**
 * @param boardId string
 * @description '更新保存 board'
 */
export const toUpdateDashboard = createAsyncThunk<
  any,
  { boardId: string; callback: () => void },
  { state: RootState }
>(
  'editBoard/toUpdateDashboard',
  async ({ boardId, callback }, { getState, dispatch }) => {
    const { dashBoard, widgetRecord } = editBoardStackState(
      getState() as unknown as {
        editBoard: HistoryEditBoard;
      },
    );
    const boardInfo = boardInfoState(
      getState() as { editBoard: EditBoardState },
    );
    const boardState = getState() as unknown as { board: BoardState };
    try {
      const { dataChartMap, viewMap } = boardState.board;
      const widgets = convertWrapChartWidget({
        widgetMap: widgetRecord,
        dataChartMap,
        viewMap,
      });
      const group = createToSaveWidgetGroup(widgets, boardInfo.widgetIds);
      const updateData: SaveDashboard = {
        ...dashBoard,
        config: JSON.stringify(dashBoard.config),
        widgetToCreate: group.widgetToCreate,
        widgetToUpdate: group.widgetToUpdate,
        widgetToDelete: group.widgetToDelete,
      };

      await request<any>({
        url: `viz/dashboards/${dashBoard.id}`,
        method: 'put',
        data: updateData,
      });
      callback();
    } catch (error) {
      errorHandle(error);
    }
  },
);
/**
 * @param 'Widget[]'
 * @description '添加 widget 到board'
 */
export const addWidgetsToEditBoard = createAsyncThunk<
  null,
  Widget[],
  { state: RootState }
>('editBoard/addWidgetsToEditBoard', (widgets, { getState, dispatch }) => {
  const { dashBoard } = editBoardStackState(
    getState() as unknown as {
      editBoard: HistoryEditBoard;
    },
  );
  const { layouts } = boardInfoState(
    getState() as { editBoard: EditBoardState },
  );
  const widgetInfoMap = createWidgetInfoMap(widgets);
  const updatedWidgets = updateWidgetsRect(widgets, dashBoard.config, layouts);
  // widgetInfoRecord
  dispatch(editWidgetInfoActions.addWidgetInfos(widgetInfoMap));
  // WidgetRecord
  dispatch(editBoardStackActions.addWidgets(updatedWidgets));
  return null;
});

// addDataChartWidgets
export const addDataChartWidgets = createAsyncThunk<
  null,
  { boardId: string; chartIds: string[]; boardType: BoardType },
  { state: RootState }
>(
  'editBoard/addDataChartWidgets',
  async ({ boardId, chartIds, boardType }, { getState, dispatch }) => {
    const {
      data: { datacharts, views, viewVariables },
    } = await request<{
      datacharts: ServerDatachart[];
      views: View[];
      viewVariables: Record<string, Variable[]>;
    }>({
      url: `viz/datacharts?datachartIds=${chartIds.join()}`,
      method: 'get',
    });
    const dataCharts: DataChart[] = getDataChartsByServer(datacharts);
    const dataChartMap = getDataChartMap(dataCharts);
    const viewViews = getChartDataView(views, dataCharts);
    dispatch(boardActions.setDataChartToMap(dataCharts));
    dispatch(boardActions.setViewMap(viewViews));

    const widgets = chartIds.map(dcId => {
      let widget = widgetToolKit.chart.create({
        dashboardId: boardId,
        boardType: boardType,
        dataChartId: dcId,
        dataChartConfig: dataChartMap[dcId],
        viewId: dataChartMap[dcId].viewId,
        subType: 'dataChart',
      });
      return widget;
    });
    dispatch(addWidgetsToEditBoard(widgets));

    Object.values(viewVariables).forEach(variables => {
      dispatch(addVariablesToBoard(variables));
    });
    return null;
  },
);

// addDataChartWidgets
export const addWrapChartWidget = createAsyncThunk<
  null,
  {
    boardId: string;
    chartId: string;
    boardType: BoardType;
    dataChart: DataChart;
    view: ChartDataView;
  },
  { state: RootState }
>(
  'editBoard/addWrapChartWidget',
  async (
    { boardId, chartId, boardType, dataChart, view },
    { getState, dispatch },
  ) => {
    const dataCharts = [dataChart];
    const viewViews = [view];
    dispatch(boardActions.setDataChartToMap(dataCharts));
    dispatch(boardActions.setViewMap(viewViews));
    let widget = widgetToolKit.chart.create({
      dashboardId: boardId,
      boardType: boardType,
      dataChartId: chartId,
      viewId: view.id,
      dataChartConfig: dataChart,
      subType: 'widgetChart',
    });
    dispatch(addWidgetsToEditBoard([widget]));
    dispatch(addVariablesToBoard(view.variables));
    return null;
  },
);

export const renderedEditWidgetAsync = createAsyncThunk<
  null,
  { boardId: string; widgetId: string },
  { state: RootState }
>(
  'editBoard/renderedEditWidgetAsync',
  async ({ boardId, widgetId }, { getState, dispatch, rejectWithValue }) => {
    const { widgetRecord: WidgetMap } = editBoardStackState(
      getState() as unknown as {
        editBoard: HistoryEditBoard;
      },
    );
    const curWidget = WidgetMap[widgetId];
    if (!curWidget) return null;

    dispatch(editWidgetInfoActions.renderedWidgets([widgetId]));

    if (curWidget.config.type === 'container') {
      const content = curWidget.config.content as ContainerWidgetContent;
      let subWidgetIds: string[] = [];
      subWidgetIds = Object.values(content.itemMap)
        .map(item => item.childWidgetId)
        .filter(id => !!id);
      // 1 widget render
      dispatch(editWidgetInfoActions.renderedWidgets(subWidgetIds));
      //  2 widget getData
      subWidgetIds.forEach(wid => {
        dispatch(getEditWidgetData({ widget: WidgetMap[wid] }));
      });
      return null;
    }
    // 2 widget getData
    dispatch(getEditWidgetData({ widget: curWidget }));
    return null;
  },
);

// 复制 copy
export const copyWidgetByIds = createAsyncThunk<
  null,
  string[],
  { state: RootState }
>(
  'editBoard/copyWidgets',
  async (wIds, { getState, dispatch, rejectWithValue }) => {
    const { widgetRecord } = editBoardStackState(
      getState() as unknown as {
        editBoard: HistoryEditBoard;
      },
    );

    // 新复制前先清空
    dispatch(editDashBoardInfoActions.clearClipboardWidgets());
    const newWidgets: Record<string, WidgetOfCopy> = {};
    wIds.forEach(wid => {
      const widget = widgetRecord[wid];
      newWidgets[wid] = { ...widget, selectedCopy: true };
      if (widget.config.type === 'container') {
        const content = widget.config.content as ContainerWidgetContent;
        Object.values(content.itemMap).forEach(item => {
          if (item.childWidgetId) {
            const subWidget = widgetRecord[item.childWidgetId];
            newWidgets[subWidget.id] = subWidget;
          }
        });
      }
    });
    dispatch(editDashBoardInfoActions.addClipboardWidgets(newWidgets));
    return null;
  },
);

// 粘贴
export const pasteWidgets = createAsyncThunk(
  'editBoard/pasteWidgets',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { clipboardWidgets } = boardInfoState(
      getState() as {
        editBoard: EditBoardState;
      },
    );
    const boardState = getState() as unknown as { board: BoardState };
    const dataChartMap = boardState.board.dataChartMap;
    const newWidgets: Widget[] = [];
    Object.values(clipboardWidgets).forEach(widget => {
      if (widget.selectedCopy) {
        const newWidget = cloneWidget(widget);
        newWidgets.push(newWidget);
        if (newWidget.config.type === 'container') {
          const content = newWidget.config.content as ContainerWidgetContent;
          Object.values(content.itemMap).forEach(item => {
            if (item.childWidgetId) {
              const subWidget = clipboardWidgets[item.childWidgetId];
              const newSubWidget = cloneWidget(subWidget, newWidget.id);
              newWidgets.push(newSubWidget);
            }
          });
        } else if (newWidget.config.type === 'chart') {
          // #issues 588
          let dataChart = dataChartMap[newWidget.datachartId];
          const newDataChart: DataChart = CloneValueDeep({
            ...dataChart,
            id: dataChart.id + Date.now() + '_copy',
          });
          newWidget.datachartId = newDataChart.id;
          dispatch(boardActions.setDataChartToMap([newDataChart]));
        }
      }
    });
    const widgetInfoMap: Record<string, WidgetInfo> = {};
    newWidgets.forEach(widget => {
      const widgetInfo = createWidgetInfo(widget.id);
      widgetInfoMap[widget.id] = widgetInfo;
    });

    dispatch(editWidgetInfoActions.addWidgetInfos(widgetInfoMap));
    dispatch(editBoardStackActions.addWidgets(newWidgets));

    //
    function cloneWidget(widget: WidgetOfCopy, pId?: string) {
      const newWidget = CloneValueDeep(widget);
      newWidget.id = uuidv4();
      newWidget.parentId = pId || '';
      newWidget.relations = [];
      newWidget.config.name += '_copy';
      delete newWidget.selectedCopy;
      return newWidget as Widget;
    }
    return null;
  },
);

//
export const uploadBoardImage = createAsyncThunk<
  null,
  { boardId: string; formData: FormData; resolve: (url: string) => void }
>(
  'editBoard/uploadBoardImage',
  async ({ boardId, formData, resolve }, { getState, dispatch }) => {
    try {
      const { data } = await request<string>({
        url: `files/viz/image?ownerType=${'DASHBOARD'}&ownerId=${boardId}&fileName=${uuidv4()}`,
        method: 'POST',
        data: formData,
      });
      resolve(data);
      return null;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getEditWidgetData = createAsyncThunk<
  null,
  { widget: Widget; option?: getDataOption },
  { state: RootState }
>(
  'editBoard/getEditWidgetData',
  ({ widget, option }, { getState, dispatch }) => {
    dispatch(editWidgetInfoActions.renderedWidgets([widget.id]));
    if (widget.config.type === 'chart') {
      dispatch(getEditChartWidgetDataAsync({ widgetId: widget.id, option }));
    }
    if (widget.config.type === 'controller') {
      dispatch(getEditControllerOptions(widget.id));
    }
    return null;
  },
);

export const getEditChartWidgetDataAsync = createAsyncThunk<
  null,
  {
    widgetId: string;
    option?: getDataOption;
  },
  { state: RootState }
>(
  'editBoard/getEditChartWidgetDataAsync',
  async ({ widgetId, option }, { getState, dispatch, rejectWithValue }) => {
    const rootState = getState() as RootState;
    dispatch(editWidgetInfoActions.renderedWidgets([widgetId]));
    const stackEditBoard = rootState.editBoard as unknown as HistoryEditBoard;
    const { widgetRecord: widgetMap } = stackEditBoard.stack.present;
    const editBoard = rootState.editBoard;
    const boardInfo = editBoard?.boardInfo as BoardInfo;
    const boardState = rootState.board as BoardState;
    const widgetInfo = editBoard?.widgetInfoRecord[widgetId];
    const viewMap = boardState.viewMap;
    const curWidget = widgetMap[widgetId];

    if (!curWidget) return null;
    const dataChartMap = boardState.dataChartMap;
    const boardLinkFilters = boardInfo.linkFilter;

    let requestParams = getChartWidgetRequestParams({
      widgetId,
      widgetMap,
      viewMap,
      option,
      widgetInfo,
      dataChartMap,
      boardLinkFilters,
    });
    if (!requestParams) {
      return null;
    }
    let widgetData;
    try {
      const { data } = await request<WidgetData>({
        method: 'POST',
        url: `data-provider/execute`,
        data: requestParams,
      });
      widgetData = { ...data, id: widgetId };
      dispatch(
        editWidgetDataActions.setWidgetData(
          filterSqlOperatorName(requestParams, widgetData) as WidgetData,
        ),
      );
      dispatch(
        editWidgetInfoActions.changePageInfo({
          widgetId,
          pageInfo: data.pageInfo,
        }),
      );
      dispatch(
        editWidgetInfoActions.setWidgetErrInfo({
          widgetId,
          errInfo: undefined,
        }),
      );
    } catch (error) {
      dispatch(
        editWidgetInfoActions.setWidgetErrInfo({
          widgetId,
          errInfo: (error as any)?.message as any,
        }),
      );
      dispatch(
        editWidgetDataActions.setWidgetData({
          id: widgetId,
          columns: [],
          rows: [],
        } as WidgetData),
      );
    }
    return null;
  },
);

export const getEditControllerOptions = createAsyncThunk<
  null,
  string,
  { state: RootState }
>(
  'editBoard/getEditControllerOptions',
  async (widgetId, { getState, dispatch }) => {
    dispatch(editWidgetInfoActions.renderedWidgets([widgetId]));
    const rootState = getState() as RootState;

    const stackEditBoard = rootState.editBoard as unknown as HistoryEditBoard;
    const { widgetRecord: widgetMap } = stackEditBoard.stack.present;
    const widget = widgetMap[widgetId];
    if (!widget) return null;
    const content = widget.config.content as ControllerWidgetContent;
    const config = content.config;
    if (!Array.isArray(config.assistViewFields)) return null;
    if (config.assistViewFields.length < 2) return null;

    const boardState = rootState.board as BoardState;
    const viewMap = boardState.viewMap;
    const [viewId, ...columns] = config.assistViewFields;
    const view = viewMap[viewId];
    if (!view) return null;
    const requestParams = getControlOptionQueryParams({
      view,
      columns: columns,
      curWidget: widget,
      widgetMap,
    });

    if (!requestParams) {
      return null;
    }
    let widgetData;
    try {
      const { data } = await request<WidgetData>({
        method: 'POST',
        url: `data-provider/execute`,
        data: requestParams,
      });
      widgetData = { ...data, id: widget.id };
      dispatch(
        editWidgetDataActions.setWidgetData(
          filterSqlOperatorName(requestParams, widgetData) as WidgetData,
        ),
      );
    } catch (error) {
      errorHandle(error);
    }

    return null;
  },
);
