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

function DemoCustomLineChart({ dHelper }) {
  const svgIcon = `<svg t="1639279486808" fill="#333333" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4028" width="16" height="16"><path d="M25.6 537.1392a25.6 25.6 0 1 1 0-51.2h141.1072a25.6 25.6 0 0 0 24.5248-18.2272l118.1184-393.7792a51.2 51.2 0 0 1 98.0992 0L665.6 934.4l118.1184-393.728a76.8 76.8 0 0 1 73.5744-54.784H998.4a25.6 25.6 0 1 1 0 51.2h-141.1072a25.6 25.6 0 0 0-24.5248 18.2272l-118.1184 393.7792a51.2 51.2 0 0 1-98.0992 0L358.4 88.6272 240.2816 482.4064a76.8 76.8 0 0 1-73.5744 54.784H25.6z"  p-id="4029"></path></svg>`;

  return {
    config: {
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
            {
              label: 'graph.connectNulls',
              key: 'connectNulls',
              default: false,
              comType: 'checkbox',
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
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'label.position',
              key: 'position',
              comType: 'labelPosition',
              default: 'top',
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
              comType: 'legendType',
              default: 'scroll',
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
              comType: 'legendPosition',
              default: 'right',
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
                type: 'dashed',
                width: 1,
                color: 'black',
              },
            },
            {
              label: 'common.showLabel',
              key: 'showLabel',
              default: true,
              comType: 'checkbox',
              options: [],
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
                type: 'dashed',
                width: 1,
                color: 'black',
              },
            },
            {
              label: 'common.showLabel',
              key: 'showLabel',
              default: true,
              comType: 'checkbox',
              options: [],
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
            {
              label: 'common.showTitleAndUnit',
              key: 'showTitleAndUnit',
              default: true,
              comType: 'checkbox',
              options: [],
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
                color: 'black',
              },
            },
            {
              label: 'common.nameLocation',
              key: 'nameLocation',
              default: 'center',
              comType: 'nameLocation',
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
              default: 60,
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
                color: 'grey',
              },
            },
            {
              label: 'splitLine.showVerticalLine',
              key: 'showVerticalLine',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'verticalLineStyle',
              comType: 'line',
              default: {
                type: 'dashed',
                width: 1,
                color: 'grey',
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
            chartName: '[Experiment] 用户自定义折线图',
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
            graph: {
              title: '折线图',
              smooth: '平滑',
              step: '阶梯',
              connectNulls: '连接空数据',
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
            chartName: '[Experiment] Custom Line Chart',
            common: {
              showAxis: 'Show Axis',
              inverseAxis: 'Inverse Axis',
              lineStyle: 'Line Style',
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
            graph: {
              title: 'Graph',
              smooth: 'Smooth',
              step: 'Step',
              connectNulls: 'Connect Nulls',
            },
            xAxis: {
              title: 'X Axis',
            },
            yAxis: {
              title: 'Y Axis',
            },
            splitLine: {
              title: 'Split Line',
              showHorizonLine: 'Show Horizontal Line',
              showVerticalLine: 'Show Vertical Line',
            },
            reference: {
              title: 'Reference',
              open: 'Open',
            },
          },
        },
      ],
    },
    isISOContainer: 'demo-customize-line-chart',
    dependency: ['https://lib.baomitu.com/echarts/5.0.2/echarts.min.js'],
    meta: {
      id: 'demo-custom-line-chart',
      name: 'chartName',
      icon: svgIcon,
      requirements: [
        {
          group: 1,
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
      const styleConfigs = config.styles;
      const dataConfigs = config.datas || [];
      const groupConfigs = dataConfigs
        .filter(c => c.type === 'group')
        .flatMap(config => config.rows || []);
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);

      const chartDataSet = dHelper.transformToDataSet(
        dataset.rows,
        dataset.columns,
        dataConfigs,
      );

      const xAxisColumns = groupConfigs.map(config => {
        return {
          type: 'category',
          boundaryGap: false,
          tooltip: { show: true },
          data: chartDataSet.map(row => row.getCell(config)),
        };
      });
      const yAxisColumns = aggregateConfigs.map((config, index) => {
        return {
          name: dHelper.getColumnRenderName(config),
          type: index > 0 ? 'bar' : 'line',
          sampling: 'average',
          areaStyle: this.isArea ? {} : undefined,
          stack: this.isStack ? 'total' : undefined,
          data: chartDataSet.map(row => row.getCell(config)),
          ...this.getLabelStyle(styleConfigs),
          ...this.getSeriesStyle(styleConfigs),
        };
      });

      const { min, max } = dHelper.getDataColumnMaxAndMin2(
        chartDataSet,
        aggregateConfigs[0],
      );

      return {
        visualMap: {
          show: false,
          seriesIndex: 0,
          type: 'continuous',
          min,
          max,
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: this.getLegendStyle(
          styleConfigs,
          yAxisColumns.map(col => col?.name) || [],
        ),
        grid: dHelper.getGridStyle(styleConfigs),
        xAxis: this.getXAxis(styleConfigs, xAxisColumns),
        yAxis: this.getYAxis(styleConfigs, yAxisColumns),
        series: yAxisColumns,
      };
    },

    getYAxis(styles, yAxisColumns) {
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
      const name = showTitleAndUnit
        ? yAxisColumns.map(c => c.name).join(' / ')
        : null;
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
        axisLabel: dHelper.getAxisLabel(showLabel, font),
        axisLine: dHelper.getAxisLine(showAxis, lineStyle),
        axisTick: dHelper.getAxisTick(showLabel, lineStyle),
        nameTextStyle: dHelper.getNameTextStyle(
          unitFont?.fontFamily,
          unitFont?.fontSize,
          unitFont?.color,
        ),
        splitLine: dHelper.getSplitLine(showHorizonLine, horizonLineStyle),
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
        axisLabel: dHelper.getAxisLabel(
          showLabel,
          font,
          showInterval ? interval : null,
          rotate,
        ),
        axisLine: dHelper.getAxisLine(showAxis, lineStyle),
        axisTick: dHelper.getAxisTick(showLabel, lineStyle),
        splitLine: dHelper.getSplitLine(showVerticalLine, verticalLineStyle),
      };
    },

    getLegendStyle(styles, seriesNames) {
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
          positions = { top: 8, left: 8, right: 8, height: 32 };
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
      return { label: { show, position, ...font } };
    },

    getSeriesStyle(styles) {
      const [smooth, step, connectNulls] = dHelper.getStyles(
        styles,
        ['graph'],
        ['smooth', 'step', 'connectNulls'],
      );
      return { smooth, step, connectNulls };
    },
  };
}
