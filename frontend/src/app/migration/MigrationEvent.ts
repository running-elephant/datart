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

import { APP_VERSION_INIT } from './constants';
import { IDomainEvent, Task } from './types';

/**
 * Migrtion Event
 * @class MigrationTaskEvent
 * @template TDomainModel
 */
class MigrationEvent<TDomainModel extends { version?: string }>
  implements IDomainEvent<TDomainModel>
{
  version: string = APP_VERSION_INIT;
  task?: Task<TDomainModel>;

  constructor(version: string, task: Task<TDomainModel>) {
    this.version = version;
    this.task = task;
  }

  public run(model?: TDomainModel) {
    if (!this.task) {
      throw new Error('Please register migration task function first!');
    }

    try {
      const result = this.task.call(Object.create(null), model);
      if (!!result) {
        // auto update version when on error occur
        result.version = this.version;
      }
      return result;
    } catch (error) {
      // TODO(Stephen): beautiful console format
      console.error(
        'Migration Event Error | Version: %s | Stack Trace: %o',
        this.version,
        error,
      );
      throw error;
    }
  }
}

export default MigrationEvent;
