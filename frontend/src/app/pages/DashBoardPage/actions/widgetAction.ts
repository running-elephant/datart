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
import { urlSearchTransfer } from 'app/pages/MainPage/pages/VizPage/utils';
import { ChartMouseEventParams } from 'app/types/Chart';
import history from 'app/utils/history';
import { RootState } from 'types';
import { jumpTypes } from '../constants';
import { boardActions } from '../pages/Board/slice';
import {
  getChartWidgetDataAsync,
  getWidgetData,
} from '../pages/Board/slice/thunk';
import {
  BoardLinkFilter,
  VizRenderMode,
  Widget,
} from '../pages/Board/slice/types';
import {
  editDashBoardInfoActions,
  editWidgetInfoActions,
} from '../pages/BoardEditor/slice';
import {
  editorWidgetClearLinkageAction,
  widgetClearLinkageAction,
} from '../pages/BoardEditor/slice/actions/actions';
import {
  getEditChartWidgetDataAsync,
  getEditWidgetData,
} from '../pages/BoardEditor/slice/thunk';
import { getValueByRowData } from '../utils/widget';
export const toggleLinkageAction =
  (boardEditing: boolean, boardId: string, widgetId: string, toggle: boolean) =>
  dispatch => {
    if (boardEditing) {
      dispatch(
        editWidgetInfoActions.changeWidgetInLinking({
          boardId,
          widgetId,
          toggle,
        }),
      );
    } else {
      dispatch(
        boardActions.changeWidgetInLinking({
          boardId,
          widgetId,
          toggle,
        }),
      );
    }
  };
// tableChartClickAction
export const tableChartClickAction =
  (
    boardId: string,
    editing: boolean,
    renderMode: VizRenderMode,
    widget: Widget,
    params: ChartMouseEventParams,
  ) =>
  dispatch => {
    const opt = {
      pageInfo: { pageNo: params?.value?.pageNo },
      sorters: [
        {
          column: params?.seriesName!,
          operator: (params?.value as any)?.direction,
          aggOperator: (params?.value as any)?.aggOperator,
        },
      ],
    };
    if (editing) {
      dispatch(
        getEditChartWidgetDataAsync({
          widgetId: widget.id,
          option: opt,
        }),
      );
    } else {
      dispatch(
        getChartWidgetDataAsync({
          boardId,
          widgetId: widget.id,
          renderMode,
          option: opt,
        }),
      );
    }
  };

export const widgetClickJumpAction =
  (
    boardId: string,
    editing: boolean,
    renderMode: VizRenderMode,
    widget: Widget,
    params: ChartMouseEventParams,
  ) =>
  (dispatch, getState) => {
    const state = getState() as RootState;
    const orgId = state?.main?.orgId || '';
    const folderIds = state.viz?.vizs?.map(v => v.relId) || [];
    const jumpConfig = widget.config?.jumpConfig;
    const targetType = jumpConfig?.targetType || jumpTypes[0].value;

    if (
      jumpConfig?.targetType === 'INTERNAL' &&
      !folderIds.includes(jumpConfig.target.relId)
    ) {
      history.push(`/404/targetVizDeleted`);
      return;
    }
    const URL = jumpConfig?.URL || '';
    const queryName = jumpConfig?.queryName || '';
    const targetId = jumpConfig?.target?.relId;
    const jumpFieldName: string = jumpConfig?.field?.jumpFieldName || '';
    if (
      params.componentType === 'table' &&
      jumpFieldName !== params.seriesName
    ) {
      console.log('__ jumpFieldName !== params.seriesName');
      return;
    }
    const rowDataValue = getValueByRowData(params.data, jumpFieldName);
    if (typeof jumpConfig?.filter === 'object' && targetType === 'INTERNAL') {
      const searchParamsStr = urlSearchTransfer.toUrlString({
        [jumpConfig?.filter?.filterId]: rowDataValue,
      });
      if (targetId) {
        history.push(
          `/organizations/${orgId}/vizs/${targetId}?${searchParamsStr}`,
        );
      }
    } else if (targetType === 'URL') {
      let jumpUrl;
      if (URL.indexOf('?') > -1) {
        jumpUrl = `${URL}&${queryName}=${rowDataValue}`;
      } else {
        jumpUrl = `${URL}?${queryName}=${rowDataValue}`;
      }
      window.location.href = jumpUrl;
    }
  };

