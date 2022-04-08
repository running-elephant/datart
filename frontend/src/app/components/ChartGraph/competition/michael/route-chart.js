/**
 * 自定义扩展世界地图
 * @param dHelper 构建参数
 * @returns 返回组件
 */

import geoChina from './geojson/geo-china.map.json';

function RouteChart({ dHelper }) {
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
        {
          label: 'route.title',
          key: 'route',
          comType: 'group',
          rows: [
            {
              label: 'route.color',
              key: 'color',
              default: 'blue',
              comType: 'fontColor',
            },
            {
              label: 'route.width',
              key: 'width',
              default: 2,
              comType: 'inputNumber',
            },
            {
              label: 'route.speed',
              key: 'speed',
              default: 30,
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
            route: {
              title: '轨迹',
              color: '线条颜色',
              width: '线条宽度',
              speed: '速度',
            },
          },
        },
      ],
    },
    isISOContainter: 'route-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'route-chart',
      name: '轨迹图',
      icon: 'ditu',
      requirements: [{ group: 1, aggregate: 2 }],
    },

    onMount(options, context) {
      this.globalContext = context;
      if ('echarts' in context.window) {
        if (!this.globalContext.window.echarts.getMap('china')) {
          context.window.echarts.registerMap('china', geoChina);
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
      const objDataColumns = dHelper.transformToObjectArray(
        dataset.rows,
        dataset.columns,
      );
      const styleConfigs = config.styles;
      const dataConfigs = config.datas || [];

      const dimensionTitle = dataConfigs[0].rows[0].colName;

      let longitude = dataConfigs[1].rows[0].colName; // 指标栏第一个是经度，第二个是纬度
      let latitude = dataConfigs[1].rows[1].colName;

      let coordList = [];
      objDataColumns.forEach(record => {
        coordList.push([record[longitude], record[latitude]]);
      });

      // 底图样式
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

      // 轨迹样式
      const routeColor = dHelper.getStyleValueByGroup(
        styleConfigs,
        'route',
        'color',
      );
      const routeWidth = dHelper.getStyleValueByGroup(
        styleConfigs,
        'route',
        'width',
      );
      const speed = dHelper.getStyleValueByGroup(
        styleConfigs,
        'route',
        'speed',
      );

      let options = {
        geo: [
          {
            map: 'china',
            roam: enableZoom,
            emphasis: {
              focus: 'none',
              itemStyle: {
                areaColor: areaColor,
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
            // 位置及缩放
            layoutCenter: ['40%', '58%'],
            layoutSize: 550,
            zoom: 1.1,
          },
        ],
        tooltip: {},

        series: [
          {
            name: 'route',
            type: 'lines',
            coordinateSystem: 'geo',
            geoIndex: 0,
            polyline: true,
            lineStyle: {
              color: routeColor,
              width: routeWidth,
              opacity: 1,
            },
            effect: {
              show: true,
              period: 8,
              color: '#14CAFF',
              constantSpeed: speed,
              trailLength: 0,
              symbolSize: [12, 30],
              symbol:
                'path://M87.1667 3.8333L80.5.5h-60l-6.6667 3.3333L.5 70.5v130l10 10h80l10 -10v-130zM15.5 190.5l15 -20h40l15 20zm75 -65l-15 5v35l15 15zm-80 0l15 5v35l-15 15zm65 0l15 -5v-40l-15 20zm-50 0l-15 -5v-40l15 20zm 65,-55 -15,25 c -15,-5 -35,-5 -50,0 l -15,-25 c 25,-15 55,-15 80,0 z',
            },
            // effect: {
            //     show: true,
            //     period: 8,
            //     // color: 'black',
            //     constantSpeed: speed,
            //     trailLength: 0,
            //     symbolSize: [15, 35],
            //   // symbol:'rect',
            //     // symbol: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAANCAYAAABVRWWUAAAAAXNSR0IArs4c6QAAA55JREFUOE+lk11oHFUUx//n7p2dZLqzX9l87pNJEBVFybZGWsQXQRSKLQVBBEV8UUgDBr/qiz4URRRMMWmj6YcVpZpkY1ODJgZN+oERS54qlKqQSI0msdnddJOZnTsz98pMoyl9auN5PJdzfvf/P/yp9fa73vB27DRE1CBZl51TmWwBwgYz4glVm30MIA6wCPmigMW5r6UnfTAiBEVMcauspS6cmfz584OXg1ZGqaZI/lyODuzfunBm7Hh1ttVFMtnErhTm1pZmF4Mpam17QNHbJ6GbCSjPC1rhvpspYgzCWoU2NTDjpLOs+sfRVefO9mZpmE36pRmlP/WyBSEsFBdqZHHRckb6nrk4Mfol3Zbb7qU+GEc2GYPnKdBNQhUAzkAF2/FLg4fcyiPPGlL5SIwdg/7TGPyYqbiUZD29D05bu/IFiE+c/GOta3c7Nee2q0T3OBo3B0XBFrI82GMV93RuEUku6z47SJmpPJU0TlQuKqflXvgv9cMCfL+0xPX+NztCaKx7HPXJGPxbVBphQMkW0hrqqZR27TXcmIZ0vh8Np/OwdB2iUoZbtQXFVz6BlkxJ4UoWHfv4RAg1usdRE49BeuqWbsoIKDtCinxPpbir03BNjtTwETRMDsAzTFhWCR6A5ddPQNbUSvLBIudOjQY3VakDm74pCpaQpVBpp+GZHIn8YTRODkCaKVSsFVSkH0JVOiOhwNj57yZCpdXd40j/D6XedUrTw0dQ//0XIdRzLJQ9G4V9AbRWQoLx04MjG/YmNmEvA67aQroB9PEOw41FkR7qQ/3ZYUgzDeVUUOAM5VePQ4uZ/pojItFTfUcDqIy//w01JuPwPKluiMyNoQ2SEta1yFAYmdWhXqv4RKchMlw1HD1EtVND5JkpUlf+UoW2h5T7/Fu4KqH4whzX3+vYQ81bdyijdwypRAy+G6za4JAKd/9Xiq57BMAYULYcKYc/FGLbo1VscQ76rzMw/p5HhGvwEhms7nwOfm295LbH3K8O/3Bx/wsPUut99zuqqzcaMeIAIwdcE1CBYGI+jxr/EkkpRZ6w1kVeazOmpL2mR89/e8xON16unhqMVh5+8m6/2mxlZ0fq5YvvXtBmf7FYabkp8udvS5VP3+manZ29RC0tLTnSjJgbiTJf58vMMFexsgJxR1sVdu/dpohxMGJkl1e0j16bgQNA31AfrdhUp2N+enraXrdJNeVyGW1h4Z7f5+cng68BkOsToY3/ACrJz3h/YdBFAAAAAElFTkSuQmCC'
            // },
            data: [
              {
                // coords: [
                //   // 测试数据中的经纬度不适用，暂时写死
                //   [116.405285, 39.904989],
                //   [113.665412, 34.757975],
                //   [117.283042, 31.86119],
                //   [112.982279, 28.19409],
                //   [104.065735, 30.659462],
                //   [106.504962, 29.533155],
                //   [108.320004, 22.82402],
                //   [113.280637, 23.125178],
                // ],
                coords: coordList,
              },
            ],
          },
        ],
      };
      return options;
    },
  };
}

export default RouteChart;
