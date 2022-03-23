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

import useMount from 'app/hooks/useMount';
import useRouteQuery from 'app/hooks/useRouteQuery';
import ChartManager from 'app/models/ChartManager';
import {
  downloadShareDataChartFile,
  loadShareTask,
  makeShareDownloadDataTask,
} from 'app/utils/fetch';
import { StorageKeys } from 'globalConstants';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import persistence from 'utils/persistence';
import { uuidv4 } from 'utils/utils';
import ChartDataRequest from '../../types/ChartDataRequest';
import { BoardLoading } from '../DashBoardPage/components/BoardLoading';
import { useBoardSlice } from '../DashBoardPage/pages/Board/slice';
import { selectShareBoard } from '../DashBoardPage/pages/Board/slice/selector';
import { VizRenderMode } from '../DashBoardPage/pages/Board/slice/types';
import { useEditBoardSlice } from '../DashBoardPage/pages/BoardEditor/slice';
import { FilterSearchParams } from '../MainPage/pages/VizPage/slice/types';
import { urlSearchTransfer } from '../MainPage/pages/VizPage/utils';
import BoardForShare from './BoardForShare';
import PasswordModal from './PasswordModal';
import { useShareSlice } from './slice';
import {
  selectNeedPassword,
  selectShareExecuteTokenMap,
  selectSharePassword,
  selectShareVizType,
} from './slice/selectors';
import { fetchShareVizInfo } from './slice/thunks';
function ShareDashboard() {
  const { shareActions: actions } = useShareSlice();
  useEditBoardSlice();
  useBoardSlice();

  const dispatch = useDispatch();
  const location = useLocation();
  const search = location.search;

  const [shareClientId, setShareClientId] = useState('');
  const executeTokenMap = useSelector(selectShareExecuteTokenMap);
  const needPassword = useSelector(selectNeedPassword);
  const sharePassword = useSelector(selectSharePassword);
  const shareBoard = useSelector(selectShareBoard);
  const vizType = useSelector(selectShareVizType);

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

  const searchParams = useMemo(() => {
    return urlSearchTransfer.toParams(search);
  }, [search]);

  const loadVizData = () => {
    if (Boolean(usePassword)) {
      const previousPassword = persistence.session.get(shareToken);
      if (previousPassword) {
        fetchShareVizInfoImpl(shareToken, previousPassword, searchParams);
      } else {
        dispatch(actions.saveNeedPassword(true));
      }
    } else {
      fetchShareVizInfoImpl(shareToken, undefined, searchParams);
    }
  };
  useMount(() => {
    ChartManager.instance()
      .load()
      .catch(err => console.error('Fail to load customize charts with ', err));

    loadVizData();
  });

  const fetchShareVizInfoImpl = (
    token?: string,
    pwd?: string,
    params?: FilterSearchParams,
  ) => {
    dispatch(
      fetchShareVizInfo({
        shareToken: token,
        sharePassword: pwd,
        filterSearchParams: params,
        renderMode,
      }),
    );
  };

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
        password: sharePassword,
        clientId: shareClientId,
      });
  }, [shareToken, sharePassword, shareClientId]);

  const onMakeShareDownloadDataTask = useCallback(
    (downloadParams: ChartDataRequest[], fileName: string) => {
      if (shareClientId && executeTokenMap) {
        dispatch(
          makeShareDownloadDataTask({
            clientId: shareClientId,
            executeToken: executeTokenMap,
            downloadParams: downloadParams,
            shareToken,
            fileName: fileName,
            resolve: () => {
              dispatch(actions.setShareDownloadPolling(true));
            },
            password: sharePassword,
          }),
        );
      }
    },
    [
      shareClientId,
      shareToken,
      sharePassword,
      executeTokenMap,
      dispatch,
      actions,
    ],
  );

  const onDownloadFile = useCallback(
    task => {
      downloadShareDataChartFile({
        downloadId: task.id,
        shareToken,
        password: sharePassword,
      }).then(() => {
        dispatch(actions.setShareDownloadPolling(true));
      });
    },
    [shareToken, sharePassword, dispatch, actions],
  );

  return (
    <StyledWrapper className="datart-viz">
      <PasswordModal
        visible={Boolean(needPassword) && Boolean(usePassword)}
        onChange={sharePassword => {
          fetchShareVizInfoImpl(shareToken, sharePassword);
        }}
      />
      {!vizType && !needPassword && (
        <div className="loading-container">
          <BoardLoading />
        </div>
      )}

      {!Boolean(needPassword) && vizType === 'DASHBOARD' && shareBoard && (
        <BoardForShare
          dashboard={shareBoard}
          allowDownload={true}
          loadVizData={loadVizData}
          onMakeShareDownloadDataTask={onMakeShareDownloadDataTask}
          renderMode={renderMode}
          filterSearchUrl={''}
          onLoadShareTask={onLoadShareTask}
          onDownloadFile={onDownloadFile}
        />
      )}
    </StyledWrapper>
  );
}
export default ShareDashboard;
const StyledWrapper = styled.div`
  width: 100%;
  height: 100vh;
  .loading-container {
    display: flex;
    height: 100vh;
  }
`;
