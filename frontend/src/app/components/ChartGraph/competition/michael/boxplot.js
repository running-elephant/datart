/**
 * 自定义扩展箱线图
 * @param dHelper 构建参数
 * @returns 返回组件
 */
import { ChartDataSectionType } from 'app/types/ChartConfig';

function Boxplot({ dHelper }) {
  return {
    config: {
      datas: [
        // 箱线图需要使用一组数据统计数据的分散情况，所以不能把字段拖进指标栏。指标栏会自动对该组数据进行聚合计算
        // 维度栏需要2个字段。第一个字段显示在X轴上。第二个字段为数据批。第二个字段依赖于第一个字段分组
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
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
    isISOContainer: 'boxplot',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'boxplot',
      name: '箱线图',
      icon: 'chart',
      requirements: [
        {
          group: 2,
        },
      ],
    },

    // 组件对象挂载时调用，可用于对组件进行初始化
    onMount(options, context) {
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
      const newOptions = this.getOptions(props.dataset, props.config);
      this.chart?.setOption(Object.assign({}, newOptions), true);
    },

    onUnMount() {
      this.chart && this.chart.dispose();
    },

    onResize(opt, context) {
      this.chart && this.chart.resize(context);
    },

    getOptions(dataset, config) {
      const styleConfigs = config.styles; // 用户自定义样式数据
      const dataConfigs = config.datas || [];
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);
      const groupConfigs = dataConfigs
        .filter(c => c.type === ChartDataSectionType.GROUP)
        .flatMap(config => config.rows || []);
      const objDataColumns = dHelper.transformToObjectArray(
        dataset.rows,
        dataset.columns,
      );

      const indicatorTitle = dataConfigs[0].rows[0].colName; // 维度栏中第一个字段的名称
      const dataTitle = dataConfigs[0].rows[1].colName; // 维度栏中第二个字段的名称
      let indicatorDataList = []; // e.g. [ { indicator1: [以indicator1分组的数据批] }, ... ]
      let xAxisList = []; // 包含所有indicator名称的数组
      objDataColumns.forEach(record => {
        let indicator = record[indicatorTitle];
        const currObj = new Object();
        currObj[indicator] = [];
        if (
          !JSON.stringify(indicatorDataList).includes(JSON.stringify(currObj))
        ) {
          indicatorDataList.push(currObj);
          xAxisList.push(indicator);
        }
      });
      indicatorDataList.forEach(indicator => {
        objDataColumns.forEach(record => {
          if (record[indicatorTitle] === Object.keys(indicator)[0]) {
            indicator[Object.keys(indicator)[0]].push(record[dataTitle]);
          }
        });
      });
      let dataList = indicatorDataList.map(data => {
        // 此二维数组中的每一个数组代表一个数据批
        return data[Object.keys(data)[0]];
      });
      const xAxisColumns = (groupConfigs || []).map(config => {
        return {
          type: 'category',
        };
      });
      const yAxisNames = aggregateConfigs.map(dHelper.getColumnRenderName);
      const axisInfo = {
        xAxis: this.getXAxis(styleConfigs, xAxisColumns),
        yAxis: this.getYAxis(styleConfigs, yAxisNames),
      };

      return {
        dataset: [
          // 使用transform进行数据转换，处理箱型图数据
          {
            source: dataList,
          },
          {
            transform: {
              type: 'boxplot',
              //boxplot数据转换生成2份数据：
              //result[0]：boxplot series需要的数据 (datasetIndex: 1)
              //result[1]：离群点数据 (datasetIndex: 2)
              //当其他dataset、series使用该数据集时，默认使用result[0]
              //若其他dataset想使用result[1]，需指定fromDatasetResult：1
              //若其他series想使用result[1]，需先创建一个使用result[1]的数据集，series再使用新建的数据集
              config: {
                // x轴标签
                itemNameFormatter: params => {
                  return xAxisList[params.value];
                },
              },
            },
          },
          {
            fromDatasetIndex: 1, //datasetIndex为2，使用datasetIndex: 1中的数据
            fromTransformResult: 1, //使用transform转换生成的result[1]
          },
        ],
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow',
          },
          formatter: params => {
            if (params.data[2] !== undefined) {
              return [
                params.name,
                '上边缘: ' + params.data[5],
                'Q3: ' + params.data[4],
                '中位数: ' + params.data[3],
                'Q1: ' + params.data[2],
                '下边缘: ' + params.data[1],
              ].join('<br/>');
            } else {
              return [params.name, '异常值: ' + params.data[1]].join('<br/>');
            }
          },
        },
        grid: {
          // 直角坐标系网格
          left: '10%',
          right: '10%',
          bottom: '15%',
        },
        xAxis: axisInfo.xAxis,
        yAxis: axisInfo.yAxis,
        series: [
          {
            name: 'boxplot', // 箱体数据
            type: 'boxplot',
            datasetIndex: 1, // 使用transform转换生成的result[0]
          },
          {
            name: 'outlier', // 离群点数据
            type: 'scatter',
            datasetIndex: 2, // 使用transform转换生成的result[1]
          },
        ],
      };
    },

    getYAxis(styles, yAxisNames) {
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

    getXAxis(styles, xAxisColumns) {
      const axisColumnInfo = xAxisColumns[0];
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
        ...axisColumnInfo,
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
  };
}

export default Boxplot;
