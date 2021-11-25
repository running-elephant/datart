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
import FlexLayout, { Model } from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import { FC, memo, useContext, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components/macro';
import ChartDatasetContext from '../../contexts/ChartDatasetContext';
import ChartDataViewContext from '../../contexts/ChartDataViewContext';
import layoutCnofig, { LayoutComponentType } from './ChartOperationPanelLayout';
import ChartConfigPanel from './components/ChartConfigPanel/ChartConfigPanel';
import ChartDataViewPanel from './components/ChartDataViewPanel';
import ChartPresentWrapper from './components/ChartPresentWrapper';

const ChartOperationPanel: FC<{
  chart?: Chart;
  chartConfig?: ChartConfig;
  onChartChange: (chart: Chart) => void;
  onChartConfigChange: (type, payload) => void;
  onDataViewChange?: () => void;
}> = memo(
  ({
    chart,
    chartConfig,
    onChartChange,
    onChartConfigChange,
    onDataViewChange,
  }) => {
    const { dataset } = useContext(ChartDatasetContext);
    const { dataView } = useContext(ChartDataViewContext);

    const [layout, setLayout] = useState<Model>(() =>
      Model.fromJson(layoutCnofig),
    );

    const layoutFactory = node => {
      var component = node.getComponent();
      if (component === LayoutComponentType.VIEW) {
        return (
          <ChartDataViewPanel
            onDataViewChange={onDataViewChange}
            dataView={dataView}
          />
        );
      }
      if (component === LayoutComponentType.CONFIG) {
        return (
          <ChartConfigPanel
            chartConfig={chartConfig}
            onChange={onChartConfigChange}
          />
        );
      }
      if (component === LayoutComponentType.PRESENT) {
        return (
          <ChartPresentWrapper
            chart={chart}
            dataset={dataset}
            chartConfig={chartConfig}
            onChartChange={onChartChange}
          />
        );
      }
    };

    return (
      <StyledChartOperationPanel backend={HTML5Backend}>
        <FlexLayout.Layout
          model={layout}
          onModelChange={setLayout}
          factory={layoutFactory}
        />
      </StyledChartOperationPanel>
    );
  },
);

export default ChartOperationPanel;

const StyledChartOperationPanel = styled(DndProvider)<{ backend }>``;
