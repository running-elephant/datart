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

import { getStyleValue } from 'app/utils/chart';
import { formatTime } from 'app/utils/time';
import { FILTER_TIME_FORMATTER_IN_QUERY } from 'globalConstants';
import { IsKeyIn } from 'utils/object';
import {
  AggregateFieldActionType,
  ChartDataSectionConfig,
  ChartDataSectionField,
  ChartDataSectionType,
  ChartStyleSectionConfig,
  FilterValueOption,
  SortActionType,
} from './ChartConfig';
import { ChartDatasetPageInfo } from './ChartDataset';
import ChartDataView from './ChartDataView';

export type ChartRequest = {
  viewId: string;
  aggregators: Array<{ column: string; sqlOperator: string }>;
  expired?: number;
  filters: ChartRequestFilter[];
  flush?: boolean;
  groups?: Array<{ column: string }>;
  functionColumns?: Array<{ alias: string; snippet: string }>;
  limit?: any;
  nativeQuery?: boolean;
  orders: Array<{ column: string; operator: SortActionType }>;
  pageInfo?: ChartDatasetPageInfo;
  columns?: string[];
  script?: boolean;
  keywords?: string[];
  cache?: boolean;
  cacheExpires?: number;
  concurrencyControl?: boolean;
  concurrencyControlMode?: string;
};

export type ChartRequestFilter = {
  aggOperator?: AggregateFieldActionType | null;
  column: string;
  sqlOperator: string;
  values?: Array<{
    value: string;
    valueType: string;
  }>;
};

export const transformToViewConfig = (viewConfig?: string) => {
  const viewConfigMap = viewConfig ? JSON.parse(viewConfig) : {};
  const obj = {};
  if (viewConfig) {
    const fields = [
      'cache',
      'cacheExpires',
      'concurrencyControl',
      'concurrencyControlMode',
    ];
    fields.forEach(v => {
      obj[v] = viewConfigMap?.[v];
    });
  }
  return obj;
};

export class ChartDataRequestBuilder {
  chartDataConfigs: ChartDataSectionConfig[];
  charSettingConfigs: ChartStyleSectionConfig[];
  pageInfo: ChartDatasetPageInfo;
  dataView: ChartDataView;
  script: boolean;

  constructor(
    dataView: ChartDataView,
    dataConfigs?: ChartDataSectionConfig[],
    settingConfigs?: ChartStyleSectionConfig[],
    pageInfo?: ChartDatasetPageInfo,
    script?: boolean,
  ) {
    this.dataView = dataView;
    this.chartDataConfigs = dataConfigs || [];
    this.charSettingConfigs = settingConfigs || [];
    this.pageInfo = pageInfo || {};
    this.script = script || false;
  }

  buildAggregators() {
    const aggColumns = this.chartDataConfigs.reduce<ChartDataSectionField[]>(
      (acc, cur) => {
        if (!cur.rows) {
          return acc;
        }
        if (
          cur.type === ChartDataSectionType.AGGREGATE ||
          cur.type === ChartDataSectionType.SIZE ||
          cur.type === ChartDataSectionType.INFO
        ) {
          return acc.concat(cur.rows);
        }
        return acc;
      },
      [],
    );

    return aggColumns.map(aggCol => ({
      column: aggCol.colName,
      sqlOperator: aggCol.aggregate!,
    }));
  }

  buildGroupColumns() {
    const groupColumns = this.chartDataConfigs.reduce<ChartDataSectionField[]>(
      (acc, cur) => {
        if (!cur.rows) {
          return acc;
        }
        if (
          cur.type === ChartDataSectionType.GROUP ||
          cur.type === ChartDataSectionType.COLOR
        ) {
          return acc.concat(cur.rows);
        }
        return acc;
      },
      [],
    );
    return groupColumns;
  }

  buildGroups() {
    const groupColumns = this.buildGroupColumns();

    return groupColumns.map(groupCol => ({ column: groupCol.colName }));
  }

