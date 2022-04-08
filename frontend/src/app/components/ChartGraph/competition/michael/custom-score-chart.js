import ChartConfigHelper from './chartConfigHelper';

/**
 * 自定义扩展极坐标柱状图
 * @param dHelper 构建参数
 * @returns 返回组件
 */
function CustomScoreChart({ dHelper }) {
  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
          limit: 0,
        },
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'aggregate',
          limit: [1, 3],
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
          label: 'title.title',
          key: 'titleContent',
          comType: 'group',
          rows: [
            {
              label: 'title.title',
              key: 'titleText',
              comType: 'input',
            },
            {
              label: 'font',
              key: 'titleFont',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '14',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#495057',
              },
            },
            {
              label: 'common.positionX',
              key: 'titleX',
              default: 80,
              comType: 'inputNumber',
            },
            {
              label: 'common.positionY',
              key: 'titleY',
              default: 30,
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'common.body',
          key: 'bodyContent',
          comType: 'group',
          rows: [
            {
              label: 'common.isShow',
              key: 'bodyIsShow',
              comType: 'checkbox',
            },
            {
              label: 'common.prefixText',
              key: 'bodyPrefix',
              comType: 'input',
            },
            {
              label: 'font',
              key: 'bodyPrefixFont',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '14',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#495057',
              },
            },
            {
              label: 'common.positionX',
              key: 'bodyPrefixPositionX',
              default: 0,
              comType: 'inputNumber',
            },
            {
              label: 'common.positionY',
              key: 'bodyPrefixPositionY',
              default: 0,
              comType: 'inputNumber',
            },
            {
              label: 'common.colName',
              key: 'bodyColName',
              comType: 'input',
            },
            {
              label: 'common.bodyText',
              key: 'bodyTextFont',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '14',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#495057',
              },
            },
            {
              label: 'common.positionX',
              key: 'bodyTextX',
              default: 80,
              comType: 'inputNumber',
            },
            {
              label: 'common.positionY',
              key: 'bodyTextY',
              default: 60,
              comType: 'inputNumber',
            },
            {
              label: 'common.suffixText',
              key: 'bodySuffixFont',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '14',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#495057',
              },
            },
            {
              label: 'common.positionX',
              key: 'bodySuffixPositionX',
              default: 0,
              comType: 'inputNumber',
            },
            {
              label: 'common.positionY',
              key: 'bodySuffixPositionY',
              default: 0,
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'common.bottomText',
          key: 'bottomContent',
          comType: 'group',
          rows: [
            {
              label: 'common.isShow',
              key: 'buttomIsShow',
              comType: 'checkbox',
            },
            {
              label: 'common.buttomUpText',
              key: 'buttomUpText',
              comType: 'input',
            },
            {
              label: 'common.decreaseText',
              key: 'decreaseText',
              comType: 'input',
            },
            {
              label: 'font',
              key: 'bottomPrefixFont',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '14',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#495057',
              },
            },
            {
              label: 'common.colName',
              key: 'bottomBodyColName',
              comType: 'input',
            },
            {
              label: 'common.bottomBodyText',
              key: 'bootomBodyTextFont',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '14',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: '#495057',
              },
            },
            {
              label: 'common.positionX',
              key: 'bottomTextX',
              default: 100,
              comType: 'inputNumber',
            },
            {
              label: 'common.positionY',
              key: 'bottomTextY',
              default: 100,
              comType: 'inputNumber',
            },
            {
              label: 'common.upImage',
              key: 'bottomSuffixUpImage',
              default:
                '/resources/image/dashboard/f8ac1db09a164874b46a7dad97adad0c/6e92f4f7-e0a7-4ee3-b171-212e791e3cd2',
              comType: 'input',
            },
            {
              label: 'common.decreaseImage',
              key: 'bottomSuffixDecreaseImage',
              default:
                '/resources/image/dashboard/f8ac1db09a164874b46a7dad97adad0c/c22520ef-3ebf-4783-828b-2c1c34fa42bf',
              comType: 'input',
            },
            {
              label: 'common.imgPosition',
              key: 'bottomSuffixImagePosition',
              default: 'after',
              comType: 'input',
            },
          ],
        },
        {
          label: 'common.background',
          key: 'backgroundContent',
          comType: 'group',
          rows: [
            {
              label: 'common.image',
              key: 'backgroundImage',
              comType: 'input',
            },
            {
              label: 'common.width',
              key: 'backgroundWidth',
              comType: 'inputNumber',
            },
            {
              label: 'common.height',
              key: 'backgroundHeight',
              comType: 'inputNumber',
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
              title: '标签',
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
    isISOContainer: 'custom-score-chart',
    dependency: ['/custom-chart-plugins/temp/echarts_5.0.2.js'],
    meta: {
      id: 'custom-score-chart',
      name: '自定义翻牌器',
      icon: 'fanpaiqi',
      requirements: [
        {
          group: 0,
          aggregate: [1, 3],
        },
      ],
    },

    onMount(options, context) {
      this.globalContext = context;
      if ('echarts' in context.window) {
        // 组件对象初始化
        this.chart = context.window.echarts.init(
          context.document.getElementById(options.containerId),
          'default',
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
      }
    },

    // 当前组件设置信息变更时调用
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

    // 卸载组件清理资源
    onUnMount() {
      this.chart && this.chart.dispose();
    },

    // 改变大小时触发
    onResize(opt, context) {
      this.chart && this.chart.resize(context);
    },

    getOptions(dataset, config) {
      let configData = this.getConfigData(config, dataset);
      let componentList = this.getComponentList(configData);
      let options = {
        series: [
          {
            type: 'custom',
            data: [[0, 0]],
            renderItem: (params, api) => {
              return {
                type: 'group',
                children: componentList,
              };
            },
          },
        ],
        xAxis: {
          axisLabel: { show: false },
          axisLine: { show: false },
          splitLine: { show: false },
          axisTick: { show: false },
          min: -1,
          max: 1,
        },
        yAxis: {
          axisLabel: { show: false },
          axisLine: { show: false },
          splitLine: { show: false },
          axisTick: { show: false },
          min: -1,
          max: 1,
        },
      };
      return options;
    },
    getComponentList(configData) {
      let componentList = [];
      // 添加背景图片
      if (configData.background && configData.background.show) {
        componentList.push({
          type: 'image',
          left: 'middle',
          bottom: 'middle',
          style: configData.background,
        });
      }

      // 添加标题
      if (configData.title && configData.title.show) {
        componentList.push({
          type: 'text',
          style: configData.title,
        });
      }

      // 添加主体
      if (configData.body && configData.body.show) {
        // 主体前缀
        if (configData.body.prefixText && configData.body.prefixText.show) {
          componentList.push({
            type: 'text',
            style: configData.body.prefixText,
          });
        }
        // 主体内容
        if (configData.body.bodyText && configData.body.bodyText.show) {
          componentList.push({
            type: 'text',
            style: configData.body.bodyText,
          });
        }
        // 主体后缀
        if (configData.body.suffixText && configData.body.suffixText.show) {
          componentList.push({
            type: 'text',
            style: configData.body.suffixText,
          });
        }
      }
      // 添加底部描述内容
      if (configData.bottom && configData.bottom.show) {
        // 底部前缀
        if (configData.bottom.prefixText && configData.bottom.prefixText.show) {
          componentList.push({
            type: 'text',
            style: configData.bottom.prefixText,
          });
        }
        // 底部主体内容
        if (configData.bottom.bodyText && configData.bottom.bodyText.show) {
          componentList.push({
            type: 'text',
            style: configData.bottom.bodyText,
          });
        }
        // 底部后缀
        if (configData.bottom.suffixText && configData.bottom.suffixText.show) {
          componentList.push({
            type: 'text',
            style: configData.bottom.suffixText,
          });
        }
        // 底部后缀图标
        if (
          configData.bottom.suffixImage &&
          configData.bottom.suffixImage.show
        ) {
          componentList.push({
            type: 'image',
            style: configData.bottom.suffixImage,
          });
        }
      }
      return componentList;
    },
    /**
     * 解析获取配置信息
     * @param {*} config
     */
    getConfigData(config, dataset) {
      let configObj = {};

      let configStyles = config.styles;

      // 标题配置
      configObj.title = this.getTitleConfig(configStyles[0]);
      // 主体配置
      configObj.body = this.getBodyConfig(configStyles[1], dataset, config);
      // 底部配置
      configObj.bottom = this.getBottomConfig(configStyles[2], dataset, config);
      // 背景配置
      configObj.background = this.getBackgroundConfig(configStyles[3]);
      return configObj;
    },
    /**
     * 获取背景配置
     * @param {*} backgroundConfig 背景配置
     * @returns
     */
    getBackgroundConfig(backgroundConfig) {
      let background = {
        image: ChartConfigHelper.getConfigValue(
          'backgroundImage',
          backgroundConfig,
        ),
        width: ChartConfigHelper.getConfigValue(
          'backgroundWidth',
          backgroundConfig,
        ),
        height: ChartConfigHelper.getConfigValue(
          'backgroundHeight',
          backgroundConfig,
        ),
      };
      background.show = background.image ? true : false;
      return background;
    },
    /**
     * 解析标题配置内容
     * @param {*} titleConfig 标题配置
     */
    getTitleConfig(titleConfig) {
      let title = {};
      title.text = ChartConfigHelper.getConfigValue('titleText', titleConfig);
      title.show = title.text ? true : false;
      let titleFont = ChartConfigHelper.getConfigValue(
        'titleFont',
        titleConfig,
      );
      title.font = ChartConfigHelper.formatFont(titleFont);
      title.fill = titleFont.color;
      title.x = ChartConfigHelper.getConfigValue('titleX', titleConfig);
      title.y = ChartConfigHelper.getConfigValue('titleY', titleConfig);
      return title;
    },
    /**
     * 获取主体内容配置
     * @param {*} bodyConfig 主体样式配置
     * @param {*} datasets 后台数据集
     * @returns 主体组件内容
     */
    getBodyConfig(bodyConfig, datasets, config) {
      let configKeyObj = {
        bodyColName: 'bodyColName',
        bodyTextFont: 'bodyTextFont',
        bodyTextX: 'bodyTextX',
        bodyTextY: 'bodyTextY',
        bodyIsNeedForamt: true, // 主体内容是否需要格式化
        suffixFont: 'bodySuffixFont',
        prefixFont: 'bodyPrefixFont',
        bodyColDefaultIndex: 0, // 没有指定列名，默认第一列
        suffixIsBit: true, //后缀文字使用单位
        prefixPositionX: 'bodyPrefixPositionX', //前缀文字水平偏移位置
        prefixPositionY: 'bodyPrefixPositionY', //前缀文字垂直偏移位置
        suffixPositionX: 'bodySuffixPositionX', //后缀文字水平偏移位置
        suffixPositionY: 'bodySuffixPositionY', //后缀文字垂直偏移位置
      };
      let body = {
        show: ChartConfigHelper.getConfigValue('bodyIsShow', bodyConfig),
        prefixText: { show: false },
        bodyText: { show: false },
        suffixText: { show: false },
      };
      // 如果不显示则返回
      if (!body.show) {
        return body;
      }

      let bodyConfigStyle = this.doGetTextContentConfig(
        bodyConfig,
        datasets,
        configKeyObj,
        config,
      );
      bodyConfigStyle.show = true;
      return bodyConfigStyle;
    },
    /**
     * 获取底部描述文字组件内容
     * @param {*} bottomConfig 底部组件配置
     * @param {*} datasets 数据集
     * @returns 底部组件显示内容
     */
    getBottomConfig(bottomConfig, datasets, config) {
      let configKeyObj = {
        bodyColName: 'bottomBodyColName',
        bodyTextFont: 'bootomBodyTextFont',
        bodyTextX: 'bottomTextX',
        bodyTextY: 'bottomTextY',
        bodyIsNeedForamt: false, // 主体内容不需要格式化
        suffixFont: 'bootomBodyTextFont',
        prefixFont: 'bottomPrefixFont',
        bodyColDefaultIndex: 1, // 没有指定列名，默认第而二列
        prefixText: {
          isFixValue: false,
          buttomUpText: 'buttomUpText',
          decreaseText: 'decreaseText',
        },
        suffixUpImage: 'bottomSuffixUpImage',
        suffixDecreaseImage: 'bottomSuffixDecreaseImage',
        suffixImagePosition: 'bottomSuffixImagePosition',
      };
      let buttom = {
        show: ChartConfigHelper.getConfigValue('buttomIsShow', bottomConfig),
        prefixText: { show: false },
        bodyText: { show: false },
        suffixText: { show: false },
      };
      // 如果不显示则返回
      if (!buttom.show) {
        return buttom;
      }
      let bottomContentConfig = this.doGetTextContentConfig(
        bottomConfig,
        datasets,
        configKeyObj,
        config,
      );
      bottomContentConfig.show = true;
      return bottomContentConfig;
    },
    /**
     * 获取文本组件显示内容公共处理方法
     * @param {*} configTmp 配置信息
     * @param {*} datasets 数据集
     * @param {*} dataKeyParams 配置key参数
     * @param {*} dataFieldConfig 数据聚合字段配置
     * @returns 文本组件显示内容
     */
    doGetTextContentConfig(
      configTmp,
      datasets,
      dataKeyParams,
      dataFieldConfig,
    ) {
      let contentConfig = {
        prefixText: { show: false },
        bodyText: { show: false },
        suffixText: { show: false },
      };
      // 位置
      let configX = ChartConfigHelper.getConfigValue(
        dataKeyParams.bodyTextX,
        configTmp,
      );
      let configY = ChartConfigHelper.getConfigValue(
        dataKeyParams.bodyTextY,
        configTmp,
      );

      // 主体内容处理
      let bodyColName = ChartConfigHelper.getConfigValue(
        dataKeyParams.bodyColName,
        configTmp,
      );
      // 获取主体字段配置
      let fieldInfo = ChartConfigHelper.getFieldInfo(
        bodyColName,
        dataFieldConfig,
        dataKeyParams.bodyColDefaultIndex,
      );
      let bodyColVal = ChartConfigHelper.getColValue(fieldInfo.index, datasets);

      let bodyColFormatResult = ChartConfigHelper.formatVal(
        bodyColVal,
        fieldInfo,
      );
      contentConfig.bodyText.text = bodyColFormatResult.value;
      contentConfig.bodyText.show = bodyColVal;
      // 主体文字字体设置
      let bodyTextFont = ChartConfigHelper.getConfigValue(
        dataKeyParams.bodyTextFont,
        configTmp,
      );
      contentConfig.bodyText.font = ChartConfigHelper.formatFont(bodyTextFont);
      // 主体文字颜色设置
      contentConfig.bodyText.fill = bodyTextFont.color;
      contentConfig.bodyText.x = configX;
      contentConfig.bodyText.y = configY;

      // 后缀内容处理
      let suffixTextVal = '';
      if (dataKeyParams.suffixIsBit) {
        suffixTextVal = bodyColFormatResult.bitText;
      } else if (dataKeyParams.suffixText) {
        suffixTextVal = ChartConfigHelper.getConfigValue(
          dataKeyParams.suffixText,
          configTmp,
        );
      }
      contentConfig.suffixText.text = suffixTextVal;
      contentConfig.suffixText.show =
        contentConfig.suffixText.text &&
        contentConfig.suffixText.text.length > 0;
      // 后缀文字水平偏移位置
      let suffixPositionX = dataKeyParams.suffixPositionX
        ? ChartConfigHelper.getConfigValue(
            dataKeyParams.suffixPositionX,
            configTmp,
          )
        : 0;
      // 后缀文字垂直偏移位置
      let suffixPositionY = dataKeyParams.suffixPositionY
        ? ChartConfigHelper.getConfigValue(
            dataKeyParams.suffixPositionY,
            configTmp,
          )
        : 0;
      if (!suffixPositionX) {
        suffixPositionX = 0;
      }
      if (!suffixPositionY) {
        suffixPositionY = 0;
      }
      if (contentConfig.bodyText.show) {
        contentConfig.suffixText.x =
          contentConfig.bodyText.x +
          bodyTextFont.fontSize * (contentConfig.bodyText.text.length / 2) +
          5 +
          suffixPositionX;
      } else {
        contentConfig.suffixText.x = configX + suffixPositionX;
      }
      contentConfig.suffixText.y = contentConfig.bodyText.y + suffixPositionY;
      if (contentConfig.suffixText.show) {
        let suffixFont = ChartConfigHelper.getConfigValue(
          dataKeyParams.suffixFont,
          configTmp,
        );
        contentConfig.suffixText.font =
          ChartConfigHelper.formatFont(suffixFont);
        contentConfig.suffixText.fontSize = suffixFont.fontSize;
        contentConfig.suffixText.fill = suffixFont.color;
      }

      // 前缀内容处理
      if (dataKeyParams.prefixText) {
        let prefixTextVal = '';
        if (!dataKeyParams.prefixText.isFixValue) {
          if (bodyColVal > 0) {
            prefixTextVal = ChartConfigHelper.getConfigValue(
              dataKeyParams.prefixText.buttomUpText,
              configTmp,
            );
          } else {
            prefixTextVal = ChartConfigHelper.getConfigValue(
              dataKeyParams.prefixText.decreaseText,
              configTmp,
            );
          }
        } else if (dataKeyParams.prefixText.key) {
          prefixTextVal = ChartConfigHelper.getConfigValue(
            dataKeyParams.prefixText.key,
            configTmp,
          );
        }
        prefixTextVal =
          !prefixTextVal && prefixTextVal != 0 ? '' : `${prefixTextVal}`;
        let prefixFont = ChartConfigHelper.getConfigValue(
          dataKeyParams.prefixFont,
          configTmp,
        );
        contentConfig.prefixText.text = prefixTextVal;
        contentConfig.prefixText.font =
          ChartConfigHelper.formatFont(prefixFont);
        contentConfig.prefixText.fill = prefixFont.color;
        // 前缀文字水平偏移位置
        let prefixPositionX = dataKeyParams.prefixPositionX
          ? ChartConfigHelper.getConfigValue(
              dataKeyParams.prefixPositionX,
              configTmp,
            )
          : 0;
        prefixPositionX = prefixPositionX ? prefixPositionX : 0;
        // 后缀文字垂直偏移位置
        let prefixPositionY = dataKeyParams.prefixPositionY
          ? ChartConfigHelper.getConfigValue(
              dataKeyParams.prefixPositionY,
              configTmp,
            )
          : 0;
        prefixPositionY = prefixPositionY ? prefixPositionY : 0;

        // 前缀位置
        contentConfig.prefixText.x = configX + prefixPositionX;
        contentConfig.prefixText.y =
          configY + bodyTextFont.fontSize / 5 + prefixPositionY;
        // 主体水平位置需要在前缀位置后
        contentConfig.bodyText.x =
          configX +
          prefixFont.fontSize * contentConfig.prefixText.text.length +
          5;
        contentConfig.prefixText.show =
          contentConfig.prefixText.text.length > 0;
      }

      // 后缀图标
      if (dataKeyParams.suffixUpImage) {
        let suffixImgConfig = { show: true };
        contentConfig.suffixImage = suffixImgConfig;
        let suffixImgPosition = ChartConfigHelper.getConfigValue(
          dataKeyParams.suffixImagePosition,
          configTmp,
        );
        if (!suffixImgPosition) {
          suffixImgPosition = 'after';
        }
        // 图片地址
        if (bodyColVal > 0) {
          suffixImgConfig.image = ChartConfigHelper.getConfigValue(
            dataKeyParams.suffixUpImage,
            configTmp,
          );
        } else {
          suffixImgConfig.image = ChartConfigHelper.getConfigValue(
            dataKeyParams.suffixDecreaseImage,
            configTmp,
          );
        }
        // 图片位置
        suffixImgConfig.y = configY + bodyTextFont.fontSize / 8;
        if (suffixImgPosition === 'after') {
          if (contentConfig.bodyText.text) {
            suffixImgConfig.x =
              contentConfig.bodyText.x +
              bodyTextFont.fontSize *
                ((contentConfig.bodyText.text + '').length / 2) +
              10;
          } else if (contentConfig.suffixText.show) {
            suffixImgConfig.x =
              contentConfig.suffixText.x +
              contentConfig.suffixText.fontSize *
                ((contentConfig.suffixText.text + '').length / 2) +
              10;
          }
        }
      }
      return contentConfig;
    },
  };
}

export default CustomScoreChart;
