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

import { PayloadAction } from '@reduxjs/toolkit';
import {
  ContainerItem,
  ContainerWidgetContent,
  Dashboard,
  DashboardConfig,
  DeviceType,
  MediaWidgetContent,
  Widget,
  WidgetConf,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getDefaultWidgetName } from 'app/pages/DashBoardPage/utils';
import { Variable } from 'app/pages/MainPage/pages/VariablePage/slice/types';
import produce from 'immer';
import { Layout } from 'react-grid-layout';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { EditBoardStack } from '../types';

export type updateWidgetConf = {
  id: string;
  config: WidgetConf;
};
export const initEditBoardState: EditBoardStack = {
  dashBoard: {} as Dashboard,
  widgetRecord: {},
};
// editBoardStackActions
export const editBoardStackSlice = createSlice({
  name: 'editBoard',
  initialState: initEditBoardState,
  reducers: {
    setBoardToEditStack(state, action: PayloadAction<EditBoardStack>) {
      const record = action.payload;
      Object.keys(record).forEach(key => {
        state[key] = record[key];
      });
    },
    updateBoard(state, action: PayloadAction<Dashboard>) {
      state.dashBoard = action.payload;
    },
    toggleAllowOverlap(state, action: PayloadAction<boolean>) {
      state.dashBoard.config.allowOverlap = action.payload;
    },
    updateBoardConfig(state, action: PayloadAction<DashboardConfig>) {
      state.dashBoard.config = action.payload;
    },
    updateQueryVariables(state, action: PayloadAction<Variable[]>) {
      const variables = action.payload;
      state.dashBoard.queryVariables = variables;
    },
    changeBoardHasQueryControl(state, action: PayloadAction<boolean>) {
      state.dashBoard.config.hasQueryControl = action.payload;
    },
    changeBoardHasResetControl(state, action: PayloadAction<boolean>) {
      state.dashBoard.config.hasResetControl = action.payload;
    },
    // Widget
    addWidgets(state, action: PayloadAction<Widget[]>) {
      const widgets = action.payload;
      let maxWidgetIndex = state.dashBoard.config.maxWidgetIndex || 0;
      widgets.forEach(ele => {
        maxWidgetIndex++;
        const widget = produce(ele, draft => {
          draft.config.index = maxWidgetIndex;
          draft.config.name =
            ele.config.name ||
            getDefaultWidgetName(
              ele.config.type,
              ele.config.content.type,
              maxWidgetIndex,
            );
        });
        state.widgetRecord[widget.id] = widget;
      });
      state.dashBoard.config.maxWidgetIndex = maxWidgetIndex;
    },
    //
    toggleLockWidget(
      state,
      action: PayloadAction<{ id: string; lock: boolean }>,
    ) {
      const { id, lock } = action.payload;
      if (state.widgetRecord?.[id]?.config) {
        state.widgetRecord[id].config.lock = lock;
      }
    },
    deleteWidgets(state, action: PayloadAction<string[]>) {
      const ids = action.payload;
      if (!ids?.length) return;
      ids.forEach(id => {
        delete state.widgetRecord[id];
      });
    },
    updateWidget(state, action: PayloadAction<Widget>) {
      const widget = action.payload;
      state.widgetRecord[widget.id] = widget;
    },
    updateWidgetConfig(
      state,
      action: PayloadAction<{ wid: string; config: WidgetConf }>,
    ) {
      const { wid, config } = action.payload;
      state.widgetRecord[wid].config = config;
    },
    updateWidgetsConfig(state, action: PayloadAction<updateWidgetConf[]>) {
      const nextWidgetConfigs = action.payload;
      nextWidgetConfigs.forEach(item => {
        state.widgetRecord[item.id].config = item.config;
      });
    },
    clearWidgetConfig(state) {
      Object.keys(state.widgetRecord || []).forEach(key => {
        if (state.widgetRecord) {
          delete state.widgetRecord[key];
        }
      });
    },

    changeAutoBoardWidgetsRect(
      state,
      action: PayloadAction<{ layouts: Layout[]; deviceType: DeviceType }>,
    ) {
      const { layouts, deviceType } = action.payload;
      layouts.forEach(it => {
        const { i, x, y, w, h } = it;
        if (!state.widgetRecord?.[i]?.config) return;
        const rectItem = { x, y, width: w, height: h };
        if (deviceType === DeviceType.Desktop) {
          state.widgetRecord[i].config.rect = rectItem;
        }
        if (deviceType === DeviceType.Mobile) {
          state.widgetRecord[i].config.mobileRect = rectItem;
        }
      });
    },
    // auto
    adjustWidgetsRect(state, action: PayloadAction<Layout[]>) {
      action.payload.forEach(it => {
        const { i, x, y, w, h } = it;
        const rectItem = { x, y, width: w, height: h };
        state.widgetRecord[i].config.rect = rectItem;
      });
    },
    // free
    resizeWidgetEnd(
      state,
      action: PayloadAction<{ id: string; width: number; height: number }>,
    ) {
      const { id, width, height } = action.payload;
      const { rect } = state.widgetRecord[id].config;
      state.widgetRecord[id].config.rect = { ...rect, width, height };
    },
    changeWidgetsIndex(
      state,
      action: PayloadAction<{ id: string; index: number }[]>,
    ) {
      const opts = action.payload;
      opts.forEach(it => {
        const { id, index } = it;
        state.widgetRecord[id].config.index = index;
      });
    },

    addWidgetToContainerWidget(
      state,
      action: PayloadAction<{
        parentId: string;
        tabItem: ContainerItem;
        sourceId: string;
      }>,
    ) {
      const { parentId, tabItem, sourceId } = action.payload;
      const tabsContainerConfig = state.widgetRecord[parentId].config
        .content as ContainerWidgetContent;
      const sourceWidget = state.widgetRecord[sourceId];

      tabsContainerConfig.itemMap[tabItem.tabId].name =
        sourceWidget.config.name;
      tabsContainerConfig.itemMap[tabItem.tabId].childWidgetId =
        sourceWidget.id;
      state.widgetRecord[sourceId].parentId = parentId;
      state.widgetRecord[sourceId].config.tabId = tabItem.tabId;
    },
    /* tabs widget */
    tabsWidgetAddTab(
      state,
      action: PayloadAction<{
        parentId: string;
        tabItem: ContainerItem;
      }>,
    ) {
      const { parentId, tabItem } = action.payload;

      const tabsContainerConfig = state.widgetRecord[parentId].config
        .content as ContainerWidgetContent;
      tabsContainerConfig.itemMap[tabItem.tabId] = tabItem;
    },
    tabsWidgetRemoveTab(
      state,
      action: PayloadAction<{
        parentId: string;
        sourceTabId: string;
        mode: string;
      }>,
    ) {
      const { parentId, sourceTabId, mode } = action.payload;
      const tabsContainerConfig = state.widgetRecord[parentId].config
        .content as ContainerWidgetContent;
      const sourceWidgetId =
        tabsContainerConfig.itemMap[sourceTabId].childWidgetId;
      delete tabsContainerConfig.itemMap[sourceTabId];

      const rt = state.widgetRecord[parentId].config.rect;
      if (state.widgetRecord[sourceWidgetId]) {
        if (mode === 'auto') {
          state.widgetRecord[sourceWidgetId].config.rect = rt;
        }
        if (mode === 'free') {
          state.widgetRecord[sourceWidgetId].config.rect = {
            ...rt,
            x: rt.x + 30,
            y: rt.y + 30,
          };
        }
        state.widgetRecord[sourceWidgetId].parentId = '';
      }
    },
    /* MediaWidgetConfig */
    changeMediaWidgetConfig(
      state,
      action: PayloadAction<{
        id: string;
        mediaWidgetContent: MediaWidgetContent;
      }>,
    ) {
      const { id, mediaWidgetContent } = action.payload;
      if (state.widgetRecord[id]) {
        state.widgetRecord[id].config.content = mediaWidgetContent;
      }
    },
  },
  extraReducers: builder => {},
});
