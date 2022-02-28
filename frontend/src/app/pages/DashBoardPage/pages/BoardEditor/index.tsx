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
import ChartEditor from 'app/components/ChartEditor';
import { selectVizs } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ActionCreators } from 'redux-undo';
import styled from 'styled-components/macro';
import { uuidv4 } from 'utils/utils';
import { BoardLoading } from '../../components/BoardLoading';
import { BoardProvider } from '../../components/BoardProvider/BoardProvider';
import TitleHeader from '../../components/TitleHeader';
import { checkLinkAndJumpErr } from '../../utils';
import { fetchBoardDetail } from '../Board/slice/thunk';
import { DataChart, WidgetContentChartType } from '../Board/slice/types';
import AutoEditor from './AutoEditor/index';
import ControllerWidgetPanel from './components/ControllerWidgetPanel';
import { LinkagePanel } from './components/LinkagePanel';
import { SettingJumpModal } from './components/SettingJumpModal';
import FreeEditor from './FreeEditor/index';
import {
  editBoardStackActions,
  editDashBoardInfoActions,
  editWidgetInfoActions,
} from './slice';
import {
  addVariablesToBoard,
  clearEditBoardState,
  editHasChartWidget,
} from './slice/actions/actions';
import {
  selectBoardChartEditorProps,
  selectEditBoard,
  selectEditBoardLoading,
  selectWidgetRecord,
} from './slice/selectors';
import { addChartWidget, fetchEditBoardDetail } from './slice/thunk';

export const BoardEditor: React.FC<{
  boardId: string;
  allowManage?: boolean;
}> = memo(({ boardId, allowManage }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const board = useSelector(selectEditBoard);
  const boardLoading = useSelector(selectEditBoardLoading);
  const boardChartEditorProps = useSelector(selectBoardChartEditorProps);
  const histState = history.location.state as any;
  const vizs = useSelector(selectVizs);
  const WidgetRecord = useSelector(selectWidgetRecord);
  const [folderIds, setFolderIds] = useState<any[]>([]);

  const propsFolderIds = useMemo(() => {
    return vizs?.map(folder => {
      return folder.relId;
    });
  }, [vizs]);

  useEffect(() => {
    let WidgetMapValue = Object.values(WidgetRecord);

    WidgetMapValue?.forEach(v => {
      let errInfo = checkLinkAndJumpErr(v, folderIds);
      dispatch(
        editWidgetInfoActions.setWidgetErrInfo({
          boardId: v.dashboardId,
          widgetId: v.id,
          errInfo: errInfo,
          errorType: 'interaction',
        }),
      );
    });
  }, [WidgetRecord, dispatch, folderIds]);

  useEffect(() => {
    if (folderIds.length !== propsFolderIds?.length) {
      setFolderIds(propsFolderIds);
    }
  }, [folderIds.length, propsFolderIds]);

  const onCloseChartEditor = useCallback(() => {
    dispatch(editDashBoardInfoActions.changeChartEditorProps(undefined));
  }, [dispatch]);

  const onSaveToWidget = useCallback(
    (chartType: WidgetContentChartType, dataChart: DataChart, view) => {
      const widgetId = boardChartEditorProps?.widgetId!;
      dispatch(editHasChartWidget({ widgetId, dataChart, view }));
      onCloseChartEditor();
      dispatch(addVariablesToBoard(view.variables));
    },
    [boardChartEditorProps?.widgetId, dispatch, onCloseChartEditor],
  );
  const onCloseBoardEditor = useCallback(
    (bool: boolean) => {
      const pathName = history.location.pathname;
      const prePath = pathName.split('/boardEditor')[0];
      history.push(`${prePath}`);
      dispatch(editBoardStackActions.clearEditBoardState());
      dispatch(ActionCreators.clearHistory());
      // 更新view界面数据
      dispatch(fetchBoardDetail({ dashboardRelId: boardId }));
    },
    [boardId, dispatch, history],
  );
  const boardEditor = useMemo(() => {
    if (!board.id) return null;
    if (board?.id !== boardId) {
      return null;
    }
    const boardType = board.config?.type;

    return (
      <BoardProvider
        board={board}
        editing={true}
        autoFit={false}
        allowDownload={false}
        allowShare={false}
        allowManage={false}
        renderMode="read"
      >
        <TitleHeader toggleBoardEditor={onCloseBoardEditor} />
        {boardType === 'auto' && <AutoEditor />}
        {boardType === 'free' && <FreeEditor />}
        <ControllerWidgetPanel />
        <LinkagePanel />
        <SettingJumpModal />
        {boardChartEditorProps && (
          <ChartEditor
            {...boardChartEditorProps}
            onClose={onCloseChartEditor}
            onSaveInWidget={onSaveToWidget}
          />
        )}
      </BoardProvider>
    );
  }, [
    boardChartEditorProps,
    board,
    boardId,
    onCloseBoardEditor,
    onCloseChartEditor,
    onSaveToWidget,
  ]);
  const initialization = useCallback(async () => {
    await dispatch(fetchEditBoardDetail(boardId));

    try {
      if (histState?.widgetInfo) {
        const widgetInfo = JSON.parse(histState.widgetInfo);

        if (widgetInfo) {
          let subType: 'widgetChart' | 'dataChart' = 'dataChart';

          if (!widgetInfo.dataChart.id) {
            widgetInfo.dataChart.id = 'widget_' + uuidv4();
            subType = 'widgetChart';
          }

          dispatch(
            addChartWidget({
              boardId,
              chartId: widgetInfo.dataChart.id,
              boardType: widgetInfo.dashboardType,
              dataChart: widgetInfo.dataChart,
              view: widgetInfo.dataview,
              subType: subType,
            }),
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, histState?.widgetInfo, boardId]);

  useEffect(() => {
    initialization();
    return () => {
      // fix issue: #800
      onCloseChartEditor();
      dispatch(clearEditBoardState());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onCloseChartEditor]);

  return (
    <Wrapper>
      <DndProvider backend={HTML5Backend}>
        {boardEditor}
        {boardLoading && <BoardLoading />}
      </DndProvider>
    </Wrapper>
  );
});
export default BoardEditor;
const Wrapper = styled.div`
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
