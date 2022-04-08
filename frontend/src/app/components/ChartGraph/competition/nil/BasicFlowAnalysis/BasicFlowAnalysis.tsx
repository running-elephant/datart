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
  transformToDataSet,
} from 'app/utils/chartHelper';
import ReactChart from '../../../models/ReactChart';
import BasicFlowAnalysisWrapper from './BasicFlowAnalysisWrapper';
import Config from './config';

class BasicFlowAnalysis extends ReactChart {
  useIFrame = false;
  isISOContainer = 'flow-analysis';
  config = Config;
  chart: any = null;
  updateOptions: any = {};

  constructor(props?) {
    super(BasicFlowAnalysisWrapper, {
      id: props?.id || 'flow-analysis',
      name: props?.name || 'viz.palette.graph.names.workflow',
      icon: props?.icon || 'workflow',
    });
    this.meta.requirements = props?.requirements || [
      {
        group: 1,
        source: 1,
        target: 1,
        aggregate: [1, 999],
      },
    ];
  }

  onUpdated(options, context): void {
    if (!this.isMatchRequirement(options.config)) {
      this.adapter?.unmount();
      return;
    }
    this.updateOptions = this.getOptions(
      context,
      options.dataset,
      options.config,
    );
    this.adapter?.updated(this.updateOptions);
  }

  onResize(opt: any, context): void {
    if (this.updateOptions?.options) {
      this.updateOptions.options = Object.assign(
        {
          ...this.updateOptions.options,
        },
        { width: context.width, height: context.height },
      );
      this.adapter?.updated(this.updateOptions);
    }
  }

