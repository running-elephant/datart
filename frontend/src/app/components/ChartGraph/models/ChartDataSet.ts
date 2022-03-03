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

type ColumnIndexTable = { [key: string]: number };

class ChartDataSetBase extends Array {
  protected toIndexBy(indexes, field: ChartDataSectionField): number {
    return indexes?.[this.toKey(field)];
  }

  protected toIndex(indexes, key: string): any {
    return indexes?.[this.toCaseInsensitive(key)];
  }

  protected toKey(field: ChartDataSectionField): string {
    return this.toCaseInsensitive(getValueByColumnKey(field));
  }

  protected toOriginKey(field: ChartDataSectionField): string {
    return getValueByColumnKey(field);
  }

  protected createColumnIndexTable(metas?: ChartDatasetMeta[]): {
    [key: string]: number;
  } {
    return (metas || []).reduce((acc, cur, index) => {
      acc[this.toCaseInsensitive(cur.name)] = index;
      return acc;
    }, {}) as { [key: string]: number };
  }

  protected toCaseInsensitive(key) {
    return String(key).toUpperCase();
  }

  public getFieldOriginKey(field: ChartDataSectionField) {
    return this.toOriginKey(field);
  }
}

export class ChartDataSet<T>
  extends ChartDataSetBase
  implements IChartDataSet<T>
{
  private columnIndexTable: ColumnIndexTable = {};
  private originalFields?: ChartDataSectionField[];

  constructor(
    columns: T[][],
    metas?: ChartDatasetMeta[],
    fields?: ChartDataSectionField[],
  ) {
    super();
    this.length = columns?.length || 0;
    this.originalFields = fields;
    this.columnIndexTable = super.createColumnIndexTable(metas);

    for (let i = 0; i < this.length; i++) {
      if (columns[i]?.length === 1) {
        const row = new ChartDataSetRow(this.columnIndexTable, [], fields);
        row.push(columns[i][0]);
        this[i] = row;
      } else {
        this[i] = new ChartDataSetRow(
          this.columnIndexTable,
          columns[i],
          fields,
        );
      }
    }
  }

  public getFieldKey(field: ChartDataSectionField) {
    return this.toKey(field);
  }

  public getFieldIndex(field: ChartDataSectionField) {
    return this.toIndexBy(this.columnIndexTable, field);
  }

  // TODO(Stephen): should be passed by sorted fields not data configs
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
    this.sort(
      (prev, next) =>
        sortValues.indexOf(prev[this.toKey(order)]) -
        sortValues.indexOf(next[this.toKey(order)]),
    );
  }

  public groupBy(field: ChartDataSectionField): {
    [groupKey in string]: IChartDataSetRow<T>[];
  } {
    const groupedChartDataSets = this.reduce((acc, row) => {
      const valueKey = row.getCell(field) || 'defaultGroupKey';
      if (!acc[valueKey]) {
        acc[valueKey] = [];
      }
      acc[valueKey].push(row);
      return acc;
    }, {});
    return groupedChartDataSets;
  }
}

export class ChartDataSetRow<T>
  extends ChartDataSetBase
  implements IChartDataSetRow<T>
{
  private columnIndexTable: ColumnIndexTable = {};
  private originalFields?: ChartDataSectionField[];

  constructor(indexes, items: T[], fields?: ChartDataSectionField[]) {
    super(...(items as any));
    this.columnIndexTable = indexes;
    this.originalFields = fields;
  }

  public getCell(field: ChartDataSectionField) {
    return this?.[this.toIndexBy(this.columnIndexTable, field)] as T;
  }

  public getCellByKey(key: string) {
    return this?.[this.toIndex(this.columnIndexTable, key)] as T;
  }

  public getFieldKey(field: ChartDataSectionField) {
    return this.toKey(field);
  }

  public getFieldIndex(field: ChartDataSectionField) {
    return this.toIndexBy(this.columnIndexTable, field);
  }

  public convertToObject(): object {
    return Object.keys(this.columnIndexTable).reduce((acc, cur) => {
      acc[cur] = this[this.columnIndexTable[cur]];
      return acc;
    }, {});
  }

  public convertToCaseSensitiveObject(): object {
    return (this.originalFields || []).reduce((acc, cur) => {
      acc[this.getFieldOriginKey(cur)] = this[this.getFieldIndex(cur)];
      return acc;
    }, {});
  }
}
