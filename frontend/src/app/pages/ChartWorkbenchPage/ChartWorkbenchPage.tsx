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

import useMount from 'app/hooks/useMount';
import useRouteQuery from 'app/hooks/useRouteQuery';
import workbenchSlice, {
  backendChartSelector,
  chartConfigSelector,
  currentDataViewSelector,
  datasetsSelector,
  initWorkbenchAction,
  refreshDatasetAction,
  updateChartAction,
  updateChartConfigAndRefreshDatasetAction,
  useWorkbenchSlice,
} from 'app/pages/ChartWorkbenchPage/slice/workbenchSlice';
import { transferOldDataConfigs } from 'app/utils/chartConfig';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { CloneValueDeep, mergeDefaultToValue } from 'utils/object';
import { ChartConfigReducerActionType } from '.';
import ChartWorkbench from './components/ChartWorkbench/ChartWorkbench';
import Chart from './models/Chart';
import ChartManager from './models/ChartManager';

const ChartWorkbenchPage: React.FC = () => {
  const { chartId: backendChartId } = useParams<{ chartId: string }>();
  const orgId = useRouteQuery({ key: 'orgId' }) as string;

  const { actions } = useWorkbenchSlice();
  const history = useHistory();
  const dispatch = useDispatch();

  const dataset = useSelector(datasetsSelector);
  const dataview = useSelector(currentDataViewSelector);
  const chartConfig = useSelector(chartConfigSelector);
  const backendChart = useSelector(backendChartSelector);
  const [chart, setChart] = useState<Chart>();

  useMount(
    () => {
      const currentChart = ChartManager.instance().getDefaultChart();
      handleChartChange(currentChart);

      dispatch(
        initWorkbenchAction({
          backendChartId,
          orgId,
        }),
      );
    },
    () => {
      dispatch(actions.resetWorkbenchState({}));
    },
  );

  useEffect(() => {
    if (backendChart?.config?.chartGraphId) {
      const currentChart = ChartManager.instance().getById(
        backendChart?.config?.chartGraphId,
      );
      registerChartEvents(currentChart);
      setChart(currentChart);
    }
  }, [backendChart]);

  const handleChartChange = (c: Chart) => {
    registerChartEvents(c);
    setChart(c);
    let clonedState = CloneValueDeep(c.config);
    clonedState = transferOldDataConfigs(chartConfig, clonedState!);

    dispatch(
      workbenchSlice.actions.updateChartConfig({
        type: ChartConfigReducerActionType.INIT,
        payload: {
          init: {
            ...clonedState,
            styles: mergeDefaultToValue(clonedState?.styles),
            settings: mergeDefaultToValue(clonedState?.settings),
          },
        },
      }),
    );
    dispatch(refreshDatasetAction({}));
  };

  const handleChartConfigChange = (type, payload) => {
    dispatch(
      updateChartConfigAndRefreshDatasetAction({
        type,
        payload,
        needRefresh: payload.needRefresh,
      }),
    );
  };

  const handleSaveChartToBackend = () => {
    dispatch(
      updateChartAction({
        name: backendChart?.name,
        viewId: dataview?.id,
        graphId: chart?.meta?.id,
        chartId: backendChartId,
        index: 0,
        parentId: 0,
      }),
    );
  };

  const registerChartEvents = chart => {
    chart?.registerMouseEvents([
      {
        name: 'click',
        callback: param => {},
      },
      {
        name: 'dblclick',
        callback: param => {},
      },
    ]);
  };

  return (
    <StyledChartWorkbenchPage>
      <ChartWorkbench
        header={{
          name: backendChart?.name,
          onSaveChart: handleSaveChartToBackend,
          onGoBack: () => {
            history.goBack();
          },
        }}
        chart={chart}
        dataset={dataset}
        dataview={dataview}
        chartConfig={chartConfig}
        onChartChange={handleChartChange}
        onChartConfigChange={handleChartConfigChange}
      />
    </StyledChartWorkbenchPage>
  );
};

export default ChartWorkbenchPage;

const StyledChartWorkbenchPage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  min-width: 0;
  min-height: 0;
`;
