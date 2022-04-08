/* eslint-disable */
import { requestStatic } from './request';


/**
 * 自定义扩展路径图
 * @param dHelper 构建参数
 * @returns 返回组件
 */
 function geoSvgLinesChart({ dHelper }) {
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
            },
            {
              label: 'metrics',
              key: 'metrics',
              required: true,
              type: 'aggregate',
            },
            {
              label: 'filter',
              key: 'filter',
              type: 'filter',
              allowSameField: true,
            },
          ],
          // 数据设置： 用于设置维度及指标配置等
          styles: [
            {
              label: 'graph.title',
              key: 'graph',
              comType: 'group',
              rows: [
                {
                  label: 'graph.smooth',
                  key: 'smooth',
                  default: false,
                  comType: 'checkbox',
                },
                {
                  label: 'graph.step',
                  key: 'step',
                  default: false,
                  comType: 'checkbox',
                },
              ],
            }
          ],
          // 组件设置
          settings: [

          ]
        },
        isISOContainer: 'geo-svg-lines-chart',
        dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
        // 组件元数据：id，名称，图标，依赖等
        meta: {
          id: 'geo-svg-lines-chart',
          name: '扩展组件路径图',
          icon: 'chart',
          requirements: [
            {
              group: 1,
              aggregate: [1, 999],
            },
          ],
        },
        styles: [
          {
            label: 'graph.title',
            key: 'graph',
            comType: 'group',
            rows: [
              {
                label: 'graph.smooth',
                key: 'smooth',
                default: false,
                comType: 'checkbox',
              },
              {
                label: 'graph.step',
                key: 'step',
                default: false,
                comType: 'checkbox',
              },
            ],
          }
        ],
        settings:[],
        i18ns: [
          {
            lang: 'zh-CN',
            translation: {
              graph: {
                title: '扩展组件路径图',
                smooth: '平滑',
                step: '阶梯',
              }
            }
          }
        ],

        // 组件对象挂载时调用，可用于对组件进行初始化
        onMount(options, context) {
            if ('echarts' in context.window) {
              // 获取地图svg，后续可根据实际需要进行修改
              const data  = requestStatic({
                url: "https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/geo/MacOdrum-LV5-floorplan-web.svg",
                method: 'GET'
              }).then(svg=>{
                try{
                  // echarts注册地图组件
                  context.window.echarts.registerMap('MacOdrum-LV5-floorplan-web', { svg: svg });
                }catch(e){
                  console.log("echarts.registerMap('MacOdrum-LV5-floorplan-web') error: ", e);
                }
                
                // 组件对象初始化
                this.chart = context.window.echarts.init(
                  context.document.getElementById(options.containerId),
                  'default'
                );
                this.onUpdated(options);
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
          
          // 根据组件配置信息，组装构造echart组件选型信息
          getOptions(dataset, config) {
            let option = {
              title: {
                text: 'Visit Route',
                left: 'center',
                bottom: 10
              },
              tooltip: {},
              geo: {
                map: 'MacOdrum-LV5-floorplan-web',
                roam: true,
                emphasis: {
                  itemStyle: {
                    color: undefined
                  },
                  label: {
                    show: false
                  }
                }
              },
              series: [
                {
                  name: 'Route',
                  type: 'lines',
                  coordinateSystem: 'geo',
                  geoIndex: 0,
                  emphasis: {
                    label: {
                      show: false
                    }
                  },
                  polyline: true,
                  lineStyle: {
                    color: '#c46e54',
                    width: 5,
                    opacity: 1,
                    type: 'dotted'
                  },
                  effect: {
                    show: true,
                    period: 8,
                    color: '#a10000',
                    constantSpeed: 80,
                    trailLength: 0,
                    symbolSize: [20, 12],
                    symbol:
                      'path://M35.5 40.5c0-22.16 17.84-40 40-40s40 17.84 40 40c0 1.6939-.1042 3.3626-.3067 5H35.8067c-.2025-1.6374-.3067-3.3061-.3067-5zm90.9621-2.6663c-.62-1.4856-.9621-3.1182-.9621-4.8337 0-6.925 5.575-12.5 12.5-12.5s12.5 5.575 12.5 12.5a12.685 12.685 0 0 1-.1529 1.9691l.9537.5506-15.6454 27.0986-.1554-.0897V65.5h-28.7285c-7.318 9.1548-18.587 15-31.2715 15s-23.9535-5.8452-31.2715-15H15.5v-2.8059l-.0937.0437-8.8727-19.0274C2.912 41.5258.5 37.5549.5 33c0-6.925 5.575-12.5 12.5-12.5S25.5 26.075 25.5 33c0 .9035-.0949 1.784-.2753 2.6321L29.8262 45.5h92.2098z'
                  },
                  data: [
                    {
                      coords: [
                        [110.6189462165178, 456.64349563895087],
                        [124.10988522879458, 450.8570048730469],
                        [123.9272226116071, 389.9520693708147],
                        [61.58708083147317, 386.87942320312504],
                        [61.58708083147317, 72.8954315876116],
                        [258.29514854771196, 72.8954315876116],
                        [260.75457021484374, 336.8559607533482],
                        [280.5277985253906, 410.2406672084263],
                        [275.948185765904, 528.0254369698661],
                        [111.06907909458701, 552.795792593471],
                        [118.87138231445309, 701.365737015904],
                        [221.36468155133926, 758.7870354617745],
                        [307.86195445452006, 742.164737297712],
                        [366.8489324762834, 560.9895157073103],
                        [492.8750778390066, 560.9895157073103],
                        [492.8750778390066, 827.9639780566406],
                        [294.9255269587053, 827.9639780566406],
                        [282.79803391043527, 868.2476088113839]
                      ]
                    }
                  ]
                }
              ]
            };
            return option
          }
    };
  }
  export default geoSvgLinesChart;
  