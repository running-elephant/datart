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

/**
 * 本图表插件基于 **1.0.0-beta.1** 开发
 * !使用了dHelper提供的工具函数
 * !使用了es6+
 * 接入使用时 请核对版本后使用
 */
function D3JSBarChart({ dHelper }) {
  const icon =
    '<svg t="1646573481958" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12623" width="200" height="200"><path d="M896 853.333333H170.666667v-85.333333h128a42.666667 42.666667 0 0 0 0-85.333333H170.666667v-85.333334h298.666666a42.666667 42.666667 0 0 0 0-85.333333H170.666667v-85.333333h469.333333a42.666667 42.666667 0 0 0 0-85.333334H170.666667V256h640a42.666667 42.666667 0 0 0 0-85.333333H170.666667V128a42.666667 42.666667 0 0 0-85.333334 0v768a42.666667 42.666667 0 0 0 42.666667 42.666667h768a42.666667 42.666667 0 0 0 0-85.333334z" p-id="12624"></path></svg>';

  const MARGIN_VALUE = 24;

  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
          limit: 1,
          actions: {
            NUMERIC: ['colorize'],
            STRING: ['colorize'],
            DATE: ['colorize'],
          },
        },
        {
          label: 'metrics',
          key: 'metrics',
          type: 'aggregate',
          required: true,
          limit: 1,
          actions: {
            NUMERIC: ['format', 'aggregate'],
            STRING: ['format', 'aggregate'],
            DATE: ['format', 'aggregate'],
          },
        },
        {
          label: '@global@.datas.time',
          key: 'time',
          required: true,
          type: 'group',
          limit: 1,
          actions: {
            NUMERIC: [],
            STRING: [],
            DATE: [],
          },
        },
      ],
      styles: [
        {
          label: 'base.title',
          key: 'base',
          comType: 'group',
          rows: [
            {
              label: 'base.barSize',
              key: 'barSize',
              default: 48,
              comType: 'inputNumber',
            },
            {
              label: 'base.barCountOfAuto',
              key: 'barCountOfAuto',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'base.barCount',
              key: 'barCount',
              options: {
                min: 2,
                max: 100,
              },
              default: 6,
              watcher: {
                deps: ['barCountOfAuto'],
                action: props => {
                  return {
                    disabled: props.barCountOfAuto,
                  };
                },
              },
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'margin.title',
          key: 'margin',
          comType: 'group',
          rows: [
            {
              label: 'margin.marginTop',
              key: 'marginTop',
              default: MARGIN_VALUE,
              comType: 'inputNumber',
            },
            {
              label: 'margin.marginRight',
              key: 'marginRight',
              default: MARGIN_VALUE,
              comType: 'inputNumber',
            },
            {
              label: 'margin.marginBottom',
              key: 'marginBottom',
              default: MARGIN_VALUE,
              comType: 'inputNumber',
            },
            {
              label: 'margin.marginLeft',
              key: 'marginLeft',
              default: MARGIN_VALUE,
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'labels.title',
          key: 'labels',
          comType: 'group',
          rows: [
            {
              label: 'common.fontColor',
              key: 'fontColor',
              default: '#000',
              comType: 'fontColor',
            },
            {
              label: 'labels.mode',
              key: 'labelsMode',
              comType: 'select',
              default: 'bars',
              options: {
                items: [
                  // TODO @Datart 国际化无效
                  { label: 'in axis', value: 'axis' },
                  { label: 'on bars', value: 'bars' },
                ],
              },
            },
            {
              label: 'labels.size',
              key: 'fontSize',
              comType: 'inputNumber',
              default: 12,
            },
          ],
        },
        {
          label: 'animation.title',
          key: 'animation',
          comType: 'group',
          rows: [
            {
              label: 'animation.loopPlay',
              key: 'loopPlay',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'animation.loopPlaySpacing',
              key: 'loopPlaySpacing',
              default: 1000,
              comType: 'inputNumber',
              options: {
                min: 0,
              },
              watcher: {
                deps: ['loopPlay'],
                action: props => {
                  return {
                    disabled: !props.loopPlay,
                  };
                },
              },
            },
            {
              label: 'animation.tickerChangeDuration',
              key: 'tickerChangeDuration',
              comType: 'inputNumber',
              options: {
                min: 250,
              },
              default: 1000,
            },
            {
              label: 'animation.barRaceDuration',
              key: 'barRaceDuration',
              comType: 'inputNumber',
              options: {
                min: 250,
              },
              default: 250,
            },
          ],
        },
        {
          label: 'ticker.title',
          key: 'ticker',
          comType: 'group',
          rows: [
            {
              label: 'ticker.format',
              key: 'tickerFormat',
              default: '%Y',
              comType: 'select',
              options: {
                items: [
                  // TODO @Datart 国际化无效
                  { label: '年', value: '%Y' },
                  { label: '年-月', value: '%Y-%m' },
                  { label: '年-月-日', value: '%Y-%m-%d' },
                  { label: '年-月-日 时', value: '%Y-%m-%d %H' },
                  { label: '年-月-日 时:分', value: '%Y-%m-%d %H:%M' },
                  { label: '年-月-日 时:分:秒', value: '%Y-%m-%d %H:%M:%S' },
                ],
              },
            },
            {
              label: 'common.fontColor',
              key: 'fontColor',
              default: '#000',
              comType: 'fontColor',
            },
            {
              label: 'common.fontSize',
              key: 'fontSize',
              comType: 'fontSize',
              default: 48,
            },
            {
              label: 'common.fontFamily',
              key: 'fontFamily',
              comType: 'fontFamily',
              default:
                '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            },
            {
              label: 'common.fontWeight',
              key: 'fontWeight',
              comType: 'select',
              default: 'normal',
              options: {
                items: [
                  // TODO @Datart 国际化无效
                  // { label: 'common.normal', value: 'normal' },
                  { label: 'normal', value: 'normal' },
                  { label: 'bold', value: 'bold' },
                ],
              },
            },
            {
              label: 'common.fontStyle',
              key: 'fontStyle',
              comType: 'select',
              default: 'normal',
              options: {
                items: [
                  { label: 'normal', value: 'normal' },
                  { label: 'italic', value: 'italic' },
                ],
              },
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
            chartName: '[Extend] 柱状竞赛图',
            common: {
              fontColor: '字体颜色',
              fontSize: '字体大小',
              fontFamily: '字体类型',
              fontWeight: '字体加粗',
              fontStyle: '字体风格',
              normal: '默认',
              bold: '粗体',
              italic: '斜体',
            },
            datas: {
              time: '时间',
            },
            base: {
              title: '基础设置',
              barCountOfAuto: '柱子数量智能展示',
              barCount: '柱子数量',
              barSize: '柱子大小',
            },
            margin: {
              title: '边距设置',
              marginTop: '上边距',
              marginRight: '右边距',
              marginBottom: '下边距',
              marginLeft: '左边距',
            },
            animation: {
              title: '动画设置',
              loopPlay: '循环播放',
              loopPlaySpacing: '循环播放间隔时间(毫秒)',
              tickerChangeDuration: '指示器变化时间(毫秒)',
              barRaceDuration: '柱状赛跑动画过渡时间(毫秒)',
            },
            ticker: {
              title: '指示器设置',
              format: '时间格式',
            },
            labels: {
              title: '标签设置',
              mode: '展示模式',
              size: '标签大小',
            },
          },
        },
        {
          lang: 'en',
          translation: {
            chartName: '[Extend] Bar Chart Race',
            common: {
              fontColor: 'Font Color',
              fontSize: 'Font Size',
              fontFamily: 'Font Family',
              fontWeight: 'Font Weight',
              fontStyle: 'Font Style',
              normal: 'Normal',
              bold: 'Bold',
              italic: 'Italic',
            },
            datas: {
              time: 'Time',
            },
            base: {
              title: 'Base Setting',
              barCountOfAuto: 'Bar Count Of Auto',
              barCount: 'Bar Count',
              barSize: 'Bar Size',
            },
            margin: {
              title: 'Margin Setting',
              marginLeft: 'Margin Left',
              marginRight: 'Margin Right',
            },
            animation: {
              title: 'Animation Setting',
              loopPlay: 'Loop Play',
              loopPlaySpacing: 'Loop Play Spaing Time(ms)',
              tickerChangeDuration: 'Ticker Change Duration Time(ms)',
              barRaceDuration: 'Bar Race Duration Time(ms)',
            },
            ticker: {
              title: 'Ticker Setting',
              format: 'Time Format',
            },
            labels: {
              title: 'Labels Setting',
              mode: 'Show Mode',
              size: 'Labels Size',
            },
          },
        },
      ],
    },
    dependency: ['https://d3js.org/d3.v6.min.js'],
    meta: {
      id: 'bar-chart-race',
      name: 'chartName',
      icon,
      requirements: [],
    },

    onResize(options, context) {
      this.onUpdated(options, context);
    },

    onMount(options, context) {
      if (!context.document && !context.window.d3) {
        return;
      }
      this._container = context.document.getElementById(options.containerId);
      this._d3 = context.window.d3;
      this._transitionStatus = 'mount';
    },

    onUnMount() {
      this.clearSvg();
    },

    onUpdated(options, context) {
      if (!options.dataset || !options.dataset.columns || !options.config) {
        return;
      }
      // 数据集不满足 不进行任何操作
      if (!this.datasConfigVerify(options.config?.datas)) {
        return;
      }

      // 更新样式配置相关
      const style = this.getCurrentStyleValues(options.config);
      this.updateStyleConfig(style, context);

      // 更新数据配置相关
      const data = this.getCurrentDataValues(options.dataset, options.config);
      const { keyframes, prev, next, getDMFMapInfo, dimensionMap } = data;

      // getDMFMapInfo信息挂载到全局 因为有很多地方要用到
      this.getDMFMapInfo = getDMFMapInfo;
      // 更新默认着色
      this.setDefaultThemeColor(dimensionMap);

      // 准备工作结束 演员和舞台就绪
      const updateBars = this.renderBars(prev, next, this);
      const updateAxis = this.getAxis(this);
      const updateLabels = [];
      if (style.labels.labelsMode === 'axis') {
        updateLabels.push(this.renderAxisLabels(prev, next, this));
        updateLabels.push(this.renderValueLabels(prev, next, this));
      }
      if (style.labels.labelsMode === 'bars') {
        updateLabels.push(this.renderLabels(prev, next, this));
      }
      const updateTicker = this.getTicker(keyframes, this);

      // 表演节目存储起来
      this.runKeyframes = async (keyframeIndex = 0) => {
        const kLength = keyframes.length;
        for (; keyframeIndex < kLength; keyframeIndex++) {
          // console.time('runKeyframe time is');
          const keyframe = keyframes[keyframeIndex];
          const transition = this.svg
            .transition()
            .duration(this._styleValues.animation.barRaceDuration)
            .ease(this._d3.easeLinear);

          this.x.domain([0, keyframe[1][0][getDMFMapInfo.metrics]]);

          updateAxis(keyframe, transition);
          updateBars(keyframe, transition);
          updateLabels.forEach(u => u(keyframe, transition));
          updateTicker(keyframe, transition);

          await transition.end();

          if (
            this._transitionStatus !== 'play' &&
            keyframeIndex < kLength - 1 &&
            keyframe[2] === 'start'
          ) {
            this._keyframeIndex = ++keyframeIndex;
            break;
          }
          if (keyframeIndex === kLength - 1) {
            this._transitionStatus = 'finish';
          }
          // console.timeEnd('runKeyframe time is');
        }

        if (
          this._styleValues.animation.loopPlay &&
          this._transitionStatus === 'finish'
        ) {
          this.loopPlaySpacingTimer = this._d3.timeout(() => {
            this._transitionStatus = 'play';
            this.runKeyframes();
          }, this._styleValues.animation.loopPlaySpacing);
        }
      };

      // 开始表演
      this._transitionStatus = 'play';
      this.runKeyframes();
    },

    /** 开始动画 */
    async runKeyframes() {
      console.warn('no keyframes');
    },

    /** 初始化svg */
    initSvgContainer() {
      this.clearSvg();

      const { margin, base, contextWidth, contextHeight } = this._styleValues;
      const { marginLeft, marginRight, marginTop, marginBottom } = margin;
      const { barCount, barSize } = base;
      this.x = this._d3.scaleLinear(
        [0, 1],
        [marginLeft, contextWidth - marginRight],
      );

      this.y = this._d3
        .scaleBand()
        .domain(this._d3.range(barCount + 1))
        .rangeRound([marginTop, marginTop + barSize * (barCount + 1 + 0.1)])
        .padding(0.1);

      this.svg = this._d3
        .select(this._container)
        .append('svg')
        .attr('viewBox', [0, 0, contextWidth, contextHeight]);
    },

    /** 清空svg */
    clearSvg() {
      if (this.svg) {
        this.svg.interrupt();
        this.svg.remove();
      }
      if (this.loopPlaySpacingTimer) {
        this.loopPlaySpacingTimer.stop();
      }
    },

    /** 更新默认着色 */
    setDefaultThemeColor(list) {
      const colorList = dHelper.getDefaultThemeColor();
      this.getDefaultThemeColor = Array.from(list).reduce(
        (acc, item, index) => {
          acc[item] = colorList[index % colorList.length];
          return acc;
        },
        {},
      );
    },

    /** 生成D3所需要的样式配置信息 */
    getCurrentStyleValues(config) {
      // 获取样式配置信息
      const styleConfigs = config.styles;

      // 获取style配置
      // 这里没有使用解构是因为有些key是重名的，解构还需要重新命名
      const base = dHelper.getStyles(
        styleConfigs,
        ['base'],
        ['barCountOfAuto', 'barCount', 'barSize'],
      );
      const margin = dHelper.getStyles(
        styleConfigs,
        ['margin'],
        ['marginLeft', 'marginRight', 'marginTop', 'marginBottom'],
      );
      const labels = dHelper.getStyles(
        styleConfigs,
        ['labels'],
        ['fontColor', 'labelsMode', 'fontSize'],
      );
      const animation = dHelper.getStyles(
        styleConfigs,
        ['animation'],
        [
          'barRaceDuration',
          'tickerChangeDuration',
          'loopPlay',
          'loopPlaySpacing',
        ],
      );
      const ticker = dHelper.getStyles(
        styleConfigs,
        ['ticker'],
        [
          'fontColor',
          'fontSize',
          'fontFamily',
          'fontWeight',
          'fontStyle',
          'tickerFormat',
        ],
      );

      return {
        base: {
          barCountOfAuto: base[0],
          barCount: base[1],
          barSize: base[2],
        },
        margin: {
          marginLeft: margin[0],
          marginRight: margin[1],
          marginTop: margin[2],
          marginBottom: margin[3],
        },
        labels: {
          fontColor: labels[0],
          labelsMode: labels[1],
          fontSize: labels[2],
        },
        animation: {
          barRaceDuration: animation[0],
          tickerChangeDuration: animation[1],
          loopPlay: animation[2],
          loopPlaySpacing: animation[3],
        },
        ticker: {
          fontColor: ticker[0],
          fontSize: ticker[1],
          ticker: ticker[2],
          fontWeight: ticker[3],
          fontStyle: ticker[4],
          tickerFormat: ticker[5],
        },
      };
    },

    /** 生成D3所需要的数据配置信息 */
    getCurrentDataValues(dataset, config) {
      // 当前服务端返回的数据集
      const dataConfigs = config.datas;
      // 获取 维度、指标、时间 配置信息
      const getDMFMapInfo = dataConfigs.reduce((acc, config) => {
        let value = null;
        switch (config.key) {
          case 'dimension':
            value = config.rows?.[0] || {};
            return {
              ...acc,
              dimension: dHelper.getColumnRenderName(value),
              dimensionConfig: value,
            };
          case 'metrics':
            value = config.rows?.[0] || {};
            return {
              ...acc,
              metrics: dHelper.getColumnRenderName(value),
              metricsConfig: value,
            };
          case 'time':
            value = config.rows?.[0] || {};
            return {
              ...acc,
              time: dHelper.getColumnRenderName(value),
            };
          default:
            return acc;
        }
      }, {});
      // 数据转换
      const chartDataSet = dHelper.transformToDataSet(
        dataset.rows,
        dataset.columns,
        dataConfigs,
      );
      // const data = chartDataSet.map(row => {
      //   const object = row?.convertToCaseSensitiveObject();
      //   return {
      //     ...object,
      //     [getDMFMapInfo.metrics]: dHelper.toFormattedValue(
      //       object[getDMFMapInfo.metrics],
      //       getDMFMapInfo.metricsConfig?.format,
      //     ),
      //   };
      // });
      // TODO @Datart 配置开放不够灵活
      // 对于指标的格式功能 可能我只想要”数值型“的格式方式 但是目前没有办法关闭其他选项
      const data = chartDataSet.map(row => row?.convertToCaseSensitiveObject());

      const { keyframes, dimensionMap } = this.getKeyframes(
        data,
        getDMFMapInfo,
      );

      const dimensionframes = this._d3.groups(
        keyframes.flatMap(([, data]) => data),
        d => d[getDMFMapInfo.dimension],
      );

      const prev = new Map(
        dimensionframes.flatMap(([, data]) =>
          this._d3.pairs(data, (a, b) => [b, a]),
        ),
      );

      const next = new Map(
        dimensionframes.flatMap(([, data]) => this._d3.pairs(data)),
      );

      return {
        keyframes,
        prev,
        next,
        getDMFMapInfo,
        dimensionMap,
      };
    },

    /** 效验数据是否合法 */
    datasConfigVerify(datas) {
      if (!datas) {
        return false;
      }
      return (
        datas.reduce((acc, config) => {
          switch (config.key) {
            case 'dimension':
              acc.add('dimension');
              break;
            case 'metrics':
              acc.add('metrics');
              break;
            case 'time':
              acc.add('time');
              break;
            default:
              break;
          }
          return acc;
        }, new Set()).size === 3
      );
    },

    /** 柱状图数量智能计算 */
    getComputedSectionStyle(style) {
      const { base, margin, contextHeight } = style;
      const { barCountOfAuto, barSize, barCount } = base;
      const { marginTop, marginBottom } = margin;

      if (barCountOfAuto) {
        const bCount = Math.floor(
          (contextHeight - marginTop - marginBottom) / barSize,
        );
        // 判断为0 避免在极小的视图情况下做无意义的计算
        if (bCount > 0) {
          style.base.barCount = bCount;
          const marginOfAuto = Math.floor(
            (contextHeight - bCount * barSize) / 2,
          );
          style.margin.marginTop = marginOfAuto;
          style.margin.marginBottom = marginOfAuto;
        }
      } else {
        // 因为不使用智能分析了 所以需要要把高度给撑开
        const computedHeight = marginTop + barCount * barSize + marginBottom;
        if (computedHeight > contextHeight) {
          style.contextHeight = computedHeight;
        }
      }
    },

    /** 更新样式配置信息 */
    updateStyleConfig(style, context) {
      this._styleValues = style;
      // 在styleValues中注入context的实际宽高
      this._styleValues.contextWidth = context.width;
      this._styleValues.contextHeight = context.height;

      this.getComputedSectionStyle(this._styleValues);

      this.initSvgContainer();
    },

    /** 获取d3动画信息 */
    getKeyframes(data, getDMFMapInfo) {
      const { base, animation } = this._styleValues;
      const { dimension, metrics, time } = getDMFMapInfo;

      const dimensionMap = new Set(data.map(d => d[dimension]));

      // 将可迭代对象的值分组并减少到一个从键到值的InternMap中
      // time => dimension => metrics
      // key进行Date+asc排序
      const timeValues = Array.from(
        this._d3.rollup(
          data,
          ([d]) => d[metrics],
          d => d[time],
          d => d[dimension],
        ),
      )
        .map(([date, data]) => [new Date(date), data])
        .sort(([a], [b]) => this._d3.ascending(a, b));

      function rank(value, d3, n) {
        const r_data = Array.from(dimensionMap, name => ({
          [dimension]: name,
          [metrics]: value(name),
        }));
        r_data.sort((a, b) => d3.descending(a[metrics], b[metrics]));
        // $_rank 特殊命名 防止冲突
        for (let i = 0; i < r_data.length; ++i)
          r_data[i].$_rank = Math.min(n, i);
        return r_data;
      }

      // oiling是做什么的？
      // 举个例子 现在time有10个数值，从2000年到2010年
      // 在只设置了柱状竞赛动画过渡时间(300ms)的情况下
      // 整个竞赛的时长只有300ms * 10 3秒就结束了
      // 所以需要一个可以控制每个time过渡时间的变量
      const oiling = Math.round(
        animation.tickerChangeDuration / animation.barRaceDuration,
      );

      const keyframes = [];
      let prevTime, pTimeValues, nextTime, nTimeValues;
      for ([[prevTime, pTimeValues], [nextTime, nTimeValues]] of this._d3.pairs(
        timeValues,
      )) {
        for (let i = 0; i < oiling; ++i) {
          const oilingVariable = i / oiling;
          keyframes.push([
            // new Date(
            //   prevTime * (1 - oilingVariable) + nextTime * oilingVariable,
            // ),
            new Date(prevTime),
            rank(
              name =>
                (pTimeValues.get(name) || 0) * (1 - oilingVariable) +
                (nTimeValues.get(name) || 0) * oilingVariable,
              this._d3,
              base.barCount,
            ),
            // 时间段进行标记
            i === 0 ? 'start' : i === oiling - 1 ? 'end' : 'run',
          ]);
        }
      }

      keyframes.push([
        new Date(nextTime),
        rank(
          name => Number(nTimeValues.get(name)) || 0,
          this._d3,
          base.barCount,
        ),
      ]);
      return { keyframes, dimensionMap };
    },

    /** 渲染bar颜色 */
    getColor(that) {
      let colors = that.getDefaultThemeColor;
      const userSet = that.getDMFMapInfo.dimensionConfig?.color?.colors;
      if (userSet) {
        colors = userSet.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
      }
      return d => {
        return colors[d[that.getDMFMapInfo.dimension]];
      };
    },

    /** 获取bars配置 */
    renderBars(prev, next, that) {
      let bar = that.svg.append('g').selectAll('rect');
      const { base } = that._styleValues;

      return ([_, data], transition) =>
        (bar = bar
          .data(
            data.slice(0, base.barCount),
            d => d[that.getDMFMapInfo.dimension],
          )
          .join(
            enter =>
              enter
                .append('rect')
                .attr('fill', that.getColor(that))
                .attr('height', that.y.bandwidth())
                .attr('x', that.x(0))
                .attr('y', d => that.y((prev.get(d) || d).$_rank))
                .attr(
                  'width',
                  d =>
                    that.x((prev.get(d) || d)[that.getDMFMapInfo.metrics]) -
                    that.x(0),
                ),
            update => update,
            exit =>
              exit
                .transition(transition)
                .remove()
                .attr('y', d => that.y((next.get(d) || d).$_rank))
                .attr(
                  'width',
                  d =>
                    that.x((next.get(d) || d)[that.getDMFMapInfo.metrics]) -
                    that.x(0),
                ),
          )
          .call(g =>
            g
              .transition(transition)
              .attr('y', d => that.y(d.$_rank))
              .attr(
                'width',
                d => that.x(d[that.getDMFMapInfo.metrics]) - that.x(0),
              ),
          ));
    },

    /** 格式化文本 */
    getTextTween(a, b, that) {
      const type = that.getDMFMapInfo.metricsConfig?.format?.type;
      let format = null;
      if (type === 'numeric') {
        format = that.getDMFMapInfo.metricsConfig.format[type];
      }

      const i = that._d3.interpolateNumber(a, b);
      return function (t) {
        if (format) {
          this.textContent =
            (format.prefix || '') +
            that._d3.format(
              `${format.useThousandSeparator ? ',' : ''}.${
                format.decimalPlaces || 0
              }f`,
            )(i(t)) +
            (format.suffix || '');
        } else {
          this.textContent = that._d3.format(',d')(i(t));
        }
      };
    },

    /** 获取labels配置 */
    renderLabels(prev, next, that) {
      const { base, labels } = that._styleValues;
      let label = that.svg
        .append('g')
        .style('font-weight', 'bold')
        .style('font-size', labels.fontSize)
        .style('fill', labels.fontColor)
        .style('text-anchor', 'end')
        .selectAll('text');

      return ([_, data], transition) =>
        (label = label
          .data(
            data.slice(0, base.barCount),
            d => d[that.getDMFMapInfo.dimension],
          )
          .join(
            enter =>
              enter
                .append('text')
                .attr(
                  'transform',
                  d =>
                    `translate(${that.x(
                      (prev.get(d) || d)[that.getDMFMapInfo.metrics],
                    )},${that.y((prev.get(d) || d).$_rank)})`,
                )
                .attr('y', that.y.bandwidth() / 2)
                .attr('x', -6)
                .attr('dy', '-0.25em')
                .text(d => d[that.getDMFMapInfo.dimension])
                .call(text =>
                  text
                    .append('tspan')
                    .attr('fill-opacity', 0.7)
                    .attr('font-weight', 'normal')
                    .attr('x', -6)
                    .attr('dy', '1.15em'),
                ),
            update => update,
            exit =>
              exit
                .transition(transition)
                .remove()
                .attr(
                  'transform',
                  d =>
                    `translate(${that.x(
                      (next.get(d) || d)[that.getDMFMapInfo.metrics],
                    )},${that.y((next.get(d) || d).$_rank)})`,
                )
                .call(g =>
                  g
                    .select('tspan')
                    .tween('text', d =>
                      that.getTextTween(
                        d[that.getDMFMapInfo.metrics],
                        (next.get(d) || d)[that.getDMFMapInfo.metrics],
                        that,
                      ),
                    ),
                ),
          )
          .call(g =>
            g
              .transition(transition)
              .attr(
                'transform',
                d =>
                  `translate(${that.x(d[that.getDMFMapInfo.metrics])},${that.y(
                    d.$_rank,
                  )})`,
              )
              .call(g =>
                g
                  .select('tspan')
                  .tween('text', d =>
                    that.getTextTween(
                      (prev.get(d) || d)[that.getDMFMapInfo.metrics],
                      d[that.getDMFMapInfo.metrics],
                      that,
                    ),
                  ),
              ),
          ));
    },

    /** 获取Axislabels配置 */
    renderAxisLabels(prev, next, that) {
      const { base, labels, margin } = that._styleValues;
      let label = that.svg
        .append('g')
        .style('font-weight', 'bold')
        .style('font-size', labels.fontSize)
        .style('fill', labels.fontColor)
        .style('text-anchor', 'end')
        .selectAll('text');

      return ([_, data], transition) =>
        (label = label
          .data(
            data.slice(0, base.barCount),
            d => d[that.getDMFMapInfo.dimension],
          )
          .join(
            enter =>
              enter
                .append('text')
                .attr(
                  'transform',
                  d =>
                    `translate(${margin.marginLeft},${that.y(
                      (prev.get(d) || d).$_rank,
                    )})`,
                )
                .attr('y', that.y.bandwidth() / 2)
                .attr('x', -6)
                .attr('dy', '0.25em')
                .text(d => d[that.getDMFMapInfo.dimension]),
            update => update,
            exit =>
              exit
                .transition(transition)
                .remove()
                .attr(
                  'transform',
                  d =>
                    `translate(${margin.marginLeft},${that.y(
                      (next.get(d) || d).$_rank,
                    )})`,
                ),
          )
          .call(g =>
            g
              .transition(transition)
              .attr(
                'transform',
                d => `translate(${margin.marginLeft},${that.y(d.$_rank)})`,
              ),
          ));
    },

    /** 获取Valuelabels配置 */
    renderValueLabels(prev, next, that) {
      const { base } = that._styleValues;
      let label = that.svg
        .append('g')
        .style('font-size', 12)
        .style('fill', '#000')
        .selectAll('text');

      return ([_, data], transition) =>
        (label = label
          .data(
            data.slice(0, base.barCount),
            d => d[that.getDMFMapInfo.dimension],
          )
          .join(
            enter =>
              enter
                .append('text')
                .attr(
                  'transform',
                  d =>
                    `translate(${that.x(
                      (prev.get(d) || d)[that.getDMFMapInfo.metrics],
                    )},${that.y((prev.get(d) || d).$_rank)})`,
                )
                .attr('y', that.y.bandwidth() / 2)
                .attr('x', 6)
                .attr('dy', '0.25em'),
            update => update,
            exit =>
              exit
                .transition(transition)
                .remove()
                .attr(
                  'transform',
                  d =>
                    `translate(${that.x(
                      (next.get(d) || d)[that.getDMFMapInfo.metrics],
                    )},${that.y((next.get(d) || d).$_rank)})`,
                )
                .call(g =>
                  g.tween('text', d =>
                    that.getTextTween(
                      d[that.getDMFMapInfo.metrics],
                      (next.get(d) || d)[that.getDMFMapInfo.metrics],
                      that,
                    ),
                  ),
                ),
          )
          .call(g =>
            g
              .transition(transition)
              .attr(
                'transform',
                d =>
                  `translate(${that.x(d[that.getDMFMapInfo.metrics])},${that.y(
                    d.$_rank,
                  )})`,
              )
              .call(g =>
                g.tween('text', d =>
                  that.getTextTween(
                    (prev.get(d) || d)[that.getDMFMapInfo.metrics],
                    d[that.getDMFMapInfo.metrics],
                    that,
                  ),
                ),
              ),
          ));
    },

    /** 获取轴配置 */
    getAxis(that) {
      const { margin, contextWidth, base } = that._styleValues;
      const g = that.svg
        .append('g')
        .attr('transform', `translate(0,${margin.marginTop})`);

      const axis = that._d3
        .axisTop(that.x)
        .ticks(contextWidth / 120)
        .tickSizeOuter(0)
        .tickSizeInner(-base.barSize * (base.barCount + that.y.padding()));

      return (_, transition) => {
        g.transition(transition).call(axis);
        g.select('.tick:first-of-type text').remove();
        g.selectAll('.tick:not(:first-of-type) line').attr('stroke', 'white');
        g.select('.domain').remove();
      };
    },

    /** 播放 暂停 重播 事件 */
    transitionHandle(that) {
      return () => {
        if (that._transitionStatus === 'play') {
          that._transitionStatus = 'stop';
        } else if (that._transitionStatus === 'stop') {
          that._transitionStatus = 'play';
          that.runKeyframes(that._keyframeIndex);
        } else if (that._transitionStatus === 'finish') {
          if (this.loopPlaySpacingTimer) {
            this.loopPlaySpacingTimer.stop();
          }
          that._transitionStatus = 'play';
          that.runKeyframes();
        }
      };
    },

    /** 获取当前指示器 */
    getTicker(keyframes, that) {
      const { base, contextWidth, margin, ticker } = that._styleValues;
      const {
        fontWeight,
        fontSize,
        fontFamily,
        fontStyle,
        fontColor,
        tickerFormat,
      } = ticker;
      const formatDate = that._d3.utcFormat(tickerFormat);

      const now = that.svg
        .append('text')
        .style('font-family', fontFamily)
        .style('font-style', fontStyle)
        .style('font-weight', fontWeight)
        .style('font-size', fontSize)
        .style('fill', fontColor)
        .style('cursor', 'pointer')
        .style('text-anchor', 'end')
        .attr('x', contextWidth - 6)
        .attr('y', margin.marginTop + base.barSize * (base.barCount - 0.45))
        .attr('dy', '0.32em')
        .text(formatDate(keyframes[0][0]))
        .on('click', that.transitionHandle(that));

      return ([date], transition) => {
        transition.end().then(() => now.text(formatDate(date)));
      };
    },
  };
}
