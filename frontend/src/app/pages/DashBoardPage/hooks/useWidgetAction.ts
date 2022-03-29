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
import { useCallback, useContext } from 'react';
import { BoardActionContext } from '../components/BoardProvider/BoardActionProvider';
import { WidgetMethodContext } from '../components/WidgetProvider/WidgetMethodProvider';
import { widgetActionType } from '../components/WidgetToolBar/config';
import { Widget } from '../pages/Board/slice/types';

export default function useWidgetAction() {
  const { onWidgetAction } = useContext(WidgetMethodContext);
  const { deleteActiveWidgets } = useContext(BoardActionContext);
  const widgetAction = useCallback(
    (key: widgetActionType, widget: Widget) => {
      switch (key) {
        case 'delete':
          deleteActiveWidgets([widget.id]);
          break;
        default:
          onWidgetAction(key, widget);
          break;
      }
    },
    [deleteActiveWidgets, onWidgetAction],
  );
  return widgetAction;
}