export const widgetClickLinkageAction =
  (
    boardId: string,
    editing: boolean,
    renderMode: VizRenderMode,
    widget: Widget,
    params: ChartMouseEventParams,
  ) =>
  (dispatch, getState) => {
    const { componentType, seriesType, seriesName } = params;
    const isTableHandle = componentType === 'table' && seriesType === 'body';

    const linkRelations = widget.relations.filter(re => {
      const {
        config: { type, widgetToWidget },
      } = re;
      if (type !== 'widgetToWidget') return false;
      if (isTableHandle) {
        if (widgetToWidget?.triggerColumn === seriesName) return true;
        return false;
      }
      return true;
    });

    const boardFilters = linkRelations.map(re => {
      let linkageFieldName: string =
        re?.config?.widgetToWidget?.triggerColumn || '';

      const filter: BoardLinkFilter = {
        triggerWidgetId: widget.id,
        triggerValue: getValueByRowData(params.data, linkageFieldName),
        triggerDataChartId: widget.datachartId,
        linkerWidgetId: re.targetId,
      };
      return filter;
    });

    if (editing) {
      dispatch(
        editDashBoardInfoActions.changeBoardLinkFilter({
          boardId: boardId,
          triggerId: widget.id,
          linkFilters: boardFilters,
        }),
      );
    } else {
      dispatch(
        boardActions.changeBoardLinkFilter({
          boardId: boardId,
          triggerId: widget.id,
          linkFilters: boardFilters,
        }),
      );
    }
    dispatch(toggleLinkageAction(editing, boardId, widget.id, true));
    setTimeout(() => {
      boardFilters.forEach(f => {
        if (editing) {
          dispatch(
            getEditChartWidgetDataAsync({
              widgetId: f.linkerWidgetId,
              option: {
                pageInfo: { pageNo: 1 },
              },
            }),
          );
        } else {
          dispatch(
            getChartWidgetDataAsync({
              boardId,
              widgetId: f.linkerWidgetId,
              renderMode,
              option: {
                pageInfo: { pageNo: 1 },
              },
            }),
          );
        }
      });
    }, 60);
  };
//
export const widgetChartClickAction =
  (
    boardId: string,
    editing: boolean,
    renderMode: VizRenderMode,
    widget: Widget,
    params: ChartMouseEventParams,
  ) =>
  dispatch => {
    //is tableChart
    if (
      params.componentType === 'table' &&
      params.seriesType === 'paging-sort-filter'
    ) {
      dispatch(
        tableChartClickAction(boardId, editing, renderMode, widget, params),
      );
      return;
    }
    // jump
    const jumpConfig = widget.config?.jumpConfig;
    if (jumpConfig && jumpConfig.open) {
      dispatch(
        widgetClickJumpAction(boardId, editing, renderMode, widget, params),
      );
      return;
    }
    // linkage
    const linkageConfig = widget.config.linkageConfig;
    if (linkageConfig?.open && widget.relations.length) {
      dispatch(
        widgetClickLinkageAction(boardId, editing, renderMode, widget, params),
      );
      return;
    }
  };
export const widgetGetDataAction =
  (editing: boolean, widget: Widget, renderMode: VizRenderMode) => dispatch => {
    const boardId = widget.dashboardId;
    if (editing) {
      dispatch(getEditWidgetData({ widget }));
    } else {
      dispatch(getWidgetData({ boardId, widget, renderMode }));
    }
  };

export const widgetToClearLinkageAction =
  (editing: boolean, widget: Widget, renderMode: VizRenderMode) => dispatch => {
    if (editing) {
      dispatch(editorWidgetClearLinkageAction(widget));
    } else {
      dispatch(widgetClearLinkageAction(widget, renderMode));
    }
  };
