/**
 * 自定义扩展水球图
 * @param dHelper 构建参数
 * @returns 返回组件
 */

import { init } from 'echarts';
import 'echarts-liquidfill';
import ChartConfigHelper from './chartConfigHelper';

function LiquidFillChart({ dHelper }) {
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
        {
          label: 'liquidfill.title',
          key: 'liquidfill',
          comType: 'group',
          rows: [
            {
              label: 'liquidfill.animation',
              key: 'animation',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'liquidfill.amplitude',
              key: 'amplitude',
              default: 40,
              comType: 'inputNumber',
            },
            {
              label: 'common.fontSize',
              key: 'bodyFontSize',
              default: 0.034,
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'background.title',
          key: 'background',
          comType: 'group',
          rows: [
            {
              label: 'background.color',
              key: 'color',
              default: '#ffffff',
              comType: 'fontColor',
            },
            {
              label: 'background.borderWidth',
              key: 'borderWidth',
              default: 0,
              comType: 'inputNumber',
            },
            {
              label: 'background.borderColor',
              key: 'borderColor',
              default: '#ffffff',
              comType: 'fontColor',
            },
          ],
        },
        {
          label: 'outline.title',
          key: 'outline',
          comType: 'group',
          rows: [
            {
              label: 'outline.show',
              key: 'show',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'outline.borderDistance',
              key: 'borderDistance',
              default: 0,
              comType: 'inputNumber',
            },
            {
              label: 'outline.borderWidth',
              key: 'borderWidth',
              default: 5,
              comType: 'inputNumber',
            },
            {
              label: 'outline.borderColor',
              key: 'color',
              default: '#156ACF',
              comType: 'fontColor',
            },
          ],
        },
        {
          label: 'tooltip.title',
          key: 'tooltip',
          comType: 'group',
          rows: [
            {
              label: 'tooltip.show',
              key: 'show',
              default: true,
              comType: 'checkbox',
            },
          ],
        },
        {
          label: 'shape.title',
          key: 'shape',
          comType: 'group',
          rows: [
            {
              label: 'shape.shape',
              key: 'shape',
              default: 'circle',
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
                  { label: '容器', value: 'container' },
                ],
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
            common: {
              fontSize: '文字大小',
            },
            liquidfill: {
              title: '水球图',
              animation: '动画效果',
              amplitude: '幅度',
            },
            background: {
              title: '背景',
              color: '背景颜色',
              borderWidth: '边框宽度',
              borderColor: '边框颜色',
            },
            outline: {
              title: '边框',
              show: '显示边框',
              borderDistance: '边框距离',
              borderColor: '边框颜色',
              borderWidth: '边框宽度',
            },
            tooltip: {
              title: '提示信息',
              show: '显示',
            },
            shape: {
              title: '形状',
              shape: '选择形状',
            },
          },
        },
      ],
    },
    isISOContainer: 'liquidfill-chart',
    dependency: [],
    meta: {
      id: 'liquidfill-chart',
      name: '水球图',
      icon: 'chart',
      requirements: [
        {
          group: 1,
          aggregate: 1,
        },
      ],
    },

    onMount(options, context) {
      // 组件对象初始化
      this.chart = init(
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

      let dataList = [];
      objDataColumns.forEach(record => {
        dataList.push({
          name: record[dimensionTitle],
          value: record[metricsTitle],
        });
      });

      const compareObj = prop => {
        return (a, b) => {
          let v1 = a[prop];
          let v2 = b[prop];
          return v2 - v1;
        };
      };
      dataList.sort(compareObj('value'));

      // 水球图样式
      const enableAnimation = dHelper.getStyleValueByGroup(
        styleConfigs,
        'liquidfill',
        'animation',
      );
      const amplitude = dHelper.getStyleValueByGroup(
        styleConfigs,
        'liquidfill',
        'amplitude',
      );

      // 背景样式
      const bgColor = dHelper.getStyleValueByGroup(
        styleConfigs,
        'background',
        'color',
      );
      const bgBorderColor = dHelper.getStyleValueByGroup(
        styleConfigs,
        'background',
        'borderColor',
      );
      const bgBorderWidth = dHelper.getStyleValueByGroup(
        styleConfigs,
        'background',
        'borderWidth',
      );

      // 图形样式
      const shape = dHelper.getStyleValueByGroup(
        styleConfigs,
        'shape',
        'shape',
      );

      // 边框样式
      const showOutline = dHelper.getStyleValueByGroup(
        styleConfigs,
        'outline',
        'show',
      );
      const outlineBorderDistance = dHelper.getStyleValueByGroup(
        styleConfigs,
        'outline',
        'borderDistance',
      );
      const outlineBorderWidth = dHelper.getStyleValueByGroup(
        styleConfigs,
        'outline',
        'borderWidth',
      );
      const outlineBorderColor = dHelper.getStyleValueByGroup(
        styleConfigs,
        'outline',
        'color',
      );

      // 提示信息样式
      const showTooltip = dHelper.getStyleValueByGroup(
        styleConfigs,
        'tooltip',
        'show',
      );

      // 字体大小
      let labelFontSize = ChartConfigHelper.getConfigValue(
        'bodyFontSize',
        config.styles,
      );
      let options = {
        series: [
          {
            type: 'liquidFill',
            data: dataList,
            shape: shape,
            waveAnimation: enableAnimation,
            amplitude: amplitude,
            backgroundStyle: {
              borderWidth: bgBorderWidth,
              borderColor: bgBorderColor,
              color: bgColor,
            },
            outline: {
              show: showOutline,
              borderDistance: outlineBorderDistance,
              itemStyle: {
                borderWidth: outlineBorderWidth,
                borderColor: outlineBorderColor,
              },
            },
            label: {
              textStyle: {
                fontSize: labelFontSize,
              },
            },
          },
        ],
        tooltip: {
          show: showTooltip,
          formatter: params => {
            let result = `${params.name}: ${params.value * 100}%`;
            return result;
          },
        },
        label: {
          position: ['38%', '40%'],
          formatter: function (params, param2) {
            console.log('shuiqiutu label params: ', params);
            return `${Math.round(params.value * 100)}%`;
          },
          textStyle: {
            fontSize: 5,
          },
          fontSize: 3,
          color: '#D94854',
        },
      };
      return options;
    },
  };
}

export default LiquidFillChart;
