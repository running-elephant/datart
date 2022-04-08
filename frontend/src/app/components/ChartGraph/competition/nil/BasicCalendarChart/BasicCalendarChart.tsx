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

import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import ChartDataSetDTO from 'app/types/ChartDataSet';
import {
  formatDate,
  getSeriesTooltips4Polar2,
  getStyles,
  maxNumber,
  minNumber,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import Chart from '../../../models/Chart';
import Config from './config';

class BasicCalendarChart extends Chart {
  config = Config;
  chart: any = null;

  constructor(props?) {
    super(
      props?.id || 'basic-calendar-chart',
      props?.name || 'viz.palette.graph.names.calendar',
      props?.icon || 'calendar',
    );
    this.meta.requirements = props?.requirements || [
      {
        date: 1,
        aggregate: [1, 999],
      },
    ];
  }

  onMount(options, context): void {
    if (options.containerId === undefined || !context.document) {
      return;
    }

    this.chart = init(
      context.document.getElementById(options.containerId),
      'default',
      {
        locale: 'ZH',
      },
    );
    this.mouseEvents?.forEach(event => {
      this.chart.on(event.name, event.callback);
    });
  }

  onUpdated(options, context): void {
    if (!options.dataset || !options.dataset.columns || !options.config) {
      return;
    }
    if (!this.isMatchRequirement(options.config)) {
      this.chart?.clear();
      return;
    }
    const newOptions = this.getOptions(options.dataset, options.config);
    this.chart?.setOption(Object.assign({}, newOptions), true);
  }

  onUnMount(): void {
    this.chart?.dispose();
  }

  onResize(opt: any, context): void {
    this.chart?.resize({ width: context?.width, height: context?.height });
  }

  getOptions(dataset: ChartDataSetDTO, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const settingConfigs = config.settings;
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'date')
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);
    const colorConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.COLOR)
      .flatMap(config => config.rows || []);
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.INFO)
      .flatMap(config => config.rows || []);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    return {
      backgroundColor: '',
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
      visualMap: this.getVisualMap(
        styleConfigs,
        chartDataSet,
        groupConfigs,
        aggregateConfigs,
      ),
      calendar: this.getCalendars(styleConfigs, chartDataSet, groupConfigs),
      series: this.getSeries(
        styleConfigs,
        chartDataSet,
        groupConfigs,
        aggregateConfigs,
      ),
    };
  }

  private getVirtulData(year, dataset, dateConfig, aggConfigs) {
    year = year || '2017';
    year = year || '2017';
    const data = dataset
      .filter(row => row.getCell(dateConfig?.[0]).startsWith(year))
      .map(row => ({
        format: undefined,
        name: row.getCell(dateConfig?.[0]),
        rowData: row?.convertToObject(),
        value: [row.getCell(dateConfig?.[0]), row.getCell(aggConfigs?.[0])],
      }));
    return data;
  }

  private getVisualMap(styles, dataset, dateConfig, aggConfigs) {
    const dates = dataset.map(row => row.getCell(dateConfig?.[0]) as string);

    const values = dataset.map(row => row.getCell(aggConfigs?.[0]) as number);

    const colors = dateConfig?.[0]?.color?.colors;

    const displayYears = formatDate(dates, 'YYYY') || [];

    const [
      orient = 'horizontal',
      left = 'center',
      top = 'bottom',
      type = 'piecewise',
    ] = getStyles(styles, ['visualMap'], ['orient', 'left', 'top', 'type']);
    let typeObj = {};
    if (type) {
      typeObj = {
        type,
      };
    }

    return {
      min: minNumber(values) || 0,
      max: maxNumber(values) || 1000,
      calculable: true,
      orient,
      left,
      ...typeObj,
      top,
      inRange: {
        //红色色系
        color: colors
          ? colors.map(c => c.value)
          : [
              '#FFE9BB',
              '#FFD1A7',
              '#FFBB95',
              '#FFA383',
              '#FF8D70',
              '#FF745C',
              '#FF5C4A',
              '#FF4638',
              '#FF2E26',
              '#FF1812',
            ],
      },
    };
  }

  private getCalendars(styles, dataset, dateConfig) {
    const [
      orient = 'horizontal',
      borderWidth,
      yearLabel,
      type = 'year',
      top,
      left,
    ] = getStyles(
      styles,
      ['calendar'],
      ['orient', 'borderWidth', 'yearLabel', 'type', 'top', 'left'],
    );

    const dates = dataset.map(row => row.getCell(dateConfig?.[0]) as string);

    let view = {};
    let format = '';
    let cellSize = 15;

    if (type === 'year') {
      format = 'YYYY';
      view = {
        itemStyle: {
          borderWidth: borderWidth,
        },
        yearLabel: { show: yearLabel },
        dayLabel: {
          firstDay: 1,
          nameMap: 'cn',
        },
      };
    }

    if (type === 'month') {
      format = 'YYYY-MM';
      view = {
        dayLabel: {
          show: true,
          firstDay: 1,
          nameMap: 'cn',
        },
        yearLabel: {
          show: yearLabel,
        },
        monthLabel: {
          show: yearLabel,
        },
        cellSize: [40, 40],
      };
    }

    const displayYears = formatDate(dates, format) || [];
    const total = displayYears.length;

    return displayYears.map((year, index) => {
      let postion = {};
      if (orient === 'horizontal') {
        postion = {
          top: `${(index + 1) * top - 60}`,
          left: left,
          cellSize: ['auto', cellSize],
        };
      }

      if (orient === 'vertical') {
        const count = Math.round((index + 1) / 2);
        postion = {
          left: `${(index % 2) * left + 80}`,
          top: `${count > 1 ? count * top : 80}`,
          cellSize: [cellSize, 'auto'],
        };
      }

      return {
        ...postion,
        ...view,
        range: year,
        orient,
      };
    });
  }
  private getSeries(styles, dataset, dateConfig, aggConfigs) {
    const dates = dataset.map(row => row.getCell(dateConfig?.[0]) as string);

    const displayYears = formatDate(dates, 'YYYY') || [];

    const [type = 'heatmap', symbolSize = 99] = getStyles(
      styles,
      ['series'],
      ['type', 'symbolSize'],
    );

    return displayYears.map((year, index) => ({
      type: type,
      coordinateSystem: 'calendar',
      calendarIndex: index,
      symbolSize: function (val) {
        return symbolSize;
      },
      data: this.getVirtulData(year, dataset, dateConfig, aggConfigs),
    }));
  }

  private getTooltipFormatterFunc(
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
      return getSeriesTooltips4Polar2(
        chartDataSet,
        params[0],
        groupConfigs,
        colorConfigs,
        aggregateConfigs,
        infoConfigs,
      );
    };
  }
}

export default BasicCalendarChart;