  buildFilters(): ChartRequestFilter[] {
    const fields: ChartDataSectionField[] = (this.chartDataConfigs || [])
      .reduce<ChartDataSectionField[]>((acc, cur) => {
        if (!cur.rows || cur.type !== ChartDataSectionType.FILTER) {
          return acc;
        }
        return acc.concat(cur.rows);
      }, [])
      .filter(col => Boolean(col.filter?.condition))
      .filter(col => {
        if (Array.isArray(col.filter?.condition?.value)) {
          return Boolean(col.filter?.condition?.value?.length);
        }
        return true;
      })
      .map(col => col);

    const _transformToRequest = (fields: ChartDataSectionField[]) => {
      const _convertTime = (visualType, value) => {
        if (visualType !== 'DATE') {
          return value;
        }
        return formatTime(value, FILTER_TIME_FORMATTER_IN_QUERY);
      };

      const convertValues = (field: ChartDataSectionField) => {
        if (Array.isArray(field.filter?.condition?.value)) {
          return field.filter?.condition?.value
            .map(v => {
              if (IsKeyIn(v as FilterValueOption, 'key')) {
                const listItem = v as FilterValueOption;
                if (!listItem.isSelected) {
                  return undefined;
                }
                return {
                  value: listItem.key,
                  valueType: field.type,
                };
              }
              return {
                value: _convertTime(field.filter?.condition?.visualType, v),
                valueType: field.type,
              };
            })
            .filter(Boolean) as any[];
        }
        const v = field.filter?.condition?.value;
        if (!v) {
          return null;
        }
        return [
          {
            value: _convertTime(field.filter?.condition?.visualType, v),
            valueType: field.type,
          },
        ];
      };

      return fields.map(field => ({
        aggOperator:
          field.aggregate === AggregateFieldActionType.NONE
            ? null
            : field.aggregate,
        column: field.colName,
        sqlOperator: field.filter?.condition?.operator!,
        values: convertValues(field) || [],
      }));
    };

    return _transformToRequest(fields);
  }

  buildOrders() {
    const sortColumns = this.chartDataConfigs
      .reduce<ChartDataSectionField[]>((acc, cur) => {
        if (!cur.rows) {
          return acc;
        }
        if (
          cur.type === ChartDataSectionType.GROUP ||
          cur.type === ChartDataSectionType.AGGREGATE
        ) {
          return acc.concat(cur.rows);
        }
        return acc;
      }, [])
      .filter(
        col =>
          col?.sort?.type &&
          [SortActionType.ASC, SortActionType.DESC].includes(col?.sort?.type),
      );

    return sortColumns.map(aggCol => ({
      column: aggCol.colName,
      operator: aggCol.sort?.type!,
      aggOperator: aggCol.aggregate!,
    }));
  }

  buildLimit() {
    const settingStyles = this.charSettingConfigs;
    return getStyleValue(settingStyles, ['cache', 'panel', 'displayCount']);
  }

  buildNativeQuery() {
    const settingStyles = this.charSettingConfigs;
    return getStyleValue(settingStyles, ['cache', 'panel', 'enableRaw']);
  }

  buildPageInfo() {
    const settingStyles = this.charSettingConfigs;
    const enablePaging = getStyleValue(settingStyles, [
      'paging',
      'enablePaging',
    ]);
    const pageSize = getStyleValue(settingStyles, ['paging', 'pageSize']);
    if (!enablePaging) {
      return {
        pageSize: Number.MAX_SAFE_INTEGER,
      };
    }
    return {
      pageNo: this.pageInfo?.pageNo,
      pageSize: pageSize || 10,
    };
  }

  buildFunctionColumns() {
    const _removeSquareBrackets = expression => {
      if (!expression) {
        return '';
      }
      return expression.replaceAll('[', '').replaceAll(']', '');
    };
    return (this.dataView.computedFields || []).map(f => ({
      alias: f.id!,
      snippet: _removeSquareBrackets(f.expression),
    }));
  }

  buildSelectColumns() {
    const selectColumns = this.chartDataConfigs.reduce<ChartDataSectionField[]>(
      (acc, cur) => {
        if (!cur.rows) {
          return acc;
        }
        if (cur.type === ChartDataSectionType.MIXED) {
          return acc.concat(cur.rows);
        }
        return acc;
      },
      [],
    );
    return selectColumns.map(col => col.colName);
  }

  buildViewConfigs() {
    return transformToViewConfig(this.dataView?.view?.config);
  }
  build(): ChartRequest {
    return {
      viewId: this.dataView?.id,
      aggregators: this.buildAggregators(),
      groups: this.buildGroups(),
      filters: this.buildFilters(),
      orders: this.buildOrders(),
      pageInfo: this.buildPageInfo(),
      functionColumns: this.buildFunctionColumns(),
      columns: this.buildSelectColumns(),
      script: this.script,
      ...this.buildViewConfigs(),
      // expired: 0,
      // flush: false,
      // limit: this.buildLimit(),
      // nativeQuery: this.buildNativeQuery(),
    };
  }
}

export default ChartRequest;
