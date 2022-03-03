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

import { View } from 'app/types/View';
import { APP_VERSION_BETA_2, APP_VERSION_INIT } from '../constants';
import MigrationEvent from '../MigrationEvent';
import MigrationEventDispatcher from '../MigrationEventDispatcher';

/**
 * Initialize method to setup version used by @see MigrationEvent
 *
 * @param {View} [view]
 * @return {*}  {(View | undefined)}
 */
const init = (view?: View): View | undefined => {
  return view;
};

/**
 * Migrate @see View config in beta.2 version
 * Changes:
 * - migrate model to ...
 * - ....
 *
 * @param {View} [view]
 * @return {*}  {(View | undefined)}
 */
const beta2 = (view?: View): View | undefined => {
  if (true /* beta.2 */) {
    // do something...
    // do something...
    // do something...
    // do something...
    // do something...
  }
  return view;
};

/**
 * main entry point of migration
 *
 * @param {View} model
 * @return {View}
 */
const beginViewModelMigration = (model: View): View => {
  const event0 = new MigrationEvent(APP_VERSION_INIT, init);
  const event2 = new MigrationEvent(APP_VERSION_BETA_2, beta2);
  const dispatcher = new MigrationEventDispatcher(event0, event2);
  return dispatcher.process(model);
};

export default beginViewModelMigration;
