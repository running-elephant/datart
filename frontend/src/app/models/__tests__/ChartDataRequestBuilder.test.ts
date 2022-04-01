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
  ChartDataViewFieldCategory,
  DataViewFieldType,
  FilterConditionType,
} from 'app/constants';
import { FilterSqlOperator, RECOMMEND_TIME } from 'globalConstants';
import moment from 'moment';
import { ChartDataRequestBuilder } from '../ChartDataRequestBuilder';

describe('ChartDataRequestBuild Test', () => {
  test('should get builder with default values', () => {
    const dataView = { id: 'view-id' } as any;
    const enableScript = false;
    const enableAggregation = false;

    const builder = new ChartDataRequestBuilder(
      dataView,
      undefined,
      undefined,
      undefined,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams).toEqual({
      aggregators: [],
      columns: [],
      filters: [],
      functionColumns: [],
      groups: [],
      orders: [],
      pageInfo: {
        countTotal: false,
        pageNo: undefined,
        pageSize: 1000,
      },
      script: false,
      viewId: 'view-id',
    });
  });

  test('should get aggregators with enabled aggregation', () => {
    const dataView = { id: 'view-id' } as any;
    const chartDataConfigs = [
      {
        type: ChartDataSectionType.AGGREGATE,
        key: 'aggregation',
        rows: [
          {
            colName: 'amount',
            aggregate: AggregateFieldActionType.AVG,
            type: DataViewFieldType.NUMERIC,
            category: ChartDataViewFieldCategory.Field as any,
          },
          {
            colName: 'sub-amount',
            aggregate: AggregateFieldActionType.SUM,
            type: DataViewFieldType.NUMERIC,
            category: ChartDataViewFieldCategory.ComputedField as any,
          },
        ],
      },
      {
        type: ChartDataSectionType.AGGREGATE,
        key: 'aggregation',
      },
      {
        type: ChartDataSectionType.SIZE,
        key: 'size',
        rows: [
          {
            colName: 'total',
            aggregate: AggregateFieldActionType.COUNT,
            type: DataViewFieldType.NUMERIC,
            category: ChartDataViewFieldCategory.ComputedField as any,
          },
        ],
      },
      {
        type: ChartDataSectionType.INFO,
        key: 'info',
        rows: [
          {
            colName: 'sex',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Variable as any,
          },
        ],
      },
      {
        type: ChartDataSectionType.MIXED,
        key: 'info',
        rows: [
          {
            colName: 'sex',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Variable as any,
          },
          {
            colName: 'age',
            type: DataViewFieldType.NUMERIC,
            category: ChartDataViewFieldCategory.Variable as any,
          },
        ],
      },
      {
        type: ChartDataSectionType.GROUP,
        key: 'unknown',
        rows: [
          {
            colName: 'name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Variable as any,
          },
        ],
      },
    ];
    const chartSettingConfigs = [];
    const pageInfo = {};
    const enableScript = false;
    const enableAggregation = true;

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams.aggregators).toEqual([
      { column: 'amount', sqlOperator: 'AVG' },
      { column: 'sub-amount', sqlOperator: 'SUM' },
      { column: 'total', sqlOperator: 'COUNT' },
      { column: 'sex', sqlOperator: undefined },
      { column: 'age', sqlOperator: undefined },
    ]);
  });

  test('should not get aggregators with disable aggregation', () => {
    const dataView = { id: 'view-id' } as any;
    const chartDataConfigs = [
      {
        type: ChartDataSectionType.AGGREGATE,
        key: 'aggregation',
        rows: [
          {
            colName: 'amount',
            aggregate: AggregateFieldActionType.AVG,
            type: DataViewFieldType.NUMERIC,
            category: ChartDataViewFieldCategory.Field as any,
          },
        ],
      },
    ];
    const chartSettingConfigs = [];
    const pageInfo = {};
    const enableScript = false;
    const enableAggregation = false;

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams.aggregators).toEqual([]);
  });

  test('should unique aggregators with colName and aggregation', () => {
    const dataView = { id: 'view-id' } as any;
    const chartDataConfigs = [
      {
        type: ChartDataSectionType.AGGREGATE,
        key: 'aggregation',
        rows: [
          {
            colName: 'amount',
            aggregate: AggregateFieldActionType.AVG,
            type: DataViewFieldType.NUMERIC,
            category: ChartDataViewFieldCategory.Field as any,
          },
        ],
      },
      {
        type: ChartDataSectionType.SIZE,
        key: 'size',
        rows: [
          {
            colName: 'amount',
            aggregate: AggregateFieldActionType.AVG,
            type: DataViewFieldType.NUMERIC,
            category: ChartDataViewFieldCategory.Field as any,
          },
        ],
      },
    ];
    const chartSettingConfigs = [];
    const pageInfo = {};
    const enableScript = false;
    const enableAggregation = true;

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams.aggregators).toEqual([
      { column: 'amount', sqlOperator: 'AVG' },
    ]);
  });

  test('should get groups', () => {
    const dataView = { id: 'view-id' } as any;
    const chartDataConfigs = [
      {
        type: ChartDataSectionType.GROUP,
        key: 'aggregation',
      },
      {
        type: ChartDataSectionType.GROUP,
        key: 'aggregation',
        rows: [
          {
            colName: 'name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
          },
        ],
      },
      {
        type: ChartDataSectionType.COLOR,
        key: 'aggregation',
        rows: [
          {
            colName: 'age',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
          },
        ],
      },
      {
        type: ChartDataSectionType.MIXED,
        key: 'address',
        rows: [
          {
            colName: 'address',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
          },
          {
            colName: 'post',
            type: DataViewFieldType.NUMERIC,
            category: ChartDataViewFieldCategory.Field as any,
          },
        ],
      },
    ];
    const chartSettingConfigs = [];
    const pageInfo = {};
    const enableScript = false;
    const enableAggregation = true;

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams.groups).toEqual([
      { column: 'name' },
      { column: 'age' },
      { column: 'address' },
    ]);

    const enableAggregation2 = false;

    const builder2 = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation2,
    );
    const requestParams2 = builder2.build();

    expect(requestParams2.groups).toEqual([]);
  });

  test('should get filters', () => {
    const dataView = { id: 'view-id' } as any;
    const chartDataConfigs = [
      {
        type: ChartDataSectionType.FILTER,
        key: 'filter1',
      },
      {
        type: ChartDataSectionType.FILTER,
        key: 'filter2',
        rows: [
          {
            colName: 'name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
            aggregate: AggregateFieldActionType.NONE,
            filter: {
              condition: {
                name: 'filter-1',
                type: FilterConditionType.List,
                operator: FilterSqlOperator.In,
                visualType: 'STRING',
                value: ['a', 'b'],
              },
            },
          },
        ],
      },
      {
        type: ChartDataSectionType.FILTER,
        key: 'filter3',
        rows: [
          {
            colName: 'name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
            aggregate: AggregateFieldActionType.AVG,
            filter: {
              condition: {
                name: 'filter-1',
                type: FilterConditionType.List,
                operator: FilterSqlOperator.In,
                visualType: 'STRING',
                value: ['a', 'b'],
              },
            },
          },
          {
            colName: 'name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
            filter: {
              condition: {
                name: 'name-not-null',
                type: FilterConditionType.Filter,
                operator: FilterSqlOperator.NotNull,
                visualType: 'STRING',
              },
            },
          },
          {
            colName: 'name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
            filter: {
              condition: {
                name: 'name-is-null',
                type: FilterConditionType.Filter,
                operator: FilterSqlOperator.Null,
                visualType: 'STRING',
              },
            },
          },
          {
            colName: 'address',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
            filter: {
              condition: {
                name: 'address-not-in',
                type: FilterConditionType.List,
                operator: FilterSqlOperator.NotIn,
                visualType: 'STRING',
                value: ['a', 'b'],
              },
            },
          },
          {
            colName: 'address',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
            filter: {
              condition: {
                name: 'address-in',
                type: FilterConditionType.List,
                operator: FilterSqlOperator.In,
                visualType: 'STRING',
              },
            },
          },
          {
            colName: 'family',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
            filter: {
              condition: {
                name: 'family-list',
                type: FilterConditionType.List,
                operator: FilterSqlOperator.In,
                visualType: 'STRING',
                value: [
                  { key: 'a', isSelected: true },
                  { key: 'b', isSelected: false },
                ],
              },
            },
          },
          {
            colName: 'born',
            type: DataViewFieldType.DATE,
            category: ChartDataViewFieldCategory.Field as any,
            filter: {
              condition: {
                name: 'born-date',
                type: FilterConditionType.Time,
                operator: FilterSqlOperator.In,
                visualType: 'DATE',
                value: ['2022-03-16'],
              },
            },
          },
          {
            colName: 'born',
            type: DataViewFieldType.DATE,
            category: ChartDataViewFieldCategory.Field as any,
            filter: {
              condition: {
                name: 'address-time',
                type: FilterConditionType.Time,
                operator: FilterSqlOperator.In,
                visualType: 'DATE',
                value: [{ unit: 'd', amount: 1, direction: '-' }],
              },
            },
          },
          {
            colName: 'born',
            type: DataViewFieldType.DATE,
            category: ChartDataViewFieldCategory.Field as any,
            filter: {
              condition: {
                name: 'born-recommend',
                type: FilterConditionType.RecommendTime,
                operator: FilterSqlOperator.In,
                visualType: 'DATE',
                value: RECOMMEND_TIME.TODAY,
              },
            },
          },
          {
            colName: 'birthday',
            type: DataViewFieldType.DATE,
            category: ChartDataViewFieldCategory.Field as any,
            filter: {
              condition: {
                name: 'born-recommend',
                type: FilterConditionType.RangeTime,
                operator: FilterSqlOperator.In,
                visualType: 'DATE',
                value: RECOMMEND_TIME.TODAY,
              },
            },
          },
          {
            colName: 'born',
            type: DataViewFieldType.DATE,
            category: ChartDataViewFieldCategory.Field as any,
            filter: {
              condition: {
                name: 'born-recommend',
                type: FilterConditionType.RecommendTime,
                operator: FilterSqlOperator.In,
                visualType: 'DATE',
                value: RECOMMEND_TIME.TODAY,
              },
            },
          },
        ],
      },
    ] as any;
    const chartSettingConfigs = [];
    const pageInfo = {};
    const enableScript = false;
    const enableAggregation = true;
    const today = moment().format('YYYY-MM-DD');

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams.filters).toEqual([
      {
        aggOperator: null,
        column: 'name',
        sqlOperator: 'IN',
        values: [
          { value: 'a', valueType: 'STRING' },
          { value: 'b', valueType: 'STRING' },
        ],
      },
      {
        aggOperator: 'AVG',
        column: 'name',
        sqlOperator: 'IN',
        values: [
          { value: 'a', valueType: 'STRING' },
          { value: 'b', valueType: 'STRING' },
        ],
      },
      {
        aggOperator: undefined,
        column: 'name',
        sqlOperator: 'NOT_NULL',
        values: [],
      },
      {
        aggOperator: undefined,
        column: 'name',
        sqlOperator: 'IS_NULL',
        values: [],
      },
      {
        aggOperator: undefined,
        column: 'address',
        sqlOperator: 'NOT_IN',
        values: [
          { value: 'a', valueType: 'STRING' },
          { value: 'b', valueType: 'STRING' },
        ],
      },
      {
        aggOperator: undefined,
        column: 'family',
        sqlOperator: 'IN',
        values: [{ value: 'a', valueType: 'STRING' }],
      },
      {
        aggOperator: undefined,
        column: 'born',
        sqlOperator: 'IN',
        values: [{ value: '2022-03-16 00:00:00', valueType: 'DATE' }],
      },
      {
        aggOperator: undefined,
        column: 'born',
        sqlOperator: 'IN',
        values: [{ value: `${today} 00:00:00`, valueType: 'DATE' }],
      },
      {
        aggOperator: undefined,
        column: 'born',
        sqlOperator: 'IN',
        values: [
          { value: `${today} 00:00:00`, valueType: 'DATE' },
          { value: `${today} 23:59:59`, valueType: 'DATE' },
        ],
      },
      {
        aggOperator: undefined,
        column: 'birthday',
        sqlOperator: 'IN',
        values: [{ value: 'Invalid date', valueType: 'DATE' }],
      },
      {
        aggOperator: undefined,
        column: 'born',
        sqlOperator: 'IN',
        values: [
          { value: `${today} 00:00:00`, valueType: 'DATE' },
          { value: `${today} 23:59:59`, valueType: 'DATE' },
        ],
      },
    ]);
  });

  test('should get orders', () => {
    const dataView = { id: 'view-id' } as any;
    const chartDataConfigs = [
      {
        type: ChartDataSectionType.AGGREGATE,
        key: 'aggregationL',
      },
      {
        type: ChartDataSectionType.AGGREGATE,
        key: 'aggregationR',
        rows: [
          {
            colName: 'age',
            aggregate: AggregateFieldActionType.AVG,
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
            sort: {
              type: 'ASC',
            },
          },
        ],
      },
      {
        type: ChartDataSectionType.GROUP,
        key: 'group',
        rows: [
          {
            colName: 'first-name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
            sort: {
              type: 'ASC',
            },
          },
          {
            colName: 'last-name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.ComputedField as any,
            sort: {
              type: 'DESC',
            },
          },
          {
            colName: 'middle-name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.ComputedField as any,
            sort: {
              type: 'CUSTOMIZE',
            },
          },
        ],
      },
      {
        type: ChartDataSectionType.MIXED,
        key: 'info',
        rows: [
          {
            colName: 'address',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.ComputedField as any,
            sort: {
              type: 'DESC',
            },
          },
        ],
      },
    ] as any;
    const chartSettingConfigs = [];
    const pageInfo = {};
    const enableScript = false;
    const enableAggregation = true;

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams.orders).toEqual([
      {
        column: 'age',
        aggOperator: 'AVG',
        operator: 'ASC',
      },
      { column: 'first-name', operator: 'ASC', aggOperator: undefined },
      { column: 'last-name', operator: 'DESC', aggOperator: undefined },
      { column: 'address', operator: 'DESC', aggOperator: undefined },
    ]);
  });

  test('should get orders with unique extra sorters', () => {
    const dataView = { id: 'view-id' } as any;
    const chartDataConfigs = [
      {
        type: ChartDataSectionType.AGGREGATE,
        key: 'aggregationR',
        rows: [
          {
            colName: 'age',
            aggregate: AggregateFieldActionType.AVG,
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
            sort: {
              type: 'ASC',
            },
          },
        ],
      },
      {
        type: ChartDataSectionType.GROUP,
        key: 'group',
        rows: [
          {
            colName: 'first-name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.Field as any,
            sort: {
              type: 'ASC',
            },
          },
          {
            colName: 'last-name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.ComputedField as any,
            sort: {
              type: 'DESC',
            },
          },
          {
            colName: 'middle-name',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.ComputedField as any,
            sort: {
              type: 'CUSTOMIZE',
            },
          },
        ],
      },
      {
        type: ChartDataSectionType.MIXED,
        key: 'info',
        rows: [
          {
            colName: 'address',
            type: DataViewFieldType.STRING,
            category: ChartDataViewFieldCategory.ComputedField as any,
            sort: {
              type: 'DESC',
            },
          },
        ],
      },
    ] as any;
    const extraSorters = [
      {
        column: 'age',
        aggOperator: 'AVG',
        operator: 'ASC',
      },
      { column: 'fore-name', operator: 'ASC', aggOperator: undefined },
    ] as any;
    const chartSettingConfigs = [];
    const pageInfo = {};
    const enableScript = false;
    const enableAggregation = true;

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    builder.addExtraSorters(extraSorters);
    const requestParams = builder.build();

    expect(requestParams.orders).toEqual([
      { column: 'first-name', operator: 'ASC', aggOperator: undefined },
      { column: 'last-name', operator: 'DESC', aggOperator: undefined },
      { column: 'address', operator: 'DESC', aggOperator: undefined },
      {
        column: 'age',
        aggOperator: 'AVG',
        operator: 'ASC',
      },
      { column: 'fore-name', operator: 'ASC', aggOperator: undefined },
    ]);

    const extraSorters2: any = null;
    builder.addExtraSorters(extraSorters2);

    expect(requestParams.orders).toEqual([
      { column: 'first-name', operator: 'ASC', aggOperator: undefined },
      { column: 'last-name', operator: 'DESC', aggOperator: undefined },
      { column: 'address', operator: 'DESC', aggOperator: undefined },
      {
        column: 'age',
        aggOperator: 'AVG',
        operator: 'ASC',
      },
      { column: 'fore-name', operator: 'ASC', aggOperator: undefined },
    ]);
  });

  test('should get pageInfo from setting config', () => {
    const dataView = { id: 'view-id' } as any;
    const chartDataConfigs = [];
    const chartSettingConfigs = [
      {
        key: 'paging',
        rows: [
          {
            key: 'enablePaging',
            value: true,
          },
          {
            key: 'pageSize',
            value: 1024,
          },
        ],
      },
    ];
    const pageInfo = { pageNo: 1 };
    const enableScript = false;
    const enableAggregation = true;

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams.pageInfo).toEqual({
      countTotal: true,
      pageNo: 1,
      pageSize: 1024,
    });
  });

  test('should computed functions', () => {
    const dataView = {
      id: 'view-id',
      computedFields: [
        { id: 'f1', expression: '[a' },
        { id: 'f2', expression: '[b]' },
        { id: 'f3', expression: '' },
      ],
    } as any;
    const chartDataConfigs = [];
    const chartSettingConfigs = [];
    const pageInfo = {};
    const enableScript = false;
    const enableAggregation = true;

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams.functionColumns).toEqual([
      { alias: 'f1', snippet: 'a' },
      { alias: 'f2', snippet: 'b' },
      { alias: 'f3', snippet: '' },
    ]);
  });

  test('should get view config', () => {
    const viewConfig = {
      cache: false,
      cacheExpires: '',
      concurrencyControl: false,
      concurrencyControlMode: 'a',
    };
    const dataView = { config: JSON.stringify(viewConfig) } as any;
    const chartDataConfigs = [];
    const chartSettingConfigs = [];
    const pageInfo = {};
    const enableScript = false;
    const enableAggregation = true;

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams.cache).toEqual(viewConfig.cache);
    expect(requestParams.cacheExpires).toEqual(viewConfig.cacheExpires);
    expect(requestParams.concurrencyControl).toEqual(
      viewConfig.concurrencyControl,
    );
    expect(requestParams.concurrencyControlMode).toEqual(
      viewConfig.concurrencyControlMode,
    );
  });

  test('should get view config when config is a object', () => {
    const viewConfig = {
      cache: false,
      cacheExpires: '',
      concurrencyControl: false,
      concurrencyControlMode: 'a',
    };
    const dataView = {
      computedFields: [],
      id: '1',
      config: viewConfig,
    };
    const chartDataConfigs = [];
    const chartSettingConfigs = [];
    const pageInfo = {};
    const enableScript = false;
    const enableAggregation = true;

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams.cache).toEqual(viewConfig.cache);
    expect(requestParams.cacheExpires).toEqual(viewConfig.cacheExpires);
    expect(requestParams.concurrencyControl).toEqual(
      viewConfig.concurrencyControl,
    );
    expect(requestParams.concurrencyControlMode).toEqual(
      viewConfig.concurrencyControlMode,
    );
  });

  test('should get select columns', () => {
    const dataView = { id: 'view-id' } as any;
    const chartDataConfigs = [
      {
        type: ChartDataSectionType.AGGREGATE,
        key: 'aggregation',
        rows: [
          {
            colName: 'amount',
            type: '',
            category: '',
          },
        ],
      },
      {
        type: ChartDataSectionType.SIZE,
        key: 'size',
        rows: [
          {
            colName: 'total',
            type: '',
            category: '',
          },
        ],
      },
      {
        type: ChartDataSectionType.INFO,
        key: 'info',
        rows: [
          {
            colName: 'sex',
            type: '',
            category: '',
          },
        ],
      },
      {
        type: ChartDataSectionType.COLOR,
        key: 'info',
        rows: [
          {
            colName: 'sex',
            type: '',
            category: '',
          },
        ],
      },
      {
        type: ChartDataSectionType.GROUP,
        key: 'GROUP',
        rows: [
          {
            colName: 'name',
            type: '',
            category: '',
          },
        ],
      },
      {
        type: ChartDataSectionType.MIXED,
        key: 'MIXED',
        rows: [
          {
            colName: 'name',
            type: '',
            category: '',
          },
        ],
      },
      {
        type: ChartDataSectionType.FILTER,
        key: 'filter',
        rows: [
          {
            colName: 'filter',
            type: '',
            category: '',
          },
        ],
      },
    ] as any;
    const chartSettingConfigs = [];
    const pageInfo = {};
    const enableScript = false;
    const enableAggregation = false;

    const builder = new ChartDataRequestBuilder(
      dataView,
      chartDataConfigs,
      chartSettingConfigs,
      pageInfo,
      enableScript,
      enableAggregation,
    );
    const requestParams = builder.build();

    expect(requestParams.columns).toEqual([
      'amount',
      'total',
      'sex',
      'sex',
      'name',
      'name',
    ]);
  });
});
