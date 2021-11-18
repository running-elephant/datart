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
import { debounce } from 'lodash';
import React, { FC, useContext } from 'react';
import { useDispatch } from 'react-redux';
import {
  BoardActionContext,
  BoardActionContextProps,
} from '../contexts/BoardActionContext';
import { BoardContext } from '../contexts/BoardContext';
import { boardActions } from '../pages/Board/slice';
import { boardDownLoadAction } from '../pages/Board/slice/asyncActions';
import { getWidgetDataAsync } from '../pages/Board/slice/thunk';
import { Widget } from '../pages/Board/slice/types';
import { editBoardStackActions } from '../pages/BoardEditor/slice';
import {
  getEditWidgetDataAsync,
  toUpdateDashboard,
} from '../pages/BoardEditor/slice/thunk';
import { getNeedRefreshWidgetsByFilter } from '../utils/widget';

export const BoardActionProvider: FC<{ id: string }> = ({
  id: boardId,
  children,
}) => {
  const dispatch = useDispatch();
  const { editing, renderMode } = useContext(BoardContext);

  const actions: BoardActionContextProps = {
    widgetUpdate: (widget: Widget) => {
      if (editing) {
        dispatch(editBoardStackActions.updateWidget(widget));
      } else {
        dispatch(boardActions.updateWidget(widget));
      }
    },

    refreshWidgetsByFilter: debounce((widget: Widget) => {
      const widgetIds = getNeedRefreshWidgetsByFilter(widget);
      const pageInfo: Partial<PageInfo> = {
        pageNo: 1,
      };
      widgetIds.forEach(widgetId => {
        if (editing) {
          dispatch(
            getEditWidgetDataAsync({
              widgetId,
              option: { pageInfo },
            }),
          );
        } else {
          dispatch(
            getWidgetDataAsync({
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
  };
  return (
    <BoardActionContext.Provider value={actions}>
      {children}
    </BoardActionContext.Provider>
  );
};
