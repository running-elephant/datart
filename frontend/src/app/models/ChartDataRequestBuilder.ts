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
  AggregateFieldActionType,
  ChartDataSectionType,
  DataViewFieldType,
  FilterConditionType,
  SortActionType,
} from 'app/constants';
import {
  ChartDataConfig,
  ChartDataSectionField,
  RelationFilterValue,
} from 'app/types/ChartConfig';
import { ChartStyleConfigDTO } from 'app/types/ChartConfigDTO';
import {
  ChartDataRequest,
  ChartDataRequestFilter,
} from 'app/types/ChartDataRequest';
import { ChartDatasetPageInfo } from 'app/types/ChartDataSet';
import ChartDataView from 'app/types/ChartDataView';
import { IChartDrillOption } from 'app/types/ChartDrillOption';
import { getRuntimeDateLevelFields, getValue } from 'app/utils/chartHelper';
import { transformToViewConfig } from 'app/utils/internalChartHelper';
import {
  formatTime,
  getTime,
  recommendTimeRangeConverter,
  splitRangerDateFilters,
} from 'app/utils/time';
import {
  FilterSqlOperator,
  RUNTIME_FILTER_KEY,
  TIME_FORMATTER,
} from 'globalConstants';
import { isEmptyArray, IsKeyIn, UniqWith } from 'utils/object';
import { DrillMode } from './ChartDrillOption';

export class ChartDataRequestBuilder {
  extraSorters: ChartDataRequest['orders'] = [];
  extraRuntimeFilters: ChartDataRequestFilter[] = [];
  chartDataConfigs: ChartDataConfig[];
  chartSettingConfigs;
  pageInfo;
  dataView;
  script: boolean;
  aggregation?: boolean;
  drillOption?: IChartDrillOption;
  variableParams?: Record<string, any[]>;

  constructor(
    dataView: Pick<ChartDataView, 'id' | 'computedFields'> & {
      config: string | object;
    },
    dataConfigs?: ChartDataConfig[],
    settingConfigs?: ChartStyleConfigDTO[],
    pageInfo?: ChartDatasetPageInfo,
    script?: boolean,
    aggregation?: boolean,
  ) {
    this.dataView = dataView;
    this.chartDataConfigs = dataConfigs || [];
    this.chartSettingConfigs = settingConfigs || [];
    this.pageInfo = pageInfo || {};
    this.script = script || false;
    this.aggregation = aggregation;
  }

  public addExtraSorters(sorters: ChartDataRequest['orders'] = []) {
    if (!isEmptyArray(sorters)) {
      this.extraSorters = this.extraSorters.concat(sorters!);
    }
    return this;
  }

  public addDrillOption(drillOption?: IChartDrillOption) {
    this.drillOption = drillOption;
    return this;
  }

  public addRuntimeFilters(filters: ChartDataRequestFilter[] = []) {
    if (!isEmptyArray(filters)) {
      this.extraRuntimeFilters = filters;
    }
    return this;
  }

  public addVariableParams(params?: Record<string, any[]>) {
    if (params) {
      this.variableParams = params;
    }
    return this;
  }

  private buildAggregators() {
    if (this.aggregation === false) {
      return [];
    }

    const aggColumns = this.chartDataConfigs.reduce<ChartDataSectionField[]>(
      (acc, cur) => {
        if (!cur.rows) {
          return acc;
        }
        if (
          cur.type === ChartDataSectionType.Aggregate ||
          cur.type === ChartDataSectionType.Size ||
          cur.type === ChartDataSectionType.Info
        ) {
          return acc.concat(cur.rows);
        }

        if (
          cur.type === ChartDataSectionType.Mixed &&
          cur.rows?.findIndex(v => v.type === DataViewFieldType.NUMERIC) !== -1
        ) {
          return acc.concat(
            cur.rows.filter(v => v.type === DataViewFieldType.NUMERIC),
          );
        }
        return acc;
      },
      [],
    );

    return UniqWith(
      aggColumns.map(aggCol => ({
        column: aggCol.colName,
        sqlOperator: aggCol.aggregate!,
      })),
      (a, b) => a.column === b.column && a.sqlOperator === b.sqlOperator,
    );
  }

  private buildGroups() {
    /**
     * If aggregation is off, do not add values to gruop
     */
    if (this.aggregation === false) {
      return [];
    }
    const groupColumns = this.chartDataConfigs.reduce<ChartDataSectionField[]>(
      (acc, cur) => {
        if (isEmptyArray(cur.rows)) {
          return acc;
        }
        if (cur.type === ChartDataSectionType.Color) {
          return acc.concat(cur.rows || []);
        }
        if (cur.type === ChartDataSectionType.Group) {
          const rows = getRuntimeDateLevelFields(cur.rows);

          if (cur.drillable) {
            if (this.isInValidDrillOption()) {
              return acc.concat(rows?.[0] || []);
            }
            return acc.concat(
              rows?.filter(field => {
                return Boolean(
                  this.drillOption
                    ?.getCurrentFields()
                    ?.some(df => df.uid === field.uid),
                );
              }) || [],
            );
          }
          return acc.concat(rows || []);
        }
        if (cur.type === ChartDataSectionType.Mixed) {
          const dateAndStringFields = cur.rows?.filter(v =>
            [DataViewFieldType.DATE, DataViewFieldType.STRING].includes(v.type),
          );
          //zh: 判断数据中是否含有 DATE 和 STRING 类型 en: Determine whether the data contains DATE and STRING types
          return acc.concat(dateAndStringFields || []);
        }
        return acc;
      },
      [],
    );
    return Array.from(
      new Set(groupColumns.map(groupCol => ({ column: groupCol.colName }))),
    );
  }

