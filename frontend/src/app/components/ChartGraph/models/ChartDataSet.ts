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

import {
  ChartDataConfig,
  ChartDataSectionField,
  ChartDataSectionType,
  SortActionType,
} from 'app/types/ChartConfig';
import {
  ChartDatasetMeta,
  IChartDataSet,
  IChartDataSetRow,
} from 'app/types/ChartDataSet';
import { getValueByColumnKey } from 'app/utils/chartHelper';
import { isEmptyArray } from 'utils/object';

function findIndex(indexes, field: ChartDataSectionField) {
  return indexes?.[toKey(field)];
}

function findIndexByKey(indexes, key: string) {
  return indexes?.[toCaseInsensitive(key)];
}

function toKey(field: ChartDataSectionField) {
  return toCaseInsensitive(getValueByColumnKey(field));
}

function toCaseInsensitive(key) {
  return String(key).toUpperCase();
}

export class ChartDataSet<T>
  extends Array<DataSetRow<T>>
  implements IChartDataSet<T>
{
  private dataset: T[][];
  private metas: ChartDatasetMeta[];
  private columnIndexTable: { [key: string]: number } = {};

  *[Symbol.iterator]() {
    for (let i = 0; i < this.dataset.length; i++)
      yield new DataSetRow(this.columnIndexTable, ...this.dataset[i]);
  }

  constructor(columns?: T[][], metas?: ChartDatasetMeta[]) {
    super(...[]);
    this.dataset = columns || [];
    this.metas = metas || [];
    this.columnIndexTable = this.createColumnIndexTable(metas);
  }

  public getRow(rowIndex) {
    return Array.from(this)[rowIndex];
  }

  public getFieldKey(field: ChartDataSectionField) {
    return toKey(field);
  }

  public getFieldIndex(field: ChartDataSectionField) {
    return findIndex(this.columnIndexTable, field);
  }

  public sortBy(dataConfigs: ChartDataConfig[]): void {
    const orderConfigs = dataConfigs
      .filter(
        c =>
          c.type === ChartDataSectionType.AGGREGATE ||
          c.type === ChartDataSectionType.GROUP,
      )
      .flatMap(config => config.rows || []);

    if (isEmptyArray(orderConfigs)) {
      return;
    }
    const order = orderConfigs[0];
    if (!order.colName || !order.sort) {
      return;
    }
    const sort = order.sort;
    if (!sort || sort.type !== SortActionType.CUSTOMIZE) {
      return;
    }
    const sortValues = order.sort.value || [];
    this.dataset = this.dataset.sort(
      (prev, next) =>
        sortValues.indexOf(prev[toKey(order)]) -
        sortValues.indexOf(next[toKey(order)]),
    );
  }

  private createColumnIndexTable(metas?: ChartDatasetMeta[]): {
    [key: string]: number;
  } {
    return (metas || []).reduce((acc, cur, index) => {
      acc[toCaseInsensitive(cur.name)] = index;
      return acc;
    }, {}) as { [key: string]: number };
  }
}

export class DataSetRow<T> extends Array<T> implements IChartDataSetRow<T> {
  private columnIndexTable: { [key: string]: number } = {};

  constructor(indexes, ...items: T[]) {
    super(...items);
    this.columnIndexTable = indexes;
  }

  public getCell(field: ChartDataSectionField) {
    return this?.[findIndex(this.columnIndexTable, field)] as T;
  }

  public getCellByKey(key: string) {
    return this?.[findIndexByKey(this.columnIndexTable, key)] as T;
  }

  public getFieldKey(field: ChartDataSectionField) {
    return toKey(field);
  }

  public getFieldIndex(field: ChartDataSectionField) {
    return findIndex(this.columnIndexTable, field);
  }

  public convertToObject(): object {
    return Object.keys(this.columnIndexTable).reduce((acc, cur) => {
      acc[cur] = this[this.columnIndexTable[cur]];
      return acc;
    }, {});
  }
}
