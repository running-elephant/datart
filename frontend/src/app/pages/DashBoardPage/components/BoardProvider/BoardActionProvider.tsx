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
import { useSaveAsViz } from 'app/pages/MainPage/pages/VizPage/hooks/useSaveAsViz';
import { generateShareLinkAsync } from 'app/utils/fetch';
import debounce from 'lodash/debounce';
import React, { FC, useContext } from 'react';
import { useDispatch } from 'react-redux';
import {
  BoardActionContext,
  BoardActionContextProps,
} from '../../contexts/BoardActionContext';
import { BoardConfigContext } from '../../contexts/BoardConfigContext';
import { BoardContext } from '../../contexts/BoardContext';
import { boardActions } from '../../pages/Board/slice';
import {
  boardDownLoadAction,
  resetControllerAction,
  widgetsQueryAction,
} from '../../pages/Board/slice/asyncActions';
import {
  getChartWidgetDataAsync,
  getControllerOptions,
} from '../../pages/Board/slice/thunk';
import { Widget } from '../../pages/Board/slice/types';
import { editBoardStackActions } from '../../pages/BoardEditor/slice';
import { editWidgetsQueryAction } from '../../pages/BoardEditor/slice/actions/controlActions';
import {
  getEditChartWidgetDataAsync,
  getEditControllerOptions,
  toUpdateDashboard,
} from '../../pages/BoardEditor/slice/thunk';
import {
  getCascadeControllers,
  getNeedRefreshWidgetsByController,
} from '../../utils/widget';

export const BoardActionProvider: FC<{ id: string }> = ({
  id: boardId,
  children,
}) => {
  const dispatch = useDispatch();
  const { editing, renderMode } = useContext(BoardContext);
  const { hasQueryControl } = useContext(BoardConfigContext);
  const saveAsViz = useSaveAsViz();

  const actions: BoardActionContextProps = {
    widgetUpdate: (widget: Widget) => {
      if (editing) {
        dispatch(editBoardStackActions.updateWidget(widget));
      } else {
        dispatch(boardActions.updateWidget(widget));
      }
    },
    boardToggleAllowOverlap: (allow: boolean) => {
      dispatch(editBoardStackActions.toggleAllowOverlap(allow));
    },
    onWidgetsQuery: debounce(() => {
      if (editing) {
        dispatch(editWidgetsQueryAction({ boardId }));
      } else {
        dispatch(widgetsQueryAction({ boardId, renderMode }));
      }
    }, 500),
    onWidgetsReset: debounce(() => {
      if (editing) {
        // do nothing in board editing
        return;
      } else {
        dispatch(resetControllerAction({ boardId, renderMode }));
      }
    }, 500),
    refreshWidgetsByController: debounce((widget: Widget) => {
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
      if (hasQueryControl) {
        return;
      }
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
    }, 500),

    updateBoard: (callback: () => void) => {
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
      if (renderMode === 'read') {
        dispatch(boardDownLoadAction({ boardId, renderMode }));
      }
    },
    onSaveAsVizs: () => {
      saveAsViz(boardId, 'DASHBOARD');
    },
  };
  return (
    <BoardActionContext.Provider value={actions}>
      {children}
    </BoardActionContext.Provider>
  );
};
