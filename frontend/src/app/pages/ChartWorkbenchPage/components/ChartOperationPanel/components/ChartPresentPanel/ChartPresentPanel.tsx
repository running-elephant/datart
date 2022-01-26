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

import { Table } from 'antd';
import { ChartIFrameContainerDispatcher } from 'app/components/ChartIFrameContainer';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useMount from 'app/hooks/useMount';
import { IChart } from 'app/types/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataSetDTO from 'app/types/ChartDataSet';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG, SPACE_MD } from 'styles/StyleConstants';
import { Debugger } from 'utils/debugger';
import Chart404Graph from './components/Chart404Graph';
import ChartTypeSelector, {
  ChartPresentType,
} from './components/ChartTypeSelector';

const CHART_TYPE_SELECTOR_HEIGHT_OFFSET = 50;

const ChartPresentPanel: FC<{
  containerHeight?: number;
  containerWidth?: number;
  chart?: IChart;
  dataset?: ChartDataSetDTO;
  chartConfig?: ChartConfig;
}> = memo(
  ({ containerHeight, containerWidth, chart, dataset, chartConfig }) => {
    const translate = useI18NPrefix(`viz.palette.present`);
    const chartDispatcher = ChartIFrameContainerDispatcher.instance();
    const [chartType, setChartType] = useState(ChartPresentType.GRAPH);

    useMount(undefined, () => {
      Debugger.instance.measure(`ChartPresentPanel | Dispose Event`, () => {
        ChartIFrameContainerDispatcher.dispose();
      });
    });

    const renderGraph = (containerId, chart?: IChart, chartConfig?, style?) => {
      if (!chart?.isMatchRequirement(chartConfig)) {
        return <Chart404Graph chart={chart} chartConfig={chartConfig} />;
      }
      return (
        !!chart &&
        chartDispatcher.getContainers(
          containerId,
          chart,
          dataset,
          chartConfig!,
          style,
        )
      );
    };

    const renderReusableChartContainer = () => {
      const style = {
        width: containerWidth,
        height:
          (containerHeight || CHART_TYPE_SELECTOR_HEIGHT_OFFSET) -
          CHART_TYPE_SELECTOR_HEIGHT_OFFSET,
      };

      const containerId = chart?.isISOContainer
        ? (chart?.isISOContainer as string)
        : 'container-1';

      return (
        <>
          {ChartPresentType.GRAPH === chartType && (
            <div style={{ height: '100%' }}>
              {renderGraph(containerId, chart, chartConfig, style)}
            </div>
          )}
          {ChartPresentType.RAW === chartType && (
            <TableWrapper>
              <Table
                size="small"
                dataSource={dataset?.rows}
                columns={dataset?.columns?.map((col, index) => ({
                  key: col.name,
                  title: col.name,
                  dataIndex: index,
                }))}
                bordered
              />
            </TableWrapper>
          )}
          {ChartPresentType.SQL === chartType && (
            <SqlWrapper>
              <code>{dataset?.script}</code>
            </SqlWrapper>
          )}
        </>
      );
    };

    const renderChartTypeSelector = () => {
      return (
        <ChartTypeSelector
          type={chartType}
          onChange={setChartType}
          translate={translate}
        />
      );
    };

    return (
      <StyledChartPresentPanel>
        {renderChartTypeSelector()}
        {renderReusableChartContainer()}
      </StyledChartPresentPanel>
    );
  },
);

export default ChartPresentPanel;

const StyledChartPresentPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: ${p => p.theme.componentBackground};
  border-radius: ${BORDER_RADIUS};
`;

const TableWrapper = styled.div`
  padding: ${SPACE_LG};
`;

const SqlWrapper = styled.div`
  flex: 1;
  padding: ${SPACE_MD};
  margin: 0 ${SPACE_LG} ${SPACE_LG};
  overflow-y: auto;
  background-color: ${p => p.theme.emphasisBackground};
  border-radius: ${BORDER_RADIUS};

  > code {
    color: ${p => p.theme.textColorSnd};
  }
`;
