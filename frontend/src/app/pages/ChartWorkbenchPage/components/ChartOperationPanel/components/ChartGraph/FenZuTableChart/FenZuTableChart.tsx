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
  getCustomSortableColumns,
  transfromToObjectArray,
} from 'app/utils/chartHelper';
import BasicTableChart from '../BasicTableChart';
import Config from './config';

class FenZuTableChart extends BasicTableChart {
  chart: any = null;
  config = Config;

  isAutoMerge = true;

  constructor() {
    super({
      id: 'fenzu-table',
      name: '分组表',
      icon: 'fenzubiao',
    });
  }

  getOptions(context, dataset?: ChartDataset, config?: ChartConfig) {
    if (!dataset || !config) {
      return { locale: { emptyText: '  ' } };
    }

    const { clientWidth, clientHeight } = context.document.documentElement;
    const dataConfigs = config.datas || [];
    const styleConfigs = config.styles || [];
    const settingConfigs = config.settings || [];
    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );
    const dataColumns = getCustomSortableColumns(objDataColumns, dataConfigs);
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);
    const tablePagination = this.getPagingOptions(settingConfigs);

    return {
      rowKey: 'uid',
      pagination: tablePagination,
      dataSource: this.generateTableRowUniqId(dataColumns),
      columns: this.getColumns(
        groupConfigs,
        aggregateConfigs,
        styleConfigs,
        dataColumns,
      ),
      components: this.getTableComponents(styleConfigs),
      ...this.getAntdTableStyleOptions(
        styleConfigs,
        dataset,
        clientWidth,
        clientHeight,
        tablePagination,
      ),
    };
  }
}

export default FenZuTableChart;
