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
import { BoardContext } from '../components/BoardProvider/BoardProvider';
import { WidgetMethodContext } from '../components/WidgetProvider/WidgetMethodProvider';
import { widgetActionType } from '../components/WidgetToolBar/config';
import { Widget } from '../pages/Board/slice/types';

export default function useWidgetAction() {
  const {
    onWidgetFullScreen,
    onWidgetGetData,

    onEditWidgetGetData,
    onEditChartWidget,
    onEditMediaWidget,
    onEditContainerWidget,
    onEditWidgetLinkage,
    onEditWidgetJump,
    onEditControllerWidget,
    onEditWidgetCloseLinkage,
    onEditWidgetCloseJump,
    onEditWidgetToggleLock,
  } = useContext(WidgetMethodContext);
  const { editing, orgId } = useContext(BoardContext);
  const { deleteActiveWidgets } = useContext(BoardActionContext);
  const onWidgetEdit = useCallback(
    (widget: Widget) => {
      const type = widget.config.type;
      switch (type) {
        case 'chart':
          onEditChartWidget(widget, orgId);
          break;
        case 'controller':
          onEditContainerWidget(widget.id);
          break;
        case 'container':
          onEditControllerWidget(widget);
          break;
        case 'media':
          onEditMediaWidget(widget.id);
          break;
        default:
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const widgetAction = useCallback((key: widgetActionType, widget: Widget) => {
    switch (key) {
      case 'delete':
        deleteActiveWidgets([widget.id]);
        break;
      case 'fullScreen':
        onWidgetFullScreen(widget.dashboardId, widget.id);
        break;
      case 'refresh':
        if (editing) {
          onEditWidgetGetData(widget);
        } else {
          onWidgetGetData(widget);
        }
        break;
      case 'edit':
        onWidgetEdit(widget);
        break;
      case 'makeLinkage':
        onEditWidgetLinkage(widget.id);
        break;
      case 'closeLinkage':
        onEditWidgetCloseLinkage(widget);
        break;
      case 'makeJump':
        onEditWidgetJump(widget.id);
        break;
      case 'closeJump':
        onEditWidgetCloseJump(widget);
        break;
      case 'lock':
        onEditWidgetToggleLock(widget, true);
        break;
      case 'unlock':
        onEditWidgetToggleLock(widget, false);
        break;
      default:
        console.log('__ not found __ action', key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return widgetAction;
}
