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
import useMount from 'app/hooks/useMount';
import workbenchSlice, {
  BackendChart,
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
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { CloneValueDeep, mergeDefaultToValue } from 'utils/object';
import { ChartConfigReducerActionType } from '../../../../ChartWorkbenchPage';
import ChartWorkbench from '../../../../ChartWorkbenchPage/components/ChartWorkbench/ChartWorkbench';
import Chart from '../../../../ChartWorkbenchPage/models/Chart';
import ChartManager from '../../../../ChartWorkbenchPage/models/ChartManager';
import {
  DataChart,
  DataChartConfig,
  WidgetContentChartType,
} from '../../../slice/types';
const { confirm } = Modal;
export interface ChartEditorBaseProps {
  dataChartId: string;
  orgId: string;
  container: 'widget' | 'dataChart';
  chartType: WidgetContentChartType;
  widgetId?: string;
  originChart?: BackendChart | DataChart;
}
export interface ChartEditorMethodsProps {
  onClose?: () => void;
  onSaveInWidget?: (
    chartType: WidgetContentChartType,
    dataChart: DataChart,
    view,
  ) => void;
  onSaveInDataChart?: (orgId: string, dataChartId: string) => void;
}
export type ChartEditorProps = ChartEditorBaseProps & ChartEditorMethodsProps;
export const ChartEditor: React.FC<ChartEditorProps> = ({
  originChart,
  orgId,
  container,
  dataChartId,
  chartType,
  onClose,
  onSaveInWidget,
  onSaveInDataChart,
}) => {
  const { actions } = useWorkbenchSlice();
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
      if (container === 'dataChart') {
        dispatch(
          initWorkbenchAction({
            backendChartId: dataChartId,
            orgId,
          }),
        );
      } else {
        //   container === 'widget'
        if (chartType === 'widgetChart') {
          dispatch(
            initWorkbenchAction({
              orgId,
              backendChart: originChart as BackendChart,
            }),
          );
        } else {
          // chartType === 'dataChart'
          dispatch(
            initWorkbenchAction({
              orgId,
              backendChartId: dataChartId,
            }),
          );
        }
      }
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

  const handleDataViewChanged = () => {
    const currentChart = ChartManager.instance().getDefaultChart();
    registerChartEvents(currentChart);
    setChart(currentChart);
    let clonedState = CloneValueDeep(currentChart.config);

    dispatch(
      workbenchSlice.actions.updateChartConfig({
        type: ChartConfigReducerActionType.INIT,
        payload: {
          init: {
            ...clonedState,
          },
        },
      }),
    );
  };

  const saveToWidget = useCallback(() => {
    const dataChartConfig: DataChartConfig = {
      chartConfig: chartConfig!,
      chartGraphId: chart?.meta.id!,
      computedFields: dataview?.computedFields || [],
    };

    const dataChart: DataChart = {
      id: dataChartId,
      name: backendChart?.name || 'widget_chart',
      viewId: dataview?.id || '',
      orgId: orgId,
      config: dataChartConfig,
      status: 1,
      description: '',
    };
    onSaveInWidget?.(chartType, dataChart, dataview);
  }, [
    backendChart?.name,
    chart,
    chartConfig,
    chartType,
    dataChartId,
    dataview,
    onSaveInWidget,
    orgId,
  ]);

  const saveChart = useCallback(async () => {
    if (container === 'dataChart') {
      await dispatch(
        updateChartAction({
          name: backendChart?.name,
          viewId: dataview?.id,
          graphId: chart?.meta?.id,
          chartId: dataChartId,
          index: 0,
          parentId: 0,
        }),
      );
      onSaveInDataChart?.(orgId, dataChartId);
    } else if (container === 'widget') {
      if (chartType === 'widgetChart') {
        saveToWidget();
      } else {
        // dataChart
        confirm({
          title: '保存修改后不能撤销，确定继续保存吗？',
          icon: <ExclamationCircleOutlined />,
          async onOk() {
            dispatch(
              updateChartAction({
                name: backendChart?.name,
                viewId: dataview?.id,
                graphId: chart?.meta?.id,
                chartId: dataChartId,
                index: 0,
                parentId: 0,
              }),
            );
            saveToWidget();
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }
    }
  }, [
    container,
    dispatch,
    backendChart?.name,
    dataview?.id,
    chart?.meta?.id,
    dataChartId,
    onSaveInDataChart,
    orgId,
    chartType,
    saveToWidget,
  ]);
  const registerChartEvents = chart => {
    chart?.registerMouseEvents([
      {
        name: 'click',
        callback: param => {
          if (param.seriesName === 'paging') {
            const page = param.value?.page;
            dispatch(refreshDatasetAction({ pageInfo: { pageNo: page } }));
            return;
          }
        },
      },
      {
        name: 'dblclick',
        callback: param => {
          console.log(
            '//TODO: to be remove | mouse db click event ----> ',
            param,
          );
        },
      },
    ]);
  };
  return (
    <StyledChartWorkbenchPage>
      <ChartWorkbench
        header={{
          name: backendChart?.name || originChart?.name,
          onSaveChart: saveChart,
          onGoBack: () => {
            onClose?.();
          },
        }}
        chart={chart}
        dataset={dataset}
        dataview={dataview}
        chartConfig={chartConfig}
        onChartChange={handleChartChange}
        onChartConfigChange={handleChartConfigChange}
        onDataViewChange={handleDataViewChanged}
      />
    </StyledChartWorkbenchPage>
  );
};

export default ChartEditor;

const StyledChartWorkbenchPage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 55;
  display: flex;
  min-width: 0;
  min-height: 0;
`;
