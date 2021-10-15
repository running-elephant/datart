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

class D3USMapChart extends Chart {
  constructor() {
    super('d3-us-map', 'D3JS 散点图', 'star');
  }

  isISOContainer = 'd3-chart-container';
  dependency = ['https://d3js.org/d3.v5.min.js'];
  config = Config;
  chart: any = null;

  onMount(options, context): void {
    const host = context.document.getElementById(options.containerId);
    var margin = { top: 10, right: 40, bottom: 30, left: 30 },
      width = 450 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    this.chart = context.window.d3
      .select(host)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Create data
    var data = [
      { x: 10, y: 20 },
      { x: 40, y: 90 },
      { x: 80, y: 50 },
    ];

    // X scale and Axis
    var x = context.window.d3
      .scaleLinear()
      .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
      .range([0, width]); // This is the corresponding value I want in Pixel
    this.chart
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(context.window.d3.axisBottom(x));

    // X scale and Axis
    var y = context.window.d3
      .scaleLinear()
      .domain([0, 100]) // This is the min and the max of the data: 0 to 100 if percentages
      .range([height, 0]); // This is the corresponding value I want in Pixel
    this.chart.append('g').call(context.window.d3.axisLeft(y));

    // Add 3 dots for 0, 50 and 100%
    this.chart
      .selectAll('whatever')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return x(d.x);
      })
      .attr('cy', function (d) {
        return y(d.y);
      })
      .attr('r', 7);
  }

  onUpdated({ config }: { config: any }): void {}

  onUnMount(): void {}
}

export default D3USMapChart;
