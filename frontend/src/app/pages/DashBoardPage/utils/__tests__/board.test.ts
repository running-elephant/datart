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

import { Widget } from '../../pages/Board/slice/types';
import { adjustWidgetsBeforeSave } from '../board';

describe('board editor events', () => {
  test('adjustWidgetsBeforeSave', () => {
    const targetVersion = 'test_version';
    const widget1 = {
      config: {},
    } as Widget;
    const widget2 = {
      config: {
        version: 'some',
      },
    } as Widget;
    const tWidget1 = {
      config: {
        version: targetVersion,
      },
    } as Widget;
    const tWidget2 = {
      config: {
        version: targetVersion,
      },
    } as Widget;

    const widgets: Widget[] = [widget1, widget2];
    expect(
      adjustWidgetsBeforeSave(widgets, { version: targetVersion }),
    ).toEqual([tWidget1, tWidget2]);
  });
});
