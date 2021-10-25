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

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { ChartMouseEventParams } from 'app/pages/ChartWorkbenchPage/models/Chart';
import { PageInfo } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { urlSearchTransfer } from 'app/pages/MainPage/pages/VizPage/utils';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import React, { FC, useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { BoardContext } from '../contexts/BoardContext';
import { WidgetContext } from '../contexts/WidgetContext';
import {
  WidgetMethodContext,
  WidgetMethodContextProps,
} from '../contexts/WidgetMethodContext';
import {
  editBoardStackActions,
  editDashBoardInfoActions,
  editWidgetInfoActions,
} from '../pages/BoardEditor/slice';
import { editChartInWidgetAction } from '../pages/BoardEditor/slice/actions';
import {
  getEditChartWidgetDataAsync,
  getEditWidgetDataAsync,
} from '../pages/BoardEditor/slice/thunk';
import { boardActions } from '../slice';
import { getChartWidgetDataAsync, getWidgetDataAsync } from '../slice/thunk';
import {
  BoardLinkFilter,
  JumpConfig,
  Widget,
  WidgetContentChartType,
  WidgetType,
} from '../slice/types';
import { widgetActionType } from './WidgetToolBar/config';

const { confirm } = Modal;
export const WidgetMethodProvider: FC<{ widgetId: string }> = ({
  widgetId,
  children,
}) => {
  const { boardId, editing, renderMode } = useContext(BoardContext);
  const widget = useContext(WidgetContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const orgId = useSelector(selectOrgId);

  // deleteWidget
  const onWidgetDelete = useCallback(
    (type: WidgetType, wid: string) => {
      if (type === 'container') {
        confirm({
          // TODO i18n
          title: '确认删除',
          icon: <ExclamationCircleOutlined />,
          content: '该组件内的组件也会被删除,确认是否删除？',
          onOk() {
            dispatch(editBoardStackActions.deleteWidgets([wid]));
          },
          onCancel() {},
        });
        return;
      }
      dispatch(editBoardStackActions.deleteWidgets([wid]));
    },
    [dispatch],
  );
  const onWidgetEdit = useCallback(
    (type: WidgetType, wid: string) => {
      switch (type) {
        case 'chart':
          const chartType = widget.config.content.type;
          dispatch(
            editChartInWidgetAction({
              orgId,
              widgetId: wid,
              chartName: widget.config.name,
              dataChartId: widget.datachartId,
              chartType: chartType as WidgetContentChartType,
            }),
          );
          break;
        case 'filter':
          dispatch(
            editDashBoardInfoActions.changeFilterPanel({
              type: 'edit',
              widgetId: wid,
            }),
          );
          break;
        case 'container':
          dispatch(
            editWidgetInfoActions.openWidgetEditing({
              id: wid,
            }),
          );
          dispatch(editDashBoardInfoActions.changeShowBlockMask(false));
          break;
        case 'media':
          dispatch(
            editWidgetInfoActions.openWidgetEditing({
              id: wid,
            }),
          );
          break;
        default:
          break;
      }
    },

    [
      dispatch,
      orgId,
      widget.config.content.type,
      widget.config.name,
      widget.datachartId,
    ],
  );
  const onWidgetFullScreen = useCallback(
    (editing: boolean, recordId: string, itemId: string) => {
      if (editing) {
      } else {
        dispatch(
          boardActions.updateFullScreenPanel({
            recordId,
            itemId,
          }),
        );
      }
    },
    [dispatch],
  );
  const onWidgetGetData = useCallback(
    (boardId: string, widgetId: string) => {
      if (editing) {
        dispatch(getEditWidgetDataAsync({ widgetId }));
      } else {
        dispatch(getWidgetDataAsync({ boardId, widgetId, renderMode }));
      }
    },
    [dispatch, editing, renderMode],
  );
  const onMakeLinkage = useCallback(
    (widgetId: string) => {
      dispatch(
        editDashBoardInfoActions.changeLinkagePanel({
          type: 'add',
          widgetId,
        }),
      );
    },
    [dispatch],
  );
  const onMakeJump = useCallback(
    (widgetId: string) => {
      dispatch(
        editDashBoardInfoActions.changeJumpPanel({ visible: true, widgetId }),
      );
    },
    [dispatch],
  );
  const onToggleLinkage = useCallback(
    (toggle: boolean) => {
      if (editing) {
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
    },
    [boardId, dispatch, editing, widgetId],
  );
  const onChangeBoardFilter = useCallback(
    (filters?: BoardLinkFilter[]) => {
      if (editing) {
        dispatch(
          editDashBoardInfoActions.changeBoardLinkFilter({
            boardId: boardId,
            triggerId: widgetId,
            linkFilters: filters,
          }),
        );
      } else {
        dispatch(
          boardActions.changeBoardLinkFilter({
            boardId: boardId,
            triggerId: widgetId,
            linkFilters: filters,
          }),
        );
      }
    },

    [editing, dispatch, boardId, widgetId],
  );

  const onClearLinkage = useCallback(
    (widget: Widget) => {
      onToggleLinkage(false);
      onChangeBoardFilter();

      const linkRelations = widget.relations.filter(
        re => re.config.type === 'widgetToWidget',
      );
      setTimeout(() => {
        linkRelations.forEach(link => {
          onWidgetGetData(boardId, link.targetId);
        });
      }, 60);
    },
    [onToggleLinkage, onChangeBoardFilter, onWidgetGetData, boardId],
  );

  const toLinkingWidgets = useCallback(
    (widget: Widget, params: ChartMouseEventParams) => {
      const linkRelations = widget.relations.filter(
        re => re.config.type === 'widgetToWidget',
      );
      const boardFilters = linkRelations.map(re => {
        const filter: BoardLinkFilter = {
          triggerWidgetId: widget.id,
          triggerValue: params.name as string,
          triggerDataChartId: widget.datachartId,
          linkerWidgetId: re.targetId,
        };
        return filter;
      });

      if (editing) {
        dispatch(
          editDashBoardInfoActions.changeBoardLinkFilter({
            boardId: boardId,
            triggerId: widgetId,
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

      onToggleLinkage(true);
      setTimeout(() => {
        boardFilters.forEach(f => {
          onWidgetGetData(boardId, f.linkerWidgetId);
        });
      }, 60);
    },
    [boardId, dispatch, editing, onToggleLinkage, onWidgetGetData, widgetId],
  );
  const clickJump = useCallback(
    (values: { jumpConfig: JumpConfig; params: ChartMouseEventParams }) => {
      const { jumpConfig, params } = values;
      const targetId = jumpConfig?.target?.relId;

      if (typeof jumpConfig?.filter === 'object') {
        const searchParamsStr = urlSearchTransfer.toUrlString({
          [jumpConfig?.filter?.filterId]: params?.name,
        });
        if (targetId) {
          history.push(
            `/organizations/${orgId}/vizs/${targetId}?${searchParamsStr}`,
          );
        }
      }
    },
    [history, orgId],
  );
  const getTableChartData = useCallback(
    (options: { widget: Widget; params: any }) => {
      const { params } = options;
      const pageInfo: Partial<PageInfo> = {
        pageNo: params.value.page,
      };
      if (editing) {
        dispatch(
          getEditChartWidgetDataAsync({
            widgetId,
            option: {
              pageInfo,
            },
          }),
        );
      } else {
        dispatch(
          getChartWidgetDataAsync({
            boardId,
            widgetId,
            renderMode,
            option: {
              pageInfo,
            },
          }),
        );
      }
    },
    [boardId, dispatch, editing, renderMode, widgetId],
  );
  const onWidgetAction = useCallback(
    (action: widgetActionType, widgetType: WidgetType) => {
      switch (action) {
        case 'fullScreen':
          onWidgetFullScreen(editing, boardId, widgetId);
          break;
        case 'info':
          break;
        case 'refresh':
          onWidgetGetData(boardId, widgetId);
          break;
        case 'delete':
          onWidgetDelete(widgetType, widgetId);
          break;
        case 'edit':
          onWidgetEdit(widgetType, widgetId);
          break;
        case 'makeLinkage':
          onMakeLinkage(widgetId);
          break;
        case 'makeJump':
          onMakeJump(widgetId);
          break;

        default:
          break;
      }
    },
    [
      onWidgetFullScreen,
      editing,
      boardId,
      widgetId,
      onWidgetGetData,
      onWidgetDelete,
      onWidgetEdit,
      onMakeLinkage,
      onMakeJump,
    ],
  );

  const widgetChartClick = useCallback(
    (widget: Widget, params: ChartMouseEventParams) => {
      // table 分页
      if (params?.seriesType === 'table' && params?.seriesName === 'paging') {
        // table 分页逻辑
        getTableChartData({ widget, params });
        return;
      }
      // jump
      const jumpConfig = widget.config?.jumpConfig;
      if (jumpConfig && jumpConfig.open) {
        clickJump({ jumpConfig, params });
        return;
      }
      // linkage
      const linkageConfig = widget.config.linkageConfig;
      if (linkageConfig?.open) {
        toLinkingWidgets(widget, params);
        return;
      }
    },
    [clickJump, getTableChartData, toLinkingWidgets],
  );
  const Methods: WidgetMethodContextProps = {
    onWidgetAction: onWidgetAction,
    widgetChartClick: widgetChartClick,
    onClearLinkage: onClearLinkage,
  };

  return (
    <WidgetMethodContext.Provider value={Methods}>
      {children}
    </WidgetMethodContext.Provider>
  );
};
