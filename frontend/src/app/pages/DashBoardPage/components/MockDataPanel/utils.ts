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
import { CloneValueDeep } from 'utils/object';
import { ORIGINAL_TYPE_MAP } from '../../constants';
import {
  BoardState,
  Dashboard,
  DataChart,
} from '../../pages/Board/slice/types';
import { Widget } from '../../types/widgetTypes';
const emptyWidgets = [];
export const getChartWidgets = (
  state: { board: BoardState },
  boardId: string,
) => {
  const widgetMap = state.board.widgetRecord;

  if (!widgetMap[boardId]) {
    return emptyWidgets;
  }
  let chartWidgets = Object.values(widgetMap[boardId]).filter(
    widget => widget.config.type === 'chart',
  );
  return chartWidgets;
};

export const handleBoardTplData = (
  dataMap: Record<string, { id: string; name: string; data: object }>,
  boardTplData: {
    board: Dashboard;
    widgetMap: Record<string, Widget>;
    dataChartMap: Record<string, DataChart>;
  },
) => {
  const { board, widgetMap, dataChartMap } = boardTplData;
  let newBoard = CloneValueDeep(board) as Partial<Dashboard>;
  delete newBoard.queryVariables;
  newBoard.config = JSON.stringify(newBoard.config) as any;
  const widgets = Object.values(widgetMap).map(w => {
    const newWidget = CloneValueDeep(w) as Partial<Widget>;
    newWidget.viewIds = [];

    if (newWidget.config?.type === 'chart') {
      newWidget.config.originalType = ORIGINAL_TYPE_MAP.ownedChart;
      const datachart = dataChartMap[newWidget.datachartId || ''];

      if (datachart) {
        let newChart = CloneValueDeep(datachart) as Partial<DataChart>;
        newChart.viewId = '';
        newChart.orgId = '';
        newWidget.config.content.dataChart = newChart;
      }
    }
    newWidget.datachartId = '';
    newWidget.config = JSON.stringify(newWidget.config) as any;
    return newWidget;
  });
  return {
    dashboard: newBoard,
    widgets,
  };
};
