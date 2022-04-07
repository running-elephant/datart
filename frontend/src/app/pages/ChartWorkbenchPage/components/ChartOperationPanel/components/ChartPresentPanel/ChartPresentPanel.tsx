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
import { Col, Dropdown, Menu, Row, Table } from 'antd';
import { ChartIFrameContainerDispatcher } from 'app/components/ChartIFrameContainer';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useMount from 'app/hooks/useMount';
import { DrillMode } from 'app/models/ChartDrillOption';
import ChartDatasetContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDatasetContext';
import { datasetLoadingSelector } from 'app/pages/ChartWorkbenchPage/slice/selectors';
import { IChart } from 'app/types/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataSetDTO from 'app/types/ChartDataSet';
import { FC, memo, useContext, useMemo, useState } from 'react';
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
import ChartDrillPath from './components/ChartDrillPath';
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
    const drillTranslator = useI18NPrefix(`viz.palette.drill`);
    const chartDispatcher = ChartIFrameContainerDispatcher.instance();
    const [chartType, setChartType] = useState(ChartPresentType.GRAPH);
    const datasetLoadingStatus = useSelector(datasetLoadingSelector);
    const { drillOption, onChartDrillOptionChange } =
      useContext(ChartDatasetContext);

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

    const menu = useMemo(() => {
      return (
        <Menu style={{ width: 200 }}>
          <Menu.SubMenu
            disabled={drillOption?.getMode() === DrillMode.Expand}
            key="showNextLevel"
            title={drillTranslator('showNextLevel')}
            onTitleClick={() => {
              if (drillOption) {
                drillOption?.drillDown();
                onChartDrillOptionChange?.(drillOption);
              }
            }}
          ></Menu.SubMenu>
          <Menu.SubMenu
            disabled={drillOption?.getMode() === DrillMode.Drill}
            key="expandNextLevel"
            title={drillTranslator('expandNextLevel')}
          >
            <Menu.Item>5d menu item</Menu.Item>
            <Menu.Item>6th menu item</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      );
    }, [drillOption, drillTranslator, onChartDrillOptionChange]);

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
        <StyledReusableChartContainer>
          {ChartPresentType.GRAPH === chartType && (
            <Dropdown
              overlay={menu}
              destroyPopupOnHide={true}
              trigger={['contextMenu']}
              getPopupContainer={() =>
                document.getElementById('reusable-container')!
              }
            >
              <div id="reusable-container" style={{ height: '100%' }}>
                {renderGraph(containerId, chart, chartConfig, style)}
              </div>
            </Dropdown>
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

    const renderChartTypeSelector = () => {
      return (
        <ChartTypeSelector
          type={chartType}
          translate={translate}
          onChange={setChartType}
          onCreateDownloadDataTask={onCreateDownloadDataTask}
        />
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
          <Col>{renderChartTypeSelector()}</Col>
        </Row>
        {renderReusableChartContainer()}
        <StyledChartDillPath>
          <ChartDrillPath
            drillOption={drillOption}
            onChartDrillOptionChange={onChartDrillOptionChange}
          />
        </StyledChartDillPath>
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

const StyledChartDillPath = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
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
