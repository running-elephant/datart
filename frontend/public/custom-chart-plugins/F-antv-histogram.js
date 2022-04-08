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

function AntVHistogramChart({ dHelper }) {

    const svgIcon = `<svg t="1647478467911" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1691" width="16" height="16"><path d="M458.105263 970.105263h-215.578947V264.084211h215.578947V970.105263z m-161.68421-53.894737h107.789473V317.978947h-107.789473V916.210526z" p-id="1692"></path><path d="M296.421053 970.105263h-215.578948V479.663158h215.578948V970.105263z m-161.684211-53.894737h107.789474V533.557895h-107.789474V916.210526zM943.157895 970.105263h-215.578948V479.663158h215.578948V970.105263z m-161.684211-53.894737h107.789474V533.557895h-107.789474V916.210526zM619.789474 970.105263h-215.578948V53.894737h215.578948v916.210526z m-161.684211-53.894737h107.789474V107.789474h-107.789474v808.421052z" p-id="1693"></path><path d="M781.473684 970.105263h-215.578947V264.084211h215.578947V970.105263z m-161.68421-53.894737h107.789473V317.978947h-107.789473V916.210526z" p-id="1694"></path></svg>`;

    return {
        config: {
            datas: [
                {
                    label: "dimension",
                    key: "dimension",
                    required: true,
                    type: "group",
                    maxFieldCount: 1,
                },
                {
                    label: 'metrics',
                    key: 'metrics',
                    required: true,
                    type: 'aggregate',
                    maxFieldCount: 1,
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
                                    { label: '内', value: 'middle' },
                                ],
                            },
                        },
                        {
                            label: 'viz.palette.style.font',
                            key: 'font',
                            comType: 'font',
                            default: {
                                fontFamily: 'PingFang SC',
                                fontSize: 12,
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
                            label: 'viz.palette.style.font',
                            key: 'font',
                            comType: 'font',
                            default: {
                                fontFamily: 'PingFang SC',
                                fontSize: 12,
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                color: 'black',
                            },
                        },
                        {
                            label: 'xAxis.barWidth',
                            key: 'barWidth',
                            default: 10,
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
                            label: 'viz.palette.style.font',
                            key: 'font',
                            comType: 'font',
                            default: {
                                fontFamily: 'PingFang SC',
                                fontSize: 12,
                                fontWeight: 'normal',
                                fontStyle: 'normal',
                                color: 'black',
                            },
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
                            label: 'splitLine.showVerticalLine',
                            key: 'showVerticalLine',
                            default: false,
                            comType: 'checkbox',
                        },
                    ],
                },
            ],
            settings: [
                {
                    label: 'viz.palette.setting.paging.title',
                    key: 'paging',
                    comType: 'group',
                    options: {
                        expand: true,
                    },
                    rows: [
                        {
                            label: 'viz.palette.setting.paging.pageSize',
                            key: 'pageSize',
                            default: 1000,
                            comType: 'inputNumber',
                            options: {
                                expand: true,
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
                        chartName: 'AntV直方图',
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
                            barWidth: '柱子宽度',
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
                        chartName: 'AntV Histogram Chart',
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
        isISOContainer: 'antv-g2',
        dependency: ['https://cdn.jsdelivr.net/npm/@antv/g2@4.1.47/dist/g2.min.js', 'https://unpkg.com/@antv/data-set@0.11.8/build/data-set.js'],
        meta: {
            id: 'antv-histogram-chart',
            name: 'chartName',
            icon: svgIcon,
            maxFieldCount: 1,
            requirements: [
                {
                    group: 1,
                    aggregate: 1,
                },
            ],
        },

        onMount(options, context) {
            // 初始化图表
            
            const { Chart } = context.window.G2
            this.chart = new Chart({
                container: context.document.getElementById(options.containerId),
                autoFit: true,
                padding: [60,60,60,60], // 上，右，下，左
            });
        },

        onUpdated(props, context) {
            this.chart?.clear();
            if (!props.dataset || !props.dataset.columns || !props.config || !props.config.datas || !props.config.datas[1].rows[0]) {
                return;
            }
            if (!this.isMatchRequirement(props.config)) {
                this.chart?.clear();
                return;
            }

            const config = props.config;
            const styles = props.config.styles

            const metricsName = props.config.datas[1].rows[0].colName
            const dimensionName = props.config.datas[0] && props.config.datas[0].rows[0] && props.config.datas[0].rows[0].colName ? props.config.datas[0].rows[0].colName : null;
            const metas = dimensionName ? [{ name: dimensionName }, { name: metricsName }] : [{ name: metricsName }];
            const data = dHelper.transformToObjectArray(props.dataset.rows, metas);
            
            const ds = new context.window.DataSet();
            const dv = ds.createView().source(data);
            console.log(props.config.datas[1].rows[0].color)
            
            dv.transform({
                type: 'bin.histogram',
                field: metricsName,
                binWidth: dHelper.getStyles(
                    styles,
                    ['xAxis'],
                    ['barWidth'],
                ),
                as: [metricsName, 'count'],
            });
            this.chart.data(dv.rows);
            this.chart.scale({
                value: {
                    min: 0,
                },
                count: {
                    // max: 20000,
                    nice: true,
                },
            });
            this.chart.tooltip({
                showMarkers: true,
                position: 'top',
            });
            this.chart.interaction('element-highlight');
            const chartIns = this.chart
                .interval()
                .position(`${metricsName}*count`)
                .color(props.config.datas[1].rows[0].color ? props.config.datas[1].rows[0].color.start : '#6395f9');
            this.setLabelStyle(styles, chartIns);
            this.setLegendStyle(styles, chartIns);
            this.setXAxis(styles, config, metricsName);
            this.setYAxis(styles, config);
            console.log('chart', this.chart)
            this.chart.render();
        },

        onUnMount() {
            this.chart && this.chart.destroy();
        },

        onResize() {
            this.chart && this.chart.forceFit();
        },

        setYAxis(styles, config) {
            const [
                showAxis,
                inverse,
                lineStyle,
                showLabel,
                font,
                showTitleAndUnit,
                unitFont,
                nameLocation,
                nameGap,
                nameRotate,
                min,
                max,
            ] = dHelper.getStyles(
                styles,
                ['yAxis'],
                [
                    'showAxis',
                    'inverseAxis',
                    'lineStyle',
                    'showLabel',
                    'font',
                    'showTitleAndUnit',
                    'unitFont',
                    'nameLocation',
                    'nameGap',
                    'nameRotate',
                    'min',
                    'max',
                ],
                );
            const [showHorizonLine, horizonLineStyle] = dHelper.getStyles(
                styles,
                ['splitLine'],
                ['showHorizonLine', 'horizonLineStyle'],
            );
            this.chart.axis('count', showAxis ? {
                position: inverse ? 'right' : 'left',
                line: {
                    style: {
                        stroke: lineStyle.color,
                        lineWidth: lineStyle.width,
                        lineDash: lineStyle.type === 'dashed' ? [5] : lineStyle.type === 'dotted' ? [2] : null,
                    },
                },
                label: {
                    style: {
                        fill: font.color,
                        ...font,
                    },
                },
                grid: showHorizonLine ? {} : null
            } : false)
        },

        setXAxis(styles, config, metricsName) {
            const [
                showAxis,
                inverse,
                lineStyle,
                showLabel,
                font,
                rotate,
                showInterval,
                interval,
            ] = dHelper.getStyles(
                styles,
                ['xAxis'],
                [
                    'showAxis',
                    'inverseAxis',
                    'lineStyle',
                    'showLabel',
                    'font',
                    'rotate',
                    'showInterval',
                    'interval',
                ],
            );
            const [showVerticalLine, verticalLineStyle] = dHelper.getStyles(
                styles,
                ['splitLine'],
                ['showVerticalLine', 'verticalLineStyle'],
            );

            this.chart.axis(metricsName, showAxis ? {
                line: {
                    style: {
                        stroke: lineStyle.color,
                        lineWidth: lineStyle.width,
                        lineDash: lineStyle.type === 'dashed' ? [5] : lineStyle.type === 'dotted' ? [2] : null,
                    },
                },
                label: {
                    style: {
                        fill: font.color,
                        ...font,
                    },
                },
                grid: showVerticalLine ? {} : null
            } : false)
        },

        setLegendStyle(styles) {
            // let paddingOptions = dHelper.getStyles(styles, ['margin'], ['marginLeft', 'marginTop', 'marginBottom', 'marginRight'])
            // paddingOptions.map((p) => {
            //     return parseFloat(p)
            // })
            // this.chart.padding = paddingOptions;
        },

        setLabelStyle(styles, chartIns) {
            const [show, position, font] = dHelper.getStyles(
                styles,
                ['label'],
                ['showLabel', 'position', 'font'],
            );

            chartIns.label(show ? 'count' : false, {
                position,
                style: {
                    fill: font.color,
                    fontSize: font.fontSize,
                    fontFamily: font.fontFamily,
                    fontWeight: font.fontWeight,
                    fontStyle: font.fontStyle,
                },
            });
        },

        getSeriesStyle(styles) {
            const [smooth, step] = dHelper.getStyles(
                styles,
                ['graph'],
                ['smooth', 'step'],
            );
            return { smooth, step };
        },
    };
}

