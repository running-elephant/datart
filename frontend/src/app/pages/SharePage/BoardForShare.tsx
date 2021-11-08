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

import { urlSearchTransfer } from 'app/pages/MainPage/pages/VizPage/utils';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import ChartRequest from '../ChartWorkbenchPage/models/ChartHttpRequest';
import { BoardProvider } from '../DashBoardPage/components/BoardProvider';
import FullScreenPanel from '../DashBoardPage/components/FullScreenPanel';
import TitleHeader from '../DashBoardPage/components/TitleHeader';
import AutoBoardCore from '../DashBoardPage/pages/Dashboard/AutoDashboard/AutoBoardCore';
import FreeBoardCore from '../DashBoardPage/pages/Dashboard/FreeDashboard/FreeBoardCore';
import { getBoardDownloadParams } from '../DashBoardPage/slice/asyncActions';
import { selectShareBoardInfo } from '../DashBoardPage/slice/selector';
import { Dashboard, VizRenderMode } from '../DashBoardPage/slice/types';
import { OnLoadTasksType } from '../MainPage/Navbar/DownloadListPopup';
import { DownloadTask } from '../MainPage/slice/types';
import { DownloadTaskContainer } from './DownloadTaskContainer';
import { HeadlessBrowserIdentifier } from './HeadlessBrowserIdentifier';

export interface ShareBoardProps {
  dashboard: Dashboard;
  renderMode: VizRenderMode;
  filterSearchUrl: string;
  allowDownload: boolean;
  onLoadShareTask: OnLoadTasksType;
  onDownloadFile: (item: DownloadTask) => void;
  onMakeShareDownloadDataTask: (
    downloadParams: ChartRequest[],
    fileName: string,
  ) => void;
}

export const BoardForShare: React.FC<ShareBoardProps> = memo(
  ({
    dashboard,
    renderMode,
    filterSearchUrl,
    allowDownload,
    onMakeShareDownloadDataTask,
    onLoadShareTask,
    onDownloadFile,
  }) => {
    const dispatch = useDispatch();

    const shareBoardInfo = useSelector(selectShareBoardInfo);
    const { needFetchItems, hasFetchItems, boardWidthHeight } = shareBoardInfo;

    const [allItemFetched, setAllItemFetched] = useState(false);
    useEffect(() => {
      // console.log('--needFetchItems', needFetchItems);
      // console.log('--hasFetchItems', hasFetchItems);
      if (needFetchItems.length === hasFetchItems.length) {
        setAllItemFetched(true);
      }
    }, [hasFetchItems, needFetchItems]);

    // for sever Browser

    const boardDownLoadAction = useCallback(
      (params: { boardId: string }) => async dispatch => {
        const { boardId } = params;
        const { requestParams, fileName } = await dispatch(
          getBoardDownloadParams({ boardId }),
        );
        onMakeShareDownloadDataTask(requestParams, fileName);
      },
      [onMakeShareDownloadDataTask],
    );

    const searchParams = useMemo(() => {
      return filterSearchUrl
        ? urlSearchTransfer.toParams(filterSearchUrl)
        : undefined;
    }, [filterSearchUrl]);

    const onShareDownloadData = useCallback(() => {
      dispatch(boardDownLoadAction({ boardId: dashboard.id }));
    }, [boardDownLoadAction, dashboard.id, dispatch]);

    const viewBoard = useMemo(() => {
      let boardType = dashboard?.config?.type;
      if (!dashboard || !boardType) return null;
      return (
        <BoardProvider
          board={dashboard}
          editing={false}
          autoFit={false}
          renderMode={renderMode}
          allowDownload={allowDownload}
        >
          <Wrapper>
            <TitleHeader onShareDownloadData={onShareDownloadData}>
              <DownloadTaskContainer
                onLoadTasks={onLoadShareTask}
                onDownloadFile={onDownloadFile}
              ></DownloadTaskContainer>
            </TitleHeader>
            {boardType === 'auto' && <AutoBoardCore boardId={dashboard.id} />}
            {boardType === 'free' && <FreeBoardCore boardId={dashboard.id} />}
            <FullScreenPanel />
          </Wrapper>
        </BoardProvider>
      );
    }, [
      allowDownload,
      dashboard,
      onDownloadFile,
      onLoadShareTask,
      onShareDownloadData,
      renderMode,
    ]);

    return (
      <DndProvider backend={HTML5Backend}>
        {viewBoard}
        <HeadlessBrowserIdentifier
          renderSign={allItemFetched}
          width={Number(boardWidthHeight[0]) || 0}
          height={Number(boardWidthHeight[1]) || 0}
        />
      </DndProvider>
    );
  },
);

export default BoardForShare;
const Wrapper = styled.div<{}>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;

  padding-bottom: 0;

  background-color: ${p => p.theme.bodyBackground};
`;
