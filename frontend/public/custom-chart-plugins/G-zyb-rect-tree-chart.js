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

 function D3JSScatterChart({ dHelper }) {
       const svgIcon = `<svg t="1646129619526" class="icon" viewBox="0 0 128 128" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2825" width="200" height="200"><path d="M84.9444444,79.2951993 L4.9444444,79.2951993 C2.48984554,79.2951993 0.5,81.2651464 0.5,83.6951993 L0.5,127.695199 C0.5,130.125252 2.48984554,132.095199 4.9444444,132.095199 L84.9444444,132.095199 C86.1231844,132.095199 87.2536462,131.631629 88.0871413,130.806469 C88.9206363,129.981309 89.3888889,128.862152 89.3888889,127.695199 L89.3888889,83.6951993 C89.3888889,82.5282467 88.9206363,81.4090895 88.0871413,80.5839295 C87.2536462,79.7587694 86.1231844,79.2951993 84.9444444,79.2951993 L84.9444444,79.2951993 Z M156.055556,105.695199 L102.722222,105.695199 C101.543482,105.695199 100.41302,106.158769 99.5795254,106.983929 C98.7460304,107.80909 98.2777777,108.928247 98.2777777,110.095199 L98.2777777,127.695199 C98.2777777,128.862152 98.7460304,129.981309 99.5795254,130.806469 C100.41302,131.631629 101.543482,132.095199 102.722222,132.095199 L156.055556,132.095199 C158.510154,132.095199 160.5,130.125252 160.5,127.695199 L160.5,110.095199 C160.5,107.665146 158.510154,105.695199 156.055556,105.695199 L156.055556,105.695199 Z M156.055556,61.6951994 L102.722222,61.6951994 C101.543482,61.6951994 100.41302,62.1587694 99.5795254,62.9839295 C98.7460304,63.8090896 98.2777777,64.9282468 98.2777777,66.0951993 L98.2777777,92.4951993 C98.2777777,93.6621519 98.7460304,94.7813091 99.5795254,95.6064692 C100.41302,96.4316293 101.543482,96.8951993 102.722222,96.8951993 L156.055556,96.8951993 C158.510154,96.8951993 160.5,94.9252522 160.5,92.4951993 L160.5,66.0951993 C160.5,63.6651465 158.510154,61.6951994 156.055556,61.6951994 L156.055556,61.6951994 Z M156.055556,0.0951993491 L102.722222,0.0951993491 C101.543482,0.0951993149 100.41302,0.558769393 99.5795254,1.38392945 C98.7460304,2.20908951 98.2777777,3.32824674 98.2777777,4.49519931 L98.2777777,48.4951994 C98.2777777,49.662152 98.7460304,50.7813092 99.5795254,51.6064692 C100.41302,52.4316293 101.543482,52.8951994 102.722222,52.8951993 L156.055556,52.8951993 C158.510154,52.8951993 160.5,50.9252523 160.5,48.4951994 L160.5,4.49519931 C160.5,2.06514643 158.510154,0.0951993491 156.055556,0.0951993491 L156.055556,0.0951993491 Z M89.3888889,4.49519931 L89.3888889,66.0951993 C89.3888889,67.2621519 88.9206363,68.3813091 88.0871413,69.2064692 C87.2536462,70.0316293 86.1231844,70.4951993 84.9444444,70.4951993 L4.9444444,70.4951993 C2.48984554,70.4951993 0.5,68.5252522 0.5,66.0951993 L0.5,4.49519931 C0.5,2.06514643 2.48984554,0.0951993491 4.9444444,0.0951993491 L84.9444444,0.0951993491 C86.1231844,0.0951993149 87.2536462,0.558769393 88.0871413,1.38392945 C88.9206363,2.20908951 89.3888889,3.32824674 89.3888889,4.49519931 Z" p-id="2826"></path></svg>`
    return {
      config: {
        datas: [
          {
            label: 'dimension',
            key: 'dimension',
            required: true,
            type: 'group',
            limit: [0, 99]
          },
          {
            label: 'metrics',
            key: 'metrics',
            required: true,
            type: 'aggregate',
            limit: [0, 1]
          },
          {
            label: 'colorize',
            key: 'color',
            type: 'color',
            limit: [0, 99]
          }
        ],
        styles: [
          {
            label: 'border.borderTitle',
            key: 'border',
            comType: 'group',
            rows: [
              {
                label: 'border.borderColor',
                key: 'color',
                default: '#555',
                comType: 'fontColor'
              },
              {
                label: 'border.borderWidth',
                key: 'width',
                default: 4,
                comType: 'inputNumber'
              },
            ],
          },
          {
            label: 'label.title',
            key: 'label',
            comType: 'group',
            rows: [
              {
                label: 'label.showlabel',
                key: 'showlabel',
                default: true,
                comType: 'checkbox',
              },
              {
                label: 'label.position',
                key: 'position',
                comType: 'select',
                default: 'inside',
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
                label: 'viz.palette.style.font',
                key: 'font',
                comType: 'font',
                default: {
                  fontFamily: 'PingFang SC',
                  fontSize: '12',
                  fontWeight: 'normal',
                  fontStyle: 'normal',
                  color: 'black',
                },
              },
            ],
          },
          {
            label: 'breadcrumb.title',
            key: 'breadcrumb',
            comType: 'group',
            rows: [
              {
                label: 'breadcrumb.show',
                key: 'show',
                default: true,
                comType: 'checkbox',
              },
              {
                label: 'breadcrumb.top',
                key: 'top',
                comType: 'select',
                default: 'bottom',
                options: {
                  items: [
                    { label: '上', value: 'top' },
                    { label: '中', value: 'middle' },
                    { label: '下', value: 'bottom' },
                  ],
                },
              },
              {
                label: 'breadcrumb.left',
                key: 'left',
                comType: 'select',
                default: 'center',
                options: {
                  items: [
                    { label: '左', value: 'left' },
                    { label: '中', value: 'center' },
                    { label: '右', value: 'right' },
                  ],
                },
              },
              {
                label: 'breadcrumb.height',
                key: 'height',
                default: 22,
                comType: 'inputNumber',
              },
              {
                  label: 'breadcrumb.emptyItemWidth',
                  key: 'emptyItemWidth',
                  default: 25,
                  comType: 'inputNumber'
              },
              {
                label: 'viz.palette.style.font',
                key: 'font',
                comType: 'font',
                default: {
                  fontFamily: 'PingFang SC',
                  fontSize: '12',
                  fontWeight: 'normal',
                  fontStyle: 'normal',
                  color: '#fff',
                },
              },
            ],
          }
        ],
        settings: [
          {
            label: 'viz.palette.setting.paging.title',
            key: 'paging',
            comType: 'group',
            rows: [
              {
                label: 'viz.palette.setting.paging.pageSize',
                key: 'pageSize',
                default: 1000,
                comType: 'inputNumber',
                options: {
                  needRefresh: true,
                  step: 1,
                  min: 0,
                },
              },
            ],
          }
        ],
        i18ns: [
          {
            lang: 'zh-CN',
            translation: {
              chartName: '矩形树图',
              border: {
                borderTitle: '边框',
                borderColor: '颜色',
                borderWidth: '粗细'
              },
              label:{
                title:'标签',
                showlabel:'显示标签',
                position:'位置'
              },
              breadcrumb: {
                title: '面包屑',
                show: '显示面包屑',
                top: '垂直位置',
                left: '水平位置',
                height: '高度',
                emptyItemWidth: '最小宽度'
              }
            },
          },
          {
            lang: 'en',
            translation: {
                chartName: 'block tree chart',
                common: {
                  borderTitle: 'border',
                  borderColor: 'color',
                  borderWidth: 'width'
                },
                label:{
                  title:'label',
                  showlabel:'show',
                  position:'position'
                },
                tooltip: {},
                breadcrumb: {
                    title: 'breadcrumb',
                    show: 'show',
                    top: 'top',
                    left: 'left',
                    height: 'height',
                    emptyItemWidth: 'emptyItemWidth'
                  }
            },
          },
        ],
      },
      isISOContainer: 'demo-d3js-scatter-chart',
      dependency: ['https://lib.baomitu.com/echarts/5.1.1/echarts.min.js'],
      meta: {
        id: 'demo-rect-chart',
        name: 'chartName',
        icon:  svgIcon,
        requirements: [
          {
            group: [0, 999],
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
       // const styleConfigs = config.styles;
        const dataConfigs = config.datas || [];
         // 获取样式配置信息
        const styleConfigs = config.styles;

        // 获取颜色配置信息
        const colorConfigs = dataConfigs
        .filter(c => c.type === 'color')
        .flatMap(config => config.rows || []);
         
        // 列表数据转树形数据
        const  metricsLength = dataConfigs.filter(c => c.type === 'aggregate')[0].rows?.length;
        let treeData = this.arrDataToTreeLevel(dataset.rows,metricsLength,dataset.columns,colorConfigs)
       // console.log(dataset.rows,metricsLength,dataset.columns,colorConfigs)
        console.log(dataset)
        const option = {
            series: [
              {
                type: 'treemap',
                leafDepth: 1,
                data: treeData,
                label: this.getLabelStyle(styleConfigs),
                breadcrumb: this.getBreadCrumbStyle(styleConfigs),
                levels: [
                  {
                    itemStyle: this.getBorderStyle(styleConfigs)
                  }
                ]
              }
            ]
          };
         return option;          
      },
      getBreadCrumbStyle(style){
        const [
            show,
            top,
            left,
            height,
            emptyItemWidth,
            font
          ] = dHelper.getStyles(
            style,
            ['breadcrumb'],
            [
              'show',
              'top',
              'left',
              'height',
              'emptyItemWidth',
              'font'
            ],
          );
          return {
              show,
              top,
              left,
              height,
              emptyItemWidth,
              itemStyle:{
                  textStyle:font
              }
          }
      },
      getBorderStyle(style){
        const [
            color,
            width
          ] = dHelper.getStyles(
            style,
            ['border'],
            [
              'color',
              'width'
            ],
          );
          return {
            borderColor: color,
            borderWidth: width
          }
      },
      getLabelStyle(style){
        const [
            showlabel,
            position,
            font
          ] = dHelper.getStyles(
            style,
            ['label'],
            [
              'showlabel',
              'position',
              'font'
            ],
          );
          return {
            show:showlabel,
            position: position,
            ...font
          }
      },
      arrDataToTreeLevel(data,metricsLength,column,colorConfigs){
        let datas = JSON.parse(JSON.stringify(data))
        let newArr=[]
            for(let i=0;i<=datas?.length-1;i++){
              if(datas[i]?.length > metricsLength){
               let nodeName=datas[i][datas[i]?.length-1]
               let index = newArr.findIndex(item=>item.name==nodeName)
               if(index == -1){
                 let color = colorConfigs?.find(item=>item.colName==column[data[i]?.length-1].name)?.color?.colors.find(i=>i.key==nodeName)
                 let arr = datas[i].slice(0,datas[i]?.length-1)
                 let newArrItem = {name:nodeName,value:datas[i][0],itemStyle:{color:color?.value}}
                 if(arr?.length){
                    newArrItem = {...newArrItem,children:[arr]}
                 }
                 newArr.push(newArrItem)
               }else{
                  newArr[index].value+=datas[i][0];
                  let arr = datas[i].slice(0,datas[i]?.length-1)
                  newArr[index].children.push(arr)
               }
             }
            }
        newArr.forEach(item=>{
          if(item.children?.length){
             item.children = this.arrDataToTreeLevel(item.children,metricsLength,column,colorConfigs)
          }
        })
        return newArr
      }
    };
  }
  