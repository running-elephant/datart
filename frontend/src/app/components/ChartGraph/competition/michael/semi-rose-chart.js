/**
 * 自定义扩展半圆玫瑰图
 * @param dHelper 构建参数
 * @returns 返回组件
 */
import { ChartDataSectionType } from 'app/types/ChartConfig';
function SemiRoseChart({ dHelper }) {
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
            {
              label: 'label.position',
              key: 'position',
              comType: 'select',
              default: 'outside',
              options: {
                items: [
                  { label: '外侧', value: 'outside' },
                  { label: '内部', value: 'inside' },
                  { label: '中心', value: 'center' },
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
        {
          label: 'legend.title',
          key: 'legend',
          comType: 'group',
          rows: [
            {
              label: 'legend.showLegend',
              key: 'showLegend',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'legend.type',
              key: 'type',
              comType: 'select',
              default: 'scroll',
              options: {
                items: [
                  { label: '普通', value: 'plain' },
                  { label: '滚动', value: 'scroll' },
                ],
              },
            },
            {
              label: 'legend.position',
              key: 'position',
              comType: 'select',
              default: 'right',
              options: {
                items: [
                  { label: '右', value: 'right' },
                  { label: '上', value: 'top' },
                  { label: '下', value: 'bottom' },
                  { label: '左', value: 'left' },
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
            section: {
              legend: '图例',
              detail: '详细信息',
            },
            common: {
              showLabel: '显示标签',
              rotate: '旋转角度',
              position: '位置',
            },
            pie: {
              title: '饼图',
              circle: '环状',
              roseType: '南丁格尔玫瑰',
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
            reference: {
              title: '参考线',
              open: '点击参考线配置',
            },
            cache: {
              title: '数据处理',
            },
            tooltip: {
              title: '提示信息',
              showPercentage: '增加百分比显示',
            },
          },
        },
      ],
    },
    isISOContainer: 'semi-rose-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'semi-rose-chart',
      name: '半圆玫瑰图',
      icon: 'fsux_tubiao_nandingmeiguitu',
      requirements: [
        {
          group: 1,
          aggregate: 1,
        },
      ],
    },

    onMount(options, context) {
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

      const groupConfigs = dataConfigs
        .filter(c => c.type === ChartDataSectionType.GROUP)
        .flatMap(config => config.rows || []);
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);
      const objDataColumns = dHelper.transformToObjectArray(
        dataset.rows,
        dataset.columns,
      );
      const dimensionTitle = dataConfigs[0].rows[0].colName;
      const metricsTitle =
        dataConfigs[1].rows[0].aggregate +
        '(' +
        dataConfigs[1].rows[0].colName +
        ')';
      let data = [];
      objDataColumns.forEach(record => {
        let rowData = {}; // Datart通过读取rowData向点击事件的回调函数传参，series.data中必须有rowData这一属性
        rowData[dimensionTitle] = record[dimensionTitle];
        data.push({
          name: record[dimensionTitle],
          value: record[metricsTitle],
          rowData: rowData,
        });
      });
      const compareObj = prop => {
        return (a, b) => {
          let v1 = a[prop];
          let v2 = b[prop];
          return v1 - v2;
        };
      };
      data.sort(compareObj('value'));

      let dataAddedList = JSON.parse(JSON.stringify(data));
      const spanAngle = 180; // 需要显示的角度
      const repeatedMultiple = 360 / spanAngle;
      const dataToAddLen = parseInt((repeatedMultiple - 1) * data.length); // 根据要显示的角度，计算需要插入的数据量
      for (let i = 0; i < dataToAddLen; i++) {
        dataAddedList.push({
          name: null,
          value: 0,
          itemStyle: {
            color: 'rgba(0, 0, 0, 0)',
          },
          tooltip: {
            show: false,
          },
          label: {
            show: false,
          },
        });
      }

      let colorlist = [],
        newColor;
      groupConfigs[0].color.colors.forEach(color => {
        colorlist.push({
          key: color.key,
          value: color.value,
        });
      });

      let options = {
        tooltip: {
          show: true,
        },
        series: [
          {
            type: 'pie',
            roseType: 'area',
            data: dataAddedList,
            startAngle: 180,
            center: ['35%', '60%'],
            radius: [20, 220],
            // radius: ['10%', '95%'],
            label: this.getLabelStyles(styleConfigs),
            itemStyle: {
              color: function (params) {
                newColor = colorlist.find(color => color.key === params.name);
                return newColor && newColor.value;
              },
            },
            //   {
            //   color:function(params){
            //     let colorlist = [
            //       new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            //         {
            //           offset: 0,
            //           color: "#B10064",
            //         },
            //         {
            //           offset: 1,
            //           color: "#A1005B",
            //         },
            //       ]),
            //       new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            //         {
            //           offset: 0,
            //           color: "#F9451C",
            //         },
            //         {
            //           offset: 1,
            //           color: "#CB2800",
            //         },
            //       ]),
            //       new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            //         {
            //           offset: 0,
            //           color: "#E87400",
            //         },
            //         {
            //           offset: 1,
            //           color: "#FEA000",
            //         },
            //       ]),
            //       new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            //         {
            //           offset: 0,
            //           color: "#F5D416",
            //         },
            //         {
            //           offset: 1,
            //           color: "#BFA402",
            //         },
            //       ]),
            //       new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            //         {
            //           offset: 0,
            //           color: "#A2D02E",
            //         },
            //         {
            //           offset: 1,
            //           color: "#69A009",
            //         },
            //       ]),
            //       new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            //         {
            //           offset: 0,
            //           color: "#0AB383",
            //         },
            //         {
            //           offset: 1,
            //           color: "#028E71",
            //         },
            //       ]),
            //       new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            //         {
            //           offset: 0,
            //           color: "#0191C2",
            //         },
            //         {
            //           offset: 1,
            //           color: "#0CAEE6",
            //         },
            //       ]),
            //       new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            //         {
            //           offset: 0,
            //           color: "#00599B",
            //         },
            //         {
            //           offset: 1,
            //           color: "#1273C1",
            //         },
            //       ]),
            //     ]
            //     return colorlist[params.dataIndex];
            //   }
            // },
          },
        ],
        legend: this.getLegendStyles(styleConfigs, data),
      };
      return options;
    },

    getLabelStyles(styles) {
      const show = dHelper.getStyleValueByGroup(styles, 'label', 'showLabel');
      const position = dHelper.getStyleValueByGroup(
        styles,
        'label',
        'position',
      );
      const font = dHelper.getStyleValueByGroup(styles, 'label', 'font');
      return { show, position, ...font, formatter: '{d}%' };
    },

    getLegendStyles(styles, data) {
      const show = dHelper.getStyleValueByGroup(styles, 'legend', 'showLegend');
      const type = dHelper.getStyleValueByGroup(styles, 'legend', 'type');
      const font = dHelper.getStyleValueByGroup(styles, 'legend', 'font');
      const legendPos = dHelper.getStyleValueByGroup(
        styles,
        'legend',
        'position',
      );
      let positions = {};
      let orient = {};

      switch (legendPos) {
        case 'top':
          orient = 'horizontal';
          positions = { top: 8, left: 8, right: 8, height: 32 };
          break;
        case 'bottom':
          orient = 'horizontal';
          positions = { bottom: 8, left: 8, right: 8, height: 32 };
          break;
        case 'left':
          orient = 'vertical';
          positions = { left: 8, top: 16, bottom: 24, width: 96 };
          break;
        default:
          orient = 'vertical';
          positions = { right: 8, top: 16, bottom: 24, width: 96 };
          break;
      }

      const legendData = data.map(dataObj => {
        return dataObj.name;
      });

      return {
        ...positions,
        show,
        type,
        orient,
        textStyle: font,
        data: legendData,
        selectedMode: false,
      };
    },
  };
}

export default SemiRoseChart;
