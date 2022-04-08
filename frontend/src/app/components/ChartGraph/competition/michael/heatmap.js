/**
 * 自定义扩展热力图
 * @param dHelper 构建参数
 * @returns 返回组件
 */
import { ChartDataSectionType } from 'app/types/ChartConfig';

function Heatmap({ dHelper }) {
  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
          limit: 2,
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
        // 标签
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
              default: 'center',
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
        // visualMap
        {
          label: 'visualMap.title',
          key: 'visualMap',
          comType: 'group',
          rows: [
            {
              label: 'visualMap.startColor',
              key: 'startColor',
              default: '#D0CCCD',
              comType: 'fontColor',
            },
            {
              label: 'visualMap.endColor',
              key: 'endColor',
              default: '#941E3D',
              comType: 'fontColor',
            },
            {
              label: 'visualMap.itemWidth',
              key: 'itemWidth',
              default: 20,
              comType: 'inputNumber',
            },
            {
              label: 'visualMap.itemHeight',
              key: 'itemHeight',
              default: 140,
              comType: 'inputNumber',
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
      settings: [], //TODO
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
    isISOContainer: 'heatmap',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'heatmap',
      name: '热力图',
      icon: 'chart',
      requirements: [
        {
          group: 2,
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
      const styleConfigs = config.styles;
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

      const xAxisDimensionTitle = dataConfigs[0].rows[0].colName; // X轴维度名称（维度栏第一个字段）
      const yAxisDimensionTitle = dataConfigs[0].rows[1].colName; // Y轴维度名称（维度栏第二个字段）
      const metricsTitle =
        dataConfigs[1].rows[0].aggregate +
        '(' +
        dataConfigs[1].rows[0].colName +
        ')'; // 指标名称

      let xAxisDimensionList = []; // X轴维度所有数据
      let yAxisDimensionList = []; // Y轴维度所有数据

      objDataColumns.forEach(record => {
        if (xAxisDimensionList.indexOf(record[xAxisDimensionTitle]) === -1) {
          xAxisDimensionList.push(record[xAxisDimensionTitle]);
        }
        if (yAxisDimensionList.indexOf(record[yAxisDimensionTitle]) === -1) {
          yAxisDimensionList.push(record[yAxisDimensionTitle]);
        }
      });

      const xLength = xAxisDimensionList.length;
      const yLength = yAxisDimensionList.length;

      let dataList = [];
      let maxValue = 0; // visualMap最大值
      // dataList格式为：[y轴, x轴, value]
      // e.g. 左下角第一个格子x=0, y=0, 假设value为5，dataList中数组为[0, 0, 5]
      // 从左往右数最底端第二个格子x=1, y=0 假设value为7，dataList中数组为[0, 1, 7]
      for (let y = 0; y < yLength; y++) {
        for (let x = 0; x < xLength; x++) {
          let value = 0;
          objDataColumns.forEach(record => {
            if (
              record[yAxisDimensionTitle] === yAxisDimensionList[y] &&
              record[xAxisDimensionTitle] === xAxisDimensionList[x]
            ) {
              value = record[metricsTitle];
              if (value > maxValue) maxValue = value;
            }
          });
          let currList = [y, x, value];
          dataList.push(currList);
        }
      }
      dataList = dataList.map(item => {
        return [item[1], item[0], item[2] || '-'];
      });

      const xAxisColumns = (groupConfigs || []).map(config => {
        return {
          type: 'category',
          data: xAxisDimensionList,
        };
      });
      const yAxisNames = aggregateConfigs.map(dHelper.getColumnRenderName);
      const axisInfo = {
        xAxis: this.getXAxis(styleConfigs, xAxisColumns),
        yAxis: this.getYAxis(styleConfigs, yAxisNames, yAxisDimensionList),
      };

      let options = {
        tooltip: {
          position: 'top',
        },
        animation: true,
        grid: {
          height: '50%',
          top: '10%',
        },
        xAxis: axisInfo.xAxis,
        yAxis: axisInfo.yAxis,
        visualMap: this.getVisualMap(maxValue, styleConfigs),
        series: [
          {
            type: 'heatmap',
            data: dataList,
            label: this.getLabelStyle(styleConfigs),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      return options;
    },

    getVisualMap(max, styles) {
      const itemWidth = dHelper.getStyleValueByGroup(
        styles,
        'visualMap',
        'itemWidth',
      );
      const itemHeight = dHelper.getStyleValueByGroup(
        styles,
        'visualMap',
        'itemHeight',
      );
      const font = dHelper.getStyleValueByGroup(styles, 'visualMap', 'font');
      const colors = this.getVisualMapColor(styles);
      return [
        {
          type: 'continuous',
          seriesIndex: 0,
          itemWidth,
          itemHeight,
          inRange: { color: colors },
          min: 0,
          max: max,
          textStyle: {
            ...font,
          },
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '5%',
        },
      ];
    },

    getVisualMapColor(styles) {
      const startColor = styles[3].rows[0].value;
      const endColor = styles[3].rows[1].value;
      return [startColor, endColor];
    },

    getLabelStyle(styles) {
      const show = dHelper.getStyleValueByGroup(styles, 'label', 'showLabel');
      const position = dHelper.getStyleValueByGroup(
        styles,
        'label',
        'position',
      );
      const font = dHelper.getStyleValueByGroup(styles, 'label', 'font');
      return {
        show,
        position,
        ...font,
        formatter: params => {
          return params.data[2];
        },
      };
    },

    getYAxis(styles, yAxisNames, yData) {
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
        type: 'category',
        data: yData,
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
export default Heatmap;
