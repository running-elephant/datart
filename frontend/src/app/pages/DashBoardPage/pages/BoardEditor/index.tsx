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
import styled from 'styled-components/macro';
import { BoardProvider } from '../../components/BoardProvider';
import TitleHeader from '../../components/TitleHeader';
import { DataChart, WidgetContentChartType } from '../Board/slice/types';
import AutoEditor from './AutoEditor/index';
import FilterWidgetPanel from './components/ControllerWidgetPanel';
import { LinkagePanel } from './components/LinkagePanel';
import { SettingJumpModal } from './components/SettingJumpModal';
import FreeEditor from './FreeEditor/index';
import { editDashBoardInfoActions } from './slice';
import { editWrapChartWidget } from './slice/actions';
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
  onCloseBoardEditor: (bool: boolean) => void;
}> = memo(
  ({
    dashboardId: boardId,
    allowDownload,
    allowShare,
    allowManage,
    onCloseBoardEditor,
  }) => {
    const dashboardId = boardId;
    const dispatch = useDispatch();
    const dashboard = useSelector(selectEditBoard);
    const boardChartEditorProps = useSelector(selectBoardChartEditorProps);
    const onCloseChartEditor = useCallback(() => {
      dispatch(editDashBoardInfoActions.changeChartEditorProps(undefined));
    }, [dispatch]);
    useEffect(() => {
      // dispatch(getEditBoardDetail(dashboardId));
      dispatch(fetchEditBoardDetail(dashboardId));
    }, [dashboardId, dispatch]);

    const onSaveToWidget = useCallback(
      (chartType: WidgetContentChartType, dataChart: DataChart, view) => {
        if (chartType === 'widgetChart') {
          const widgetId = boardChartEditorProps?.widgetId!;
          dispatch(editWrapChartWidget({ widgetId, dataChart, view }));
          onCloseChartEditor();
        } else {
          const widgetId = boardChartEditorProps?.widgetId!;
          dispatch(editWrapChartWidget({ widgetId, dataChart, view }));
          onCloseChartEditor();
        }
      },
      [boardChartEditorProps?.widgetId, dispatch, onCloseChartEditor],
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
          allowDownload={allowDownload}
          allowShare={allowShare}
          allowManage={allowManage}
          renderMode="read"
        >
          <Wrapper>
            <TitleHeader toggleBoardEditor={onCloseBoardEditor} />
            {boardType === 'auto' && <AutoEditor />}
            {boardType === 'free' && <FreeEditor />}
            <FilterWidgetPanel />
            <LinkagePanel />
            <SettingJumpModal />
            {boardChartEditorProps && (
              <ChartEditor
                {...boardChartEditorProps}
                onClose={onCloseChartEditor}
                onSaveInWidget={onSaveToWidget}
              />
            )}
          </Wrapper>
        </BoardProvider>
      );
      // return null;
    }, [
      boardChartEditorProps,
      dashboard,
      dashboardId,
      allowDownload,
      allowShare,
      allowManage,
      onCloseBoardEditor,
      onCloseChartEditor,
      onSaveToWidget,
    ]);
    return <DndProvider backend={HTML5Backend}>{boardEditor}</DndProvider>;
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

  /* flex-direction: column; */
`;
