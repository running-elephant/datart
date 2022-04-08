import baseZhuzhuangCharthelper from './baseZhuZhuangChartHelper';

/**
 * 自定义扩展极坐标柱状图
 * @param dHelper 构建参数
 * @returns 返回组件
 */
function CustomZhuzhuangChart({ dHelper }) {
  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
          limit: [2, 2],
          actions: {
            NUMERIC: ['alias', 'sortable', 'colorize'],
            STRING: ['alias', 'sortable', 'colorize'],
          },
        },
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'aggregate',
          limit: [1],
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
          label: 'label.toolbar',
          key: 'toolbarConfig',
          comType: 'group',
          rows: [
            {
              label: 'common.isShow',
              key: 'toolbarIsShow',
              comType: 'checkbox',
            },
          ],
        },
      ], // TODO
      settings: [],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            common: {
              prefixText: '前缀文字',
              suffixText: '后缀文字',
              bottomBodyText: '主体文字',
              buttomUpText: '上升文字',
              decreaseText: '下降文字',
              bottomText: '底部',
              image: '图片',
              positionX: '水平位置',
              positionY: '垂直位置',
              bodyText: '主体文字',
              body: '主体',
              background: '背景',
              width: '宽',
              height: '高',
              colName: '列名',
              upImage: '上升图片',
              decreaseImage: '下降图片',
              imgPosition: '图片位置',
              isShow: '显示',
            },
            label: {
              title: '标题',
              toolbar: '工具条',
              showLabel: '显示标签',
              position: '位置',
            },
            data: {
              color: '颜色',
              colorize: '配色',
            },
            stack: {
              title: '堆叠',
              enable: '开启',
              percentage: '百分比',
              enableTotal: '显示总计',
            },
            title: {
              title: '标题',
            },
          },
        },
      ],
    },
    isISOContainer: 'custom-zhuzhuang-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'custom-zhuzhuang-chart',
      name: '自定义多维柱状图',
      icon: 'fsux_tubiao_zhuzhuangtu1',
      requirements: [
        {
          group: 2,
          aggregate: [1],
        },
      ],
    },

    onMount(options, context) {
      this.globalContext = context;
      if ('echarts' in context.window) {
        // 组件对象初始化
        this.chart = context.window.echarts.init(
          context.document.getElementById(options.containerId),
          'default',
        );
        // 初始化多维分析图组件信息
        this.chartConfig = baseZhuzhuangCharthelper.initChart(this.chart);
        this._mouseEvents?.forEach(event => {
          // 图表点击事件
          let clickFunc = params => {
            if (event.callback) {
              event.callback(params);
            }
          };
          this.chart.on(event.name, clickFunc);
        });
      }
    },

    // 当前组件设置信息变更时调用
    onUpdated(props) {
      if (!props.dataset || !props.dataset.columns || !props.config) {
        return;
      }
      if (!this.isMatchRequirement(props.config)) {
        this.chart?.clear();
        return;
      }
      const newOptions = this.getOptions(props.dataset, props.config);
      this.chart?.setOption(Object.assign({}, newOptions), true);
    },

    // 卸载组件清理资源
    onUnMount() {
      this.chart && this.chart.dispose();
    },

    // 改变大小时触发
    onResize(opt, context) {
      this.chart && this.chart.resize(context);
    },
    // 获取配置选型信息
    getOptions(dataset, config) {
      return baseZhuzhuangCharthelper.getOptions(
        dataset,
        config,
        false,
        this.chartConfig.labelOption,
      );
    },
  };
}

export default CustomZhuzhuangChart;
