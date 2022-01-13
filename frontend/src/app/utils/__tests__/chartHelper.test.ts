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
  getStyles,
  getValue,
  isInRange,
  isUnderUpperBound,
  mergeChartDataConfigs,
  mergeChartStyleConfigs,
  reachLowerBoundCount,
} from '../chartHelper';

describe('Chart Helper ', () => {
  describe.each([
    [0, 0, true],
    [0, 1, false],
    [1, 1, true],
    [0, null, true],
    [1, null, true],
    [0, undefined, true],
    [1, undefined, true],
    [1, '[1, 999]', true],
    [0, '[1, 999]', true],
    [0, [1, 999], false],
    [1, [1, 999], true],
    [999, [1, 999], true],
    [1000, [1, 999], false],
    [1, '1', true],
    [0, '1', false],
    [1, ['1', '999'], true],
    [0, ['1', '999'], false],
  ])('isInRange Test - ', (count, limit, ifInRange) => {
    test(`length ${count} in ${limit} limit is ${ifInRange}`, () => {
      expect(isInRange(limit, count)).toBe(ifInRange);
    });
  });

  describe.each([
    [[{}], [{}], [{}]],
    [[{}], [null], [{}]],
    [[{}], [undefined], [{}]],
    [[{ a: 1 }], [{ a: 2 }], [{ a: 1 }]],
    [[{ value: 1 }], [{ value: 2 }], [{ value: 2 }]],
    [[{ value: 1 }], [{ value: 2, b: 1 }], [{ value: 2 }]],
    [[{ value: 1 }], [{ value: 2, b: 1 }, { value: 3 }], [{ value: 2 }]],
    [
      [{ value: 1, default: 'no change' }],
      [{ value: 2, default: 2 }],
      [{ value: 2, default: 'no change' }],
    ],
    [
      [{ value: 1 }, { value: 1 }],
      [{ value: 2, b: 1 }],
      [{ value: 2 }, { value: 1 }],
    ],
    [
      [{ value: 1 }, { value: 1 }],
      [{ value: 2 }, { value: 2, b: 1 }],
      [{ value: 2 }, { value: 2 }],
    ],
    [
      [{ value: 1, rows: [{ value: 1 }] }],
      [{ value: 2 }, { value: 3, rows: [{ value: 3 }] }],
      [{ value: 2, rows: [{ value: 1 }] }],
    ],
    [
      [{ value: 1, rows: [{ value: 1 }] }],
      [
        { value: 2, rows: [{ value: 2, b: 2 }] },
        { value: 3, rows: [{ value: 3 }] },
      ],
      [{ value: 2, rows: [{ value: 2 }] }],
    ],
    [
      [{ value: 1, rows: null }],
      [
        { value: 2, rows: [{ value: 2, b: 2 }] },
        { value: 3, rows: [{ value: 3 }] },
      ],
      [{ value: 2, rows: [{ value: 2, b: 2 }] }],
    ],
    [
      [{ value: 1, rows: [] }],
      [
        { value: 2, rows: [{ value: 2, b: 2, c: 2, d: 2 }] },
        { value: 3, rows: [{ value: 3 }] },
      ],
      [{ value: 2, rows: [{ value: 2, b: 2, c: 2, d: 2 }] }],
    ],
    [
      [{ key: 'a', value: 1 }],
      [{ key: 'a', value: 2 }],
      [{ key: 'a', value: 2 }],
    ],
    [
      [{ key: 'a', value: 1 }],
      [{ key: 'b', value: 2 }],
      [{ key: 'a', value: 1 }],
    ],
    [
      [{ key: 'a', value: 1 }],
      [
        { key: 'b', value: 2 },
        { key: 'a', value: 3 },
      ],
      [{ key: 'a', value: 3 }],
    ],
    [
      [{ key: 'a', value: 1 }],
      [{ value: 2 }, { value: 3 }],
      [{ key: 'a', value: 1 }],
    ],
    [
      [{ key: 'a', value: 1, rows: [{ key: 'aa', value: 1 }] }],
      [
        { key: 'a', value: 2, rows: [{ key: 'aa', value: 2 }] },
        { value: 3, rows: [{ key: 'aa', value: 3 }] },
      ],
      [{ key: 'a', value: 2, rows: [{ key: 'aa', value: 2 }] }],
    ],
    [
      [{ key: 'a', value: 1, rows: [{ key: 'aa', value: 1 }] }],
      [
        { key: 'b', value: 2, rows: [{ key: 'aa', value: 2 }] },
        { key: 'a', value: 3, rows: [{ key: 'aa', value: 3 }] },
      ],
      [{ key: 'a', value: 3, rows: [{ key: 'aa', value: 3 }] }],
    ],
    [
      [
        {
          key: 'a',
          value: 1,
          rows: [{ key: 'aa', value: 1, rows: [{ key: 'aaa', value: 1 }] }],
        },
      ],
      [
        { key: 'b', value: 2, rows: [{ key: 'aa', value: 2 }] },
        {
          key: 'a',
          value: 3,
          rows: [{ key: 'aa', value: 3, rows: [{ key: 'aaa', value: 3 }] }],
        },
      ],
      [
        {
          key: 'a',
          value: 3,
          rows: [{ key: 'aa', value: 3, rows: [{ key: 'aaa', value: 3 }] }],
        },
      ],
    ],
    [
      [{ key: 'a', value: null, default: 0 }],
      [],
      [{ key: 'a', value: null, default: 0 }],
      { useDefault: true },
    ],
    [
      [{ key: 'a', value: undefined, default: 0 }],
      [],
      [{ key: 'a', value: 0, default: 0 }],
      { useDefault: true },
    ],
    [
      [{ key: 'a', value: null, default: 0 }],
      [
        { key: 'b', value: 2, default: 'n' },
        { key: 'a', value: 3, default: 'm' },
      ],
      [{ key: 'a', value: 3, default: 0 }],
      { useDefault: true },
    ],
    [
      [
        {
          key: 'a',
          value: undefined,
          default: 0,
          rows: [{ value: undefined, default: 0 }],
        },
      ],
      [],
      [{ key: 'a', value: 0, default: 0, rows: [{ value: 0, default: 0 }] }],
      { useDefault: true },
    ],
    [
      [{ key: 'a', value: undefined, default: 0 }],
      [],
      [{ key: 'a', value: undefined, default: 0 }],
      { useDefault: false },
    ],
    [
      [
        {
          key: 'a',
          value: undefined,
          default: 0,
          rows: [{ value: undefined, default: 0 }],
        },
      ],
      [],
      [
        {
          key: 'a',
          value: undefined,
          default: 0,
          rows: [{ value: undefined, default: 0 }],
        },
      ],
      { useDefault: false },
    ],
  ])('mergeChartStyleConfigs Test - ', (target, source, expected, options?) => {
    test(`deep merge target: ${JSON.stringify(
      target,
    )} from source: ${JSON.stringify(source)} result is ${JSON.stringify(
      expected,
    )} - options ${options ? JSON.stringify(options) : ''}`, () => {
      const result = mergeChartStyleConfigs(target, source, options);
      expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });
  });

  describe.each([
    [
      [{ key: 'a', type: 't1', rows: [] }],
      [
        {
          key: 'a',
          type: 't2',
          rows: [{ colName: 'aa', type: 'STRING', category: 'field' }],
        },
      ],
      [
        {
          key: 'a',
          type: 't1',
          rows: [{ colName: 'aa', type: 'STRING', category: 'field' }],
        },
      ],
    ],
    [
      [{ key: 'a', type: 't1', rows: [] }],
      [
        {
          key: 'b',
          type: 't2',
          rows: [{ colName: 'aa', type: 'STRING', category: 'field' }],
        },
      ],
      [
        {
          key: 'a',
          type: 't1',
          rows: [],
        },
      ],
    ],
    [
      [{ key: 'a', rows: [] }],
      [],
      [
        {
          key: 'a',
          rows: [],
        },
      ],
    ],
  ])('mergeChartDataConfigs Test - ', (target, source, expected, options?) => {
    test(`deep merge target: ${JSON.stringify(
      target,
    )} from source: ${JSON.stringify(source)} result is ${JSON.stringify(
      expected,
    )} - options ${options ? JSON.stringify(options) : ''}`, () => {
      const result = mergeChartDataConfigs(target, source as any);
      expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
    });
  });

  describe.each([
    [0, 0, true],
    [0, 1, true],
    [1, 1, true],
    [0, null, true],
    [1, null, true],
    [0, undefined, true],
    [1, undefined, true],
    [1, '[1, 999]', true],
    [0, '[1, 999]', true],
    [0, [1, 999], true],
    [1, [1, 999], true],
    [999, [1, 999], true],
    [1000, [1, 999], false],
    [1, '1', true],
    [0, '1', true],
    [1, ['1', '999'], true],
    [0, ['1', '999'], true],
  ])('isUnderUpperBound Test - ', (count, limit, ifInRange) => {
    test(`length ${count} in ${limit} limit under uppper bound is ${ifInRange}`, () => {
      expect(isUnderUpperBound(limit, count)).toBe(ifInRange);
    });
  });

  describe.each([
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
    [0, null, 0],
    [1, null, 0],
    [0, undefined, 0],
    [1, undefined, 0],
    [1, '[1, 999]', 0],
    [0, '[1, 999]', 0],
    [0, [1, 999], 1],
    [1, [1, 999], 0],
    [999, [1, 999], -998],
    [1000, [1, 999], -999],
    [1, '1', 0],
    [0, '1', 1],
    [1, ['1', '999'], 0],
    [0, ['1', '999'], 1],
  ])('reachLowerBoundCount Test - ', (count, limit, distance) => {
    test(`length ${count} reach ${limit} limit is ${distance}`, () => {
      expect(reachLowerBoundCount(limit, count)).toBe(distance);
    });
  });

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
});
