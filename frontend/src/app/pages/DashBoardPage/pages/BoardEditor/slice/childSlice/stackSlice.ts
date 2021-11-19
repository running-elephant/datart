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
  MediaWidgetContent,
  Widget,
  WidgetConf,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
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
    updateBoardConfig(state, action: PayloadAction<DashboardConfig>) {
      state.dashBoard.config = action.payload;
    },

    // Widget
    addWidgets(state, action: PayloadAction<Widget[]>) {
      const widgets = action.payload;
      let maxWidgetIndex = state.dashBoard.config.maxWidgetIndex || 0;
      widgets.forEach(ele => {
        maxWidgetIndex++;
        const widget = produce(ele, draft => {
          draft.config.index = maxWidgetIndex;
        });
        state.widgetRecord[widget.id] = widget;
      });
      state.dashBoard.config.maxWidgetIndex = maxWidgetIndex;
    },
    deleteWidgets(state, action: PayloadAction<string[]>) {
      const ids = action.payload;
      ids.forEach(id => {
        if (state.widgetRecord[id].config.type !== 'container') {
          delete state.widgetRecord[id];
        } else {
          const containerConfig = state.widgetRecord[id].config
            .content as ContainerWidgetContent;
          Object.values(containerConfig.itemMap).forEach(item => {
            delete state.widgetRecord[item.childWidgetId];
          });
          delete state.widgetRecord[id];
        }
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

    changeWidgetsRect(state, action: PayloadAction<Layout[]>) {
      action.payload.forEach(it => {
        const { i, x, y, w, h } = it;
        state.widgetRecord[i].config.rect = { x, y, width: w, height: h };
      });
    },
    // auto
    adjustWidgetsRect(state, action: PayloadAction<Layout[]>) {
      action.payload.forEach(it => {
        const { i, x, y, w, h } = it;
        state.widgetRecord[i].config.rect = { x, y, width: w, height: h };
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

    changeTwoWidgetIndex(
      state,
      action: PayloadAction<{ curId: string; targetId: string }>,
    ) {
      const { curId, targetId } = action.payload;
      let temp = state.widgetRecord[curId].config.index;
      state.widgetRecord[curId].config.index =
        state.widgetRecord[targetId].config.index;
      state.widgetRecord[targetId].config.index = temp;
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
        mediaWidgetConfig: MediaWidgetContent;
      }>,
    ) {
      const { id, mediaWidgetConfig } = action.payload;
      state.widgetRecord[id].config.content = mediaWidgetConfig;
    },
  },
});
