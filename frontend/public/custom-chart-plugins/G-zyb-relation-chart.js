function G6JSRelationChart({ dHelper }) {
  // 关系图icon
  const svgIcon = `<svg t="1646129619526" class="icon" viewBox="0 0 1064 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2825" width="200" height="200"><path d="M878.00959619 715.03078731c-21.33946406 0-42.24710127 5.82966826-60.38384677 16.87724912l-2.66293477 1.61935224-103.63854463-106.87724912 1.97920899-2.87884775c22.81487432-32.60295878 34.87005176-71.25149971 34.87005175-111.73530586a195.04198301 195.04198301 0 0 0-34.65413876-111.55537793l-2.01519405-2.8428627 103.7105165-106.98520605 2.66293477 1.61935225a117.60095917 117.60095917 0 0 0 60.13194697 16.66133525C943.97121143 308.93322676 997.62574941 253.58736465 997.62574941 185.53858438 997.62574941 117.52579004 943.97121143 62.17992793 878.00959619 62.17992793c-65.96161523 0-119.65213916 55.34586123-119.65213916 123.35865645a127.38904453 127.38904453 0 0 0 16.19352247 62.11115595l1.54738125 2.7708917-103.7824875 107.05717705-2.77089083-2.01519404a181.36745332 181.36745332 0 0 0-228.94042412 11.58736465 193.31467383 193.31467383 0 0 0-62.11115596 115.83766494l-0.53978378 3.52658935H298.64134356l-0.7197126-3.20271855c-13.0627749-55.4178331-60.88764463-94.13834502-116.30547773-94.13834502C115.65453799 389.07317041 62 444.41903252 62 512.46781279c0 68.01279521 53.65453799 123.35865644 119.61615322 123.35865645 53.1147542 0 100.39984013-36.77728887 115.04598223-89.42423028l0.82766865-2.98680556h81.25549804l0.61175479 3.38264736c16.19352247 90.97161152 93.0947625 157.00519776 182.87884864 157.00519776 38.57656904 0 75.56977177-12.09116338 107.02119199-34.9780087l2.73490576-1.9792081 103.92642949 107.12914805-1.58336719 2.77089169a125.73370635 125.73370635 0 0 0-16.04957958 61.67932823c0 68.04878028 53.65453799 123.39464239 119.61615321 123.39464238 65.96161523 0 119.65213916-55.34586123 119.65213917-123.39464238 0-68.04878028-53.65453799-123.39464239-119.54418223-123.39464239z m-315.77369062-68.26469415a127.64094346 127.64094346 0 0 1-92.33906396-39.47620868 135.91763262 135.91763262 0 0 1-38.25269913-95.25389854c0-35.98560615 13.56657364-69.81207539 38.25269913-95.25389854a127.82087138 127.82087138 0 0 1 184.71411386 0 135.91763262 135.91763262 0 0 1 38.28868506 95.25389854c0 35.98560615-13.60255869 69.81207539-38.28868506 95.25389854a127.64094346 127.64094346 0 0 1-92.3750499 39.47620868z m315.77369062-527.58496582c35.48180742 0 64.34226299 29.76009609 64.34226299 66.39344297 0 36.59736094-28.86045557 66.35745703-64.34226299 66.35745703-13.02678896 0-25.62175107-4.03038809-35.84166328-11.15553779l-17.12914804-17.56097578a67.29308261 67.29308261 0 0 1-11.4074376-37.67692939c0-36.59736094 28.86045557-66.35745703 64.37824892-66.35745704z m0 785.63774532c-35.51779248 0-64.37824893-29.79608115-64.37824892-66.39344297s28.86045557-66.39344297 64.37824892-66.39344209c35.48180742 0 64.34226299 29.79608115 64.34226299 66.39344209s-28.86045557 66.39344297-64.34226299 66.39344297zM181.61615323 445.96641377c35.51779248 0 64.37824893 29.79608115 64.37824892 66.39344209s-28.86045557 66.35745703-64.37824893 66.35745703c-35.48180742 0-64.34226299-29.76009609-64.34226299-66.35745703 0-36.59736094 28.86045557-66.39344297 64.34226299-66.39344209z" p-id="2826"></path></svg>`
   return {
    //  配置面板
     config: {
       datas: [
         // 字段 依次拖入id(主键字段)、父Id字段、value(节点值字段)
         {
           label: 'mixed',
           key: 'mixed',
           required: true,
           type: 'mixed',
         },
       ],
       styles: [
         {
          label: 'chartCfg.title',
          key: 'chartCfg',
          comType: 'group',
          rows:[
            {
              label: 'chartCfg.dragCanvas',
              key: 'dragCanvas',
              comType: 'switch',
              default:true,
            },
            {
              label: 'chartCfg.zoomCanvas',
              key: 'zoomCanvas',
              comType: 'switch',
              default:true,
            },
            {
              label: 'chartCfg.dragNode',
              key: 'dragNode',
              comType: 'switch',
              default:false,
            },
            {
              label: 'chartCfg.activateRelations',
              key: 'activateRelations',
              comType: 'switch',
              default:false,
            },
          ]
         },
        {
          label: 'layoutCfg.title',
          key: 'layoutCfg',
          comType: 'group',
          rows:[
           
            {
              label: 'layoutCfg.direction',
              key: 'direction',
              comType: 'select',
              default:'TB',
              options: {
                translateItemLabel: true,
                items: [
                  { label: 'layoutCfg.TB', value: 'TB' },//根节点在上，往下布局
                  { label: 'layoutCfg.BT', value: 'BT' },//根节点在下，往上布局
                  { label: 'layoutCfg.LR',value:'LR'},//根节点在左，往右布局
                  { label: 'layoutCfg.H',value:'H'},//根节点在中间，水平对称布局
                  { label: 'layoutCfg.RL',value:'RL'},//根节点在右，往左布局
                  { label: 'layoutCfg.V',value:'V'},//根节点在中间，垂直对称布局
                ],
              },
            },
            {
              label: 'layoutCfg.nodeSep',
              key: 'nodeSep', //节点间距
              comType: 'inputNumber',
              default: 100,
            },
            {
              label: 'layoutCfg.rankSep',
              key: 'rankSep', //层与层间距
              comType: 'inputNumber',
              default: 150,
            },
            {
              label: 'layoutCfg.isRadial',
              key: 'isRadial',
              comType: 'switch',
              default:false,
            },
          ]
         },
         {
           label: 'nodeCfg.title',
           key: 'nodeCfg',
           comType: 'group',
           rows: [
             {
               label: 'nodeCfg.shape',
               key: 'shape',
               comType: 'select',
               default:'circle',
               options: {
                 translateItemLabel: true,
                 items: [
                   { label: 'nodeCfg.circle', value: 'circle' },
                   { label: 'nodeCfg.diamond',value:'diamond'},
                   { label: 'nodeCfg.triangle',value:'triangle'},
                  //  { label: 'nodeCfg.rect', value: 'rect' },
                   // { label: 'nodeCfg.ellipse', value: 'ellipse' },
                   { label: 'nodeCfg.star',value:'star'},
                 ],
               },
             },
             {
               label: 'nodeCfg.size',
               key: 'size',
               default: 40,
               comType: 'inputNumber',  
             },
             {
               label: 'nodeCfg.fill',
               key: 'fill',
               default: '#40a9ff',
               comType: 'fontColor',
             },
             {
               label: 'nodeCfg.stroke',
               key: 'stroke',
               default: '#096dd9',
               comType: 'fontColor',
             },
             {
              label: 'nodeCfg.opacity',
              key: 'opacity',
              default: 1,
              comType: 'inputNumber',
              options: {
                // needRefresh: true,
                step: 0.1,
                min: 0,
                max: 1
              },
            },
             {
              label: 'nodeCfg.shadowColor',
              key: 'shadowColor',
              default: '#096dd9',
              comType: 'fontColor',
            },
            {
              label: 'nodeCfg.shadowBlur',
              key: 'shadowBlur',
              default: 10,
              comType: 'inputNumber',
            },
            {
              label: 'nodeCfg.shadowOffsetX',
              key: 'shadowOffsetX',
              default: 5,
              comType: 'inputNumber',
            },
            {
              label: 'nodeCfg.shadowOffsetY',
              key: 'shadowOffsetY',
              default: 5,
              comType: 'inputNumber',
            },
            {
              label: 'labelCfg.fontFamily',
              key: 'fontFamily',
              default: '默认字体',
              comType: 'fontFamily',
            },
             {
               label: 'labelCfg.fontSize',
               key: 'fontSize',
               default: 20,
               comType: 'inputNumber',
             },
             {
               label: 'labelCfg.fill',
               key: 'labelColor',
               default: '#000000',
               comType: 'fontColor',
             },
             {
               label: 'labelCfg.position',
               key: 'position',
               default: 'bottom',
               comType: 'select',
               options: {
                 translateItemLabel: true,
                 items: [
                   { label: 'labelCfg.center', value: 'center' },
                   { label: 'labelCfg.top',value:'top'},
                   { label: 'labelCfg.bottom',value:'bottom'},
                   { label: 'labelCfg.left',value:'left'},
                   { label: 'labelCfg.right',value:'right'},
                 ],
               },
             },
             {
              label: 'labelCfg.offset',
              key: 'offset',
              default: 10,
              comType: 'inputNumber',
             },
             {
              label: 'labelCfg.rotate',
              key: 'rotate',
              default: 0,
              comType: 'inputNumber',
              options: {
                // needRefresh: true,
                step: 1,
                min: 0,
                max: 7
              },
             }
           ],
         },
         {
           label: 'edgeCfg.title',
           key: 'edgeCfg',
           comType: 'group',
           rows: [
             {
               label: 'edgeCfg.shape',
               key: 'shape',
               comType: 'select',
               default:'line',
               options: {
                 translateItemLabel: true,
                 items: [
                   { label: 'edgeCfg.line', value: 'line' },
                   { label: 'edgeCfg.arc', value: 'arc' },
                   { label: 'edgeCfg.cubic', value: 'cubic' },
                   { label: 'edgeCfg.polyline',value:'polyline'}
                 ],
               },
             },
              {
               label: 'edgeCfg.lineWidth',
               key: 'lineWidth',
               comType: 'inputNumber',
               default: 2,
             },
              {
               label: 'edgeCfg.stroke',
               key: 'stroke',
               comType: 'fontColor',
               default:'#A3B1BF',
             },
             {
              label: 'edgeCfg.opacity',
              key: 'opacity',
              default: 1,
              comType: 'inputNumber',
              options: {
                // needRefresh: true,
                step: 0.1,
                min: 0,
                max: 1
              },
            },
             {
              label: 'edgeCfg.shadowColor',
              key: 'shadowColor',
              default: '#fff',
              comType: 'fontColor',
            },
            {
              label: 'edgeCfg.shadowBlur',
              key: 'shadowBlur',
              default: 10,
              comType: 'inputNumber',
            },
            {
              label: 'edgeCfg.shadowOffsetX',
              key: 'shadowOffsetX',
              default: '5',
              comType: 'inputNumber',
            },
            {
              label: 'edgeCfg.shadowOffsetY',
              key: 'shadowOffsetY',
              default: 5,
              comType: 'inputNumber',
            },
           ],
         },
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
         },
       ],
       i18ns: [
         {
           lang: 'zh-CN',
           translation: {
             chartName: '关系图',
             chartCfg:{
               title:'图配置',
               dragCanvas:'是否允许拖拽画布',
               zoomCanvas:'是否允许缩放画布',
               dragNode:'是否允许拖拽节点',
               activateRelations:'覆盖节点高亮',
             },
             layoutCfg:{
               title:'布局配置',
               isRadial:'是否开启辐射布局',
               direction:'树布局方向',
               TB:'由上至下',
               LR:'由左至右',
               H:'水平对称',
               BT:'由下至上',
               RL:'由右至左',
               V:'垂直对称',
               nodeSep:'节点间距',
               rankSep:'层与层间距'
             },
             nodeCfg:{
               title:'节点配置',
               shape:'节点形状',
               circle:'圆形',
               diamond:'菱形',
               triangle:'三角形',
              //  rect:'矩形',
               // ellipse:'椭圆形',
               star:'星形', 
               size:'节点大小',
               fill:'节点填充色',
               stroke:'节点描边色',
               shadowColor:'节点阴影色',
               shadowBlur:'阴影模糊级别',
               shadowOffsetX:'阴影水平距离',
               shadowOffsetY:'阴影垂直距离',
               opacity:'节点透明度'
             },
             edgeCfg:{
               title:'边配置',
               shape:'线条类型',
               line:'直线',
               arc:'弧线',
               cubic:'波浪线',
               polyline:'折线',
               stroke:'线条颜色',
               lineWidth:'线条宽度',
               shadowColor:'边阴影色',
               shadowBlur:'阴影模糊级别',
               shadowOffsetX:'阴影水平距离',
               shadowOffsetY:'阴影垂直距离',
               opacity:'线条透明度'
             },
             labelCfg:{
               fontSize:'文本字体大小',
               fill:'文本字体颜色',
               fontFamily:'文本字体类型',
               position:'文本位置',
               offset:'文本偏移距离',
               rotate:'文本旋转角度',
               center:'居中',
               top:'靠上',
               bottom:'靠下',
               left:'靠左',
               right:'靠右'
             },
             viz: {
               palette: {
                 data: {
              //      drop: '请依次拖拽id(主键字段)、父id字段、value(节点值字段)',
              drop:'请依次拖拽类id字段(例如:id)、类父id字段（例如:pid）、类节点值字段(例如：value)'
                 },
               },
             },
           },
         },
         {
           lang: 'en',
           translation: {
            chartName: 'Relation Chart',
            chartCfg:{
              title:'Chart Config',
              dragCanvas:'Drag Canvans',
              zoomCanvas:'Zoom Canvas',
              dragNode:'Drag Node',
              activateRelations:'Node Hover HighLight',
            },
            layoutCfg:{
              title:'Layout Config',
              isRadial:'Open Radial Layout',
              direction:'Tree Layout Direction',
              TB:'Top To Bottom',
              LR:'Left To Right',
              H:'Horizontal Symmetry',
              BT:'Bottom To Top',
              RL:'Right To Left',
              V:'Vertical Symmetry',
              nodeSep:'Node Spacing',
              rankSep:'Rank Spacing'
            },
            nodeCfg:{
              title:'Node Config',
              shape:'Node Type',
              circle:'Circle',
              diamond:'Diamond',
              triangle:'Triangle',
              star:'Star',
              size:'Node Size',
              fill:'Node Background Color',
              stroke:'Node Stroke Color',
              shadowColor:'Node Shadow Color',
              shadowBlur:'Node Shadow Blur',
              shadowOffsetX:'Shadow Horizontal Offset',
              shadowOffsetY:'Shadow Vertical Offset',
              opacity:'Node Opacity'
             },
           edgeCfg:{
             title:'Border Config',
             shape:'Border Type',
             line:'Line',
             arc:'Arc',
             cubic:'Cubic',
             polyline:'polyline',
             lineWidth:'Line Width',
             shadowColor:'Border Shadow Color',
             shadowBlur:'Border Shadow Blur',
             shadowOffsetX:'Shadow Horizontal Offset',
             shadowOffsetY:'Shadow Vertical Offset',
             opacity:'Border Opacity'
           },
           labelCfg:{
             fontSize:'Label Font Size',
             fill:'Label Font Color',
             fontFamily:'Font Family',
             position:'Label Position',
             offset:'Label Offset',
             rotate:'Label Rotate',
             center:'Center',
             top:'Top',
             bottom:'Bottom',
             left:'Left',
             right:'Right'
           },
           viz: {
             palette: {
               data: {
                 drop: 'Please drag ID (primary key field), parent ID field and value (node value field) in turn',
                },
             },
           },
          },
         },
       ],
     },
     isISOContainer: 'g6js-relation-chart',
    //  引入AntV g6.js
     dependency: [
       'https://gw.alipayobjects.com/os/antv/pkg/_antv.g6-3.1.1/build/g6.js',
      ],
     meta: {
       id: 'zyb-relation-chart',
       name: '关系图',
       icon: svgIcon,
       requirements: [
         {
           group: null,
           aggregate: null,
         },
       ],
     },
     onMount(options, context) {
       //由于onResize()中的options参数丢失了文档中描述的containerId 属性！！！！，所以只能在这里给context.window.containerId赋值
       context.window.containerId = options.containerId;
       if (!context.document) {
         return;
       }  
       const container = context.document.getElementById(options.containerId)
       //初始化G6JS的TreeGraph对象
       if('G6' in context.window){
         this.chart = new context.window.G6.TreeGraph({
           container: options.containerId,
           width:container.clientWidth,
           height:container.clientHeight,
           pixelRatio: 2,//像素比率
           linkCenter: true,//链接中心
           fitView:true,//是否开启自适应
           modes: {
             default: [{
               type: 'collapse-expand',
               onChange:(item,collapsed)=>{
                 var data = item.get('model').data;
                 data.collapsed = collapsed;
                 return true;
               }
             },
               'drag-canvas', //允许拖拽画布
               'zoom-canvas', //允许缩放画布
              //  'drag-node',   //允许拖拽节点
              //  'activate-relations'//允许设置节点高亮
              ]
           },
           defaultNode: {
             type:'circle',
             size: 10,
             style: {
               fill: '#40a9ff',
               stroke: '#096dd9'
             }
           },
           defaultEdge: {
             type:'cubic-horizontal',
             style: {
               stroke: '#A3B1BF',
             }
           },
           layout:{
            type:"dendrogram",
            direction:'LR',
            radial:true,
            preventOverlap:true,//防止节点重叠
            // 防碰撞必须设置nodesize 否则无效
            nodeSize:100,//节点大小，用于算法中防止节点重叠的碰撞检测
            linkDistance:150,//指定边距离
            nodeSep:100,//节点间距
            rankSep:100,//层与层之间的间距
          },
          // 设置节点高亮样式
        edgeStateStyles: {
          highlight: {
            stroke: 'red' 
          }
        }
         });
       }
     },
 
     onUpdated(options, context) {
        // 字段拖动的改变，onUpdated函数执行了2次!!!
       if (!options.dataset || !options.dataset.columns || !options.config) {
         return;
       }
       // 获取关系数据及配置
       let { data,aggregate,style } = this.getOptions(options.dataset, options.config);
       if(!data){
         this.chart.clear();
         return;
       }
      //  设置图初始化数据，
       this.chart.data(data);

      // 1. 设置图表整体配置
      const chartCfg = style.chartStyle;
      let trueMode = [];
      let falseMode = [];
      Object.keys(chartCfg).forEach(function (key) {
        //驼峰变量转为连字符
        const modeStr = key
        .toString().
        replace(/([a-z])([A-Z])/,"$1-$2")     
        .toLowerCase();
        if(chartCfg[key]=== true){
          trueMode.push(modeStr);
        }else{
          falseMode.push(modeStr);
        }
      });
      // 设置图表实例的modes模式
      this.chart.addBehaviors(trueMode, 'default');
      this.chart.removeBehaviors(falseMode, 'default');
      // 2.布局样式切换配置
          const layout = {
            ...style.layoutStyle,
          }
          if(style.layoutStyle.radial ){
          // g6规定，辐射树布局的direction最好设置为LR
            layout.direction = 'LR';
          }
          this.chart.changeLayout(layout);
          this.chart.refreshLayout(false);
      //  3. 指定节点样式，未拖入节点值字段时，默认以‘ # ’代替
       this.chart.node((node)=> {
        return {
          ...style.nodeStyle.nodeCfg,
          label: aggregate?node[aggregate]:'#',
          ...style.nodeStyle.labelStyle,
        };
      });
      
      // 4.指定边的样式
       this.chart.edge((edge) => {
         return {
           ...style.edgeStyle.edgeCfg,
         }
       })
      // 5.根据数据渲染视图
       this.chart.data(data);
       this.chart.render();
       this.chart.fitView();
     },
     onUnMount() {
      //  销毁画布
         if(this.chart){
           this.chart.destroy();
         }
     },
     onResize(options, context) {
        // onResize中的options参数丢失了文档中描述的containerId 属性！！！！
        if(this.chart && this.getOptions(options.dataset, options.config).data!= null){
          const container = context.document.getElementById(context.window?.containerId);
            // 手动修改画布大小
            this.chart && this.chart.changeSize(container.clientWidth,container.clientHeight);
            // 自适应画布大小
            this.chart.render();
        }
     },
     getOptions(dataset, config) {
       const dataConfigs = config.datas || [];
       //获取字段配置信息
       const mixedSectionConfigRows = dataConfigs
       .filter(c => c.key === 'mixed')
       .flatMap(config => config.rows || []);
       // 获取样式配置信息
       const styleConfigs = config.styles;

      // 数据转换，根据Datart提供了Helper转换工具, 转换为ChartDataSet模型
       const chartDataSet = dHelper.transformToObjectArray(
          dataset.rows,
          dataset.columns,
          dataConfigs,
      );
       let id = null;
       let parentId = null;
       let value = null;
       if(mixedSectionConfigRows.length === 2){
         id = mixedSectionConfigRows[0].colName;
         parentId = mixedSectionConfigRows[1].colName;
       }else if(mixedSectionConfigRows.length === 3){
         id = mixedSectionConfigRows[0].colName;
         parentId = mixedSectionConfigRows[1].colName;
         value = mixedSectionConfigRows[2].colName;
       }else{
         return {
           data:null,
           aggregate:null,
           style:null
         }   
       }
        //  获取关系节点数据
       const data = this.genTree(chartDataSet,id,parentId,value);
       return {
         data,
         aggregate:value,
         style: {
           chartStyle:this.getChartStyle(styleConfigs),
           layoutStyle:this.getLayoutStyle(styleConfigs),
           nodeStyle:this.getNodeStyle(styleConfigs),
           edgeStyle:this.getEdgeStyle(styleConfigs)
         },
         
       };
     },
    //  获取图布局配置
    getChartStyle(styles){
        const [dragCanvas, zoomCanvas, dragNode,activateRelations] = dHelper.getStyles(
          styles,
          ['chartCfg'],
          ['dragCanvas', 'zoomCanvas', 'dragNode','activateRelations']
        );
        return { 
          dragCanvas, 
          zoomCanvas, 
          dragNode,
          activateRelations
        };
    },
      //  获取布局样式
      getLayoutStyle(styles){
        const [isRadial, direction, nodeSep,rankSep] = dHelper.getStyles(
          styles,
          ['layoutCfg'],
          ['isRadial', 'direction', 'nodeSep','rankSep']
        );
        return { 
            type:'dendrogram',
            radial:isRadial,
            direction,
            nodeSep:parseInt(nodeSep),
            rankSep:parseInt(rankSep),
            preventOverlap:true,
        };
       },
    //  获取节点样式
     getNodeStyle(styles) {
       const [shape, size, fill,stroke,shadowColor,shadowBlur,shadowOffsetX,shadowOffsetY,opacity, fontSize,labelColor,position,fontFamily,offset,rotate] = dHelper.getStyles(
         styles,
         ['nodeCfg'],
         ['shape', 'size', 'fill','stroke','shadowColor','shadowBlur','shadowOffsetX','shadowOffsetY','opacity','fontSize','labelColor','position','fontFamily','offset','rotate'],
       );
       return { 
         nodeCfg: {
            shape, size, style:{fill,stroke,shadowColor,shadowBlur,shadowOffsetX,shadowOffsetY,opacity}
         } ,
         labelStyle:{
           labelCfg:{
             position,
             offset,
            //  rotate,
             style:{fontSize,fill:labelColor,fontFamily,rotate}
           }
         }
       };
     },
    //  获取边线样式
     getEdgeStyle(styles) {
       const [shape, stroke,lineWidth,shadowColor,shadowBlur,shadowOffsetX,shadowOffsetY,opacity] = dHelper.getStyles(
         styles,
         ['edgeCfg'],
         ['shape','stroke','lineWidth','shadowColor','shadowBlur','shadowOffsetX','shadowOffsetY','opacity'],
       );
       return { edgeCfg: { shape ,style:{stroke,lineWidth,shadowColor,shadowBlur,shadowOffsetX,shadowOffsetY,opacity,}}};
     },
    // 数据处理，将chartDataSet转换为树结构数据
     genTree(chartDataSet,id,pid,value){
       if(chartDataSet.length <= 1){
         console.log('递归出口');
         return chartDataSet[0];
       }
      //  记录父亲节点id
       let arr = [];
       if(chartDataSet[0].hasOwnProperty('isParent')){
          chartDataSet.forEach((item)=>{
           arr.push(item.id);
          })
       }
       let treeData = [];
       chartDataSet.forEach(ele =>{
         const treeNode = {};
         const childArray = [];
         chartDataSet.forEach((item =>{
           if(ele[id] === item[pid]){
             const obj = {
               id:item[id],
               parentId:item[pid],
               children:item.children?item.children:[],
               value:item[value]
             }
             childArray.push(obj);
             treeNode.id = ele[id];
             treeNode.parentId = ele[pid];
             treeNode.value = ele[value];
            //  保留不作为父亲节点的node
             let isNotParentArray = [];
             if(arr.length > 0){
               ele.children.forEach((child)=>{
                if(arr.indexOf(child.id) === -1 ){
                  isNotParentArray = isNotParentArray.concat([child]);
                }
               })
             }
             treeNode.children = isNotParentArray.concat(childArray);
           };
         }));
         if(treeNode.hasOwnProperty('id')){
           treeNode.isParent = true;
            treeData.push(treeNode);
         }
       });
       const finalData = this.genTree(treeData,'id','parentId','value'); 
       return finalData; 
     },
   
   };
 } 