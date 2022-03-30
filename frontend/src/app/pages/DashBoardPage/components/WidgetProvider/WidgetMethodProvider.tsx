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
import { selectVizs } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import { urlSearchTransfer } from 'app/pages/MainPage/pages/VizPage/utils';
import { ChartMouseEventParams, ChartsEventData } from 'app/types/Chart';
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { boardActions } from '../../pages/Board/slice';
import {
  getChartWidgetDataAsync,
  getWidgetData,
} from '../../pages/Board/slice/thunk';
import {
  BoardLinkFilter,
  VizRenderMode,
  Widget,
  WidgetContentChartType,
} from '../../pages/Board/slice/types';
import { jumpTypes } from '../../pages/BoardEditor/components/SettingJumpModal/config';
import {
  editDashBoardInfoActions,
  editWidgetInfoActions,
} from '../../pages/BoardEditor/slice';
import {
  closeJumpAction,
  closeLinkageAction,
  editChartInWidgetAction,
  editorWidgetClearLinkageAction,
  toggleLockWidgetAction,
  widgetClearLinkageAction,
} from '../../pages/BoardEditor/slice/actions/actions';
import {
  getEditChartWidgetDataAsync,
  getEditWidgetData,
} from '../../pages/BoardEditor/slice/thunk';
import { BoardContext } from '../BoardProvider/BoardProvider';

