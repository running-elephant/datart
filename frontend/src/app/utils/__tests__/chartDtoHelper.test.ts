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
  buildUpdateChartRequest,
  convertToChartConfigDTO,
  convertToChartDTO,
  mergeToChartConfig,
} from '../ChartDtoHelper';

describe('chartDtoHelper Test', () => {
  test('should convert to chart dto', () => {
    const data = {
      config: JSON.stringify({ id: 1 }),
      view: {
        model: JSON.stringify({ name: 2 }),
      },
    };
    const dto = convertToChartDTO(data);
    expect(dto).toEqual({
      config: { id: 1 },
      view: {
        meta: [{ id: 'name', category: 'field' }],
      },
    });
  });

  test('should build chart request', () => {
    const inputParams = {
      chartId: 1,
      aggregation: 'AVG',
      chartConfig: {
        datas: [],
        styles: [],
        settings: [],
      },
      graphId: 2,
      index: 0,
      parentId: 0,
      name: 'a-chart',
      viewId: '1',
      computedFields: [],
    };
    const result = buildUpdateChartRequest(inputParams);
    expect(result).toEqual({
      id: 1,
      index: 0,
      parent: 0,
      name: 'a-chart',
      viewId: '1',
      config:
        '{"aggregation":"AVG","chartConfig":{"datas":[],"styles":[],"settings":[]},"chartGraphId":2,"computedFields":[]}',
      permissions: [],
      avatar: 2,
    });
  });

  test('should get empty config when target is empty ', () => {
    const chartConfig = undefined;
    const chartDetailConfigDto = {
      chartGraphId: '1',
      computedFields: [],
      aggregation: false,
      chartConfig: {
        datas: [{ key: 'data-1', rows: [] }],
        styles: [{ key: 'style-1', value: 2 }],
        settings: [{ key: 'setting-1', value: 3 }],
      },
    };
    const result = mergeToChartConfig(chartConfig, chartDetailConfigDto);
    expect(result).toEqual(undefined);
  });

  test('should not merge config when source is empty ', () => {
    const chartConfig = {
      datas: [{ key: 'data-1' }],
      styles: [{ key: 'style-1' }],
      settings: [{ key: 'setting-1' }],
    } as any;
    const chartDetailConfigDto = undefined;
    const result = mergeToChartConfig(chartConfig, chartDetailConfigDto);
    expect(result).toEqual(chartConfig);
  });

  test('should merge chart config from chart detail config', () => {
    const chartConfig = {
      datas: [{ key: 'data-1' }],
      styles: [{ key: 'style-1' }],
      settings: [{ key: 'setting-1' }],
    } as any;
    const chartDetailConfigDto = {
      chartGraphId: '1',
      computedFields: [],
      aggregation: false,
      chartConfig: {
        datas: [{ key: 'data-1', rows: [] }],
        styles: [{ key: 'style-1', value: 2 }],
        settings: [{ key: 'setting-1', value: 3 }],
      },
    };
    const result = mergeToChartConfig(chartConfig, chartDetailConfigDto);
    expect(result).toEqual({
      datas: [{ key: 'data-1', rows: [] }],
      styles: [{ key: 'style-1', value: 2 }],
      settings: [{ key: 'setting-1', value: 3 }],
    });
  });

  test('should get chartConfigDto', () => {
    const chartDetailConfigDto = {
      chartConfig: {
        datas: [],
        styles: [],
        settings: [],
      },
    } as any;
    const result = convertToChartConfigDTO(chartDetailConfigDto);
    expect(result).toEqual({ datas: [], styles: [], settings: [] });
  });
});
