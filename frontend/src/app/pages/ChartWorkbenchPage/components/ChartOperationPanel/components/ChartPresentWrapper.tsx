import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import ChartConfig from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import ChartDataView from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { FC } from 'react';
import styled from 'styled-components/macro';
import { SPACE_MD } from 'styles/StyleConstants';
import ChartGraphPanel from './ChartGraphPanel';
import ChartPresentPanel from './ChartPresentPanel';

const ChartPresentWrapper: FC<{
  chart?: Chart;
  dataView?: ChartDataView;
  dataset?: ChartDataset;
  chartConfig?: ChartConfig;
  onChartChange: (c: Chart) => void;
}> = ({ chart, dataView, dataset, chartConfig, onChartChange }) => {
  return (
    <Wrapper>
      <ChartGraphPanel chart={chart} chartConfig={chartConfig} onChartChange={onChartChange} />
      <ChartPresentPanel
        chart={chart}
        dataView={dataView}
        dataset={dataset}
        chartConfig={chartConfig}
      />
    </Wrapper>
  );
};

export default ChartPresentWrapper;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${SPACE_MD} ${SPACE_MD} ${SPACE_MD} 0;
  background-color: ${p => p.theme.bodyBackground};
`;
