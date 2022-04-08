/**
 * 自定义扩展立体堆叠柱状图
 * @param dHelper 构建参数
 * @returns 返回组件
 */

import { toPrecision } from 'app/utils/number';

function PictorialStackBar({ dHelper }) {
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
            {
              label: 'bar.color',
              key: 'color',
              default: 'rgba(30, 46, 58, 1)',
              comType: 'fontColor',
            },
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
    isISOContainer: 'pictorial-bar-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'pictorial-bar-chart',
      name: '立体柱状图',
      icon: 'fsux_tubiao_baifenbiduijizhuzhuangtu',
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
      let colorizeTitle = undefined;
      if (dataConfigs[3].rows) {
        if (dataConfigs[3].rows.length !== 0) {
          colorizeTitle = dataConfigs[3].rows[0].colName;
        }
      }

      let dimensionList = [];
      objDataColumns.forEach(record => {
        if (dimensionList.indexOf(record[dimensionTitle]) === -1) {
          dimensionList.push(record[dimensionTitle]);
        }
      });

      let colorizeList = [];
      objDataColumns.forEach(record => {
        if (colorizeList.indexOf(record[colorizeTitle]) === -1) {
          colorizeList.push(record[colorizeTitle]);
        }
      });

      let dimensionSumList = [];
      dimensionList.forEach(dimension => {
        let sumObj = {};
        sumObj[dimension] = 0;
        objDataColumns.forEach(record => {
          if (record[dimensionTitle] === dimension) {
            sumObj[dimension] += record[metricsTitle];
          }
        });
        dimensionSumList.push(sumObj);
      });

      let dimensionColorCombinition = [];
      objDataColumns.forEach(record => {
        dimensionColorCombinition.push(
          [record[dimensionTitle], record[colorizeTitle]].toString(),
        );
      });
      dimensionList.forEach(dimension => {
        colorizeList.forEach(colorize => {
          const combinition = [dimension, colorize].toString();
          if (dimensionColorCombinition.indexOf(combinition) === -1) {
            let newObj = {};
            newObj[dimensionTitle] = dimension;
            newObj[colorizeTitle] = colorize;
            newObj[metricsTitle] = 0;
            objDataColumns.push(newObj);
          }
        });
      });

      const barWidth = dHelper.getStyleValueByGroup(
        styleConfigs,
        'bar',
        'width',
      );

      let seriesList = [];
      let middleCircleData = [];
      let isGrey = false;
      let options = {};

      if (colorizeTitle !== undefined) {
        // 如果颜色栏有字段
        // 计算顶部圆片颜色
        const barBgColor = dHelper.getStyleValueByGroup(
          styleConfigs,
          'bar',
          'color',
        );
        const rgbSubString = barBgColor.slice(
          barBgColor.indexOf('(') + 1,
          barBgColor.indexOf('1)') - 2,
        );
        const red = parseInt(rgbSubString.slice(0, rgbSubString.indexOf(',')));
        const green = parseInt(
          rgbSubString.slice(
            rgbSubString.indexOf(',') + 1,
            rgbSubString.lastIndexOf(','),
          ),
        );
        const blue = parseInt(
          rgbSubString.slice(rgbSubString.lastIndexOf(',') + 1),
        );
        let newRed = red + 30;
        let newGreen = green + 30;
        let newBlue = blue + 30;
        if (newRed >= 255) newRed = 255;
        if (newGreen >= 255) newGreen = 255;
        if (newBlue >= 255) newBlue = 255;
        const topCircleColor = `rgb(${newRed}, ${newGreen}, ${newBlue})`;

        colorizeList.forEach(colorize => {
          let seriesObj = {
            type: 'bar',
            name: colorize,
            stack: 'total',
            data: [],
            itemStyle: {
              color: params => {
                var colorList = [
                  '#C1232B',
                  '#B5C334',
                  '#FCCE10',
                  '#E87C25',
                  '#27727B',
                  '#FE8463',
                  '#9BCA63',
                ];
                return colorList[params.dataIndex];
              },
            },
            emphasis: {
              itemStyle: {
                color: 'inherit',
              },
            },
            barWidth: barWidth,
            colorBy: 'data',
            animation: false,
          };
          if (isGrey) {
            seriesObj.itemStyle = {
              color: barBgColor,
            };
          }
          dimensionList.forEach(dimension => {
            objDataColumns.forEach(record => {
              if (
                record[dimensionTitle] === dimension &&
                record[colorizeTitle] === colorize
              ) {
                let rowData = {};
                rowData[metricsTitle] = record[metricsTitle];
                rowData[dimensionTitle] = record[dimensionTitle];
                rowData[colorizeTitle] = record[colorizeTitle];
                // 计算两个颜色相加的数值，用于计算百分比
                const sum = dimensionSumList.filter(sumObj => {
                  return Object.keys(sumObj)[0] === dimension;
                });
                // 计算该颜色在柱条中的占比
                const percentageValue = toPrecision(
                  (Math.abs(record[metricsTitle]) / Object.values(sum[0])[0]) *
                    100,
                  2,
                );
                if (isGrey === false) {
                  middleCircleData.push({
                    value: parseFloat(percentageValue), // 该value为reference bar的高度
                    symbolPosition: 'end',
                    symbolOffset: [0, 0 - barWidth / 4],
                  });
                  seriesObj.label = this.getLabel(styleConfigs, colorizeTitle);
                }
                seriesObj.tooltip = {
                  show: true,
                  trigger: 'item',
                  formatter: params => {
                    return (
                      `总数：${params.data.total}` +
                      '<br/>' +
                      `${params.seriesName}数量：${params.data.rowData[metricsTitle]}` +
                      '<br/>' +
                      `${params.seriesName}占比：${params.data.value}%`
                    );
                  },
                };
                let dataObj = {
                  name: record[dimensionTitle],
                  rowData: rowData,
                  total: Object.values(sum[0])[0],
                  value: percentageValue,
                };
                seriesObj.data.push(dataObj);
              }
            });
          });
          seriesList.push(seriesObj);
          isGrey = true; // 颜色栏字段只允许有两个数据，第一个数据为彩色柱条，第二个数据为底柱（默认灰色，可在样式里更改）
        });

        let bottomCircleData = [];
        let topCircleData = [];
        for (let i = 0; i < dimensionList.length; i++) {
          bottomCircleData.push({ value: 100, symbolPosition: 'start' });
          topCircleData.push({ value: 100, symbolPosition: 'end' });
        }
        seriesList.push(
          {
            name: 'bottomCircle',
            type: 'pictorialBar',
            // 此处symbolSize的x数值用barWidth，y数值为柱条宽度的一半
            symbolSize: [barWidth, barWidth / 2],
            symbolOffset: [0, barWidth / 4],
            z: 10,
            symbol: 'circle',
            data: bottomCircleData,
            itemStyle: {
              color: params => {
                // 底部圆片颜色比柱条颜色浅一点
                var colorList = [
                  '#c7323c',
                  '#c1cc46',
                  '#ffd22e',
                  '#f58b3b',
                  '#37838a',
                  '#ff977d',
                  '#a8d177',
                ];
                return colorList[params.dataIndex];
              },
            },
            emphasis: {
              itemStyle: {
                color: 'inherit',
              },
              z: 10,
            },
            colorBy: 'data',
            animation: false,
            tooltip: {
              show: false,
            },
          },
          {
            name: 'middleCircle',
            type: 'pictorialBar',
            symbolSize: [barWidth, barWidth / 2],
            data: middleCircleData,
            z: 11,
            symbol: 'circle',
            itemStyle: {
              color: params => {
                // 中间圆片颜色比底部圆片颜色更浅
                var colorList = [
                  '#E07B80',
                  '#D8E186',
                  '#FEE47B',
                  '#F3B583',
                  '#76B4BD',
                  '#FFBBA9',
                  '#C8E4A4',
                ];
                return colorList[params.dataIndex];
              },
            },
            emphasis: {
              itemStyle: {
                color: 'inherit',
              },
            },
            colorBy: 'data',
            animation: false,
            tooltip: {
              show: false,
            },
          },
          {
            name: 'topCircle',
            type: 'pictorialBar',
            symbolSize: [barWidth, barWidth / 2],
            symbolOffset: [0, 0 - barWidth / 4],
            data: topCircleData,
            z: 9,
            symbol: 'circle',
            itemStyle: {
              color: topCircleColor,
            },
            emphasis: {
              itemStyle: {
                color: 'inherit',
              },
            },
            animation: false,
            tooltip: {
              show: false,
            },
          },
        );
        options = {
          xAxis: this.getXAxis(styleConfigs, dimensionList, barWidth),
          yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            show: false,
          },
          series: seriesList,
          tooltip: {},
        };
      } else {
        // 如果颜色栏没有字段
        let maxValue = 0;
        let seriesList = [];
        let seriesObj = {
          type: 'bar',
          data: [],
          itemStyle: {
            color: params => {
              var colorList = [
                '#C1232B',
                '#B5C334',
                '#FCCE10',
                '#E87C25',
                '#27727B',
                '#FE8463',
                '#9BCA63',
              ];
              return colorList[params.dataIndex % 7];
            },
          },
          emphasis: {
            itemStyle: {
              color: 'inherit',
            },
          },
          label: this.getLabel(styleConfigs, colorizeTitle),
          barWidth: barWidth,
          colorBy: 'data',
          animation: false,
        };
        // 颜色栏没有字段，不堆叠，data直接使用指标的数值
        let bottomCircleData = [];
        objDataColumns.forEach(record => {
          let rowData = {};
          rowData[metricsTitle] = record[metricsTitle];
          rowData[dimensionTitle] = record[dimensionTitle];
          if (record[metricsTitle] > maxValue) maxValue = record[metricsTitle];
          let dataObj = {
            name: record[dimensionTitle],
            rowData: rowData,
            value: record[metricsTitle],
          };
          middleCircleData.push({
            value: record[metricsTitle], // 该value为reference bar的高度
            symbolPosition: 'end',
            symbolOffset: [0, 0 - barWidth / 4],
          });
          bottomCircleData.push({
            value: record[metricsTitle],
            symbolPosition: 'start',
          });
          seriesObj.data.push(dataObj);
        });
        seriesList.push(seriesObj);
        seriesList.push(
          {
            name: 'bottomCircle',
            type: 'pictorialBar',
            // 此处symbolSize的x数值用barWidth，y数值为柱条宽度的一半
            symbolSize: [barWidth, barWidth / 2],
            symbolOffset: [0, barWidth / 4],
            z: 10,
            symbol: 'circle',
            data: bottomCircleData,
            itemStyle: {
              color: params => {
                // 底部圆片颜色比柱条颜色浅一点
                var colorList = [
                  '#c7323c',
                  '#c1cc46',
                  '#ffd22e',
                  '#f58b3b',
                  '#37838a',
                  '#ff977d',
                  '#a8d177',
                ];
                return colorList[params.dataIndex % 7];
              },
            },
            emphasis: {
              itemStyle: {
                color: 'inherit',
              },
              z: 10,
            },
            colorBy: 'data',
            animation: false,
            tooltip: {
              show: false,
            },
          },
          {
            name: 'middleCircle',
            type: 'pictorialBar',
            symbolSize: [barWidth, barWidth / 2],
            data: middleCircleData,
            z: 11,
            symbol: 'circle',
            itemStyle: {
              color: params => {
                // 中间圆片颜色比底部圆片颜色更浅
                var colorList = [
                  '#E07B80',
                  '#D8E186',
                  '#FEE47B',
                  '#F3B583',
                  '#76B4BD',
                  '#FFBBA9',
                  '#C8E4A4',
                ];
                return colorList[params.dataIndex % 7];
              },
            },
            emphasis: {
              itemStyle: {
                color: 'inherit',
              },
            },
            colorBy: 'data',
            animation: false,
            tooltip: {
              show: false,
            },
          },
        );
        options = {
          xAxis: this.getXAxis(styleConfigs, dimensionList, barWidth),
          yAxis: {
            type: 'value',
            min: 0,
            max: maxValue,
            show: false,
          },
          series: seriesList,
          tooltip: {},
        };
      }

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
          if (colorizeTitle === undefined) {
            return params.value;
          } else {
            return params.value + '%';
          }
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
  };
}

export default PictorialStackBar;
