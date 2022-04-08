import ChartConfigHelper from './chartConfigHelper';

const baseZhuzhuangCharthelper = () => {
  return {
    /**
     * 初始化组件信息
     * @param chart chart组件对象
     */
    initChart(chart) {
      var app: any = {};
      var myChart = chart;
      const posList = [
        'left',
        'right',
        'top',
        'bottom',
        'inside',
        'insideTop',
        'insideLeft',
        'insideRight',
        'insideBottom',
        'insideTopLeft',
        'insideTopRight',
        'insideBottomLeft',
        'insideBottomRight',
      ];
      app.configParameters = {
        rotate: {
          min: -90,
          max: 90,
        },
        align: {
          options: {
            left: 'left',
            center: 'center',
            right: 'right',
          },
        },
        verticalAlign: {
          options: {
            top: 'top',
            middle: 'middle',
            bottom: 'bottom',
          },
        },
        position: {
          options: posList.reduce(function (map, pos) {
            map[pos] = pos;
            return map;
          }, {}),
        },
        distance: {
          min: 0,
          max: 100,
        },
      };
      app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function () {
          const labelOption = {
            rotate: app.config.rotate,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            position: app.config.position,
            distance: app.config.distance,
          };
          myChart.setOption({
            series: [
              {
                label: labelOption,
              },
              {
                label: labelOption,
              },
              {
                label: labelOption,
              },
              {
                label: labelOption,
              },
            ],
          });
        },
      };
      const labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        fontSize: 16,
        rich: {
          name: {},
        },
      };
      return { labelOption };
    },
    /**
     * 获取多维柱状配置选型信息
     * @param dataset 数据集对象
     * @param config  配置信息对象
     * @param reverseXY 是否置换xy轴位置
     * @param labelOption 标签信息
     * @returns 多维柱状配置选型信息
     */
    getOptions(dataset, config, reverseXY, labelOption) {
      let dataConfigs = config.datas;
      // 获取指标配置字段
      let groupFields = ChartConfigHelper.getAllGroupFieldsInfo(
        dataConfigs,
        dataset,
      );
      // 获取主维度数据，默认第一个配置温度为主维度
      let mainGroupValues = ChartConfigHelper.getColValue(
        groupFields[0].colIndex,
        dataset,
        ChartConfigHelper.dataType.set,
      );
      // 获取次维度数据
      let secondGroupValues = ChartConfigHelper.getColValue(
        groupFields[1].colIndex,
        dataset,
        ChartConfigHelper.dataType.set,
      );

      // 获取指标配置字段
      let aggregateFieldConfigs = ChartConfigHelper.getAllAggregateFieldsInfo(
        dataConfigs,
        dataset,
      );
      let aggregateFields = ChartConfigHelper.getColValueGroupBy(
        aggregateFieldConfigs[0].colIndex,
        dataset,
        groupFields[1].colIndex,
      );

      // 工具条是否显示
      let toolbarIsShow: any = ChartConfigHelper.getConfigValue(
        'toolbarIsShow',
        config.styles,
      );
      if (!toolbarIsShow) {
        toolbarIsShow = false;
      }

      // 指标单位格式显示配置
      labelOption.formatter = function (colValueInfo) {
        let fieldFormatTmp = aggregateFieldConfigs;
        let valueTmp = colValueInfo.value;
        if (fieldFormatTmp && fieldFormatTmp.length > 0) {
          let valueAfterFormart: any = ChartConfigHelper.formatVal(
            valueTmp,
            fieldFormatTmp[0],
          );
          valueTmp = valueAfterFormart.bitText
            ? `${valueAfterFormart.value}${valueAfterFormart.bitText}`
            : valueAfterFormart.value;
        }
        return `${valueTmp} ${colValueInfo.seriesName}`;
      };

      // 刻度单位
      let aggAxisLabel = (value, index) => {
        let fieldFormatTmp = aggregateFieldConfigs;
        let valueTmp = value;
        if (fieldFormatTmp && fieldFormatTmp.length > 0) {
          let valueAfterFormart: any = ChartConfigHelper.formatVal(
            valueTmp,
            fieldFormatTmp[0],
          );
          valueTmp = valueAfterFormart.bitText
            ? `${valueAfterFormart.value}${valueAfterFormart.bitText}`
            : valueAfterFormart.value;
        }
        return valueTmp;
      };

      // 获取指标对应serials配置
      let seriesTmp: any[] = [];
      if (aggregateFields) {
        for (let secondGroupKey in aggregateFields) {
          let groupValues = aggregateFields[secondGroupKey];
          let color = groupFields[1].colors[secondGroupKey];
          let valueDatas = groupValues;
          if (color && groupValues && groupValues.length > 0) {
            valueDatas = [];
            groupValues.forEach(valueTmp => {
              valueDatas.push({
                value: valueTmp,
                itemStyle: {
                  color: color,
                },
              });
            });
          }
          seriesTmp.push({
            name: secondGroupKey,
            type: 'bar',
            barGap: 0,
            label: labelOption,
            emphasis: {
              focus: 'series',
            },
            data: valueDatas,
          });
        }
      }

      // 坐标轴位置设置
      let xyOptions = {};
      if (reverseXY) {
        xyOptions = {
          xAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: aggAxisLabel,
              },
            },
          ],
          yAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: mainGroupValues,
            },
          ],
        };
      } else {
        xyOptions = {
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: mainGroupValues,
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: aggAxisLabel,
              },
            },
          ],
        };
      }

      let options = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: secondGroupValues,
        },
        toolbox: {
          show: toolbarIsShow,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        ...xyOptions,
        series: seriesTmp,
      };
      return options;
    },
  };
};

let BaseZhuzhuangCharthelper = baseZhuzhuangCharthelper();
export default BaseZhuzhuangCharthelper;
