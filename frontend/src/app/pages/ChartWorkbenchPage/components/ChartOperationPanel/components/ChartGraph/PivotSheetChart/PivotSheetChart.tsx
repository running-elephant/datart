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

import { PivotSheet } from '@antv/s2';
import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import Config from './config';
import MockData from './mock_data.json';

class PivotSheetChart extends Chart {
  static icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M10 8h11V5c0-1.1-.9-2-2-2h-9v5zM3 8h5V3H5c-1.1 0-2 .9-2 2v3zm2 13h3V10H3v9c0 1.1.9 2 2 2zm8 1l-4-4l4-4zm1-9l4-4l4 4zm.58 6H13v-2h1.58c1.33 0 2.42-1.08 2.42-2.42V13h2v1.58c0 2.44-1.98 4.42-4.42 4.42z" fill="currentColor"/></svg>`;
  dependency = [];
  config = Config;
  chart: any = null;

  constructor() {
    super('piovt-sheet', '透视表', PivotSheetChart.icon);
    this.meta.requirements = [
      {
        group: [1, 999],
        aggregate: [1, 999],
      },
    ];
  }

  onMount(options, context): void {
    if (options.containerId === undefined || !context.document) {
      return;
    }
    const container = context?.document?.getElementById?.(options.containerId);
    const s2Options = {
      width: context.width,
      height: context.height,
    };
    this.chart = new PivotSheet(container, {} as any, s2Options);
  }

  onUpdated(options, context): void {
    this.chart.setOptions({
      width: context?.width,
      height: context?.height,
    });
    this.chart.setDataCfg(MockData);
    this.chart.render();
  }

  onUnMount(): void {
    this.chart?.destroy?.();
  }

  onResize(options, context) {
    this.chart.setOptions({
      width: context?.width,
      height: context?.height,
    });
    this.chart.render();
  }
}

export default PivotSheetChart;
