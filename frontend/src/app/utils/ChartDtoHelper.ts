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
import { ChartConfigDTO, ChartDetailConfigDTO } from 'app/types/ChartConfigDTO';
import { ChartDTO } from 'app/types/ChartDTO';
import {
  mergeChartDataConfigs,
  mergeChartStyleConfigs,
  transformMeta,
} from 'app/utils/chartHelper';
import { Omit } from 'utils/object';

export function convertToChartDTO(data): ChartDTO {
  return Object.assign({}, data, {
    config: JSON.parse(data?.config),
    view: {
      ...Omit(data?.view, ['model']),
      meta: transformMeta(data?.view?.model),
    },
  });
}

export function getUpdateChartDTO({
  chartId,
  aggregation,
  chartConfig,
  graphId,
  index,
  parentId,
  name,
  viewId,
  computedFields,
}) {
  const chartConfigDtoValueModel = extractChartConfigValueModel(chartConfig);
  const stringChartConfig = JSON.stringify({
    aggregation: aggregation,
    chartConfig: chartConfigDtoValueModel,
    chartGraphId: graphId,
    computedFields: computedFields || [],
  });

  return {
    id: chartId,
    index: index,
    parent: parentId,
    name: name,
    viewId: viewId,
    config: stringChartConfig,
    permissions: [],
  };
}

export function extractChartConfigValueModel(
  config: ChartConfig,
): ChartConfigDTO {
  return {
    datas: [], // TODO(Stephen): tobe finish
    styles: [],
    settings: [],
  };
}

export function mergeToChartConfig(
  target?: ChartConfig,
  source?: ChartDetailConfigDTO,
): ChartConfig {
  if (!target) {
    return source! as any;
  }
  if (!source) {
    return target;
  }
  target.datas = mergeChartDataConfigs(
    target?.datas,
    source?.chartConfig?.datas,
  );
  target.styles = mergeChartStyleConfigs(
    target?.styles,
    source?.chartConfig?.styles,
  );
  target.settings = mergeChartStyleConfigs(
    target?.settings,
    source?.chartConfig?.settings,
  );
  return target;
}
