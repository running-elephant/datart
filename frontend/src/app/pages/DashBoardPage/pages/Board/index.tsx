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

import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useResizeObserver from 'app/hooks/useResizeObserver';
import { selectVizs } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import { urlSearchTransfer } from 'app/pages/MainPage/pages/VizPage/utils';
import { FC, memo, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import TitleHeader from '../../components/BoardHeader/ViewHeader';
import { BoardLoading } from '../../components/BoardLoading';
import { BoardInitProvider } from '../../components/BoardProvider/BoardInitProvider';
import { FullScreenPanel } from '../../components/FullScreenPanel/FullScreenPanel';
import { checkLinkAndJumpErr } from '../../utils';
import { editDashBoardInfoActions } from '../BoardEditor/slice';
import { AutoBoardCore } from './AutoDashboard/AutoBoardCore';
import { FreeBoardCore } from './FreeDashboard/FreeBoardCore';
import { boardActions } from './slice';
import {
  makeSelectBoardConfigById,
  selectBoardWidgetMapById,
} from './slice/selector';
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

export const Board: FC<BoardProps> = memo(
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
    const history = useHistory();
    const boardId = id;
    const dispatch = useDispatch();
    const t = useI18NPrefix();

    const ReadBoardHide = history.location.pathname.includes('boardEditor');
    const { ref, width, height } = useResizeObserver<HTMLDivElement>({
      refreshMode: 'debounce',
      refreshRate: 2000,
    });

    const dashboard = useSelector((state: { board: BoardState }) =>
      makeSelectBoardConfigById()(state, boardId),
    );
    const vizs = useSelector(selectVizs);
    const [folderId, setFolderId] = useState<any[]>([]);
    const BoardWidgetMap = useSelector((state: { board: BoardState }) =>
      selectBoardWidgetMapById(state, boardId),
    );

    const searchParams = useMemo(() => {
      return filterSearchUrl
        ? urlSearchTransfer.toParams(filterSearchUrl)
        : undefined;
    }, [filterSearchUrl]);

    const propsFolderIds = useMemo(() => {
      return vizs?.map(folder => {
        return folder.relId;
      });
    }, [vizs]);

    const viewBoard = useMemo(() => {
      if (ReadBoardHide) return null;
      let boardType = dashboard?.config?.type;
      if (dashboard && boardType) {
        return (
          <div className="board-provider">
            <BoardInitProvider
              board={dashboard}
              editing={false}
              autoFit={autoFit}
              renderMode={renderMode}
              allowDownload={allowDownload}
              allowShare={allowShare}
              allowManage={allowManage}
            >
              {!hideTitle && <TitleHeader />}
              {boardType === 'auto' && <AutoBoardCore boardId={dashboard.id} />}
              {boardType === 'free' && (
                <FreeBoardCore
                  boardId={dashboard.id}
                  showZoomCtrl={showZoomCtrl}
                />
              )}
              <FullScreenPanel />
            </BoardInitProvider>
          </div>
        );
      } else {
        return <BoardLoading />;
      }
    }, [
      ReadBoardHide,
      dashboard,
      autoFit,
      renderMode,
      allowDownload,
      allowShare,
      allowManage,
      hideTitle,
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

    useEffect(() => {
      dispatch(editDashBoardInfoActions.changeChartEditorProps(undefined));
      if (boardId && fetchData && !ReadBoardHide) {
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
      };
    }, [ReadBoardHide, boardId, dispatch, fetchData, searchParams]);

    useEffect(() => {
      if (folderId.length !== propsFolderIds?.length) {
        setFolderId(propsFolderIds);
      }
    }, [propsFolderIds, folderId.length]);

    useEffect(() => {
      let WidgetMapValue = Object.values(BoardWidgetMap);
      WidgetMapValue?.forEach(v => {
        let errInfo = checkLinkAndJumpErr(v, folderId);
        dispatch(
          boardActions.setWidgetErrInfo({
            boardId: v.dashboardId,
            widgetId: v.id,
            errInfo: t(errInfo),
            errorType: 'interaction',
          }),
        );
      });
    }, [folderId, BoardWidgetMap, dispatch, t]);

    return (
      <Wrapper ref={ref} className="dashboard-box">
        <DndProvider backend={HTML5Backend}>{viewBoard}</DndProvider>
      </Wrapper>
    );
  },
);

export default Board;

const Wrapper = styled.div`
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