  private buildFilters(): ChartDataRequestFilter[] {
    const fields: ChartDataSectionField[] = this.chartDataConfigs
      .reduce<ChartDataSectionField[]>((acc, cur) => {
        if (!cur.rows || cur.type !== ChartDataSectionType.Filter) {
          return acc;
        }
        return acc.concat(cur.rows);
      }, [])
      .filter(col => Boolean(col.filter?.condition))
      .filter(col => {
        if (
          col.filter?.condition?.operator === FilterSqlOperator.Null ||
          col.filter?.condition?.operator === FilterSqlOperator.NotNull
        ) {
          return true;
        } else if (Array.isArray(col.filter?.condition?.value)) {
          return Boolean(col.filter?.condition?.value?.length);
        }
        return true;
      })
      .map(col => col);
    return this.normalizeFilters(fields)
      .concat(this.normalizeDrillFilters())
      .concat(this.normalizeRuntimeFilters());
  }

  private normalizeFilters = (fields: ChartDataSectionField[]) => {
    const _timeConverter = (visualType, value) => {
      if (visualType !== 'DATE') {
        return value;
      }
      if (Boolean(value) && typeof value === 'object' && 'unit' in value) {
        const time = getTime(+(value.direction + value.amount), value.unit)(
          value.unit,
          value.isStart,
        );
        return formatTime(time, TIME_FORMATTER);
      }
      return formatTime(value, TIME_FORMATTER);
    };

    const _transformFieldValues = (field: ChartDataSectionField) => {
      const conditionValue = field.filter?.condition?.value;
      if (!conditionValue) {
        return null;
      }
      if (Array.isArray(conditionValue)) {
        return conditionValue
          .map(v => {
            if (IsKeyIn(v as RelationFilterValue, 'key')) {
              const listItem = v as RelationFilterValue;
              if (!listItem.isSelected) {
                return undefined;
              }
              return {
                value: listItem.key,
                valueType: field.type,
              };
            } else {
              return {
                value: _timeConverter(field.filter?.condition?.visualType, v),
                valueType: field.type,
              };
            }
          })
          .filter(Boolean) as any[];
      }
      if (
        field?.filter?.condition?.type === FilterConditionType.RecommendTime
      ) {
        const timeRange = recommendTimeRangeConverter(conditionValue);
        return timeRange.map(t => ({
          value: t,
          valueType: field.type,
        }));
      }
      return [
        {
          value: _timeConverter(
            field.filter?.condition?.visualType,
            conditionValue,
          ),
          valueType: field.type,
        },
      ];
    };
    const filters = fields
      .map(field => {
        if (
          field.filter?.condition?.operator === FilterSqlOperator.In ||
          field.filter?.condition?.operator === FilterSqlOperator.NotIn
        ) {
          if (isEmptyArray(_transformFieldValues(field))) {
            return null;
          }
        }
        return {
          aggOperator:
            field.aggregate === AggregateFieldActionType.None
              ? null
              : field.aggregate,
          column: field.colName,
          sqlOperator: field.filter?.condition?.operator!,
          values: _transformFieldValues(field) || [],
        };
      })
      .filter(Boolean) as ChartDataRequestFilter[];
    return splitRangerDateFilters(filters);
  };

  private normalizeDrillFilters(): ChartDataRequestFilter[] {
    return (this.drillOption
      ?.getAllDrillDownFields()
      .filter(field => Boolean(field.condition))
      .map(f => {
        return {
          aggOperator: null,
          column: f.condition?.name!,
          sqlOperator: f.condition?.operator! as FilterSqlOperator,
          values: [
            { value: f.condition?.value as string, valueType: 'STRING' },
          ],
        };
      }) || []) as ChartDataRequestFilter[];
  }

  private normalizeRuntimeFilters(): ChartDataRequestFilter[] {
    return (this.chartDataConfigs || [])
      .filter(c => c.type === ChartDataSectionType.Filter)
      .flatMap(c => {
        return c[RUNTIME_FILTER_KEY] || [];
      })
      .concat(this.extraRuntimeFilters);
  }

