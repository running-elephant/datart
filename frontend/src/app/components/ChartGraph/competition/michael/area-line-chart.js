/**
 * 自定义扩展折线区域图
 * @param dHelper 构建参数
 * @returns 返回组件
 */

function AreaLineChart({ dHelper }) {
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
          actions: {
            NUMERIC: ['aggregate', 'alias', 'format', 'colorRange'],
            STRING: ['aggregate', 'alias', 'format', 'colorRange'],
          },
          limit: 2,
        },
        {
          label: 'filter',
          key: 'filter',
          type: 'filter',
          allowSameField: true,
        },
      ],
      styles: [
        // X轴
        {
          label: 'xAxis.title',
          key: 'xAxis',
          comType: 'group',
          rows: [
            {
              label: 'common.showAxis',
              key: 'showAxis',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.inverseAxis',
              key: 'inverseAxis',
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'lineStyle',
              comType: 'line',
              default: {
                type: 'solid',
                width: 1,
                color: '#ced4da',
              },
            },
            {
              label: 'common.showLabel',
              key: 'showLabel',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'font',
              key: 'font',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '12',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#495057',
              },
            },
            {
              label: 'common.rotate',
              key: 'rotate',
              default: 45,
              comType: 'inputNumber',
            },
            {
              label: 'common.showInterval',
              key: 'showInterval',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'common.interval',
              key: 'interval',
              default: 0,
              comType: 'inputNumber',
            },
          ],
        },
        // Y轴
        {
          label: 'yAxis.title',
          key: 'yAxis',
          comType: 'group',
          rows: [
            {
              label: 'common.showAxis',
              key: 'showAxis',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.inverseAxis',
              key: 'inverseAxis',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'lineStyle',
              comType: 'line',
              default: {
                type: 'solid',
                width: 1,
                color: '#ced4da',
              },
            },
            {
              label: 'common.showLabel',
              key: 'showLabel',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'font',
              key: 'font',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '12',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#495057',
              },
            },
            {
              label: 'common.min',
              key: 'min',
              comType: 'inputNumber',
            },
            {
              label: 'common.max',
              key: 'max',
              comType: 'inputNumber',
            },
          ],
        },
        // 分割线
        {
          label: 'splitLine.title',
          key: 'splitLine',
          comType: 'group',
          rows: [
            {
              label: 'splitLine.showHorizonLine',
              key: 'showHorizonLine',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'horizonLineStyle',
              comType: 'line',
              default: {
                type: 'dashed',
                width: 1,
                color: '#ced4da',
              },
            },
            {
              label: 'splitLine.showVerticalLine',
              key: 'showVerticalLine',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'verticalLineStyle',
              comType: 'line',
              default: {
                type: 'dashed',
                width: 1,
                color: '#ced4da',
              },
            },
          ],
        },
        // 折线图
        {
          label: 'lineGraph.title',
          key: 'lineGraph',
          comType: 'group',
          rows: [
            {
              label: 'lineGraph.smooth',
              key: 'smooth',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'lineGraph.color',
              key: 'color',
              comType: 'font',
              default: {
                color: '#5470C6',
              },
            },
          ],
        },
        // 区域图
        {
          label: 'areaGraph.title',
          key: 'areaGraph',
          comType: 'group',
          rows: [
            {
              label: 'areaGraph.smooth',
              key: 'smooth',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'areaGraph.color',
              key: 'color',
              comType: 'font',
              default: {
                color: '#BCE9A6',
              },
            },
          ],
        },
        {
          label: 'dataZoom.title',
          key: 'dataZoom',
          comType: 'group',
          rows: [
            {
              label: 'dataZoom.enable',
              key: 'enable',
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
              showAxis: '显示坐标轴',
              inverseAxis: '反转坐标轴',
              lineStyle: '线条样式',
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
            lineGraph: {
              title: '折线图',
              smooth: '平滑',
              step: '阶梯',
              color: '颜色',
            },
            areaGraph: {
              title: '区域图',
              smooth: '平滑',
              step: '阶梯',
              color: '颜色',
            },
            xAxis: {
              title: 'X轴',
            },
            yAxis: {
              title: 'Y轴',
            },
            splitLine: {
              title: '分割线',
              showHorizonLine: '显示横向分割线',
              showVerticalLine: '显示纵向分割线',
            },
            reference: {
              title: '参考线',
              open: '点击参考线配置',
            },
            cache: {
              title: '数据处理',
            },
            dataZoom: {
              title: '动态效果',
              enable: '开启',
            },
          },
        },
      ],
    },
    isISOContainer: 'area-line-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'area-line-chart',
      name: '折线区域图',
      icon: 'chart',
      requirements: [
        {
          group: 1,
          aggregate: 2,
        },
      ],
    },

    onMount(options, context) {
      const styleConfigs = options.config.styles;
      const enableDataZoom = dHelper.getStyleValueByGroup(
        styleConfigs,
        'dataZoom',
        'enable',
      );
      if ('echarts' in context.window) {
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

        if (this.chart.timeId) {
          clearInterval(this.chart.timeId);
        }
      }
    },

    onUpdated(props) {
      const styleConfigs = props.config.styles;
      const enableDataZoom = dHelper.getStyleValueByGroup(
        styleConfigs,
        'dataZoom',
        'enable',
      );
      const objDataColumns = dHelper.transformToObjectArray(
        props.dataset.rows,
        props.dataset.columns,
      );
      if (!props.dataset || !props.dataset.columns || !props.config) {
        return;
      }
      if (!this.isMatchRequirement(props.config)) {
        this.chart?.clear();
        return;
      }

      if (enableDataZoom) {
        if (this.chart.timeId || !enableDataZoom) {
          // 如果timeId已经存在，说明当前已有正在轮播的图表。把正在轮播的图表清除
          clearInterval(this.chart.timeId);
        }
        let newOptions = this.getOptions(props.dataset, props.config);
        let timeId = setInterval(() => {
          // 设置轮播，轮播速度为1200毫秒
          if (newOptions.dataZoom.end >= 100) {
            clearInterval(this.chart.timeId);
          } else {
            newOptions.dataZoom.end += 5;
          }
          this.chart?.setOption(Object.assign({}, newOptions), true);
        }, 1200);
        this.chart.timeId = timeId;
      } else {
        if (this.chart.timeId) {
          clearInterval(this.chart.timeId);
        }
        const newOptions = this.getOptions(props.dataset, props.config);
        newOptions.dataZoom.disabled = true;
        this.chart?.setOption(Object.assign({}, newOptions), true);
      }
    },

    onUnMount() {
      if (this.chart.timeId) {
        clearInterval(this.chart.timeId);
      }
      this.chart && this.chart.dispose();
    },

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
      dataConfigs[1].rows.forEach(row => {
        metricsTitleList.push(row.aggregate + '(' + row.colName + ')');
      });

      let dimensionList = [];
      let lineMetricsList = [];
      let areaMetricsList = [];
      objDataColumns.forEach(record => {
        dimensionList.push(record[dimensionTitle]);
        lineMetricsList.push(record[metricsTitleList[0]]);
        areaMetricsList.push(record[metricsTitleList[1]]);
      });

      const lineColor = dHelper.getStyleValueByGroup(
        styleConfigs,
        'lineGraph',
        'color',
      );
      const areaColor = dHelper.getStyleValueByGroup(
        styleConfigs,
        'areaGraph',
        'color',
      );
      const lineSmooth = dHelper.getStyleValueByGroup(
        styleConfigs,
        'lineGraph',
        'smooth',
      );
      const areaSmooth = dHelper.getStyleValueByGroup(
        styleConfigs,
        'areaGraph',
        'smooth',
      );
      const enableDataZoom = dHelper.getStyleValueByGroup(
        styleConfigs,
        'dataZoom',
        'enable',
      );
      const dataZoom = enableDataZoom
        ? {
            disabled: false,
            show: false,
            yAxisIndex: [0],
            xAxisIndex: [0],
            start: 0,
            end: 10,
          }
        : {
            disabled: true,
            show: false,
          };

      let options = {
        dataZoom: dataZoom,
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {},
        xAxis: this.getXAxis(styleConfigs, dimensionList),
        yAxis: this.getYAxis(styleConfigs),
        series: [
          {
            name: metricsTitleList[0],
            type: 'line',
            data: lineMetricsList,
            itemStyle: {
              color: lineColor.color,
            },
            smooth: lineSmooth,
          },
          {
            name: metricsTitleList[1],
            type: 'line',
            data: areaMetricsList,
            itemStyle: {
              color: areaColor.color,
            },
            areaStyle: {
              color: areaColor.color,
            },
            smooth: areaSmooth,
          },
        ],
      };
      return options;
    },

    getXAxis(styles, data) {
      const showAxis = dHelper.getStyleValueByGroup(
        styles,
        'xAxis',
        'showAxis',
      );
      const inverse = dHelper.getStyleValueByGroup(
        styles,
        'xAxis',
        'inverseAxis',
      );
      const lineStyle = dHelper.getStyleValueByGroup(
        styles,
        'xAxis',
        'lineStyle',
      );
      const showLabel = dHelper.getStyleValueByGroup(
        styles,
        'xAxis',
        'showLabel',
      );
      const font = dHelper.getStyleValueByGroup(styles, 'xAxis', 'font');
      const rotate = dHelper.getStyleValueByGroup(styles, 'xAxis', 'rotate');
      const showInterval = dHelper.getStyleValueByGroup(
        styles,
        'xAxis',
        'showInterval',
      );
      const interval = dHelper.getStyleValueByGroup(
        styles,
        'xAxis',
        'interval',
      );
      const showVerticalLine = dHelper.getStyleValueByGroup(
        styles,
        'splitLine',
        'showVerticalLine',
      );
      const verticalLineStyle = dHelper.getStyleValueByGroup(
        styles,
        'splitLine',
        'verticalLineStyle',
      );

      return {
        type: 'category',
        data: data,
        inverse,
        axisLabel: {
          show: showLabel,
          rotate,
          interval: showInterval ? interval : 'auto',
          ...font,
        },
        axisLine: {
          show: showAxis,
          lineStyle,
        },
        axisTick: {
          show: showLabel,
          lineStyle,
        },
        splitLine: {
          show: showVerticalLine,
          lineStyle: verticalLineStyle,
        },
      };
    },

    getYAxis(styles) {
      const showAxis = dHelper.getStyleValueByGroup(
        styles,
        'yAxis',
        'showAxis',
      );
      const inverse = dHelper.getStyleValueByGroup(
        styles,
        'yAxis',
        'inverseAxis',
      );
      const lineStyle = dHelper.getStyleValueByGroup(
        styles,
        'yAxis',
        'lineStyle',
      );
      const showLabel = dHelper.getStyleValueByGroup(
        styles,
        'yAxis',
        'showLabel',
      );
      const font = dHelper.getStyleValueByGroup(styles, 'yAxis', 'font');
      const min = dHelper.getStyleValueByGroup(styles, 'yAxis', 'min');
      const max = dHelper.getStyleValueByGroup(styles, 'yAxis', 'max');
      const showHorizonLine = dHelper.getStyleValueByGroup(
        styles,
        'splitLine',
        'showHorizonLine',
      );
      const horizonLineStyle = dHelper.getStyleValueByGroup(
        styles,
        'splitLine',
        'horizonLineStyle',
      );

      return {
        type: 'value',
        inverse,
        min,
        max,
        axisLabel: {
          show: showLabel,
          ...font,
        },
        axisLine: {
          show: showAxis,
          lineStyle,
        },
        axisTick: {
          show: showLabel,
          lineStyle,
        },
        splitLine: {
          show: showHorizonLine,
          lineStyle: horizonLineStyle,
        },
      };
    },
  };
}

export default AreaLineChart;
