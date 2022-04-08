/**
 * 自定义扩展雷达图
 * @param dHelper 构建参数
 * @returns 返回组件
 */
// import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import geoChinaCity from './geojson/geo-china-city.map.json';
import geoChina from './geojson/geo-china.map.json';

function DrillDownMap({ dHelper }) {
  // let globalContext = undefined;
  let globalDataset = undefined;
  let globalConfig = undefined;
  const municipality = [
    '110000',
    '120000',
    '500000',
    '310000',
    '810000',
    '820000',
  ]; // 北京、天津、重庆、上海、香港、澳门
  const muniCounty = ['419001', '429004']; // 济源、仙桃

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
      // 样式设置
      styles: [
        {
          label: 'map.title',
          key: 'map',
          comType: 'group',
          rows: [
            {
              label: 'map.enableZoom',
              key: 'enableZoom',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'map.areaColor',
              key: 'areaColor',
              default: '#e9ecef',
              comType: 'fontColor',
            },
            {
              label: 'map.focusArea',
              key: 'focusArea',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'map.areaEmphasisColor',
              key: 'areaEmphasisColor',
              default: '#dee2e6',
              comType: 'fontColor',
            },
            {
              label: 'map.borderStyle',
              key: 'borderStyle',
              comType: 'line',
              default: {
                type: 'dashed',
                width: 1,
                color: '#ced4da',
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
              label: 'label.position',
              key: 'position',
              comType: 'select',
              default: 'top',
              options: {
                items: [
                  { label: '上', value: 'top' },
                  { label: '左', value: 'left' },
                  { label: '右', value: 'right' },
                  { label: '下', value: 'bottom' },
                  { label: '内', value: 'inside' },
                  { label: '内左', value: 'insideLeft' },
                  { label: '内右', value: 'insideRight' },
                  { label: '内上', value: 'insideTop' },
                  { label: '内下', value: 'insideBottom' },
                  { label: '内左上', value: 'insideTopLeft' },
                  { label: '内左下', value: 'insideBottomLeft' },
                  { label: '内右上', value: 'insideTopRight' },
                  { label: '内右下', value: 'insideBottomRight' },
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
      ],
      // 组件设置
      settings: [],
      // 国际化
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
    // 组件元数据：id，名称，图标，依赖等
    isISOContainer: 'drill-down-map',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'drill-down-map',
      name: '可下钻地图',
      icon: 'ditu',
      requirements: [
        {
          group: 1,
          aggregate: 1,
        },
      ],
    },

    // 组件对象挂载时调用，可用于对组件进行初始化
    onMount(options, context) {
      this.globalContext = context;
      if ('echarts' in context.window) {
        // 注册省级地图 & 市级地图
        if (!this.globalContext.window.echarts.getMap('china')) {
          context.window.echarts.registerMap('china', geoChina);
        }

        if (!this.globalContext.window.echarts.getMap('china-city')) {
          context.window.echarts.registerMap('china-city', geoChinaCity);
        }

        // 组件对象初始化
        this.chart = context.window.echarts.init(
          context.document.getElementById(options.containerId),
          'default',
        );
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
      const newOptions = this.getOptions(props.dataset, props.config, '100000');
      this.chart?.setOption(Object.assign({}, newOptions), true);
      this.initMap(props.config.styles); // 初始化地图
      this.globalContext.window.oncontextmenu = e => {
        return false;
      }; // 禁用浏览器默认右键菜单
    },

    // 卸载组件清理资源
    onUnMount() {
      this.chart && this.chart.dispose();
    },

    // 改变大小时触发
    onResize(opt, context) {
      this.chart && this.chart.resize(context);
    },

    // 根据组件配置信息，组装构造echart组件选型信息
    getOptions(dataset, config, currCode) {
      //TODO
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
      let dimensionLevel = 'province';
      let mapDataList = [];
      let maxValue = 0;
      let isAdcode = false;
      // 如果维度栏读取到adcode, 根据adcode后缀0的数量判断区域等级
      if (
        !isNaN(objDataColumns[0][dimensionTitle]) &&
        (objDataColumns[0][dimensionTitle] + '').length === 6
      ) {
        console.log('adcode!');
        isAdcode = true;
        for (let i = 0; i < objDataColumns.length; i++) {
          let adcode = objDataColumns[i][dimensionTitle] + '';
          let value = objDataColumns[i][metricsTitle];
          if (value > maxValue) maxValue = value;
          let cpList = []; // 中心点坐标数组
          if (
            (objDataColumns[i][dimensionTitle] + '').substring(2) === '0000'
          ) {
            // 省
            let adcode = objDataColumns[i][dimensionTitle] + '';
            dimensionLevel = 'province';
            geoChina.features.forEach(province => {
              if (province.properties.adcode === adcode) {
                cpList = province.properties.center;
              }
            });
          } else if (
            (objDataColumns[i][dimensionTitle] + '').substring(4) === '00'
          ) {
            // 市
            console.log('市 adcode');
            dimensionLevel = 'city';
            let adcode = objDataColumns[i][dimensionTitle] + '';
            // 把echarts自带的geoJson文件中四个直辖市的adcode改成省的后缀以便识别
            if (adcode == '110100') {
              //北京
              adcode = '110000';
            }
            if (adcode == '120100') {
              // 天津
              adcode = '120000';
            }
            if (adcode == '500100') {
              // 重庆
              adcode = '500000';
            }
            if (adcode == '310100') {
              // 上海
              adcode = '310000';
            }
            geoChinaCity.features.forEach(city => {
              if (city.id === adcode) {
                cpList = city.properties.cp;
              }
            });
          } else if (
            (objDataColumns[i][dimensionTitle] + '').substring(5) != '0'
          ) {
            // 区县
            console.log('区县 adcode', objDataColumns[i][dimensionTitle]);
            let adcode = objDataColumns[i][dimensionTitle] + '';
            dimensionLevel = 'county';
            const cityPrefix = (
              objDataColumns[i][dimensionTitle] + ''
            ).substring(0, 4);
            const cityCode = cityPrefix + '00';
            console.log('cityCode:', cityCode);
            let url = '';
            if (cityCode.substring(2) === '0000') {
              // 直辖市和特别行政区
              url = `${cityCode}.geoJson`;
            } else {
              // 普通城市
              url = `${cityCode.substring(0, 2)}0000/${cityCode}.geoJson`;
            }
            const jsonAddr = require('./geojson/county/' + url);
            let jsonData = undefined;
            console.log('jsonAddr:', jsonAddr);
            jsonData = fetch(jsonAddr.default)
              .then(res => res.json())
              .then(data => {
                return data;
              });
            console.log(jsonData);
            jsonData.features.forEach(county => {
              if (county.properties.id === adcode) {
                cpList = county.properties.centroid;
              }
            });
          }
          mapDataList.push({ name: adcode, value: cpList.concat(value) });
        }
        if (currCode == '100000') {
          mapDataList = mapDataList;
        } else {
          if (currCode.substring(2) === '0000') {
            // 下钻到某省时，过滤掉其他省的散点数据
            let provincePrefix = currCode.substring(0, 2);
            mapDataList = mapDataList.filter(data => {
              return data.name.substring(0, 2) == provincePrefix;
            });
          } else if (currCode.substring(4) === '00') {
            // 下钻到某市时，过滤掉其他市的散点数据
            let cityPrefix = currCode.substring(0, 4);
            mapDataList = mapDataList.filter(data => {
              return data.name.substring(0, 4) == cityPrefix;
            });
          }
        }
      } else {
        console.log('汉字！');
        // 如果维度是汉字（难以判断区域等级，用死方法）
        if (dimensionTitle !== 'province_name') dimensionLevel = 'city';
        for (let i = 0; i < objDataColumns.length; i++) {
          let name = objDataColumns[i][dimensionTitle];
          let value = objDataColumns[i][metricsTitle];
          if (value > maxValue) maxValue = value;
          let cpList = [];
          if (dimensionLevel === 'province') {
            geoChina.features.forEach(province => {
              if (province.properties.name == name) {
                cpList = province.properties.center;
              }
            });
          } else if (dimensionLevel === 'city') {
            if (name.indexOf('市') == name.length - 1) {
              name = name.substring(0, name.length - 1);
            }
            geoChinaCity.features.forEach(city => {
              if (city.properties.name == name) {
                cpList = city.properties.cp;
              }
            });
          }
          mapDataList.push({ name: name, value: cpList.concat(value) });
        }
      }

      let options = {
        title: {},
        legend: {},
        geo: [],
        tooltip: {
          trigger: 'item',
          formatter: params => {
            if (isAdcode === true) {
              let areaName = '';
              if (dimensionLevel === 'province') {
                geoChina.features.forEach(province => {
                  if (province.properties.adcode === params.name) {
                    areaName = province.properties.name;
                  }
                });
              } else if (dimensionLevel === 'city') {
                geoChinaCity.features.forEach(city => {
                  if (city.id === params.name) {
                    areaName = city.properties.name;
                  }
                });
              } else if (dimensionLevel === 'county') {
                const cityPrefix = params.name.substring(0, 3);
                const cityCode = cityPrefix + '00';
                let url = '';
                if (cityCode.substring(2) === '0000') {
                  // 直辖市和特别行政区
                  url = `${cityCode}.geoJson`;
                } else {
                  // 普通城市
                  url = `${cityCode.substring(0, 2)}0000/${cityCode}.geoJson`;
                }
                const jsonAddr = require('./geojson/county/' + url);
                let jsonData = fetch(jsonAddr.default)
                  .then(res => res.json())
                  .then(data => {
                    return data;
                  });
                jsonData.forEach(county => {
                  if (county.properties.id == params.name) {
                    areaName = county.properties.name;
                  }
                });
              }
              return `${metricsTitle}<br/>${areaName}: ${params.value[2]}`;
            } else {
              return `${metricsTitle}<br/>${params.name}: ${params.value[2]}`;
            }
          },
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin',
            label: {
              formatter: '{@[2]}',
              show: true,
            },
            symbolSize: 50,
            data: mapDataList,
          },
        ],
        visualMap: {
          type: 'continuous', // 连续型
          min: 0, // 值域最小值，必须参数
          max: maxValue, // 值域最大值，必须参数
          calculable: true, // 是否启用值域漫游
          realtime: true,
          hoverlink: true,
          inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d'],
            // 指定数值从低到高时的颜色变化
          },
          textStyle: {
            color: '#000', // 值域控件的文本颜色
          },
        },
      };
      return options;
    },

    getGeo(mapName, styleConfigs) {
      const show = dHelper.getStyleValueByGroup(
        styleConfigs,
        'label',
        'showLabel',
      );
      const position = dHelper.getStyleValueByGroup(
        styleConfigs,
        'label',
        'position',
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
      const areaEmphasisColor = dHelper.getStyleValueByGroup(
        styleConfigs,
        'map',
        'areaEmphasisColor',
      );
      const enableFocus = dHelper.getStyleValueByGroup(
        styleConfigs,
        'map',
        'focusArea',
      );
      const borderStyle = dHelper.getStyleValueByGroup(
        styleConfigs,
        'map',
        'borderStyle',
      );

      return {
        map: mapName,
        roam: enableZoom,
        emphasis: {
          focus: enableFocus ? 'self' : 'none',
          itemStyle: {
            areaColor: areaEmphasisColor,
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
          position,
          ...font,
        },
      };
    },

    renderMap(name, styles, adcode) {
      this.chart.clear();
      let options = this.getOptions(globalDataset, globalConfig, adcode);
      options.geo.push(this.getGeo(name, styles));
      this.chart.setOption(options, false, true);
    },

    async linkage(code, name, level, styles) {
      // 根据adcode和地名联动下级地图
      if (level === 'province') {
        // 省级地图联动市级地图
        let citiesObj = {
          // 给省份新建一个包含所有下辖市的geoJson对象
          UTF8Encoding: true,
          type: 'FeatureCollection',
          features: [],
        };

        const provincePrefix = code.substring(0, 2);
        geoChinaCity.features.forEach(city => {
          // 根据省份的adcode前缀从geoChinaCity里找到该省份下所有的市，加进citiesObj
          if (city.id.substring(0, 2) === provincePrefix) {
            citiesObj.features.push(city);
          }
        });
        if (name === '台湾省') {
          // 没有台湾省的geoJson数据
          this.renderMap('china', styles, '100000');
        } else {
          // 把citiesObj注册为地图
          // 检查是否已经注册过省级地图，已注册过则不重新注册
          if (!this.globalContext.window.echarts.getMap(name)) {
            this.globalContext.window.echarts.registerMap(name, citiesObj);
            this.renderMap(name, styles, code);
          } else {
            this.renderMap(name, styles, code);
          }
        }
      } else if (level === 'city') {
        // 市级地图联动区县地图
        if (code === '') {
          // 区县的code是空字符串。点击区县返回中国地图
          this.renderMap('china', styles, '100000');
        } else {
          let url = '';
          if (code.substring(2) === '0000') {
            // 直辖市和特别行政区
            url = `${code}.geoJson`;
          } else {
            // 普通城市
            url = `${code.substring(0, 2)}0000/${code}.geoJson`;
          }
          const jsonAddr = require('./geojson/county/' + url);
          await fetch(jsonAddr.default)
            .then(res => res.json())
            .then(data => {
              if (!this.globalContext.window.echarts.getMap(name)) {
                this.globalContext.window.echarts.registerMap(name, data);
                this.renderMap(name, styles, code);
              } else {
                this.renderMap(name, styles, code);
              }
            });
        }
      }
    },

    initMap(styles, code, name) {
      // 不传参绘制全国地图，传参根据adcode和地名绘制省级地图
      this.chart.clear();
      if (name === '' || code === undefined) {
        name = 'china';
        this.renderMap(name, styles, '100000');
      }
      // 单击下钻
      this.chart.on('click', params => {
        let code = '';
        let name = params.region.name;
        geoChina.features.forEach(province => {
          if (province.properties.name === name) {
            code = province.properties.adcode;
          }
        });
        if (
          code.substring(2) === '0000' &&
          code !== undefined &&
          municipality.indexOf(code) === -1
        ) {
          // 全国/省级地图点击时下钻，市级地图点击返回全国地图
          // adcode后四位为0时是省份。联动到该省并下钻
          // 如果是直辖市或特别行政区则判断为市
          this.linkage(code, name, 'province', styles);
        } else if (
          (code.substring(2) !== '0000' && code !== undefined) ||
          (municipality.indexOf(code) !== -1 && code !== undefined)
        ) {
          // adcode后四位不是4个0时是城市。联动到该市并下钻
          geoChinaCity.features.forEach(city => {
            // 从geoChinaCity里获取id，即adcode
            if (city.properties.name === name) {
              code = city.id;
            }
          });
          this.linkage(code, name, 'city', styles);
        } else {
          this.renderMap('china', styles, '100000');
        }
      });
      this.chart.on('contextmenu', params => {
        // 右键返回全国地图
        this.renderMap('china', styles, '100000');
      });
    },
  };
}
export default DrillDownMap;
