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
import Config from './config';

class AntVG2RoseChart extends Chart {
  constructor() {
    super('antvg2-rose-chart', 'AntV Rose Chart');
  }

  isISOContainer = 'antv-g2-container';
  config = Config;
  dependency = ['https://unpkg.com/@antv/g2plot@latest/dist/g2plot.min.js'];

  onMount(options, context): void {
    const host = context.document.getElementById(options.containerId);
    const data = [
      { type: '分类一', value: 27 },
      { type: '分类二', value: 25 },
      { type: '分类三', value: 18 },
      { type: '分类四', value: 15 },
      { type: '分类五', value: 10 },
      { type: '其他', value: 5 },
    ];

    const { Rose } = context.window.G2Plot;
    const rosePlot = new Rose(host, {
      data,
      xField: 'type',
      yField: 'value',
      seriesField: 'type',
      radius: 0.9,
      legend: {
        position: 'bottom',
      },
    });

    rosePlot.render();
  }

  onUpdated({ config }: { config: any }): void {}

  onUnMount(): void {}
}

export default AntVG2RoseChart;
