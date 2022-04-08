function yScrollTable({ dHelper }) {
  const svgIcon = `<svg t="1648430390479" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19264" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css">
</style></defs><path d="M768 214.016l169.984 0 0 169.984-169.984 0 0-169.984zM768 809.984l0-169.984 169.984 0 0 169.984-169.984 0zM553.984 809.984l0-169.984 171.989333 0 0 169.984-171.989333 0zM342.016 809.984l0-169.984 169.984 0 0 169.984-169.984 0zM128 809.984l0-169.984 169.984 0 0 169.984-169.984 0zM768 598.016l0-171.989333 169.984 0 0 171.989333-169.984 0zM553.984 214.016l171.989333 0 0 169.984-171.989333 0 0-169.984zM342.016 384l0-169.984 169.984 0 0 169.984-169.984 0zM553.984 598.016l0-171.989333 171.989333 0 0 171.989333-171.989333 0zM342.016 598.016l0-171.989333 169.984 0 0 171.989333-169.984 0zM128 598.016l0-171.989333 169.984 0 0 171.989333-169.984 0zM128 384l0-169.984 169.984 0 0 169.984-169.984 0z" p-id="19265"></path></svg>`;

  return {
    config: {
      datas: [
        {
          label: 'mixed',
          key: 'mixed',
          required: true,
          type: 'mixed',
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
              label: 'config.showHeader',
              key: 'showHeader',
              default: true,
              comType: 'switch',
            },
            {
              label: 'config.headerBGC',
              key: 'headerBGC',
              default: 'blue',
              comType: 'fontColor',
            },
            {
              label: 'config.headerFont',
              key: 'headerFont',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '12',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#fff',
              },
            },

            {
              label: 'config.headerHeight',
              key: 'headerHeight',
              default: '35',
              comType: 'inputNumber',
            },

            {
              label: 'config.index',
              key: 'index',
              default: true,
              comType: 'switch',
            },
            {
              label: 'config.indexHeader',
              key: 'indexHeader',
              default: '#',
              comType: 'input',
            },
            {
              label: 'config.indexBGC',
              key: 'indexBGC',
              default: '#495057',
              comType: 'fontColor',
            },

            {
              label: 'config.carousel',
              key: 'carousel',
              default: 'single',
              comType: 'select',
              options: {
                items: [
                  { label: '行轮播', value: 'single' },
                  { label: '页轮播', value: 'page' },
                ],
              },
            },
            {
              label: 'config.waitTime',
              key: 'waitTime',
              default: '2000',
              comType: 'inputNumber',
            },

            {
              label: 'config.oddRowBGC',
              key: 'oddRowBGC',
              default: '#1976d2',
              comType: 'fontColor',
            },
            {
              label: 'config.evenRowBGC',
              key: 'evenRowBGC',
              default: '#0D47A1',
              comType: 'fontColor',
            },

            {
              label: 'config.bodyFont',
              key: 'boardFont',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '12',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#fff',
              },
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
            },
          ],
        },
      ],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            chartName: '滚动图表',
            title: '配置',
            config: {
              rowNum: '表行数',
              showHeader: '显示表头',

              carousel: '轮播方式',
              headerFont: '表头字体',
              bodyFont: '表体字体',
              waitTime: '轮播时间间隔(ms)',
              oddRowBGC: '奇数行背景色',
              evenRowBGC: '偶数行背景色',
              headerHeight: '表头高度',
              headerBGC: '表头背景色',
              index: '显示行号',
              indexHeader: '行号标题',
              indexBGC: '行号背景色',
            },
          },
        },
        {
          lang: 'en-US',
          translation: {
            chartName: 'scrollTable',
            title: 'Config',
            config: {
              rowNum: 'rowNum',
              showHeader: 'showHeader',

              carousel: 'carousel',
              headerFont: 'headerFont',
              bodyFont: 'bodyFont',
              waitTime: 'waitTime(ms)',
              oddRowBGC: 'oddRowBGC',
              evenRowBGC: 'evenRowBGC',
              headerHeight: 'headerHeight',
              headerBGC: 'headerBGC',
              index: 'show index',
              indexHeader: 'indexHeader',
              indexBGC: 'indexBGC',
            },
          },
        },
      ],
    },
    isISOContainer: 'yScrollTable',
    //
    dependency: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.14',
      'https://unpkg.com/@jiaminghi/data-view/dist/datav.map.vue.js',
    ],
    meta: {
      id: 'yScrollTable',
      name: '滚动排名柱状图',
      icon: svgIcon,
      requirements: [
        {
          group: [0, 999],
          aggregate: [0, 999],
        },
      ],
    },
    chartId: 'yScrollTable',
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
            chartConfig: {},
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
            <dv-scroll-board :key="zNumber" :config="chartConfig" style="margin:auto;width:100%;height:100%" />
        </div>
      `;
    },

    getChartStyle(styles) {
      const [
        rowNum,
        showHeader,
        headerBGC,
        headerHeight,
        oddRowBGC,
        evenRowBGC,
        waitTime,
        index,
        indexHeader,
        carousel,
        headerFont,
        boardFont,
      ] = dHelper.getStyles(
        styles,
        ['config'],
        [
          'rowNum',
          'showHeader',
          'headerBGC',
          'headerHeight',
          'oddRowBGC',
          'evenRowBGC',
          'waitTime',
          'index', //显示行号
          'indexHeader', //行号表头
          'carousel',
          'headerFont',
          'boardFont',
        ],
      );
      return {
        rowNum,
        showHeader,
        headerBGC,
        headerHeight,
        oddRowBGC,
        evenRowBGC,
        waitTime,
        index,
        indexHeader,
        carousel,
        headerFont,
        boardFont,
      };
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
    onUpdated(props, context) {
      if (!props.dataset || !props.dataset.columns || !props.config) {
        return;
      }

      const { dataset, config } = props;
      const chartDataSet = dHelper.transformToObjectArray(
        dataset.rows,
        dataset.columns,
        config.datas || [],
      );
      const headerData = this.getHeader(config);
      console.log('__ chartDataSet', chartDataSet);
      const dataValues = [];
      chartDataSet.forEach(item => {
        dataValues.push(Object.values(item));
      });

      const {
        rowNum,
        showHeader,
        headerBGC,
        headerHeight,
        oddRowBGC,
        evenRowBGC,
        waitTime,
        index,
        indexHeader,
        carousel,
        headerFont,
        boardFont,
      } = this.getChartStyle(config.styles);

      this.setStyle(context.document, headerFont, boardFont);
      // const dataValue = JSON.parse(JSON.stringify(dataset.rows));
      const chartConfig = {
        data: dataValues,
        // header: headerData,
        oddRowBGC,
        evenRowBGC,
        waitTime,
        index,
        indexHeader,
        rowNum,
        carousel,

        align: ['center'],
      };
      if (showHeader) {
        chartConfig.header = headerData;
        chartConfig.headerBGC = headerBGC;
        chartConfig.headerHeight = headerHeight;
      }
      // this.setStyle(context.document, barColor, fontColor);
      this.chart.$data.chartConfig = chartConfig;
    },
    getHeader(config) {
      const mixedColNames = (config.datas || [])
        .filter(c => c.type === 'mixed')
        .flatMap(config => config.rows || []);
      const headerData = mixedColNames.map(dHelper.getColumnRenderName);
      return headerData;
    },
    setStyle(document, headerFont, boardFont) {
      const styleId = 'scrollTableId';
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.setAttribute('id', styleId);
      let styleText = `
              .dv-scroll-board .header{
                 color:${headerFont.color};
                 font-family:${headerFont.fontFamily};
                  font-size:${headerFont.fontSize};
                  font-weight:${headerFont.fontWeight};
                  font-style:${headerFont.fontStyle};
              }
              .dv-scroll-board .row-item{
                color:${boardFont.color};
                 font-family:${boardFont.fontFamily};
                  font-size:${boardFont.fontSize};
                  font-weight:${boardFont.fontWeight};
                  font-style:${boardFont.fontStyle};
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
