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

import produce from 'immer';
import React, { FC, memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { BoardContext, BoardContextProps } from '../contexts/BoardContext';
import { renderedWidgetAsync } from '../pages/Board/slice/thunk';
import { Dashboard, VizRenderMode } from '../pages/Board/slice/types';
import { renderedEditWidgetAsync } from '../pages/BoardEditor/slice/thunk';
import { adaptBoardImageUrl } from '../utils';
import { BoardActionProvider } from './BoardActionProvider';
import { BoardConfigProvider } from './BoardConfigProvider';
import { BoardInfoProvider } from './BoardInfoProvider';

export const BoardProvider: FC<{
  board: Dashboard;
  renderMode: VizRenderMode;
  editing: boolean;
  autoFit?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowManage?: boolean;
}> = memo(
  ({
    board,
    editing,
    children,
    renderMode,
    autoFit,
    allowDownload,
    allowShare,
    allowManage,
  }) => {
    const dispatch = useDispatch();
    // const boardInfo=useSelector()
    const boardContextValue: BoardContextProps = {
      name: board.name,
      boardId: board.id,
      status: board.status,
      queryVariables: board.queryVariables,
      renderMode,
      orgId: board.orgId,
      boardType: board.config.type,
      editing: editing,
      autoFit: autoFit,
      allowDownload,
      allowShare,
      allowManage,

      //
      renderedWidgetById: useCallback(
        wid => {
          let initialQuery= board.config.initialQuery;

          if (initialQuery=== false && renderMode !== 'schedule') {
            //zh:如果 initialQuery=== false renderMode !=='schedule' 则不请求数据 en: If initialQuery=== false renderMode !=='schedule' then no data is requested
            return false;
          }

          if (editing) {
            dispatch(
              renderedEditWidgetAsync({ boardId: board.id, widgetId: wid }),
            );
          } else {
            dispatch(
              renderedWidgetAsync({
                boardId: board.id,
                widgetId: wid,
                renderMode: renderMode,
              }),
            );
          }
        },
        [board.id, dispatch, editing, renderMode],
      ),
    };
    const adaptConfig = useMemo(() => {
      if (board.config) {
        const nextConfig = produce(board.config, draft => {
          draft.background.image = adaptBoardImageUrl(
            board.config.background.image,
            board.id,
          );
        });
        return nextConfig;
      }
      return board.config;
    }, [board.config, board.id]);

    return (
      <BoardContext.Provider value={boardContextValue}>
        <BoardConfigProvider config={adaptConfig}>
          <BoardInfoProvider id={board.id} editing={editing}>
            <BoardActionProvider id={board.id}>{children}</BoardActionProvider>
          </BoardInfoProvider>
        </BoardConfigProvider>
      </BoardContext.Provider>
    );
  },
);
