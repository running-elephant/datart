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

import { makeShareDownloadDataTask } from 'app/utils/fetch';
import { StorageKeys } from 'globalConstants';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import useRouteQuery from '../ChartWorkbenchPage/hooks/useRouteQuery';
import ChartRequest from '../ChartWorkbenchPage/models/ChartHttpRequest';
import { useEditBoardSlice } from '../DashBoardPage/pages/BoardEditor/slice';
import { useBoardSlice } from '../DashBoardPage/slice';
import { selectShareBoard } from '../DashBoardPage/slice/selector';
import { VizRenderMode } from '../DashBoardPage/slice/types';
import { FilterSearchParams } from '../MainPage/pages/VizPage/slice/types';
import { urlSearchTransfer } from '../MainPage/pages/VizPage/utils';
import { useStoryBoardSlice } from '../StoryBoardPage/slice';
import { selectShareStoryBoard } from '../StoryBoardPage/slice/selectors';
import BoardForShare from './BoardForShare';
import ChartPreviewBoardForShare from './ChartPreviewBoardForShare';
import { DownloadTaskContainer, loadShareTask } from './DownloadTaskContainer';
import PasswordModal from './PasswordModal';
import { downloadShareDataChartFile } from './sercive';
import { useShareSlice } from './slice';
import {
  selectChartPreview,
  selectShareExecuteTokenMap,
} from './slice/selectors';
import { fetchShareVizInfo } from './slice/thunks';
import { StoryPlayerForShare } from './StoryPlayerForShare';
export function SharePage() {
  const { shareActions: actions } = useShareSlice();
  useEditBoardSlice();
  useBoardSlice();
  useStoryBoardSlice();
  const dispatch = useDispatch();
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [shareClientId, setShareClientId] = useState('');
  const executeTokenMap = useSelector(selectShareExecuteTokenMap);
  const shareToken = useRouteQuery({
    key: 'token',
  }) as string;
  const usePassword = useRouteQuery({
    key: 'usePassword',
  });

  // in timed task eager=true for disable board lazyLoad
  const eager = useRouteQuery({
    key: 'eager',
  });
  const renderMode: VizRenderMode = eager ? 'schedule' : 'share';

  const location = useLocation();
  const search = location.search;
  const searchParams = useMemo(() => {
    return urlSearchTransfer.toParams(search);
  }, [search]);

  const chartPreview = useSelector(selectChartPreview);

  const shareBoard = useSelector(selectShareBoard);

  const shareStory = useSelector(selectShareStoryBoard);

  const fetchShareVizInfoImpl = useCallback(
    (sharePassword?: string, filterSearchParams?: FilterSearchParams) => {
      dispatch(
        fetchShareVizInfo({
          shareToken,
          sharePassword,
          filterSearchParams,
          renderMode,
        }),
      );
    },
    [dispatch, renderMode, shareToken],
  );
  useEffect(() => {
    if (!shareToken) {
      return;
    }
    if (!!usePassword) {
      const previousPassword = sessionStorage.getItem(shareToken);
      if (previousPassword) {
        fetchShareVizInfoImpl(previousPassword, searchParams);
      } else {
        setShowPasswordModal(true);
      }
      return;
    }
    fetchShareVizInfoImpl(undefined, searchParams);
  }, [shareToken, usePassword, fetchShareVizInfoImpl, searchParams]);

  const onLoadShareTask = useMemo(() => {
    const clientId = localStorage.getItem(StorageKeys.ShareClientId);
    if (clientId) {
      setShareClientId(clientId);
    } else {
      const id = uuidv4();
      setShareClientId(id);
      localStorage.setItem(StorageKeys.ShareClientId, uuidv4());
    }
    return () =>
      loadShareTask({
        shareToken,
        clientId: shareClientId,
      });
  }, [shareToken, shareClientId]);

  const onMakeShareDownloadDataTask = useCallback(
    (downloadParams: ChartRequest[], fileName: string) => {
      if (shareClientId && executeTokenMap) {
        dispatch(
          makeShareDownloadDataTask({
            clientId: shareClientId,
            executeToken: executeTokenMap,
            downloadParams: downloadParams,
            fileName: fileName,
            resolve: () => {
              dispatch(actions.setShareDownloadPolling(true));
            },
          }),
        );
      }
    },
    [shareClientId, executeTokenMap, dispatch, actions],
  );
  const onDownloadFile = useCallback(
    task => {
      downloadShareDataChartFile({ downloadId: task.id, shareToken }).then(
        () => {
          dispatch(actions.setShareDownloadPolling(true));
        },
      );
    },
    [shareToken, actions, dispatch],
  );
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <PasswordModal
        visible={showPasswordModal}
        onChange={sharePassword => {
          sessionStorage.setItem(shareToken, sharePassword);
          fetchShareVizInfoImpl(sharePassword);
          setShowPasswordModal(false);
        }}
      />

      {/* dataChart */}
      {chartPreview && chartPreview?.backendChart && (
        <DownloadTaskContainer
          onLoadTasks={onLoadShareTask}
          onDownloadFile={onDownloadFile}
        >
          <ChartPreviewBoardForShare
            chartPreview={chartPreview}
            onCreateDataChartDownloadTask={onMakeShareDownloadDataTask}
          />
        </DownloadTaskContainer>
      )}
      {/* dashboard */}
      {shareBoard && !shareStory && (
        <BoardForShare
          dashboard={shareBoard}
          allowDownload={true}
          onMakeShareDownloadDataTask={onMakeShareDownloadDataTask}
          renderMode={renderMode} //   TODO and task
          filterSearchUrl={''}
          onLoadShareTask={onLoadShareTask}
          onDownloadFile={onDownloadFile}
        />
      )}

      {shareStory && <StoryPlayerForShare storyBoard={shareStory} />}
    </div>
  );
}
