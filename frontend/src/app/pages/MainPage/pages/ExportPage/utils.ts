import { request2 } from 'utils/request';

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
export async function onExport(idList) {
  try {
    const response = await request2<any>({
      method: 'POST',
      url: `viz/export`,
      data: {
        resources: idList,
      },
    });
    return true;
  } catch (error) {
    return error;
  }
}