  getOptions(context, dataset: ChartDataSetDTO, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const settingConfigs = config.settings;
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'dimension')
      .flatMap(config => config.rows || []);
    const sourceConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'source')
      .flatMap(config => config.rows || []);
    const targetConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.GROUP)
      .filter(c => c.key === 'target')
      .flatMap(config => config.rows || []);
    const aggregateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.AGGREGATE)
      .flatMap(config => config.rows || []);
    const colorConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.COLOR)
      .flatMap(config => config.rows || []);
    const infoConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.INFO)
      .flatMap(config => config.rows || []);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    const nodes = chartDataSet?.map(row => ({
      id: sourceConfigs.map(config => row.getCell(config))?.[0],
      value: {
        title: groupConfigs.map(config => row.getCell(config))?.[0],
        items: aggregateConfigs.map(config => ({
          text: getColumnRenderName(config),
          value: String(row.getCell(config)),
        })),
      },
    }));

    const edges = chartDataSet
      ?.sort(
        (a, b) =>
          Number(a.getCell(sourceConfigs[0])) -
          Number(b.getCell(sourceConfigs[0])),
      )
      .map(row => {
        const [source, target] = [
          sourceConfigs.map(config => row.getCell(config))?.[0],
          targetConfigs.map(config => row.getCell(config))?.[0],
        ].sort((a, b) => Number(a) - Number(b));
        return {
          source: source,
          target: target,
        };
      });

    const data = {
      nodes: [...nodes],
      edges: [...edges],
    };
    return {
      options: {
        data,
        nodeCfg: this.getNodeCfg(styleConfigs, chartDataSet, targetConfigs),
        edgeCfg: this.getEdgeCfg(styleConfigs),
        layout: this.getLayoutCfg(styleConfigs),
        markerCfg: this.getMarkerCfg(styleConfigs, data),
        behaviors: this.getBehaviors(styleConfigs),
      },
      width: context.width,
      height: context.height,
    };
  }

  private getBehaviors(styleCfg) {
    const [drag, scroll, zoom] = getStyles(
      styleCfg,
      ['layout'],
      ['drag', 'scroll', 'zoom'],
    );

    let defaultValue = ['drag-node'];

    if (drag) {
      defaultValue.push('drag-canvas');
    }
    if (scroll) {
      defaultValue.push('scroll-canvas');
    }
    if (zoom) {
      defaultValue.push('zoom-canvas');
    }

    return defaultValue;
  }

  private getMarkerCfg(styleCfg, data) {
    const [position] = getStyles(styleCfg, ['badge'], ['position']);
    let markerPostion = 'bottom';
    switch (position) {
      case 'left':
        markerPostion = 'right';
        break;
      case 'bottom':
        markerPostion = 'top';
        break;
      case 'right':
        markerPostion = 'left';
        break;
    }

    return cfg => {
      const { edges } = data;
      return {
        position: markerPostion,
        show: edges.find(item => item.source === cfg.id),
        collapsed: !edges.find(item => item.source === cfg.id),
      };
    };
  }

  private getLayoutCfg(styleCfg) {
    const [rankdir] = getStyles(styleCfg, ['layout'], ['rankdir']);

    return {
      rankdir,
    };
  }

  private getEdgeCfg(styleCfg) {
    const [stroke] = getStyles(styleCfg, ['edge'], ['stroke']);

    return {
      label: {
        style: {
          fill: '#aaa',
          fontSize: 12,
          fillOpacity: 1,
        },
      },
      style: edge => {
        return {
          stroke,
          lineWidth: Math.random() * 10 + 1,
          strokeOpacity: 0.5,
        };
      },
      edgeStateStyles: {
        hover: {
          strokeOpacity: 1,
        },
      },
    };
  }

  private getNodeCfg(styleCfg, dataSet, targetCfg) {
    const ids = dataSet?.map(
      row => targetCfg.map(cfg => row.getCell(cfg))?.[0],
    );

    const [nodeFill, stroke, redius] = getStyles(
      styleCfg,
      ['style'],
      ['fill', 'stroke', 'redius'],
    );

    const [width, height] = getStyles(styleCfg, ['size'], ['width', 'height']);

    const [fill, position] = getStyles(
      styleCfg,
      ['badge'],
      ['fill', 'position'],
    );
    let badgeRadius = [redius, 0, 0, redius];
    switch (position) {
      case 'top':
        badgeRadius = [redius, redius, 0, 0];
        break;
      case 'bottom':
        badgeRadius = [0, 0, redius, redius];
        break;
      case 'right':
        badgeRadius = [0, redius, redius, 0];
        break;
    }

    const [style, titleFill] = getStyles(
      styleCfg,
      ['title'],
      ['style', 'fill'],
    );

    const [text, value, itemFill] = getStyles(
      styleCfg,
      ['item'],
      ['text', 'value', 'fill'],
    );

    return {
      size: [width, height],
      badge: {
        position,
        style: cfg => {
          // const fill = ids.includes(cfg.id) ? '#c86bdd' : '#5ae859';
          return {
            fill,
            radius: badgeRadius,
          };
        },
      },
      items: {
        containerStyle: {
          fill: itemFill || '#ffffff',
        },
        padding: 6,
        style: (cfg, group, type) => {
          const styles = {
            icon: {
              width: 12,
              height: 12,
            },
            value: {
              fill: value?.color || '#F00',
              ...value,
            },
            text: {
              fill: text?.color || '#aaa',
              ...text,
            },
          };
          return styles[type];
        },
      },
      nodeStateStyles: {
        hover: {
          stroke: '#1890ff',
          lineWidth: 2,
        },
      },
      title: {
        containerStyle: {
          fill: titleFill || 'transparent',
          radius: [redius, redius, 0, 0],
        },
        style: {
          fill: style?.color || '#000',
          ...style,
        },
      },
      style: {
        fill: nodeFill || '#E6EAF1',
        stroke: stroke || '#B2BED5',
        radius: [redius, redius, redius, redius],
      },
      // anchorPoints: [[0.5, 0], [0.5, 1]],
    };
  }
}

export default BasicFlowAnalysis;
