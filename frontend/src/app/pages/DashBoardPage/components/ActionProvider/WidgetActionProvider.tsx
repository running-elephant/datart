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
import { PageInfo } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { ChartMouseEventParams } from 'app/types/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import debounce from 'lodash/debounce';
import { createContext, FC, memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  widgetChartClickAction,
  widgetGetDataAction,
  widgetToClearLinkageAction,
} from '../../actions/widgetAction';
import { boardActions } from '../../pages/Board/slice';
import {
  resetControllerAction,
  widgetsQueryAction,
} from '../../pages/Board/slice/asyncActions';
import {
  getChartWidgetDataAsync,
  getControllerOptions,
  renderedWidgetAsync,
} from '../../pages/Board/slice/thunk';
import { VizRenderMode } from '../../pages/Board/slice/types';
import {
  editBoardStackActions,
  editDashBoardInfoActions,
  editWidgetInfoActions,
} from '../../pages/BoardEditor/slice';
import {
  clearActiveWidgets,
  closeJumpAction,
  closeLinkageAction,
  copyWidgetsAction,
  deleteWidgetsAction,
  editChartInWidgetAction,
  pasteWidgetsAction,
  widgetsToPositionAction,
} from '../../pages/BoardEditor/slice/actions/actions';
import { editWidgetsQueryAction } from '../../pages/BoardEditor/slice/actions/controlActions';
import {
  getEditChartWidgetDataAsync,
  getEditControllerOptions,
  renderedEditWidgetAsync,
} from '../../pages/BoardEditor/slice/thunk';
import { Widget, WidgetConf } from '../../types/widgetTypes';
import {
  getCascadeControllers,
  getNeedRefreshWidgetsByController,
} from '../../utils/widget';

