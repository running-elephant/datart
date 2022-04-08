function scrollRankBar({ dHelper }) {
  const svgIcon = `<svg t="1648385551691" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4341" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css">
</style></defs><path d="M128 768h256v-85.333333H128v85.333333zM128 256v85.333333h768V256H128z m0 298.666667h512v-85.333334H128v85.333334z" p-id="4342"></path></svg>`;

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
              label: 'config.rowNum',
              key: 'rowNum',
              default: '10',
              comType: 'inputNumber',
            },
            {
              label: 'config.unit',
              key: 'unit',
              default: '',
              comType: 'input',
            },
            {
              label: 'config.waitTime',
              key: 'waitTime',
              default: '2000',
              comType: 'inputNumber',
            },
            {
              label: 'config.barColor',
              key: 'barColor',
              default: 'blue',
              comType: 'fontColor',
            },
            {
              label: 'config.fontColor',
              key: 'fontColor',
              default: '#000',
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
                barColor: '柱状颜色',
                fontColor: '字体颜色',
              },
            },
          ],
        },
      ],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            chartName: '滚动排名柱状图',
            title: '配置',
            config: {
              rowNum: '行数',
              unit: '单位',
              waitTime: '切换间隔时间',
              barColor: '柱状颜色',
              fontColor: '字体颜色',
            },
          },
        },
        {
          lang: 'en-US',
          translation: {
            chartName: 'scrollRankBarChart',
            title: 'Config',
            config: {
              rowNum: 'RowNum',
              unit: 'Unit',
              waitTime: 'WaitTime',
              barColor: 'barColor',
              fontColor: 'fontColor',
            },
          },
        },
      ],
    },
    isISOContainer: 'scrollRankBarChart',
    //
    dependency: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.14',
      'https://unpkg.com/@jiaminghi/data-view/dist/datav.map.vue.js',
    ],
    meta: {
      id: 'scrollRankBarChart',
      name: '滚动排名柱状图',
      icon: svgIcon,
      requirements: [
        {
          group: 1,
          aggregate: 1,
        },
      ],
    },
    chartId: 'scrollRankBarChart',
    timer: null,
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
            <dv-scroll-ranking-board :key="zNumber" :config="chartConfig" style="margin:auto;width:90%;height:99%" />
        </div>
      `;
    },

    getChartStyle(styles) {
      const [rowNum, unit, waitTime, barColor, fontColor] = dHelper.getStyles(
        styles,
        ['config'],
        ['rowNum', 'unit', 'waitTime', 'barColor', 'fontColor'],
      );
      return {
        rowNum,
        unit,
        waitTime,
        barColor,
        fontColor,
      };
    },
    onUpdated(props, context) {
      if (!props.dataset || !props.dataset.columns || !props.config) {
        return;
      }

      const { dataset, config } = props;
      const { rowNum, unit, waitTime, barColor, fontColor } =
        this.getChartStyle(config.styles);
      let dataValue = [];
      if (dataset.rows && dataset.rows[0] && dataset.rows[0][0]) {
        dataset.rows.forEach(row => {
          dataValue.push({ name: row[1], value: row[0] });
        });
      }

      const chartConfig = {
        data: dataValue,
        rowNum,
        unit,
        waitTime,
        // valueFormatter: (name, value, percent, ranking) => {},
      };
      this.setStyle(context.document, barColor, fontColor);
      this.chart.$data.chartConfig = chartConfig;
    },
    setStyle(document, barColor, fontColor) {
      const styleId = 'scrollRankBarId';
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.setAttribute('id', styleId);
      let styleText = `
              .dv-scroll-ranking-board{
                 color:${fontColor};
                //  font-size:30px;
              }
              .dv-scroll-ranking-board .ranking-info .rank{
                color:${barColor};
                //  font-size:30px;
              }
              .dv-scroll-ranking-board .ranking-info{
                // font-size:30px;
              }
              .dv-scroll-ranking-board .ranking-column {
                border-color:${barColor}
              }
              .dv-scroll-ranking-board .ranking-column .inside-column{
                background-color:${barColor}
              }
                
            `;
      try {
        style.appendChild(document.createTextNode(styleText));
      } catch (ex) {
        style.styleSheet.cssText = styleText;
      }
      let head = document.getElementsByTagName('head')[0];
      head.appendChild(style);
      //
      // var self = document.getElementById(styleId);
      // //获取需要删除节点的父节点
      // var parent = self.parentElement;
      // //进行删除操作
      // //var removed = parent.removeChild(self);
      // parent.removeChild(self);
    },
    onUnMount() {
      this.chart = null;
    },
    onResize(opt, context) {},
  };
}
