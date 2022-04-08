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

function ProductCustomThreeChart({ dHelper }) {
  const svgIcon = `<svg t="1648382327134" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3998" width="200" height="200"><path d="M864.757183 264.990257l-319.895751-191.573154c-10.116405-6.057973-21.48943-9.086959-32.861432-9.086959a63.915705 63.915705 0 0 0-32.861432 9.086959l-319.895751 191.573154a63.961754 63.961754 0 0 0-31.099298 54.873771v390.954133a63.960731 63.960731 0 0 0 31.980365 55.391565l319.895751 184.692442c9.894348 5.713119 20.937868 8.569166 31.980365 8.569166s22.086018-2.856048 31.980365-8.569166l319.895751-184.692442a63.959707 63.959707 0 0 0 31.980365-55.391565v-390.954133a63.959707 63.959707 0 0 0-31.099298-54.873771zM512 128.289851l288.778032 172.937725-289.062511 173.228343-288.603047-173.161828 288.887526-173.00424z m-319.895751 228.989322l287.621697 172.573427v347.022575L192.104249 710.817138V357.279173zM543.686676 877.214912V529.862833l288.209075-172.71669v353.670995L543.686676 877.214912z" p-id="3999"></path></svg>`;
  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
          limit: 1,
          actions: {
            NUMERIC: ['alias', 'colorize', 'sortable'],
            STRING: ['alias', 'colorize', 'sortable'],
          },
        },
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'aggregate',
          limit: 1,
        },
        {
          label: 'filter',
          key: 'filter',
          type: 'filter',
          allowSameField: true,
        },
      ],
      styles: [
        {
          label: 'map.setting',
          key: 'setting',
          comType: 'group',
          rows: [
            {
              label: 'map.title',
              key: 'title',
              comType: 'input',
              default: '库存情况',
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
            chartName: '[Experiment] 3D智能仓库',
            map: {
              setting: '设置',
              title: '标题',
            },
          },
        },
        {
          lang: 'en-US',
          translation: {
            chartName: '[Experiment] 3D智能仓库',
            map: {
              title: '标题',
            },
          },
        },
      ],
    },

    isISOContainer: 'product-three-pie-chart',
    dependency: [
      'https://ossbao.oss-cn-qingdao.aliyuncs.com/datart/three/dumplingbao.three.js',
    ],
    meta: {
      id: 'product-three-pie-chart',
      name: '手绘饼图',
      icon: svgIcon,
      requirements: [
        {
          group: 1,
          aggregate: 1,
        },
      ],
    },

    onMount(options, context) {
      if (!context.document) {
        return;
      }
      this.host = context.document.getElementById(options.containerId);
    },

    onUpdated(options, context) {
      if (!options.dataset || !options.dataset.columns || !options.config) {
        return;
      }
      if (!this.isMatchRequirement(options.config)) {
        this.chart?.clear();
        return;
      }
      this.div = context.document.createElement('canvas');
      const newOptions = this.getOptions(options.dataset, options.config);
      context.window.createSence(this.div, newOptions);
    },

    onUnMount() {},

    getOptions(dataset, config) {
      const styleConfigs = config.styles;
      const dataConfigs = config.datas || [];

      const groupConfigs = dataConfigs
        .filter(c => c.type === 'group')
        .flatMap(config => config.rows || []);
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);

      // 获取用户配置
      const title = dHelper.getValue(styleConfigs, ['setting', 'title']);

      const chartDataSet = dHelper.transformToDataSet(
        dataset.rows,
        dataset.columns,
        dataConfigs,
      );
      const data = chartDataSet.map(row => {
        return {
          value: row.getCell(aggregateConfigs[0]),
          name: row.getCell(groupConfigs[0]),
        };
      });
      let legendData = [];
      chartDataSet.map(row => {
        legendData.push(row.getCell(groupConfigs[0]));
      });
      return {
        title: {
          text: title,
          subtext: '',
          sublink: '#',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: legendData,
        },
        series: [
          {
            name: '类型',
            type: 'pie',
            radius: '55%',
            center: ['60%', '60%'],
            data: data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
    },
  };
}
