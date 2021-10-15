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
import ChartConfig, {
  ChartDataSectionType,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import { transfromToObjectArray } from 'app/utils/chart';
import { init } from 'echarts';
import Config from './config';

class WaterfallChart extends Chart {
  dependency = ['https://lib.baomitu.com/echarts/5.0.2/echarts.min.js'];
  config = Config;
  chart: any = null;

  constructor(props?) {
    super(
      props?.id || 'waterfall-chart',
      props?.name || '瀑布图',
      props?.icon || 'chart-bar',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: [0, 999],
        aggregate: [0, 999],
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
    const option = {
      title: {
        text: '深圳月最低生活费组成（单位:元）',
        subtext: 'From ExcelHome',
        sublink: 'http://e.weibo.com/1341556070/AjQH99che',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function (params) {
          var tar = params[1];
          return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: ['总费用', '房租', '水电费', '交通费', '伙食费', '日用品数'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '辅助',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            barBorderColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0)',
          },
          emphasis: {
            itemStyle: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)',
            },
          },
          data: [0, 1700, 1400, 1200, 300, 0],
        },
        {
          name: '生活费',
          type: 'bar',
          stack: '总量',
          label: {
            show: true,
            position: 'inside',
          },
          data: [2900, 1200, 300, 200, 900, 300],
        },
      ],
    };
    // const newOptions = this.getOptions(props.dataset, props.config);
    this.chart?.setOption(Object.assign({}, option), true);
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

    return {};
  }
}

export default WaterfallChart;
