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

import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import {
  getDefaultThemeColor,
  getStyleValueByGroup,
  getValueByColumnKey,
  transfromToObjectArray,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import 'echarts-wordcloud';
import Config from './config';

// NOTE: wordcloud chart is echarts extension, more detail please check https://github.com/ecomfe/echarts-wordcloud
class WordCloudChart extends Chart {
  chart: any = null;
  config = Config;
  dependency = [];

  constructor(props?) {
    super(
      props?.id || 'word-cloud',
      props?.name || '词云',
      props?.icon || 'fsux_tubiao_ciyun',
    );
    this.meta.requirements = props?.requirements || [
      {
        group: 1,
        aggregate: 1,
      },
    ];
  }

  onMount(options, context): void {
    if (options.containerId === undefined || !context.document) {
      return;
    }

    this.chart = init(
      context.document.getElementById(options.containerId),
      'default',
    );
    this._mouseEvents?.forEach(event => {
      this.chart.on(event.name, event.callback);
    });
  }

  onUpdated(props): void {
    if (!props.dataset || !props.dataset.columns || !props.config) {
      return;
    }
    if (!this.isMatchRequirement(props.config)) {
      this.chart?.clear();
      return;
    }
    const newOptions = this.getOptions(props.dataset, props.config);
    this.chart?.setOption(Object.assign({}, newOptions), true);
  }

  onUnMount(): void {
    this.chart?.dispose();
  }

  onResize(opt: any, context): void {
    this.chart?.resize(context);
  }

  getOptions(dataset: ChartDataset, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);

    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );
    const wordCloud = this.getWordCloud(styleConfigs);
    const laber = this.getLaber(styleConfigs);
    return {
      series: [
        {
          type: 'wordCloud',
          layoutAnimation: true,
          ...wordCloud,
          ...laber,
          data: objDataColumns.map(dc => {
            return {
              name: dc[groupConfigs[0].colName],
              value: dc[getValueByColumnKey(aggregateConfigs[0])],
            };
          }),
        },
      ],
    };
  }
  getWordCloud(style) {
    const [drawOutOfBound, shape, width, height] = this.getArrStyleValueByGroup(
      ['drawOutOfBound', 'shape', 'width', 'height'],
      style,
      'wordCloud',
    );
    const [left, top] = this.getArrStyleValueByGroup(
      ['marginLeft', 'marginTop'],
      style,
      'margin',
    );
    return {
      drawOutOfBound: !drawOutOfBound,
      shape,
      width,
      height,
      left,
      top,
      right: 'auto',
      bottom: 'auto',
    };
  }

  getLaber(style) {
    const [
      fontFamily,
      fontWeight,
      maxFontSize,
      minFontSize,
      rotationRangeStart,
      rotationRangeEnd,
      rotationStep,
      gridSize,
      focus,
      textShadowBlur,
      textShadowColor,
    ] = this.getArrStyleValueByGroup(
      [
        'fontFamily',
        'fontWeight',
        'maxFontSize',
        'minFontSize',
        'rotationRangeStart',
        'rotationRangeEnd',
        'rotationStep',
        'gridSize',
        'focus',
        'textShadowBlur',
        'textShadowColor',
      ],
      style,
      'label',
    );
    return {
      sizeRange: [minFontSize, maxFontSize],
      rotationRange: [rotationRangeStart, rotationRangeEnd],
      rotationStep,
      gridSize,
      textStyle: {
        fontFamily,
        fontWeight,
        color: function (value) {
          const colorArr = getDefaultThemeColor();
          return colorArr[value.dataIndex % (colorArr.length - 1)];
        },
      },
      emphasis: {
        focus: focus ? 'self' : 'none',
        textStyle: {
          textShadowBlur,
          textShadowColor,
        },
      },
    };
  }

  getArrStyleValueByGroup(childPathList, style, groupPath) {
    return childPathList.map(child => {
      return getStyleValueByGroup(style, groupPath, child);
    });
  }
}

export default WordCloudChart;
