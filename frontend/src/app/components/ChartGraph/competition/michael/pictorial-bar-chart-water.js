/**
 * 带背景色的柱状图
 * @param dHelper 构建参数
 * @returns 返回组件
 */

import { ChartDataSectionType } from 'app/types/ChartConfig';

function PictorialStackBarWater({ dHelper }) {
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
          limit: 1,
        },
        {
          label: 'filter',
          key: 'filter',
          type: 'filter',
          allowSameField: true,
        },
        {
          label: 'colorize',
          key: 'color',
          type: 'color',
          limit: [0, 1],
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
            // {
            //     label: 'bar.color',
            //     key: 'color',
            //     default: 'rgba(30, 46, 58, 1)',
            //     comType: 'fontColor',
            // },
          ],
        },
        {
          label: 'label.title',
          key: 'label',
          comType: 'group',
          rows: [
            {
              label: 'label.showLabel',
              key: 'showLabel',
              default: true,
              comType: 'checkbox',
            },
          ],
        },
        {
          label: 'xAxis.title',
          key: 'xAxis',
          comType: 'group',
          rows: [
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
              default: 0,
              comType: 'inputNumber',
            },
          ],
        },
      ],
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
              title: '柱状图',
              enable: '开启横向展示',
              radius: '边框圆角',
              width: '柱条宽度',
              gap: '柱间隙',
              color: '底柱颜色',
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
          },
        },
      ],
    },
    // isISOContainer: 'pictorial-bar-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'cluster-column-chart-bg',
      name: '带背景色的柱状图',
      icon: 'fsux_tubiao_zhuzhuangtu1',
      requirements: [
        {
          group: 1,
          aggregate: 1,
          color: [0, 1],
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
      const styleConfigs = config.styles; //样式
      const dataConfigs = config.datas || []; //数据
      const groupConfigs = dataConfigs
        .filter(c => c.type === ChartDataSectionType.GROUP)
        .flatMap(config => config.rows || []); //维度
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === ChartDataSectionType.AGGREGATE)
        .flatMap(config => config.rows || []); //指标
      const objDataColumns = dHelper.transformToObjectArray(
        dataset.rows, //维度的值
        dataset.columns, //指标的值
      );
      const dimensionTitle = dataConfigs[0].rows[0].colName;
      const metricsTitle =
        dataConfigs[1].rows[0].aggregate +
        '(' +
        dataConfigs[1].rows[0].colName +
        ')';
      // dimensionTitle 维度字段 metricsTitle指标
      let dimensionList = [],
        metricsList = [];
      objDataColumns.forEach(record => {
        dimensionList.push(record[dimensionTitle]);
        metricsList.push(record[metricsTitle]);
      });
      // x轴关联datart
      const barBgColor = dHelper.getStyleValueByGroup(
        styleConfigs,
        'bar',
        'color',
      );
      const showLabel = dHelper.getStyleValueByGroup(
        styleConfigs,
        'xAxis',
        'showLabel',
      );
      const barWidth = dHelper.getStyleValueByGroup(
        styleConfigs,
        'bar',
        'width',
      );
      const aggreColor = aggregateConfigs[0]?.color?.start;
      let colorizeTitle = undefined;
      if (dataConfigs[3].rows) {
        if (dataConfigs[3].rows.length !== 0) {
          colorizeTitle = dataConfigs[3].rows[0].colName;
        }
      }
      let options = {
        tooltip: {},
        xAxis: this.getXAxis(styleConfigs, dimensionList, barWidth),
        // xAxis: {
        //   type: 'category',
        //   axisLabel: {
        //     show: showLabel,
        //     rotate: 45,
        //     fontSize:32,
        //     color:'#000'
        //   },
        //   data:dimensionList
        // },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: metricsList,
            type: 'bar',
            barWidth: this.getBarWidth(styleConfigs),
            itemStyle: {
              normal: {
                color: aggreColor,
              },
            },
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
            label: this.getLabel(styleConfigs, colorizeTitle),
          },
        ],
      };
      return options;
    },

    getLabel(styles, colorizeTitle) {
      const showLabel = dHelper.getStyleValueByGroup(
        styles,
        'label',
        'showLabel',
      );
      return {
        show: showLabel,
        formatter: params => {
          // if (colorizeTitle === undefined) {
          //     return params.value;
          // } else {
          //     return params.value + '%';
          // }
          return params.value + '%';
        },
      };
    },

    getXAxis(styles, dimensionList, barWidth) {
      const showLabel = dHelper.getStyleValueByGroup(
        styles,
        'xAxis',
        'showLabel',
      );
      const font = dHelper.getStyleValueByGroup(styles, 'xAxis', 'font');
      const rotate = dHelper.getStyleValueByGroup(styles, 'xAxis', 'rotate');
      return {
        type: 'category',
        data: dimensionList,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: showLabel,
          margin: barWidth / 4 + 10,
          ...font,
          rotate,
        },
      };
    },

    getBarWidth(styles) {
      const barWidth = dHelper.getStyleValueByGroup(styles, 'bar', 'width');
      return barWidth;
    },
  };
}

export default PictorialStackBarWater;
