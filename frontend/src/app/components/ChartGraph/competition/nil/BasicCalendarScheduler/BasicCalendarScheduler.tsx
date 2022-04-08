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

import { ChartDataSectionType } from 'app/types/ChartConfig';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataSetDTO from 'app/types/ChartDataSet';
import {
  getColumnRenderName,
  getStyles,
  toFormattedValue,
  transformToDataSet
} from 'app/utils/chartHelper';
import ReactChart from '../../../models/ReactChart';
import BasicCalendarSchedulerWrapper from './BasicCalendarSchedulerWrapper';
import Config from './config';

class BasicCalendarScheduler extends ReactChart {
  useIFrame = false;
  isISOContainer = 'calendar-scheduler';
  config = Config;
  chart: any = null;
  updateOptions: any = {};
  dependency = [
    'https://cdn.jsdelivr.net/npm/@emotion/react@11.8.2/dist/emotion-react.browser.cjs.min.js',
    'https://cdn.jsdelivr.net/npm/@emotion/styled@11.8.1/dist/emotion-styled.browser.cjs.min.js',
    'https://cdn.jsdelivr.net/npm/@mui/lab@5.0.0-alpha.73/node/index.min.js',
    'https://cdn.jsdelivr.net/npm/@mui/material@5.5.1/node/index.min.js',
    'https://cdn.jsdelivr.net/npm/@mui/icons-material@5.5.1/index.min.js',
  ];

  constructor(props?) {
    super(BasicCalendarSchedulerWrapper, {
      id: props?.id || 'calendar-scheduler',
      name: props?.name || 'viz.palette.graph.names.scheduler',
      icon:
        props?.icon ||
        '<svg t="1647598703088" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4596" width="200" height="200"><path d="M356.224 179.328l311.488 0 0 17.344c0 48.704 39.744 88.064 88.704 88.064l18.56 0c49.024 0 88.704-39.36 88.704-88.064L863.68 179.328l91.84 0c37.888 0 68.48 30.656 68.48 68.096l0 676.48c0 37.632-30.656 68.032-68.48 68.032L68.544 991.936C30.656 992 0 961.536 0 923.968L0 247.424C0 209.92 30.656 179.328 68.544 179.328l91.776 0 0 17.344c0 48.704 39.68 88.064 88.704 88.064l18.56 0c48.96 0 88.704-39.36 88.704-88.064L356.288 179.328zM934.784 920.064 934.784 333.76 89.216 333.76l0 586.304L934.784 920.064z" p-id="4597"></path><path d="M765.76 206.016m-12.992 0a0.203 0.203 0 1 0 25.984 0 0.203 0.203 0 1 0-25.984 0Z" p-id="4598"></path><path d="M765.76 179.328c-14.848 0-26.88 12.032-26.88 26.688 0 14.784 12.032 26.688 26.88 26.688 14.784 0 26.88-11.904 26.88-26.688C792.64 191.296 780.544 179.328 765.76 179.328zM710.016 87.232c0-30.464 25.024-55.232 55.744-55.232 15.36 0 29.248 6.144 39.296 16.192 10.176 9.984 16.384 23.872 16.384 39.04l0 111.552c0 30.592-24.96 55.36-55.68 55.36-15.36 0-29.248-6.272-39.36-16.256s-16.384-23.808-16.384-39.104L710.016 87.232z" p-id="4599"></path><path d="M377.6 439.232c-10.944 23.04-91.84 87.168-126.784 98.496l0 83.52c23.744-7.104 43.392-14.72 59.136-22.656 15.68-7.68 31.936-17.984 48.704-30.72l0 244.608 80.704 0L439.36 439.232 377.6 439.232zM655.04 688.064c0 21.312-4.672 37.44-14.016 48.192s-21.12 16.064-35.456 16.064c-9.536 0-18.176-2.368-25.728-7.232l0 68.224c8.384 0.832 17.28 1.216 26.752 1.216 33.92 0 61.824-5.76 83.52-17.344 21.888-11.456 38.656-28.16 50.496-50.048 11.84-21.888 17.728-44.608 17.728-68.288 0-33.664-11.52-61.696-34.496-83.776-23.104-22.4-52.992-33.408-89.984-33.408-10.88 0-22.016 1.472-33.152 4.096C589.568 568.32 575.36 577.792 575.36 577.792l0.32-55.232 165.056 0L740.736 441.28 507.072 441.28l0 203.328 44.928 6.464c8.192-9.216 15.744-15.488 22.656-18.944C583.872 627.2 593.472 624.768 603.392 624.768c15.616 0 28.16 5.12 37.504 15.168C650.304 650.176 655.04 666.176 655.04 688.064zM900.16 366.272l0 521.216L123.84 887.488 123.84 366.272 900.16 366.272z" p-id="4600"></path><path d="M258.24 206.016m-12.928 0a0.202 0.202 0 1 0 25.856 0 0.202 0.202 0 1 0-25.856 0Z" p-id="4601"></path><path d="M313.984 198.784c0 30.592-24.96 55.36-55.744 55.36-15.424 0-29.248-6.272-39.424-16.256C208.768 227.968 202.624 214.144 202.624 198.784L202.624 87.232c0-30.464 24.896-55.232 55.68-55.232 15.424 0 29.312 6.144 39.36 16.192 10.112 9.984 16.32 23.872 16.32 39.04L313.984 198.784zM285.12 206.016c0-14.656-12.032-26.688-26.88-26.688-14.784 0-26.816 12.032-26.816 26.688 0 14.784 12.032 26.688 26.816 26.688C273.088 232.704 285.12 220.8 285.12 206.016z" p-id="4602"></path></svg>',
    });
    this.meta.requirements = props?.requirements || [
      {
        start: 1,
        end: 1,
        group: [1, 999],
        aggregate: [1, 999],
      },
    ];
  }

