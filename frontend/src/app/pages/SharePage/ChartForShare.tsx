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

import ChartDrillContextMenu from 'app/components/ChartDrill/ChartDrillContextMenu';
import ChartDrillPaths from 'app/components/ChartDrill/ChartDrillPaths';
import { ChartIFrameContainer } from 'app/components/ChartIFrameContainer';
import { ChartDataViewFieldCategory } from 'app/constants';
import useMount from 'app/hooks/useMount';
import useResizeObserver from 'app/hooks/useResizeObserver';
import ChartManager from 'app/models/ChartManager';
import { IChart } from 'app/types/Chart';
import { IChartDrillOption } from 'app/types/ChartDrillOption';
import {
  getInterimDateAggregateRows,
  handledateAggregaeToComputedFields,
} from 'app/utils/chartHelper';
import { getChartDrillOption } from 'app/utils/internalChartHelper';
import { FC, memo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import ChartDrillContext from '../ChartWorkbenchPage/contexts/ChartDrillContext';
import ControllerPanel from '../MainPage/pages/VizPage/ChartPreview/components/ControllerPanel';
import {
  ChartPreview,
  FilterSearchParams,
} from '../MainPage/pages/VizPage/slice/types';
import { HeadlessBrowserIdentifier } from './HeadlessBrowserIdentifier';
import { shareActions } from './slice';
import { selectHeadlessBrowserRenderSign } from './slice/selectors';
import {
  fetchShareDataSetByPreviewChartAction,
  updateFilterAndFetchDatasetForShare,
  updateGroupAndFetchDatasetForShare,
} from './slice/thunks';

const TitleHeight = 100;
const ChartForShare: FC<{
  chartPreview?: ChartPreview;
  filterSearchParams?: FilterSearchParams;
  sourceSupportDateFields?: string[];
}> = memo(({ chartPreview, sourceSupportDateFields }) => {
  const dispatch = useDispatch();
  const drillOptionRef = useRef<IChartDrillOption>();
  const [chart] = useState<IChart | undefined>(() => {
    const currentChart = ChartManager.instance().getById(
      chartPreview?.backendChart?.config?.chartGraphId,
    );
    return currentChart;
  });
  const {
    ref,
    width = 0,
    height = 0,
  } = useResizeObserver<HTMLDivElement>({
    refreshMode: 'debounce',
    refreshRate: 500,
  });
  const { ref: controlRef, height: controlH = 0 } =
    useResizeObserver<HTMLDivElement>({
      refreshMode: 'debounce',
      refreshRate: 500,
    });
  const headlessBrowserRenderSign = useSelector(
    selectHeadlessBrowserRenderSign,
  );
  useMount(() => {
    if (!chartPreview) {
      return;
    }
    drillOptionRef.current = getChartDrillOption(
      chartPreview?.chartConfig?.datas,
      drillOptionRef?.current,
    );
    dispatch(fetchShareDataSetByPreviewChartAction({ preview: chartPreview }));
    registerChartEvents(chart);
  });

  const registerChartEvents = chart => {
    chart?.registerMouseEvents([
      {
        name: 'click',
        callback: param => {
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
            param.componentType === 'table' &&
            param.seriesType === 'paging-sort-filter'
          ) {
            dispatch(
              fetchShareDataSetByPreviewChartAction({
                preview: chartPreview!,
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

  const handleFilterChange = (type, payload) => {
    dispatch(
      updateFilterAndFetchDatasetForShare({
        backendChartId: chartPreview?.backendChart?.id!,
        chartPreview,
        payload,
        drillOption: drillOptionRef?.current,
      }),
    );
  };

  const handleDrillOptionChange = (option: IChartDrillOption) => {
    drillOptionRef.current = option;
    dispatch(
      updateFilterAndFetchDatasetForShare({
        backendChartId: chartPreview?.backendChart?.id!,
        chartPreview,
        payload: null,
        drillOption: drillOptionRef?.current,
      }),
    );
  };

  const handleChartDrillDataAggregationChange = (type, payload) => {
    const rows = getInterimDateAggregateRows(payload.value?.rows);
    const dateAggregationField = rows.filter(
      v => v.category === ChartDataViewFieldCategory.DateAggregationField,
    );
    const deleteColName = payload.value.deleteColName;
    const computedFields = handledateAggregaeToComputedFields(
      dateAggregationField,
      deleteColName,
      chartPreview?.backendChart?.config?.computedFields,
      chartPreview?.chartConfig,
    );

    dispatch(
      shareActions.updateComputedFields({
        backendChartId: chartPreview?.backendChart?.id!,
        computedFields,
      }),
    );
    dispatch(
      updateGroupAndFetchDatasetForShare({
        backendChartId: chartPreview?.backendChart?.id!,
        payload: payload,
        drillOption: drillOptionRef?.current,
      }),
    );
  };

  return (
    <StyledChartPreviewBoard>
      <div ref={controlRef}>
        <ControllerPanel
          viewId={chartPreview?.backendChart?.viewId}
          chartConfig={chartPreview?.chartConfig}
          onChange={handleFilterChange}
        />
      </div>
      <ChartDrillContext.Provider
        value={{
          drillOption: drillOptionRef.current,
          sourceSupportDateField: sourceSupportDateFields,
          onDrillOptionChange: handleDrillOptionChange,
          onChartDrillDataAggregationChange:
            handleChartDrillDataAggregationChange,
        }}
      >
        <div style={{ width: '100%', height: '100%' }} ref={ref}>
          <ChartDrillContextMenu chartConfig={chartPreview?.chartConfig}>
            <ChartIFrameContainer
              key={chartPreview?.backendChart?.id!}
              containerId={chartPreview?.backendChart?.id!}
              dataset={chartPreview?.dataset}
              chart={chart!}
              config={chartPreview?.chartConfig!}
              drillOption={drillOptionRef.current}
              width={width}
              height={height}
            />
          </ChartDrillContextMenu>
        </div>
        <ChartDrillPaths />
      </ChartDrillContext.Provider>
      <HeadlessBrowserIdentifier
        renderSign={headlessBrowserRenderSign}
        width={Number(width) || 0}
        height={Number(width) + Number(controlH) + TitleHeight || 0}
      />
    </StyledChartPreviewBoard>
  );
});

export default ChartForShare;

const StyledChartPreviewBoard = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;

  .chart-drill-menu-container {
    height: 100%;
  }

  iframe {
    flex-grow: 1000;
  }
`;
