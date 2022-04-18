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
import ChartDrillContextMenu from 'app/components/ChartDrill/ChartDrillContextMenu';
import ChartDrillPaths from 'app/components/ChartDrill/ChartDrillPaths';
import { ChartIFrameContainer } from 'app/components/ChartIFrameContainer';
import { VizHeader } from 'app/components/VizHeader';
import { useCacheWidthHeight } from 'app/hooks/useCacheWidthHeight';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataRequestBuilder } from 'app/models/ChartDataRequestBuilder';
import { ChartDrillOption } from 'app/models/ChartDrillOption';
import ChartManager from 'app/models/ChartManager';
import ChartDrillContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDrillContext';
import { useMainSlice } from 'app/pages/MainPage/slice';
import { IChart } from 'app/types/Chart';
import { IChartDrillOption } from 'app/types/ChartDrillOption';
import { getDrillPaths } from 'app/utils/chartHelper';
import { generateShareLinkAsync, makeDownloadDataTask } from 'app/utils/fetch';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG } from 'styles/StyleConstants';
import { isEmptyArray } from 'utils/object';
import { useSaveAsViz } from '../hooks/useSaveAsViz';
import { useVizSlice } from '../slice';
import {
  selectPreviewCharts,
  selectPublishLoading,
  selectVizs,
} from '../slice/selectors';
import {
  deleteViz,
  fetchDataSetByPreviewChartAction,
  initChartPreviewData,
  publishViz,
  removeTab,
  updateFilterAndFetchDataset,
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
    useVizSlice();
    // NOTE: avoid initialize width or height is zero that cause echart sampling calculation issue.
    const defaultChartContainerWH = 1;
    const {
      cacheWhRef: ref,
      cacheW,
      cacheH,
    } = useCacheWidthHeight(defaultChartContainerWH, defaultChartContainerWH);
    const { actions } = useMainSlice();
    const chartManager = ChartManager.instance();
    const dispatch = useDispatch();
    const [version, setVersion] = useState<string>();
    const previewCharts = useSelector(selectPreviewCharts);
    const publishLoading = useSelector(selectPublishLoading);
    const [chartPreview, setChartPreview] = useState<ChartPreview>();
    const [chart, setChart] = useState<IChart>();
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const drillOptionRef = useRef<IChartDrillOption>();
    const t = useI18NPrefix('viz.main');
    const tg = useI18NPrefix('global');
    const saveAsViz = useSaveAsViz();
    const history = useHistory();
    const vizs = useSelector(selectVizs);

    useEffect(() => {
      const filterSearchParams = filterSearchUrl
        ? urlSearchTransfer.toParams(filterSearchUrl)
        : undefined;
      dispatch(
        initChartPreviewData({
          backendChartId,
          orgId,
          filterSearchParams,
        }),
      );
    }, [dispatch, orgId, backendChartId, filterSearchUrl]);

    useEffect(() => {
      const newChartPreview = previewCharts.find(
        c => c.backendChartId === backendChartId,
      );
      if (newChartPreview && newChartPreview.version !== version) {
        setVersion(newChartPreview.version);
        setChartPreview(newChartPreview);

        const drillPaths = getDrillPaths(newChartPreview?.chartConfig?.datas);
        if (isEmptyArray(drillPaths)) {
          drillOptionRef.current = undefined;
        }
        if (
          !isEmptyArray(drillPaths) &&
          drillOptionRef.current
            ?.getAllFields()
            ?.map(p => p.uid)
            .join('-') !== drillPaths.map(p => p.uid).join('-')
        ) {
          drillOptionRef.current = new ChartDrillOption(drillPaths);
        }

        if (
          !chart ||
          chart?.meta?.id !==
            newChartPreview?.backendChart?.config?.chartGraphId
        ) {
          const newChart = chartManager.getById(
            newChartPreview?.backendChart?.config?.chartGraphId,
          );
          registerChartEvents(newChart, backendChartId);
          setChart(newChart);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      backendChartId,
      chart,
      chartManager,
      chartPreview?.backendChart?.id,
      previewCharts,
      version,
    ]);

    const registerChartEvents = (chart, backendChartId) => {
      chart?.registerMouseEvents([
        {
          name: 'click',
          callback: param => {
            if (drillOptionRef.current?.isSelectedDrill) {
              const option = drillOptionRef.current;
              option.drillDown(param.data.rowData);
              drillOptionRef.current = option;
              handleDrillOptionChange(option);
              return;
            }
            if (
              param.componentType === 'table' &&
              param.seriesType === 'paging-sort-filter'
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
          },
        },
      ]);
    };

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

    const handleDrillOptionChange = (option: IChartDrillOption) => {
      drillOptionRef.current = option;
      dispatch(
        updateFilterAndFetchDataset({
          backendChartId,
          chartPreview,
          payload: null,
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
                <ChartDrillContextMenu>
                  <ChartIFrameContainer
                    key={backendChartId}
                    containerId={backendChartId}
                    dataset={chartPreview?.dataset}
                    chart={chart!}
                    config={chartPreview?.chartConfig!}
                    width={cacheW}
                    height={cacheH}
                  />
                </ChartDrillContextMenu>
              </Spin>
            </ChartWrapper>
            <ChartDrillPaths />
          </ChartDrillContext.Provider>
        </PreviewBlock>
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
  .chart-drill-path {
    background-color: ${p => p.theme.componentBackground};
  }
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
