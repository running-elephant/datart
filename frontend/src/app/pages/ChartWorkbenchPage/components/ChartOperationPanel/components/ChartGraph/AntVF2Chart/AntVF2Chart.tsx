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

class AntVF2Chart extends Chart {
  constructor() {
    super('antvf2-chart', 'AntV F2 Chart');
  }

  isISOContainer = 'antv-f2-container';
  config = Config;
  dependency = [
    'https://gw.alipayobjects.com/os/lib/antv/f2/3.7.0/dist/f2.min.js',
  ];

  onMount(options, context): void {
    const F2 = context.window.F2;
    const node = context.document.createElement('canvas');
    node.id = 'f2-canvas-container';
    context.document.getElementById(options.containerId).appendChild(node);

    fetch('https://gw.alipayobjects.com/os/antfincdn/RJW3vmCf7v/area-none.json')
      .then(res => res.json())
      .then(data => {
        const chart = new F2.Chart({
          id: 'f2-canvas-container',
          pixelRatio: context.window.devicePixelRatio,
        });
        chart.source(data);
        chart.scale('year', {
          tickCount: 5,
          range: [0, 1],
        });
        chart.axis('year', {
          label: function label(text, index, total) {
            const textCfg: { textAlign?: string } = {};
            if (index === 0) {
              textCfg.textAlign = 'left';
            } else if (index === total - 1) {
              textCfg.textAlign = 'right';
            }
            return textCfg;
          },
        });
        chart.legend(false);
        chart.tooltip({
          showCrosshairs: true,
        });
        chart.area().position('year*value').color('type').shape('smooth');
        chart.line().position('year*value').color('type').shape('smooth');
        chart.render();
      });
  }

  onUpdated({ config }: { config: any }): void {}

  onUnMount(): void {}
}

export default AntVF2Chart;
