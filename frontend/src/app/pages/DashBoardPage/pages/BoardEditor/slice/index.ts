import { combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { ChartEditorProps } from 'app/components/ChartEditor';
import { BOARD_UNDO } from 'app/pages/DashBoardPage/constants';
import {
  BoardInfo,
  BoardLinkFilter,
  DeviceType,
  JumpPanel,
  WidgetData,
  WidgetErrorType,
  WidgetInfo,
  WidgetPanelParams,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { EditBoardState } from 'app/pages/DashBoardPage/pages/BoardEditor/slice/types';
import { getInitBoardInfo } from 'app/pages/DashBoardPage/utils/board';
import { PageInfo } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { Layout } from 'react-grid-layout';
/** { excludeAction,includeAction } */
import undoable, { includeAction } from 'redux-undo';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { WidgetControllerPanelParams } from './../../Board/slice/types';
import { editBoardStackSlice } from './childSlice/stackSlice';
import {
  fetchEditBoardDetail,
  getEditChartWidgetDataAsync,
  getEditControllerOptions,
  toUpdateDashboard,
} from './thunk';

// BoardInfo
// editDashBoardInfoActions

const editDashBoardInfoSlice = createSlice({
  name: 'editBoard',
  initialState: getInitBoardInfo({
    id: 'default',
  }) as EditBoardState['boardInfo'],
  reducers: {
    initEditBoardInfo(state, action: PayloadAction<BoardInfo>) {
      const boardInfo = action.payload;
      Object.keys(boardInfo).forEach(key => {
        state[key] = boardInfo[key];
      });
    },
    clearEditBoardInfo(state) {
      const boardInfo = getInitBoardInfo({ id: 'default' });
      Object.keys(boardInfo).forEach(key => {
        state[key] = boardInfo[key];
      });
    },

    changeFullScreenItem(state, action: PayloadAction<string>) {
      state.fullScreenItemId = action.payload;
    },
    changeControllerPanel(
      state,
      action: PayloadAction<WidgetControllerPanelParams>,
    ) {
      state.controllerPanel = action.payload;
    },
    changeLinkagePanel(state, action: PayloadAction<WidgetPanelParams>) {
      state.linkagePanel = action.payload;
    },
    changeJumpPanel(state, action: PayloadAction<JumpPanel>) {
      state.jumpPanel = action.payload;
    },
    adjustDashLayouts(state, action: PayloadAction<Layout[]>) {
      state.layouts = JSON.parse(JSON.stringify(action.payload));
      // state.layouts = [...action.payload];
    },
    changeShowBlockMask(state, action: PayloadAction<boolean>) {
      state.showBlockMask = action.payload;
    },
    changeBoardDroppable(state, action: PayloadAction<boolean>) {
      state.isDroppable = action.payload;
    },
    addClipboardWidgets(
      state,
      action: PayloadAction<BoardInfo['clipboardWidgets']>,
    ) {
      state.clipboardWidgets = action.payload;
    },
    clearClipboardWidgets(state) {
      state.clipboardWidgets = {};
    },
    changeChartEditorProps(
      state,
      action: PayloadAction<ChartEditorProps | undefined>,
    ) {
      state.chartEditorProps = action.payload;
    },

    changeBoardLinkFilter(
      state,
      action: PayloadAction<{
        boardId: string;
        triggerId: string;
        linkFilters?: BoardLinkFilter[];
      }>,
    ) {
      const { boardId, triggerId, linkFilters } = action.payload;
      state.linkFilter = state.linkFilter.filter(
        link => link.triggerWidgetId !== triggerId,
      );
      if (linkFilters) {
        state.linkFilter = state.linkFilter.concat(linkFilters);
      }
    },
    changeBoardDevice(state, action: PayloadAction<DeviceType>) {
      state.deviceType = action.payload;
    },
  },
  extraReducers: builder => {
    try {
      //  updateDashboard
      builder.addCase(toUpdateDashboard.pending, state => {
        state.saving = true;
      });
      builder.addCase(toUpdateDashboard.fulfilled, (state, action) => {
        state.saving = false;
      });
      builder.addCase(toUpdateDashboard.rejected, state => {
        state.saving = false;
      });
      // loadEditBoardDetail
      builder.addCase(fetchEditBoardDetail.pending, state => {
        state.loading = true;
      });
      builder.addCase(fetchEditBoardDetail.fulfilled, (state, action) => {
        state.loading = false;
      });
      builder.addCase(fetchEditBoardDetail.rejected, state => {
        state.loading = false;
      });
    } catch (error) {}
  },
});
// widgetInfo
// editWidgetInfoActions
const widgetInfoRecordSlice = createSlice({
  name: 'editBoard',
  initialState: {} as EditBoardState['widgetInfoRecord'],
  reducers: {
    selectWidget(
      state,
      action: PayloadAction<{
        multipleKey: boolean;
        id: string;
        selected: boolean;
      }>,
    ) {
      const { multipleKey, id, selected } = action.payload;
      if (multipleKey) {
        state[id].selected = selected;
      } else {
        for (let key of Object.keys(state)) {
          if (key === id) {
            state[id].selected = selected;
          } else {
            state[key].selected = false;
          }
        }
      }
    },
    selectSubWidget(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (!state[id].selected) {
        for (let key of Object.keys(state)) {
          state[key].selected = false;
        }
        state[id].selected = true;
      }
    },
    renderedWidgets(state, action: PayloadAction<string[]>) {
      const ids = action.payload;
      ids.forEach(id => {
        state[id] && (state[id].rendered = true);
      });
    },
    clearSelectedWidgets(state) {
      for (let key of Object.keys(state)) {
        state[key].selected = false;
        state[key].editing = false;
      }
    },
    openWidgetEditing(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      for (let key of Object.keys(state)) {
        state[key].selected = false;
      }
      state[id].selected = true;
      state[id].editing = true;
    },
    closeWidgetEditing(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (id) {
        state[id].selected = false;
        state[id].editing = false;
      } else {
        for (let key of Object.keys(state)) {
          state[key].selected = false;
          state[key].editing = false;
        }
      }
    },
    addWidgetInfos(state, action: PayloadAction<Record<string, WidgetInfo>>) {
      const widgetInfoMap = action.payload;
      const widgetIds = Object.keys(widgetInfoMap);
      widgetIds.forEach(id => {
        state[id] = widgetInfoMap[id];
      });
    },
    clearWidgetInfo(state) {
      Object.keys(state).forEach(id => {
        delete state[id];
      });
    },
    changeWidgetInLinking(
      state,
      action: PayloadAction<{
        boardId?: string;
        widgetId: string;
        toggle: boolean;
      }>,
    ) {
      const { widgetId, toggle } = action.payload;
      state[widgetId].inLinking = toggle;
    },
    changePageInfo(
      state,
      action: PayloadAction<{
        boardId?: string;
        widgetId: string;
        pageInfo: Partial<PageInfo> | undefined;
      }>,
    ) {
      const { widgetId, pageInfo } = action.payload;
      state[widgetId].pageInfo = pageInfo || { pageNo: 1 };
    },
    setWidgetErrInfo(
      state,
      action: PayloadAction<{
        boardId?: string;
        widgetId: string;
        errInfo?: string;
        errorType: WidgetErrorType;
      }>,
    ) {
      const { widgetId, errInfo, errorType } = action.payload;

      let WidgetRrrInfo = state?.[widgetId]?.errInfo;
      if (!WidgetRrrInfo) return;
      if (errInfo) {
        WidgetRrrInfo[errorType] = errInfo;
      } else {
        delete WidgetRrrInfo[errorType];
      }
    },
  },
  extraReducers: builder => {
    try {
      builder.addCase(getEditChartWidgetDataAsync.pending, (state, action) => {
        const { widgetId } = action.meta.arg;
        if (!state?.[widgetId]) return;
        state[widgetId].loading = true;
      });
      builder.addCase(
        getEditChartWidgetDataAsync.fulfilled,
        (state, action) => {
          const { widgetId } = action.meta.arg;
          if (!state?.[widgetId]) return;
          state[widgetId].loading = false;
        },
      );
      builder.addCase(getEditChartWidgetDataAsync.rejected, (state, action) => {
        const { widgetId } = action.meta.arg;
        if (!state?.[widgetId]) return;
        state[widgetId].loading = false;
      });
      builder.addCase(getEditControllerOptions.pending, (state, action) => {
        const widgetId = action.meta.arg;
        if (!state?.[widgetId]) return;
        state[widgetId].loading = true;
      });
      builder.addCase(getEditControllerOptions.fulfilled, (state, action) => {
        const widgetId = action.meta.arg;
        if (!state?.[widgetId]) return;
        state[widgetId].loading = false;
      });
      builder.addCase(getEditControllerOptions.rejected, (state, action) => {
        const widgetId = action.meta.arg;
        if (!state?.[widgetId]) return;
        state[widgetId].loading = false;
      });
    } catch (error) {
      // console.warn(error);
    }
  },
});
const editWidgetDataSlice = createSlice({
  name: 'editBoard',
  initialState: {} as EditBoardState['widgetDataMap'],
  reducers: {
    setWidgetData(state, action: PayloadAction<WidgetData>) {
      const widgetData = action.payload;
      state[widgetData.id] = widgetData;
    },
  },
});
export const { actions: editBoardStackActions } = editBoardStackSlice;
export const { actions: editDashBoardInfoActions } = editDashBoardInfoSlice;
export const { actions: editWidgetInfoActions } = widgetInfoRecordSlice;
export const { actions: editWidgetDataActions } = editWidgetDataSlice;
const filterActions = [
  editBoardStackActions.setBoardToEditStack,
  editBoardStackActions.updateBoard,

  editBoardStackActions.updateBoardConfig,
  editBoardStackActions.addWidgets,
  editBoardStackActions.deleteWidgets,
  editBoardStackActions.changeAutoBoardWidgetsRect,
  editBoardStackActions.resizeWidgetEnd,

  editBoardStackActions.tabsWidgetAddTab,
  editBoardStackActions.tabsWidgetRemoveTab,
  editBoardStackActions.updateWidgetConfig,
  editBoardStackActions.updateWidgetsConfig,
  editBoardStackActions.changeWidgetsIndex,

  editBoardStackActions.toggleLockWidget,
  editBoardStackActions.updateBoardConfigByKey,
  editBoardStackActions.updateWidgetConfigByKey,
  editBoardStackActions.updateWidgetRect,
].map(ele => ele.toString());
const editBoardStackReducer = undoable(editBoardStackSlice.reducer, {
  undoType: BOARD_UNDO.undo,
  redoType: BOARD_UNDO.redo,
  ignoreInitialState: true,
  // filter: excludeAction([configActions.changeSlideEdit(false).type]),
  // 像 高频的 组件拖拽。resize、select虽然是用户的行为，但是也不能都记录在 快照中.只记录resizeEnd 和 dragEnd 有意义的结果快照
  filter: includeAction(filterActions),
});

const editBoardReducer = combineReducers({
  stack: editBoardStackReducer,
  boardInfo: editDashBoardInfoSlice.reducer,
  widgetInfoRecord: widgetInfoRecordSlice.reducer,
  widgetDataMap: editWidgetDataSlice.reducer,
});

export const useEditBoardSlice = () => {
  useInjectReducer({ key: 'editBoard', reducer: editBoardReducer });
};
