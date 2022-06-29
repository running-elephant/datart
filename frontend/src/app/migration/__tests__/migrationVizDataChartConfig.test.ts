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

import { ChartConfig } from 'app/types/ChartConfig';
import { APP_VERSION_BETA_4 } from '../constants';
import migrationDataChartConfig from '../vizDataChartConfig/migrationDataChartConfig';

describe('migrationDataChartConfig Test', () => {
  test('when chartConfig datas Each rows does not contain id', () => {
    const chartConfig = {
      datas: [
        {
          rows: [
            {
              uid: '029a8c93-33cd-4526-af16-ae873cf6f7ed',
              colName: '国家',
              type: 'STRING',
              category: 'computedField',
            },
          ],
        },
        {
          rows: [
            {
              uid: 'e0c231f0-a769-4cd5-ac04-96c734e1d59d',
              colName: '粉丝',
              type: 'NUMERIC',
              subType: 'UNCATEGORIZED',
              category: 'field',
              children: [],
              aggregate: 'SUM',
            },
          ],
        },
        {
          label: 'filter',
          key: 'filter',
          type: 'filter',
          allowSameField: true,
        },
        {
          label: 'colorize',
          key: 'color',
          type: 'color',
          limit: [0, 1],
        },
        {
          label: 'info',
          key: 'info',
          type: 'info',
        },
      ],
    } as ChartConfig;
    expect(migrationDataChartConfig(chartConfig)).toEqual({
      version: APP_VERSION_BETA_4,
      datas: [
        {
          rows: [
            {
              uid: '029a8c93-33cd-4526-af16-ae873cf6f7ed',
              id: '国家',
              colName: '国家',
              type: 'STRING',
              category: 'computedField',
            },
          ],
        },
        {
          rows: [
            {
              uid: 'e0c231f0-a769-4cd5-ac04-96c734e1d59d',
              id: '["粉丝"]',
              colName: '粉丝',
              type: 'NUMERIC',
              subType: 'UNCATEGORIZED',
              category: 'field',
              children: [],
              aggregate: 'SUM',
            },
          ],
        },
        {
          label: 'filter',
          key: 'filter',
          type: 'filter',
          allowSameField: true,
        },
        {
          label: 'colorize',
          key: 'color',
          type: 'color',
          limit: [0, 1],
        },
        {
          label: 'info',
          key: 'info',
          type: 'info',
        },
      ],
    });
  });

  test('when chartConfig datas Each rows have id', () => {
    const chartConfig = {
      datas: [
        {
          rows: [
            {
              uid: '029a8c93-33cd-4526-af16-ae873cf6f7ed',
              id: '国家',
              colName: '国家',
              type: 'STRING',
              category: 'computedField',
            },
          ],
        },
        {
          rows: [
            {
              uid: 'e0c231f0-a769-4cd5-ac04-96c734e1d59d',
              colName: '粉丝',
              id: '["粉丝"]',
              type: 'NUMERIC',
              subType: 'UNCATEGORIZED',
              category: 'field',
              children: [],
              aggregate: 'SUM',
            },
          ],
        },
        {
          label: 'filter',
          key: 'filter',
          type: 'filter',
          allowSameField: true,
        },
        {
          label: 'colorize',
          key: 'color',
          type: 'color',
          limit: [0, 1],
        },
        {
          label: 'info',
          key: 'info',
          type: 'info',
        },
      ],
    } as ChartConfig;
    expect(migrationDataChartConfig(chartConfig)).toEqual({
      version: APP_VERSION_BETA_4,
      datas: [
        {
          rows: [
            {
              uid: '029a8c93-33cd-4526-af16-ae873cf6f7ed',
              id: '国家',
              colName: '国家',
              type: 'STRING',
              category: 'computedField',
            },
          ],
        },
        {
          rows: [
            {
              uid: 'e0c231f0-a769-4cd5-ac04-96c734e1d59d',
              id: '["粉丝"]',
              colName: '粉丝',
              type: 'NUMERIC',
              subType: 'UNCATEGORIZED',
              category: 'field',
              children: [],
              aggregate: 'SUM',
            },
          ],
        },
        {
          label: 'filter',
          key: 'filter',
          type: 'filter',
          allowSameField: true,
        },
        {
          label: 'colorize',
          key: 'color',
          type: 'color',
          limit: [0, 1],
        },
        {
          label: 'info',
          key: 'info',
          type: 'info',
        },
      ],
    });
  });
});
