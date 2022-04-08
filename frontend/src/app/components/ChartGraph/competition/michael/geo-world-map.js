/**
 * 自定义扩展世界地图
 * @param dHelper 构建参数
 * @returns 返回组件
 */

import geoChinaCity from './geojson/geo-china-city.map.json'; // 获取省市坐标
import geoChina from './geojson/geo-china.map.json';
import geoWorld from './geojson/world.map.json';

function GeoWorldMap({ dHelper }) {
  let globalDataset = undefined;
  let globalConfig = undefined;
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
        {
          label: 'map.title',
          key: 'map',
          comType: 'group',
          rows: [
            {
              label: 'map.enableZoom',
              key: 'enableZoom',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'map.areaColor',
              key: 'areaColor',
              default: '#708090',
              comType: 'fontColor',
            },
            {
              label: 'map.borderStyle',
              key: 'borderStyle',
              comType: 'line',
              default: {
                type: 'solid',
                width: 1,
                color: '#708090',
              },
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
            metricsAndColor: '指标(颜色)',
            label: {
              title: '标签',
              showLabel: '显示标签',
              position: '位置',
            },
            map: {
              title: '地图设置',
              level: '默认地图等级',
              enableZoom: '开启缩放',
              backgroundColor: '底图背景色',
              borderStyle: '轮廓样式',
              focusArea: '聚焦选中区域',
              areaColor: '区域颜色',
              areaEmphasisColor: '选中区域高亮颜色',
            },
            background: { title: '背景设置' },
          },
        },
      ],
    },
    isISOContainter: 'geo-world-map',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'geo-world-map',
      name: '世界地图geoJson',
      icon: 'ditu',
      requirements: [{ group: 1, aggregate: 1 }],
    },

    onMount(options, context) {
      this.globalContext = context;
      if ('echarts' in context.window) {
        if (!this.globalContext.window.echarts.getMap('world')) {
          context.window.echarts.registerMap('world', geoWorld);
        }

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
      globalDataset = props.dataset;
      globalConfig = props.config;
      const newOptions = this.getOptions(props.dataset, props.config);
      this.chart?.setOption(Object.assign({}, newOptions), true);
      this.initMap(props.config.styles); // 初始化地图
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
      const objDataColumns = dHelper.transformToObjectArray(
        dataset.rows,
        dataset.columns,
      );
      const dimensionTitle = config.datas[0].rows[0].colName;
      const metricsTitle =
        config.datas[1].rows[0].aggregate +
        '(' +
        config.datas[1].rows[0].colName +
        ')';
      let dimensionList = [];
      objDataColumns.forEach(record => {
        dimensionList.push(record[dimensionTitle]);
      });
      let metricsList = [];
      objDataColumns.forEach(record => {
        metricsList.push(record[metricsTitle]);
      });
      metricsList = metricsList.sort((a, b) => b - a);
      let areaLevel = '';
      for (let i = 0; i < dimensionList.length; i++) {
        if (dimensionList[i].indexOf('省') !== -1) {
          areaLevel = 'province';
          break;
        } else {
          areaLevel = 'city';
        }
      }
      let dataList = [];
      if (areaLevel === 'province') {
        objDataColumns.forEach(record => {
          let rowData = {}; // Datart通过读取rowData向点击事件的回调函数传参，series.data中必须有rowData这一属性
          rowData[dimensionTitle] = record[dimensionTitle];
          geoChina.features.forEach(province => {
            if (province.properties.name === record[dimensionTitle]) {
              dataList.push({
                name: record[dimensionTitle],
                rowData: rowData,
                value: province.properties.center.concat(record[metricsTitle]),
              });
            }
          });
        });
      } else if (areaLevel === 'city') {
        objDataColumns.forEach(record => {
          let rowData = {}; // Datart通过读取rowData向点击事件的回调函数传参，series.data中必须有rowData这一属性
          rowData[dimensionTitle] = record[dimensionTitle];
          if (
            record[dimensionTitle].indexOf('市') ===
            record[dimensionTitle].length - 1
          ) {
            record[dimensionTitle] = record[dimensionTitle].substring(
              0,
              record[dimensionTitle].length - 1,
            );
          }
          geoChinaCity.features.forEach(city => {
            if (city.properties.name === record[dimensionTitle]) {
              dataList.push({
                name: record[dimensionTitle],
                rowData: rowData,
                value: city.properties.cp.concat(record[metricsTitle]),
              });
            }
          });
        });
      }
      let options = {
        geo: [],
        tooltip: {},
        series: [
          {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            tooltip: {
              formatter: params => {
                return (
                  `${params.name}：TOP ${
                    metricsList.indexOf(params.data.value[2]) + 1
                  }` +
                  '<br/>' +
                  ' · 销售额：' +
                  params.data.value[2]
                );
              },
              show: true,
            },
            itemStyle: {
              color: 'yellow',
            },
            data: dataList,
          },
        ],
      };
      return options;
    },

    getGeo(styleConfigs) {
      const show = dHelper.getStyleValueByGroup(
        styleConfigs,
        'label',
        'showLabel',
      );
      const font = dHelper.getStyleValueByGroup(styleConfigs, 'label', 'font');
      const enableZoom = dHelper.getStyleValueByGroup(
        styleConfigs,
        'map',
        'enableZoom',
      );
      const areaColor = dHelper.getStyleValueByGroup(
        styleConfigs,
        'map',
        'areaColor',
      );
      const borderStyle = dHelper.getStyleValueByGroup(
        styleConfigs,
        'map',
        'borderStyle',
      );
      return {
        map: 'world',
        roam: enableZoom,
        emphasis: {
          focus: 'none',
          itemStyle: {
            areaColor: areaColor,
          },
          label: {
            show: false,
          },
        },
        itemStyle: {
          areaColor: areaColor,
          borderType: borderStyle?.type,
          borderWidth: borderStyle?.width,
          borderColor: borderStyle?.color,
        },
        label: {
          show,
          ...font,
        },
        tooltip: {
          show: false,
        },
      };
    },

    renderMap(styles) {
      this.chart.clear();
      let options = this.getOptions(globalDataset, globalConfig);
      options.geo.push(this.getGeo(styles));
      this.chart.setOption(options, false, true);
    },

    initMap(styles) {
      this.chart.clear();
      this.renderMap(styles);
    },
  };
}

export default GeoWorldMap;
