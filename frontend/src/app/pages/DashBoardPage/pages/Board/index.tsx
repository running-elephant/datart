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

import { message, Spin } from 'antd';
import useResizeObserver from 'app/hooks/useResizeObserver';
import { selectPublishLoading } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import { publishViz } from 'app/pages/MainPage/pages/VizPage/slice/thunks';
import { urlSearchTransfer } from 'app/pages/MainPage/pages/VizPage/utils';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { BoardProvider } from '../../components/BoardProvider/BoardProvider';
import { FullScreenPanel } from '../../components/FullScreenPanel';
import TitleHeader from '../../components/TitleHeader';
import { editDashBoardInfoActions } from '../BoardEditor/slice';
import { clearEditBoardState } from '../BoardEditor/slice/actions/actions';
import AutoBoardCore from './AutoDashboard/AutoBoardCore';
import FreeBoardCore from './FreeDashboard/FreeBoardCore';
import { boardActions } from './slice';
import { makeSelectBoardConfigById } from './slice/selector';
import { fetchBoardDetail } from './slice/thunk';
import { BoardState, VizRenderMode } from './slice/types';
export interface BoardProps {
  id: string;
  renderMode: VizRenderMode;
  hideTitle?: boolean;
  fetchData?: boolean;
  filterSearchUrl?: string;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowManage?: boolean;
  autoFit?: boolean;
  showZoomCtrl?: boolean;
}

export const Board: React.FC<BoardProps> = memo(
  ({
    id,
    hideTitle,
    fetchData = true,
    renderMode,
    filterSearchUrl,
    allowDownload,
    allowShare,
    allowManage,
    autoFit,
    showZoomCtrl,
  }) => {
    const boardId = id;
    const dispatch = useDispatch();
    const history = useHistory();
    const { ref, width, height } = useResizeObserver<HTMLDivElement>({
      refreshMode: 'debounce',
      refreshRate: 2000,
    });
    const searchParams = useMemo(() => {
      return filterSearchUrl
        ? urlSearchTransfer.toParams(filterSearchUrl)
        : undefined;
    }, [filterSearchUrl]);

    useEffect(() => {
      dispatch(editDashBoardInfoActions.changeChartEditorProps(undefined));
    }, [dispatch]);

    useEffect(() => {
      if (boardId && fetchData) {
        dispatch(
          fetchBoardDetail({
            dashboardRelId: boardId,
            filterSearchParams: searchParams,
          }),
        );
      }

      // 销毁组件 清除该对象缓存
      return () => {
        dispatch(boardActions.clearBoardStateById(boardId));
        dispatch(clearEditBoardState(boardId));
      };
    }, [boardId, dispatch, fetchData, searchParams]);

    const dashboard = useSelector((state: { board: BoardState }) =>
      makeSelectBoardConfigById()(state, boardId),
    );
    const toggleBoardEditor = useCallback(
      (bool: boolean) => {
        const pathName = history.location.pathname;
        if (pathName.includes(boardId)) {
          history.push(`${pathName.split(boardId)[0]}${boardId}/boardEditor`);
        } else if (pathName.includes('/vizs')) {
          history.push(
            `${pathName.split('/vizs')[0]}${'/vizs/'}${boardId}/boardEditor`,
          );
        }
      },
      [boardId, history],
    );

    const publishLoading = useSelector(selectPublishLoading);

    const onPublish = useCallback(() => {
      if (dashboard) {
        dispatch(
          publishViz({
            id: dashboard.id,
            vizType: 'DASHBOARD',
            publish: dashboard.status === 1 ? true : false,
            resolve: () => {
              message.success(
                `${dashboard.status === 2 ? '取消' : ''}发布成功`,
              );
              dispatch(
                boardActions.changeBoardPublish({
                  boardId,
                  publish: dashboard.status === 1 ? 2 : 1,
                }),
              );
            },
          }),
        );
      }
    }, [dashboard, dispatch, boardId]);

    const viewBoard = useMemo(() => {
      let boardType = dashboard?.config?.type;
      if (dashboard && boardType) {
        return (
          <div className="board-provider">
            <BoardProvider
              board={dashboard}
              editing={false}
              autoFit={autoFit}
              renderMode={renderMode}
              allowDownload={allowDownload}
              allowShare={allowShare}
              allowManage={allowManage}
            >
              {!hideTitle && (
                <TitleHeader
                  publishLoading={publishLoading}
                  toggleBoardEditor={toggleBoardEditor}
                  onPublish={onPublish}
                />
              )}
              {boardType === 'auto' && <AutoBoardCore boardId={dashboard.id} />}
              {boardType === 'free' && (
                <FreeBoardCore
                  boardId={dashboard.id}
                  showZoomCtrl={showZoomCtrl}
                />
              )}
              <FullScreenPanel />
            </BoardProvider>
          </div>
        );
      } else {
        return (
          <div className="loading">
            <Spin size="large" tip="Loading..." />
          </div>
        );
      }
    }, [
      dashboard,
      autoFit,
      renderMode,
      allowDownload,
      allowShare,
      allowManage,
      hideTitle,
      publishLoading,
      toggleBoardEditor,
      onPublish,
      showZoomCtrl,
    ]);

    useEffect(() => {
      if (width && height && width > 0 && height > 0 && dashboard?.id) {
        dispatch(
          boardActions.changeBoardVisible({ id: dashboard?.id, visible: true }),
        );
      } else {
        dispatch(
          boardActions.changeBoardVisible({
            id: dashboard?.id as string,
            visible: false,
          }),
        );
      }
    }, [dashboard?.id, dispatch, height, width]);

    return (
      <Wrapper ref={ref} className="dashboard-box">
        <DndProvider backend={HTML5Backend}>{viewBoard}</DndProvider>
      </Wrapper>
    );
  },
);

export default Board;

const Wrapper = styled.div<{}>`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;

  .board-provider {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
  }
  .loading {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
`;
