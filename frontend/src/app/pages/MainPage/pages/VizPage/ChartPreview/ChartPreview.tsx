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

import { message, Spin } from 'antd';
import useModal from 'antd/lib/modal/useModal';
import ChartDrillContextMenu from 'app/components/ChartDrill/ChartDrillContextMenu';
import ChartDrillPaths from 'app/components/ChartDrill/ChartDrillPaths';
import { ChartIFrameContainer } from 'app/components/ChartIFrameContainer';
import {
  InteractionAction,
  InteractionCategory,
  InteractionMouseEvent,
} from 'app/components/FormGenerator/constants';
import {
  DrillThroughSetting,
  ViewDetailSetting,
} from 'app/components/FormGenerator/Customize/Interaction/types';
import { VizHeader } from 'app/components/VizHeader';
import { ChartDataViewFieldCategory } from 'app/constants';
import { useCacheWidthHeight } from 'app/hooks/useCacheWidthHeight';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataRequestBuilder } from 'app/models/ChartDataRequestBuilder';
import ChartManager from 'app/models/ChartManager';
import ChartDrillContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDrillContext';
import { useWorkbenchSlice } from 'app/pages/ChartWorkbenchPage/slice';
import { selectAvailableSourceFunctions } from 'app/pages/ChartWorkbenchPage/slice/selectors';
import { fetchAvailableSourceFunctionsForChart } from 'app/pages/ChartWorkbenchPage/slice/thunks';
import { useMainSlice } from 'app/pages/MainPage/slice';
import { IChart } from 'app/types/Chart';
import { ChartDataRequestFilter } from 'app/types/ChartDataRequest';
import { IChartDrillOption } from 'app/types/ChartDrillOption';
import {
  getRuntimeComputedFields,
  getRuntimeDateLevelFields,
  getStyles,
  getValue,
} from 'app/utils/chartHelper';
import { generateShareLinkAsync, makeDownloadDataTask } from 'app/utils/fetch';
import {
  buildClickEventBaseFilters,
  getChartDrillOption,
  getJumpFiltersByInteractionRule,
  getJumpOperationFiltersByInteractionRule,
} from 'app/utils/internalChartHelper';
import { KEYBOARD_EVENT_NAME } from 'globalConstants';
import qs from 'qs';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG } from 'styles/StyleConstants';
import { isEmpty } from 'utils/object';
import useDisplayViewDetail from '../hooks/useDisplayViewDetail';
import useDrillThrough from '../hooks/useDrillThrough';
import useQSLibUrlHelper from '../hooks/useQSLibUrlHelper';
import { useSaveAsViz } from '../hooks/useSaveAsViz';
import { useVizSlice } from '../slice';
import {
  selectMultipleSelect,
  selectPreviewCharts,
  selectPublishLoading,
  selectSelectedItems,
  selectVizs,
} from '../slice/selectors';
import {
  deleteViz,
  fetchDataSetByPreviewChartAction,
  initChartPreviewData,
  publishViz,
  removeTab,
  updateFilterAndFetchDataset,
  updateGroupAndFetchDataset,
} from '../slice/thunks';
import { ChartPreview } from '../slice/types';
import { urlSearchTransfer } from '../utils';
import ControllerPanel from './components/ControllerPanel';

