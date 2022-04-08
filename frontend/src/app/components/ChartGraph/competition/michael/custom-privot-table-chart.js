import BaseTableChartHelper from './baseTableChartHelper';
import S2Table from './s2-privot-table.tsx';

/**
 * 自定义扩展极坐标柱状图
 * @param dHelper 构建参数
 * @returns 返回组件
 */
function CustomPivotTableChart({ dHelper }) {
  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
          limit: [1, 4],
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
          label: 'common.size',
          key: 'tableSize',
          comType: 'group',
          rows: [
            {
              label: 'common.width',
              key: 'tableWidth',
              comType: 'inputNumber',
              default: 600,
            },
            {
              label: 'common.height',
              key: 'tableHeight',
              comType: 'inputNumber',
              default: 480,
            },
          ],
        },
        {
          label: 'common.columnConfig',
          key: 'column',
          comType: 'group',
          rows: [
            {
              label: 'common.openColumn',
              key: 'modal',
              comType: 'group',
              options: { type: 'modal', modalSize: 'middle' },
              rows: [
                {
                  label: 'column.list',
                  key: 'columnStyleConfigList',
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
                          label:
                            c.label || c.aggregate
                              ? `${c.aggregate}(${c.colName})`
                              : c.colName,
                        }));
                      return columns;
                    },
                  },
                  template: {
                    label: 'column.listItem',
                    key: 'listItem',
                    comType: 'group',
                    rows: [
                      {
                        label: 'column.basicStyle',
                        key: 'basicStyle',
                        comType: 'group',
                        options: { expand: true },
                        rows: [
                          {
                            label: 'column.backgroundColor',
                            key: 'backgroundColor',
                            comType: 'fontColor',
                          },
                          {
                            label: 'column.backgroundColorOpacity',
                            key: 'backgroundColorOpacity',
                            comType: 'checkbox',
                            default: false,
                          },
                          {
                            label: 'column.align',
                            key: 'align',
                            default: 'left',
                            comType: 'select',
                            options: {
                              items: [
                                { label: '左对齐', value: 'left' },
                                { label: '居中对齐', value: 'center' },
                                { label: '右对齐', value: 'right' },
                              ],
                            },
                          },
                          {
                            label: 'column.enableFixedCol',
                            key: 'enableFixedCol',
                            comType: 'switch',
                            rows: [
                              {
                                label: 'column.fixedColWidth',
                                key: 'fixedColWidth',
                                default: 100,
                                comType: 'inputNumber',
                              },
                            ],
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
                              color: 'black',
                            },
                          },
                        ],
                      },
                      {
                        label: 'column.conditionStyle',
                        key: 'conditionStyle',
                        comType: 'group',
                        options: { expand: true },
                        rows: [],
                      },
                    ],
                  },
                },
              ],
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
              size: '表格大小',
              width: '宽',
              height: '高',
              openColumn: '打开列配置',
              columnConfig: '列配置',
            },
            column: {
              list: '选择列',
              basicStyle: '基础样式',
              conditionStyle: '条件样式',
              backgroundColor: '背景',
              enableFixedCol: '是否固定列宽',
              fixedColWidth: '列宽',
              align: '对齐方式',
              backgroundColorOpacity: '背景是否透明',
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
    isISOContainer: 'custom-privot-table-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'custom-privot-table-chart',
      name: '自定义分组表格',
      icon: 'fenzubiao',
      requirements: [
        {
          group: [1, 4],
          aggregate: 1,
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
      return BaseTableChartHelper.getTableCfg(dataset, config);
    },
  };
}

export default CustomPivotTableChart;
