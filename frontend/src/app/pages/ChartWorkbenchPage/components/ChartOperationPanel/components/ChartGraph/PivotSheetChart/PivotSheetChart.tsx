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
import ChartDataset from 'app/types/ChartDataset';
import {
  getColumnRenderName,
  getCustomSortableColumns,
  getValueByColumnKey,
  transfromToObjectArray,
} from 'app/utils/chartHelper';
import ReactChart from '../ReactChart';
import AntVS2Wrapper from './AntVS2Wrapper';
import Config from './config';

class PivotSheetChart extends ReactChart {
  static icon = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M10 8h11V5c0-1.1-.9-2-2-2h-9v5zM3 8h5V3H5c-1.1 0-2 .9-2 2v3zm2 13h3V10H3v9c0 1.1.9 2 2 2zm8 1l-4-4l4-4zm1-9l4-4l4 4zm.58 6H13v-2h1.58c1.33 0 2.42-1.08 2.42-2.42V13h2v1.58c0 2.44-1.98 4.42-4.42 4.42z" fill="currentColor"/></svg>`;

  _useIFrame = false;
  isISOContainer = 'piovt-sheet';
  config = Config;
  chart: any = null;
  tableOptions: {
    dataset?;
    config?;
  } = {};

  constructor() {
    super(AntVS2Wrapper, {
      id: 'piovt-sheet',
      name: '透视表',
      icon: PivotSheetChart.icon,
    });
    this.meta.requirements = [
      {
        group: [0, 999],
        aggregate: [0, 999],
      },
    ];
  }

  onUpdated(options, context): void {
    this.tableOptions = options;

    if (!this.isMatchRequirement(options.config)) {
      this.adapter?.unmount();
      return;
    }

    this.adapter?.updated(
      this.getOptions(context, options.dataset, options.config),
      context,
    );
  }

  onResize(_, context) {
    this.onUpdated(this.tableOptions, context);
  }

  getOptions(context, dataset?: ChartDataset, config?: ChartConfig) {
    if (!dataset || !config) {
      return {};
    }

    const dataConfigs = config.datas || [];
    const styleConfigs = config.styles || [];
    const settingConfigs = config.settings || [];
    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );
    const dataColumns = getCustomSortableColumns(objDataColumns, dataConfigs);

    const rowSectionConfigRows = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'row')
      .flatMap(config => config.rows || []);

    const columnSectionConfigRows = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'column')
      .flatMap(config => config.rows || []);

    const metricsSectionConfigRows = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);

    const infoSectionConfigRows = dataConfigs
      .filter(c => c.type === ChartDataSectionType.INFO)
      .flatMap(config => config.rows || []);

    return {
      options: {
        width: context?.width,
        height: context?.height,
        tooltip: {
          showTooltip: true,
        },
      },
      dataCfg: {
        fields: {
          rows: rowSectionConfigRows.map(getValueByColumnKey),
          columns: columnSectionConfigRows.map(getValueByColumnKey),
          values: metricsSectionConfigRows.map(getValueByColumnKey),
          valueInCols: true,
        },
        meta: rowSectionConfigRows
          .concat(columnSectionConfigRows)
          .concat(metricsSectionConfigRows)
          .map(config => {
            return {
              field: getValueByColumnKey(config),
              name: getColumnRenderName(config),
            };
          }),
        data: dataColumns,
        totalData: [],
      },
    };
  }
}

export default PivotSheetChart;
