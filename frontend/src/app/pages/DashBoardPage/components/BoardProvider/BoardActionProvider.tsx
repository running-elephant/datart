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

import { PageInfo } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { generateShareLinkAsync } from 'app/utils/fetch';
import debounce from 'lodash/debounce';
import React, { createContext, FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { boardActions } from '../../pages/Board/slice';
import {
  boardDownLoadAction,
  resetControllerAction,
  widgetsQueryAction,
} from '../../pages/Board/slice/asyncActions';
import {
  fetchBoardDetail,
  getChartWidgetDataAsync,
  getControllerOptions,
  renderedWidgetAsync,
} from '../../pages/Board/slice/thunk';
import {
  VizRenderMode,
  Widget,
  WidgetConf,
} from '../../pages/Board/slice/types';
import { editBoardStackActions } from '../../pages/BoardEditor/slice';
import {
  clearActiveWidgets,
  clearEditBoardState,
} from '../../pages/BoardEditor/slice/actions/actions';
import { editWidgetsQueryAction } from '../../pages/BoardEditor/slice/actions/controlActions';
import {
  getEditChartWidgetDataAsync,
  getEditControllerOptions,
  renderedEditWidgetAsync,
  toUpdateDashboard,
} from '../../pages/BoardEditor/slice/thunk';
import {
  getCascadeControllers,
  getNeedRefreshWidgetsByController,
} from '../../utils/widget';

export interface BoardActionContextProps {
  widgetUpdate: (widget: Widget, editing: boolean) => void;
  updateWidgetConfig: (config: WidgetConf, wid: string) => void;
  refreshWidgetsByController: (
    widget: Widget,
    editing: boolean,
    renderMode: VizRenderMode,
  ) => void;
  updateBoard?: (callback?: () => void) => void;
  onGenerateShareLink?: (date, usePwd) => any;
  onBoardToDownLoad: () => any;
  onWidgetsQuery: (editing: boolean, renderMode: VizRenderMode) => any;
  onWidgetsReset: (renderMode: VizRenderMode) => any;
  boardToggleAllowOverlap: (allow: boolean) => void;
  onClearActiveWidgets: () => void;
  onCloseBoardEditor: (boardId: string) => void;
  renderedWidgetById: (
    wid: string,
    editing: boolean,
    renderMode: VizRenderMode,
  ) => void;
}
export const BoardActionContext = createContext<BoardActionContextProps>(
  {} as BoardActionContextProps,
);
export const BoardActionProvider: FC<{ id: string }> = memo(
  ({ id: boardId, children }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const actions: BoardActionContextProps = {
      widgetUpdate: (widget: Widget, editing: boolean) => {
        if (editing) {
          dispatch(editBoardStackActions.updateWidget(widget));
        } else {
          dispatch(boardActions.updateWidget(widget));
        }
      },
      updateWidgetConfig: (config: WidgetConf, wid: string) => {
        dispatch(editBoardStackActions.updateWidgetConfig({ wid, config }));
      },
      boardToggleAllowOverlap: (allow: boolean) => {
        dispatch(editBoardStackActions.toggleAllowOverlap(allow));
      },
      onWidgetsQuery: debounce(
        (editing: boolean, renderMode: VizRenderMode) => {
          if (editing) {
            dispatch(editWidgetsQueryAction({ boardId }));
          } else {
            dispatch(widgetsQueryAction({ boardId, renderMode }));
          }
        },
        500,
      ),
      onWidgetsReset: debounce((renderMode: VizRenderMode) => {
        dispatch(resetControllerAction({ boardId, renderMode }));
      }, 500),
      refreshWidgetsByController: debounce(
        (widget: Widget, editing: boolean, renderMode: VizRenderMode) => {
          const controllerIds = getCascadeControllers(widget);
          controllerIds.forEach(controlWidgetId => {
            if (editing) {
              dispatch(getEditControllerOptions(controlWidgetId));
            } else {
              dispatch(
                getControllerOptions({
                  boardId,
                  widgetId: controlWidgetId,
                  renderMode,
                }),
              );
            }
          });

          const pageInfo: Partial<PageInfo> = {
            pageNo: 1,
          };
          const chartWidgetIds = getNeedRefreshWidgetsByController(widget);

          chartWidgetIds.forEach(widgetId => {
            if (editing) {
              dispatch(
                getEditChartWidgetDataAsync({ widgetId, option: { pageInfo } }),
              );
            } else {
              dispatch(
                getChartWidgetDataAsync({
                  boardId,
                  widgetId,
                  renderMode,
                  option: { pageInfo },
                }),
              );
            }
          });
        },
        500,
      ),

      updateBoard: (callback?: () => void) => {
        dispatch(toUpdateDashboard({ boardId, callback }));
      },

      onGenerateShareLink: async (expireDate, enablePassword) => {
        const result = await generateShareLinkAsync(
          expireDate,
          enablePassword,
          boardId,
          'DASHBOARD',
        );
        return result;
      },

      onBoardToDownLoad: () => {
        dispatch(boardDownLoadAction({ boardId }));
      },

      onClearActiveWidgets: () => {
        dispatch(clearActiveWidgets());
      },
      onCloseBoardEditor: (boardId: string) => {
        const pathName = history.location.pathname;
        const prePath = pathName.split('/boardEditor')[0];
        history.push(`${prePath}`);
        dispatch(clearEditBoardState());
        // 更新view界面数据
        dispatch(fetchBoardDetail({ dashboardRelId: boardId }));
      },
      renderedWidgetById: (
        wid: string,
        editing: boolean,
        renderMode: VizRenderMode,
      ) => {
        if (editing) {
          dispatch(
            renderedEditWidgetAsync({ boardId: boardId, widgetId: wid }),
          );
        } else {
          dispatch(
            renderedWidgetAsync({
              boardId: boardId,
              widgetId: wid,
              renderMode: renderMode,
            }),
          );
        }
      },
    };
    return (
      <BoardActionContext.Provider value={actions}>
        {children}
      </BoardActionContext.Provider>
    );
  },
);
