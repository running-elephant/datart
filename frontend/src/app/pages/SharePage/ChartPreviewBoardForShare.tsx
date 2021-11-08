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

import { VizHeader } from 'app/components/VizHeader';
import useResizeObserver from 'app/hooks/useResizeObserver';
import useMount from 'app/hooks/useMount';
import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import ChartManager from 'app/pages/ChartWorkbenchPage/models/ChartManager';
import { CSSProperties, FC, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import ChartTools from '../ChartWorkbenchPage/components/ChartOperationPanel/components/ChartTools';
import ChartRequest, {
  ChartDataRequestBuilder,
} from '../ChartWorkbenchPage/models/ChartHttpRequest';
import ControllerPanel from '../MainPage/pages/VizPage/ChartPreview/components/ControllerPanel';
import {
  ChartPreview,
  FilterSearchParams,
} from '../MainPage/pages/VizPage/slice/types';
import { HeadlessBrowserIdentifier } from './HeadlessBrowserIdentifier';
import {} from './slice';
import { selectHeadlessBrowserRenderSign } from './slice/selectors';
import {
  fetchShareDataSetByPreviewChartAction,
  updateFilterAndFetchDatasetForShare,
} from './slice/thunks';

const ChartPreviewBoardForShare: FC<{
  style?: CSSProperties;
  chartPreview?: ChartPreview;
  filterSearchParams?: FilterSearchParams;
  onCreateDataChartDownloadTask: (
    downloadParams: ChartRequest[],
    fileName: string,
  ) => void;
}> = memo(
  ({
    chartPreview,
    style = { width: 800, height: 600 },
    onCreateDataChartDownloadTask,
  }) => {
    const dispatch = useDispatch();
    const [chart] = useState<Chart | undefined>(() => {
      return ChartManager.instance().getById(
        chartPreview?.backendChart?.config?.chartGraphId,
      );
    });
    const {
      ref,
      width = style?.width,
      height = style?.height,
    } = useResizeObserver<HTMLDivElement>({
      refreshMode: 'throttle',
      refreshRate: 500,
    });
    const headlessBrowserRenderSign = useSelector(
      selectHeadlessBrowserRenderSign,
    );

    useMount(() => {
      if (!chartPreview) {
        return;
      }
      dispatch(fetchShareDataSetByPreviewChartAction(chartPreview));
    });

    const handleFilterChange = (type, payload) => {
      dispatch(
        updateFilterAndFetchDatasetForShare({
          backendChartId: chartPreview?.backendChart?.id!,
          chartPreview,
          payload,
        }),
      );
    };

    const handleCreateDownloadDataTask = async () => {
      const builder = new ChartDataRequestBuilder(
        {
          id: chartPreview?.backendChart?.viewId,
          computedFields:
            chartPreview?.backendChart?.config?.computedFields || [],
        } as any,
        chartPreview?.chartConfig?.datas,
        chartPreview?.chartConfig?.settings,
      );
      const downloadParams = [builder.build()];
      const fileName = chartPreview?.backendChart?.name || 'chart';
      onCreateDataChartDownloadTask(downloadParams, fileName);
    };

    return (
      <StyledChartPreviewBoard>
        <VizHeader
          chartName={chartPreview?.backendChart?.name}
          onDownloadData={handleCreateDownloadDataTask}
          allowShare
          allowDownload
        />
        <ControllerPanel
          viewId={chartPreview?.backendChart?.viewId}
          chartConfig={chartPreview?.chartConfig}
          onChange={handleFilterChange}
        />
        <div style={{ width: '100%', height: '100%' }} ref={ref}>
          <ChartTools.ChartIFrame
            key={chartPreview?.backendChart?.id!}
            containerId={chartPreview?.backendChart?.id!}
            dataset={chartPreview?.dataset}
            chart={chart!}
            config={chartPreview?.chartConfig!}
            style={{ width: width, height: height as number }}
          />
        </div>
        <HeadlessBrowserIdentifier
          renderSign={headlessBrowserRenderSign}
          width={Number(width) || 0}
          height={Number(height) || 0}
        />
      </StyledChartPreviewBoard>
    );
  },
);

export default ChartPreviewBoardForShare;

const StyledChartPreviewBoard = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;

  iframe {
    flex-grow: 1000;
  }
`;
