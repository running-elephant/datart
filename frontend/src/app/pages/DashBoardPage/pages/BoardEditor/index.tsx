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
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ActionCreators } from 'redux-undo';
import styled from 'styled-components/macro';
import { BoardLoading } from '../../components/BoardLoading';
import { BoardProvider } from '../../components/BoardProvider/BoardProvider';
import TitleHeader from '../../components/TitleHeader';
import { fetchBoardDetail } from '../Board/slice/thunk';
import { DataChart, WidgetContentChartType } from '../Board/slice/types';
import AutoEditor from './AutoEditor/index';
import ControllerWidgetPanel from './components/ControllerWidgetPanel';
import { LinkagePanel } from './components/LinkagePanel';
import { SettingJumpModal } from './components/SettingJumpModal';
import FreeEditor from './FreeEditor/index';
import { editBoardStackActions, editDashBoardInfoActions } from './slice';
import {
  addVariablesToBoard,
  editHasChartWidget,
} from './slice/actions/actions';
import {
  selectBoardChartEditorProps,
  selectEditBoard,
} from './slice/selectors';
import { fetchEditBoardDetail } from './slice/thunk';

export const BoardEditor: React.FC<{
  dashboardId: string;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowManage?: boolean;
}> = memo(
  ({ dashboardId: boardId, allowDownload, allowShare, allowManage }) => {
    const dashboardId = boardId;
    const dispatch = useDispatch();
    const history = useHistory();
    const dashboard = useSelector(selectEditBoard);
    const boardChartEditorProps = useSelector(selectBoardChartEditorProps);
    const onCloseChartEditor = useCallback(() => {
      dispatch(editDashBoardInfoActions.changeChartEditorProps(undefined));
    }, [dispatch]);
    useEffect(() => {
      dispatch(fetchEditBoardDetail(dashboardId));
    }, [dashboardId, dispatch]);

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
        dispatch(fetchBoardDetail({ dashboardRelId: dashboardId }));
      },
      [dashboardId, dispatch, history],
    );
    const boardEditor = useMemo(() => {
      if (!dashboard.id) return null;
      if (dashboard?.id !== dashboardId) {
        return null;
      }
      const boardType = dashboard.config?.type;

      return (
        <BoardProvider
          board={dashboard}
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
      dashboard,
      dashboardId,
      onCloseBoardEditor,
      onCloseChartEditor,
      onSaveToWidget,
    ]);
    return (
      <Wrapper>
        <DndProvider backend={HTML5Backend}>
          {boardEditor || <BoardLoading />}
        </DndProvider>
      </Wrapper>
    );
  },
);
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
