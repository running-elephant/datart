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
import {
  BoardType,
  WidgetType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { createQueryBtn } from 'app/pages/DashBoardPage/utils/widget';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import { editDashBoardInfoActions } from '..';
import { addWidgetsToEditBoard } from './../thunk';
export type BtnActionParams = {
  type: ControllerFacadeTypes | WidgetType;
  boardId: string;
  boardType: BoardType;
};
export const addControlerAction =
  (opt: BtnActionParams) => async (dispatch, getState) => {
    switch (opt.type as WidgetType) {
      case 'query':
        const widget = createQueryBtn({
          boardId: opt.boardId,
          boardType: opt.boardType,
          type: opt.type as any,
        });
        dispatch(addWidgetsToEditBoard([widget]));
        break;
      case 'reset':
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
