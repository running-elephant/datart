import { createAsyncThunk } from '@reduxjs/toolkit';
import ChartDataView from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { boardActions } from 'app/pages/DashBoardPage/slice';
import { fetchBoardDetail } from 'app/pages/DashBoardPage/slice/thunk';
import {
  BoardState,
  ContainerWidgetContent,
  DataChart,
  FilterWidgetContent,
  getDataOption,
  SaveDashboard,
  ServerDatachart,
  ServerView,
  Widget,
  WidgetData,
  WidgetInfo,
  WidgetOfCopy,
} from 'app/pages/DashBoardPage/slice/types';
import { getChartWidgetRequestParams } from 'app/pages/DashBoardPage/utils';
import {
  getChartDataView,
  getDashBoardByResBoard,
  getDataChartsByServer,
  getInitBoardInfo,
} from 'app/pages/DashBoardPage/utils/board';
import {
  convertWrapChartWidget,
  createDataChartWidget,
  createToSaveWidgetGroup,
  createWidgetInfo,
  createWidgetInfoMap,
  getWidgetInfoMapByServer,
} from 'app/pages/DashBoardPage/utils/widget';
import { ActionCreators } from 'redux-undo';
import { RootState } from 'types';
import { CloneValueDeep } from 'utils/object';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { v4 as uuidv4 } from 'uuid';
import {
  editBoardStackActions,
  editDashBoardInfoActions,
  editWidgetDataActions,
  editWidgetInfoActions,
} from '.';
import { VALUE_SPLITER } from '../components/FilterWidgetPanel/WidgetFilterForm/OperatorValues';
import { getDistinctFields } from './../../../../../utils/fetch';
import { BoardInfo, BoardType, ServerDashboard } from './../../../slice/types';
import { getDataChartMap } from './../../../utils/board';
import {
  getWidgetMapByServer,
  updateWidgetsRect,
} from './../../../utils/widget';
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

    const { datacharts: serverDataCharts, views: serverViews, widgets } = data;
    // TODO
    // const wrapedChart = getWidgetMapByServer(widgets);
    const { widgetMap, wrappedDataCharts } = getWidgetMapByServer(widgets);
    const widgetInfoMap = getWidgetInfoMapByServer(widgets);
    const widgetIds = widgets.map(w => w.id);
    const boardInfo = getInitBoardInfo(dashboard.id, widgetIds);
    // datacharts
    const dataCharts: DataChart[] = getDataChartsByServer(serverDataCharts);
    const allDataCharts: DataChart[] = dataCharts.concat(wrappedDataCharts);
    dispatch(boardActions.updateDataChartMap(allDataCharts));

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
    // const dataChart = boardState.board.dataChartMap[curWidget.datachartId];
    //     const chartDataView = boardState.board.viewMap[dataChart.viewId];
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
    try {
      const { data } = await request<any>({
        url: `viz/dashboards/${dashBoard.id}`,
        method: 'put',
        data: updateData,
      });
      // TODO
      // 清空历史栈
      // 更新当前编辑面板的旧数据 widget Id 还都是本地的不对，应该更新成服务端id
      //
      callback();
      dispatch(ActionCreators.clearHistory());
      // 更新view界面数据
      await dispatch(fetchBoardDetail({ dashboardRelId: dashBoard.id }));

      dispatch(fetchEditBoardDetail(dashBoard.id));
      // 关闭编辑 界面

      // TODO
    } catch (error) {
      errorHandle(error);
      throw error;
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
      data: { datacharts, views },
    } = await request<{
      datacharts: ServerDatachart[];
      views: ServerView[];
    }>({
      url: `viz/datacharts?datachartIds=${chartIds.join()}`,
      method: 'get',
    });
    const dataCharts: DataChart[] = getDataChartsByServer(datacharts);
    const dataChartMap = getDataChartMap(dataCharts);
    const viewViews = getChartDataView(views, dataCharts);
    dispatch(boardActions.setDataChartMap(dataCharts));
    dispatch(boardActions.setViewMap(viewViews));
    const widgets = chartIds.map(dcId => {
      let widget = createDataChartWidget({
        dashboardId: boardId,
        boardType: boardType,
        dataChartId: dcId,
        dataChartConfig: dataChartMap[dcId],
        subType: 'dataChart',
      });
      return widget;
    });
    dispatch(addWidgetsToEditBoard(widgets));
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
    dispatch(boardActions.setDataChartMap(dataCharts));
    dispatch(boardActions.setViewMap(viewViews));
    let widget = createDataChartWidget({
      dashboardId: boardId,
      boardType: boardType,
      dataChartId: chartId,
      dataChartConfig: dataChart,
      subType: 'widgetChart',
    });
    dispatch(addWidgetsToEditBoard([widget]));
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
    const { widgetRecord } = editBoardStackState(
      getState() as unknown as {
        editBoard: HistoryEditBoard;
      },
    );
    const curWidget = widgetRecord[widgetId];
    if (!curWidget) return null;
    // 1 widget render
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
        dispatch(getEditWidgetDataAsync({ widgetId: wid }));
      });
      return null;
    }
    // 2 widget getData
    dispatch(getEditWidgetDataAsync({ widgetId }));
    return null;
  },
);
export const getEditWidgetDataAsync = createAsyncThunk<
  null,
  { widgetId: string; option?: getDataOption },
  { state: RootState }
>(
  'editBoard/getEditWidgetDataAsync',
  async ({ widgetId, option }, { getState, dispatch, rejectWithValue }) => {
    const rootState = getState() as RootState;
    const stackEditBoard = rootState.editBoard as unknown as HistoryEditBoard;
    const { widgetRecord: widgetMap } = stackEditBoard.stack.present;

    const curWidget = widgetMap[widgetId];
    if (!curWidget) return null;

    switch (curWidget.config.type) {
      case 'filter':
        await dispatch(getEditFilterDataAsync(curWidget));
        return null;
      case 'media':
        return null;
      case 'container':
        return null;
      case 'chart':
        await dispatch(getEditChartWidgetDataAsync({ widgetId, option }));
        return null;
      default:
        return null;
    }
  },
);
export const getEditFilterDataAsync = createAsyncThunk<
  null,
  Widget,
  { state: RootState }
>('editBoard/getFilterDataAsync', async (widget, { getState, dispatch }) => {
  const content = widget.config.content as FilterWidgetContent;
  const widgetFilter = content.widgetFilter;
  if (widgetFilter.assistViewField) {
    // 请求
    const [viewId, viewField] =
      widgetFilter.assistViewField.split(VALUE_SPLITER);
    const dataset = await getDistinctFields(
      viewId,
      viewField,
      undefined,
      undefined,
    );
    dispatch(
      editWidgetDataActions.setWidgetData({
        ...dataset,
        id: widget.id,
      } as unknown as WidgetData),
    );
  }
  return null;
});
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
    const { data } = await request<WidgetData>({
      method: 'POST',
      url: `data-provider/execute`,
      data: requestParams,
    });
    widgetData = { ...data, id: widgetId };
    dispatch(editWidgetDataActions.setWidgetData(widgetData as WidgetData));
    // changePageInfo
    dispatch(
      editWidgetInfoActions.changePageInfo({
        widgetId,
        pageInfo: data.pageInfo,
      }),
    );
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
        }
      }
    });
    const widgetInfoMap: Record<string, WidgetInfo> = {};
    newWidgets.forEach(widget => {
      const widgetInfo = createWidgetInfo(widget.id);
      widgetInfoMap[widget.id] = widgetInfo;
    });
    // dispatch(editWidgetInfoActions.);
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
