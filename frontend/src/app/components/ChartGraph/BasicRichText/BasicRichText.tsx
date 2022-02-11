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

import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import {
  getColumnRenderName,
  getStyles,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import ReactChart from '../models/ReactChart';
import ChartRichTextAdapter from './ChartRichTextAdapter';
import Config from './config';

class BasicRichText extends ReactChart {
  useIFrame = false;
  isISOContainer = 'react-rich-text';
  config = Config;
  protected isAutoMerge = false;
  richTextOptions = {
    dataset: {},
    config: {},
    containerId: '',
    widgetSpecialConfig: { env: '' },
  };

  constructor(props?) {
    super(ChartRichTextAdapter, {
      id: props?.id || 'react-rich-text',
      name: props?.name || 'viz.palette.graph.names.richText',
      icon: props?.icon || 'rich-text',
    });
    this.meta.requirements = props?.requirements || [
      {
        group: [0, 999],
        aggregate: [0, 999],
      },
    ];
  }

  onMount(options, context): void {
    if (options.containerId === undefined || !context.document) {
      return;
    }
    this.richTextOptions = Object.assign(this.richTextOptions, options);
    this.adapter?.mounted(
      context.document.getElementById(options.containerId),
      options,
      context,
    );
  }

  onUpdated(options, context): void {
    this.richTextOptions = Object.assign(this.richTextOptions, options);
    if (!this.isMatchRequirement(options.config)) {
      this.adapter?.unmount();
      return;
    }

    this.adapter?.updated(
      this.getOptions(context, options.dataset, options.config),
      context,
    );
  }

  onResize(opt: any, context): void {
    this.onUpdated(this.richTextOptions, context);
  }

  getOptions(context, dataset?: ChartDataSetDTO, config?: ChartConfig) {
    const { containerId, widgetSpecialConfig } = this.richTextOptions;
    if (!dataset || !config || !containerId) {
      return { dataList: [], id: '', isEditing: !!widgetSpecialConfig?.env };
    }
    const dataConfigs = config.datas || [];
    const stylesConfigs = config.styles || [];
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);
    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    const dataList = groupConfigs.concat(aggregateConfigs).map(config => {
      return {
        id: config.uid,
        name: getColumnRenderName(config),
        value: this.getDataListValue(config, chartDataSet),
      };
    });
    const [initContent] = getStyles(stylesConfigs, ['delta'], ['richText']);
    const [openQuillMarkdown] = getStyles(
      stylesConfigs,
      ['richTextMarkdown'],
      ['openQuillMarkdown'],
    );
    return {
      dataList,
      openQuillMarkdown,
      initContent,
      id: containerId,
      isEditing: !!widgetSpecialConfig?.env,
      ...this.getOnChange(),
    };
  }

  getDataListValue(config, chartDataSet: IChartDataSet<string>) {
    const value = chartDataSet.map(dc =>
      toFormattedValue(dc.getCell(config), config.format),
    )[0];
    if (value !== void 0 && value !== null) {
      return typeof value !== 'string' ? value.toString() : value;
    }
    return '';
  }

  getOnChange(): any {
    return this.mouseEvents?.reduce((acc, cur) => {
      if (cur.name === 'click') {
        Object.assign(acc, {
          onChange: delta =>
            cur.callback?.({
              seriesName: 'richText',
              value: delta,
            }),
        });
      }
      return acc;
    }, {});
  }
}

export default BasicRichText;
