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
import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import { FC, memo, useMemo } from 'react';
import styled from 'styled-components/macro';
import { SPACE_MD } from 'styles/StyleConstants';
import ChartGraphPanel from './ChartGraphPanel';
import ChartPresentPanel from './ChartPresentPanel';

const ChartPresentWrapper: FC<{
  containerHeight?: number;
  containerWidth?: number;
  chart?: Chart;
  dataset?: ChartDataset;
  chartConfig?: ChartConfig;
  onChartChange: (c: Chart) => void;
}> = memo(
  ({
    containerHeight,
    containerWidth,
    chart,
    dataset,
    chartConfig,
    onChartChange,
  }) => {
    const { ref: ChartGraphPanelRef } = useResizeObserver<any>({
      refreshMode: 'debounce',
      refreshRate: 500,
    });

    const borderWidth = useMemo(() => {
      return +SPACE_MD.replace('px', '');
    }, []);

    return (
      <StyledChartPresentWrapper borderWidth={borderWidth}>
        <div ref={ChartGraphPanelRef}>
          <ChartGraphPanel
            chart={chart}
            chartConfig={chartConfig}
            onChartChange={onChartChange}
          />
        </div>
        <ChartPresentPanel
          containerHeight={
            (containerHeight || 0) -
            borderWidth -
            (ChartGraphPanelRef?.current?.offsetHeight || 0)
          }
          containerWidth={(containerWidth || 0) - borderWidth}
          chart={chart}
          dataset={dataset}
          chartConfig={chartConfig}
        />
      </StyledChartPresentWrapper>
    );
  },
);

export default ChartPresentWrapper;

const StyledChartPresentWrapper = styled.div<{ borderWidth }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${p => p.borderWidth}px ${p => p.borderWidth}px
    ${p => p.borderWidth}px 0;
  background-color: ${p => p.theme.bodyBackground};
`;
