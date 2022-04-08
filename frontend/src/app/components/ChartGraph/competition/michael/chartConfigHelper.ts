import useFetchFilterDataByCondtion from 'app/hooks/useFetchFilterDataByCondtion';

/**
 * 图标组件配置工具类
 */
const ChartConfigHelper = () => {
  return {
    // 数据字段配置类型
    dataConfigTypes: {
      // 指标
      aggregate: 'aggregate',
      // 维度
      group: 'group',
      // 混合
      mixed: 'mixed',
      // 过滤
      filter: 'filter',
    },
    // 数据类型 普通 数组 set map
    dataType: {
      normal: 0,
      array: 1,
      set: 2,
      map: 3,
    },
    /**
     * 获取字体样式
     * @param {*} fontConfig
     * @returns 字体样式
     */
    formatFont(fontConfig) {
      let fontStyle = `${fontConfig.fontStyle} ${fontConfig.fontWeight} ${fontConfig.fontSize}px "${fontConfig.fontFamily}"`;
      return fontStyle;
    },
    /**
     * 公共方法： 获取配置值
     * @param {*} confKey 配置key
     * @param {*} configInfo 配置信息对象
     */
    getConfigValue(confKey, configInfo, valueKey = 'value', forKey = 'rows') {
      let confValue = null;
      if (!configInfo || configInfo.length === 0) {
        return confValue;
      }
      if (Array.isArray(configInfo)) {
        for (let i = 0; i < configInfo.length; i++) {
          let configItem = configInfo[i];
          if (configItem.key === confKey) {
            confValue = configItem[valueKey];
            break;
          }
          // 递归处理
          if (configItem[forKey] && configItem[forKey].length > 0) {
            confValue = this.getConfigValue(
              confKey,
              configItem[forKey],
              valueKey,
              forKey,
            );
          }
          // 获取到值退出循环
          if (confValue || confValue === '0' || confValue === 0) {
            break;
          }
        }
      } else {
        if (configInfo.key === confKey) {
          confValue = configInfo.value;
        }
        // 递归处理
        if (configInfo.rows && configInfo.rows.length > 0) {
          confValue = this.getConfigValue(
            confKey,
            configInfo.rows,
            valueKey,
            forKey,
          );
        }
      }

      return confValue;
    },
    /**
     * 获取列值
     * @param {*} dataIndex 列索引
     * @param {*} datasets 数据集
     * @param {*} resultType 结果数据类型：0、单个数据 1、数组 2、不可重复
     * @returns
     */
    getColValue(dataIndex, datasets, resultType = 0) {
      let dataResult: any = null;
      if (
        !datasets ||
        !datasets.columns ||
        datasets.columns.length === 0 ||
        !datasets.rows ||
        datasets.rows.length === 0
      ) {
        return dataResult;
      }
      // 字段定义的索引位置, 如果没有配置则取字段默认顺序对应的值
      let colIndex = dataIndex;
      if (!colIndex && colIndex !== 0) {
        return dataResult;
      }
      // 获取字段值
      if (resultType == this.dataType.normal) {
        dataResult = datasets.rows[0][colIndex];
      } else if (resultType == this.dataType.array) {
        dataResult = [];
        datasets.rows.forEach(row => {
          dataResult.push(row[colIndex]);
        });
      } else if (resultType == this.dataType.set) {
        let dataResultSet = new Set();
        datasets.rows.forEach(row => {
          dataResultSet.add(row[colIndex]);
        });
        dataResult = Array.from(dataResultSet);
      }
      return dataResult;
    },
    /**
     * 按照指定索引列作为key，获取对应数据，组装成结果对象返回: {索引列值: [指定列值]}
     * @param {*} dataIndex 列索引
     * @param {*} datasets 数据集
     * @param {*} keyIndex 分组字段索引位置
     * @returns
     */
    getColValueGroupBy(dataIndex, datasets, keyIndex) {
      let dataResult: any = {};
      if (!keyIndex) {
        return dataResult;
      }

      if (
        !datasets ||
        !datasets.columns ||
        datasets.columns.length === 0 ||
        !datasets.rows ||
        datasets.rows.length === 0
      ) {
        return dataResult;
      }

      // 字段定义的索引位置, 如果没有配置则取字段默认顺序对应的值
      let colIndex = dataIndex;
      if (!colIndex && colIndex !== 0) {
        return dataResult;
      }

      datasets.rows.forEach(row => {
        // 指定分组对应数组
        let dataArr = dataResult[row[keyIndex]];
        if (!dataArr) {
          dataArr = [];
          dataResult[row[keyIndex]] = dataArr;
        }
        dataArr.push(row[colIndex]);
      });

      return dataResult;
    },
    /**
     * 格式化显示数字
     * @param {*} numVal 值
     * @param {*} unitKey 单位
     * @param {*} decimalPlaces 小数位
     * @returns
     */
    formatNumberVal(numVal, unitKey, decimalPlaces) {
      let convertVal = numVal;
      // 单位
      let bitText = '';
      let result = {
        value: numVal,
        bitText: '',
      };
      decimalPlaces = !decimalPlaces ? 0 : decimalPlaces;

      // 暂时以万为单位进行显示
      if (unitKey === 'wan') {
        if (numVal > 10000) {
          convertVal = numVal / 10000;
          bitText = '万';
        } else {
          convertVal = numVal / 10000;
          bitText = '万';
        }
        // 四舍五入
        convertVal = Math.round(convertVal);
      } else {
        if (decimalPlaces === 0) {
          convertVal = Math.round(convertVal);
        }
      }

      let valTmp: string = `${convertVal}`;

      if (parseInt(numVal) >= 1) {
        // 没有小数点时进行分割
        // 按3位分割显示
        if (valTmp.length > 3) {
          let loopTimes = parseInt(valTmp.length / 3 + '');
          if (valTmp.length % 3 > 0) {
            loopTimes = loopTimes + 1;
          }
          let lastSubIndex = valTmp.length;
          let valGroups: string[] = [];
          let loopTimesTmp = 0;
          for (let i = loopTimes; i > 0; i--) {
            if (lastSubIndex - 3 >= 0) {
              valGroups[i] = valTmp.substring(lastSubIndex - 3, lastSubIndex);
            } else {
              valGroups[i] = valTmp.substring(
                0,
                valTmp.length - loopTimesTmp * 3,
              );
            }

            lastSubIndex = lastSubIndex - 3;
            loopTimesTmp++;
          }
          // 将分组按指定符号拼接
          valTmp = valGroups.join(',');
        }
      }
      // 截取第一个逗号
      result.value =
        valTmp.substring(0, 1) === ',' ? valTmp.substring(1) : valTmp;
      result.bitText = bitText;
      return result;
    },
    /**
     * 格式化百分数
     */
    formatPercentVal(calValue, decimalPlaces) {
      let result = {
        value: calValue,
        bitText: '',
      };

      decimalPlaces = decimalPlaces ? decimalPlaces : 0;

      if (!calValue && calValue !== 0) {
        return result;
      }
      result.value = `${(calValue * 100).toFixed(decimalPlaces)}%`;
      return result;
    },
    /**
     * 获取字段信息
     * @param {*} colName 字段名
     * @param {*} configDatas 配置信息对象
     * @param {*} defaultIndex 字段名没有设置默位置的索引
     * @param {*} configIndex 配置在configDatas中的索引
     * @returns 获取字段信息
     */
    getFieldInfo(colName, configDatas, defaultIndex, configIndex = 1) {
      let fieldInfo = {
        index: defaultIndex,
        format: 'text',
        unitKey: '',
        decimalPlaces: 0,
        fieldName: '',
      };
      if (configDatas.datas && configDatas.datas.length > 0) {
        let aggConfigs = configDatas.datas[configIndex];
        let isMatch = false;
        for (let i = 0; i < aggConfigs.rows.length; i++) {
          let aggConfig = aggConfigs.rows[i];

          if (!colName && i === defaultIndex) {
            isMatch = true;
            fieldInfo.format =
              aggConfig.format && aggConfig.format.type
                ? aggConfig.format.type
                : 'text';
          } else if (colName === aggConfig.colName) {
            isMatch = true;
            fieldInfo.format =
              aggConfig.format && aggConfig.format.type
                ? aggConfig.format.type
                : 'text';
          }
          // 字段单位
          if (isMatch) {
            fieldInfo.unitKey = '';
            fieldInfo.decimalPlaces = 0;
            fieldInfo.fieldName = colName ? colName : aggConfig.colName;
            if (
              fieldInfo.format === 'numeric' &&
              aggConfig.format.numeric &&
              aggConfig.format.numeric.unitKey
            ) {
              fieldInfo.unitKey = aggConfig.format.numeric.unitKey;
              // 小数位
              fieldInfo.decimalPlaces = aggConfig.format.numeric.decimalPlaces;
            } else if (
              fieldInfo.format === 'percentage' &&
              aggConfig.format.percentage &&
              aggConfig.format.percentage.decimalPlaces
            ) {
              // 小数位
              fieldInfo.decimalPlaces =
                aggConfig.format.percentage.decimalPlaces;
            }
            break;
          }
        }
      }
      return fieldInfo;
    },
    /**
     * 获取字段配置信息
     * @param configDatas 字段配置数据
     * @param datasets 实际数据信息
     * @param includeKeys  需要获取配置的key
     */
    getAllFieldInfo(
      configDatas,
      datasets,
      includeKeys = ['group', 'aggregate'],
    ) {
      let result: any = [];
      if (!configDatas) {
        return result;
      }

      configDatas.forEach((dataConfig, index) => {
        if (!includeKeys.includes(dataConfig.type)) {
          return;
        }
        let aggConfigs = configDatas[index];
        if (!aggConfigs.rows || aggConfigs.rows.length == 0) {
          return;
        }
        for (let i = 0; i < aggConfigs.rows.length; i++) {
          let fieldInfo: any = {
            aggregate: null,
            colIndex: null, // 字段在整行的第几列
            indexInConfig: i, //字段在当前配置分组的位置
            format: 'text',
            unitKey: '',
            decimalPlaces: 0,
            fieldName: '',
            aliasName: '',
            type: dataConfig.type,
            colors: [],
          };
          result.push(fieldInfo);
          let aggConfig = aggConfigs.rows[i];
          fieldInfo.aggregate = aggConfig.aggregate;
          // todo 需要增加别名获取逻辑
          fieldInfo.fieldName = aggConfig.colName;
          fieldInfo.colIndex = this.getColDataIndex(fieldInfo, datasets);
          fieldInfo.format =
            aggConfig.format && aggConfig.format.type
              ? aggConfig.format.type
              : 'text';
          fieldInfo.decimalPlaces = 0;
          if (
            fieldInfo.format === 'numeric' &&
            aggConfig.format.numeric &&
            aggConfig.format.numeric.unitKey
          ) {
            fieldInfo.unitKey = aggConfig.format.numeric.unitKey;
            // 小数位
            fieldInfo.decimalPlaces = aggConfig.format.numeric.decimalPlaces;
          } else if (
            fieldInfo.format === 'percentage' &&
            aggConfig.format.percentage &&
            aggConfig.format.percentage.decimalPlaces
          ) {
            // 小数位
            fieldInfo.decimalPlaces = aggConfig.format.numeric.decimalPlaces;
          }

          // 颜色设置
          if (aggConfig.color && aggConfig.color.colors) {
            aggConfig.color.colors.forEach(colorTmp => {
              fieldInfo.colors[colorTmp.key] = colorTmp.value;
            });
          }
        }
      });
      return result;
    },
    /**
     * 获取维度字段信息
     * @param dataConfigs 配置数据
     * @param dataset 具体业务数据
     * @returns 维度字段信息
     */
    getAllGroupFieldsInfo(dataConfigs, dataset) {
      return this.getAllFieldInfo(dataConfigs, dataset, [
        this.dataConfigTypes.group,
      ]);
    },
    /**
     * 获取指标字段信息
     * @param dataConfigs 配置数据
     * @param dataset 具体业务数据
     * @returns 指标字段信息
     */
    getAllAggregateFieldsInfo(dataConfigs, dataset) {
      return this.getAllFieldInfo(dataConfigs, dataset, [
        this.dataConfigTypes.aggregate,
      ]);
    },
    /**
     * 获取所有字段过滤条件配置信息
     * @param dataConfigs
     * @param dataset
     */
    getAllFieldFilterConfigs(
      dataConfigs,
      dataset,
      viewConfig,
      configKey = 'filter',
    ) {
      if (!dataConfigs || dataConfigs.length === 0) {
        return null;
      }

      let fiterConfigs: any = this.getConfigValue(
        configKey,
        dataConfigs,
        'rows',
      );
      if (!fiterConfigs || fiterConfigs.length === 0) {
        return null;
      }
      // 搜搜结果
      let result: any = [];
      fiterConfigs.forEach(filterConfig => {
        result.push({
          name: filterConfig.colName,
          label: filterConfig.colName,
          comp: 'select',
          fiter: filterConfig.filter,
          initParams: [
            viewConfig.view.id,
            filterConfig?.filter?.condition,
            'callback',
            viewConfig.view,
          ],
          config: filterConfig,
          initHook: useFetchFilterDataByCondtion,
        });
      });
      return result;
    },
    /**
     * 获取字段是第几列
     * @param fieldConfig 字段配置信息
     * @param datasets 数据信息
     * @returns 返回字段在第几列
     */
    getColDataIndex(fieldConfig, datasets) {
      let colDataIndex = null;
      if (!datasets || !datasets.columns || datasets.columns.length === 0) {
        return colDataIndex;
      }

      // 如果是指标需要加上聚合函数拼装字段名
      let fieldConfigName = fieldConfig.aggregate
        ? `${fieldConfig.aggregate}(${fieldConfig.fieldName})`
        : fieldConfig.fieldName;
      // 遍历所有列获取当前列对应的位置
      datasets.columns.forEach((column, index) => {
        if (fieldConfigName == column.name) {
          colDataIndex = index;
        }
      });
      return colDataIndex;
    },
    /**
     * 格式化信息
     *
     * @param {*} calVal 需要格式化的值
     * @param {*} formatInfo 格式化信息
     * @returns 格式化后内容
     */
    formatVal(calVal, formatInfo) {
      let bodyColFormatResult = {};
      let formatType = formatInfo.format;
      if (formatType === 'numeric') {
        bodyColFormatResult = this.formatNumberVal(
          calVal,
          formatInfo.unitKey,
          formatInfo.decimalPlaces,
        );
      } else if (formatType === 'percentage') {
        bodyColFormatResult = this.formatPercentVal(
          calVal,
          formatInfo.decimalPlaces,
        );
      } else {
        bodyColFormatResult = { value: calVal };
      }
      return bodyColFormatResult;
    },
    /**
     * 获取配置对象： 将图表组件定义的结构层级转换为对应的对象，方便取值
     *
     * @param columnSylteConfigs 图标组件原始配置信息
     * @returns 表格列样式配置
     */
    getConfigObj(columnSylteConfigs, columnStyleConfig: any) {
      if (!columnStyleConfig) {
        columnStyleConfig = {};
      }
      if (!columnSylteConfigs || columnSylteConfigs.length === 0) {
        return columnStyleConfig;
      }

      columnSylteConfigs.forEach(styleConfig => {
        // 未启用配置
        if (!styleConfig) {
          return;
        }

        let paramName = styleConfig['paramName'];
        let dataType = styleConfig['dataType'];
        let isParentProps = styleConfig['isParentProps'];
        paramName = paramName ? paramName : styleConfig['key'];
        // 递归调用
        if (styleConfig.rows && styleConfig.rows.length > 0) {
          if (dataType && dataType === 'array') {
            // 数组处理
            let paramObjs = [];
            columnStyleConfig[paramName] = paramObjs;
            this.getConfigObj(styleConfig.rows, paramObjs);
            return;
          } else {
            // 当前节点配置是否启用，没有启动则不需要获取配置信息，避免传递大量多余无用数据
            let configIsEnable =
              styleConfig.rows[0]?.paramName === 'isEnable'
                ? styleConfig.rows[0].value
                : true;
            if (!configIsEnable) {
              return;
            }

            // 略过该层级，不构造对象，设置数据到父级对象中
            if (isParentProps) {
              this.getConfigObj(styleConfig.rows, columnStyleConfig);
            } else {
              let paramObj: any = {};
              // datart字段特殊配置是以动态生成的key作为标识，方便外部组装数据，需要设置key字段，以便外部通过字段名获取字段id在此处匹配的字段配置
              if (!paramName) {
                paramObj['key'] = styleConfig.key;
              }

              this.getConfigObj(styleConfig.rows, paramObj);
              if (Array.isArray(columnStyleConfig) && paramObj) {
                // 父对象是数组时，将当前对象放入数组中
                columnStyleConfig.push(paramObj);
              } else if (paramName) {
                // 普通对象设置
                columnStyleConfig[paramName] = paramObj;
              }
            }
          }
        } else {
          let val = styleConfig.value;
          if (val === '' || val == null || typeof val === 'undefined') {
            columnStyleConfig[paramName] = null;
          } else if (typeof val !== 'boolean' && !isNaN(val)) {
            columnStyleConfig[paramName] = parseFloat(styleConfig.value);
          } else {
            columnStyleConfig[paramName] = val;
          }
        }
      });
      return columnStyleConfig;
    },
    /**
     * 获取列字段配置
     * @param basicStyles  基本样式配置
     * @param conditionStyles 条件样式配置
     * @returns 字段配置json内容
     */
    getColumnConfigDefine(basicStyles, conditionStyles) {
      return {
        label: 'common.columnConfig',
        key: 'column',
        comType: 'group',
        paramName: 'columnConfig',
        rows: [
          {
            label: 'common.openColumn',
            key: 'modal',
            comType: 'group',
            isParentProps: true,
            options: { type: 'modal', modalSize: 'middle' },
            rows: [
              {
                label: 'column.list',
                key: 'columnStyleConfigList',
                comType: 'listTemplate',
                paramName: 'columnStyleConfigList',
                dataType: 'array',
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
                      paramName: 'basicStyle',
                      options: { expand: true },
                      rows: basicStyles,
                    },
                    {
                      label: 'column.conditionStyle',
                      key: 'conditionStyle',
                      comType: 'group',
                      options: { expand: true },
                      paramName: 'conditionStyle',
                      dataType: 'array',
                      rows: conditionStyles,
                    },
                  ],
                },
              },
            ],
          },
        ],
      };
    },
    /**
     * 获取字段实际样式配置内容
     * @param dataConfigs 数据配置
     * @param styleConfigs 列样式配置
     * @returns 配置对象数据
     */
    getColumnStyleConfig(dataConfigs, styleConfigs) {
      let styleConfig: any = {};
      let styleConfigMap = {};
      if (styleConfigs && styleConfigs.length > 0) {
        styleConfigs.forEach(styleConfig => {
          styleConfigMap[styleConfig.key] = styleConfig;
        });
      }
      if (dataConfigs && dataConfigs.length > 0) {
        dataConfigs.forEach(dataConfig => {
          if (dataConfig.rows && dataConfig.rows.length > 0) {
            dataConfig.rows.forEach(columnConfig => {
              // 获取列字段配置
              let columnStyleConfig = styleConfigMap[columnConfig.uid];
              if (columnStyleConfig) {
                columnStyleConfig.fieldName = columnConfig.colName;
                styleConfig[columnConfig.colName] = columnStyleConfig;
              }
            });
          }
        });
      }
      return styleConfig;
    },
  };
};
const ChartConfigHelperInstance = ChartConfigHelper();
export default ChartConfigHelperInstance;
