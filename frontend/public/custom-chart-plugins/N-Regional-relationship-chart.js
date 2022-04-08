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

function PlaneLineChart({ dHelper }) {
  const svgIcon = `<svg t="1639279486808" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4028" width="16" height="16"><path d="M25.6 537.1392a25.6 25.6 0 1 1 0-51.2h141.1072a25.6 25.6 0 0 0 24.5248-18.2272l118.1184-393.7792a51.2 51.2 0 0 1 98.0992 0L665.6 934.4l118.1184-393.728a76.8 76.8 0 0 1 73.5744-54.784H998.4a25.6 25.6 0 1 1 0 51.2h-141.1072a25.6 25.6 0 0 0-24.5248 18.2272l-118.1184 393.7792a51.2 51.2 0 0 1-98.0992 0L358.4 88.6272 240.2816 482.4064a76.8 76.8 0 0 1-73.5744 54.784H25.6z"  p-id="4029"></path></svg>`;

  return {
    config: {
      datas: [
        {
          label: 'dimension',
          key: 'dimension',
          required: true,
          type: 'group',
        },
        {
          label: 'metrics',
          key: 'metrics',
          required: true,
          type: 'aggregate',
        },
        {
          label: 'filter',
          key: 'filter',
          type: 'filter',
          allowSameField: true,
        },
      ],
      styles: [
        {
          label: 'graph.title',
          key: 'graph',
          comType: 'group',
          rows: [
            {
              label: 'graph.smooth',
              key: 'smooth',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'graph.step',
              key: 'step',
              default: false,
              comType: 'checkbox',
            },
          ],
        },
        {
          label: 'label.title',
          key: 'label',
          comType: 'group',
          rows: [
            {
              label: 'label.showLabel',
              key: 'showLabel',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'label.position',
              key: 'position',
              comType: 'select',
              default: 'top',
              options: {
                items: [
                  { label: '上', value: 'top' },
                  { label: '左', value: 'left' },
                  { label: '右', value: 'right' },
                  { label: '下', value: 'bottom' },
                  { label: '内', value: 'inside' },
                  { label: '内左', value: 'insideLeft' },
                  { label: '内右', value: 'insideRight' },
                  { label: '内上', value: 'insideTop' },
                  { label: '内下', value: 'insideBottom' },
                  { label: '内左上', value: 'insideTopLeft' },
                  { label: '内左下', value: 'insideBottomLeft' },
                  { label: '内右上', value: 'insideTopRight' },
                  { label: '内右下', value: 'insideBottomRight' },
                ],
              },
            },

            {
              label: 'viz.palette.style.font',
              key: 'font',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '12',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: 'black',
              },
            },
          ],
        },
        {
          label: 'legend.title',
          key: 'legend',
          comType: 'group',
          rows: [
            {
              label: 'legend.showLegend',
              key: 'showLegend',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'legend.type',
              key: 'type',
              comType: 'legendType',
              default: 'scroll',
            },
            {
              label: 'legend.selectAll',
              key: 'selectAll',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'legend.position',
              key: 'position',
              comType: 'select',
              default: 'right',
              options: {
                items: [
                  { label: '右', value: 'right' },
                  { label: '上', value: 'top' },
                  { label: '下', value: 'bottom' },
                  { label: '左', value: 'left' },
                ],
              },
            },
            {
              label: 'viz.palette.style.font',
              key: 'font',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '12',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: 'black',
              },
            },
          ],
        },
        {
          label: 'xAxis.title',
          key: 'xAxis',
          comType: 'group',
          rows: [
            {
              label: 'common.showAxis',
              key: 'showAxis',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.inverseAxis',
              key: 'inverseAxis',
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'lineStyle',
              comType: 'line',
              default: {
                type: 'dashed',
                width: 1,
                color: 'black',
              },
            },
            {
              label: 'common.showLabel',
              key: 'showLabel',
              default: true,
              comType: 'checkbox',
              options: [],
            },
            {
              label: 'viz.palette.style.font',
              key: 'font',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '12',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: 'black',
              },
            },
            {
              label: 'common.rotate',
              key: 'rotate',
              default: 0,
              comType: 'inputNumber',
            },
            {
              label: 'common.showInterval',
              key: 'showInterval',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'common.interval',
              key: 'interval',
              default: 0,
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'yAxis.title',
          key: 'yAxis',
          comType: 'group',
          rows: [
            {
              label: 'common.showAxis',
              key: 'showAxis',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.inverseAxis',
              key: 'inverseAxis',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'lineStyle',
              comType: 'line',
              default: {
                type: 'dashed',
                width: 1,
                color: 'black',
              },
            },
            {
              label: 'common.showLabel',
              key: 'showLabel',
              default: true,
              comType: 'checkbox',
              options: [],
            },
            {
              label: 'viz.palette.style.font',
              key: 'font',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '12',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: 'black',
              },
            },
            {
              label: 'common.showTitleAndUnit',
              key: 'showTitleAndUnit',
              default: true,
              comType: 'checkbox',
              options: [],
            },
            {
              label: 'common.unitFont',
              key: 'unitFont',
              comType: 'font',
              default: {
                fontFamily: 'PingFang SC',
                fontSize: '12',
                fontWeight: 'normal',
                fontStyle: 'normal',
                color: 'black',
              },
            },
            {
              label: 'common.nameLocation',
              key: 'nameLocation',
              default: 'center',
              comType: 'nameLocation',
            },
            {
              label: 'common.nameRotate',
              key: 'nameRotate',
              default: 90,
              comType: 'inputNumber',
            },
            {
              label: 'common.nameGap',
              key: 'nameGap',
              default: 60,
              comType: 'inputNumber',
            },
            {
              label: 'common.min',
              key: 'min',
              comType: 'inputNumber',
            },
            {
              label: 'common.max',
              key: 'max',
              comType: 'inputNumber',
            },
          ],
        },
        {
          label: 'splitLine.title',
          key: 'splitLine',
          comType: 'group',
          rows: [
            {
              label: 'splitLine.showHorizonLine',
              key: 'showHorizonLine',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'horizonLineStyle',
              comType: 'line',
              default: {
                type: 'dashed',
                width: 1,
                color: 'grey',
              },
            },
            {
              label: 'splitLine.showVerticalLine',
              key: 'showVerticalLine',
              default: false,
              comType: 'checkbox',
            },
            {
              label: 'common.lineStyle',
              key: 'verticalLineStyle',
              comType: 'line',
              default: {
                type: 'dashed',
                width: 1,
                color: 'grey',
              },
            },
          ],
        },
        {
          label: 'viz.palette.style.margin.title',
          key: 'margin',
          comType: 'group',
          rows: [
            {
              label: 'viz.palette.style.margin.containLabel',
              key: 'containLabel',
              default: true,
              comType: 'checkbox',
            },
            {
              label: 'viz.palette.style.margin.left',
              key: 'marginLeft',
              default: '5%',
              comType: 'marginWidth',
            },
            {
              label: 'viz.palette.style.margin.right',
              key: 'marginRight',
              default: '5%',
              comType: 'marginWidth',
            },
            {
              label: 'viz.palette.style.margin.top',
              key: 'marginTop',
              default: '5%',
              comType: 'marginWidth',
            },
            {
              label: 'viz.palette.style.margin.bottom',
              key: 'marginBottom',
              default: '5%',
              comType: 'marginWidth',
            },
          ],
        },
      ],
      settings: [
        {
          label: 'viz.palette.setting.paging.title',
          key: 'paging',
          comType: 'group',
          rows: [
            {
              label: 'viz.palette.setting.paging.pageSize',
              key: 'pageSize',
              default: 1000,
              comType: 'inputNumber',
              options: {
                needRefresh: true,
                step: 1,
                min: 0,
              },
            },
          ],
        },
      ],
      i18ns: [
        {
          lang: 'zh-CN',
          translation: {
            chartName: '[Experiment] 飞行线路图',
            common: {
              showAxis: '显示坐标轴',
              inverseAxis: '反转坐标轴',
              lineStyle: '线条样式',
              borderType: '边框线条类型',
              borderWidth: '边框线条宽度',
              borderColor: '边框线条颜色',
              backgroundColor: '背景颜色',
              showLabel: '显示标签',
              unitFont: '刻度字体',
              rotate: '旋转角度',
              position: '位置',
              showInterval: '显示刻度',
              interval: '刻度间隔',
              showTitleAndUnit: '显示标题和刻度',
              nameLocation: '标题位置',
              nameRotate: '标题旋转',
              nameGap: '标题与轴线距离',
              min: '最小值',
              max: '最大值',
            },
            label: {
              title: '标签',
              showLabel: '显示标签',
              position: '位置',
            },
            legend: {
              title: '图例',
              showLegend: '显示图例',
              type: '图例类型',
              selectAll: '图例全选',
              position: '图例位置',
            },
            data: {
              color: '颜色',
              colorize: '配色',
            },
            graph: {
              title: '折线图',
              smooth: '平滑',
              step: '阶梯',
            },
            xAxis: {
              title: 'X轴',
            },
            yAxis: {
              title: 'Y轴',
            },
            splitLine: {
              title: '分割线',
              showHorizonLine: '显示横向分割线',
              showVerticalLine: '显示纵向分割线',
            },
            reference: {
              title: '参考线',
              open: '点击参考线配置',
            },
          },
        },
        {
          lang: 'en-US',
          translation: {
            chartName: '[Experiment] Custom Line Chart',
            common: {
              showAxis: 'Show Axis',
              inverseAxis: 'Inverse Axis',
              lineStyle: 'Line Style',
              borderType: 'Border Type',
              borderWidth: 'Border Width',
              borderColor: 'Border Color',
              backgroundColor: 'Background Color',
              showLabel: 'Show Label',
              unitFont: 'Unit Font',
              rotate: 'Rotate',
              position: 'Position',
              showInterval: 'Show Interval',
              interval: 'Interval',
              showTitleAndUnit: 'Show Title and Unit',
              nameLocation: 'Name Location',
              nameRotate: 'Name Rotate',
              nameGap: 'Name Gap',
              min: 'Min',
              max: 'Max',
            },
            label: {
              title: 'Label',
              showLabel: 'Show Label',
              position: 'Position',
            },
            legend: {
              title: 'Legend',
              showLegend: 'Show Legend',
              type: 'Type',
              selectAll: 'Select All',
              position: 'Position',
            },
            data: {
              color: 'Color',
              colorize: 'Colorize',
            },
            graph: {
              title: 'Graph',
              smooth: 'Smooth',
              step: 'Step',
            },
            xAxis: {
              title: 'X Axis',
            },
            yAxis: {
              title: 'Y Axis',
            },
            splitLine: {
              title: 'Split Line',
              showHorizonLine: 'Show Horizontal Line',
              showVerticalLine: 'Show Vertical Line',
            },
            reference: {
              title: 'Reference',
              open: 'Open',
            },
          },
        },
      ],
    },
    isISOContainer: 'demo-customize-line-chart',
    dependency: ['https://unpkg.com/@antv/l7'],
    meta: {
      id: 'Regional-relationship-chart',
      name: 'chartName',
      icon: svgIcon,
      requirements: [
        {
          group: 1,
          aggregate: [1, 999],
        },
      ],
    },

    onMount(options, context) {
      const { Scene, LineLayer, PointLayer, PolygonLayer, GaodeMap } =
        context.window.L7;

      const scene = new Scene({
        // id: 'map',
        id: options.containerId,
        map: new GaodeMap({
          center: [110, 36],
          zoom: 3,
          style: 'dark',
        }),
      });

      scene.on('loaded', () => {
        scene.addImage(
          'plane',
          'https://gw.alipayobjects.com/zos/bmw-prod/bea041d7-d6d4-4027-b422-a0bc321fbf14.svg',
        );

        Promise.all([
          fetch(
            'https://gw.alipayobjects.com/os/bmw-prod/2960e1fc-b543-480f-a65e-d14c229dd777.json',
          ).then(d => d.json()),
        ]).then(function onLoad([world]) {
          const worldLine = new LineLayer()
            .source(world)
            .color('rgb(22,119,255)')
            .size(0.5)
            .style({
              opacity: 0.4,
            });
          scene.addLayer(worldLine);

          const worldFill = new PolygonLayer({ blend: 'normal' })
            .source(world)
            .size('name', [0, 10000, 50000, 30000, 100000])
            .color('rgb(22,119,255)')
            .shape('fill')
            .active(true)

            .style({
              opacity: 0.2,
              opacityLinear: {
                enable: true,
                dir: 'out', // in - out
              },
            });
          scene.addLayer(worldFill);

          const jsonLineParserOotion = {
            parser: {
              type: 'json',
              x: 'lng1',
              y: 'lat1',
              x1: 'lng2',
              y1: 'lat2',
            },
          };

          const dotData = getDotData();
          const jsonParserOotion = {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          };

          const dotPoint = new PointLayer({ zIndex: 2 })
            .source(dotData, {
              parser: {
                type: 'json',
                x: 'lng',
                y: 'lat',
              },
            })
            .shape('circle')
            .color('rgb(22,119,255)')
            .animate(true)
            .size(40)
            .style({
              opacity: 1.0,
            });
          scene.addLayer(dotPoint);

          const data = getData();

          const layerPlaneLine = new LineLayer({ blend: 'normal' })
            .source(data, jsonLineParserOotion)
            .size(1)
            .shape('arc')
            //   .color('#87CEFA')
            .color('rgb(22,119,255)')
            .animate({
              interval: 1, // 间隔
              duration: 1, // 持续时间，延时
              trailLength: 2, // 流线长度
            })
            .style({
              opacity: 0.4,
              thetaOffset: 'thetaOffset',
            });
          scene.addLayer(layerPlaneLine);

          removeLogo();
        });
      });

      function removeLogo() {
        const logo = context.document.querySelector('.l7-control');
        if (logo) logo.innerHTML = '';
      }

      function getData() {
        const originData = {
          // BJ -> CQ
          lng1: 116.5883553580003,
          lat1: 40.07680509701226,
          lng2: 106.06201171875,
          lat2: 30.164126343161097,
        };
        const originData2 = {
          // BJ -> HK
          lng1: 116.5883553580003,
          lat1: 40.07680509701226,
          lng2: 114.3072509765625,
          lat2: 22.228090416784486,
        };
        const originData3 = {
          // BJ -> HerBin
          lng1: 116.5883553580003,
          lat1: 40.07680509701226,
          lng2: 126.62841796875,
          lat2: 45.75219336063106,
        };
        const originData4 = {
          // BJ -> Wulumuqi
          lng1: 116.5883553580003,
          lat1: 40.07680509701226,
          lng2: 87.57202148437499,
          lat2: 43.82660134505382,
        };
        const originData5 = {
          // BJ -> 上海
          lng1: 116.5883553580003,
          lat1: 40.07680509701226,
          lng2: 121.26708984374999,
          lat2: 31.259769987394286,
        };

        const originData6 = {
          // BJ -> 西藏
          lng1: 116.5883553580003,
          lat1: 40.07680509701226,
          lng2: 91.13221234242434,
          lat2: 29.66036124234346,
        };

        const originData7 = {
          lng1: 116.5883553580003,
          lat1: 40.07680509701226,
          lng2: 77.4734734374341232,
          lat2: 28.123829473434349,
        };

        const originData8 = {
          lng1: 116.5883553580003,
          lat1: 40.07680509701226,
          lng2: 126.4734734374341232,
          lat2: 37.123829473434349,
        };

        const originData9 = {
          lng1: 116.5883553580003,
          lat1: 40.07680509701226,
          lng2: 139.57202148437499,
          lat2: 35.82660134505382,
        };

        const data = [];

        for (let i = 0; i < 29; i++) {
          data.push({
            thetaOffset: -1 / 2 + i * (1 / 29), // 设置曲线的偏移量
            ...originData, // cq
          });
        }

        for (let i = 0; i < 30; i++) {
          data.push({
            thetaOffset: -1 / 2 + i * (1 / 30), // 设置曲线的偏移量
            ...originData2, // hk
          });
        }

        for (let i = 0; i < 10; i++) {
          data.push({
            thetaOffset: -1 / 2 + i * (1 / 10), // 设置曲线的偏移量
            ...originData3, // HerBin
          });
        }

        for (let i = 0; i < 7; i++) {
          data.push({
            thetaOffset: -1 / 2 + i * (1 / 15), // 设置曲线的偏移量
            ...originData4, // Wulumuqi
          });
        }

        for (let i = 0; i < 90; i++) {
          data.push({
            thetaOffset: -1 / 2 + i * (1 / 90), // 设置曲线的偏移量
            ...originData5, // shanghai
          });
        }

        for (let i = 0; i < 15; i++) {
          data.push({
            thetaOffset: -1 / 2 + i * (1 / 15),
            ...originData6,
          });
        }

        for (let i = 0; i < 15; i++) {
          data.push({
            thetaOffset: -1 / 2 + i * (1 / 30),
            ...originData7,
          });
        }

        for (let i = 0; i < 125; i++) {
          data.push({
            thetaOffset: -1 / 2 + i * (1 / 125),
            ...originData8,
          });
        }

        for (let i = 0; i < 150; i++) {
          data.push({
            thetaOffset: -1 / 2 + i * (1 / 150),
            ...originData9,
          });
        }
        return data;
      }

      function getDotData() {
        const dotData = [
          {
            // CQ
            lng: 106.06201171875,
            lat: 30.164126343161097,
          },
          {
            // BJ
            lng: 116.5883553580003,
            lat: 40.07680509701226,
          },
          {
            // HK
            lng: 114.3072509765625,
            lat: 22.228090416784486,
          },
          {
            // Herbin
            lng: 126.62841796875,
            lat: 45.75219336063106,
          },
          {
            // shanghai
            lng: 121.26708984374999,
            lat: 31.259769987394286,
          },
          {
            // Wulumuqi
            lng: 87.57202148437499,
            lat: 43.82660134505382,
          },
          {
            // lasa
            lng: 91.13221234242434,
            lat: 29.66036124234346,
          },
          {
            // xindeli
            lng: 77.4734734374341232,
            lat: 28.123829473434349,
          },
          {
            // 首尔
            lng: 126.4734734374341232,
            lat: 37.123829473434349,
          },
          {
            // 东京
            lng: 139.57202148437499,
            lat: 35.82660134505382,
          },
        ];
        return dotData;
      }
    },

    onUpdated(props) {},

    onUnMount() {},

    onResize(opt, context) {},

    getOptions(dataset, config) {
      return {
        visualMap: null,
        tooltip: null,
        legend: null,
        grid: null,
        xAxis: null,
        yAxis: null,
        series: null,
      };
    },
  };
}
