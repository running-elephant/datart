/**
 * 自定义扩展进度条
 * @param dHelper 构建参数
 * @returns 返回组件
 */

import { toPrecision } from 'app/utils/number';

function ProgressBar({ dHelper }) {
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
        {
          label: 'yAxis.title',
          key: 'yAxis',
          comType: 'group',
          rows: [
            {
              label: 'yAxis.showLabel',
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
          ],
        },
        {
          label: 'bar.title',
          key: 'bar',
          comType: 'group',
          rows: [
            {
              label: 'bar.upperColor',
              key: 'upperColor',
              default: 'rgb(101, 222, 248)',
              comType: 'fontColor',
            },
            {
              label: 'bar.lowerColor',
              key: 'lowerColor',
              default: 'rgb(31, 74, 98)',
              comType: 'fontColor',
            },
            {
              label: 'bar.shape',
              key: 'shape',
              default: 'roundRect',
              comType: 'select',
              options: {
                items: [
                  { label: '圆形', value: 'circle' },
                  { label: '方形', value: 'rect' },
                  { label: '圆角方形', value: 'roundRect' },
                  { label: '三角形', value: 'triangle' },
                  { label: '菱形', value: 'diamond' },
                  { label: '图钉', value: 'pin' },
                  { label: '箭头', value: 'arrow' },
                ],
              },
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
          ],
        },
      ],
      settings: [],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            yAxis: {
              title: 'Y轴',
              showLabel: '显示标签',
            },
            bar: {
              title: '条形图',
              upperColor: '上层块颜色',
              lowerColor: '下层块颜色',
              shape: '形状',
            },
          },
        },
      ],
    },
    isISOContainer: 'progress-bar',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'progress-bar',
      name: '进度条',
      icon: 'fsux_tubiao_baifenbiduijitiaoxingtu',
      requirements: [
        {
          group: 1,
          aggregate: 2,
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
      const objDataColumns = dHelper.transformToObjectArray(
        dataset.rows,
        dataset.columns,
      );

      const dimensionTitle = dataConfigs[0].rows[0].colName;
      const plannedMetricsTitle =
        dataConfigs[1].rows[0].aggregate +
        '(' +
        dataConfigs[1].rows[0].colName +
        ')';
      const actualMetricsTitle =
        dataConfigs[1].rows[1].aggregate +
        '(' +
        dataConfigs[1].rows[1].colName +
        ')';

      const dimensionList = objDataColumns.map(
        record => record[dimensionTitle],
      );

      let actualPercentageData = [];
      objDataColumns.forEach(record => {
        let rowData = {};
        rowData[dimensionTitle] = record[dimensionTitle];
        const plannedValue = record[plannedMetricsTitle];
        const actualValue = record[actualMetricsTitle];
        const percentage = toPrecision(
          (Math.abs(actualValue) / plannedValue) * 100,
          0,
        );
        actualPercentageData.push({
          name: record[dimensionTitle],
          rowData: rowData,
          actual: actualValue,
          total: plannedValue,
          value: percentage,
        });
      });

      let sumData = [];
      for (let i = 0; i < dimensionList.length; i++) {
        sumData.push(100);
      }

      const showYAxisLabel = dHelper.getStyleValueByGroup(
        styleConfigs,
        'yAxis',
        'showLabel',
      );
      const yAxisLabelfont = dHelper.getStyleValueByGroup(
        styleConfigs,
        'yAxis',
        'font',
      );
      const upperColor = dHelper.getStyleValueByGroup(
        styleConfigs,
        'bar',
        'upperColor',
      );
      const lowerColor = dHelper.getStyleValueByGroup(
        styleConfigs,
        'bar',
        'lowerColor',
      );
      const shape = dHelper.getStyleValueByGroup(styleConfigs, 'bar', 'shape');
      const barFont = dHelper.getStyleValueByGroup(styleConfigs, 'bar', 'font');

      let options = {
        grid: {
          left: '25%',
        },
        xAxis: {
          type: 'value',
          show: false,
        },
        yAxis: {
          type: 'category',
          data: actualPercentageData,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: showYAxisLabel,
            formatter: (value, index) => {
              return `计划数量：${actualPercentageData[index].total}`;
            },
            ...yAxisLabelfont,
          },
        },
        series: [
          {
            name: 'sum', // 下层块
            type: 'pictorialBar',
            symbol: shape,
            barWidth: '10%',
            barMaxWidth: 100,
            z: -1,
            symbolRepeat: true,
            symbolSize: [12, 32],
            data: sumData,
            barGap: 50,
            barCategoryGap: 0,
            animationEasing: 'elasticOut',
            itemStyle: {
              color: lowerColor,
            },
          },
          {
            name: 'percentage', // 上层块
            type: 'pictorialBar',
            symbol: shape,
            barWidth: '10%',
            barMaxWidth: 100,
            symbolRepeat: true,
            symbolSize: [12, 32],
            data: actualPercentageData,
            label: {
              show: true,
              formatter: params => {
                return `实际完成数量：${params.data.actual}`;
              },
              position: ['80%', 40],
              ...barFont,
            },
            itemStyle: {
              color: upperColor,
            },
          },
        ],
      };
      return options;
    },
  };
}

export default ProgressBar;
