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
import ChartDataSetDTO from 'app/types/ChartDataSet';
import {
  getColumnRenderName,
  getStyles,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import ReactChart from '../models/ReactChart';
import { getConditionalStyle } from './conditionalStyle';
import Config from './config';
import ScorecardAdapter from './ScorecardAdapter';

class Scorecard extends ReactChart {
  isISOContainer = 'react-scorecard';
  config = Config;
  protected isAutoMerge = false;
  useIFrame = false;

  constructor(props?) {
    super(ScorecardAdapter, {
      id: props?.id || 'react-scorecard',
      name: props?.name || 'viz.palette.graph.names.scoreChart',
      icon: props?.icon || 'fanpaiqi',
    });
    this.meta.requirements = props?.requirements || [
      {
        group: 0,
        aggregate: 1,
      },
    ];
  }

  onMount(options, context): void {
    if (options.containerId === undefined || !context.document) {
      return;
    }
    this.adapter?.mounted(
      context.document.getElementById(options.containerId),
      options,
      context,
    );
  }

  onUpdated(options, context): void {
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
    this.onUpdated(opt, context);
  }

  getOptions(context, dataset: ChartDataSetDTO, config: ChartConfig) {
    const styleConfigs = config.styles || [];
    const dataConfigs = config.datas || [];
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );
    const { padding, width } = this.getPaddingConfig(
      styleConfigs,
      context.width,
    );
    const fontSizeFn = this.getFontSize(width, styleConfigs);
    const aggColorConfig = this.getColorConfig(
      styleConfigs,
      aggregateConfigs,
      chartDataSet,
    );
    const labelConfig = this.getLabelConfig(
      aggColorConfig,
      styleConfigs,
      fontSizeFn,
    );
    const dataConfig = this.getDataConfig(
      aggColorConfig,
      styleConfigs,
      fontSizeFn,
    );
    const data = [
      {
        label: getColumnRenderName(aggregateConfigs[0]),
        value: toFormattedValue(
          chartDataSet?.[0]?.getCell?.(aggregateConfigs[0]),
          aggregateConfigs[0]?.format,
        ),
      },
    ];
    return {
      context: {
        width: context.width,
        height: context.height,
      },
      dataConfig,
      labelConfig,
      padding,
      data,
      background: aggColorConfig?.[0]?.backgroundColor || 'transparent',
    };
  }

  getColorConfig(style, aggConfig, chartDataSet) {
    const [conditionalStylePanel] = getStyles(
      style,
      ['scorecardConditionalStyle', 'modal'],
      ['conditionalStylePanel'],
    );
    return aggConfig.map(ac =>
      getConditionalStyle(
        chartDataSet?.[0]?.getCell?.(ac),
        conditionalStylePanel,
        ac.uid,
      ),
    );
  }

  getDataConfig(aggColorConfig, style, fontSizeFn) {
    const [font] = getStyles(style, ['data'], ['font']);
    return [
      {
        font: {
          fontSize: fontSizeFn(['data']),
          ...font,
          color: aggColorConfig?.[0]?.color || font.color,
        },
      },
    ];
  }

  getFontSize(width, style) {
    return path => {
      const [useAutoFontSize, autoCoefficient, fixedFontSize] = getStyles(
        style,
        path,
        ['useAutoFontSize', 'autoCoefficient', 'fixedFontSize'],
      );
      if (useAutoFontSize) {
        return Math.floor(width / (33 - autoCoefficient)) + 'px';
      }
      return fixedFontSize + 'px';
    };
  }

  getLabelConfig(aggColorConfig, style, fontSizeFn) {
    const [show, font, position, alignment] = getStyles(
      style,
      ['label'],
      ['show', 'font', 'position', 'alignment'],
    );
    return {
      show,
      font: {
        fontSize: fontSizeFn(['label']),
        ...font,
        color: aggColorConfig?.[0]?.color || font.color,
      },
      position,
      alignment,
    };
  }

  getPaddingConfig(style, contextWidth) {
    const getPaddingNum = value => {
      if (!value || isNaN(parseFloat(value))) {
        return 0;
      }
      if (/%$/g.test(value)) {
        return Math.ceil((parseFloat(value) * contextWidth) / 100);
      }
      return parseFloat(value);
    };
    const initPaddingNum = value => {
      if (!value || isNaN(parseFloat(value))) {
        return 0;
      }
      if (/%$/g.test(value)) {
        return value;
      }
      return value + 'px';
    };
    const [left, right, top, bottom] = getStyles(
      style,
      ['margin'],
      ['marginLeft', 'marginRight', 'marginTop', 'marginBottom'],
    );
    return {
      padding: `${initPaddingNum(top)} ${initPaddingNum(
        right,
      )} ${initPaddingNum(bottom)} ${initPaddingNum(left)}`,
      width: Math.floor(
        contextWidth - getPaddingNum(left) - getPaddingNum(right),
      ),
    };
  }
}

export default Scorecard;
