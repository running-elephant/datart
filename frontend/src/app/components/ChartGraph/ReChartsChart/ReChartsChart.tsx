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

import ReactChart from '../models/ReactChart';
import Config from './config';
import ReChartPie from './ReChartPie';

class ReChartsChart extends ReactChart {
  isISOContainer = 'react-rechart-chart';
  config = Config;
  dependency = [
    'https://unpkg.com/react/umd/react.production.min.js',
    'https://unpkg.com/react-dom/umd/react-dom.production.min.js',
    'https://unpkg.com/prop-types@15.6/prop-types.min.js',
    'https://unpkg.com/recharts@2.0.8/umd/Recharts.min.js',
  ];

  constructor() {
    super(ReChartPie, {
      id: 'rechart-chart',
      name: 'React ReChart Chart',
      icon: 'preview',
    });
  }

  onMount(options, context): void {
    const { Surface, Pie } = context.window.Recharts;
    this.adapter.registerImportDependenies({ Surface, Pie });
    this.adapter.mounted(context.document.getElementById(options.containerId));
  }

  onUpdated({ config }: { config: any }): void {}
}

export default ReChartsChart;
