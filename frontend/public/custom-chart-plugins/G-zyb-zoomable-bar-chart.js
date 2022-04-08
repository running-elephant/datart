function DemoCustomZoomableBarChart({ dHelper }) {
  const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M480 496H48a32 32 0 0 1-32-32V32a16 16 0 0 1 32 0v432h432a16 16 0 0 1 0 32z" fill="currentColor"></path><path d="M156 432h-40a36 36 0 0 1-36-36V244a36 36 0 0 1 36-36h40a36 36 0 0 1 36 36v152a36 36 0 0 1-36 36z" fill="currentColor"></path><path d="M300 432h-40a36 36 0 0 1-36-36V196a36 36 0 0 1 36-36h40a36 36 0 0 1 36 36v200a36 36 0 0 1-36 36z" fill="currentColor"></path><path d="M443.64 432h-40a36 36 0 0 1-36-36V132a36 36 0 0 1 36-36h40a36 36 0 0 1 36 36v264a36 36 0 0 1-36 36z" fill="currentColor"></path></svg>`;

  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
          limit: [0, 1],
        },
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'aggregate',
          limit: [1, 999],
        },
        {
          label: 'filter',
          key: 'filter',
          type: 'filter',
          allowSameField: true,
        },
        {
          label: 'colorize',
          key: 'color',
          type: 'color',
          limit: [0, 1],
        },
      ],
      styles: [
        {
          label: 'bar.title',
          key: 'bar',
          comType: 'group',
          rows: [
            {
              label: 'common.borderStyle',
              key: 'borderStyle',
              comType: 'line',
              default: {
                type: 'solid',
                width: 0,
                color: '#ced4da',
              },
            },
            {
              label: 'bar.radius',
              key: 'radius',
              comType: 'inputNumber',
            },
            {
              label: 'bar.width',
              key: 'width',
              default: 0,
              comType: 'inputNumber',
            },
            {
              label: 'bar.gap',
              key: 'gap',
              comType: 'inputNumber',
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
                // TODO(Stephen): to be extract customize LabelPosition Component
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
                color: '#495057',
              },
            },
          ],
        },
        {
          label: 'legend.title',
          key: 'legend',
          comType: 'group',
          rows: [
            {
              label: 'legend.showLegend',
              key: 'showLegend',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'legend.type',
              key: 'type',
              comType: 'select',
              default: 'scroll',
              options: {
                items: [
                  { label: '普通', value: 'plain' },
                  { label: '滚动', value: 'scroll' },
                ],
              },
            },
            {
              label: 'legend.selectAll',
              key: 'selectAll',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'legend.position',
              key: 'position',
              comType: 'select',
              default: 'right',
              options: {
                items: [
                  { label: '右', value: 'right' },
                  { label: '上', value: 'top' },
                  { label: '下', value: 'bottom' },
                  { label: '左', value: 'left' },
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
                color: '#495057',
              },
            },
          ],
        },
        {
          label: 'xAxis.title',
          key: 'xAxis',
          comType: 'group',
          rows: [
            {
              label: 'common.showAxis',
              key: 'showAxis',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.inverseAxis',
              key: 'inverseAxis',
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'lineStyle',
              comType: 'line',
              default: {
                type: 'solid',
                width: 1,
                color: '#ced4da',
              },
            },
            {
              label: 'common.showLabel',
              key: 'showLabel',
              default: true,
              comType: 'checkbox',
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
                color: '#495057',
              },
            },
            {
              label: 'common.rotate',
              key: 'rotate',
              default: 0,
              comType: 'inputNumber',
            },
            {
              label: 'common.showInterval',
              key: 'showInterval',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'common.interval',
              key: 'interval',
              default: 0,
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'yAxis.title',
          key: 'yAxis',
          comType: 'group',
          rows: [
            {
              label: 'common.showAxis',
              key: 'showAxis',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.inverseAxis',
              key: 'inverseAxis',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'lineStyle',
              comType: 'line',
              default: {
                type: 'solid',
                width: 1,
                color: '#ced4da',
              },
            },
            {
              label: 'common.showLabel',
              key: 'showLabel',
              default: true,
              comType: 'checkbox',
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
                color: '#495057',
              },
            },
            {
              label: 'common.showTitleAndUnit',
              key: 'showTitleAndUnit',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.unitFont',
              key: 'unitFont',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '12',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#495057',
              },
            },
            {
              label: 'common.nameLocation',
              key: 'nameLocation',
              default: 'center',
              comType: 'select',
              options: {
                items: [
                  { label: '开始', value: 'start' },
                  { label: '结束', value: 'end' },
                  { label: '中间', value: 'center' },
                ],
              },
            },
            {
              label: 'common.nameRotate',
              key: 'nameRotate',
              default: 90,
              comType: 'inputNumber',
            },
            {
              label: 'common.nameGap',
              key: 'nameGap',
              default: 20,
              comType: 'inputNumber',
            },
            {
              label: 'common.min',
              key: 'min',
              comType: 'inputNumber',
            },
            {
              label: 'common.max',
              key: 'max',
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'splitLine.title',
          key: 'splitLine',
          comType: 'group',
          rows: [
            {
              label: 'splitLine.showHorizonLine',
              key: 'showHorizonLine',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'horizonLineStyle',
              comType: 'line',
              default: {
                type: 'dashed',
                width: 1,
                color: '#ced4da',
              },
            },
            {
              label: 'splitLine.showVerticalLine',
              key: 'showVerticalLine',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'verticalLineStyle',
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
          label: 'viz.palette.style.margin.title',
          key: 'margin',
          comType: 'group',
          rows: [
            {
              label: 'viz.palette.style.margin.containLabel',
              key: 'containLabel',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'viz.palette.style.margin.left',
              key: 'marginLeft',
              default: '5%',
              comType: 'marginWidth',
            },
            {
              label: 'viz.palette.style.margin.right',
              key: 'marginRight',
              default: '5%',
              comType: 'marginWidth',
            },
            {
              label: 'viz.palette.style.margin.top',
              key: 'marginTop',
              default: '5%',
              comType: 'marginWidth',
            },
            {
              label: 'viz.palette.style.margin.bottom',
              key: 'marginBottom',
              default: '5%',
              comType: 'marginWidth',
            },
          ],
        },
      ],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            common: {
              showAxis: '显示坐标轴',
              inverseAxis: '反转坐标轴',
              lineStyle: '线条样式',
              borderStyle: '边框样式',
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
            label: {
              title: '标签',
              showLabel: '显示标签',
              position: '位置',
            },
            legend: {
              title: '图例',
              showLegend: '显示图例',
              type: '图例类型',
              selectAll: '图例全选',
              position: '图例位置',
            },
            data: {
              color: '颜色',
              colorize: '配色',
            },
            bar: {
              title: '柱状图',
              radius: '边框圆角',
              width: '柱条宽度',
              gap: '柱间隙',
            },
            xAxis: {
              title: 'X轴',
            },
            yAxis: {
              title: 'Y轴',
            },
            splitLine: {
              title: '分割线',
              showHorizonLine: '显示横向分割线',
              showVerticalLine: '显示纵向分割线',
            },
            reference: {
              title: '参考线',
              open: '点击参考线配置',
            },
          },
        },
        {
          lang: 'en-US',
          translation: {
            common: {
              showAxis: 'Show Axis',
              inverseAxis: 'Inverse Axis',
              lineStyle: 'Line Style',
              borderStyle: 'Border Style',
              borderType: 'Border Type',
              borderWidth: 'Border Width',
              borderColor: 'Border Color',
              backgroundColor: 'Background Color',
              showLabel: 'Show Label',
              unitFont: 'Unit Font',
              rotate: 'Rotate',
              position: 'Position',
              showInterval: 'Show Interval',
              interval: 'Interval',
              showTitleAndUnit: 'Show Title and Unit',
              nameLocation: 'Name Location',
              nameRotate: 'Name Rotate',
              nameGap: 'Name Gap',
              min: 'Min',
              max: 'Max',
            },
            label: {
              title: 'Label',
              showLabel: 'Show Label',
              position: 'Position',
            },
            legend: {
              title: 'Legend',
              showLegend: 'Show Legend',
              type: 'Type',
              selectAll: 'Select All',
              position: 'Position',
            },
            data: {
              color: 'Color',
              colorize: 'Colorize',
            },
            bar: {
              title: 'Bar Chart',
              radius: 'Bar Radius',
              width: 'Bar Width',
              gap: 'Bar Gap',
            },
            xAxis: {
              title: 'X Axis',
            },
            yAxis: {
              title: 'Y Axis',
            },
            splitLine: {
              title: 'Splite Line',
              showHorizonLine: 'Show Horizontal Line',
              showVerticalLine: 'Show Vertical Line',
            },
            reference: {
              title: 'Reference Line',
              open: 'Open',
            },
          },
        },
      ],
    },

    isISOContainer: 'zyb-zoomable-bar-chart',
    dependency: ['https://lib.baomitu.com/echarts/5.0.2/echarts.min.js'],
    meta: {
      id: 'zyb-zoomable-bar-chart',
      name: '自定义框选柱状图',
      icon: svgIcon,
      requirements: [
        {
          group: [0, 1],
          aggregate: [1, 999],
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

    onResize(opt, context) {
      this.chart?.resize({ width: context?.width, height: context?.height });
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

    getOptions(dataset, config) {
      const styleConfigs = config.styles;
      const dataConfigs = config.datas || [];
      const settingConfigs = config.settings;
      const groupConfigs = dataConfigs
        .filter(c => c.type === 'group')
        .flatMap(config => config.rows || []);
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);
      const colorConfigs = dataConfigs
        .filter(c => c.type === 'color')
        .flatMap(config => config.rows || []);
      const infoConfigs = dataConfigs
        .filter(c => c.type === 'info')
        .flatMap(config => config.rows || []);

      const chartDataSet = dHelper.transformToDataSet(
        dataset.rows,
        dataset.columns,
        dataConfigs,
      );

      if (this.isHorizonDisplay) {
        chartDataSet.reverse();
      }
      const xAxisColumns = (groupConfigs || []).map(config => {
        return {
          type: 'category',
          tooltip: { show: true },
          data: this.UniqArray(chartDataSet.map(row => row.getCell(config))),
        };
      });
      const yAxisNames = aggregateConfigs.map(dHelper.getColumnRenderName);
      const series = this.getSeries(
        settingConfigs,
        styleConfigs,
        colorConfigs,
        chartDataSet,
        groupConfigs,
        aggregateConfigs,
        infoConfigs,
        xAxisColumns,
      );

      const axisInfo = {
        xAxis: this.getXAxis(styleConfigs, xAxisColumns),
        yAxis: this.getYAxis(styleConfigs, yAxisNames),
      };
      if (this.isStackMode) {
        this.makeStackSeries(styleConfigs, series);
      }
      if (this.isPercentageYAxis) {
        this.makePercentageSeries(styleConfigs, series);
        this.makePercentageYAxis(axisInfo);
      }
      if (this.isHorizonDisplay) {
        this.makeTransposeAxis(axisInfo);
      }
      // // 当前服务端返回的数据集
      // const dataConfigs = config.datas || [];

      // // 获取样式配置信息
      // const styleConfigs = config.styles;

      // // 获取指标类型配置信息
      // const aggregateConfigs = dataConfigs
      //   .filter(c => c.type === 'aggregate')
      //   .flatMap(config => config.rows || []);

      // // 数据转换，根据Datart提供了Helper转换工具, 转换为ChartDataSet模型
      // const chartDataSet = dHelper.transformToDataSet(
      //   dataset.rows,
      //   dataset.columns,
      //   dataConfigs,
      // );

      // const data = chartDataSet.map(row => {
      //   return {
      //     x: row.getCell(aggregateConfigs[0]),
      //     y: row.getCell(aggregateConfigs[1]),
      //   };
      // });

      return {
        toolbox: {
          left: 'center',
          itemSize: 15,
          top: 0,
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
              brushStyle: {
                borderWidth: 0,
                color: 'rgba(210,219,238,0.5)',
              },
            },
            restore: {},
          },
        },
        dataZoom: [
          {
            type: 'inside',
            zoomOnMouseWheel: true,
            throttle: 50,
          },
        ],
        tooltip: {
          trigger: 'item',
          formatter: this.getTooltipFormatterFunc(
            chartDataSet,
            groupConfigs,
            aggregateConfigs,
            colorConfigs,
            infoConfigs,
          ),
        },
        legend: this.getLegendStyle(styleConfigs, series),
        grid: dHelper.getGridStyle(styleConfigs),
        xAxis: axisInfo.xAxis,
        yAxis: axisInfo.yAxis,
        series,
      };
    },

    // 工具函数：服务getOptions
    makePercentageYAxis(axisInfo) {
      if (axisInfo.yAxis) {
        axisInfo.yAxis.min = 0;
        axisInfo.yAxis.max = 100;
      }
    },

    makeTransposeAxis(info) {
      const temp = info.xAxis;
      info.xAxis = info.yAxis;
      info.yAxis = temp;
    },

    getSeries(
      settingConfigs,
      styleConfigs,
      colorConfigs,
      chartDataSet,
      groupConfigs,
      aggregateConfigs,
      infoConfigs,
      xAxisColumns,
    ) {
      const xAxisColumnName = chartDataSet.getFieldKey(groupConfigs?.[0]);
      const yAxisColumnNames = aggregateConfigs.map(config =>
        chartDataSet.getFieldKey(config),
      );
      const colorColumnName = chartDataSet.getFieldKey(colorConfigs[0]);
      const infoColumnNames = infoConfigs.map(config =>
        chartDataSet.getFieldKey(config),
      );

      if (!colorConfigs.length) {
        const flatSeries = aggregateConfigs.map(aggConfig => {
          return {
            ...this.getBarSeiesImpl(
              styleConfigs,
              settingConfigs,
              chartDataSet,
              aggConfig,
            ),
            name: dHelper.getColumnRenderName(aggConfig),
            data: chartDataSet?.map(dc => ({
              ...dHelper.getExtraSeriesRowData(dc),
              ...dHelper.getExtraSeriesDataFormat(aggConfig?.format),
              name: dHelper.getColumnRenderName(aggConfig),
              value: dc.getCell(aggConfig),
            })),
          };
        });
        return flatSeries;
      }

      const secondGroupInfos = dHelper.getColorizeGroupSeriesColumns(
        chartDataSet,
        colorColumnName,
        xAxisColumnName,
        yAxisColumnNames,
        infoColumnNames,
      );

      const colorizeGroupedSeries = aggregateConfigs.flatMap(aggConfig => {
        return secondGroupInfos.map(sgCol => {
          const k = Object.keys(sgCol)[0];
          const v = sgCol[k];

          const itemStyleColor = colorConfigs?.[0]?.color?.colors?.find(
            c => c.key === k,
          );

          return {
            ...this.getBarSeiesImpl(
              styleConfigs,
              settingConfigs,
              chartDataSet,
              sgCol,
            ),
            name: k,
            data: xAxisColumns?.[0]?.data?.map(d => {
              const dc = v.find(col => col[xAxisColumnName] === d);
              return {
                ...dHelper.getExtraSeriesRowData(dc),
                ...dHelper.getExtraSeriesDataFormat(aggConfig?.format),
                name: dHelper.getColumnRenderName(aggConfig),
                value: dc?.[chartDataSet.getFieldKey(aggConfig)] || 0,
              };
            }),
            itemStyle: this.getSerieItemStyle(styleConfigs, {
              color: itemStyleColor?.value,
            }),
          };
        });
      });
      return colorizeGroupedSeries;
    },

    getBarSeiesImpl(styleConfigs, settingConfigs, chartDataSet, dataConfig) {
      return {
        type: 'bar',
        sampling: 'average',
        barGap: this.getSerieBarGap(styleConfigs),
        barWidth: this.getSerieBarWidth(styleConfigs),
        itemStyle: this.getSerieItemStyle(styleConfigs, {
          color: dataConfig?.color?.start,
        }),
        ...this.getLabelStyle(styleConfigs),
        ...this.getSeriesStyle(styleConfigs),
        ...dHelper.getReference2(
          settingConfigs,
          chartDataSet,
          dataConfig,
          this.isHorizonDisplay,
        ),
      };
    },

    makeStackSeries(_, series) {
      (series || []).forEach(s => {
        s['stack'] = this.isStackMode ? this.getStackName(1) : undefined;
      });
      return series;
    },

    makePercentageSeries(styles, series) {
      const _getAbsValue = data => {
        if (typeof data === 'object' && data !== null && 'value' in data) {
          return Math.abs(data.value || 0);
        }
        return data;
      };

      const _convertToPercentage = (data, totalArray) => {
        return (data || []).map((d, dataIndex) => {
          const sum = totalArray[dataIndex];
          const percentageValue = this.toPrecision(
            (_getAbsValue(d) / sum) * 100,
            2,
          );
          return {
            ...d,
            value: percentageValue,
            total: sum,
          };
        });
      };

      const _sereisTotalArrayByDataIndex = (series?.[0]?.data || []).map(
        (_, index) => {
          const sum = series.reduce((acc, cur) => {
            const value = +_getAbsValue(cur.data?.[index] || 0);
            acc = acc + value;
            return acc;
          }, 0);
          return sum;
        },
      );
      (series || []).forEach(s => {
        s.data = _convertToPercentage(s.data, _sereisTotalArrayByDataIndex);
      });
      return series;
    },

    getSerieItemStyle(styles, itemStyle) {
      const [borderStyle, borderRadius] = dHelper.getStyles(
        styles,
        ['bar'],
        ['borderStyle', 'radius'],
      );

      return {
        ...itemStyle,
        borderRadius,
        borderType: borderStyle?.type,
        borderWidth: borderStyle?.width,
        borderColor: borderStyle?.color,
      };
    },

    getSerieBarGap(styles) {
      const [gap] = dHelper.getStyles(styles, ['bar'], ['gap']);
      return gap;
    },

    getSerieBarWidth(styles) {
      const [width] = dHelper.getStyles(styles, ['bar'], ['width']);
      return width;
    },

    getYAxis(styles, yAxisNames) {
      const [
        showAxis,
        inverse,
        lineStyle,
        showLabel,
        font,
        showTitleAndUnit,
        unitFont,
        nameLocation,
        nameGap,
        nameRotate,
        min,
        max,
      ] = dHelper.getStyles(
        styles,
        ['yAxis'],
        [
          'showAxis',
          'inverseAxis',
          'lineStyle',
          'showLabel',
          'font',
          'showTitleAndUnit',
          'unitFont',
          'nameLocation',
          'nameGap',
          'nameRotate',
          'min',
          'max',
        ],
      );
      const name = showTitleAndUnit ? yAxisNames.join(' / ') : null;
      const [showHorizonLine, horizonLineStyle] = dHelper.getStyles(
        styles,
        ['splitLine'],
        ['showHorizonLine', 'horizonLineStyle'],
      );

      return {
        type: 'value',
        name,
        nameLocation,
        nameGap,
        nameRotate,
        inverse,
        min,
        max,
        axisLabel: {
          show: showLabel,
          ...font,
        },
        axisLine: {
          show: showAxis,
          lineStyle,
        },
        axisTick: {
          show: showLabel,
          lineStyle,
        },
        nameTextStyle: unitFont,
        splitLine: {
          show: showHorizonLine,
          lineStyle: horizonLineStyle,
        },
      };
    },

    getXAxis(styles, xAxisColumns) {
      const axisColumnInfo = xAxisColumns[0];
      const [
        showAxis,
        inverse,
        lineStyle,
        showLabel,
        font,
        rotate,
        showInterval,
        interval,
      ] = dHelper.getStyles(
        styles,
        ['xAxis'],
        [
          'showAxis',
          'inverseAxis',
          'lineStyle',
          'showLabel',
          'font',
          'rotate',
          'showInterval',
          'interval',
        ],
      );
      const [showVerticalLine, verticalLineStyle] = dHelper.getStyles(
        styles,
        ['splitLine'],
        ['showVerticalLine', 'verticalLineStyle'],
      );

      return {
        ...axisColumnInfo,
        inverse,
        axisLabel: {
          show: showLabel,
          rotate,
          interval: showInterval ? interval : 'auto',
          ...font,
        },
        axisLine: {
          show: showAxis,
          lineStyle,
        },
        axisTick: {
          show: showLabel,
          lineStyle,
        },
        splitLine: {
          show: showVerticalLine,
          lineStyle: verticalLineStyle,
        },
      };
    },

    getLegendStyle(styles, series) {
      const seriesNames = (series || []).map(col => col?.name);
      const [show, type, font, legendPos, selectAll] = dHelper.getStyles(
        styles,
        ['legend'],
        ['showLegend', 'type', 'font', 'position', 'selectAll'],
      );
      let positions = {};
      let orient = {};

      switch (legendPos) {
        case 'top':
          orient = 'horizontal';
          positions = { top: 0, left: 8, right: 8, height: 32 };
          break;
        case 'bottom':
          orient = 'horizontal';
          positions = { bottom: 8, left: 8, right: 8, height: 32 };
          break;
        case 'left':
          orient = 'vertical';
          positions = { left: 8, top: 16, bottom: 24, width: 96 };
          break;
        default:
          orient = 'vertical';
          positions = { right: 8, top: 16, bottom: 24, width: 96 };
          break;
      }
      const selected = seriesNames.reduce(
        (obj, name) => ({
          ...obj,
          [name]: selectAll,
        }),
        {},
      );

      return {
        ...positions,
        show,
        type,
        orient,
        selected,
        data: seriesNames,
        textStyle: font,
      };
    },

    getLabelStyle(styles) {
      const [show, position, font] = dHelper.getStyles(
        styles,
        ['label'],
        ['showLabel', 'position', 'font'],
      );

      return {
        label: {
          show,
          position,
          ...font,
          formatter: params => {
            const { value, data } = params;
            const formattedValue = dHelper.toFormattedValue(value, data.format);
            const labels = [];
            labels.push(formattedValue);
            return labels.join('\n');
          },
        },
        labelLayout: { hideOverlap: true },
      };
    },

    getSeriesStyle(styles) {
      const [smooth, step] = dHelper.getStyles(
        styles,
        ['graph'],
        ['smooth', 'step'],
      );
      return { smooth, step };
    },

    getStackName(index) {
      return `total`;
    },

    getTooltipFormatterFunc(
      chartDataSet,
      groupConfigs,
      aggregateConfigs,
      colorConfigs,
      infoConfigs,
    ) {
      return seriesParams => {
        const params = Array.isArray(seriesParams)
          ? seriesParams
          : [seriesParams];
        return dHelper.getSeriesTooltips4Rectangular2(
          chartDataSet,
          params[0],
          groupConfigs,
          colorConfigs,
          aggregateConfigs,
          infoConfigs,
        );
      };
    },

    // 类库中的方法
    UniqArray(arr) {
      let newArr = [];
      let json = {};
      for (let i = 0; i < arr.length; i++) {
        if (!json[arr[i]]) {
          newArr.push(arr[i]);
          json[arr[i]] = 1;
        }
      }
      return newArr;
    },

    toPrecision(value, precision) {
      if (isNaN(+value)) {
        return value;
      }
      if (precision < 0 || precision > 100) {
        return value;
      }
      return (+value).toFixed(precision);
    },
  };
}
