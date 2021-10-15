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
import Config from './config';

class AntVG6TreeChart extends Chart {
  constructor() {
    super('antv-g6-chart', 'AntV G6 Chart');
  }
  isISOContainer = 'antv-g6-container';
  config = Config;
  dependency = [
    'https://gw.alipayobjects.com/os/antv/pkg/_antv.g6-3.7.1/dist/g6.min.js',
  ];
  data = {
    id: 'Modeling Methods',
    children: [
      {
        id: 'Classification',
        children: [
          {
            id: 'Logistic regression',
          },
          {
            id: 'Linear discriminant analysis',
          },
          {
            id: 'Rules',
          },
          {
            id: 'Decision trees',
          },
          {
            id: 'Naive Bayes',
          },
          {
            id: 'K nearest neighbor',
          },
          {
            id: 'Probabilistic neural network',
          },
          {
            id: 'Support vector machine',
          },
        ],
      },
      {
        id: 'Consensus',
        children: [
          {
            id: 'Models diversity',
            children: [
              {
                id: 'Different initializations',
              },
              {
                id: 'Different parameter choices',
              },
              {
                id: 'Different architectures',
              },
              {
                id: 'Different modeling methods',
              },
              {
                id: 'Different training sets',
              },
              {
                id: 'Different feature sets',
              },
            ],
          },
          {
            id: 'Methods',
            children: [
              {
                id: 'Classifier selection',
              },
              {
                id: 'Classifier fusion',
              },
            ],
          },
          {
            id: 'Common',
            children: [
              {
                id: 'Bagging',
              },
              {
                id: 'Boosting',
              },
              {
                id: 'AdaBoost',
              },
            ],
          },
        ],
      },
      {
        id: 'Regression',
        children: [
          {
            id: 'Multiple linear regression',
          },
          {
            id: 'Partial least squares',
          },
          {
            id: 'Multi-layer feedforward neural network',
          },
          {
            id: 'General regression neural network',
          },
          {
            id: 'Support vector regression',
          },
        ],
      },
    ],
  };

  onMount(options, context): void {
    const G6 = context.window.G6;
    fetch(
      'https://gw.alipayobjects.com/os/antvdemo/assets/data/algorithm-category.json',
    )
      .then(res => res.json())
      .then(data => {
        const container = context.document.getElementById(options.containerId);
        const width = container.scrollWidth;
        const height = container.scrollHeight || 500;
        const graph = new G6.TreeGraph({
          container: options.containerId,
          width,
          height,
          modes: {
            default: [
              {
                type: 'collapse-expand',
                onChange: function onChange(item, collapsed) {
                  const data = item.getModel();
                  data.collapsed = collapsed;
                  return true;
                },
              },
              'drag-canvas',
              'zoom-canvas',
            ],
          },
          defaultNode: {
            size: 26,
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
            ],
          },
          defaultEdge: {
            type: 'cubic-horizontal',
          },
          layout: {
            type: 'compactBox',
            direction: 'LR',
            getId: function getId(d) {
              return d.id;
            },
            getHeight: function getHeight() {
              return 16;
            },
            getWidth: function getWidth() {
              return 16;
            },
            getVGap: function getVGap() {
              return 10;
            },
            getHGap: function getHGap() {
              return 100;
            },
          },
        });

        graph.node(function (node) {
          return {
            label: node.id,
            labelCfg: {
              offset: 10,
              position:
                node.children && node.children.length > 0 ? 'left' : 'right',
            },
          };
        });

        graph.data(data);
        graph.render();
        graph.fitView();

        if (typeof context.window !== 'undefined')
          context.window.onresize = () => {
            if (!graph || graph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight)
              return;
            graph.changeSize(container.scrollWidth, container.scrollHeight);
          };
      });
  }

  onUpdated({ config }: { config: any }): void {}

  onUnMount(): void {}
}

export default AntVG6TreeChart;
