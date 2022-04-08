/**
 * 自定义扩展左右对比条形图
 * @param dHelper 构建参数
 * @returns 返回组件
 */
import { toFormattedValue } from 'app/utils/chartHelper';
function TwoDirectionBar({ dHelper }) {
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
        // 柱条
        {
          label: 'bar.title',
          key: 'bar',
          comType: 'group',
          rows: [
            {
              label: 'bar.leftColor',
              key: 'leftColor',
              default: '#1575D6',
              comType: 'fontColor',
            },
            {
              label: 'bar.rightColor',
              key: 'rightColor',
              default: '#74E085',
              comType: 'fontColor',
            },
            {
              label: 'bar.oppositeColor',
              key: 'oppositeColor',
              default: '#FF6520',
              comType: 'fontColor',
            },
            {
              label: 'bar.width',
              key: 'width',
              default: 20,
              comType: 'inputNumber',
            },
          ],
        },
        // 标签
        {
          label: 'yAxis.title',
          key: 'yAxis',
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
          ],
        },
        {
          label: 'xAxis.title',
          key: 'xAxis',
          comType: 'group',
          rows: [
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
              title: '条形图',
              enable: '开启横向展示',
              radius: '边框圆角',
              width: '柱条宽度',
              gap: '柱间隙',
              color: '柱条颜色',
              leftColor: '左柱条颜色',
              rightColor: '右柱条颜色',
              oppositeColor: '反向颜色',
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
    isISOContainer: 'two-direction-bar-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'two-direction-bar-chart',
      name: '左右对比条形图',
      icon: 'fsux_tubiao_zhuzhuangtu',
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
      const dataFormat = config.datas[1].rows;
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);
      const objDataColumns = dHelper.transformToObjectArray(
        dataset.rows,
        dataset.columns,
      );
      const dimensionTitle = dataConfigs[0].rows[0].colName;
      const leftMetricsTitle =
        dataConfigs[1].rows[0].aggregate +
        '(' +
        dataConfigs[1].rows[0].colName +
        ')';
      const rightMetricsTitle =
        dataConfigs[1].rows[1].aggregate +
        '(' +
        dataConfigs[1].rows[1].colName +
        ')';
      let dimensionList = [];
      let leftMetricsList = [];
      let rightMetricsList = [];
      let maxValue = 0;
      objDataColumns.forEach(record => {
        let rowData = {}; // Datart通过读取rowData向点击事件的回调函数传参，series.data中必须有rowData这一属性
        rowData[dimensionTitle] = record[dimensionTitle];
        if (record[leftMetricsTitle] > maxValue)
          maxValue = record[leftMetricsTitle];
        if (record[rightMetricsTitle] > maxValue)
          maxValue = record[rightMetricsTitle];
        dimensionList.push(record[dimensionTitle]);
        leftMetricsList.push(
          // record[leftMetricsTitle]
          {
            name: record[dimensionTitle],
            value: record[leftMetricsTitle],
            rowData: rowData,
          },
        );
        rightMetricsList.push(
          // record[rightMetricsTitle]
          {
            name: record[dimensionTitle],
            value: record[rightMetricsTitle],
            rowData: rowData,
          },
        );
      });
      maxValue = Math.ceil(maxValue);
      const leftBarData =
        this.getLeftBarStyle(leftMetricsList, styleConfigs, leftMetricsTitle) ||
        [];
      const rightBarData =
        this.getRightBarStyle(
          rightMetricsList,
          styleConfigs,
          rightMetricsTitle,
        ) || [];
      let options = {
        grid: [
          // 左
          {
            top: '0%',
            bottom: '2%',
            left: '1%',
            width: `35%`,
            containLabel: true,
          },
          // 中
          {
            top: '0%',
            bottom: '5%',
            left: '52%',
            width: `30%`,
          },
          // 右
          {
            top: '0%',
            bottom: '2%',
            right: '1%',
            width: `35%`,
            containLabel: true,
          },
        ],
        xAxis: [
          {
            gridIndex: 0,
            type: 'value',
            min: 0,
            max: maxValue,
            axisLabel: this.getXAxisLabel(styleConfigs, dataFormat[0]),
            inverse: true,
          },
          {
            gridIndex: 1,
            show: false,
            type: 'value',
            position: 'center',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          {
            gridIndex: 2,
            type: 'value',
            min: 0,
            max: maxValue,
            axisLabel: this.getXAxisLabel(styleConfigs, dataFormat[1]),
            inverse: false,
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            type: 'category',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            data: dimensionList,
          },
          {
            gridIndex: 1,
            type: 'category',
            axisLabel: this.getYAxisLabel(styleConfigs),
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            data: dimensionList,
          },
          {
            gridIndex: 2,
            type: 'category',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            data: dimensionList,
          },
        ],
        series: [leftBarData, rightBarData],
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow',
          },
          formatter: params => {
            let { componentIndex, dataIndex } = params;
            let leftDataFormat = dataFormat[0]?.format;
            let rightDataFormat = dataFormat[1].format;
            let leftValue = leftBarData.data[dataIndex]?.value;
            let rightValue = params.data.value;

            if (componentIndex === 1) {
              return (
                params.name +
                '<br/>' +
                leftMetricsTitle +
                ': ' +
                toFormattedValue(leftValue, leftDataFormat) +
                '<br/>' +
                params.seriesName +
                ': ' +
                toFormattedValue(rightValue, rightDataFormat)
              );
            } else {
              leftValue = params.data.value;
              rightValue = rightBarData.data[dataIndex]?.value;

              return (
                params.name +
                '<br/>' +
                leftMetricsTitle +
                ': ' +
                toFormattedValue(leftValue, leftDataFormat) +
                '<br/>' +
                params.seriesName +
                ': ' +
                toFormattedValue(rightValue, rightDataFormat)
              );
              // return (params.name + '<br/>' + rightMetricsTitle+ ': ' + rightBarData[dataIndex]?.value + '<br/>' +
              // params.seriesName + ': ' + params.data.value);
            }

            return (
              params.name +
              '<br/>' +
              params.seriesName +
              ': ' +
              params.data.value
            );
          },
        },
      };
      return options;
    },
    getLeftBarStyle(data, styles, leftMetricsTitle) {
      const barWidth = dHelper.getStyleValueByGroup(styles, 'bar', 'width');
      const color = dHelper.getStyleValueByGroup(styles, 'bar', 'leftColor');
      const oppositeColor = dHelper.getStyleValueByGroup(
        styles,
        'bar',
        'oppositeColor',
      );
      const dataClone = {};
      for (let key in data) {
        dataClone[key] = data[key].value; //克隆一份给颜色区分时用
        if (data[key].value < 0) {
          //负值转为正
          data[key].value = data[key].value * -1;
        }
      }
      return {
        xAxisIndex: 0,
        yAxisIndex: 0,
        name: leftMetricsTitle,
        type: 'bar',
        data: data,
        itemStyle: {
          color: function (params) {
            let currOriData = dataClone[params.dataIndex];
            return currOriData > 0 ? color : oppositeColor;
          },
          // color: color,
        },
        barWidth: barWidth,
        ...this.getLabelStyle(styles),
      };
    },
    getLabelStyle(styles) {
      return {
        label: {
          formatter: params => {
            const { value, data } = params;
            const formattedValue = toFormattedValue(value, data.format);
            const labels = [];
            labels.push(formattedValue);
            return labels.join('\n');
          },
        },
      };
    },

    getRightBarStyle(data, styles, rightMetricsTitle) {
      const barWidth = dHelper.getStyleValueByGroup(styles, 'bar', 'width');
      const color = dHelper.getStyleValueByGroup(styles, 'bar', 'rightColor');
      const oppositeColor = dHelper.getStyleValueByGroup(
        styles,
        'bar',
        'oppositeColor',
      );
      let dataClone = {};
      for (let key in data) {
        dataClone[key] = data[key].value; //克隆一份给颜色区分时用
        if (data[key].value < 0) {
          //负值转为正
          data[key].value = data[key].value * -1;
        }
      }
      return {
        xAxisIndex: 2,
        yAxisIndex: 2,
        name: rightMetricsTitle,
        type: 'bar',
        data: data,
        itemStyle: {
          color: function (params) {
            let currOriData = dataClone[params.dataIndex];
            return currOriData > 0 ? color : oppositeColor;
          },
        },
        barWidth: barWidth,
        // ...this.getLabelStyle(styles)
      };
    },

    getYAxisLabel(styles) {
      const font = dHelper.getStyleValueByGroup(styles, 'yAxis', 'font');
      return {
        align: 'center',
        ...font,
      };
    },

    getXAxisLabel(styles, data) {
      const font = dHelper.getStyleValueByGroup(styles, 'xAxis', 'font');
      const rotate = dHelper.getStyleValueByGroup(styles, 'xAxis', 'rotate');
      return {
        formatter: params => toFormattedValue(Math.abs(params), data.format),
        rotate,
        ...font,
      };
    },
  };
}

export default TwoDirectionBar;
