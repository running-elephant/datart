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

import { APP_VERSION_BETA_2 } from '../constants';
import beginViewModelMigration from '../ViewConfig/migrationViewModelConfig';

describe('migrationViewModelConfig Test', () => {
  test('should get latest version after migration', () => {
    const model = JSON.stringify({});
    expect(beginViewModelMigration(model)).toEqual(
      JSON.stringify({
        hierarchy: {},
        columns: {},
        version: APP_VERSION_BETA_2,
      }),
    );
  });

  test('should get latest version even model is empty', () => {
    expect(beginViewModelMigration('')).toEqual('');
  });

  test('should migrate model to nested model object', () => {
    const originalModel = {
      column1: { name: 'column1', role: 'role', type: 'STRING' },
      column2: { name: 'column2', role: 'role', type: 'NUMBER' },
    };
    const migrationResultObj = JSON.parse(
      beginViewModelMigration(JSON.stringify(originalModel)),
    );
    expect(migrationResultObj.columns).toMatchObject(originalModel);
    expect(migrationResultObj.hierarchy).toMatchObject(originalModel);
    expect(migrationResultObj.version).toEqual(APP_VERSION_BETA_2);
  });

  test('should migrate model name to columns', () => {
    const originalModel = {
      column1: { role: 'role', type: 'STRING' },
      column2: { role: 'role', type: 'NUMBER' },
    };
    const migrationResultObj = JSON.parse(
      beginViewModelMigration(JSON.stringify(originalModel)),
    );
    expect(migrationResultObj.columns).toMatchObject({
      column1: { name: 'column1', role: 'role', type: 'STRING' },
      column2: { name: 'column2', role: 'role', type: 'NUMBER' },
    });
    expect(migrationResultObj.hierarchy).toMatchObject({
      column1: { name: 'column1', role: 'role', type: 'STRING' },
      column2: { name: 'column2', role: 'role', type: 'NUMBER' },
    });
    expect(migrationResultObj.version).toEqual(APP_VERSION_BETA_2);
  });
});
