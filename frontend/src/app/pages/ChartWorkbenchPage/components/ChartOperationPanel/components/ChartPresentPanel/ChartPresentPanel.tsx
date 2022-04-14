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

import { ReloadOutlined } from '@ant-design/icons';
import { Col, Row, Table } from 'antd';
import ChartDrillContextMenu from 'app/components/ChartDrill/ChartDrillContextMenu';
import ChartDrillPaths from 'app/components/ChartDrill/ChartDrillPaths';
import { ChartIFrameContainerDispatcher } from 'app/components/ChartIFrameContainer';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useMount from 'app/hooks/useMount';
import ChartDrillContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDrillContext';
import { datasetLoadingSelector } from 'app/pages/ChartWorkbenchPage/slice/selectors';
import { IChart } from 'app/types/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataSetDTO from 'app/types/ChartDataSet';
import { FC, memo, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  LINE_HEIGHT_ICON_XXL,
  SPACE_LG,
  SPACE_MD,
} from 'styles/StyleConstants';
import { Debugger } from 'utils/debugger';
import Chart404Graph from './components/Chart404Graph';
import ChartTypeSelector, {
  ChartPresentType,
} from './components/ChartTypeSelector';

const CHART_TYPE_SELECTOR_HEIGHT_OFFSET = 50;
const CHART_DRILL_PATH_HEIGHT = 24;

const ChartPresentPanel: FC<{
  containerHeight?: number;
  containerWidth?: number;
  chart?: IChart;
  dataset?: ChartDataSetDTO;
  chartConfig?: ChartConfig;
  expensiveQuery: boolean;
  allowQuery: boolean;
  onRefreshDataset?: () => void;
  onCreateDownloadDataTask?: () => void;
}> = memo(
  ({
    containerHeight,
    containerWidth,
    chart,
    dataset,
    chartConfig,
    expensiveQuery,
    allowQuery,
    onRefreshDataset,
    onCreateDownloadDataTask,
  }) => {
    const translate = useI18NPrefix(`viz.palette.present`);
    const chartDispatcher = ChartIFrameContainerDispatcher.instance();
    const [chartType, setChartType] = useState(ChartPresentType.GRAPH);
    const datasetLoadingStatus = useSelector(datasetLoadingSelector);
    const { drillOption } = useContext(ChartDrillContext);

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
          drillOption,
        )
      );
    };

    const renderReusableChartContainer = () => {
      const style = {
        width: containerWidth,
        height:
          (containerHeight || CHART_TYPE_SELECTOR_HEIGHT_OFFSET) -
          CHART_TYPE_SELECTOR_HEIGHT_OFFSET -
          CHART_DRILL_PATH_HEIGHT,
      };

      const containerId = chart?.isISOContainer
        ? (chart?.isISOContainer as string)
        : 'container-1';

      return (
        <StyledReusableChartContainer>
          {ChartPresentType.GRAPH === chartType && (
            <>
              <ChartDrillContextMenu>
                {renderGraph(containerId, chart, chartConfig, style)}
              </ChartDrillContextMenu>
              <ChartDrillPaths />
            </>
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
        </StyledReusableChartContainer>
      );
    };

    return (
      <StyledChartPresentPanel>
        {expensiveQuery && allowQuery && (
          <ReloadMask>
            <ReloadOutlined
              onClick={onRefreshDataset}
              spin={datasetLoadingStatus}
              className="fetchDataIcon"
            />
          </ReloadMask>
        )}
        <Row justify="end">
          <Col>
            <ChartTypeSelector
              type={chartType}
              translate={translate}
              onChange={setChartType}
              onCreateDownloadDataTask={onCreateDownloadDataTask}
            />
          </Col>
        </Row>
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
  position: relative;
`;

const StyledReusableChartContainer = styled.div``;

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

const ReloadMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  .fetchDataIcon {
    cursor: pointer;
    color: ${p => p.theme.primary};
    font-size: ${LINE_HEIGHT_ICON_XXL};
  }
`;
