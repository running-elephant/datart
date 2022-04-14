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
import { ChartIFrameContainer } from 'app/components/ChartIFrameContainer';
import { useCacheWidthHeight } from 'app/hooks/useCacheWidthHeight';
import { migrateChartConfig } from 'app/migration';
import ChartManager from 'app/models/ChartManager';
import { Widget } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { ChartMouseEventParams, IChart } from 'app/types/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import { ChartDetailConfigDTO } from 'app/types/ChartConfigDTO';
import { mergeToChartConfig } from 'app/utils/ChartDtoHelper';
import produce from 'immer';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import styled from 'styled-components/macro';
import { WidgetActionContext } from '../../ActionProvider/WidgetActionProvider';
import { WidgetChartContext } from '../../WidgetProvider/WidgetChartProvider';
import { WidgetDataContext } from '../../WidgetProvider/WidgetDataProvider';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';

export const DataChartWidgetCore: React.FC<{}> = memo(() => {
  const dataChart = useContext(WidgetChartContext);
  const { data } = useContext(WidgetDataContext);
  const widget = useContext(WidgetContext);
  const { id: widgetId } = widget;
  const { onWidgetChartClick } = useContext(WidgetActionContext);
  const { cacheWhRef: ref, cacheW, cacheH } = useCacheWidthHeight();
  const widgetRef = useRef<Widget>(widget);
  useEffect(() => {
    widgetRef.current = widget;
  }, [widget]);

  const chartClick = useCallback(
    (params?: ChartMouseEventParams) => {
      if (!params) {
        return;
      }
      onWidgetChartClick(widgetRef.current, params);
    },
    [onWidgetChartClick],
  );

  const chart = useMemo(() => {
    if (!dataChart) {
      return null;
    }
    if (dataChart?.config?.chartGraphId) {
      try {
        const chartInstance = ChartManager.instance().getById(
          dataChart.config.chartGraphId,
        ) as IChart;

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

  const widgetSpecialConfig = useMemo(() => {
    let linkFields: string[] = [];
    let jumpField: string = '';
    const { jumpConfig, linkageConfig } = widget.config;
    if (linkageConfig?.open) {
      linkFields = widget?.relations
        .filter(re => re.config.type === 'widgetToWidget')
        .map(item => item.config.widgetToWidget?.triggerColumn as string);
    }
    if (jumpConfig?.open) {
      jumpField = jumpConfig?.field?.jumpFieldName as string;
    }

    return {
      linkFields,
      jumpField,
    };
  }, [widget]);

  const dataset = useMemo(
    () => ({
      columns: data.columns,
      rows: data.rows,
      pageInfo: data.pageInfo || {},
    }),
    [data],
  );
  const errText = useMemo(() => {
    if (!dataChart) {
      return `not found dataChart`;
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
    return null;
  }, [chart, dataChart]);
  const config = useMemo(() => {
    if (!chart?.config) return undefined;
    if (!dataChart?.config) return undefined;
    let chartConfig = produce(chart.config, draft => {
      mergeToChartConfig(
        draft,
        produce(dataChart?.config, draft => {
          migrateChartConfig(draft as ChartDetailConfigDTO);
        }) as ChartDetailConfigDTO,
      );
    });
    return chartConfig as ChartConfig;
  }, [chart?.config, dataChart?.config]);

  const chartFrame = useMemo(() => {
    if (!config) return null;
    if (cacheH <= 1 || cacheW <= 1) return null;
    if (errText) return errText;
    return (
      <ChartIFrameContainer
        dataset={dataset}
        chart={chart!}
        config={config}
        width={cacheW}
        height={cacheH}
        containerId={widgetId}
        widgetSpecialConfig={widgetSpecialConfig}
      />
    );
  }, [
    config,
    cacheH,
    cacheW,
    errText,
    widgetId,
    dataset,
    chart,
    widgetSpecialConfig,
  ]);
  return (
    <Wrapper className="widget-chart" ref={ref}>
      <ChartFrameBox>{chartFrame}</ChartFrameBox>
    </Wrapper>
  );
});
const ChartFrameBox = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
`;
