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

function LiquidChart({ dHelper }) {
  const svgIcon = `<svg t="1648655744871" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6036" width="200" height="200"><path d="M116.382296 637.714099a542.627177 542.627177 0 0 1 99.353117-257.120286c25.351043-41.021105 54.722154-84.25735 87.456996-128.642186q59.644687-80.647493 125.278454-158.095339 25.925338-30.765829 52.917226-60.711235l4.266195-4.676406L511.661664 0l26.171466 28.468647 4.184152 4.676406 11.732036 12.962669q20.920764 23.710199 41.021105 47.748566 65.633768 77.037635 125.44254 158.095339c32.816884 44.384836 62.023911 87.539038 87.292911 128.642186a542.873304 542.873304 0 0 1 99.271074 257.120286 390.602962 390.602962 0 0 1-395.443452 385.598387 390.602962 390.602962 0 0 1-395.279368-385.598387M482.372595 135.369647q-64.157008 75.314749-122.571061 154.567523a1830.689876 1830.689876 0 0 0-84.421435 124.129864A496.109244 496.109244 0 0 0 185.707964 637.714099a326.117785 326.117785 0 0 0 652.071486 0A497.093751 497.093751 0 0 0 748.107314 414.067034c-24.612663-39.544345-52.753141-81.139746-84.339392-124.129864q-58.578138-79.252775-122.571062-154.567523c-9.763023-11.485909-19.608088-22.807734-29.535196-34.12956a3579.501626 3579.501626 0 0 0-29.289069 34.12956" p-id="6037"></path><path d="M511.743707 908.453392a269.918871 269.918871 0 0 1-275.825911-263.765705c0-145.624923 143.327741-71.868976 275.825911 0s275.82591-145.624923 275.82591 0a270.000913 270.000913 0 0 1-275.82591 263.765705" p-id="6038"></path></svg>`;

  return {
    config: {
      datas: [
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'aggregate',
          limit: 1,
          actions: {
            NUMERIC: ['aggregate', 'format'],
            STRING: ['aggregate', 'format'],
          },
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
          label: '边框',
          key: 'outline',
          comType: 'group',
          rows: [
            {
              label: '边框类型',
              key: 'type',
              default: 'circle',
              comType: 'select',
              options: {
                items: [
                  { label: '圆形', value: 'circle' },
                  { label: '矩形', value: 'rect' },
                  { label: '钻石', value: 'diamond' },
                  { label: '三角形', value: 'triangle' },
                  { label: '钉子', value: 'pin' },
                ],
              },
            },
            {
              label: '宽度',
              key: 'width',
              default: 4,
              comType: 'inputNumber',
            },
            {
              label: '颜色',
              key: 'color',
              comType: 'fontColor',
            },
            {
              label: '与波形距离',
              key: 'distance',
              default: 2,
              min: 0,
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: '填充',
          key: 'fill',
          comType: 'group',
          rows: [
            {
              label: '颜色',
              key: 'color',
              comType: 'fontColor',
            },
            {
              label: '透明度',
              key: 'opacity',
              min: 0,
              max: 1,
              step: 0.1,
              default: 0.8,
              comType: 'inputNumber',
            },
            {
              label: '贴图样式',
              key: 'pattern',
              comType: 'select',
              default: 'default',
              options: {
                items: [
                  { label: '无贴图', value: 'default' },
                  { label: '线', value: 'line' },
                  { label: '点点', value: 'dot' },
                  { label: '方块', value: 'square' },
                ],
              },
            },
          ],
        },
        {
          label: '波形',
          key: 'wave',
          comType: 'group',
          rows: [
            {
              label: '水波数量',
              key: 'count',
              default: 3,
              min: 0,
              max: 10,
              comType: 'inputNumber',
            },
            {
              label: '水波长度',
              key: 'length',
              min: 0,
              max: 1000,
              default: 192,
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: '指标',
          key: 'statistic',
          comType: 'group',
          rows: [
            {
              label: '标题',
              key: 'title',
              comType: 'input',
            },
            {
              label: '前缀文字',
              key: 'prefix',
              comType: 'input',
            },
            {
              label: '后缀文字',
              key: 'suffix',
              comType: 'input',
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
      i18ns: [],
    },

    isISOContainer: 'radar-chart',
    dependency: ['https://unpkg.com/@antv/g2plot@latest/dist/g2plot.min.js'],
    meta: {
      id: 'K-liquid-chart',
      name: 'LiquidChart',
      icon: svgIcon,
    },

    onMount(options, context) {
      if (!context.document) {
        return;
      }
      const { G2Plot } = context.window;
      let containerDom = context.document.getElementById(options.containerId);
      this.liquid = new G2Plot.Liquid(
        containerDom,
        this.getOptions(options.dataset, options.config),
      );
      this.liquid.render();
    },

    onUpdated(options, context) {
      if (
        !options.dataset ||
        !options.dataset.columns ||
        !options.config ||
        !this.liquid
      ) {
        return;
      }
      const newOptions = this.getOptions(options.dataset, options.config);
      this.liquid?.update(Object.assign({}, newOptions));
    },

    onUnMount() {
      this.liquid?.destroy();
    },

    getOptions(dataset, config) {
      const dataConfigs = config.datas || [];
      const styleConfigs = config.styles || [];
      const aggregateConfigs = dataConfigs
        .filter(c => c.type === 'aggregate')
        .flatMap(config => config.rows || []);
      let chartDataSet = dHelper.transformToDataSet(
        dataset.rows,
        dataset.columns,
        config.datas,
      );

      let percent = chartDataSet?.[0]?.getCell?.(aggregateConfigs[0]);
      const [pattern] = dHelper.getStyles(styleConfigs, ['fill'], ['pattern']);
      const [color, opacity] = dHelper.getStyles(
        styleConfigs,
        ['fill'],
        ['color', 'opacity'],
      );
      return {
        percent,
        ...this.getOutLine(styleConfigs),
        ...this.getWave(styleConfigs),
        ...this.getStatistic(styleConfigs),
        liquidStyle: {
          fill: color,
          opacity: opacity,
        },
        color,
        pattern: {
          type: pattern,
        },
      };
    },

    getOutLine(styles) {
      const [type, width, color, distance] = dHelper.getStyles(
        styles,
        ['outline'],
        ['type', 'width', 'color', 'distance'],
      );
      return {
        shape: type,
        outline: {
          border: width,
          color,
          distance,
        },
      };
    },

    getWave(styles) {
      const [count, length] = dHelper.getStyles(
        styles,
        ['wave'],
        ['count', 'length'],
      );
      return {
        wave: {
          count,
          length,
        },
      };
    },

    getStatistic(styles) {
      const [title, prefix, suffix] = dHelper.getStyles(
        styles,
        ['statistic'],
        ['title', 'prefix', 'suffix'],
      );
      let statistic = {};
      if (title) {
        statistic.title = {
          content: title,
        };
      }
      statistic.content = {
        formatter: ({ percent }) => {
          return [prefix, `${(percent * 100).toFixed(2)}%`, suffix]
            .filter(item => item !== undefined)
            .join('');
        },
      };
      return { statistic };
    },
  };
}
