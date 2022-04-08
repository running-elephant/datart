import S2Table from './s2-detail-table.tsx';

/**
 * 自定义扩展极坐标柱状图
 * @param dHelper 构建参数
 * @returns 返回组件
 */
function CustomDetailTableChart({ dHelper }) {
  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
          limit: 0,
          actions: {
            NUMERIC: ['alias', 'sortable', 'colorize'],
            STRING: ['alias', 'sortable', 'colorize'],
          },
        },
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'aggregate',
          limit: 0,
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
          label: 'label.toolbar',
          key: 'toolbarConfig',
          comType: 'group',
          rows: [
            {
              label: 'common.isShow',
              key: 'toolbarIsShow',
              comType: 'checkbox',
            },
          ],
        },
      ], // TODO
      settings: [],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            common: {
              prefixText: '前缀文字',
              suffixText: '后缀文字',
              bottomBodyText: '主体文字',
              buttomUpText: '上升文字',
              decreaseText: '下降文字',
              bottomText: '底部',
              image: '图片',
              positionX: '水平位置',
              positionY: '垂直位置',
              bodyText: '主体文字',
              body: '主体',
              background: '背景',
              width: '宽',
              height: '高',
              colName: '列名',
              upImage: '上升图片',
              decreaseImage: '下降图片',
              imgPosition: '图片位置',
              isShow: '显示',
            },
            label: {
              title: '标题',
              toolbar: '工具条',
              showLabel: '显示标签',
              position: '位置',
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
            title: {
              title: '标题',
            },
          },
        },
      ],
    },
    isISOContainer: 'custom-detail-table-chart',
    dependency: [],
    meta: {
      id: 'custom-detail-table-chart',
      name: '自定义明细表格',
      icon: 'mingxibiao',
      requirements: [
        {
          group: 0,
          aggregate: 0,
        },
      ],
    },

    onMount(options, context) {
      this.globalContext = context;
      // 组件对象初始化
      this.chart = S2Table(
        context.document.getElementById(options.containerId),
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
        if (this.chart && this.chart.clear) {
          this.chart.clear();
        }
        return;
      }
      // this.chart.render();
      const chartCfg = this.getTableCfg(props.dataset, props.config);
      // this.chart?.setSheetType('pivot');
      this.chart?.setOptions(Object.assign({}, chartCfg.options), true);
      this.chart?.setDataCfg(Object.assign({}, chartCfg.dataCfg), true);
      this.chart.render();
    },

    // 卸载组件清理资源
    onUnMount() {
      this.chart && this.chart.dispose();
    },

    // 改变大小时触发
    onResize(opt, context) {
      this.chart && this.chart.resize(context);
    },
    // 获取配置选型信息
    getTableCfg(dataset, config) {
      let dataCfg = {
        fields: {
          rows: [],
          columns: ['province', 'city', 'type', 'sub_type', 'number'],
          values: [],
        },
        meta: [
          {
            field: 'number',
            name: '数量',
          },
          {
            field: 'province',
            name: '省份',
          },
          {
            field: 'city',
            name: '城市',
          },
          {
            field: 'type',
            name: '类别',
          },
          {
            field: 'sub_type',
            name: '子类别',
          },
        ],
        data: [
          {
            number: 7789,
            province: '浙江省',
            city: '杭州市',
            type: '家具',
            sub_type: '桌子',
          },
          {
            number: 2367,
            province: '浙江省',
            city: '绍兴市',
            type: '家具',
            sub_type: '桌子',
          },
          {
            number: 3877,
            province: '浙江省',
            city: '宁波市',
            type: '家具',
            sub_type: '桌子',
          },
          {
            number: 4342,
            province: '浙江省',
            city: '舟山市',
            type: '家具',
            sub_type: '桌子',
          },
          {
            number: 5343,
            province: '浙江省',
            city: '杭州市',
            type: '家具',
            sub_type: '沙发',
          },
          {
            number: 632,
            province: '浙江省',
            city: '绍兴市',
            type: '家具',
            sub_type: '沙发',
          },
          {
            number: 7234,
            province: '浙江省',
            city: '宁波市',
            type: '家具',
            sub_type: '沙发',
          },
          {
            number: 834,
            province: '浙江省',
            city: '舟山市',
            type: '家具',
            sub_type: '沙发',
          },
          {
            number: 945,
            province: '浙江省',
            city: '杭州市',
            type: '办公用品',
            sub_type: '笔',
          },
          {
            number: 1304,
            province: '浙江省',
            city: '绍兴市',
            type: '办公用品',
            sub_type: '笔',
          },
          {
            number: 1145,
            province: '浙江省',
            city: '宁波市',
            type: '办公用品',
            sub_type: '笔',
          },
          {
            number: 1432,
            province: '浙江省',
            city: '舟山市',
            type: '办公用品',
            sub_type: '笔',
          },
          {
            number: 1343,
            province: '浙江省',
            city: '杭州市',
            type: '办公用品',
            sub_type: '纸张',
          },
          {
            number: 1354,
            province: '浙江省',
            city: '绍兴市',
            type: '办公用品',
            sub_type: '纸张',
          },
          {
            number: 1523,
            province: '浙江省',
            city: '宁波市',
            type: '办公用品',
            sub_type: '纸张',
          },
          {
            number: 1634,
            province: '浙江省',
            city: '舟山市',
            type: '办公用品',
            sub_type: '纸张',
          },
          {
            number: 1723,
            province: '四川省',
            city: '成都市',
            type: '家具',
            sub_type: '桌子',
          },
          {
            number: 1822,
            province: '四川省',
            city: '绵阳市',
            type: '家具',
            sub_type: '桌子',
          },
          {
            number: 1943,
            province: '四川省',
            city: '南充市',
            type: '家具',
            sub_type: '桌子',
          },
          {
            number: 2330,
            province: '四川省',
            city: '乐山市',
            type: '家具',
            sub_type: '桌子',
          },
          {
            number: 2451,
            province: '四川省',
            city: '成都市',
            type: '家具',
            sub_type: '沙发',
          },
          {
            number: 2244,
            province: '四川省',
            city: '绵阳市',
            type: '家具',
            sub_type: '沙发',
          },
          {
            number: 2333,
            province: '四川省',
            city: '南充市',
            type: '家具',
            sub_type: '沙发',
          },
          {
            number: 2445,
            province: '四川省',
            city: '乐山市',
            type: '家具',
            sub_type: '沙发',
          },
          {
            number: 2335,
            province: '四川省',
            city: '成都市',
            type: '办公用品',
            sub_type: '笔',
          },
          {
            number: 245,
            province: '四川省',
            city: '绵阳市',
            type: '办公用品',
            sub_type: '笔',
          },
          {
            number: 2457,
            province: '四川省',
            city: '南充市',
            type: '办公用品',
            sub_type: '笔',
          },
          {
            number: 2458,
            province: '四川省',
            city: '乐山市',
            type: '办公用品',
            sub_type: '笔',
          },
          {
            number: 4004,
            province: '四川省',
            city: '成都市',
            type: '办公用品',
            sub_type: '纸张',
          },
          {
            number: 3077,
            province: '四川省',
            city: '绵阳市',
            type: '办公用品',
            sub_type: '纸张',
          },
          {
            number: 3551,
            province: '四川省',
            city: '南充市',
            type: '办公用品',
            sub_type: '纸张',
          },
          {
            number: 352,
            province: '四川省',
            city: '乐山市',
            type: '办公用品',
            sub_type: '纸张',
          },
        ],
        totalData: [
          {
            number: 26193,
            type: '家具',
            sub_type: '桌子',
          },
          {
            number: 49709,
            type: '家具',
          },
          {
            number: 23516,
            type: '家具',
            sub_type: '沙发',
          },
          {
            number: 29159,
            type: '办公用品',
          },
          {
            number: 12321,
            type: '办公用品',
            sub_type: '笔',
          },
          {
            number: 16838,
            type: '办公用品',
            sub_type: '纸张',
          },
          {
            number: 18375,
            province: '浙江省',
            type: '家具',
            sub_type: '桌子',
          },
          {
            number: 14043,
            province: '浙江省',
            type: '家具',
            sub_type: '沙发',
          },
          {
            number: 4826,
            province: '浙江省',
            type: '办公用品',
            sub_type: '笔',
          },
          {
            number: 5854,
            province: '浙江省',
            type: '办公用品',
            sub_type: '纸张',
          },
          {
            number: 7818,
            province: '四川省',
            type: '家具',
            sub_type: '桌子',
          },
          {
            number: 9473,
            province: '四川省',
            type: '家具',
            sub_type: '沙发',
          },
          {
            number: 7495,
            province: '四川省',
            type: '办公用品',
            sub_type: '笔',
          },
          {
            number: 10984,
            province: '四川省',
            type: '办公用品',
            sub_type: '纸张',
          },
          {
            number: 13132,
            province: '浙江省',
            city: '杭州市',
            type: '家具',
          },
          {
            number: 2288,
            province: '浙江省',
            city: '杭州市',
            type: '办公用品',
          },
          {
            number: 15420,
            province: '浙江省',
            city: '杭州市',
          },
          {
            number: 2999,
            province: '浙江省',
            city: '绍兴市',
            type: '家具',
          },
          {
            number: 2658,
            province: '浙江省',
            city: '绍兴市',
            type: '办公用品',
          },
          {
            number: 5657,
            province: '浙江省',
            city: '绍兴市',
          },
          {
            number: 11111,
            province: '浙江省',
            city: '宁波市',
            type: '家具',
          },
          {
            number: 2668,
            province: '浙江省',
            city: '宁波市',
            type: '办公用品',
          },
          {
            number: 13779,
            province: '浙江省',
            city: '宁波市',
          },
          {
            number: 5176,
            province: '浙江省',
            city: '舟山市',
            type: '家具',
          },
          {
            number: 3066,
            province: '浙江省',
            city: '舟山市',
            type: '办公用品',
          },
          {
            number: 8242,
            province: '浙江省',
            city: '舟山市',
          },
          {
            number: 4174,
            province: '四川省',
            city: '成都市',
            type: '家具',
          },
          {
            number: 6339,
            province: '四川省',
            city: '成都市',
            type: '办公用品',
          },
          {
            number: 10513,
            province: '四川省',
            city: '成都市',
          },
          {
            number: 4066,
            province: '四川省',
            city: '绵阳市',
            type: '家具',
          },
          {
            number: 3322,
            province: '四川省',
            city: '绵阳市',
            type: '办公用品',
          },
          {
            number: 7388,
            province: '四川省',
            city: '绵阳市',
          },
          {
            number: 4276,
            province: '四川省',
            city: '南充市',
            type: '家具',
          },
          {
            number: 6008,
            province: '四川省',
            city: '南充市',
            type: '办公用品',
          },
          {
            number: 10284,
            province: '四川省',
            city: '南充市',
          },
          {
            number: 4775,
            province: '四川省',
            city: '乐山市',
            type: '家具',
          },
          {
            number: 2810,
            province: '四川省',
            city: '乐山市',
            type: '办公用品',
          },
          {
            number: 7585,
            province: '四川省',
            city: '乐山市',
          },
          {
            number: 32418,
            province: '浙江省',
            type: '家具',
          },
          {
            number: 10680,
            province: '浙江省',
            type: '办公用品',
          },
          {
            number: 43098,
            province: '浙江省',
          },
          {
            number: 17291,
            province: '四川省',
            type: '家具',
          },
          {
            number: 18479,
            province: '四川省',
            type: '办公用品',
          },
          {
            number: 35770,
            province: '四川省',
          },
          {
            number: 78868,
          },
        ],
      };
      let options = {
        width: 600,
        height: 480,
        interaction: {
          enableCopy: true,
        },
      };
      let chartCfg = { dataCfg, options };
      return chartCfg;
    },
  };
}

export default CustomDetailTableChart;
