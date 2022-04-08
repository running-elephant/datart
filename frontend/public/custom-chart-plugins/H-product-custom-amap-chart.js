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

function ProductCustomAmapChart({ dHelper }) {
  const svgIcon = `<svg t="1648129561857" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2214" width="200" height="200"><path d="M85.333333 469.717333C85.333333 451.829333 99.658667 437.333333 117.333333 437.333333s32 14.506667 32 32.384V786.133333c0 5.962667 4.778667 10.794667 10.666667 10.794667a10.56 10.56 0 0 0 5.045333-1.28l154.848-84.021333a73.898667 73.898667 0 0 1 72.853334 1.290666l252.544 148.842667a10.56 10.56 0 0 0 10.122666 0.341333l213.333334-107.264c3.626667-1.824 5.92-5.568 5.92-9.664V469.717333C874.666667 451.829333 888.992 437.333333 906.666667 437.333333s32 14.506667 32 32.384V745.173333c0 28.682667-16.053333 54.890667-41.44 67.658667l-213.333334 107.264a73.898667 73.898667 0 0 1-70.805333-2.378667L360.533333 768.896a10.56 10.56 0 0 0-10.410666-0.192l-154.848 84.032a73.973333 73.973333 0 0 1-35.285334 8.96c-41.237333 0-74.666667-33.813333-74.666666-75.552V469.717333z m672-132.266666c0 87.808-73.173333 192.917333-217.056 320.288a42.666667 42.666667 0 0 1-56.554666 0C339.829333 530.378667 266.666667 425.258667 266.666667 337.450667 266.666667 203.968 376.64 96 512 96s245.333333 107.968 245.333333 241.450667z m-426.666666 0c0 61.514667 59.712 149.557333 181.333333 259.701333 121.621333-110.144 181.333333-198.186667 181.333333-259.701333C693.333333 239.584 612.277333 160 512 160s-181.333333 79.573333-181.333333 177.450667zM512 405.333333a64 64 0 1 1 0-128 64 64 0 0 1 0 128z" p-id="2215"></path></svg>`;

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
              default: '空气质量',
            },
            {
              label: 'map.theme',
              key: 'theme',
              comType: 'select',
              default: 'normal',
              options: {
                translateItemLabel: true,
                items: [
                  { label: '@global@.bar.normal', value: 'normal' },
                  { label: '@global@.bar.dark', value: 'dark' },
                  { label: '@global@.bar.light', value: 'light' },
                  { label: '@global@.bar.whitesmoke', value: 'whitesmoke' },
                  { label: '@global@.bar.fresh', value: 'fresh' },
                  { label: '@global@.bar.grey', value: 'grey' },
                  { label: '@global@.bar.graffiti', value: 'graffiti' },
                  { label: '@global@.bar.macaron', value: 'macaron' },
                  { label: '@global@.bar.blue', value: 'blue' },
                  { label: '@global@.bar.darkblue', value: 'darkblue' },
                  { label: '@global@.bar.wine', value: 'wine' },
                ],
              },
            },
            {
              label: 'map.level',
              key: 'level',
              default: '4',
              comType: 'select',
              options: {
                translateItemLabel: true,
                items: [
                  { label: '@global@.bar.one', value: '1' },
                  { label: '@global@.bar.two', value: '2' },
                  { label: '@global@.bar.three', value: '3' },
                  { label: '@global@.bar.four', value: '4' },
                  { label: '@global@.bar.five', value: '5' },
                  { label: '@global@.bar.six', value: '6' },
                  { label: '@global@.bar.senven', value: '7' },
                  { label: '@global@.bar.eight', value: '8' },
                  { label: '@global@.bar.nine', value: '9' },
                  { label: '@global@.bar.ten', value: '10' },
                ],
              },
            },
            {
              label: 'map.effect',
              key: 'effect',
              default: 'effectScatter',
              comType: 'select',
              options: {
                translateItemLabel: true,
                items: [
                  { label: '@global@.bar.scatter', value: 'scatter' },
                  {
                    label: '@global@.bar.effectScatter',
                    value: 'effectScatter',
                  },
                  { label: '@global@.bar.heatmap', value: 'heatmap' },
                ],
              },
            },
          ],
        },
        {
          label: 'map.center',
          key: 'center',
          comType: 'group',
          rows: [
            {
              label: 'map.longitude',
              key: 'longitude',
              comType: 'inputNumber',
              default: '108.39',
            },
            {
              label: 'map.latitude',
              key: 'latitude',
              comType: 'inputNumber',
              default: '39.9',
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
            chartName: '[Experiment] 自定义地图',
            map: {
              setting: '地图',
              title: '标题',
              theme: '主题',
              level: '缩放级别',
              center: '中心坐标',
              longitude: '经度',
              latitude: '纬度',
              effect: '效果',
            },
            bar: {
              normal: '标准',
              dark: '幻影黑',
              light: '月光银',
              whitesmoke: '远山黛',
              fresh: '草色青',
              grey: '雅士灰',
              graffiti: '涂鸦',
              macaron: '马卡龙',
              blue: '靛青蓝',
              darkblue: '极夜蓝',
              wine: '酱籽',
              one: '1',
              two: '2',
              three: '3',
              four: '4',
              five: '5',
              six: '6',
              senven: '7',
              eight: '8',
              nine: '9',
              ten: '10',
              scatter: '气泡',
              effectScatter: '水波',
              raindrop: '雨滴',
              heatmap: '热力图',
            },
          },
        },
        {
          lang: 'en-US',
          translation: {
            chartName: '[Experiment] 自定义地图',
            map: {
              title: '标题',
              theme: 'theme',
              level: 'level',
              center: 'center',
              longitude: 'longitude',
              latitude: 'latitude',
              effect: 'effect',
            },
            bar: {
              normal: 'normal',
              dark: 'dark',
              light: 'light',
              whitesmoke: 'whitesmoke',
              fresh: 'fresh',
              grey: 'grey',
              graffiti: 'graffiti',
              macaron: 'macaron',
              blue: 'blue',
              darkblue: 'darkblue',
              wine: 'wine',
              one: 'one',
              two: 'two',
              three: 'three',
              four: 'four',
              five: 'five',
              six: 'six',
              senven: 'senven',
              eight: 'eight',
              nine: 'nine',
              ten: 'ten',
              scatter: 'scatter',
              effectScatter: 'effectScatter',
              raindrop: 'raindrop',
              heatmap: 'heatmap',
            },
          },
        },
      ],
    },
    isISOContainer: 'product-custom-amap-chart',
    dependency: [
      'https://webapi.amap.com/maps?v=2.0&key=267e448e75b9d85ca824d4aff8249ce8&plugin=AMap.Scale,AMap.ToolBar',
      'https://lib.baomitu.com/echarts/5.0.2/echarts.min.js',
      'https://cdn.jsdelivr.net/npm/echarts-extension-amap/dist/echarts-extension-amap.min.js',
    ],
    meta: {
      id: 'product-custom-amap-chart',
      name: 'chartName',
      icon: svgIcon,
      requirements: [
        {
          group: 3,
          aggregate: 1,
        },
      ],
    },

    onMount(options, context) {
      if ('echarts' in context.window) {
        this.chart = context.window.echarts.init(
          context.document.getElementById(options.containerId),
          'default',
        );
      }
    },

    onUpdated(props) {
      if (!props.dataset || !props.dataset.columns || !props.config) {
        return;
      }
      if (!this.isMatchRequirement(props.config)) {
        this.chart?.clear();
        return;
      }
      const newOptions = this.getOptions(props.dataset, props.config);
      this.chart.setOption(newOptions);
    },

    onUnMount() {
      this.chart && this.chart.dispose();
      this.chart?.setOption(Object.assign({}, {}), true);
    },

    onResize(opt, context) {
      this.chart && this.chart.resize(context);
    },

    getOptions(dataset, config) {
      // 当前服务端返回的数据集
      const dataConfigs = config.datas || [];

      // 获取样式配置信息
      const styleConfigs = config.styles;

      // 数据转换，根据Datart提供了Helper转换工具, 转换为ChartDataSet模型
      const chartDataSet = dHelper.transformToDataSet(
        dataset.rows,
        dataset.columns,
        dataConfigs,
      );

      // 获取用户配置
      const title = dHelper.getValue(styleConfigs, ['setting', 'title']);
      // 获取用户配置
      const theme = dHelper.getValue(styleConfigs, ['setting', 'theme']);
      // 获取用户配置
      const level = dHelper.getValue(styleConfigs, ['setting', 'level']);
      // 获取用户配置
      const effect = dHelper.getValue(styleConfigs, ['setting', 'effect']);
      // 获取用户配置
      const longitude = dHelper.getValue(styleConfigs, ['center', 'longitude']);
      // 获取用户配置
      const latitude = dHelper.getValue(styleConfigs, ['center', 'latitude']);

      const groupConfigs = dataConfigs
        .filter(c => c.type === 'group')
        .flatMap(config => config.rows || []);
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);

      let min = 0;
      let max = 0;
      let dataTree = [];
      chartDataSet.map(row => {
        const val = row.getCell(aggregateConfigs[0]);
        min = Math.min(min, val);
        max = Math.max(max, val);
        if (val !== '' && val !== null) {
          dataTree.push({
            name: row.getCell(groupConfigs[0]),
            value: [
              row.getCell(groupConfigs[1]),
              row.getCell(groupConfigs[2]),
              row.getCell(aggregateConfigs[0]),
            ],
          });
        }
      });

      this.newoption = {
        title: {
          text: title,
          subtext: '',
          sublink: '#',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
        },
        amap: {
          viewMode: '3D',
          // center: [108.39, 39.9],
          center: [Number.parseFloat(longitude), Number.parseFloat(latitude)],
          zoom: Number.parseFloat(level),
          resizeEnable: true,
          mapStyle: `amap://styles/${theme}`,
          renderOnMoving: true,
          echartsLayerZIndex: 2000,
          echartsLayerInteractive: true,
          largeMode: false,
        },
        visualMap: {
          show: true,
          right: 20,
          min: 0,
          max: 5,
          seriesIndex: 0,
          calculable: true,
          inRange: {
            color: ['blue', 'green', 'yellow', 'red'],
          },
        },
        series: [
          {
            name: title,
            type: effect,
            coordinateSystem: 'amap',
            data: dataTree,
            symbolSize: function (val) {
              return (
                (Math.max(min / 10, max / 100)
                  ? Math.ceil(val[2] / Math.max(min / 10, max / 100))
                  : val[2]) / 5
              );
            },
            encode: {
              value: 2,
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
            },
          },
          // {
          //   name: 'Top 5',
          //   type: 'effectScatter',
          //   coordinateSystem: 'amap',
          //   data: Object.keys(dataTree).map((key, index) => {
          //     const { lon, lat, value } = dataTree[key];
          //     return {
          //       name: key,
          //       value: [lon, lat, value],
          //     };
          //   }),
          //   symbolSize: function (val) {
          //     return val[2] / 2;
          //   },
          //   encode: {
          //     value: 2,
          //   },
          //   showEffectOn: 'render',
          //   rippleEffect: {
          //     brushType: 'stroke',
          //   },
          //   label: {
          //     formatter: '{b}',
          //     position: 'right',
          //     show: true,
          //   },
          //   itemStyle: {
          //     shadowBlur: 10,
          //     shadowColor: '#333',
          //   },
          //   emphasis: {
          //     scale: true,
          //   },
          //   zlevel: 1,
          // },
        ],
      };
      return this.newoption;
    },
  };
}
