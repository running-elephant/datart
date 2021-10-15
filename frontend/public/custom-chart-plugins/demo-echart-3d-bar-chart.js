/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function DemoEChart3DBarChart({ dHelper }) {
  return {
    config: {
      datas: [
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'group',
        },
        {
          label: 'deminsion',
          key: 'deminsion',
          required: true,
          maxFieldCount: 1,
          type: 'aggregate',
        },
        {
          label: 'filter',
          key: 'filter',
          type: 'filter',
          allowSameField: true,
        },
      ],
      styles: [],
      settings: [],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            common: {
              showAxis: '显示坐标轴',
              inverseAxis: '反转坐标轴',
              lineStyle: '线条样式',
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
            graph: {
              title: '折线图',
              smooth: '平滑',
              step: '阶梯',
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
    isISOContainer: 'demo-echart-3d-bar-chart',
    dependency: [
      'https://lib.baomitu.com/echarts/5.0.2/echarts.min.js',
      'https://cdn.jsdelivr.net/npm/echarts-gl/dist/echarts-gl.min.js',
    ],
    meta: {
      id: 'demo-echart-3d-bar-chart',
      name: '[DEMO]3D条形图',
      icon: 'star',
      requirements: [
        {
          group: [2],
          aggregate: [1],
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
      const groupConfigs = dataConfigs
        .filter(c => c.type === 'group')
        .flatMap(config => config.rows || []);
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);

      const objDataColumns = dHelper.transfromToObjectArray(
        dataset.rows,
        dataset.columns,
      );
      const dataColumns = objDataColumns;
      const xAxisColumns = groupConfigs.map(config => {
        return {
          type: 'category',
          data: Array.from(
            new Set(
              dataColumns.map(dc => dc[dHelper.getValueByColumnKey(config)]),
            ),
          ),
        };
      });

      const yAxisDatas = objDataColumns.map(dc => {
        return {
          value: [
            dc[dHelper.getValueByColumnKey(groupConfigs[0])],
            dc[dHelper.getValueByColumnKey(groupConfigs[1])],
            dc[dHelper.getValueByColumnKey(aggregateConfigs[0])],
          ],
        };
      });

      const { min, max } = dHelper.getDataColumnMaxAndMin(
        objDataColumns,
        aggregateConfigs[0],
      );

      return {
        tooltip: {},
        visualMap: {
          min,
          max,
          inRange: {
            color: [
              '#313695',
              '#4575b4',
              '#74add1',
              '#abd9e9',
              '#e0f3f8',
              '#ffffbf',
              '#fee090',
              '#fdae61',
              '#f46d43',
              '#d73027',
              '#a50026',
            ],
          },
        },
        xAxis3D: xAxisColumns[0],
        yAxis3D: xAxisColumns[1],
        zAxis3D: {
          type: 'value',
        },
        grid3D: {
          boxWidth: 200,
          boxDepth: 80,
          viewControl: {
            // projection: 'orthographic'
          },
          light: {
            main: {
              intensity: 1.2,
              shadow: true,
            },
            ambient: {
              intensity: 0.3,
            },
          },
        },
        series: [
          {
            type: 'bar3D',
            data: yAxisDatas,
            shading: 'lambert',
            label: {
              fontSize: 16,
              borderWidth: 1,
            },
            emphasis: {
              label: {
                fontSize: 20,
                color: '#900',
              },
              itemStyle: {
                color: '#900',
              },
            },
          },
        ],
      };
    },

    getGrid(styles) {
      const containLabel = dHelper.getStyleValueByGroup(
        styles,
        'margin',
        'containLabel',
      );
      const left = dHelper.getStyleValueByGroup(styles, 'margin', 'marginLeft');
      const right = dHelper.getStyleValueByGroup(
        styles,
        'margin',
        'marginRight',
      );
      const bottom = dHelper.getStyleValueByGroup(
        styles,
        'margin',
        'marginBottom',
      );
      const top = dHelper.getStyleValueByGroup(styles, 'margin', 'marginTop');
      return { left, right, bottom, top, containLabel };
    },

    getYAxis(styles, yAxisColumns) {
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
      const unitFont = dHelper.getStyleValueByGroup(
        styles,
        'yAxis',
        'unitFont',
      );
      const showTitleAndUnit = dHelper.getStyleValueByGroup(
        styles,
        'yAxis',
        'showTitleAndUnit',
      );
      const name = showTitleAndUnit
        ? yAxisColumns.map(c => c.name).join(' / ')
        : null;
      const nameLocation = dHelper.getStyleValueByGroup(
        styles,
        'yAxis',
        'nameLocation',
      );
      const nameGap = dHelper.getStyleValueByGroup(styles, 'yAxis', 'nameGap');
      const nameRotate = dHelper.getStyleValueByGroup(
        styles,
        'yAxis',
        'nameRotate',
      );
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
        name,
        nameLocation,
        nameGap,
        nameRotate,
        inverse,
        min,
        max,
        axisLabel: dHelper.getAxisLabel(showLabel, font),
        axisLine: dHelper.getAxisLine(showAxis, lineStyle),
        axisTick: dHelper.getAxisTick(showLabel, lineStyle),
        nameTextStyle: dHelper.getNameTextStyle(
          unitFont?.fontFamily,
          unitFont?.fontSize,
          unitFont?.color,
        ),
        splitLine: dHelper.getSplitLine(showHorizonLine, horizonLineStyle),
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
        axisLabel: dHelper.getAxisLabel(
          showLabel,
          font,
          showInterval ? interval : null,
          rotate,
        ),
        axisLine: dHelper.getAxisLine(showAxis, lineStyle),
        axisTick: dHelper.getAxisTick(showLabel, lineStyle),
        splitLine: dHelper.getSplitLine(showVerticalLine, verticalLineStyle),
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

      return {
        ...positions,
        show,
        type,
        orient,
        selected,
        data: seriesNames,
        textStyle: font,
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

    hours: [
      '12a',
      '1a',
      '2a',
      '3a',
      '4a',
      '5a',
      '6a',
      '7a',
      '8a',
      '9a',
      '10a',
      '11a',
      '12p',
      '1p',
      '2p',
      '3p',
      '4p',
      '5p',
      '6p',
      '7p',
      '8p',
      '9p',
      '10p',
      '11p',
    ],

    day: [
      'Saturday',
      'Friday',
      'Thursday',
      'Wednesday',
      'Tuesday',
      'Monday',
      'Sunday',
    ],

    data: [
      [0, 0, 5],
      [0, 1, 1],
      [0, 2, 0],
      [0, 3, 0],
      [0, 4, 0],
      [0, 5, 0],
      [0, 6, 0],
      [0, 7, 0],
      [0, 8, 0],
      [0, 9, 0],
      [0, 10, 0],
      [0, 11, 2],
      [0, 12, 4],
      [0, 13, 1],
      [0, 14, 1],
      [0, 15, 3],
      [0, 16, 4],
      [0, 17, 6],
      [0, 18, 4],
      [0, 19, 4],
      [0, 20, 3],
      [0, 21, 3],
      [0, 22, 2],
      [0, 23, 5],
      [1, 0, 7],
      [1, 1, 0],
      [1, 2, 0],
      [1, 3, 0],
      [1, 4, 0],
      [1, 5, 0],
      [1, 6, 0],
      [1, 7, 0],
      [1, 8, 0],
      [1, 9, 0],
      [1, 10, 5],
      [1, 11, 2],
      [1, 12, 2],
      [1, 13, 6],
      [1, 14, 9],
      [1, 15, 11],
      [1, 16, 6],
      [1, 17, 7],
      [1, 18, 8],
      [1, 19, 12],
      [1, 20, 5],
      [1, 21, 5],
      [1, 22, 7],
      [1, 23, 2],
      [2, 0, 1],
      [2, 1, 1],
      [2, 2, 0],
      [2, 3, 0],
      [2, 4, 0],
      [2, 5, 0],
      [2, 6, 0],
      [2, 7, 0],
      [2, 8, 0],
      [2, 9, 0],
      [2, 10, 3],
      [2, 11, 2],
      [2, 12, 1],
      [2, 13, 9],
      [2, 14, 8],
      [2, 15, 10],
      [2, 16, 6],
      [2, 17, 5],
      [2, 18, 5],
      [2, 19, 5],
      [2, 20, 7],
      [2, 21, 4],
      [2, 22, 2],
      [2, 23, 4],
      [3, 0, 7],
      [3, 1, 3],
      [3, 2, 0],
      [3, 3, 0],
      [3, 4, 0],
      [3, 5, 0],
      [3, 6, 0],
      [3, 7, 0],
      [3, 8, 1],
      [3, 9, 0],
      [3, 10, 5],
      [3, 11, 4],
      [3, 12, 7],
      [3, 13, 14],
      [3, 14, 13],
      [3, 15, 12],
      [3, 16, 9],
      [3, 17, 5],
      [3, 18, 5],
      [3, 19, 10],
      [3, 20, 6],
      [3, 21, 4],
      [3, 22, 4],
      [3, 23, 1],
      [4, 0, 1],
      [4, 1, 3],
      [4, 2, 0],
      [4, 3, 0],
      [4, 4, 0],
      [4, 5, 1],
      [4, 6, 0],
      [4, 7, 0],
      [4, 8, 0],
      [4, 9, 2],
      [4, 10, 4],
      [4, 11, 4],
      [4, 12, 2],
      [4, 13, 4],
      [4, 14, 4],
      [4, 15, 14],
      [4, 16, 12],
      [4, 17, 1],
      [4, 18, 8],
      [4, 19, 5],
      [4, 20, 3],
      [4, 21, 7],
      [4, 22, 3],
      [4, 23, 0],
      [5, 0, 2],
      [5, 1, 1],
      [5, 2, 0],
      [5, 3, 3],
      [5, 4, 0],
      [5, 5, 0],
      [5, 6, 0],
      [5, 7, 0],
      [5, 8, 2],
      [5, 9, 0],
      [5, 10, 4],
      [5, 11, 1],
      [5, 12, 5],
      [5, 13, 10],
      [5, 14, 5],
      [5, 15, 7],
      [5, 16, 11],
      [5, 17, 6],
      [5, 18, 0],
      [5, 19, 5],
      [5, 20, 3],
      [5, 21, 4],
      [5, 22, 2],
      [5, 23, 0],
      [6, 0, 1],
      [6, 1, 0],
      [6, 2, 0],
      [6, 3, 0],
      [6, 4, 0],
      [6, 5, 0],
      [6, 6, 0],
      [6, 7, 0],
      [6, 8, 0],
      [6, 9, 0],
      [6, 10, 1],
      [6, 11, 0],
      [6, 12, 2],
      [6, 13, 1],
      [6, 14, 3],
      [6, 15, 4],
      [6, 16, 0],
      [6, 17, 0],
      [6, 18, 0],
      [6, 19, 0],
      [6, 20, 1],
      [6, 21, 2],
      [6, 22, 2],
      [6, 23, 6],
    ],
  };
}