  private buildOrders() {
    const sortColumns = this.chartDataConfigs
      .reduce<ChartDataSectionField[]>((acc, cur) => {
        if (!cur.rows) {
          return acc;
        }
        if (
          cur.type === ChartDataSectionType.Aggregate ||
          cur.type === ChartDataSectionType.Mixed
        ) {
          return acc.concat(cur.rows);
        }
        if (cur.type === ChartDataSectionType.Group) {
          const rows = getRuntimeDateLevelFields(cur.rows);

          if (cur.drillable) {
            if (this.isInValidDrillOption()) {
              return acc.concat(cur.rows?.[0] || []);
            }
            return acc.concat(
              rows?.filter(field => {
                return Boolean(
                  this.drillOption
                    ?.getCurrentFields()
                    ?.some(df => df.uid === field.uid),
                );
              }) || [],
            );
          }
          return acc.concat(rows || []);
        }
        return acc;
      }, [])
      .filter(
        col =>
          col?.sort?.type &&
          [SortActionType.ASC, SortActionType.DESC].includes(col?.sort?.type),
      );

    const originalSorters = sortColumns.map(aggCol => ({
      column: aggCol.colName,
      operator: aggCol.sort?.type!,
      aggOperator: aggCol.aggregate,
    }));

    const _extraSorters = this.extraSorters?.filter(
      ({ column, operator }) => column && operator,
    );
    if (!isEmptyArray(_extraSorters)) {
      return _extraSorters;
    }
    return originalSorters.filter(sorter => Boolean(sorter?.operator));
  }

  private buildPageInfo() {
    const settingStyles = this.chartSettingConfigs;
    const pageSize = getValue(settingStyles, ['paging', 'pageSize']);
    const enablePaging = getValue(settingStyles, ['paging', 'enablePaging']);
    return {
      countTotal: !!enablePaging,
      pageNo: this.pageInfo?.pageNo,
      pageSize: pageSize || 1000,
    };
  }

  private buildFunctionColumns() {
    const _removeSquareBrackets = expression => {
      if (!expression) {
        return '';
      }
      return expression.replaceAll('[', '').replaceAll(']', '');
    };
    const computedFields = getRuntimeDateLevelFields(
      this.dataView.computedFields,
    );

    return (computedFields || []).map(f => ({
      alias: f.id!,
      snippet: _removeSquareBrackets(f.expression),
    }));
  }

  private buildSelectColumns() {
    const selectColumns = this.chartDataConfigs.reduce<ChartDataSectionField[]>(
      (acc, cur) => {
        if (!cur.rows) {
          return acc;
        }

        if (this.aggregation === false) {
          if (
            cur.type === ChartDataSectionType.Color ||
            cur.type === ChartDataSectionType.Aggregate ||
            cur.type === ChartDataSectionType.Size ||
            cur.type === ChartDataSectionType.Info ||
            cur.type === ChartDataSectionType.Mixed
          ) {
            return acc.concat(cur.rows);
          } else if (cur.type === ChartDataSectionType.Group) {
            if (cur.drillable) {
              if (this.isInValidDrillOption()) {
                return acc.concat(cur.rows?.[0] || []);
              }
              return acc.concat(
                cur.rows?.filter(field => {
                  return Boolean(
                    this.drillOption
                      ?.getCurrentFields()
                      ?.some(df => df.uid === field.uid),
                  );
                }) || [],
              );
            } else {
              return acc.concat(cur.rows);
            }
          }
        }

        return acc;
      },
      [],
    );
    return selectColumns.map(col => col.colName);
  }

  private buildDetailColumns() {
    const selectColumns = this.chartDataConfigs.reduce<ChartDataSectionField[]>(
      (acc, cur) => {
        if (!cur.rows) {
          return acc;
        }
        if (cur.drillable) {
          if (this.isInValidDrillOption()) {
            return acc.concat(cur.rows?.[0] || []);
          }
          return acc.concat(
            cur.rows?.filter(field => {
              return Boolean(
                this.drillOption
                  ?.getCurrentFields()
                  ?.some(df => df.uid === field.uid),
              );
            }) || [],
          );
        } else {
          return acc.concat(cur.rows);
        }
      },
      [],
    );
    return selectColumns.map(col => col.colName);
  }

  private buildViewConfigs() {
    return transformToViewConfig(this.dataView?.config);
  }

  private isInValidDrillOption() {
    return (
      !this.drillOption ||
      this.drillOption?.mode === DrillMode.Normal ||
      !this.drillOption?.getCurrentFields()
    );
  }

  public build(): ChartDataRequest {
    return {
      ...this.buildViewConfigs(),
      viewId: this.dataView?.id,
      aggregators: this.buildAggregators(),
      groups: this.buildGroups(),
      filters: this.buildFilters(),
      orders: this.buildOrders(),
      pageInfo: this.buildPageInfo(),
      functionColumns: this.buildFunctionColumns(),
      columns: this.buildSelectColumns(),
      script: this.script,
      params: this.variableParams,
    };
  }

  public buildDetails(): ChartDataRequest {
    return {
      ...this.buildViewConfigs(),
      viewId: this.dataView?.id,
      aggregators: [],
      groups: [],
      filters: this.buildFilters(),
      orders: [],
      pageInfo: this.buildPageInfo(),
      functionColumns: this.buildFunctionColumns(),
      columns: this.buildDetailColumns(),
      script: this.script,
      params: this.variableParams,
    };
  }
}
