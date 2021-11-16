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

import { isInRange } from '../chartHelper';

describe.each([
  [0, 0, true],
  [0, 1, false],
  [1, 1, true],
  [0, null, true],
  [1, null, true],
  [0, undefined, true],
  [1, undefined, true],
  [0, [1, 999], false],
  [1, [1, 999], true],
  [999, [1, 999], true],
  [1000, [1, 999], false],
  [1, '1', true],
  [0, '1', false],
  [1, '[1, 999]', false],
  [1, ['1', '999'], true],
  [0, ['1', '999'], false],
])('isInRange Test - ', (count, limit, ifInRange) => {
  test(`length ${count} in ${limit} limit is ${ifInRange}`, () => {
    expect(isInRange(limit, count)).toBe(ifInRange);
  });
});
