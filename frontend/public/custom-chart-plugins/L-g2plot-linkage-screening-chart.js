/**
 * @description 使用g2plot开发，主要功能为通过饼状图进行联动操作
 *               1、鼠标放入后柱状图高亮对应模块的数据；
 *               2、单击饼状图，显示单击模块类型的柱状图；
 *               3、双击饼状图，返回初始化状态
 * @author wuliang
 * @param {*} param
 * @returns 
 */
function g2plotLinkageScreeningChart({ dHelper }) {
    const linkageIcon = `<svg t="1648603389348" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2493" width="200" height="200"><path d="M107.52 886.69184l5.12-316.05248c0-13.45024 0.64512-7.43936-12.8-7.43936h-35.84v350.6688a46.1312 46.1312 0 0 0 46.1312 46.1312h833.29024a16.57344 16.57344 0 0 0 16.57856-16.57856V919.04l-8.53504-3.39968-834.56-1.70496c-10.24-0.01536-9.38496-22.10304-9.38496-27.24352z" p-id="2494"></path><path d="M768 286.72v-1.152H502.54848L443.89376 20.48C319.25248 45.056 225.28 154.87488 225.28 286.72c0 149.89312 121.46688 271.36 271.36 271.36s271.36-121.46688 271.36-271.36zM326.31808 457.04192a240.27648 240.27648 0 0 1-51.65056-76.59008c-12.55936-29.696-18.89792-61.22496-18.89792-93.73184 0-28.60032 4.94592-56.6528 14.76608-83.23584a238.91456 238.91456 0 0 1 40.79616-70.62528 240.6912 240.6912 0 0 1 61.52704-52.80256 240.14336 240.14336 0 0 1 48.10752-22.07232l51.84 234.15296 5.2992 23.91552h257.6384a239.73888 239.73888 0 0 1-17.1264 64.39424 240.61952 240.61952 0 0 1-51.67104 76.59008 239.872 239.872 0 0 1-76.57472 51.65056c-29.696 12.55424-61.22496 18.88768-93.73184 18.88768s-64.09216-6.33344-93.73184-18.88768a240.11776 240.11776 0 0 1-76.59008-51.64544zM485.04832 46.09536V15.60576C488.89344 15.41632 492.72832 15.36 496.64 15.36c136.65792 0 249.6512 100.98176 268.56448 232.3968h-30.87872a238.44864 238.44864 0 0 0-15.7696-54.76352 240.63488 240.63488 0 0 0-51.66592-76.59008c-22.144-22.12864-47.86176-39.51616-76.57984-51.65056-29.696-12.55936-61.2352-18.89792-93.73184-18.89792-3.85024-0.00512-7.68512 0.12288-11.53024 0.24064zM870.9632 560.61952c-37.45792 0-67.93216 20.23936-67.93216 45.10208 0 10.3168 5.248 19.82976 14.05952 27.43296l-166.0928 140.16512c-9.20064-3.0976-19.59424-4.85376-30.592-4.85376-16.32256 0-31.32416 3.84-43.04896 10.22976l-95.37536-50.19648c4.74624-6.14912 7.44448-13.11744 7.44448-20.49024 0-24.87296-30.47424-45.1072-67.93216-45.1072-37.46304 0-67.9424 20.22912-67.9424 45.1072 0 8.35584 3.456 16.18432 9.4464 22.90688l-103.74144 62.12608c-10.58816-4.5312-23.17312-7.168-36.6848-7.168-37.46304 0-67.93728 20.23936-67.93728 45.1072 0 24.86784 30.47936 45.10208 67.93728 45.10208 37.46304 0 67.9424-20.22912 67.9424-45.10208 0-7.8336-3.03616-15.2064-8.35072-21.63712l104.53504-62.61248c10.17856 4.05504 22.08256 6.38464 34.78528 6.38464 14.18752 0 27.3664-2.90304 38.272-7.85408l97.68448 51.39456c-3.19488 5.22752-4.97664 10.9312-4.97664 16.91136 0 24.87296 30.47424 45.1072 67.93728 45.1072s67.93728-20.22912 67.93728-45.1072c0-9.48736-4.43904-18.29888-12.01664-25.5744l167.14752-141.0304a97.8432 97.8432 0 0 0 27.50976 3.87072c37.45792 0 67.93216-20.22912 67.93216-45.10208-0.01024-24.87296-30.47936-45.11232-67.94752-45.11232z m-648.38144 293.1712c-18.94912 0-34.36544-10.22976-34.36544-22.81472 0-12.57984 15.41632-22.81984 34.36544-22.81984 18.95424 0 34.37056 10.24 34.37056 22.81984 0 12.58496-15.41632 22.81472-34.37056 22.81472z m198.912-122.96704c-18.95424 0-34.37568-10.24-34.37568-22.81472 0-12.59008 15.41632-22.81984 34.37568-22.81984 18.94912 0 34.36544 10.22976 34.36544 22.81984 0.00512 12.57472-15.41632 22.81472-34.36544 22.81472z m198.91712 105.55392c-18.95936 0-34.37568-10.22976-34.37568-22.81984 0-12.57472 15.41632-22.8096 34.37568-22.8096 18.944 0 34.36544 10.23488 34.36544 22.8096 0 12.59008-15.42144 22.81984-34.36544 22.81984z m250.55232-207.83616c-18.94912 0-34.37056-10.23488-34.37056-22.81984 0-12.57472 15.42144-22.81472 34.37056-22.81472 18.95424 0 34.37056 10.24 34.37056 22.81472 0 12.58496-15.4112 22.81984-34.37056 22.81984z" p-id="2495"></path></svg>`
    return {
        config: {
            datas: [
                {
                    label: "@global@.xLabel",
                    key: "xLabel",
                    required: true,
                    type: 'group',
                    limit: 1
                },
                {
                    label: "@global@.yLabel",
                    key: "yLabel",
                    required: true,
                    type: 'group',
                    limit: 1
                },
                {
                    label: "@global@.typeLabel",
                    key: "typeLabel",
                    required: true,
                    type: 'group',
                    limit: 1
                },
            ],
            styles: [],
            i18ns: [
                {
                    lang: "zh",
                    translation: {
                        xLabel: "X轴",
                        yLabel: "Y轴",
                        typeLabel: "类型",
                    }
                },
                {
                    lang: "en",
                    translation: {
                        xLabel: "X",
                        yLabel: "Y",
                        typeLabel: "type",
                    }
                }
            ],

        },
        isISOContainer: "g2plot-linkage-screening-chart",
        dependency: [
            "https://cdnjs.cloudflare.com/ajax/libs/g2plot/2.4.13/g2plot.min.js",
            "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
        ],
        meta: {
            id: "g2plot-linkage-screening-chart",
            name: "联动筛选",
            icon: linkageIcon,
            requirements: [
                {
                    group: 1
                },
            ],
        },
        onMount(options, context) {
            this._ = context.window._
            const container = context.document.createElement("div");
            container.setAttribute("id", "container");
            container.setAttribute('style', 'display: flex;flex-direction: column !important;height:calc(100% - 80px)');
            context.document.getElementById(options.containerId).appendChild(container);
            const container1 = context.document.createElement("div");
            container1.setAttribute("id", "container1");
            container1.setAttribute("style", " flex: 1;margin-bottom:5px");
            const container2 = context.document.createElement("div");
            container2.setAttribute("id", "container2");
            container2.setAttribute("style", " flex: 1;");
            context.document.getElementById("container").appendChild(container1);
            context.document.getElementById("container").appendChild(container2);

            const { Column, Pie } = context.window.G2Plot

            const pieData = [
                {
                    "type": "",
                    "value": 10
                },
            ]
            const showData = []
            this.pie = new Pie('container1', {
                data: pieData,
                colorField: 'type',
                angleField: 'value',
                label: { type: 'inner' },
                tooltip: false,
                state: {
                    active: {
                        style: {
                            lineWidth: 0,
                        },
                    },
                },
                interactions: [
                    {
                        type: 'element-highlight',
                        cfg: {
                            showEnable: [{ trigger: 'element:mouseenter', action: 'cursor:pointer' }],
                            end: [
                                { trigger: 'element:mouseleave', action: 'cursor:default' },
                                { trigger: 'element:mouseleave', action: 'element-highlight:reset' },
                            ],
                        },
                    },
                ],
            });

            this.column = new Column('container2', {
                data: showData,
                xField: 'city',
                yField: 'value',
                seriesField: 'type',
                isGroup: 'true',
                legend: false,
                columnStyle: {
                    radius: [4, 4, 0, 0],
                },
            });

            this.pie.render();
            this.column.render();


        },
        onUpdated(options, context) {
            const dataset = options?.dataset || [];
            if (!this.isMatchRequirement(options.config)) {
                return;
            }
            if (dataset.columns.length != 3) {
                return;
            }
            const showData = this.getInfo(options);
            const pieData = ((originData) => {
                const groupData = this._.groupBy(originData, 'type');
                const result = [];
                this._.forEach(groupData, (values, k) => {
                    result.push({ type: k, value: values.reduce((a, b) => Number(a) + Number(b.value), 0) });
                });
                return result;
            })(showData);

            this.pie.chart.changeData(pieData);
            this.column.chart.changeData(showData);
            this.pie.on('element:mouseover', (evt) => {
                const eventData = evt.data;
                if (eventData?.data) {
                    const type = eventData.data.type;
                    this.column.setState('selected', (datum) => datum.type === type);
                    this.column.setState('selected', (datum) => datum.type !== type, false);
                }
            });
            this.pie.on('element:mouseleave', () => {
                this.column.setState('selected', () => true, false);
            });

            this.pie.on('element:click', (evt) => {
                const eventData = evt.data;
                if (eventData?.data) {
                    const type = eventData.data.type;
                    this.pie.chart.changeData(pieData.filter((datum) => datum.type === type));
                    this.column.chart.changeData(showData.filter((datum) => datum.type === type));
                }
            });
            // 双击，还原数据
            this.pie.on('element:dblclick', () => {
                this.pie.chart.changeData(pieData);
                this.column.chart.changeData(showData);
            });
        },
        onUnMount() { 
            this.pie.chart.destroy();
            this.column.chart.destroy();
        },
        onResize(opt, context) {
        },
        getInfo(options) {
            const dataset = options?.dataset || [];
            const dataConfigs = options?.config.datas || [];
            const groupConfigs = dataConfigs
                .filter(c => c.type === 'group')
                .flatMap(config => config.rows || []);
            const objDataColumns = dHelper.transformToObjectArray(
                dataset.rows,
                dataset.columns,
            );
            const data = objDataColumns.map(dc => {
                return {
                    city: dc[dHelper.getValueByColumnKey(groupConfigs[0])],
                    value: Number(dc[dHelper.getValueByColumnKey(groupConfigs[1])]),
                    type: dc[dHelper.getValueByColumnKey(groupConfigs[2])],
                };
            });
            return data
        }
    }
}