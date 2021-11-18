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

import { ChartConfig } from 'app/types/ChartConfig';
import { isUndefined } from 'lodash';

export const hasWrongDimensionName = (config?: ChartConfig) => {
  if (!config) {
    return false;
  }
  return Boolean(
    config?.datas?.find(d =>
      ['deminsion', 'deminsionL', 'deminsionR'].includes(d.key),
    ),
  );
};

export function alpha3(config?: ChartConfig): ChartConfig | undefined {
  try {
    if (hasWrongDimensionName(config)) {
      const metricSection = config?.datas?.find(d => d.key === 'metrics');
      if (!isUndefined(metricSection)) {
        metricSection.key = 'dimension';
      }
      const wrongNameOfDimension = config?.datas?.find(
        d => d.key === 'deminsion',
      );
      if (!isUndefined(wrongNameOfDimension)) {
        wrongNameOfDimension!.key = 'metrics';
      }

      const wrongNameOfDimensionL = config?.datas?.find(
        d => d.key === 'deminsionL',
      );
      if (!isUndefined(wrongNameOfDimensionL)) {
        wrongNameOfDimensionL!.key = 'metricsL';
      }

      const wrongNameOfDimensionR = config?.datas?.find(
        d => d.key === 'deminsionR',
      );
      if (!isUndefined(wrongNameOfDimensionR)) {
        wrongNameOfDimensionR!.key = 'metricsR';
      }
    }
  } catch (error) {
    console.error('Chart Migration Errors | alpha3 | ', error);
  }
  return config;
}
