function waterLineChart({ dHelper }) {
  const svgIcon = `<svg t="1648299475796" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13327" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs></defs><path d="M512 128a384 384 0 1 0 384 384A384 384 0 0 0 512 128z m0 85.333333a298.666667 298.666667 0 0 1 295.253333 256h-142.293333L597.333333 536.96l-170.666666-170.666667L323.626667 469.333333h-106.666667A298.666667 298.666667 0 0 1 512 213.333333z m0 597.333334a298.666667 298.666667 0 0 1-295.253333-256h142.293333L426.666667 487.04l170.666666 170.666667L700.373333 554.666667h106.666667A298.666667 298.666667 0 0 1 512 810.666667z" p-id="13328"></path></svg>`;

  return {
    config: {
      datas: [
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'aggregate',
          actions: {
            NUMERIC: ['aggregate', 'alias', 'format', 'sortable'],
            STRING: ['aggregateLimit', 'alias', 'format', 'sortable'],
          },
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
          label: 'title',
          key: 'config',
          comType: 'group',
          rows: [
            {
              label: 'config.shape',
              key: 'shape',
              default: 'round',
              comType: 'select',
              options: {
                items: [
                  { label: 'round', value: 'round' },
                  { label: 'rect', value: 'rect' },
                  { label: 'roundRect', value: 'roundRect' },
                ],
              },
            },
            {
              label: 'config.colorL',
              key: 'colorL',
              default: 'green',
              comType: 'fontColor',
            },
            {
              label: 'config.colorM',
              key: 'colorM',
              default: '#00BAFF',
              comType: 'fontColor',
            },
            {
              label: 'config.colorS',
              key: 'colorS',
              default: 'red',
              comType: 'fontColor',
            },
            {
              label: 'config.largeNum',
              key: 'largeNum',
              default: '70',
              comType: 'inputNumber',
            },
            {
              label: 'config.smallNum',
              key: 'smallNum',
              default: '30',
              comType: 'inputNumber',
            },
            {
              label: 'config.formatter',
              key: 'formatter',
              default: '{value}%',
              comType: 'input',
            },
            {
              label: 'config.waveNum',
              key: 'waveNum',
              default: '2',
              comType: 'inputNumber',
            },
            {
              label: 'config.waveHeight',
              key: 'waveHeight',
              default: '40',
              comType: 'inputNumber',
            },
            {
              label: 'config.waveOpacity',
              key: 'waveOpacity',
              default: '0.5',
              comType: 'inputNumber',
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
            chartName: '水位图',
            title: '配置',
            config: {
              shape: '图形',
              largeNum: '较大值',
              smallNum: '较小值',
              colorL: '较大值颜色',
              colorM: '中间值颜色',
              colorS: '较小值颜色',
              waveNum: '波数',
              waveHeight: '波高',
              waveOpacity: '波透明度',
              formatter: '格式',
            },
          },
        },
        {
          lang: 'en-US',
          translation: {
            chartName: 'WaterLineChart',
            title: 'Config',
            config: {
              shape: 'Shape',
              largeNum: 'LargeNum',
              smallNum: 'SmallNum',
              colorL: 'LargeNumColor',
              colorM: 'MiddleNumColor',
              colorS: 'SmallNumColor',
              waveNum: 'WaveNum',
              waveHeight: 'WaveHeight',
              waveOpacity: 'WaveOpacity',
              formatter: 'Formatter',
            },
          },
        },
      ],
    },
    isISOContainer: 'waterLineChart',
    dependency: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.14',
      'https://unpkg.com/@jiaminghi/data-view/dist/datav.map.vue.js',
    ],
    meta: {
      id: 'waterLineChart',
      name: '水位图',
      icon: svgIcon,
      requirements: [
        {
          group: 0,
          aggregate: 1,
        },
      ],
    },
    chartId: 'waterLineChartId',

    onMount(options, context) {
      if ('Vue' in context.window) {
        context.document.getElementById(
          options.containerId,
        ).innerHTML = `<div id='${this.chartId}'></div>`;
        const Vue = context.window.Vue;
        this.chart = new Vue({
          el: `#${this.chartId}`,
          template: this.getTemplate(),
          data: {
            chartConfig: {
              data: [0],
              shape: 'round',
            },
            zNumber: +Date.now(),
          },
          methods: {},
          watch: {},
          mounted: function () {},
        });
      }
    },
    getTemplate() {
      return `
        <div style="width:100%;height:100%" :key="zNumber">
            <dv-water-level-pond :key="zNumber" :config="chartConfig" style="width:100%;height:99%" />
        </div>
      `;
    },

    getChartStyle(styles) {
      const [
        shape,
        largeNum,
        smallNum,
        colorL,
        colorM,
        colorS,
        waveNum,
        waveHeight,
        waveOpacity,
        formatter,
      ] = dHelper.getStyles(
        styles,
        ['config'],
        [
          'shape',
          'largeNum',
          'smallNum',
          'colorL',
          'colorM',
          'colorS',
          'waveNum',
          'waveHeight',
          'waveOpacity',
          'formatter',
        ],
      );

      return {
        shape,
        largeNum,
        smallNum,
        colorL,
        colorM,
        colorS,
        waveNum,
        waveHeight,
        waveOpacity,
        formatter,
      };
    },
    onUpdated(props) {
      if (!props.dataset || !props.dataset.columns || !props.config) {
        return;
      }
      const { dataset, config } = props;

      const {
        shape,
        largeNum,
        smallNum,
        colorL,
        colorM,
        colorS,
        waveNum,
        waveHeight,
        waveOpacity,
        formatter,
      } = this.getChartStyle(config.styles);
      let dataValue = 0;
      if (dataset.rows && dataset.rows[0] && dataset.rows[0][0]) {
        dataValue = dataset.rows[0][0];
      }
      let colors = [colorL, colorM];

      if (dataValue >= largeNum) {
        colors = [colorL, colorL];
      } else if (dataValue >= smallNum) {
        colors = [colorL, colorM];
      } else if (dataValue < smallNum) {
        colors = [colorS, colorS];
      }
      const chartConfig = {
        data: [dataValue],
        shape,
        colors,
        waveNum,
        waveHeight,
        waveOpacity,
        formatter,
      };
      this.chart.$data.chartConfig = chartConfig;
      this.chart.$data.zNumber = +Date.now();
    },

    onUnMount() {
      this.chart = null;
    },
    onResize(opt, context) {
      this.chart.$data.zNumber = +Date.now();
    },
  };
}
