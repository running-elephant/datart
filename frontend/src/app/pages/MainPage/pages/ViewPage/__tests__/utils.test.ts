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

import { ColumnTypes } from '../constants';
import { Column, ColumnRole } from '../slice/types';
import { dataModelColumnSorter } from '../utils';

describe('dataModelColumnSorter test', () => {
  test('should sort by alphabet with the STRING column type', () => {
    const columns: Column[] = [
      { name: 'c', type: ColumnTypes.String },
      { name: 'b', type: ColumnTypes.String },
      { name: 'a', type: ColumnTypes.String },
    ];
    expect(columns.sort(dataModelColumnSorter)[0].name).toEqual('a');
    expect(columns.sort(dataModelColumnSorter)[1].name).toEqual('b');
    expect(columns.sort(dataModelColumnSorter)[2].name).toEqual('c');
  });

  test('should sort by alphabet with the Numeric column type', () => {
    const columns: Column[] = [
      { name: 'c', type: ColumnTypes.Number },
      { name: 'b', type: ColumnTypes.Number },
      { name: 'a', type: ColumnTypes.Number },
    ];
    expect(columns.sort(dataModelColumnSorter)[0].name).toEqual('a');
    expect(columns.sort(dataModelColumnSorter)[1].name).toEqual('b');
    expect(columns.sort(dataModelColumnSorter)[2].name).toEqual('c');
  });

  test('should sort by alphabet with string and date column type', () => {
    const columns: Column[] = [
      { name: 'c', type: ColumnTypes.String },
      { name: 'b', type: ColumnTypes.Date },
      { name: 'a', type: ColumnTypes.Date },
    ];
    expect(columns.sort(dataModelColumnSorter)[0].name).toEqual('a');
    expect(columns.sort(dataModelColumnSorter)[1].name).toEqual('b');
    expect(columns.sort(dataModelColumnSorter)[2].name).toEqual('c');
  });

  test('should sort by column type when column type with STRING, Numeric, DATE', () => {
    const columns: Column[] = [
      { name: 'c', type: ColumnTypes.String },
      { name: 'b', type: ColumnTypes.Number },
      { name: 'a', type: ColumnTypes.Date },
      { name: 'd', type: ColumnTypes.Date },
      { name: 'e', type: ColumnTypes.Number },
      { name: 'f', type: ColumnTypes.String },
    ];
    expect(columns.sort(dataModelColumnSorter)[0].name).toEqual('a');
    expect(columns.sort(dataModelColumnSorter)[1].name).toEqual('c');
    expect(columns.sort(dataModelColumnSorter)[2].name).toEqual('d');
    expect(columns.sort(dataModelColumnSorter)[3].name).toEqual('f');
    expect(columns.sort(dataModelColumnSorter)[4].name).toEqual('b');
    expect(columns.sort(dataModelColumnSorter)[5].name).toEqual('e');
  });

  test('should sort by column type with multiple column types and hierarchy columns', () => {
    const columns: Column[] = [
      { name: 'e', type: ColumnTypes.String, role: ColumnRole.Hierarchy },
      { name: 'c', type: ColumnTypes.String },
      { name: 'b', type: ColumnTypes.Number },
      { name: 'a', type: ColumnTypes.Date },
      { name: 'f', type: ColumnTypes.Date, role: ColumnRole.Hierarchy },
    ];
    expect(columns.sort(dataModelColumnSorter)[0].name).toEqual('e');
    expect(columns.sort(dataModelColumnSorter)[1].name).toEqual('f');
    expect(columns.sort(dataModelColumnSorter)[2].name).toEqual('a');
    expect(columns.sort(dataModelColumnSorter)[3].name).toEqual('c');
    expect(columns.sort(dataModelColumnSorter)[4].name).toEqual('b');
  });
});