export const WidgetActionProvider: FC<{
  orgId: string;
  boardId: string;
  boardEditing: boolean;
  renderMode: VizRenderMode;
}> = memo(({ boardEditing, boardId, orgId, renderMode, children }) => {
  const dispatch = useDispatch();
  const history = useHistory<any>();
  const methods = useMemo(() => {
    const contextValue: WidgetActionContextProps = {
      onEditLayerToTop: () => {
        dispatch(widgetsToPositionAction('top'));
      },
      onEditLayerToBottom: () => {
        dispatch(widgetsToPositionAction('bottom'));
      },
      onEditCopyWidgets: (ids?: string[]) => {
        dispatch(copyWidgetsAction());
      },
      onEditPasteWidgets: () => {
        dispatch(pasteWidgetsAction());
      },
      onEditDeleteActiveWidgets: debounce((ids?: string[]) => {
        dispatch(deleteWidgetsAction(ids));
      }, 200),
      onRenderedWidgetById: (wid: string) => {
        if (boardEditing) {
          dispatch(
            renderedEditWidgetAsync({ boardId: boardId, widgetId: wid }),
          );
        } else {
          dispatch(
            renderedWidgetAsync({
              boardId: boardId,
              widgetId: wid,
              renderMode: renderMode,
            }),
          );
        }
      },
      onEditClearActiveWidgets: () => {
        dispatch(clearActiveWidgets());
      },
      onWidgetsQuery: debounce(() => {
        if (boardEditing) {
          dispatch(editWidgetsQueryAction());
        } else {
          dispatch(widgetsQueryAction({ boardId, renderMode }));
        }
      }, 500),
      onWidgetsReset: debounce(() => {
        if (boardEditing) {
          return;
        } else {
          dispatch(resetControllerAction({ boardId, renderMode }));
        }
      }, 500),
      onRefreshWidgetsByController: debounce((widget: Widget) => {
        const controllerIds = getCascadeControllers(widget);
        controllerIds.forEach(controlWidgetId => {
          if (boardEditing) {
            dispatch(getEditControllerOptions(controlWidgetId));
          } else {
            dispatch(
              getControllerOptions({
                boardId,
                widgetId: controlWidgetId,
                renderMode,
              }),
            );
          }
        });

        const pageInfo: Partial<PageInfo> = {
          pageNo: 1,
        };
        const chartWidgetIds = getNeedRefreshWidgetsByController(widget);

        chartWidgetIds.forEach(widgetId => {
          if (boardEditing) {
            dispatch(
              getEditChartWidgetDataAsync({ widgetId, option: { pageInfo } }),
            );
          } else {
            dispatch(
              getChartWidgetDataAsync({
                boardId,
                widgetId,
                renderMode,
                option: { pageInfo },
              }),
            );
          }
        });
      }, 500),
      onUpdateWidgetConfig: (config: WidgetConf, wid: string) => {
        dispatch(editBoardStackActions.updateWidgetConfig({ wid, config }));
      },
      onWidgetUpdate: (widget: Widget) => {
        if (boardEditing) {
          dispatch(editBoardStackActions.updateWidget(widget));
        } else {
          dispatch(boardActions.updateWidget(widget));
        }
      },
      //
      onWidgetChartClick: (widget: Widget, params: ChartMouseEventParams) => {
        dispatch(
          widgetChartClickAction({
            boardId,
            editing: boardEditing,
            renderMode,
            widget,
            params,
            history,
          }),
        );
      },

      onWidgetClearLinkage: (widget: Widget) => {
        dispatch(widgetToClearLinkageAction(boardEditing, widget, renderMode));
      },
      onWidgetFullScreen: (itemId: string) => {
        dispatch(
          boardActions.updateFullScreenPanel({
            boardId,
            itemId,
          }),
        );
      },
      onWidgetGetData: (widget: Widget) => {
        dispatch(widgetGetDataAction(boardEditing, widget, renderMode));
      },

      onEditChartWidget: (widget: Widget) => {
        const widgetTypeId = (widget as any).config.widgetTypeId;
        const chartType =
          widgetTypeId === 'selfChart' ? 'widgetChart' : 'dataChart';
        dispatch(
          editChartInWidgetAction({
            orgId,
            widgetId: widget.id,
            chartName: widget.config.name,
            dataChartId: widget.datachartId,
            chartType: chartType,
          }),
        );
      },
      onEditMediaWidget: (id: string) => {
        dispatch(editWidgetInfoActions.openWidgetEditing({ id }));
      },
      onEditContainerWidget: (id: string) => {
        dispatch(editWidgetInfoActions.openWidgetEditing({ id }));
        dispatch(editDashBoardInfoActions.changeShowBlockMask(false));
      },
      onEditControllerWidget: (widget: Widget) => {
        dispatch(
          editDashBoardInfoActions.changeControllerPanel({
            type: 'edit',
            widgetId: widget.id,
            controllerType: widget.config.content.type as ControllerFacadeTypes,
          }),
        );
      },
      onEditWidgetLinkage: (widgetId: string) => {
        dispatch(
          editDashBoardInfoActions.changeLinkagePanel({
            type: 'add',
            widgetId,
          }),
        );
      },
      onEditWidgetJump: (widgetId: string) => {
        dispatch(
          editDashBoardInfoActions.changeJumpPanel({ visible: true, widgetId }),
        );
      },
      onEditWidgetCloseLinkage: (widget: Widget) => {
        dispatch(closeLinkageAction(widget));
      },
      onEditWidgetCloseJump: (widget: Widget) => {
        dispatch(closeJumpAction(widget));
      },
      onEditWidgetLock: (id: string) => {
        dispatch(editBoardStackActions.toggleLockWidget({ id, lock: true }));
      },
      onEditWidgetUnLock: (id: string) => {
        dispatch(editBoardStackActions.toggleLockWidget({ id, lock: false }));
      },
      onWidgetDataUpdate: ({ computedFields, payload, widgetId }) => {
        dispatch(
          boardActions.updateDataChartGroup({
            id: widgetId,
            payload,
          }),
        );

        dispatch(
          boardActions.updateDataChartComputedFields({
            id: widgetId,
            computedFields,
          }),
        );
      },
    };
    return contextValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardEditing, boardId, dispatch, orgId, renderMode]);

  return (
    <WidgetActionContext.Provider value={methods}>
      {children}
    </WidgetActionContext.Provider>
  );
});
export interface WidgetActionContextProps {
  // all
  onWidgetChartClick: (widget: Widget, params: ChartMouseEventParams) => void;
  onWidgetClearLinkage: (widget: Widget) => void;
  onWidgetGetData: (widget: Widget) => void;
  onWidgetUpdate: (widget: Widget) => void;
  onUpdateWidgetConfig: (config: WidgetConf, wid: string) => void;
  onRefreshWidgetsByController: (widget: Widget) => void;
  onWidgetsQuery: () => void;
  onRenderedWidgetById: (wid: string) => void;
  onWidgetDataUpdate: ({
    computedFields,
    payload,
    widgetId,
  }: {
    computedFields: any;
    payload: ChartConfig;
    widgetId: string;
  }) => void;

  // read
  onWidgetFullScreen: (itemId: string) => void;
  onWidgetsReset: () => void;

  // editor
  onEditChartWidget: (widget: Widget) => void;
  onEditContainerWidget: (wid: string) => void;
  onEditMediaWidget: (wid: string) => void;
  onEditControllerWidget: (widget: Widget) => void;
  onEditWidgetLinkage: (wid: string) => void;
  onEditWidgetJump: (wid: string) => void;
  onEditWidgetCloseLinkage: (widget: Widget) => void;
  onEditWidgetCloseJump: (widget: Widget) => void;
  onEditWidgetLock: (id: string) => void;
  onEditWidgetUnLock: (id: string) => void;
  onEditClearActiveWidgets: () => void;
  onEditDeleteActiveWidgets: (ids?: string[]) => void;
  onEditLayerToTop: () => void;
  onEditLayerToBottom: () => void;
  onEditCopyWidgets: (ids?: string[]) => void;
  onEditPasteWidgets: () => void;
  //
}
export const WidgetActionContext = createContext<WidgetActionContextProps>(
  {} as WidgetActionContextProps,
);
