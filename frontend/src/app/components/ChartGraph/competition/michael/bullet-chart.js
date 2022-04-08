// /**
//  * 自定义扩展子弹图
//  * @param dHelper 构建参数
//  * @returns 返回组件
//  */

import { toFormattedValue } from 'app/utils/chartHelper';
import ChartConfigHelper from './chartConfigHelper';

// export default BulletChart;
function bulletChart({ dHelper }) {
  let GRAGH_HEIGHT = 300;
  let ctx = window;
  let initPosition = 0;
  var data = [];
  var dataCount = 35;
  var startTime = +new Date();
  var categories = [''];
  var types = [];
  const GAP = 1;

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
          limit: 3, // 3个指标按顺序分别为：实际、应达、目标
        },
        {
          label: 'filter',
          key: 'filter',
          type: 'filter',
          allowSameField: true,
        },
      ],
      styles: [
        // 实际柱条
        {
          label: 'actualBar.title',
          key: 'actualBar',
          comType: 'group',
          rows: [
            {
              label: 'actualBar.color',
              key: 'color',
              default: '#FF6911',
              comType: 'fontColor',
            },
            {
              label: 'common.icon',
              key: 'actualIcon',
              comType: 'input',
            },
          ],
        },
        // 目标柱条
        {
          label: 'goalBar.title',
          key: 'goalBar',
          comType: 'group',
          rows: [
            {
              label: 'goalBar.color',
              key: 'color',
              default: '#000000',
              comType: 'fontColor',
            },
          ],
        },
        // 应达标识
        {
          label: 'markLine.title',
          key: 'markLine',
          comType: 'group',
          rows: [
            {
              label: 'markLine.color',
              key: 'color',
              default: '#FFF007',
              comType: 'fontColor',
            },
            {
              label: 'common.icon',
              key: 'shouldIcon',
              comType: 'input',
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
              icon: '图标',
            },
            label: {
              title: '标签',
              showLabel: '显示标签',
              position: '位置',
            },
            bar: {
              title: '条形图',
              enable: '开启横向展示',
              radius: '边框圆角',
              width: '柱条宽度',
              gap: '柱间隙',
              color: '柱条颜色',
            },
            actualBar: {
              title: '实际柱条',
              color: '柱条颜色',
            },
            goalBar: {
              title: '目标柱条',
              color: '柱条颜色',
            },
            markLine: {
              title: '应达标识',
              color: '线条颜色',
            },
          },
        },
      ],
    },
    isISOContainer: 'bullet-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'bullet-chart',
      name: '子弹图',
      icon: 'chart',
      requirements: [
        {
          group: 1,
          aggregate: 3,
        },
      ],
    },
    onMount(options, context) {
      this.globalContext = context;
      ctx = context;
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
    onUpdated(props, context) {
      if (!props.dataset || !props.dataset.columns || !props.config) {
        return;
      }
      if (!this.isMatchRequirement(props.config)) {
        this.chart?.clear();
        return;
      }
      ctx = context;
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
    getValueByColumns(columns, name, values) {
      let index = columns.findIndex(item => item.name.includes(name));
      return values[index];
    },
    getValueByNameGroup(names, columns, rows) {
      return names.map(name => this.getValueByColumns(columns, name, rows));
    },
    getTitleStyle(color) {
      return {
        textStyle: {
          fontSize: 12,
          color,
        },
      };
    },
    getTitleByFormatValueGroup(formatValues) {
      let initTextStyle = [
        {
          text: `目标：`,
          top: '5%',
          left: '5%',
          ...this.getTitleStyle(),
        },
        {
          text: `实际：`,
          top: '5%',
          left: 'center',
          ...this.getTitleStyle(),
        },
        {
          text: `应达：`,
          top: '5%',
          right: '5%',
          ...this.getTitleStyle(),
        },
      ];
      return formatValues.map(
        (value, index) => initTextStyle[index].text + value,
      );
    },
    getOptions(dataset, config) {
      let self = this;
      dataset.columns.forEach(({ name }) =>
        types.push({ name, color: '#06EAD8' }),
      );

      let styles = ['goalBar', 'actualBar', 'markLine'];
      let stylesValue = styles.map(color =>
        dHelper.getStyleValueByGroup(config.styles, color, 'color'),
      );
      let names = ['目标', '实际', '应达'];
      let valueGroup = this.getValueByNameGroup(
        names,
        dataset.columns,
        dataset.rows[0],
      );

      let format = {
        numeric: {
          unitKey: 'wan',
        },
        type: 'numeric',
      };

      let [formatTargetValue, formatActualValue, formatValue] = valueGroup.map(
        value => toFormattedValue(value),
        format,
      );

      let rate = (valueGroup[1] / valueGroup[0]).toFixed(2);
      let SeriesData = this.getSeriesData(rate);

      // 获取标记位置索引等信息
      let iconInfo = this.getSeriesDataIconInfo(
        config,
        formatTargetValue,
        formatActualValue,
        formatValue,
      );

      let option = {
        tooltip: {
          formatter: function (params) {
            return params.marker + params.name + ': ' + params.value[3] + ' ms';
          },
        },
        title: [
          {
            text: `目标：${formatTargetValue}`,
            top: '5%',
            left: '5%',
            ...this.getTitleStyle(stylesValue[0]),
          },
          {
            text: `应达：${formatValue}`,
            top: '5%',
            left: 'center',
            ...this.getTitleStyle(stylesValue[2]),
          },
          {
            text: `实际：${formatActualValue}`,
            top: '5%',
            right: '5%',
            ...this.getTitleStyle(stylesValue[1]),
          },
        ],
        grid: {
          height: GRAGH_HEIGHT,
        },
        xAxis: {
          min: startTime,
          scale: true,
          axisLabel: {
            formatter: function (val) {
              return Math.max(0, val - startTime) + ' ms';
            },
          },
        },
        yAxis: {
          data: [],
          show: false,
        },
        series: [
          {
            type: 'custom',
            renderItem: (params, api) => {
              var categoryIndex = api.value(0);
              var start = api.coord([api.value(1), categoryIndex]);
              var end = api.coord([api.value(2), categoryIndex]);
              var height = api.size([0, 1])[1] * 3;
              if (initPosition === 0) {
                initPosition = start[0];
              }
              let { itemW } = this.getRenderItemCanvasW(api);
              var rectShape = ctx.window.echarts.graphic.clipRectByRect(
                {
                  x: initPosition + params.dataIndex * (GAP + itemW),
                  y: 60,
                  width: itemW,
                  height: height,
                },
                {
                  x: 0,
                  y: params.coordSys.y,
                  width: api.getWidth(),
                  height: api.getHeight(),
                },
              );
              let chartObj = rectShape && {
                type: 'rect',
                transition: ['shape'],
                shape: rectShape,
                style: api.style(),
              };
              // 有图标时同时返回图标
              if (
                iconInfo[params.dataIndex] &&
                iconInfo[params.dataIndex].image
              ) {
                let childrenComponents = [];
                childrenComponents.push({
                  type: 'image',
                  style: {
                    image: iconInfo[params.dataIndex].image,
                    y: 45,
                    x:
                      initPosition +
                      params.dataIndex * (GAP + itemW) +
                      (itemW - GAP) -
                      8,
                  },
                });
                if (rectShape) {
                  childrenComponents.push(chartObj);
                }
                return {
                  type: 'group',
                  children: childrenComponents,
                };
              } else {
                return chartObj;
              }
            },
            itemStyle: {
              opacity: 0.8,
            },
            data: SeriesData,
          },
        ],
      };
      return option;
    },
    getSeriesData(rate) {
      let data = [];
      categories.forEach((category, index) => {
        var baseTime = startTime;

        for (var i = 0; i < dataCount; i++) {
          var typeItem = types[Math.round(Math.random() * (types.length - 1))];
          let hasColorLength = Math.floor(dataCount * rate);
          let gredient = [
            a => `rgba(3, 74, 130, ${a})`,
            a => `rgba(6, 234, 216, ${a})`,
          ];
          let a = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
          let color =
            hasColorLength >= i + 1
              ? hasColorLength === i + 1
                ? 'rgba(6, 234, 216, 1)'
                : gredient[1](
                    a[Math.ceil((i + 1) / 3)] || 'rgba(6, 234, 216, 1)',
                  )
              : 'rgba(6, 96, 136, 0.5)';

          data.push({
            name: typeItem.name,
            itemStyle: {
              normal: {
                color,
              },
            },
          });

          baseTime += Math.round(Math.random() * 2000);
        }
      });
      return data;
    },
    getRenderItemCanvasW(api) {
      let width = api.getWidth() - 100;
      let itemW = Math.floor(width / dataCount);
      return { itemW, width };
    },
    getSeriesDataIconInfo(
      config,
      formatTargetValue,
      formatActualValue,
      formatValue,
    ) {
      let iconInfo = {};

      // 应达值在SeriesData中的索引值
      let shouldIndex = null;
      if (formatValue) {
        let shouldIcon = ChartConfigHelper.getConfigValue(
          'shouldIcon',
          config.styles,
        );
        // 应达值图标位置 = 应达值/目标值 * SeriesData显示长度
        shouldIndex = (formatValue / formatTargetValue) * dataCount - 1;
        iconInfo[shouldIndex] = {
          index: shouldIndex,
          image: shouldIcon,
        };
      }
      // 实际值在SeriesData结束索引
      let actualIndex = null;
      if (formatTargetValue) {
        let actualIcon = ChartConfigHelper.getConfigValue(
          'actualIcon',
          config.styles,
        );
        // 实际值图标位置 = 实际值/目标值 * SeriesData显示长度
        actualIndex = (formatActualValue / formatTargetValue) * dataCount - 1;
        iconInfo[actualIndex] = {
          index: actualIndex,
          image: actualIcon,
        };
      }
      return iconInfo;
    },
  };
}
export default bulletChart;
