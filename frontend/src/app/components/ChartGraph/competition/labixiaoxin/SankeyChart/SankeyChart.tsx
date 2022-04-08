import { ChartConfig, ChartDataSectionType } from 'app/types/ChartConfig';
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import {
  getGridStyle,
  getStyles,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import Chart from '../../../models/Chart';
import Config from './config';

class BasicSankeyChart extends Chart {
  config = Config;
  chart: any = null;

  protected isCircle = false;
  protected isRose = false;

  constructor(props?) {
    super(
      props?.id || 'sankey-chart',
      props?.name || 'viz.palette.graph.names.sankey',
      props?.icon || 'sankey',
    );
    this.meta.requirements = props?.requirements || [
      { group: [0, 1], aggregate: [1, 999] },
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
    this.mouseEvents?.forEach(event => {
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

  private getOptions(dataset: ChartDataSetDTO, config: ChartConfig) {
    const styleConfigs = config.styles;
    const dataConfigs = config.datas || [];
    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );
    const rowData = dataset.rows;
    const groupConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.MIXED)
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
    const series = this.getSeries(
      styleConfigs,
      colorConfigs,
      chartDataSet,
      groupConfigs,
      aggregateConfigs,
      infoConfigs,
    );
    return {
      tooltip: {
        formatter: this.getTooltipFormatterFunc(
          styleConfigs,
          groupConfigs,
          chartDataSet,
        ),
      },
      series,
    };
  }
  // 对象数组去重
  unique(arr) {
    const res = new Map();
    return arr.filter(arr => !res.has(arr.name) && res.set(arr.name, 1));
  }
  private getSeries(
    styleConfigs,
    colorConfigs,
    chartDataSet: IChartDataSet<string>,
    groupConfigs,
    aggregateConfigs,
    infoConfigs,
  ) {
    // 桑基图series--->links数据
    const linksList = chartDataSet.map(row => {
      const r = row.convertToObject();
      return {
        value: r['VALUE'],
        source: r['SOURCE'],
        target: r['TARGET'],
      };
    });
    // 桑基图series--->data数据
    let dataList: any[] = [];
    linksList.map(item => {
      dataList.push({ name: item['source'] }, { name: item['target'] });
      return dataList;
    });
    dataList = this.unique(dataList);
    const tempStyle = this.getBarSeiesImpl(styleConfigs);
    let result: any = [];
    dataList = dataList.map((item, index) => {
      for (let i = 0; i < colorConfigs.length; i++) {
        const res = colorConfigs[i]?.color?.colors?.find(c => {
          if (c.key === item.name) {
            return c;
          }
        });
        res && result.push(res);
      }
      return Object.assign(item, {
        itemStyle: {
          normal: { color: result?.[index]?.value },
        },
      });
    });
    const flatSeries = [
      {
        ...tempStyle,
        type: 'sankey',
        data: dataList || [],
        links: [...linksList] || [],
        levels: [
          {
            depth: 0,
            itemStyle: {
              color: '#fbb4ae',
            },
            lineStyle: {
              color: 'source',
              opacity: 0.6,
            },
          },
        ],
        lineStyle: {
          curveness: 0.5,
        },
      },
    ];
    return flatSeries;
  }

  private getBarSeiesImpl(styleConfigs) {
    return {
      type: 'sankey',
      sampling: 'average',
      avoidLabelOverlap: false,
      label: this.getLabelStyle(styleConfigs),
      labelLayout: { hideOverlap: true },
      ...this.getSeriesStyle(styleConfigs),
      ...getGridStyle(styleConfigs),
    };
  }

  private getLabelStyle(styles) {
    const [show, position, font] = getStyles(
      styles,
      ['label'],
      ['showLabel', 'position', 'font'],
    );
    return {
      show: position === 'center' ? false : show,
      position,
      ...font,
    };
  }

  private getSeriesStyle(styles) {
    const radiusValue =
      (!this.isCircle && !this.isRose) || (!this.isCircle && this.isRose)
        ? `70%`
        : ['50%', '70%'];
    return { radius: radiusValue, roseType: this.isRose };
  }

  private getTooltipFormatterFunc(styleConfigs, groupConfigs, chartDataSet) {}
}

export default BasicSankeyChart;
