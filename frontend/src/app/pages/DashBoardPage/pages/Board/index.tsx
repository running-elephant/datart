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

import { message } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useResizeObserver from 'app/hooks/useResizeObserver';
import { selectPublishLoading } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import {
  deleteViz,
  publishViz,
  removeTab,
} from 'app/pages/MainPage/pages/VizPage/slice/thunks';
import { urlSearchTransfer } from 'app/pages/MainPage/pages/VizPage/utils';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { BoardLoading } from '../../components/BoardLoading';
import { BoardProvider } from '../../components/BoardProvider/BoardProvider';
import { FullScreenPanel } from '../../components/FullScreenPanel';
import TitleHeader from '../../components/TitleHeader';
import { editDashBoardInfoActions } from '../BoardEditor/slice';
import { clearEditBoardState } from '../BoardEditor/slice/actions/actions';
import { AutoBoardCore } from './AutoDashboard/AutoBoardCore';
import { FreeBoardCore } from './FreeDashboard/FreeBoardCore';
import { boardActions } from './slice';
import { widgetsQueryAction } from './slice/asyncActions';
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
  orgId?: string;
}

export const Board: React.FC<BoardProps> = memo(
  ({
    id,
    hideTitle,
    orgId,
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
    const tg = useI18NPrefix('global');
    const { ref, width, height } = useResizeObserver<HTMLDivElement>({
      refreshMode: 'debounce',
      refreshRate: 2000,
    });
    const publishLoading = useSelector(selectPublishLoading);
    const dashboard = useSelector((state: { board: BoardState }) =>
      makeSelectBoardConfigById()(state, boardId),
    );

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
        dispatch(clearEditBoardState());
      };
    }, [boardId, dispatch, fetchData, searchParams]);

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

    const handlePublish = useCallback(() => {
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

    const redirect = useCallback(
      tabKey => {
        if (tabKey) {
          history.push(`/organizations/${orgId}/vizs/${tabKey}`);
        } else {
          history.push(`/organizations/${orgId}/vizs`);
        }
      },
      [history, orgId],
    );

    const handleRecycleViz = useCallback(() => {
      dispatch(
        deleteViz({
          params: { id: boardId, archive: true },
          type: 'DASHBOARD',
          resolve: () => {
            message.success(tg('operation.archiveSuccess'));
            dispatch(removeTab({ id: boardId, resolve: redirect }));
          },
        }),
      );
    }, [boardId, dispatch, redirect, tg]);

    const handleAddToStory = useCallback(
      storyId => {
        history.push({
          pathname: `/organizations/${orgId}/vizs/${storyId}/storyEditor`,
          state: {
            addDashboardId: boardId,
          },
        });
      },
      [history, orgId, boardId],
    );

    const handleSyncData = useCallback(() => {
      dispatch(widgetsQueryAction({ boardId, renderMode }));
    }, [dispatch, boardId, renderMode]);

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
                  orgId={orgId}
                  publishLoading={publishLoading}
                  toggleBoardEditor={toggleBoardEditor}
                  onPublish={handlePublish}
                  onRecycleViz={handleRecycleViz}
                  onAddToStory={handleAddToStory}
                  onSyncData={handleSyncData}
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
        return <BoardLoading />;
      }
    }, [
      orgId,
      dashboard,
      autoFit,
      renderMode,
      allowDownload,
      allowShare,
      allowManage,
      hideTitle,
      publishLoading,
      toggleBoardEditor,
      handlePublish,
      handleRecycleViz,
      handleAddToStory,
      handleSyncData,
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
`;