  onUpdated(options, context): void {
    if (!this.isMatchRequirement(options.config)) {
      this.adapter?.unmount();
      return;
    }
    this.updateOptions = this.getOptions(
      context,
      options.dataset,
      options.config,
    );
    this.adapter?.updated(this.updateOptions);
  }

  onResize(opt: any, context): void {
    if (this.updateOptions?.options) {
      this.updateOptions.options = Object.assign(
        {
          ...this.updateOptions.options,
        },
        { width: context.width, height: context.height },
      );
      this.adapter?.updated(this.updateOptions);
    }
  }

  getOptions(context, dataset: ChartDataSetDTO, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const settingConfigs = config.settings;
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'dimension')
      .flatMap(config => config.rows || []);
    const startConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'start')
      .flatMap(config => config.rows || []);
    const endConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'end')
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

    console.log(chartDataSet, colorConfigs, groupConfigs);
    return {
      options: {
        events: chartDataSet.map((row, index) => {
          const groupMap = {};
          let titles: any[] = [];
          groupConfigs.forEach(group => {
            groupMap[getColumnRenderName(group)] = toFormattedValue(
              row.getCell(group),
              group.format,
            );
            titles.push(toFormattedValue(row.getCell(group), group.format));
          });
          aggregateConfigs.forEach(agg => {
            groupMap[getColumnRenderName(agg)] = toFormattedValue(
              row.getCell(agg),
              agg.format,
            );
          });
          colorConfigs.forEach(color => {
            groupMap[getColumnRenderName(color)] = toFormattedValue(
              row.getCell(color),
              color.format,
            );
          });

          return {
            event_id: index,
            start: new Date(row.getCell(startConfigs[0])),
            end: new Date(row.getCell(endConfigs[0])),
            ...groupMap,
            title: titles.join(' , '),
          };
        }),
        ...this.getView(styleConfigs, chartDataSet, groupConfigs, colorConfigs),
        ...this.getWeek(styleConfigs),
      },
      width: context.width,
      height: context.height,
    };
  }

  private getView(styleCfg, dataset, groupConfigs, colorConfigs) {
    const [mode] = getStyles(styleCfg, ['view'], ['mode']);
    if (!colorConfigs.length) {
      return {
        view: 'month',
      };
    }
    if (colorConfigs.length && colorConfigs?.[0].color) {
      return {
        view: 'month',
        resourceViewMode: mode,
        resources: colorConfigs?.[0].color?.colors?.map(color => ({
          [getColumnRenderName(colorConfigs?.[0])]: color.key,
          color: color.value,
        })),
        resourceFields: {
          idField: getColumnRenderName(colorConfigs?.[0]),
          textField: getColumnRenderName(colorConfigs?.[0]),
          subTextField: getColumnRenderName(colorConfigs?.[0]),
          avatarField: getColumnRenderName(colorConfigs?.[0]),
          colorField: 'color',
        },
      };
    }
  }

  private getWeek(styleCfg) {
    const [first] = getStyles(styleCfg, ['week'], ['first']);
    return {
      week: {
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: first,
        startHour: 0,
        endHour: 24,
        step: 60,
      },
      month: {
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: first,
        startHour: 0,
        endHour: 24,
      },
      day: {
        startHour: 0,
        endHour: 24,
        step: 60,
      },
    };
  }
}

export default BasicCalendarScheduler;
