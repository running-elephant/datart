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
import usePrefixI18N from 'app/hooks/useI18NPrefix';
import { urlSearchTransfer } from 'app/pages/MainPage/pages/VizPage/utils';
import { ChartMouseEventParams } from 'app/types/Chart';
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import React, { FC, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { BoardContext } from '../../contexts/BoardContext';
import {
  WidgetMethodContext,
  WidgetMethodContextProps,
} from '../../contexts/WidgetMethodContext';
import { boardActions } from '../../pages/Board/slice';
import {
  getChartWidgetDataAsync,
  getWidgetData,
} from '../../pages/Board/slice/thunk';
import {
  BoardLinkFilter,
  Widget,
  WidgetContentChartType,
  WidgetType,
} from '../../pages/Board/slice/types';
import { jumpTypes } from '../../pages/BoardEditor/components/SettingJumpModal/config';
import {
  editBoardStackActions,
  editDashBoardInfoActions,
  editWidgetInfoActions,
} from '../../pages/BoardEditor/slice';
import {
  closeJumpAction,
  closeLinkageAction,
  editChartInWidgetAction,
} from '../../pages/BoardEditor/slice/actions/actions';
import { editWidgetsQueryAction } from '../../pages/BoardEditor/slice/actions/controlActions';
import {
  getEditChartWidgetDataAsync,
  getEditWidgetData,
} from '../../pages/BoardEditor/slice/thunk';
import { widgetActionType } from '../WidgetToolBar/config';

const { confirm } = Modal;
export const WidgetMethodProvider: FC<{ widgetId: string }> = ({
  widgetId,
  children,
}) => {
  const t = usePrefixI18N('viz.widget.action');
  const { boardId, editing, renderMode, orgId } = useContext(BoardContext);

  const dispatch = useDispatch();
  const history = useHistory();

  // deleteWidget
  const onWidgetDelete = useCallback(
    (type: WidgetType, wid: string) => {
      if (type === 'container') {
        confirm({
          title: t('confirmDel'),
          icon: <ExclamationCircleOutlined />,
          content: t('ContainerConfirmDel'),
          onOk() {
            dispatch(editBoardStackActions.deleteWidgets([wid]));
          },
          onCancel() {},
        });
        return;
      }
      if (type === 'query') {
        dispatch(editBoardStackActions.changeBoardHasQueryControl(false));
      }
      if (type === 'reset') {
        dispatch(editBoardStackActions.changeBoardHasResetControl(false));
      }
      if (type === 'controller') {
        dispatch(editWidgetsQueryAction({ boardId }));
      }
      dispatch(editBoardStackActions.deleteWidgets([wid]));
    },
    [dispatch, t, boardId],
  );
  const onWidgetEdit = useCallback(
    (widget: Widget, wid: string) => {
      const type = widget.config.type;
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
        case 'controller':
          dispatch(
            editDashBoardInfoActions.changeControllerPanel({
              type: 'edit',
              widgetId: wid,
              controllerType: widget.config.content
                .type as ControllerFacadeTypes,
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

    [dispatch, orgId],
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
    (boardId: string, widget: Widget) => {
      if (editing) {
        dispatch(getEditWidgetData({ widget }));
      } else {
        dispatch(getWidgetData({ boardId, widget, renderMode }));
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
          if (editing) {
            dispatch(
              getEditChartWidgetDataAsync({
                widgetId: link.targetId,
                option: {
                  pageInfo: { pageNo: 1 },
                },
              }),
            );
          } else {
            dispatch(
              getChartWidgetDataAsync({
                boardId,
                widgetId: link.targetId,
                renderMode,
                option: {
                  pageInfo: { pageNo: 1 },
                },
              }),
            );
          }
        });
      }, 60);
    },
    [
      onToggleLinkage,
      onChangeBoardFilter,
      editing,
      dispatch,
      boardId,
      renderMode,
    ],
  );

  const toLinkingWidgets = useCallback(
    (widget: Widget, params: ChartMouseEventParams) => {
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
          triggerValue:
            (params?.data?.rowData?.[linkageFieldName] as string) || '',
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
    },
    [boardId, dispatch, editing, onToggleLinkage, renderMode, widgetId],
  );
  const clickJump = useCallback(
    (values: { widget: Widget; params: ChartMouseEventParams }) => {
      const { widget, params } = values;
      const jumpConfig = widget.config?.jumpConfig;
      const targetType = jumpConfig?.targetType || jumpTypes[0].value;
      const URL = jumpConfig?.URL || '';
      const queryName = jumpConfig?.queryName || '';
      const targetId = jumpConfig?.target?.relId;
      const jumpFieldName: string = jumpConfig?.field?.jumpFieldName || '';
      if (
        params.componentType === 'table' &&
        jumpFieldName !== params.seriesName
      )
        return;

      if (typeof jumpConfig?.filter === 'object' && targetType === 'INTERNAL') {
        const searchParamsStr = urlSearchTransfer.toUrlString({
          [jumpConfig?.filter?.filterId]:
            (params?.data?.rowData?.[jumpFieldName] as string) || '',
        });
        if (targetId) {
          history.push(
            `/organizations/${orgId}/vizs/${targetId}?${searchParamsStr}`,
          );
        }
      } else if (targetType === 'URL') {
        let jumpUrl;
        if (URL.indexOf('?') > -1) {
          jumpUrl = `${URL}&${queryName}=${params?.data?.rowData?.[jumpFieldName]}`;
        } else {
          jumpUrl = `${URL}?${queryName}=${params?.data?.rowData?.[jumpFieldName]}`;
        }
        window.location.href = jumpUrl;
      }
    },
    [history, orgId],
  );
  const getTableChartData = useCallback(
    (options: { widget: Widget; params: any; sorters?: any[] }) => {
      const { params } = options;
      if (editing) {
        dispatch(
          getEditChartWidgetDataAsync({
            widgetId,
            option: {
              pageInfo: params?.pageInfo,
              sorters: params?.sorters,
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
              pageInfo: params?.pageInfo,
              sorters: params?.sorters,
            },
          }),
        );
      }
    },
    [boardId, dispatch, editing, renderMode, widgetId],
  );
  const onWidgetAction = useCallback(
    (action: widgetActionType, widget: Widget) => {
      switch (action) {
        case 'fullScreen':
          onWidgetFullScreen(editing, boardId, widgetId);
          break;
        case 'info':
          break;
        case 'refresh':
          onWidgetGetData(boardId, widget);
          break;
        case 'delete':
          onWidgetDelete(widget.config.type, widgetId);
          break;
        case 'edit':
          onWidgetEdit(widget, widgetId);
          break;
        case 'makeLinkage':
          onMakeLinkage(widgetId);
          break;
        case 'makeJump':
          onMakeJump(widgetId);
          break;
        case 'closeJump':
          dispatch(closeJumpAction(widget));
          break;
        case 'closeLinkage':
          dispatch(closeLinkageAction(widget));
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
      dispatch,
    ],
  );

  const widgetChartClick = useCallback(
    (widget: Widget, params: ChartMouseEventParams) => {
      if (
        params.componentType === 'table' &&
        params.seriesType === 'paging-sort-filter'
      ) {
        getTableChartData({
          widget,
          params: {
            pageInfo: { pageNo: params?.value?.pageNo },
            sorters: [
              {
                column: params?.seriesName!,
                operator: (params?.value as any)?.direction,
              },
            ],
          },
        });
        return;
      }
      // jump
      const jumpConfig = widget.config?.jumpConfig;
      if (jumpConfig && jumpConfig.open) {
        clickJump({ widget, params });
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
