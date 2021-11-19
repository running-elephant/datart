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

import ReactChart from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartGraph/ReactChart';
import Config from './config';
import ReactXYPlot from './ReactVizXYPlot';

class ReactVizXYPlotChart extends ReactChart {
  constructor() {
    super('reactviz-xyplot-chart', 'ReactViz XYPlot Chart', 'star');
  }

  isISOContainer = 'reactviz-container';
  config = Config;
  dependency = [
    'https://unpkg.com/react-vis/dist/style.css',
    'https://unpkg.com/react-vis/dist/dist.min.js',
  ];

  onMount(options, context): void {
    if (!context.window.reactVis) {
      return;
    }
    const { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries } =
      context.window.reactVis;
    this.getInstance().init(ReactXYPlot);
    this.getInstance().registerImportDependenies({
      XYPlot,
      XAxis,
      YAxis,
      HorizontalGridLines,
      LineSeries,
    });
    this.getInstance().mounted(
      context.document.getElementById(options.containerId),
    );
  }

  onUpdated(props): void {
    // this.getWrapper().updated(props);
  }

  onUnMount(): void {}
}

export default ReactVizXYPlotChart;