const ChartPreviewBoard: FC<{
  backendChartId: string;
  orgId: string;
  filterSearchUrl?: string;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowManage?: boolean;
}> = memo(
  ({
    backendChartId,
    orgId,
    filterSearchUrl,
    allowDownload,
    allowShare,
    allowManage,
  }) => {
    // NOTE: avoid initialize width or height is zero that cause echart sampling calculation issue.
    const defaultChartContainerWH = 1;
    const {
      cacheWhRef: ref,
      cacheW,
      cacheH,
    } = useCacheWidthHeight({
      initH: defaultChartContainerWH,
      initW: defaultChartContainerWH,
    });
    useWorkbenchSlice();
    const { actions: vizAction } = useVizSlice();
    const { actions } = useMainSlice();
    const chartManager = ChartManager.instance();
    const dispatch = useDispatch();
    const [version, setVersion] = useState<string>();
    const previewCharts = useSelector(selectPreviewCharts);
    const publishLoading = useSelector(selectPublishLoading);
    const selectedItems = useSelector(selectSelectedItems);
    const multipleSelect = useSelector(selectMultipleSelect);
    const availableSourceFunctions = useSelector(
      selectAvailableSourceFunctions,
    );
    const [chartPreview, setChartPreview] = useState<ChartPreview>();
    const [chart, setChart] = useState<IChart>();
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const [chartContextMenuEvent, setChartContextMenuEvent] = useState<{
      data?: any;
    }>();
    const drillOptionRef = useRef<IChartDrillOption>();
    const t = useI18NPrefix('viz.main');
    const tg = useI18NPrefix('global');
    const saveAsViz = useSaveAsViz();
    const history = useHistory();
    const vizs = useSelector(selectVizs);
    const [
      openNewTab,
      openBrowserTab,
      getDialogContent,
      redirectByUrl,
      openNewByUrl,
      getDialogContentByUrl,
    ] = useDrillThrough();
    const [openViewDetailPanel, viewDetailPanelContextHolder] =
      useDisplayViewDetail();
    const { parse } = useQSLibUrlHelper();
    const [modal, jumpDialogContextHolder] = useModal();

    const chartIframeKeyboardListener = useCallback(
      (e: KeyboardEvent) => {
        if (
          (e.key === KEYBOARD_EVENT_NAME.CTRL ||
            e.key === KEYBOARD_EVENT_NAME.COMMAND) &&
          e.type === 'keydown' &&
          !multipleSelect
        ) {
          dispatch(vizAction.updateMultipleSelect(true));
        } else if (
          (e.key === KEYBOARD_EVENT_NAME.CTRL ||
            e.key === KEYBOARD_EVENT_NAME.COMMAND) &&
          e.type === 'keyup' &&
          multipleSelect
        ) {
          dispatch(vizAction.updateMultipleSelect(false));
        }
      },
      [dispatch, multipleSelect, vizAction],
    );

    useEffect(() => {
      const jumpFilterParams: ChartDataRequestFilter[] =
        parse(filterSearchUrl)?.filters || [];
      const filterSearchParams = filterSearchUrl
        ? urlSearchTransfer.toParams(filterSearchUrl)
        : undefined;
      dispatch(
        initChartPreviewData({
          backendChartId,
          orgId,
          filterSearchParams,
          jumpFilterParams,
        }),
      );
    }, [dispatch, orgId, backendChartId, filterSearchUrl, parse]);

    useEffect(() => {
      const sourceId = chartPreview?.backendChart?.view.sourceId;
      if (sourceId) {
        dispatch(fetchAvailableSourceFunctionsForChart(sourceId));
      }
    }, [chartPreview?.backendChart?.view.sourceId, dispatch]);

    useEffect(() => {
      const newChartPreview = previewCharts.find(
        c => c.backendChartId === backendChartId,
      );
      if (newChartPreview && newChartPreview.version !== version) {
        setVersion(newChartPreview.version);
        setChartPreview(newChartPreview);

        drillOptionRef.current = getChartDrillOption(
          newChartPreview?.chartConfig?.datas,
          drillOptionRef?.current,
        );

        if (
          !chart ||
          chart?.meta?.id !==
            newChartPreview?.backendChart?.config?.chartGraphId
        ) {
          const newChart = chartManager.getById(
            newChartPreview?.backendChart?.config?.chartGraphId,
          );
          setChart(newChart);
        }
      }
    }, [
      backendChartId,
      chart,
      chartManager,
      chartPreview?.backendChart?.id,
      previewCharts,
      version,
    ]);

    const handleDrillOptionChange = useCallback(
      (option: IChartDrillOption) => {
        drillOptionRef.current = option;
        dispatch(
          updateFilterAndFetchDataset({
            backendChartId,
            chartPreview,
            payload: null,
            drillOption: drillOptionRef?.current,
          }),
        );
      },
      [backendChartId, chartPreview, dispatch],
    );

    const enableRightClickDrillThrough = () => {
      const enableDrillThrough = getValue(
        chartPreview?.chartConfig?.interactions || [],
        ['drillThrough'],
      );
      const drillThroughSetting = getStyles(
        chartPreview?.chartConfig?.interactions || [],
        ['drillThrough'],
        ['setting'],
      )?.[0] as DrillThroughSetting;
      const hasRightClickEvent = drillThroughSetting?.rules?.some(
        r => r.event === InteractionMouseEvent.Right,
      );
      return enableDrillThrough && hasRightClickEvent;
    };

    const enableRightClickViewData = () => {
      const enableViewDetail = getValue(
        chartPreview?.chartConfig?.interactions || [],
        ['viewDetail'],
      );
      const viewDetailSetting = getStyles(
        chartPreview?.chartConfig?.interactions || [],
        ['viewDetail'],
        ['setting'],
      )?.[0] as ViewDetailSetting;
      return (
        enableViewDetail &&
        viewDetailSetting?.event === InteractionMouseEvent.Right
      );
    };

    const handleDrillThroughEvent = useCallback(
      (param, targetEvent, ruleId?: string) => {
        const enableDrillThrough = getValue(
          chartPreview?.chartConfig?.interactions || [],
          ['drillThrough'],
        );
        const drillThroughSetting = getStyles(
          chartPreview?.chartConfig?.interactions || [],
          ['drillThrough'],
          ['setting'],
        )?.[0] as DrillThroughSetting;

        if (enableDrillThrough) {
          let nonAggChartFilters = new ChartDataRequestBuilder(
            {
              id: chartPreview?.backendChart?.view?.id || '',
              config: chartPreview?.backendChart?.view.config || {},
              computedFields:
                chartPreview?.backendChart?.config.computedFields || [],
            },
            chartPreview?.chartConfig?.datas,
            chartPreview?.chartConfig?.settings,
            {},
            false,
            chartPreview?.backendChart?.config?.aggregation,
          )
            .addDrillOption(drillOptionRef?.current)
            .build()
            ?.filters?.filter(f => !Boolean(f.aggOperator));

          (drillThroughSetting?.rules || [])
            .filter(rule => rule.event === targetEvent)
            .filter(rule => isEmpty(ruleId) || rule.id === ruleId)
            .forEach(rule => {
              const clickFilters = buildClickEventBaseFilters(
                param?.data?.rowData,
                rule,
                drillOptionRef?.current,
                chartPreview?.chartConfig?.datas,
              );

              const relId = rule?.[rule.category!]?.relId;
              if (rule.category === InteractionCategory.JumpToChart) {
                const urlFilters = getJumpOperationFiltersByInteractionRule(
                  clickFilters,
                  nonAggChartFilters,
                  rule,
                );
                const urlFiltersStr: string = qs.stringify({
                  filters: urlFilters || [],
                });
                if (rule?.action === InteractionAction.Redirect) {
                  openNewTab(orgId, relId, urlFiltersStr);
                }
                if (rule?.action === InteractionAction.Window) {
                  openBrowserTab(orgId, relId, urlFiltersStr);
                }
                if (rule?.action === InteractionAction.Dialog) {
                  const modalContent = getDialogContent(
                    orgId,
                    relId,
                    urlFiltersStr,
                  );
                  modal.info(modalContent as any);
                }
              } else if (
                rule.category === InteractionCategory.JumpToDashboard
              ) {
                const urlFilters = getJumpFiltersByInteractionRule(
                  clickFilters,
                  nonAggChartFilters,
                  rule,
                );
                Object.assign(urlFilters, { isMatchByName: true });
                const urlFiltersStr: string =
                  urlSearchTransfer.toUrlString(urlFilters);
                if (rule?.action === InteractionAction.Redirect) {
                  openNewTab(orgId, relId, urlFiltersStr);
                }
                if (rule?.action === InteractionAction.Window) {
                  openBrowserTab(orgId, relId, urlFiltersStr);
                }
                if (rule?.action === InteractionAction.Dialog) {
                  const modalContent = getDialogContent(
                    orgId,
                    relId,
                    urlFiltersStr,
                  );
                  modal.info(modalContent as any);
                }
              } else if (rule.category === InteractionCategory.JumpToUrl) {
                const urlFilters = getJumpFiltersByInteractionRule(
                  clickFilters,
                  nonAggChartFilters,
                  rule,
                );
                Object.assign(urlFilters, { isMatchByName: true });
                const urlFiltersStr: string =
                  urlSearchTransfer.toUrlString(urlFilters);
                const url = rule?.[rule.category!]?.url;
                if (rule?.action === InteractionAction.Redirect) {
                  redirectByUrl(url, urlFiltersStr);
                }
                if (rule?.action === InteractionAction.Window) {
                  openNewByUrl(url, urlFiltersStr);
                }
                if (rule?.action === InteractionAction.Dialog) {
                  const modalContent = getDialogContentByUrl(
                    url,
                    urlFiltersStr,
                  );
                  modal.info(modalContent as any);
                }
              }
            });
        }
      },
      [
        chartPreview?.chartConfig?.interactions,
        chartPreview?.chartConfig?.datas,
        chartPreview?.chartConfig?.settings,
        chartPreview?.backendChart?.view?.id,
        chartPreview?.backendChart?.view.config,
        chartPreview?.backendChart?.config.computedFields,
        chartPreview?.backendChart?.config?.aggregation,
        openNewTab,
        orgId,
        openBrowserTab,
        getDialogContent,
        modal,
        redirectByUrl,
        openNewByUrl,
        getDialogContentByUrl,
      ],
    );

    const handleViewDataEvent = useCallback(
      (param, targetEvent) => {
        const enableViewDetail = getValue(
          chartPreview?.chartConfig?.interactions || [],
          ['viewDetail'],
        );
        const viewDetailSetting = getStyles(
          chartPreview?.chartConfig?.interactions || [],
          ['viewDetail'],
          ['setting'],
        )?.[0] as ViewDetailSetting;

        if (enableViewDetail && viewDetailSetting?.event === targetEvent) {
          const clickFilters = buildClickEventBaseFilters(
            param?.data?.rowData,
            undefined,
            drillOptionRef?.current,
            chartPreview?.chartConfig?.datas,
          );
          (openViewDetailPanel as any)({
            currentDataView: chartPreview?.backendChart?.view,
            chartConfig: chartPreview?.chartConfig,
            drillOption: drillOptionRef?.current,
            viewDetailSetting: viewDetailSetting,
            clickFilters: clickFilters,
          });
        }
      },
      [
        chartPreview?.chartConfig,
        chartPreview?.backendChart?.view,
        openViewDetailPanel,
      ],
    );

    const registerChartEvents = useCallback(
      (chart, backendChartId) => {
        chart?.registerMouseEvents([
          {
            name: 'click',
            callback: param => {
              handleDrillThroughEvent(param, InteractionMouseEvent.Left);
              handleViewDataEvent(param, InteractionMouseEvent.Left);
              if (
                drillOptionRef.current?.isSelectedDrill &&
                !drillOptionRef.current.isBottomLevel
              ) {
                const option = drillOptionRef.current;
                option.drillDown(param.data.rowData);
                drillOptionRef.current = option;
                handleDrillOptionChange(option);
                return;
              }
              if (
                param.chartType === 'table' &&
                param.interactionType === 'paging-sort-filter'
              ) {
                dispatch(
                  fetchDataSetByPreviewChartAction({
                    backendChartId,
                    sorter: {
                      column: param?.seriesName!,
                      operator: param?.value?.direction,
                      aggOperator: param?.value?.aggOperator,
                    },
                    pageInfo: {
                      pageNo: param?.value?.pageNo,
                    },
                  }),
                );
                return;
              }

              // NOTE 透视表树形结构展开下钻特殊处理方法
              if (
                param.chartType === 'pivotSheet' &&
                param.interactionType === 'drilled'
              ) {
                handleDrillOptionChange?.(param.drillOption);
                return;
              }

              // NOTE 表格和透视表直接修改selectedItems结果集特殊处理方法 其他图标取消选中时调取
              if (param.interactionType === 'selected') {
                dispatch(
                  vizAction.changeSelectedItems({
                    backendChartId,
                    data: param.selectedItems,
                  }),
                );
              }

              if (chart.selectable) {
                const {
                  dataIndex,
                  componentIndex,
                  data,
                }: {
                  dataIndex?: number;
                  componentIndex?: number;
                  data?: { rowData: { [p: string]: any } };
                } = param;
                if (data?.rowData) {
                  dispatch(
                    vizAction.normalSelect({
                      backendChartId,
                      data: {
                        index: componentIndex + ',' + dataIndex,
                        data,
                      },
                    }),
                  );
                }
              }
            },
          },
          {
            name: 'contextmenu',
            callback: param => {
              setChartContextMenuEvent(param);
            },
          },
        ]);
      },
      [
        dispatch,
        handleDrillOptionChange,
        handleDrillThroughEvent,
        handleViewDataEvent,
        vizAction,
      ],
    );

    useEffect(() => {
      registerChartEvents(chart, backendChartId);
    }, [backendChartId, chart, registerChartEvents]);

    const handleGotoWorkbenchPage = () => {
      history.push({
        pathname: `/organizations/${orgId}/vizs/chartEditor`,
        search: `dataChartId=${backendChartId}&chartType=dataChart&container=dataChart`,
      });
    };

    const handleFilterChange = (type, payload) => {
      dispatch(
        updateFilterAndFetchDataset({
          backendChartId,
          chartPreview,
          payload,
          drillOption: drillOptionRef?.current,
        }),
      );
    };

    const handleGenerateShareLink = async ({
      expiryDate,
      authenticationMode,
      roles,
      users,
      rowPermissionBy,
    }: {
      expiryDate: string;
      authenticationMode: string;
      roles: string[];
      users: string[];
      rowPermissionBy: string;
    }) => {
      const result = await generateShareLinkAsync({
        expiryDate,
        authenticationMode,
        roles,
        users,
        rowPermissionBy,
        vizId: backendChartId,
        vizType: 'DATACHART',
      });
      return result;
    };

    const handleCreateDownloadDataTask = async downloadType => {
      if (!chartPreview) {
        return;
      }

      const builder = new ChartDataRequestBuilder(
        {
          id: chartPreview?.backendChart?.view?.id || '',
          config: chartPreview?.backendChart?.view.config || {},
          computedFields:
            chartPreview?.backendChart?.config.computedFields || [],
        },
        chartPreview?.chartConfig?.datas,
        chartPreview?.chartConfig?.settings,
        {},
        false,
        chartPreview?.backendChart?.config?.aggregation,
      );
      const folderId = vizs.filter(
        v => v.relId === chartPreview?.backendChart?.id,
      )[0].id;

      dispatch(
        makeDownloadDataTask({
          downloadParams: [
            {
              ...builder.build(),
              ...{
                vizId:
                  downloadType === 'EXCEL'
                    ? chartPreview?.backendChart?.id
                    : folderId,
                vizName: chartPreview?.backendChart?.name,
                analytics: false,
                vizType: 'dataChart',
              },
            },
          ],
          imageWidth: cacheW,
          downloadType,
          fileName: chartPreview?.backendChart?.name || 'chart',
          resolve: () => {
            dispatch(actions.setDownloadPolling(true));
          },
        }),
      );
    };

    const handlePublish = useCallback(() => {
      if (chartPreview?.backendChart) {
        dispatch(
          publishViz({
            id: chartPreview.backendChart.id,
            vizType: 'DATACHART',
            publish: chartPreview.backendChart.status === 1 ? true : false,
            resolve: () => {
              message.success(
                chartPreview.backendChart?.status === 2
                  ? t('unpublishSuccess')
                  : t('publishSuccess'),
              );
            },
          }),
        );
      }
    }, [dispatch, chartPreview?.backendChart, t]);

    const handleSaveAsVizs = useCallback(() => {
      saveAsViz(chartPreview?.backendChartId as string, 'DATACHART');
    }, [saveAsViz, chartPreview?.backendChartId]);

    const handleReloadData = useCallback(async () => {
      setLoadingStatus(true);
      await dispatch(
        fetchDataSetByPreviewChartAction({
          backendChartId,
        }),
      );
      setLoadingStatus(false);
    }, [dispatch, backendChartId]);

    const handleAddToDashBoard = useCallback(
      (dashboardId, dashboardType) => {
        const currentChartPreview = previewCharts.find(
          c => c.backendChartId === backendChartId,
        );

        try {
          history.push({
            pathname: `/organizations/${orgId}/vizs/${dashboardId}/boardEditor`,
            state: {
              widgetInfo: JSON.stringify({
                chartType: '',
                dataChart: currentChartPreview?.backendChart,
                dataview: currentChartPreview?.backendChart?.view,
                dashboardType,
              }),
            },
          });
        } catch (error) {
          throw error;
        }
      },
      [previewCharts, history, backendChartId, orgId],
    );

    const redirect = useCallback(
      tabKey => {
        if (tabKey) {
          history.push(`/organizations/${orgId}/vizs/${tabKey}`);
        } else {
          history.push(`/organizations/${orgId}/vizs`);
        }
      },
      [history, orgId],
    );

    const handleRecycleViz = useCallback(() => {
      dispatch(
        deleteViz({
          params: { id: backendChartId, archive: true },
          type: 'DATACHART',
          resolve: () => {
            message.success(tg('operation.archiveSuccess'));
            dispatch(removeTab({ id: backendChartId, resolve: redirect }));
          },
        }),
      );
    }, [backendChartId, dispatch, redirect, tg]);

    const handleDateLevelChange = (type, payload) => {
      const rows = getRuntimeDateLevelFields(payload.value?.rows);
      const dateLevelComputedFields = rows.filter(
        v => v.category === ChartDataViewFieldCategory.DateLevelComputedField,
      );
      const replacedConfig = payload.value.replacedConfig;
      const computedFields = getRuntimeComputedFields(
        dateLevelComputedFields,
        replacedConfig,
        chartPreview?.backendChart?.config?.computedFields,
        true,
      );

      dispatch(
        vizAction.updateComputedFields({
          backendChartId,
          computedFields,
        }),
      );
      dispatch(
        updateGroupAndFetchDataset({
          backendChartId,
          payload: payload,
          drillOption: drillOptionRef?.current,
        }),
      );
    };

    return (
      <StyledChartPreviewBoard>
        <VizHeader
          chartName={chartPreview?.backendChart?.name}
          status={chartPreview?.backendChart?.status}
          publishLoading={publishLoading}
          onGotoEdit={handleGotoWorkbenchPage}
          onPublish={handlePublish}
          onGenerateShareLink={handleGenerateShareLink}
          onDownloadData={handleCreateDownloadDataTask}
          onSaveAsVizs={handleSaveAsVizs}
          onReloadData={handleReloadData}
          onAddToDashBoard={handleAddToDashBoard}
          onRecycleViz={handleRecycleViz}
          allowDownload={allowDownload}
          allowShare={allowShare}
          allowManage={allowManage}
          orgId={orgId}
          backendChartId={backendChartId}
        />
        <PreviewBlock>
          <ChartDrillContext.Provider
            value={{
              drillOption: drillOptionRef.current,
              onDrillOptionChange: handleDrillOptionChange,
              availableSourceFunctions,
              onDateLevelChange: handleDateLevelChange,
              onDrillThroughChange: enableRightClickDrillThrough()
                ? ruleId =>
                    handleDrillThroughEvent(
                      chartContextMenuEvent,
                      InteractionMouseEvent.Right,
                      ruleId,
                    )
                : undefined,
              onViewDataChange: enableRightClickViewData()
                ? () =>
                    handleViewDataEvent(
                      chartContextMenuEvent,
                      InteractionMouseEvent.Right,
                    )
                : undefined,
            }}
          >
            <div>
              <ControllerPanel
                viewId={chartPreview?.backendChart?.viewId}
                view={chartPreview?.backendChart?.view}
                chartConfig={chartPreview?.chartConfig}
                onChange={handleFilterChange}
              />
            </div>
            <ChartWrapper ref={ref}>
              <Spin wrapperClassName="spinWrapper" spinning={loadingStatus}>
                <ChartDrillContextMenu chartConfig={chartPreview?.chartConfig!}>
                  <ChartIFrameContainer
                    key={backendChartId}
                    containerId={backendChartId}
                    dataset={chartPreview?.dataset}
                    chart={chart!}
                    config={chartPreview?.chartConfig!}
                    drillOption={drillOptionRef.current}
                    selectedItems={selectedItems[backendChartId]}
                    onKeyboardPress={chartIframeKeyboardListener}
                    width={cacheW}
                    height={cacheH}
                  />
                </ChartDrillContextMenu>
              </Spin>
            </ChartWrapper>
            <StyledChartDrillPathsContainer>
              <ChartDrillPaths chartConfig={chartPreview?.chartConfig!} />
            </StyledChartDrillPathsContainer>
            <StyledChartDrillPathsContainer />
          </ChartDrillContext.Provider>
        </PreviewBlock>
        {viewDetailPanelContextHolder}
        {jumpDialogContextHolder}
      </StyledChartPreviewBoard>
    );
  },
);

export default ChartPreviewBoard;
const StyledChartPreviewBoard = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column;
  height: 100%;
  iframe {
    flex-grow: 1000;
  }
`;
const PreviewBlock = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  padding: ${SPACE_LG};
  overflow: hidden;
  box-shadow: ${p => p.theme.shadowBlock};
`;

const ChartWrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  background-color: ${p => p.theme.componentBackground};
  border-radius: ${BORDER_RADIUS};
  .chart-drill-menu-container {
    height: 100%;
  }
  .spinWrapper {
    width: 100%;
    height: 100%;
    .ant-spin-container {
      width: 100%;
      height: 100%;
    }
  }
`;

const StyledChartDrillPathsContainer = styled.div`
  background-color: ${p => p.theme.componentBackground};
`;
