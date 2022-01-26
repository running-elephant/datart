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

import ChartAggregationContext from 'app/pages/ChartWorkbenchPage/contexts/ChartAggregationContext';
import ChartDatasetContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDatasetContext';
import ChartDataViewContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDataViewContext';
import TimeConfigContext from 'app/pages/ChartWorkbenchPage/contexts/TimeConfigContext';
import { IChart } from 'app/types/Chart';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import ChartDataView from 'app/types/ChartDataView';
import { FC, memo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import {
  dateFormatSelector,
  languageSelector,
} from '../../slice/workbenchSlice';
import ChartHeaderPanel from '../ChartHeaderPanel';
import ChartOperationPanel from '../ChartOperationPanel';

const ChartWorkbench: FC<{
  dataset?: ChartDataset;
  dataview?: ChartDataView;
  chartConfig?: ChartConfig;
  chart?: IChart;
  aggregation?: boolean;
  defaultViewId?: string;
  header?: {
    name?: string;
    onSaveChart?: () => void;
    onGoBack?: () => void;
    onChangeAggregation?: (state: boolean) => void;
  };
  onChartChange: (c: IChart) => void;
  onChartConfigChange: (type, payload) => void;
  onDataViewChange?: () => void;
}> = memo(
  ({
    dataset,
    dataview,
    chartConfig,
    chart,
    aggregation,
    header,
    defaultViewId,
    onChartChange,
    onChartConfigChange,
    onDataViewChange,
  }) => {
    const language = useSelector(languageSelector);
    const dateFormat = useSelector(dateFormatSelector);
    return (
      <ChartAggregationContext.Provider
        value={{
          aggregation,
          onChangeAggregation: header?.onChangeAggregation,
        }}
      >
        <ChartDatasetContext.Provider value={{ dataset: dataset }}>
          <ChartDataViewContext.Provider value={{ dataView: dataview }}>
            <TimeConfigContext.Provider
              value={{ locale: language, format: dateFormat }}
            >
              <StyledChartWorkbench>
                {header && (
                  <ChartHeaderPanel
                    chartName={header?.name}
                    onGoBack={header?.onGoBack}
                    onSaveChart={header?.onSaveChart}
                  />
                )}
                <StyledChartOperationPanel>
                  <ChartOperationPanel
                    chart={chart}
                    defaultViewId={defaultViewId}
                    chartConfig={chartConfig}
                    onChartChange={onChartChange}
                    onChartConfigChange={onChartConfigChange}
                    onDataViewChange={onDataViewChange}
                  />
                </StyledChartOperationPanel>
              </StyledChartWorkbench>
            </TimeConfigContext.Provider>
          </ChartDataViewContext.Provider>
        </ChartDatasetContext.Provider>
      </ChartAggregationContext.Provider>
    );
  },
  (prev, next) =>
    prev.header === next.header &&
    prev.dataview === next.dataview &&
    prev.chart === next.chart &&
    prev.chartConfig === next.chartConfig &&
    prev.dataset === next.dataset &&
    prev.defaultViewId === next.defaultViewId,
);

export default ChartWorkbench;

const StyledChartWorkbench = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column;
  overflow: hidden;
  background-color: ${p => p.theme.componentBackground};

  .flexlayout__tab {
    overflow: hidden;
  }

  .flexlayout__splitter {
    background: ${p => p.theme.bodyBackground};

    &:hover {
      background-color: ${p => p.theme.primary};
    }
  }

  .flexlayout__splitter_drag {
    background: ${p => p.theme.primary};
  }
`;

const StyledChartOperationPanel = styled.div`
  position: relative;
  flex: 1;
`;
