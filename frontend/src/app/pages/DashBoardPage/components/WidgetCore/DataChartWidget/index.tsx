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
import useResizeObserver from 'app/hooks/useResizeObserver';
import ChartIFrameContainer from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartTools/ChartIFrameContainer';
import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import ChartManager from 'app/pages/ChartWorkbenchPage/models/ChartManager';
import { WidgetChartContext } from 'app/pages/DashBoardPage/contexts/WidgetChartContext';
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { WidgetDataContext } from 'app/pages/DashBoardPage/contexts/WidgetDataContext';
import { WidgetMethodContext } from 'app/pages/DashBoardPage/contexts/WidgetMethodContext';
import { Widget } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { ChartConfig } from 'app/types/ChartConfig';
import { ChartMouseEventParams } from 'app/types/DatartChartBase';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components/macro';
export interface DataChartWidgetProps {}
export const DataChartWidget: React.FC<DataChartWidgetProps> = memo(() => {
  const dataChart = useContext(WidgetChartContext);
  const { data } = useContext(WidgetDataContext);
  const widget = useContext(WidgetContext);
  const { id: widgetId } = widget;
  const { widgetChartClick } = useContext(WidgetMethodContext);
  const [cacheW, setCacheW] = useState(200);
  const [cacheH, setCacheH] = useState(200);
  const widgetRef = useRef<Widget>(widget);
  useEffect(() => {
    widgetRef.current = widget;
  }, [widget]);

  const chartClick = useCallback(
    (params?: ChartMouseEventParams) => {
      if (!params) {
        return;
      }
      widgetChartClick(widgetRef.current, params);
    },
    [widgetChartClick],
  );

  const chart = useMemo(() => {
    if (!dataChart) {
      return null;
    }
    if (dataChart?.config?.chartGraphId) {
      try {
        const chartInstance = ChartManager.instance().getById(
          dataChart.config.chartGraphId,
        ) as Chart;

        if (chartInstance) {
          chartInstance.registerMouseEvents([
            {
              name: 'click',
              callback: chartClick,
            },
          ]);
        }
        return chartInstance;
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }, [chartClick, dataChart]);

  const onResize = useCallback(() => {}, []);

  const {
    ref,
    width = 200,
    height = 200,
  } = useResizeObserver<HTMLDivElement>({
    refreshMode: 'debounce',
    refreshRate: 120,
    onResize,
  });
  useEffect(() => {
    if (width !== 0 && height !== 0) {
      setCacheW(width);
      setCacheH(height);
    }
  }, [width, height]);
  const dataset = useMemo(
    () => ({
      columns: data.columns,
      rows: data.rows,
      pageInfo: data.pageInfo || {},
    }),
    [data],
  );
  const chartFrame = useMemo(() => {
    if (!dataChart) {
      return;
    }
    if (!chart) {
      if (!dataChart?.config) {
        return `not found chart config`;
      }
      if (!dataChart?.config?.chartGraphId) {
        return `not found chartGraphId`;
      }
      return `not found chart by ${dataChart?.config?.chartGraphId}`;
    }
    try {
      return (
        <ChartIFrameContainer
          dataset={dataset}
          chart={chart}
          config={dataChart.config.chartConfig as ChartConfig}
          style={{ width: cacheW, height: cacheH }}
          containerId={widgetId}
        />
      );
    } catch (error) {
      return <span>has err in {`<ChartIFrameContainer>`}</span>;
    }
  }, [cacheH, cacheW, chart, dataChart, dataset, widgetId]);
  return (
    <Wrap className="widget-chart" ref={ref}>
      {chartFrame}
    </Wrap>
  );
});
const Wrap = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  & div {
    max-width: 100%;
    max-height: 100%;
  }
`;
