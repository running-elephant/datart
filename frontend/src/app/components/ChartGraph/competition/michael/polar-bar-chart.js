/**
 * 自定义扩展极坐标柱状图
 * @param dHelper 构建参数
 * @returns 返回组件
 */

function PolarBarChart({ dHelper }) {
  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
          limit: 1,
        },
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'aggregate',
          limit: [0, 999],
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
          label: 'bar.title',
          key: 'bar',
          comType: 'group',
          rows: [
            {
              label: 'bar.width',
              key: 'width',
              default: 20,
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'radiusAxis.title',
          key: 'radiusAxis',
          comType: 'group',
          rows: [
            {
              label: 'font',
              key: 'font',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '14',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#495057',
              },
            },
            {
              label: 'common.showAxis',
              key: 'showAxis',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.showLabel',
              key: 'showLabel',
              default: true,
              comType: 'checkbox',
            },
          ],
        },
        {
          label: 'angleAxis.title',
          key: 'angleAxis',
          comType: 'group',
          rows: [
            {
              label: 'common.showAxis',
              key: 'showAxis',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.showLabel',
              key: 'showLabel',
              default: true,
              comType: 'checkbox',
            },
          ],
        },
        {
          label: 'splitLine.title',
          key: 'splitLine',
          comType: 'group',
          rows: [
            {
              label: 'splitLine.showRadiusLine',
              key: 'showRadiusLine',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'radiusLineStyle',
              comType: 'line',
              default: {
                type: 'dashed',
                width: 1,
                color: '#ced4da',
              },
            },
            {
              label: 'splitLine.showAngleLine',
              key: 'showAngleLine',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'angleLineStyle',
              comType: 'line',
              default: {
                type: 'dashed',
                width: 1,
                color: '#ced4da',
              },
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
              showAxis: '显示坐标轴',
              inverseAxis: '反转坐标轴',
              lineStyle: '线条样式',
              borderStyle: '边框样式',
              borderType: '边框线条类型',
              borderWidth: '边框线条宽度',
              borderColor: '边框线条颜色',
              backgroundColor: '背景颜色',
              showLabel: '显示标签',
              unitFont: '刻度字体',
              rotate: '旋转角度',
              position: '位置',
              showInterval: '显示刻度',
              interval: '刻度间隔',
              showTitleAndUnit: '显示标题和刻度',
              nameLocation: '标题位置',
              nameRotate: '标题旋转',
              nameGap: '标题与轴线距离',
              min: '最小值',
              max: '最大值',
            },
            label: {
              title: '标签',
              showLabel: '显示标签',
              position: '位置',
            },
            legend: {
              title: '图例',
              showLegend: '显示图例',
              type: '图例类型',
              selectAll: '图例全选',
              position: '图例位置',
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
            bar: {
              title: '条形图',
              enable: '开启横向展示',
              radius: '边框圆角',
              width: '柱条宽度',
              gap: '柱间隙',
              color: '柱条颜色',
            },
            radiusAxis: {
              title: '径向轴',
            },
            angleAxis: {
              title: '角度轴',
            },
            splitLine: {
              title: '分割线',
              showRadiusLine: '显示径向轴分割线',
              showAngleLine: '显示角度轴分割线',
            },
            reference: {
              title: '参考线',
              open: '点击参考线配置',
            },
            cache: {
              title: '数据处理',
            },
          },
        },
      ],
    },
    isISOContainer: 'polar-bar-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'polar-bar-chart',
      name: '极坐标条形图',
      icon: 'chart',
      requirements: [
        {
          group: 1,
          aggregate: [0, 999],
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

    getOptions(dataset, config) {
      const styleConfigs = config.styles;
      const dataConfigs = config.datas || [];
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);
      const objDataColumns = dHelper.transformToObjectArray(
        dataset.rows,
        dataset.columns,
      );
      const dimensionTitle = dataConfigs[0].rows[0].colName;
      let metricsTitleList = [];
      dataConfigs[1].rows.forEach(metricsObj => {
        metricsTitleList.push(
          metricsObj.aggregate + '(' + metricsObj.colName + ')',
        );
      });
      let dimensionList = [];
      objDataColumns.forEach(record => {
        dimensionList.push(record[dimensionTitle]);
      });
      let metricsListObj = {};
      metricsTitleList.forEach(metricsTitle => {
        metricsListObj[metricsTitle] = [];
      });
      let maxValue = 0;
      metricsTitleList.forEach(metricsTitle => {
        objDataColumns.forEach(record => {
          let rowData = {}; // Datart通过读取rowData向点击事件的回调函数传参，series.data中必须有rowData这一属性
          rowData[dimensionTitle] = record[dimensionTitle];
          metricsListObj[metricsTitle].push({
            name: record[dimensionTitle],
            value: record[metricsTitle],
            rowData: rowData,
          });
          if (record[metricsTitle] > maxValue) maxValue = record[metricsTitle];
        });
      });
      let seriesList = [];
      metricsTitleList.forEach(metricsTitle => {
        seriesList.push({
          name: metricsTitle,
          type: 'bar',
          data: metricsListObj[metricsTitle],
          coordinateSystem: 'polar',
          barWidth: this.getBarWidth(styleConfigs),
        });
      });
      let options = {
        polar: {
          radius: [30, '90%'], // [内半径, 外半径]
        },
        radiusAxis: this.getRadiusAxis(dimensionList, styleConfigs), // 径向轴
        angleAxis: this.getAngleAxis(maxValue, styleConfigs), // 角度轴
        tooltip: {},
        series: seriesList,
      };
      return options;
    },

    getBarWidth(styles) {
      const barWidth = dHelper.getStyleValueByGroup(styles, 'bar', 'width');
      return barWidth;
    },

    getRadiusAxis(data, styles) {
      const font = dHelper.getStyleValueByGroup(styles, 'radiusAxis', 'font');
      const showAxis = dHelper.getStyleValueByGroup(
        styles,
        'radiusAxis',
        'showAxis',
      );
      const showLabel = dHelper.getStyleValueByGroup(
        styles,
        'radiusAxis',
        'showLabel',
      );
      return {
        type: 'category',
        data: data,
        axisLabel: {
          show: showLabel,
          interval: 0,
          ...font,
        },
        axisTick: {
          show: false,
        },
        splitLine: this.getRadiusSplitLine(styles),
        axisLine: {
          show: showAxis,
        },
      };
    },

    getRadiusSplitLine(styles) {
      const showSplitLine = dHelper.getStyleValueByGroup(
        styles,
        'splitLine',
        'showRadiusLine',
      );
      const lineStyle = dHelper.getStyleValueByGroup(
        styles,
        'splitLine',
        'radiusLineStyle',
      );
      return {
        show: showSplitLine,
        lineStyle: lineStyle,
      };
    },

    getAngleAxis(max, styles) {
      const showAxis = dHelper.getStyleValueByGroup(
        styles,
        'angleAxis',
        'showAxis',
      );
      const showLabel = dHelper.getStyleValueByGroup(
        styles,
        'angleAxis',
        'showLabel',
      );
      return {
        max: max + Math.round(max / 20),
        startAngle: 90,
        axisLine: {
          show: showAxis,
        },
        axisTick: {
          show: false,
        },
        splitLine: this.getAngleSplitLine(styles),
        axisLabel: {
          show: showLabel,
        },
      };
    },

    getAngleSplitLine(styles) {
      const showSplitLine = dHelper.getStyleValueByGroup(
        styles,
        'splitLine',
        'showAngleLine',
      );
      const lineStyle = dHelper.getStyleValueByGroup(
        styles,
        'splitLine',
        'angleLineStyle',
      );
      return {
        show: showSplitLine,
        lineStyle: lineStyle,
      };
    },
  };
}

export default PolarBarChart;
