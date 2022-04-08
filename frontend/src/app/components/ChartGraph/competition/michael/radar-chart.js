/**
 * 自定义扩展雷达图
 * @param dHelper 构建参数
 * @returns 返回组件
 */

function RadarChart({ dHelper }) {
  return {
    // 组件配置，用于页面编辑时对组件进行设置
    config: {
      // 数据设置： 用于设置维度及指标配置等
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
          rows: [],
          type: 'aggregate',
          limit: [1, 999],
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
              options: {
                items: [
                  { label: '普通', value: 'plain' },
                  { label: '滚动', value: 'scroll' },
                ],
              },
            },
            {
              label: 'legend.selectAll',
              key: 'selectAll',
              default: true,
              comType: 'checkbox',
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
                color: 'black',
              },
            },
          ],
        },
      ],
      // 组件设置
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
    // 组件元数据：id，名称，图标，依赖等
    isISOContainer: 'radar-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'radar-chart',
      name: '基础雷达图',
      icon: 'radar',
      requirements: [
        {
          group: 1,
          aggregate: [1, 999],
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
      // console.log("Radar chart is updated. onUpdated props:", props);
      const newOptions = this.getOptions(props.dataset, props.config);
      this.chart?.setOption(Object.assign({}, newOptions), true);
    },

    onUnMount() {
      console.log('Radar chart disposed');
      this.chart && this.chart.dispose();
    },

    onResize(opt, context) {
      this.chart && this.chart.resize(context);
    },

    getDataObj(objDataColumns, dataConfigs) {
      let dataObj = {};
      let objDataColumnsDimensions = []; //维度
      let metricsNameList = []; //所有指标的名称（如SUM(amount)）
      let objDataColumnsMetrics = []; //指标
      for (let i = 0; i < objDataColumns.length; i++) {
        objDataColumnsDimensions.push(
          objDataColumns[i][dataConfigs[0].rows[0].colName],
        );
      }
      //指标可能有无数个，给所有指标都创建一个数组
      let aggColNames = [];
      for (let i = 0; i < dataConfigs[1].rows.length; i++) {
        let aggColName =
          dataConfigs[1].rows[i].aggregate +
          '(' +
          dataConfigs[1].rows[i].colName +
          ')';
        aggColNames.push(aggColName);
        if (dataConfigs[1].rows[i].alias) {
          metricsNameList.push(dataConfigs[1].rows[i].alias.name);
        } else {
          metricsNameList.push(aggColName);
        }
      }
      for (let i = 0; i < Object.keys(objDataColumns[0]).length - 1; i++) {
        const currentMetricsValues = [];
        for (let j = 0; j < objDataColumns.length; j++) {
          currentMetricsValues.push(objDataColumns[j][aggColNames[i]]);
        }
        objDataColumnsMetrics.push(currentMetricsValues);
      }
      dataObj = {
        dimensions: objDataColumnsDimensions,
        metrics: objDataColumnsMetrics,
        metricsNames: metricsNameList,
      };
      return dataObj;
    },

    getIndicatorList(
      objDataColumns,
      objDataColumnsDimensions,
      objDataColumnsMetrics,
    ) {
      let indicatorList = [];
      for (let i = 0; i < objDataColumns.length; i++) {
        let indicatorObj = {};
        indicatorObj = {
          name: objDataColumnsDimensions[i],
          max:
            Math.max.apply(null, objDataColumnsMetrics.join(',').split(',')) *
            1.1,
        };
        indicatorList.push(indicatorObj);
      }
      return indicatorList;
    },

    getDataList(metricsNameList, objDataColumnsMetrics) {
      let radarDataList = [];
      for (let i = 0; i < metricsNameList.length; i++) {
        radarDataList.push({
          value: objDataColumnsMetrics[i],
          name: metricsNameList[i],
          symbolSize: 3,
        });
      }
      return radarDataList;
    },

    getOptions(dataset, config) {
      const styleConfigs = config.styles;
      const dataConfigs = config.datas || [];
      // console.log("Radar chart getOptions - dataConfigs:", dataConfigs);
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);
      const objDataColumns = dHelper.transformToObjectArray(
        dataset.rows,
        dataset.columns,
      ); //数据存在objDataColumns里
      // console.log("Radar chart getOptions - objDataColumns:", objDataColumns);
      const dataColumns = objDataColumns;
      let dataObj = {};
      let indicatorList = [];
      let radarDataList = [];
      if (dataConfigs[0].rows.length == 0 || dataConfigs[1].rows.length == 0) {
        console.log('需要至少1个维度和1个指标！');
      } else {
        dataObj = this.getDataObj(objDataColumns, dataConfigs); //包含维度、指标数值、指标名字
        indicatorList = this.getIndicatorList(
          objDataColumns,
          dataObj.dimensions,
          dataObj.metrics,
        ); //雷达图顶点的数组
        radarDataList = this.getDataList(dataObj.metricsNames, dataObj.metrics); //用来画线
      }
      const yAxisColumns = aggregateConfigs.map((config, index) => {
        let nameTmp = dHelper.getColumnRenderName(config);
        return {
          name: nameTmp,
          type: index > 0 ? 'bar' : 'line',
          sampling: 'average',
          areaStyle: this.isArea ? {} : undefined,
          stack: this.isStack ? 'total' : undefined,
          data: dataColumns.map(dc => dc[dHelper.getValueByColumnKey(config)]),
          ...this.getLabelStyle(styleConfigs),
          ...this.getSeriesStyle(styleConfigs),
        };
      });

      let legendStyle = this.getLegendStyle(
        styleConfigs,
        yAxisColumns.map(col => col?.name) || [],
      );
      return {
        color: [
          '#08A3DB',
          '#0AA57E',
          '#F69320',
          '#08A3DB',
          '#099C7A',
          '#E38821',
        ],
        // legend: {
        //     data: dataObj.metricsNames,
        // },
        legend: legendStyle,
        tooltip: {},
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              // backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5],
            },
          },
          indicator: indicatorList,
          splitArea: {
            areaStyle: {
              color: [
                'rgba(11, 115, 175, 0)',
                'rgba(10, 176, 130, 0)',
                'rgba(9, 102, 156, 0)',
              ],
              // shadowColor: 'rgba(0, 0, 0, 0.2)',
              // shadowBlur: 10
            },
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(42, 68, 162, .5)',
            },
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(42, 68, 162, .5)',
            },
          },
        },
        series: [
          {
            type: 'radar',
            data: radarDataList,
            colorBy: 'data',
            lineStyle: {
              normal: {
                opacity: 0.5,
              },
            },
            areaStyle: [
              {
                // 单项区域填充样式
                normal: {
                  color: 'rgba(11, 115, 175, 0.3)', // 填充的颜色。[ default: "#000" ]
                },
              },
              {
                // 单项区域填充样式
                normal: {
                  color: 'rgba(11, 175, 131, 0.3)', // 填充的颜色。[ default: "#000" ]
                },
              },
              {
                // 单项区域填充样式
                normal: {
                  color: 'rgba(226, 136, 34, 0.4)', // 填充的颜色。[ default: "#000" ]
                },
              },
            ],
          },
        ],
      };
    },

    getLegendStyle(styles, seriesNames) {
      const show = dHelper.getStyleValueByGroup(styles, 'legend', 'showLegend');
      const type = dHelper.getStyleValueByGroup(styles, 'legend', 'type');
      const font = dHelper.getStyleValueByGroup(styles, 'legend', 'font');
      const legendPos = dHelper.getStyleValueByGroup(
        styles,
        'legend',
        'position',
      );
      const selectAll = dHelper.getStyleValueByGroup(
        styles,
        'legend',
        'selectAll',
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
      const selected = seriesNames.reduce(
        (obj, name) => ({
          ...obj,
          [name]: selectAll,
        }),
        {},
      );

      let datas = [];
      seriesNames?.forEach(name => {
        datas.push({ name: name });
      });

      return {
        ...positions,
        show,
        type,
        orient,
        selected,
        data: datas,
        textStyle: font,
        formatter: nameTmp => {
          return nameTmp;
        },
      };
    },

    getLabelStyle(styles) {
      const show = dHelper.getStyleValueByGroup(styles, 'label', 'showLabel');
      const position = dHelper.getStyleValueByGroup(
        styles,
        'label',
        'position',
      );
      const font = dHelper.getStyleValueByGroup(styles, 'label', 'font');
      return { label: { show, position, ...font } };
    },

    getSeriesStyle(styles) {
      const smooth = dHelper.getStyleValueByGroup(styles, 'graph', 'smooth');
      const step = dHelper.getStyleValueByGroup(styles, 'graph', 'step');
      return { smooth, step };
    },

    getStyleValueByGroup(styles, groupPath, childPath) {
      const childPaths = childPath.split('.');
      return this.getStyleValue(styles, [groupPath, ...childPaths]);
    },
  };
}

export default RadarChart;
