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

function RadarChart({ dHelper }) {
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
          maxFieldCount: 1,
        },
        {
          label: 'colorize',
          key: 'color',
          type: 'color',
          maxFieldCount: 1,
        },
      ],
      styles: [
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
              label: 'legend.height',
              key: 'height',
              default: 0,
              comType: 'inputNumber',
              options: {
                step: 40,
                min: 0,
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
          label: 'axisValue.title',
          key: 'axisValue',
          comType: 'group',
          rows: [
            {
              label: 'axisValue.max',
              key: 'maxValue',
              comType: 'inputNumber',
            },
            {
              label: 'axisValue.min',
              key: 'minValue',
              default: 0,
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'areaStyle.title',
          key: 'areaStyle',
          comType: 'group',
          rows: [
            {
              label: 'areaStyle.useAreaBackgroundColor',
              key: 'useAreaBackgroundColor',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'areaStyle.opacity',
              key: 'areaOpacity',
              default: 0.6,
              min: 0,
              max: 1,
              step: 0.1,
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
            chartName: '雷达图',
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
              height: '图例高度',
            },
            axisValue: {
              title: '轴数值',
              max: '最大值',
              min: '最小值',
            },
            areaStyle: {
              title: '区域样式',
              useAreaBackgroundColor: '开启区域底色',
              opacity: '透明度',
            },
          },
        },
        {
          lang: 'en',
          translation: {
            chartName: 'Radar Chart',
            label: {
              title: 'Label',
              showLabel: 'Label Visible',
              position: 'Label Location',
            },
            legend: {
              title: 'Legend',
              showLegend: 'Legend Visible',
              type: 'Legend Type',
              selectAll: 'Legend Select',
              position: 'Legend Position',
              height: 'Legend Height',
            },
            axisValue: {
              title: 'Axis Value Setting',
              max: 'Max Value',
              min: 'Min Value',
            },
            areaStyle: {
              title: 'Area Style',
              useAreaBackgroundColor: 'Show Area Background Color',
              opacity: 'Area Opacity',
            },
          },
        },
      ],
    },

    isISOContainer: 'radar-chart',
    dependency: [
      'https://cdn.jsdelivr.net/npm/echarts@5.3.1/dist/echarts.min.js',
    ],
    meta: {
      id: 'K-radar-chart',
      name: 'chartName',
      icon: 'radar',
    },

    onMount(options, context) {
      if (!context.document) {
        return;
      }
      let { echarts } = context.window;
      let containerDom = context.document.getElementById(options.containerId);
      this.chart = echarts.init(containerDom);

      this.chart.setOption(this.getOptions(options.dataset, options.config));
    },

    onUpdated(options, context) {
      if (!options.dataset || !options.dataset.columns || !options.config) {
        return;
      }
      const newOptions = this.getOptions(options.dataset, options.config);
      this.chart?.setOption(Object.assign({}, newOptions), true);
    },

    onResize(options, context) {
      this.chart?.resize({ width: context?.width, height: context?.height });
    },

    onUnMount() {
      this.chart?.dispose();
    },

    getOptions(dataset, config) {
      const dataConfigs = config.datas || [];
      const styleConfigs = config.styles;

      const groupConfigs = dataConfigs
        .filter(c => c.type === 'group')
        .flatMap(config => config.rows || []);
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);
      const colorConfigs = dataConfigs
        .filter(c => c.type === 'color')
        .flatMap(config => config.rows || []);
      let chartDataSet = dHelper.transformToDataSet(
        dataset.rows,
        dataset.columns,
        config.datas,
      );

      //获取所有维度
      const names = this.getNames(chartDataSet, groupConfigs, styleConfigs);

      // 非多层雷达图，不需要对第二维度进行处理
      if (!colorConfigs.length || colorConfigs.length <= 0) {
        return {
          radar: {
            indicator: names,
          },
          series: [
            {
              type: 'radar',
              data: [
                {
                  value: chartDataSet.map(row =>
                    aggregateConfigs.map(row.getCell, row),
                  ),
                },
              ],
            },
          ],
        };
      }

      const secondGroupInfos = Object.entries(
        chartDataSet.groupBy(colorConfigs[0]),
      ).map(([k, v]) => {
        let a = {};
        a[k] = v;
        return a;
      });
      const [useAreaBackgroundColor, areaOpacity] = dHelper.getStyles(
        styleConfigs,
        ['areaStyle'],
        ['useAreaBackgroundColor', 'areaOpacity'],
      );

      let options = {
        radar: {
          indicator: names,
        },
        legend: {
          ...this.getLegendStyle(styleConfigs, secondGroupInfos),
        },
        tooltip: {},
        series: [
          {
            type: 'radar',
            data: secondGroupInfos.map(sgCol => {
              const k = Object.keys(sgCol)[0];
              const dataSet = sgCol[k];

              const values = names.map(({ name }) => {
                const row = dataSet.find(
                  r => r.getCell(groupConfigs[0]) === name,
                );
                return row?.getCell(aggregateConfigs[0]);
              });

              let data = {
                name: k,
                value: values,
              };
              // 设置区域样式
              if (useAreaBackgroundColor) {
                let areaStyle = {
                  opacity: areaOpacity,
                };
                if (colorConfigs?.[0]?.color?.colors) {
                  const { colors } = colorConfigs[0]['color'];
                  areaStyle.color = this.hexToRgba(
                    colors.find(({ key }) => key === k).value,
                    areaOpacity,
                  );
                }
                data.areaStyle = areaStyle;
              }
              return data;
            }),
            // 设置标签样式
            ...this.getLabelStyle(styleConfigs),
          },
        ],
      };

      if (colorConfigs?.[0]?.color?.colors) {
        const { colors } = colorConfigs[0]['color'];
        options.color = colors.map(color => color.value);
      }
      return options;
    },

    /**
     * 获取雷达图的各个轴名称
     * @param chartDataSet
     * @param groupConfigs
     * @param styles
     */
    getNames(chartDataSet, groupConfigs, styles) {
      let names = [
        ...new Set(chartDataSet.map(row => row.getCell(groupConfigs[0]))),
      ].map(item => ({ name: item }));
      // 获取自定义的最大值、最小值、步进
      // TODO 如果可预见有哪些轴的情况下，可以自定义每个轴各自不同的Max、Min、Color
      const [maxValue, minValue] = dHelper.getStyles(
        styles,
        ['axisValue'],
        ['maxValue', 'minValue', 'stepValue'],
      );
      if (maxValue) {
        names.forEach(name => (name.max = maxValue));
      }
      if (minValue && minValue !== 0) {
        names.forEach(name => (name.min = minValue));
      }
      return names;
    },

    getLabelStyle(styles) {
      const [showLabel, labelPosition, labelFont] = dHelper.getStyles(
        styles,
        ['label'],
        ['showLabel', 'position', 'font'],
      );

      return {
        label: {
          show: showLabel,
          position: labelPosition,
          font: { ...labelFont },
        },
      };
    },

    getLegendStyle(styles, secondGroupInfos) {
      let names = secondGroupInfos.map(item => Object.keys(item)[0]);
      const [show, type, font, legendPos, selectAll, height] =
        dHelper.getStyles(
          styles,
          ['legend'],
          ['showLegend', 'type', 'font', 'position', 'selectAll', 'height'],
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

      const selected = names.reduce(
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
        height: height || null,
        orient,
        selected,
        data: names,
        textStyle: font,
      };
    },

    hexToRgba(hex, opacity) {
      return (
        'rgba(' +
        parseInt('0x' + hex.slice(1, 3)) +
        ',' +
        parseInt('0x' + hex.slice(3, 5)) +
        ',' +
        parseInt('0x' + hex.slice(5, 7)) +
        ',' +
        opacity +
        ')'
      );
    },
  };
}
