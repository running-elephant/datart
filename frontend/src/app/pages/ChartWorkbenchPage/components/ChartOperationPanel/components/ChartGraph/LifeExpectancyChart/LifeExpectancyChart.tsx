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
import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import { transfromToObjectArray } from 'app/utils/chartHelper';
import { init } from 'echarts';
import Config from './config';
import lifeData from './data.json';

class LifeExpectancyChart extends Chart {
  chart: any = null;
  config = Config;
  data: any = lifeData;

  constructor(props?) {
    super(
      props?.id || 'life-expectancy-chart',
      props?.name || '人均寿命演变图',
      props?.icon || 'scatter-chart',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: 0,
        aggregate: 0,
      },
    ];
  }

  onMount(options, context): void {
    if (options.containerId === undefined || !context.document) {
      return;
    }

    this.chart = init(
      context.document.getElementById(options.containerId),
      'default',
    );
  }

  onUpdated(props): void {
    if (!props.dataset || !props.dataset.columns || !props.config) {
      return;
    }
    if (!this.isMatchRequirement(props.config)) {
      this.chart?.clear();
      return;
    }
    const newOptions = this.getOptions(props.dataset, props.config);
    this.chart?.setOption(Object.assign({}, newOptions), true);
  }

  onUnMount(): void {
    this.chart?.dispose();
  }

  onResize(opt: any, context): void {
    this.chart?.resize(context);
  }

  getOptions(dataset: ChartDataset, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);
    const colorConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.COLOR)
      .flatMap(config => config.rows || []);

    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );

    var itemStyle = {
      opacity: 0.8,
    };

    var sizeFunction = function (x) {
      var y = Math.sqrt(x / 5e8) + 0.1;
      return y * 80;
    };
    // Schema:
    var schema = [
      { name: 'Income', index: 0, text: '人均收入', unit: '美元' },
      { name: 'LifeExpectancy', index: 1, text: '人均寿命', unit: '岁' },
      { name: 'Population', index: 2, text: '总人口', unit: '' },
      { name: 'Country', index: 3, text: '国家', unit: '' },
    ];

    const option: any = {
      baseOption: {
        timeline: {
          axisType: 'category',
          orient: 'vertical',
          autoPlay: true,
          inverse: true,
          playInterval: 1000,
          left: null,
          right: 0,
          top: 20,
          bottom: 20,
          width: 55,
          height: null,
          symbol: 'none',
          checkpointStyle: {
            borderWidth: 2,
          },
          controlStyle: {
            showNextBtn: false,
            showPrevBtn: false,
          },
          data: [],
        },
        title: [
          {
            text: this.data.timeline[0],
            textAlign: 'center',
            left: '63%',
            top: '55%',
            textStyle: {
              fontSize: 100,
            },
          },
          {
            text: '各国人均寿命与GDP关系演变',
            left: 'center',
            top: 10,
            textStyle: {
              fontWeight: 'normal',
              fontSize: 20,
            },
          },
        ],
        tooltip: {
          padding: 5,
          borderWidth: 1,
          formatter: function (obj) {
            var value = obj.value;
            return (
              schema[3].text +
              '：' +
              value[3] +
              '<br>' +
              schema[1].text +
              '：' +
              value[1] +
              schema[1].unit +
              '<br>' +
              schema[0].text +
              '：' +
              value[0] +
              schema[0].unit +
              '<br>' +
              schema[2].text +
              '：' +
              value[2] +
              '<br>'
            );
          },
        },
        grid: {
          top: 100,
          containLabel: true,
          left: 30,
          right: '110',
        },
        xAxis: {
          type: 'log',
          name: '人均收入',
          max: 100000,
          min: 300,
          nameGap: 25,
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: 18,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value} $',
          },
        },
        yAxis: {
          type: 'value',
          name: '平均寿命',
          max: 100,
          nameTextStyle: {
            fontSize: 18,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value} 岁',
          },
        },
        visualMap: [
          {
            show: false,
            dimension: 3,
            categories: this.data.counties,
            inRange: {
              color: (function () {
                var colors = [
                  '#51689b',
                  '#ce5c5c',
                  '#fbc357',
                  '#8fbf8f',
                  '#659d84',
                  '#fb8e6a',
                  '#c77288',
                  '#786090',
                  '#91c4c5',
                  '#6890ba',
                ];
                return colors.concat(colors);
              })(),
            },
          },
        ],
        series: [
          {
            type: 'scatter',
            itemStyle: itemStyle,
            data: this.data.series[0],
            symbolSize: function (val) {
              return sizeFunction(val[2]);
            },
          },
        ],
        animationDurationUpdate: 1000,
        animationEasingUpdate: 'quinticInOut',
      },
      options: [],
    };

    for (var n = 0; n < this.data.timeline.length; n++) {
      option.baseOption.timeline.data.push(this.data.timeline[n]);
      option.options.push({
        title: {
          show: true,
          text: this.data.timeline[n] + '',
        },
        series: {
          name: this.data.timeline[n],
          type: 'scatter',
          itemStyle: itemStyle,
          data: this.data.series[n],
          symbolSize: function (val) {
            return sizeFunction(val[2]);
          },
        },
      });
    }

    return option;
  }
}

export default LifeExpectancyChart;
