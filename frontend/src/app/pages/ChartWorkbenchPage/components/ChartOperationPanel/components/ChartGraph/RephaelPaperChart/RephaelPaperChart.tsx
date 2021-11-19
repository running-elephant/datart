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

class RephaelPaperChart extends Chart {
  constructor() {
    super('raphael-paper', 'Raphael Paper Chart', 'chart-treemap');
  }

  isISOContainer = 'raphael-paper-chart';
  config = Config;
  dependency = [
    'https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js',
  ];
  chart: any = null;

  onMount(options, context): void {
    const ReactViz = context.window.ReactViz;
  }

  onUpdated({ config }: { config: any }): void {}

  onUnMount(): void {}
}

export default RephaelPaperChart;