export const WidgetMethodProvider: FC<{ widgetId: string }> = ({
  widgetId,
  children,
}) => {
  const { boardId, editing, renderMode, orgId } = useContext(BoardContext);
  const vizs = useSelector(selectVizs);
  const propsFolderIds = useMemo(() => {
    return vizs.map(v => v.relId);
  }, [vizs]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [folderIds, setFolderIds] = useState<any[]>([]);

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

  const getValueByRowData = (
    data: ChartsEventData | undefined,
    fieldName: string,
  ) => {
    let toCaseField = fieldName;
    return data?.rowData[toCaseField];
  };
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
      ) {
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
                aggOperator: (params?.value as any)?.aggOperator,
              },
            ],
          },
        });
        return;
      }
      // jump
      const jumpConfig = widget.config?.jumpConfig;
      if (jumpConfig && jumpConfig.open) {
        if (
          jumpConfig.targetType === 'INTERNAL' &&
          !folderIds.includes(jumpConfig.target.relId)
        ) {
          return;
        }
        clickJump({ widget, params });
        return;
      }
      // linkage
      const linkageConfig = widget.config.linkageConfig;
      if (linkageConfig?.open && widget.relations.length) {
        toLinkingWidgets(widget, params);
        return;
      }
    },
    [clickJump, getTableChartData, toLinkingWidgets, folderIds],
  );
  // --------------------------------------------------

  const onWidgetClearLinkage = useCallback(
    (widget: Widget, renderMode: VizRenderMode) => {
      dispatch(widgetClearLinkageAction(widget, renderMode));
    },
    [dispatch],
  );
  const onEditWidgetClearLinkage = useCallback(
    (widget: Widget) => {
      dispatch(editorWidgetClearLinkageAction(widget));
    },
    [dispatch],
  );
  const onEditChartWidget = useCallback(
    (widget: Widget, orgId: string) => {
      const chartType = widget.config.content.type;
      dispatch(
        editChartInWidgetAction({
          orgId,
          widgetId: widget.id,
          chartName: widget.config.name,
          dataChartId: widget.datachartId,
          chartType: chartType as WidgetContentChartType,
        }),
      );
    },
    [dispatch],
  );
  const onEditControllerWidget = useCallback(
    (widget: Widget) => {
      dispatch(
        editDashBoardInfoActions.changeControllerPanel({
          type: 'edit',
          widgetId: widget.id,
          controllerType: widget.config.content.type as ControllerFacadeTypes,
        }),
      );
    },
    [dispatch],
  );
  const onEditContainerWidget = useCallback(
    (id: string) => {
      dispatch(editWidgetInfoActions.openWidgetEditing({ id }));
      dispatch(editDashBoardInfoActions.changeShowBlockMask(false));
    },
    [dispatch],
  );
  const onEditMediaWidget = useCallback(
    (id: string) => {
      dispatch(editWidgetInfoActions.openWidgetEditing({ id }));
    },
    [dispatch],
  );

  const onWidgetFullScreen = useCallback(
    (boardId: string, itemId: string) => {
      dispatch(
        boardActions.updateFullScreenPanel({
          boardId,
          itemId,
        }),
      );
    },
    [dispatch],
  );
  const onEditWidgetGetData = useCallback(
    (widget: Widget) => {
      dispatch(getEditWidgetData({ widget }));
    },
    [dispatch],
  );
  const onWidgetGetData = useCallback(
    (widget: Widget) => {
      const boardId = widget.dashboardId;
      dispatch(getWidgetData({ boardId, widget, renderMode }));
    },
    [dispatch, renderMode],
  );
  const onEditWidgetLinkage = useCallback(
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
  const onEditWidgetJump = useCallback(
    (widgetId: string) => {
      dispatch(
        editDashBoardInfoActions.changeJumpPanel({ visible: true, widgetId }),
      );
    },
    [dispatch],
  );
  const onEditWidgetCloseLinkage = useCallback(
    (widget: Widget) => {
      dispatch(closeLinkageAction(widget));
    },
    [dispatch],
  );
  const onEditWidgetCloseJump = useCallback(
    (widget: Widget) => {
      dispatch(closeJumpAction(widget));
    },
    [dispatch],
  );
  const onEditWidgetToggleLock = useCallback(
    (widget: Widget, bool: boolean) => {
      dispatch(toggleLockWidgetAction(widget, bool));
    },
    [dispatch],
  );
  const Methods: WidgetMethodContextProps = {
    widgetChartClick,
    onWidgetClearLinkage,
    onWidgetFullScreen,
    onWidgetGetData,

    onEditChartWidget,
    onEditMediaWidget,
    onEditContainerWidget,
    onEditControllerWidget,
    onEditWidgetLinkage,
    onEditWidgetJump,
    onEditWidgetCloseLinkage,
    onEditWidgetGetData,
    onEditWidgetToggleLock,
    onEditWidgetCloseJump,
    onEditWidgetClearLinkage,
  };

  useEffect(() => {
    if (folderIds.length !== propsFolderIds?.length) {
      setFolderIds(propsFolderIds);
    }
  }, [propsFolderIds, folderIds.length]);
  return (
    <WidgetMethodContext.Provider value={Methods}>
      {children}
    </WidgetMethodContext.Provider>
  );
};
export interface WidgetMethodContextProps {
  // all
  // read
  widgetChartClick: (widget: Widget, params: ChartMouseEventParams) => void;
  onWidgetClearLinkage: (widget: Widget, renderMode: VizRenderMode) => void;
  onWidgetFullScreen: (boardId: string, itemId: string) => void;
  onWidgetGetData: (widget: Widget) => void;
  // editor
  onEditChartWidget: (widget: Widget, orgId: string) => void;
  onEditWidgetClearLinkage: (widget: Widget) => void;
  onEditContainerWidget: (wid: string) => void;
  onEditMediaWidget: (wid: string) => void;
  onEditControllerWidget: (widget: Widget) => void;
  onEditWidgetLinkage: (wid: string) => void;
  onEditWidgetJump: (wid: string) => void;
  onEditWidgetCloseLinkage: (widget: Widget) => void;
  onEditWidgetCloseJump: (widget: Widget) => void;
  onEditWidgetToggleLock: (widget: Widget, bool: boolean) => void;
  onEditWidgetGetData: (widget: Widget) => void;
}
export const WidgetMethodContext = createContext<WidgetMethodContextProps>(
  {} as WidgetMethodContextProps,
);
