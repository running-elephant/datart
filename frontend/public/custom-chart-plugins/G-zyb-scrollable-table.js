function DemoScrollableTable({ dHelper }) {
  // 插件图标
  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 10v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2zM8 22h16V10H8z" fill="currentColor"></path><path d="M24 28v4h-2v-4H10v4H8v-4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" fill="currentColor"></path><path d="M24 0v4a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V0h2v4h12V0z" fill="currentColor"></path></svg>`;

  return {
    // 配置面板
    config: {
      datas: [
        {
          label: 'mixed',
          key: 'mixed',
          required: true,
          type: 'mixed',
          allowSameField: true,
        },
      ],
      styles: [
        // 表头样式
        {
          label: 'style.headerStyle',
          key: 'headerStyle',
          comType: 'group',
          rows: [
            {
              label: 'style.headerHeight',
              key: 'headerHeight',
              default: '35',
              comType: 'inputNumber',
            },
            {
              label: 'style.headerBGC',
              key: 'headerBGC',
              default: '#495057',
              comType: 'fontColor',
            },
            {
              label: 'style.index',
              key: 'index',
              default: true,
              comType: 'switch',
            },
            {
              label: 'style.indexHeader',
              key: 'indexHeader',
              default: '#',
              comType: 'input',
            },
            {
              label: 'style.indexBGC',
              key: 'indexBGC',
              default: '#495057',
              comType: 'fontColor',
            },
          ],
        },
        // 列样式
        {
          label: 'style.columnStyle',
          key: 'column',
          comType: 'group',
          rows: [
            {
              label: 'style.open',
              key: 'modal',
              comType: 'group',
              options: { type: 'modal', modalSize: 'middle' },
              rows: [
                {
                  label: 'style.list',
                  key: 'list',
                  comType: 'listTemplate',
                  rows: [],
                  options: {
                    getItems: cols => {
                      const columns = (cols || [])
                        .filter(col =>
                          ['aggregate', 'group', 'mixed'].includes(col.type),
                        )
                        .reduce((acc, cur) => acc.concat(cur.rows || []), [])
                        .map(c => ({
                          key: c.uid,
                          value: c.uid,
                          type: c.type,
                          label:
                            c.label || c.aggregate
                              ? `${c.aggregate}(${c.colName})`
                              : c.colName,
                        }));
                      return columns;
                    },
                  },
                  template: {
                    label: 'style.listItem',
                    key: 'listItem',
                    comType: 'group',
                    rows: [
                      {
                        label: 'style.columnStyle',
                        key: 'columnStyle',
                        comType: 'group',
                        options: { expand: true },
                        rows: [
                          {
                            label: 'style.columnWidth',
                            key: 'columnWidth',
                            default: 100,
                            options: {
                              min: 0,
                            },
                            comType: 'inputNumber',
                          },
                          {
                            label: 'style.align',
                            key: 'align',
                            default: 'left',
                            options: {
                              items: [
                                { label: '居左对齐', value: 'left' },
                                { label: '居中对齐', value: 'center' },
                                { label: '居右对齐', value: 'right' },
                              ],
                            },
                            comType: 'select',
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        // 表体样式
        {
          label: 'style.body',
          key: 'body',
          comType: 'group',
          rows: [
            {
              label: 'style.fontColor',
              key: 'fontColor',
              default: '#e3e3e3',
              comType: 'fontColor',
            },
            {
              label: 'style.carousel',
              key: 'carousel',
              default: 'single',
              comType: 'select',
              options: {
                items: [
                  { label: '单行轮播', value: 'single' },
                  { label: '整页轮播', value: 'page' },
                ],
              },
            },
            {
              label: 'style.waitTime',
              key: 'waitTime',
              default: '2000',
              comType: 'inputNumber',
            },
            {
              label: 'style.hoverPause',
              key: 'hoverPause',
              default: true,
              comType: 'switch',
            },
            {
              label: 'style.rowNum',
              key: 'rowNum',
              default: '7',
              comType: 'inputNumber',
            },
            {
              label: 'style.oddRowBGC',
              key: 'oddRowBGC',
              default: '#495371',
              comType: 'fontColor',
            },
            {
              label: 'style.evenRowBGC',
              key: 'evenRowBGC',
              default: '#7882A4',
              comType: 'fontColor',
            },
          ],
        },
      ],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            style: {
              body: '表体样式',
              fontColor: '字体颜色',
              carousel: '轮播方式',
              waitTime: '轮播时间间隔(ms)',
              hoverPause: '悬浮表格暂停轮播',
              rowNum: '表行数',
              oddRowBGC: '奇数行背景色',
              evenRowBGC: '偶数行背景色',
              headerStyle: '表头样式',
              headerHeight: '表头高度',
              headerBGC: '表头背景色',
              index: '显示行号',
              indexHeader: '行号标题',
              indexBGC: '行号背景色',
              columnStyle: '列样式',
              open: '打开编辑列样式',
              columnWidth: '列宽度',
              align: '列对齐方式',
            },
          },
        },
        {
          lang: 'en-US',
          translation: {
            style: {
              body: 'Table Body Style',
              fontColor: 'Font Color',
              carousel: 'Carousel Type',
              waitTime: 'Carousel Time Interval(ms)',
              hoverPause: 'Hover Pause Carousel',
              rowNum: 'Table Row Number',
              oddRowBGC: 'Odd Row Background Color',
              evenRowBGC: 'Even Row Background Color',
              headerStyle: 'Table Header Style',
              headerHeight: 'Table Header Height',
              headerBGC: 'Table Header Background Color',
              index: 'Show Row Number',
              indexHeader: 'Row Number Title',
              indexBGC: 'Row Number Background Color',
              columnStyle: 'Columen Style',
              open: 'Edit Column Style',
              columnWidth: 'Column Width',
              align: 'Column Align Type',
            },
          },
        },
      ],
    },
    isISOContainer: 'zyb-scrollable-table',
    // cdn或者服务器上资源地址
    dependency: [
      'https://cdn.bootcdn.net/ajax/libs/vue/2.5.16/vue.js',
      'http://39.105.208.253:1888/js/datav.min.vue.js',
    ],
    // 插件元信息
    meta: {
      id: 'zyb-scrollable-table',
      name: '轮播表格',
      icon: svgIcon,
      requirements: [{ group: null, aggregate: null }],
    },
    // -----------datart插件生命周期函数 start-----------
    onMount(options, context) {
      const rootEle = context.document.createElement('div');
      rootEle.setAttribute('id', 'app');
      context.document.getElementById(options.containerId).appendChild(rootEle);
      const vue = context.window.Vue;
      this.chart = new vue({
        el: `#app`,
        data: {
          config: {
            // 数据相关
            header: [],
            data: [
              // ['2019-07-01 19:25:00', '路面危害-松散', '5', 'xxxxxxx'],
              // ['2019-07-02 17:25:00', '路面危害-路面油污清理', '13', 'xxxxxxx'],
              // [
              //   '2019-07-03 16:25:00',
              //   '交安设施-交通标志牌结构',
              //   '6',
              //   'xxxxxxx',
              // ],
              // ['2019-07-04 15:25:00', '路基危害-防尘网', '2', 'xxxxxxx'],
              // [
              //   '2019-07-05 14:25:00',
              //   '交安设施-交通标志牌结构',
              //   '1',
              //   'xxxxxxx',
              // ],
              // ['2019-07-06 13:25:00', '路面危害-松散', '3', 'xxxxxxx'],
              // ['2019-07-07 12:25:00', '路基危害-防尘网', '4', 'xxxxxxx'],
              // ['2019-07-08 11:25:00', '路面危害-路面油污清理', '2', 'xxxxxxx'],
              // [
              //   '2019-07-09 10:25:00',
              //   '交安设施-交通标志牌结构',
              //   '5',
              //   'xxxxxxx',
              // ],
              // ['2019-07-10 09:25:00', '路基危害-防尘网', '3', 'xxxxxxx'],
            ],
            // 表头样式相关
            index: true,
            indexHeader: '#',
            indexBGC: '#1981f6',
            headerBGC: '#1981f6',
            headerHeight: 45,

            columnWidth: [50],
            align: ['center'],
            rowNum: 7,
            oddRowBGC: 'rgba(0, 44, 81, 0.8)',
            evenRowBGC: 'rgba(10, 29, 50, 0.8)',
          },
        },
        template: this.getTemplate(),
        methods: {},
      });
    },
    onUpdated(props, context) {
      if (!props.dataset || !props.dataset.columns || !props.config) {
        return;
      }
      if (!this.isMatchRequirement(props.config)) {
        this.chart?.clear();
        return;
      }
      // DataV组件内部没有设置deep监听props，数据变更时，请生成新的props，不然组件将无法刷新状态
      if (props.config.datas) {
        this.chart.config = {
          ...this.chart.config,
          ...this.getData(props.dataset, props.config),
        };
      }
      if (props.config.styles) {
        this.chart.config = {
          ...this.chart.config,
          ...this.getHeaderStyle(props.config.styles),
          ...this.getBodyStyle(props.config.styles),
          ...this.getColumnStyle(props.config.styles),
        };
        this.chart.$refs.scrollBoard.$refs['scroll-board'].style.color =
          this.chart.config.fontColor;
      }
    },
    onUnMount() {
      if (this.chart) {
        // 完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器
        this.chart.$destroy();
        // 清除DOM
        this.chart.$el.parentNode.removeChild(this.chart.$el);
      }
    },
    onResize(options, context) {},
    // -----------datart插件生命周期函数 end-----------

    // -----------获取表头和表体等的配置 start-----------
    getData(dataset, config) {
      const dataConfigs = config.datas || [];
      const mixedConfigs = dataConfigs
        .filter(c => c.type === 'mixed')
        .flatMap(config => config.rows || []);

      // 表内数据
      const chartDataSet = dHelper.transformToObjectArray(
        dataset.rows,
        dataset.columns,
        dataConfigs,
      );
      const resultData = this.dataArrNormalization(chartDataSet);

      // 表头数据
      const headerDataSet = mixedConfigs.map(dHelper.getColumnRenderName);
      console.log('chartDataSet', resultData, headerDataSet);

      return { header: headerDataSet, data: resultData };
    },
    getHeaderStyle(styleConfigs) {
      // 获取表头样式
      const [index, indexHeader, indexBGC, headerHeight, headerBGC] =
        dHelper.getStyles(
          styleConfigs,
          ['headerStyle'],
          ['index', 'indexHeader', 'indexBGC', 'headerHeight', 'headerBGC'],
        );
      return { index, indexHeader, indexBGC, headerHeight, headerBGC };
    },
    getBodyStyle(styleConfigs) {
      // 获取表体样式
      const [
        fontColor,
        carousel,
        waitTime,
        hoverPause,
        rowNum,
        oddRowBGC,
        evenRowBGC,
      ] = dHelper.getStyles(
        styleConfigs,
        ['body'],
        [
          'fontColor',
          'carousel',
          'waitTime',
          'hoverPause',
          'rowNum',
          'oddRowBGC',
          'evenRowBGC',
        ],
      );
      return {
        fontColor,
        carousel,
        waitTime,
        hoverPause,
        rowNum,
        oddRowBGC,
        evenRowBGC,
      };
    },
    getColumnStyle(styleConfigs) {
      // 看有没有开启行号
      const [index] = dHelper.getStyles(
        styleConfigs,
        ['headerStyle'],
        ['index'],
      );
      // 获取列样式
      const columnWidthArr = [];
      const columnAlignArr = [];
      const columnIndex = styleConfigs.findIndex(obj => obj.key === 'column');
      const columnEditedRows =
        styleConfigs[columnIndex]['rows'][0]['rows'][0]['rows'];

      console.log('columnEditedRows', columnEditedRows);

      // 对获取的数据进行过滤（可优化）
      columnEditedRows.forEach(item => {
        console.log('item', item);
        columnWidthArr.push(
          item.rows[0]['rows'][0]?.value ?? item.rows[0]['rows'][0].default,
        );
        columnAlignArr.push(
          item.rows[0]['rows'][1]?.value ?? item.rows[0]['rows'][1].default,
        );
      });
      // 如果开启了行号
      if (index) {
        columnWidthArr.unshift(50);
        columnAlignArr.unshift('center');
      }

      return {
        columnWidth: columnWidthArr,
        align: columnAlignArr,
      };
    },

    // -----------获取表头和表体等的配置 end-----------

    // -----------其他辅助函数 start-----------
    getTemplate() {
      return `
        <div>       
          <dv-scroll-board :config="config" ref="scrollBoard"/>
        </div>`;
    },
    dataArrNormalization(originArr) {
      // [
      //   {
      //     time: '2019-07-01 19:25:00',
      //     info: '路面危害-松散',
      //   },
      // ];
      const newArr = [];
      originArr.forEach(item => {
        newArr.push(Object.values(item));
      });
      return newArr;
    },
    // -----------辅助函数 end-----------
  };
}
