function echartGlobe({dHelper}) {
  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
          maxFieldCount: 1
        },
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'aggregate',
          maxFieldCount: 1
        },
      ],
      styles: [
        {
          label: 'map.style',
          key: 'mapStyle',
          comType: 'group',
          rows: [
            {
              label: 'map.mode',
              key: 'mapMode',
              comType: 'select',
              default: '2d',
              options: {
                translateItemLabel: true,
                items: [
                  {label: 'map.3d', value: '3d'},
                  {label: 'map.2d', value: '2d'},
                ],
              },
            },
            {
              label: 'map.init.rotateX',
              key: 'rotateX',
              comType: 'inputNumber',
              default: -71,
              watcher: {
                deps: ['mapMode'],
                action: props => {
                  return {
                    disabled: props.mapMode == '2d',
                    hide: props.mapMode == '2d',
                  };
                },
              },
            },
            {
              label: 'map.init.rotateY',
              key: 'rotateY',
              comType: 'inputNumber',
              default: -21,
              watcher: {
                deps: ['mapMode'],
                action: props => {
                  return {
                    disabled: props.mapMode == '2d',
                    hide: props.mapMode == '2d',
                  };
                },
              },
            },
            // {
            //   label: 'darkMode',
            //   key: 'darkMode',
            //   comType: 'checkbox',
            //   default: false,
            //   options: {
            //     needRefresh: true,
            //   },
            // },
          ],
        },
      ],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            chartName: '全球GEO区划(非国家)',
            'map.style': '地图样式',
            'map.mode': '地图模式',
            'map.3d': '3D地球',
            'map.2d': '平面地图',
            darkMode: '暗黑模式',
            'map.init.rotateX': '水平旋转初始值',
            'map.init.rotateY': '垂直旋转初始值'
          },
        },
        {
          lang: 'en',
          translation: {
            chartName: 'GEO(Non-Country)',
            mapStyle: 'Map Style',
            'map.mode': 'Map Mode',
            'map.3d': '3D Globe',
            'map.2d': '2D Flat Map',
            darkMode: 'Dark Mode',
            'map.init.rotateX': 'Horizontal rotation initial value',
            'map.init.rotateY': 'Vertical rotation initial value'
          },
        },
      ],
      settings: [
        {
          label: '维度设置',
          key: 'geo_map_dim',
          comType: 'group',
          rows: [
            {
              label: 'GEO值类型',
              key: 'nameProperty',
              default: 'name',
              comType: 'select',
              options: {
                needRefresh: true,
                items: [
                  {label: 'Alpha-2 code，如CN', value: 'iso_a2'},
                  {label: 'Alpha-3 code，如CHN', value: 'iso_a3'},
                  {label: 'GEO名称，如China', value: 'name'},
                  {label: 'Numeric code，如156', value: 'iso_n3'},
                  {label: '国际邮编，如CN', value: 'postal'},
                ]
              },
            },
          ],
        },
      ],
    },
    isISOContainer: 'echart-geo',
    dependency: ['https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js'
      , 'https://cdnjs.cloudflare.com/ajax/libs/echarts/5.3.0/echarts.min.js'
      , 'https://cdn.jsdelivr.net/npm/dat.gui@0.6.5/build/dat.gui.min.js'
      , 'https://cdn.jsdelivr.net/npm/d3-array'
      , 'https://cdn.jsdelivr.net/npm/d3-geo'],
    meta: {
      id: 'map-projection-globe',
      name: 'chartName',
      icon: 'globe-west',
      requirements: [
        {
          group: 1,
          aggregate: 1,
        },
      ],
    },
    onMount(options, context) {
      let _this = this;
      if ('echarts' in context.window) {
        this.chart = context.window.echarts.init(
            context.document.getElementById(options.containerId),
            'default',
        );
        const {$, echarts, d3, pWin = parent} = context.window;
        var cssFile = pWin.document.createElement('link');
        cssFile.rel = 'stylesheet';
        cssFile.href = "/custom-chart-plugins/A-echart-geo-map/index.css";
        pWin.document.head.appendChild(cssFile);
        //geo json生成地址 https://geojson-maps.ash.ms/
        $.when(
            $.get('/custom-chart-plugins/A-echart-geo-map/custom.geo.json'),
            $.getScript('https://cdn.jsdelivr.net/npm/d3-array'),
            $.getScript('https://cdn.jsdelivr.net/npm/d3-geo')
        ).done(function (res) {
          _this.geoJson = res[0];
          _this.containerId = options.containerId;
          echarts.registerMap('world', _this.geoJson);
          _this.onUpdated.call(_this, options, context);
        });
      }
    },
    getConfigValue(options, group, key, prop = 'styles') {
      return options.config[prop].filter(x => x.key == group)[0].rows.filter(x => x.key == key)[0].value;
    },
    onUpdated(options, context) {
      let _this = this;
      if (!options.dataset || !options.dataset.columns || !options.config || !_this.geoJson) {
        return;
      }
      let container = context.document.getElementById(_this.containerId);
      let myChart = this.chart;
      const {$, echarts, d3} = context.window;

      let projection = d3.geoOrthographic();
      let is3d = _this.getConfigValue.call(this, options, 'mapStyle', 'mapMode') == '3d';
      //let darkMode = options.config.styles.filter(x => x.key == 'mapStyle')[0].rows.filter(x => x.key == 'darkMode')[0].value;

      myChart.showLoading();

      if (is3d) {
        _this.datConfig = {
          rotateX: _this.getConfigValue.call(this, options, 'mapStyle', 'rotateX'),
          rotateY: _this.getConfigValue.call(this, options, 'mapStyle', 'rotateY'),
          onChange() {
            projection && projection.rotate([_this.datConfig.rotateX, _this.datConfig.rotateY]);
            myChart.dispatchAction({
              type: 'dataZoom'
            });
          }
        };
        _this.datConfigParameters = {
          rotateX: {
            min: -180,
            max: 180
          },
          rotateY: {
            min: -80,
            max: 80
          }
        };
        _this.initControlPanel.call(this, options, context);
        // 添加标线 --start-
        const graticuleLineStrings = [];
        for (let lat = -80; lat <= 80; lat += 10) {
          graticuleLineStrings.push(createLineString([-180, lat], [180, lat]));
        }
        for (let lng = -180; lng <= 180; lng += 10) {
          graticuleLineStrings.push(createLineString([lng, -80], [lng, 80]));
        }
        //深拷贝
        let geoJson2 = JSON.parse(JSON.stringify(_this.geoJson));
        geoJson2.features.unshift({
          geometry: {
            type: 'MultiLineString',
            coordinates: graticuleLineStrings
          },
          properties: {
            name: 'graticule'
          }
        });
        echarts.registerMap('world', geoJson2);
        setTimeout(function () {
          //todo 初始位置
          projection && projection.rotate([_this.datConfig.rotateX, _this.datConfig.rotateY]);
          myChart.dispatchAction({
            type: 'dataZoom'
          });
        });
      } else {
        //从3d切换到2d必须释放实例重新构造
        myChart.dispose();
        myChart = _this.chart = echarts.init(
            container,
            'default',
        );
        //深拷贝
        echarts.registerMap('world', JSON.parse(JSON.stringify(_this.geoJson)));
      }

      let option = {
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2
        },
        // darkMode: darkMode,
        // backgroundColor: 'deepskyblue',
        toolbox: {
          show: true,
          //orient: 'vertical',
          left: 'left',
          top: 'top',
          feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
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
              '#a50026'
            ]
          },
          text: ['High', 'Low'],
          calculable: true
        }
        , series: getSerie()
      };
      //用最小值和最大值构建色阶
      let valArr = options.dataset.rows.map(arr => arr[0]);
      option.visualMap.min = Math.floor(Math.min.apply(Math, valArr));
      option.visualMap.max = Math.ceil(Math.max.apply(Math, valArr));
      myChart.setOption(option);
      myChart.hideLoading();

      function getSerie() {
        let metrics = options.config.datas.filter(x => x.key == 'metrics')[0].rows[0];
        let dimension = options.config.datas.filter(x => x.key == 'dimension')[0].rows[0];
        let data = {
          type: 'map',
          roam: !is3d,
          nameProperty: _this.getConfigValue.call(this, options, 'geo_map_dim', 'nameProperty', 'settings'),
          map: 'world',
          name: `${metrics?.alias?.name || metrics.colName} ${metrics?.alias?.desc || ''}`,
          itemStyle: {
            borderColor: '#ccc',
            borderWidth: 1,
            borderJoin: 'round',
            color: '#eee'
          },
          emphasis: {
            label: {
              show: true
            }
          },
          data: options.dataset.rows.map(arr => ({name: arr[1], value: arr[0]}))
        };
        if (is3d) {
          data.projection = {
            project: (pt) => projection(pt),
            unproject: (pt) => projection.invert(pt),
            stream: projection.stream
          };
        }
        return [data];
      }

      function createLineString(start, end) {
        const dx = end[0] - start[0];
        const dy = end[1] - start[1];
        const segs = 50;
        const stepX = dx / segs;
        const stepY = dy / segs;
        const points = [];
        // TODO needs adaptive sampling on the -180 / 180 of azimuthal projections.
        for (let i = 0; i <= segs; i++) {
          points.push([start[0] + i * stepX, start[1] + i * stepY]);
        }
        return points;
      }
    },
    initControlPanel(opt, context) {
      let _this = this;
      const {$, echarts, d3, dat} = context.window;
      let gui = new dat.GUI({
        autoPlace: false
      });
      $(gui.domElement).css({
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 1000
      });
      let $container = $(context.document.getElementById(_this.containerId));
      $container.append(gui.domElement);
      var configParameters = _this.datConfigParameters || {};
      for (var name in _this.datConfig) {
        var value = _this.datConfig[name];
        if (name !== 'onChange' && name !== 'onFinishChange') {
          var isColor = false;
          // var value = obj;
          var controller = null;
          if (configParameters[name]) {
            if (configParameters[name].options) {
              controller = gui.add(
                  _this.datConfig,
                  name,
                  configParameters[name].options
              );
            } else if (configParameters[name]?.min != null) {
              controller = gui.add(
                  _this.datConfig,
                  name,
                  configParameters[name].min,
                  configParameters[name].max
              );
            }
          }
          if (typeof value === 'string') {
            try {
              var colorArr = echarts.color.parse(value);
              isColor = !!colorArr;
              if (isColor) {
                value = echarts.color.stringify(colorArr, 'rgba');
              }
            } catch (e) {
            }
          }
          if (!controller) {
            controller = gui[isColor ? 'addColor' : 'add'](
                _this.datConfig,
                name
            );
          }
          _this.datConfig.onChange &&
          controller.onChange(_this.datConfig.onChange);
          _this.datConfig.onFinishChange &&
          controller.onFinishChange(_this.datConfig.onFinishChange);
        }
      }
    },
    onResize(opt, context) {
      this.chart && this.chart.resize(context);
    },
    onUnMount() {
      this.chart && this.chart.dispose();
    },
  }
}
