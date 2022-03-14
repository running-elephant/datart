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

import { ChartConfig, ChartStyleConfig } from 'app/types/ChartConfig';
import { ChartConfigDTO, ChartDetailConfigDTO } from 'app/types/ChartConfigDTO';
import { ChartDTO } from 'app/types/ChartDTO';
import {
  mergeChartDataConfigs,
  mergeChartStyleConfigs,
  transformMeta,
} from 'app/utils/internalChartHelper';
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

export function buildUpdateChartRequest({
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
  const chartConfigValueModel = extractChartConfigValueModel(chartConfig);
  const stringifyConfig = JSON.stringify({
    aggregation: aggregation,
    chartConfig: chartConfigValueModel,
    chartGraphId: graphId,
    computedFields: computedFields || [],
  });

  return {
    id: chartId,
    index: index,
    parent: parentId,
    name: name,
    viewId: viewId,
    config: stringifyConfig,
    permissions: [],
    avatar: graphId,
  };
}

export function extractChartConfigValueModel(
  config: ChartConfig,
): ChartConfigDTO {
  return {
    datas: config?.datas,
    styles: getStyleValueModel(config?.styles),
    settings: getStyleValueModel(config?.settings),
  };
}

function getStyleValueModel(styles?: ChartStyleConfig[]) {
  return (styles || []).map(s => {
    return {
      label: s.label,
      key: s.key,
      value: s.value,
      comType: s.comType,
      rows: s.template ? s.rows : getStyleValueModel(s.rows),
    };
  });
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

export function convertToChartConfigDTO(
  source?: ChartDetailConfigDTO,
): ChartConfigDTO {
  return {
    datas: source?.chartConfig?.datas,
    styles: source?.chartConfig?.styles,
    settings: source?.chartConfig?.settings,
  };
}
