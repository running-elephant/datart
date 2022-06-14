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

import { ChartSelectOption } from '../ChartSelectOption';

describe('ChartSelectOption Test', () => {
  test('should init model is a parameter', () => {
    const option = new ChartSelectOption(window);
    expect(option).not.toBeNull();
    expect(option.selectedItems).toEqual([]);
    expect(option.addEvent()).toBeUndefined();
    expect(option.removeEvent()).toBeUndefined();
  });

  test('should normal select and clear function', () => {
    const option = new ChartSelectOption(window);
    option.normalSelect({
      index: '1',
      data: {
        rowData: {
          text: 'test',
        },
      },
    });
    expect(option).not.toBeNull();
    expect(JSON.stringify(option.selectedItems)).toEqual(
      JSON.stringify([
        {
          index: '1',
          data: {
            rowData: {
              text: 'test',
            },
          },
        },
      ]),
    );
    option.normalSelect({
      index: '1',
      data: {
        rowData: {
          text: 'test',
        },
      },
    });
    expect(option.selectedItems).toEqual([]);
    option.clearAll();
    expect(option.selectedItems).toEqual([]);
  });
});
