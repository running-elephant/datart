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

import { ChartDataSetRow } from 'app/components/ChartGraph/models/ChartDataSet';
import { ChartDataSectionField, IFieldFormatConfig } from '../../types/ChartConfig';
import {
  getColumnRenderName,
  getStyles,
  getValue,
  isMatchRequirement,
  toFormattedValue,
  valueFormatter,
  transformToDataSet,
  transformToObjectArray,
} from '../chartHelper';

describe('Chart Helper ', () => {
  describe.each([
    [
      [
        { key: '1', value: 1 },
        { key: '2', value: 2 },
      ],
      ['1'],
      'value',
      1,
    ],
    [
      [
        { key: '1', value: 1 },
        { key: '2', other: 2 },
      ],
      ['1'],
      undefined,
      1,
    ],
    [
      [
        { key: '1', other: 1 },
        { key: '2', value: 2 },
      ],
      ['1'],
      'other',
      1,
    ],
    [
      [
        { key: '1', other: 1 },
        { key: '2', value: 2 },
      ],
      ['1'],
      'unknown',
      undefined,
    ],
    [
      [
        { key: '1', other: 1 },
        { key: '2', value: 2 },
      ],
      ['unknown'],
      'value',
      undefined,
    ],
    [
      [
        { key: '1', other: 1, rows: [{ key: '1-1', value: 11 }] },
        { key: '2', value: 2 },
      ],
      ['1', '1-1'],
      'other',
      undefined,
    ],
    [
      [
        { key: '2', value: 2 },
        {
          key: '1',
          value: 1,
          rows: [
            {
              key: '1-1',
              value: 11,
              rows: [],
            },
          ],
        },
      ],
      ['1', '1-1'],
      'value',
      11,
    ],
    [
      [
        { key: '2', value: 2 },
        {
          key: '1',
          value: 1,
          rows: [
            {
              key: '1-1',
              value: 11,
              rows: [
                {
                  key: '1-1-1',
                  value: 111,
                  rows: [
                    {
                      key: '1-1-1-1',
                      value: 1111,
                      rows: [],
                    },
                    {
                      key: '1-1-1-2',
                      value: 1112,
                      rows: [
                        {
                          key: '1-1-1-2-1',
                          value: 11121,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      ['1', '1-1', '1-1-1', '1-1-1-2', '1-1-1-2-1'],
      'value',
      11121,
    ],
  ])('getValue Test - ', (configs, paths, targetKey, expected) => {
    test(`get key of ${targetKey} from configs with path ${paths?.toString()} to be ${expected}`, () => {
      expect(getValue(configs as any, paths, targetKey)).toBe(expected);
    });
  });

  describe.each([
    [
      [
        {
          key: '1',
          value: 1,
          rows: [
            {
              key: '1-1',
              value: 11,
            },
            {
              key: '1-2',
              value: 12,
            },
            {
              key: '1-3',
              value: 13,
            },
          ],
        },
        { key: '2', value: 2 },
      ],
      ['2'],
      ['1-1', '1-2'],
      [undefined, undefined],
    ],
    [
      [
        {
          key: '1',
          value: 1,
          rows: [
            {
              key: '1-1',
              value: 11,
            },
            {
              key: '1-2',
              value: 12,
            },
            {
              key: '1-3',
              value: 13,
            },
          ],
        },
        { key: '2', value: 2 },
      ],
      ['1'],
      ['1-1', '1-3'],
      [11, 13],
    ],
    [
      [
        {
          key: '1',
          value: 1,
          rows: [
            {
              key: '1-1',
              value: 11,
            },
            {
              key: '1-2',
              value: 12,
              rows: [
                {
                  key: '1-2-1',
                  value: 121,
                  rows: [
                    {
                      key: '1-2-1-1',
                      value: 1211,
                    },
                  ],
                },
                {
                  key: '1-2-2',
                  other: 122,
                },
                {
                  key: '1-2-3',
                  value: 123,
                },
              ],
            },
            {
              key: '1-3',
              value: 13,
            },
          ],
        },
        { key: '2', value: 2 },
      ],
      ['1', '1-2'],
      ['1-2-1', '1-2-2', '1-2-4'],
      [121, undefined, undefined],
    ],
  ])('getStyles Test - ', (configs, paths, targetKeys, expected) => {
    test(`get keys of ${targetKeys} from configs with path ${paths?.toString()} to be ${expected}`, () => {
      expect(getStyles(configs as any, paths, targetKeys)).toEqual(expected);
    });
  });

  describe('getColumnRenderName Test', () => {
    test('should get [unknown] string when field has no colName or aggregation', () => {
      expect(getColumnRenderName(undefined)).toEqual('[unknown]');
    });

    test('should get column render name by data field when there is no aggregation', () => {
      const field = {
        colName: 'a',
      } as any;
      expect(getColumnRenderName(field)).toEqual('a');
    });

    test('should get column render name by data field with aggregation', () => {
      const field = {
        colName: 'a',
        aggregate: 'SUM',
      } as any;
      expect(getColumnRenderName(field)).toEqual('SUM(a)');
    });

    test('should get alias name by data field when there is alias and colName', () => {
      const field = {
        alias: {
          name: 'some alias name',
        },
        colName: 'a',
        aggregate: 'SUM',
      } as any;
      expect(getColumnRenderName(field)).toEqual('some alias name');
    });
  });

  describe('isMatchRequirement Test', () => {
    test('should match meta requirement when no limition', () => {
      const meta = {
        requirements: [
          {
            group: null,
            aggregate: null,
          },
        ],
      } as any;
      const config = {
        datas: [{}],
      } as any;
      expect(isMatchRequirement(meta, config)).toBeTruthy();
    });

    test('should match meta requirement when only group have limition', () => {
      const meta = {
        requirements: [
          {
            group: 1,
            aggregate: null,
          },
        ],
      } as any;
      const config = {
        datas: [
          {
            type: 'group',
            required: true,
            rows: [
              {
                colName: 'category',
              },
            ],
          },
        ],
      } as any;
      expect(isMatchRequirement(meta, config)).toBeTruthy();
    });

    test('should match meta requirement when group and aggregate need more than one field', () => {
      const meta = {
        requirements: [
          {
            group: [1, 999],
            aggregate: [1, 999],
          },
        ],
      } as any;
      const config = {
        datas: [
          {
            type: 'group',
            required: true,
            rows: [
              {
                colName: 'category',
              },
            ],
          },
          {
            type: 'aggregate',
            required: true,
            rows: [
              {
                colName: 'amount',
              },
            ],
          },
        ],
      } as any;
      expect(isMatchRequirement(meta, config)).toBeTruthy();
    });

    test('should not match meta requirement when not match all requirement of fields', () => {
      const meta = {
        requirements: [
          {
            group: 1,
            aggregate: 2,
          },
        ],
      } as any;
      const config = {
        datas: [
          {
            type: 'group',
            required: true,
            rows: [
              {
                colName: 'category',
              },
            ],
          },
          {
            type: 'aggregate',
            required: true,
            rows: [
              {
                colName: 'amount',
              },
            ],
          },
        ],
      } as any;
      expect(isMatchRequirement(meta, config)).toBeFalsy();
    });
  });

  describe('transformToObjectArray Test', () => {
    test('should transform data to object array style', () => {
      const metas = [{ name: 'name' }, { name: 'age' }];
      const columns = [
        ['r1-c1-v', 'r1-c2-v'],
        ['r2-c1-v', 'r2-c2-v'],
      ];
      expect(transformToObjectArray(columns, metas)).toEqual([
        { name: 'r1-c1-v', age: 'r1-c2-v' },
        { name: 'r2-c1-v', age: 'r2-c2-v' },
      ]);
    });
  });

  describe('transformToDataSet Test', () => {
    test('should get dataset model with ignore case compare', () => {
      const columns = [
        ['r1-c1-v', 'r1-c2-v'],
        ['r2-c1-v', 'r2-c2-v'],
      ];
      const metas = [{ name: 'name' }, { name: 'age' }];
      const chartDataSet = transformToDataSet(columns, metas);

      expect(chartDataSet?.length).toEqual(2);
      expect(chartDataSet[0] instanceof ChartDataSetRow).toBeTruthy();
      expect(chartDataSet[0].convertToObject()).toEqual({
        NAME: 'r1-c1-v',
        AGE: 'r1-c2-v',
      });
      expect(chartDataSet[1].convertToObject()).toEqual({
        NAME: 'r2-c1-v',
        AGE: 'r2-c2-v',
      });
      expect(chartDataSet[0].getCell({ colName: 'age' } as any)).toEqual(
        'r1-c2-v',
      );
      expect(chartDataSet[0].getFieldKey({ colName: 'age' } as any)).toEqual(
        'AGE',
      );
      expect(chartDataSet[0].getFieldIndex({ colName: 'age' } as any)).toEqual(
        1,
      );
      expect(chartDataSet[0].getCellByKey('age')).toEqual('r1-c2-v');
    });

    test('should get dataset model when meta have aggregation', () => {
      const columns = [['r1-c1-v', 'r1-c2-v']];
      const metas = [{ name: 'name' }, { name: 'AVG(age)' }];
      const chartDataSet = transformToDataSet(columns, metas);

      expect(chartDataSet?.length).toEqual(1);
      expect(chartDataSet[0] instanceof ChartDataSetRow).toBeTruthy();
      expect(chartDataSet[0].convertToObject()).toEqual({
        NAME: 'r1-c1-v',
        'AVG(AGE)': 'r1-c2-v',
      });
      expect(
        chartDataSet[0].getCell({ colName: 'age', aggregate: 'AVG' } as any),
      ).toEqual('r1-c2-v');
      expect(
        chartDataSet[0].getFieldKey({
          colName: 'age',
          aggregate: 'AVG',
        } as any),
      ).toEqual('AVG(AGE)');
      expect(
        chartDataSet[0].getFieldIndex({
          colName: 'age',
          aggregate: 'AVG',
        } as any),
      ).toEqual(1);
      expect(chartDataSet[0].getCellByKey('AVG(age)')).toEqual('r1-c2-v');
    });
  });

  describe.each([
    [1, undefined, 1],
    [
      2,
      {
        type: 'numeric',
        numeric: {
          decimalPlaces: 3,
          unitKey: 'thousand',
          useThousandSeparator: true,
          prefix: 'a',
          suffix: 'b',
        },
      },
      'a0.002Kb',
    ],
    [
      111,
      {
        type: 'numeric',
        numeric: {
          decimalPlaces: 3,
          unitKey: 'thousand',
          useThousandSeparator: true,
          prefix: '',
          suffix: 'b',
        },
      },
      '0.111Kb',
    ],
    [
      333,
      {
        type: 'numeric',
        numeric: {
          decimalPlaces: 3,
          unitKey: '',
          useThousandSeparator: true,
          prefix: '',
          suffix: 'b',
        },
      },
      '333.000b',
    ],
    [
      3,
      {
        type: 'currency',
        currency: {
          decimalPlaces: 3,
          unitKey: 'thousand',
          useThousandSeparator: true,
          currency: 'CNY',
        },
      },
      '¥0.003 K',
    ],
    [
      4,
      {
        type: 'percentage',
        percentage: {
          decimalPlaces: 2,
        },
      },
      '400.00%',
    ],
    [
      50,
      {
        type: 'scientificNotation',
        scientificNotation: {
          decimalPlaces: 2,
        },
      },
      `5.00e+1`,
    ],
    [
      55,
      {
        type: 'scientificNotation',
        scientificNotation: {
          decimalPlaces: 3,
        },
      },
      `5.500e+1`,
    ],
  ])('toFormattedValue Test - ', (value, format, expected) => {
    test(`format aggregate data`, () => {
      expect(toFormattedValue(value, format as IFieldFormatConfig)).toEqual(
        expected,
      );
    });
  });

  describe.each([
    [
      undefined,
      undefined,
      `[unknown]: -`,
    ],
    [
      {
        aggregate: "",
        colName: 'name',
        type: 'STRING',
        category: 'field',
      },
      55,
      `name: 55`,
    ],
    [
      {
        aggregate: "SUM",
        colName: 'name',
        type: 'STRING',
        category: 'field',
      },
      55,
      `SUM(name): 55`,
    ],
    [
      {
        format: {
          type: 'scientificNotation',
          scientificNotation: {
            decimalPlaces: 3,
          },
        },
        aggregate: "SUM",
        colName: 'name',
        type: 'STRING',
        category: 'field',
      },
      55,
      `SUM(name): 5.500e+1`,
    ],
  ])('valueFormatter Test - ', (config, value, expected) => {
    test(`Get chart render string with field name and value`, () => {
      expect(valueFormatter(config as ChartDataSectionField, value)).toEqual(
        expected,
      );
    });
  });
});
