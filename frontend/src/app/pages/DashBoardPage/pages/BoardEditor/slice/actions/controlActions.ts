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
import { ControllerFacadeTypes } from 'app/constants';
import {
  BoardType,
  WidgetType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { widgetToolKit } from 'app/pages/DashBoardPage/utils/widgetToolKit/widgetToolKit';
import { editDashBoardInfoActions } from '..';
import { PageInfo } from './../../../../../MainPage/pages/ViewPage/slice/types';
import { addWidgetsToEditBoard, getEditChartWidgetDataAsync } from './../thunk';
import { HistoryEditBoard } from './../types';

export type BtnActionParams = {
  type: WidgetType;
  boardId: string;
  boardType: BoardType;
};
export const addControllerAction =
  (opt: BtnActionParams) => async (dispatch, getState) => {
    switch (opt.type as WidgetType) {
      case 'query':
        const queryWidget = widgetToolKit.query.create({
          boardId: opt.boardId,
          boardType: opt.boardType,
          type: opt.type as any,
        });
        dispatch(addWidgetsToEditBoard([queryWidget]));

        break;
      case 'reset':
        const resetWidget = widgetToolKit.query.create({
          boardId: opt.boardId,
          boardType: opt.boardType,
          type: opt.type as any,
        });
        dispatch(addWidgetsToEditBoard([resetWidget]));

        break;
      default:
        dispatch(
          editDashBoardInfoActions.changeControllerPanel({
            type: 'add',
            widgetId: '',
            controllerType: opt.type as ControllerFacadeTypes,
          }),
        );
    }
  };

export const editWidgetsQueryAction = () => async (dispatch, getState) => {
  const pageInfo: Partial<PageInfo> = {
    pageNo: 1,
  };

  const editBoard = getState().editBoard as HistoryEditBoard;
  const widgetMap = editBoard.stack.present.widgetRecord;

  Object.values(widgetMap)
    .filter(it => it.config.type === 'chart')
    .forEach(it => {
      dispatch(
        getEditChartWidgetDataAsync({
          widgetId: it.id,
          option: { pageInfo },
        }),
      );
    });
};
