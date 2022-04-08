/**
 * 自定义扩展轮播条形图
 * @param dHelper 构建参数
 * @returns 返回组件
 */

function CarouselBarChart({ dHelper }) {
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
      ],
      styles: [
        // 柱条
        {
          label: 'bar.title',
          key: 'bar',
          comType: 'group',
          rows: [
            {
              label: 'bar.color',
              key: 'color',
              default: '#278FF5',
              comType: 'fontColor',
            },
            {
              label: 'common.borderStyle',
              key: 'borderStyle',
              comType: 'line',
              default: {
                type: 'solid',
                width: 0,
                color: '#ced4da',
              },
            },
            {
              label: 'bar.radius',
              key: 'radius',
              comType: 'inputNumber',
            },
            {
              label: 'bar.width',
              key: 'width',
              default: 10,
              comType: 'inputNumber',
            },
          ],
        },
        // 标签
        {
          label: 'label.title',
          key: 'label',
          comType: 'group',
          rows: [
            {
              label: 'font',
              key: 'font',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '24',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#495057',
              },
            },
          ],
        },
      ],
      settings: [], // TODO
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
    isISOContainer: 'carousel-bar-chart',
    dependency: ['https://lib.baomitu.com/echarts/5.0.2/echarts.min.js'],
    meta: {
      id: 'carousel-bar-chart',
      name: '轮播条形图',
      icon: 'fsux_tubiao_zhuzhuangtu',
      requirements: [
        {
          group: 1,
          aggregate: 1,
        },
      ],
    },

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
        if (this.chart.timeId) {
          clearInterval(this.chart.timeId);
        }
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
      const objDataColumns = dHelper.transformToObjectArray(
        props.dataset.rows,
        props.dataset.columns,
      );

      if (this.chart.timeId) {
        // 如果timeId已经存在，说明当前已有正在轮播的图表。把正在轮播的图表清除
        clearInterval(this.chart.timeId);
      }
      let newOptions = this.getOptions(props.dataset, props.config);
      let timeId = setInterval(() => {
        // 设置轮播，轮播速度为1200毫秒
        if (newOptions.dataZoom.endValue >= objDataColumns.length - 1) {
          newOptions.dataZoom.startValue = 0;
          newOptions.dataZoom.endValue = 4;
        } else {
          newOptions.dataZoom.startValue += 1;
          newOptions.dataZoom.endValue += 1;
        }
        this.chart?.setOption(Object.assign({}, newOptions), true);
      }, 1200);
      this.chart.timeId = timeId;
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
      const metricsTitle =
        dataConfigs[1].rows[0].aggregate +
        '(' +
        dataConfigs[1].rows[0].colName +
        ')';
      let dimensionList = [];
      let metricsList = [];
      let data = [];
      objDataColumns.forEach(record => {
        dimensionList.push(record[dimensionTitle]);
      });
      let maxValue = 0;
      objDataColumns.forEach(record => {
        let rowData = {}; // Datart通过读取rowData向点击事件的回调函数传参，series.data中必须有rowData这一属性
        rowData[dimensionTitle] = record[dimensionTitle];
        data.push({
          name: record[dimensionTitle],
          value: record[metricsTitle],
          rowData: rowData,
        });
        if (record[metricsTitle] > maxValue) maxValue = record[metricsTitle];
      });
      const compareObj = prop => {
        return (a, b) => {
          let v1 = a[prop];
          let v2 = b[prop];
          return v2 - v1;
        };
      };
      data.sort(compareObj('value'));

      let options = {
        animation: false,
        dataZoom: {
          show: false,
          yAxisIndex: [0],
          startValue: -1,
          endValue: 3,
          rangeMode: 'value',
        },
        xAxis: {
          type: 'value',
          show: false,
          min: 0,
          max: maxValue,
        },
        yAxis: {
          type: 'category',
          splitLine: {
            show: false,
          },
          data: dimensionList,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          inverse: true,
        },
        series: this.getBarStyles(styleConfigs, data),
      };
      return options;
    },

    getBarStyles(styles, data) {
      const borderStyle = dHelper.getStyleValueByGroup(
        styles,
        'bar',
        'borderStyle',
      );
      const borderRadius = dHelper.getStyleValueByGroup(
        styles,
        'bar',
        'radius',
      );
      const font = dHelper.getStyleValueByGroup(styles, 'label', 'font');
      const barWidth = dHelper.getStyleValueByGroup(styles, 'bar', 'width');
      const barColor = dHelper.getStyleValueByGroup(styles, 'bar', 'color');
      const positionY = 0 - barWidth * 3.2;
      return {
        type: 'bar',
        data: data,
        label: {
          show: true,
          formatter: params => {
            return `No.${params.dataIndex + 1}        ${params.name}`;
          },
          position: [5, positionY], // 标签位置
          textStyle: font,
        },
        endLabel: {
          show: true,
        },
        itemStyle: {
          color: barColor,
          borderRadius,
          borderType: borderStyle?.type,
          borderWidth: borderStyle?.width,
          borderColor: borderStyle?.color,
        },
        barWidth: barWidth,
      };
    },
  };
}

export default CarouselBarChart;
