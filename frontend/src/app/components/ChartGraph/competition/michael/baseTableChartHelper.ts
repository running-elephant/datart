import { ColCell, DataCell } from '@antv/s2';
import ChartConfigHelper from './chartConfigHelper';

/**
 * 自定义数据单元格对象
 */
class CustomDataColCell extends DataCell {
  initCell() {
    super.initCell();
    this.renderBackground();
  }

  renderBackground() {
    let theme: any = this.theme;
    theme.background.fill = 'red';
    // theme.dataCell.cell.backgroundColor = 'red';
    this.attrs.fill = 'red';
    /* theme.dataCell.cell.backgroundColorOpacity = 0;
        this.attrs.opacity = 0;
        let backgroundShape: any = this.backgroundShape;
        backgroundShape.attrs.opacity = 0 */
  }
}

class CustomColCell extends ColCell {
  initCell() {
    super.initCell();
    this.renderBackground();
  }

  renderBackground() {
    let theme: any = this.theme;
    theme.background.opacity = 0;
    this.attrs.opacity = 0;
    let backgroundShape: any = this.backgroundShape;
    backgroundShape.attrs.opacity = 0;
  }
}

let baseTableChartHelper = () => {
  return {
    getTableCfg(dataset, config) {
      let dataConfigs = config.datas;
      // 获取所有维度字段
      let allGroupFields = ChartConfigHelper.getAllGroupFieldsInfo(
        dataConfigs,
        dataset,
      );
      // 获取所有指标字段
      let allAggFields = ChartConfigHelper.getAllAggregateFieldsInfo(
        dataConfigs,
        dataset,
      );

      // 获取字段定义信息
      let dataCfg = this.getDataCfg(allGroupFields, allAggFields, dataset);

      // 表格宽度
      let tableWidth = ChartConfigHelper.getConfigValue(
        'tableWidth',
        config.styles,
      );
      // 表格高度
      let tableHeight = ChartConfigHelper.getConfigValue(
        'tableHeight',
        config.styles,
      );

      // 获取各列的数据配置
      let columnStyleConfig = this.getColumnStyleConfig(
        dataConfigs,
        config.styles,
      );

      debugger;

      let options = {
        width: tableWidth,
        height: tableHeight,
        tooltip: {
          operation: {
            trend: true,
          },
        },
        interaction: {
          selectedCellsSpotlight: true,
          hoverHighlight: false,
        },
        style: {
          layoutWidthType: 'colAdaptive',
          cellCfg: {
            width: 100,
          },
        },
        ColCell(viewMeta, spreadsheet, headerConfig) {
          return new CustomColCell(viewMeta, spreadsheet, headerConfig);
        },
        dataCell(viewMeta, spreadsheet) {
          if (!spreadsheet) {
            spreadsheet = viewMeta.spreadsheet;
          }
          return new CustomDataColCell(viewMeta, spreadsheet);
        },
      };
      let chartCfg = { dataCfg, options };
      return chartCfg;
    },
    /**
     * 获取数据定义信息：含维度、指标、表格数据等
     * @param groupFields 维度配置信息
     * @param aggFields
     * @param dataSets
     */
    getDataCfg(groupFields, aggFields, dataSets) {
      let fieldMetaData = this.getFieldMetaData(groupFields, aggFields);
      let dataCfg = {
        // 表格维度及指标信息
        fields: this.getFieldCfg(groupFields, aggFields, fieldMetaData),
        // 字段元数据用于取表头信息文字显示
        meta: fieldMetaData,
        // 表格数据按照字段定义的json
        data: this.getJsonData(fieldMetaData, dataSets),
      };
      return dataCfg;
    },

    /**
     * 获取字段元数据信息
     * @param groupFields 维度字段
     * @param aggFields 指标字段
     * @returns 字段元数据信息
     */
    getFieldMetaData(groupFields, aggFields) {
      let fieldMetas: any = [];
      // 维度字段元数据
      let metasTmp = this.doGetFieldMeta(groupFields);
      fieldMetas.push(...metasTmp);

      // 指标字段元数据
      metasTmp = this.doGetFieldMeta(aggFields);
      fieldMetas.push(...metasTmp);
      return fieldMetas;
    },
    /**
     * 组装字段元数据
     * @param {*} fields 字段信息
     * @returns 字段元数据
     */
    doGetFieldMeta(fields, isGroup = false) {
      let fieldMetas: any = [];
      if (!fields || fields.length == 0) {
        return fieldMetas;
      }
      fields.forEach(field => {
        fieldMetas.push({
          field: field.fieldName,
          name: field.fieldName,
          colIndex: field.colIndex,
        });
      });
      return fieldMetas;
    },
    /**
     * 获取表格维度及指标信息
     * @param groupFields 页面配置维度
     * @param aggFields 页面配置指标
     * @param fieldMetaData 字段元数据信息
     * @returns 表格维度及指标信息
     */
    getFieldCfg(groupFields, aggFields, fieldMetaData) {
      // 一级、二级维度
      let rows: any[] = [];
      // 子维度
      let columns: any[] = [];
      // 指标
      let values: any[] = [];
      let fieldCfg = {
        rows: rows,
        columns: columns,
        values: values,
      };
      // 维度处理
      if (groupFields && groupFields.length > 0) {
        groupFields.forEach((groupField, index) => {
          if (index <= 1) {
            // 二个主次维度
            rows.push(groupField.fieldName);
          } else {
            // 计算维度
            columns.push(groupField.fieldName);
          }
        });
      }

      // 指标处理
      if (aggFields && aggFields.length > 0) {
        aggFields.forEach(aggField => {
          values.push(aggField.fieldName);
        });
      }

      return fieldCfg;
    },
    /**
     * 获取表格数据
     * @param fields 字段信息
     * @param datasets 后端返回数据
     * @returns 表格数据
     */
    getJsonData(fields, datasets) {
      let data: any = [];
      if (datasets && datasets.rows && datasets.rows.length > 0) {
        datasets.rows.forEach(row => {
          let rowData = {};
          fields.forEach(field => {
            rowData[field.field] = row[field.colIndex];
          });
          data.push(rowData);
        });
      }
      return data;
    },
    getColumnStyleConfig(dataConfigs, styleConfigs) {
      let styleConfig: any = {};
      if (dataConfigs && dataConfigs.length > 0) {
        dataConfigs.forEach(dataConfig => {
          if (dataConfig.rows && dataConfig.rows.length > 0) {
            dataConfig.rows.forEach(columnConfig => {
              let columnStyleConfigList: any = ChartConfigHelper.getConfigValue(
                columnConfig.uid,
                styleConfigs,
                'rows',
              );
              if (columnStyleConfigList && columnStyleConfigList.length > 0) {
                // 获取列字段配置
                let columnStyleCnfig: any = {};
                styleConfig[columnConfig.colName] = columnStyleCnfig;
                // 获取基本样式配置
                let basicStyleConfigs: any = ChartConfigHelper.getConfigValue(
                  'basicStyle',
                  columnStyleConfigList,
                  'rows',
                );
                if (basicStyleConfigs && basicStyleConfigs.length > 0) {
                  // 背景样色
                  let backgroundColor = ChartConfigHelper.getConfigValue(
                    'backgroundColor',
                    basicStyleConfigs,
                  );
                  // 背景是否透明
                  let backgroundColorOpacity = ChartConfigHelper.getConfigValue(
                    'backgroundColorOpacity',
                    basicStyleConfigs,
                  );
                  // 字体
                  let font = ChartConfigHelper.getConfigValue(
                    'font',
                    basicStyleConfigs,
                  );
                  // 对齐方式
                  let align = ChartConfigHelper.getConfigValue(
                    'align',
                    basicStyleConfigs,
                  );
                  columnStyleCnfig.basicStyle = {
                    backgroundColor,
                    backgroundColorOpacity,
                    font,
                    align,
                  };
                }
                // 获取条件样式配置
                let conditionStyleConfig: any =
                  ChartConfigHelper.getConfigValue(
                    'conditionStyle',
                    columnStyleConfigList,
                    'rows',
                  );
                if (conditionStyleConfig && conditionStyleConfig.length > 0) {
                }
              }
            });
          }
        });
      }
      return styleConfig;
    },
  };
};

let baseTableChartHelperInstance = baseTableChartHelper();
export default baseTableChartHelperInstance;
