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

import { message } from 'antd';
import { ChartIFrameContainer } from 'app/components/ChartIFrameContainer';
import { VizHeader } from 'app/components/VizHeader';
import { useCacheWidthHeight } from 'app/hooks/useCacheWidthHeight';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataRequestBuilder } from 'app/pages/ChartWorkbenchPage/models/ChartDataRequestBuilder';
import ChartManager from 'app/pages/ChartWorkbenchPage/models/ChartManager';
import { useMainSlice } from 'app/pages/MainPage/slice';
import { IChart } from 'app/types/Chart';
import { generateShareLinkAsync, makeDownloadDataTask } from 'app/utils/fetch';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG } from 'styles/StyleConstants';
import { useSaveAsViz } from '../hooks/useSaveAsViz';
import { useVizSlice } from '../slice';
import { selectPreviewCharts, selectPublishLoading } from '../slice/selectors';
import {
  fetchDataSetByPreviewChartAction,
  initChartPreviewData,
  publishViz,
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
    const { ref, cacheW, cacheH } = useCacheWidthHeight(
      defaultChartContainerWH,
      defaultChartContainerWH,
    );
    const { actions } = useMainSlice();
    const chartManager = ChartManager.instance();
    const dispatch = useDispatch();
    const [version, setVersion] = useState<string>();
    const previewCharts = useSelector(selectPreviewCharts);
    const publishLoading = useSelector(selectPublishLoading);
    const [chartPreview, setChartPreview] = useState<ChartPreview>();
    const [chart, setChart] = useState<IChart>();
    const t = useI18NPrefix('viz.main');
    const saveAsViz = useSaveAsViz();
    const history = useHistory();

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

        if (
          !chart ||
          chart?.meta?.id !==
            newChartPreview?.backendChart?.config?.chartGraphId
        ) {
          const newChart = chartManager.getById(
            newChartPreview?.backendChart?.config?.chartGraphId,
          );
          registerChartEvents(newChart, newChartPreview);
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

    const registerChartEvents = (chart, chartPreview) => {
      chart?.registerMouseEvents([
        {
          name: 'click',
          callback: param => {
            if (
              param.componentType === 'table' &&
              param.seriesType === 'paging-sort-filter'
            ) {
              dispatch(
                fetchDataSetByPreviewChartAction({
                  chartPreview: chartPreview!,
                  sorter: {
                    column: param?.seriesName!,
                    operator: param?.value?.direction,
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
        state: {
          dataChartId: backendChartId,
          chartType: 'dataChart',
          container: 'dataChart',
        },
      });
    };

    const handleFilterChange = (type, payload) => {
      dispatch(
        updateFilterAndFetchDataset({
          backendChartId,
          chartPreview,
          payload,
        }),
      );
    };

    const handleGenerateShareLink = async (date, usePwd) => {
      const result = await generateShareLinkAsync(
        date,
        usePwd,
        backendChartId,
        'DATACHART',
      );
      return result;
    };

    const handleCreateDownloadDataTask = async () => {
      if (!chartPreview) {
        return;
      }

      const builder = new ChartDataRequestBuilder(
        {
          id: chartPreview?.backendChart?.viewId,
          computedFields:
            chartPreview?.backendChart?.config?.computedFields || [],
        } as any,
        chartPreview?.chartConfig?.datas,
        chartPreview?.chartConfig?.settings,
        {},
        false,
        chartPreview?.backendChart?.config?.aggregation,
      );
      dispatch(
        makeDownloadDataTask({
          downloadParams: [builder.build()],
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
          allowDownload={allowDownload}
          allowShare={allowShare}
          allowManage={allowManage}
        />
        <PreviewBlock>
          <div>
            <ControllerPanel
              viewId={chartPreview?.backendChart?.viewId}
              view={chartPreview?.backendChart?.view}
              chartConfig={chartPreview?.chartConfig}
              onChange={handleFilterChange}
            />
          </div>
          <ChartWrapper ref={ref}>
            <ChartIFrameContainer
              key={backendChartId}
              containerId={backendChartId}
              dataset={chartPreview?.dataset}
              chart={chart!}
              config={chartPreview?.chartConfig!}
              width={cacheW}
              height={cacheH}
            />
          </ChartWrapper>
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
  box-shadow: ${p => p.theme.shadowBlock};
  overflow: hidden;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex: 1;
  background-color: ${p => p.theme.componentBackground};
  border-radius: ${BORDER_RADIUS};
`;
