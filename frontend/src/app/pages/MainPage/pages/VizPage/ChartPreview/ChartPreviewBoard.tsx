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
import { VizHeader } from 'app/components/VizHeader';
import useResizeObserver from 'app/hooks/useResizeObserver';
import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import { ChartDataRequestBuilder } from 'app/pages/ChartWorkbenchPage/models/ChartHttpRequest';
import ChartManager from 'app/pages/ChartWorkbenchPage/models/ChartManager';
import ChartEditor from 'app/pages/DashBoardPage/pages/BoardEditor/components/ChartEditor';
import { useMainSlice } from 'app/pages/MainPage/slice';
import { selectDownloadPolling } from 'app/pages/MainPage/slice/selectors';
// import { makeDownloadDataTask } from 'app/pages/MainPage/slice/thunks';
import { generateShareLinkAsync, makeDownloadDataTask } from 'app/utils/fetch';
import {
  CSSProperties,
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG } from 'styles/StyleConstants';
import ChartTools from '../../../../ChartWorkbenchPage/components/ChartOperationPanel/components/ChartTools';
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
  style?: CSSProperties;
  filterSearchUrl?: string;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowManage?: boolean;
}> = memo(
  ({
    backendChartId,
    orgId,
    style = { width: 300, height: 300 },
    filterSearchUrl,
    allowDownload,
    allowShare,
    allowManage,
  }) => {
    useVizSlice();
    const {
      ref,
      width = style?.width,
      height = style?.height,
    } = useResizeObserver<HTMLDivElement>({
      refreshMode: 'throttle',
      refreshRate: 500,
    });
    const { actions } = useMainSlice();
    const downloadPolling = useSelector(selectDownloadPolling);
    const chartManager = ChartManager.instance();
    const dispatch = useDispatch();
    const [version, setVersion] = useState<string>();
    const previewCharts = useSelector(selectPreviewCharts);
    const publishLoading = useSelector(selectPublishLoading);
    const [chartPreview, setChartPreview] = useState<ChartPreview>();
    const [chart, setChart] = useState<Chart>();
    const [editChartVisible, setEditChartVisible] = useState<boolean>(false);

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
            if (param.seriesName === 'paging') {
              if (!chartPreview) {
                return;
              }
              const page = param.value?.page;
              dispatch(
                fetchDataSetByPreviewChartAction({
                  chartPreview: chartPreview!,
                  pageInfo: { pageNo: page },
                }),
              );
              return;
            }
          },
        },
        {
          name: 'dblclick',
          callback: param => {},
        },
      ]);
    };

    const hanldeGotoWorkbenchPage = () => {
      // history.push(`/charts/${backendChartId}?orgId=${orgId}`);
      setEditChartVisible(true);
    };
    const onSaveInDataChart = useCallback(
      (orgId: string, backendChartId: string) => {
        dispatch(
          initChartPreviewData({
            backendChartId,
            orgId,
          }),
        );
        setEditChartVisible(false);
      },
      [dispatch],
    );

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
                `${
                  chartPreview.backendChart?.status === 2 ? '取消' : ''
                }发布成功`,
              );
            },
          }),
        );
      }
    }, [dispatch, chartPreview?.backendChart]);

    return (
      <StyledChartPreviewBoard>
        <VizHeader
          chartName={chartPreview?.backendChart?.name}
          status={chartPreview?.backendChart?.status}
          publishLoading={publishLoading}
          onGotoEdit={hanldeGotoWorkbenchPage}
          onPublish={handlePublish}
          onGenerateShareLink={handleGenerateShareLink}
          onDownloadData={handleCreateDownloadDataTask}
          allowDownload={allowDownload}
          allowShare={allowShare}
          allowManage={allowManage}
        />
        <PreviewBlock>
          <ControllerPanel
            viewId={chartPreview?.backendChart?.viewId}
            view={chartPreview?.backendChart?.view}
            chartConfig={chartPreview?.chartConfig}
            onChange={handleFilterChange}
          />
          <ChartWrapper ref={ref}>
            <ChartTools.ChartIFrame
              key={backendChartId}
              containerId={backendChartId}
              dataset={chartPreview?.dataset}
              chart={chart!}
              config={chartPreview?.chartConfig!}
              style={{ width: width, height: height as number }}
            />
          </ChartWrapper>
        </PreviewBlock>
        {editChartVisible && (
          <ChartEditor
            dataChartId={backendChartId}
            orgId={orgId}
            chartType="dataChart"
            container="dataChart"
            onClose={() => setEditChartVisible(false)}
            onSaveInDataChart={onSaveInDataChart}
          />
        )}
      </StyledChartPreviewBoard>
    );
  },
);

export default ChartPreviewBoard;

const StyledChartPreviewBoard = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column;

  iframe {
    flex-grow: 1000;
  }
`;

const PreviewBlock = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: ${SPACE_LG};
  box-shadow: ${p => p.theme.shadowBlock};
`;

const ChartWrapper = styled.div`
  display: flex;
  flex: 1;
  background-color: ${p => p.theme.componentBackground};
  border-radius: ${BORDER_RADIUS};
`;
