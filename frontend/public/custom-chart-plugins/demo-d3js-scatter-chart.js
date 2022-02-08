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

function D3JSScatterChart({ dHelper }) {
  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
        },
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'aggregate',
        },
      ],
      styles: [
        {
          label: 'common.title',
          key: 'scatter',
          comType: 'group',
          rows: [
            {
              label: 'common.color',
              key: 'color',
              comType: 'fontColor',
            },
          ],
        },
      ],
      settings: [
        {
          label: 'viz.palette.setting.paging.title',
          key: 'paging',
          comType: 'group',
          rows: [
            {
              label: 'viz.palette.setting.paging.pageSize',
              key: 'pageSize',
              default: 1000,
              comType: 'inputNumber',
              options: {
                needRefresh: true,
                step: 1,
                min: 0,
              },
            },
          ],
        },
      ],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            chartName: '[Experiment] D3JS 散点图',
            common: {
              title: '散点图配置',
              color: '气泡颜色',
            },
          },
        },
        {
          lang: 'en',
          translation: {
            chartName: '[Experiment] D3JS Scatter Chart',
            common: {
              title: 'Scatter Setting',
              color: 'Bubble Color',
            },
          },
        },
      ],
    },

    isISOContainer: 'demo-d3js-scatter-chart',
    dependency: ['https://d3js.org/d3.v5.min.js'],
    meta: {
      id: 'demo-d3js-scatter-chart',
      name: 'chartName',
      icon: 'sandiantu',
      requirements: [
        {
          group: [0, 999],
          aggregate: 2,
        },
      ],
    },

    onMount(options, context) {
      if (!context.document) {
        return;
      }

      const host = context.document.getElementById(options.containerId);
      var margin = { top: 10, right: 40, bottom: 30, left: 30 },
        width = context.width - margin.left - margin.right,
        height = context.height - margin.top - margin.bottom;

      // 初始化D3JS绘图区域
      this.chart = context.window.d3
        .select(host)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    },

    onUpdated(options, context) {
      if (!options.dataset || !options.dataset.columns || !options.config) {
        return;
      }

      // 获取当前绘图区域的宽高
      const clientWidth = context.window.innerWidth;
      const clientHeight = context.window.innerHeight;
      const margin = { top: 40, right: 40, bottom: 40, left: 40 };
      const width = clientWidth - margin.left - margin.right;
      const height = clientHeight - margin.top - margin.bottom;

      // 获取散点图数据及配置
      const { data, style } = this.getOptions(options.dataset, options.config);

      // 绘制基于百分比的横纵坐标轴散点图, 以下是D3JS绘图逻辑
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
        .style('fill', style.color)
        .attr('r', 7);

      this.chart.selectAll('whatever').style('color', 'blue');
    },

    onUnMount() {},

    getOptions(dataset, config) {
      // 当前服务端返回的数据集
      const dataConfigs = config.datas || [];

      // 获取样式配置信息
      const styleConfigs = config.styles;

      // 获取指标类型配置信息
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);

      // 数据转换，根据Datart提供了Helper转换工具, 转换为ChartDataSet模型
      const chartDataSet = dHelper.transformToDataSet(
        dataset.rows,
        dataset.columns,
        dataConfigs,
      );

      const data = chartDataSet.map(row => {
        return {
          x: row.getCell(aggregateConfigs[0]),
          y: row.getCell(aggregateConfigs[1]),
        };
      });

      var xMinValue = Math.min(...data.map(o => o.x));
      var xMaxValue = Math.max(...data.map(o => o.y));

      var yMinValue = Math.min(...data.map(o => o.y));
      var yMaxValue = Math.max(...data.map(o => o.y));

      // 获取用户配置
      const color = dHelper.getValue(styleConfigs, ['scatter', 'color']);

      return {
        style: {
          color,
        },
        data: data.map(d => {
          return {
            x: ((d.x || xMinValue - xMinValue) * 100) / (xMaxValue - xMinValue),
            y: ((d.y || yMinValue - yMinValue) * 100) / (yMaxValue - yMinValue),
          };
        }),
      };
    },
  };
}
