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

import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import { FC } from 'react';
import styled from 'styled-components/macro';
import { SPACE_MD } from 'styles/StyleConstants';
import ChartGraphPanel from './ChartGraphPanel';
import ChartPresentPanel from './ChartPresentPanel';

const ChartPresentWrapper: FC<{
  chart?: Chart;
  dataset?: ChartDataset;
  chartConfig?: ChartConfig;
  onChartChange: (c: Chart) => void;
}> = ({ chart, dataset, chartConfig, onChartChange }) => {
  return (
    <StyledChartPresentWrapper>
      <ChartGraphPanel
        chart={chart}
        chartConfig={chartConfig}
        onChartChange={onChartChange}
      />
      <ChartPresentPanel
        chart={chart}
        dataset={dataset}
        chartConfig={chartConfig}
      />
    </StyledChartPresentWrapper>
  );
};

export default ChartPresentWrapper;

const StyledChartPresentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${SPACE_MD} ${SPACE_MD} ${SPACE_MD} 0;
  background-color: ${p => p.theme.bodyBackground};
`;
