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
import useResizeObserver from 'app/hooks/useResizeObserver';
import ChartTools from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartTools';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useMount from 'app/hooks/useMount';
import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import ChartConfig from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import ChartDataView from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { FC, memo, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG, SPACE_MD } from 'styles/StyleConstants';
import ChartTypeSelector, {
  ChartPresentType,
} from './components/ChartTypeSelector';

const CHART_TYPE_SELECTOR_HEIGHT_OFFSET = 50;

const ChartPresentPanel: FC<{
  chart?: Chart;
  dataView?: ChartDataView;
  dataset?: ChartDataset;
  chartConfig?: ChartConfig;
}> = memo(({ chart, dataView, dataset, chartConfig }) => {
  const translate = useI18NPrefix(`viz.palette.present`);
  const [chartType, setChartType] = useState(ChartPresentType.GRAPH);
  const panelRef = useRef<{ offsetWidth; offsetHeight }>(null);
  const [chartDispatcher] = useState(() =>
    ChartTools.ChartIFrameContainerDispatcher.instance(),
  );

  useMount(undefined, () => {
    console.debug('Disposing - Chart Container');
    ChartTools.ChartIFrameContainerDispatcher.dispose();
  });

  const { ref: graphRef } = useResizeObserver<HTMLDivElement>({
    refreshMode: 'debounce',
    refreshRate: 10,
  });

  const renderReusableChartContainer = () => {
    const style = {
      width: panelRef.current?.offsetWidth,
      height:
        panelRef.current?.offsetHeight - CHART_TYPE_SELECTOR_HEIGHT_OFFSET, // TODO(Stephen): calculate when change chart
    };

    const containerId = chart?.isISOContainer
      ? (chart?.isISOContainer as string)
      : 'container-1';

    return (
      <>
        {ChartPresentType.GRAPH === chartType && (
          <div style={{ height: '100%' }} ref={graphRef}>
            {!!chart &&
              chartDispatcher.getContainers(
                containerId,
                chart,
                dataset,
                chartConfig!,
                style,
              )}
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
    <StyledVizPresentPanel ref={panelRef}>
      {renderChartTypeSelector()}
      {renderReusableChartContainer()}
    </StyledVizPresentPanel>
  );
});

export default ChartPresentPanel;

const StyledVizPresentPanel = styled.div<{ ref }>`
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
