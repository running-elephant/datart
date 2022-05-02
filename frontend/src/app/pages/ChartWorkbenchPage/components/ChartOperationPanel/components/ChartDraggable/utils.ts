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

import { ChartDataConfig, ChartDataSectionField } from 'app/types/ChartConfig';
import { updateBy } from 'app/utils/mutation';

export const updateDataConfigByField = (
  uid: string,
  config: ChartDataConfig,
  field: ChartDataSectionField,
  replacedConfig?: ChartDataSectionField,
): ChartDataConfig => {
  return updateBy(config, draft => {
    draft.rows = (draft.rows || []).map(r => {
      if (r.uid === uid) {
        return field;
      }
      return r;
    });
    if (replacedConfig) {
      draft.replacedConfig = replacedConfig;
    }
    return draft;
  });
};
