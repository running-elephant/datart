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

import { CloneValueDeep } from 'utils/object';
import { APP_VERSION_BETA_2 } from '../constants';
import MigrationEvent from '../MigrationEvent';
import MigrationEventDispatcher from '../MigrationEventDispatcher';

/**
 * Initialize method to setup version used by @see MigrationEvent
 *
 * @param {object} [model]
 * @return {*}  {(object | undefined)}
 */
const init = (model?: object): object | undefined => {
  return model;
};

/**
 * Migrate @see View config in beta.2 version
 * Changes:
 * - migrate model to ...
 * - ....
 *
 * @param {object} [model]
 * @return {*}  {(object | undefined)}
 */
const beta2 = (model?: object): object | undefined => {
  const clonedModel = CloneValueDeep(model) || {};
  if (model) {
    Object.keys(clonedModel).forEach(name => {
      clonedModel[name] = { ...clonedModel[name], name };
    });
    model = {
      hierarchy: clonedModel,
      columns: clonedModel,
    };
  }
  return model;
};

/**
 * main entry point of migration
 *
 * @param {string} model
 * @return {string}
 */
const beginViewModelMigration = (model: string): string => {
  if (!model?.trim().length) {
    return model;
  }
  const modelObj = JSON.parse(model);
  const event2 = new MigrationEvent(APP_VERSION_BETA_2, beta2);
  const dispatcher = new MigrationEventDispatcher(event2);
  const result = dispatcher.process(modelObj);
  return JSON.stringify(result);
};

export default beginViewModelMigration;
