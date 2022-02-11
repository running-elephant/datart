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

import BasicBarChart from '../BasicBarChart';
import Config from './config';

class ClusterBarChart extends BasicBarChart {
  chart: any = null;
  config = Config;
  isHorizonDisplay = true;

  constructor() {
    super({
      id: 'cluster-bar-chart',
      name: 'viz.palette.graph.names.clusterBarChart',
      icon: 'fsux_tubiao_zhuzhuangtu',
    });
  }
}

export default ClusterBarChart;
