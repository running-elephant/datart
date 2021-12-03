import {
  ChartDataRequestBuilder,
  transformToViewConfig,
} from 'app/pages/ChartWorkbenchPage/models/ChartHttpRequest';
import { RelatedView } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import {
  ChartDataSectionField,
  ChartDataSectionType,
} from 'app/types/ChartConfig';
import ChartDataView, {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
import {
  ControllerFacadeTypes,
  RelativeOrExactTime,
} from 'app/types/FilterControlPanel';
import { getTime } from 'app/utils/time';
import { FilterSqlOperator } from 'globalConstants';
import { errorHandle } from 'utils/utils';
import { STORAGE_IMAGE_KEY_PREFIX, ValueOptionType } from '../constants';
import {
  BoardLinkFilter,
  ControllerWidgetContent,
  DataChart,
  getDataOption,
  Widget,
  WidgetInfo,
} from '../pages/Board/slice/types';
import {
  ControllerConfig,
  ControllerDate,
} from '../pages/BoardEditor/components/ControllerWidgetPanel/types';
import { ChartRequestFilter } from './../../ChartWorkbenchPage/models/ChartHttpRequest';
import { getLinkedColumn } from './widget';

export const convertImageUrl = (urlKey: string = ''): string => {
  if (urlKey.startsWith(STORAGE_IMAGE_KEY_PREFIX)) {
    return localStorage.getItem(urlKey) || '';
  }

  if (urlKey.startsWith('resources/image/')) {
    return `${window.location.origin}/${urlKey}`;
  }
  return urlKey;
};
/**
 * @description '为了server 复制board 副本，原有board资源文件 和新副本资源文件 脱离关系 不受影响'
 * 将当前前端渲染环境 id 替换掉原有的id ，原来的和当前的相等不受影响
 */
export const adaptBoardImageUrl = (url: string = '', curBoardId: string) => {
  // // url=resources/image/dashboard/3062ff86cdcb47b3bba75565b3f2991d/2e1cac3a-600c-4636-b858-cbcb07f4a3b3
  const spliter = '/image/dashboard/';
  if (url.includes(spliter)) {
    const originalBoardId = url.split(spliter)[1].split('/')[0];
    url.replace(originalBoardId, curBoardId);
    return url;
  }
  return url;
};
export const fillPx = (num: number) => {
  return num ? num + 'px' : num;
};
export const getRGBAColor = color => {
  if (!color) {
    return `rgba(0, 0, 0, 1)`;
  }
  if (color && color?.rgb) {
    const { r, g, b, a } = color.rgb;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  } else {
    return color;
  }
};

export const getChartDataRequestBuilder = (dataChart: DataChart) => {
  const builder = new ChartDataRequestBuilder(
    {
      id: dataChart?.viewId,
      computedFields: dataChart?.config?.computedFields || [],
    } as any,
    dataChart?.config?.chartConfig?.datas,
    dataChart?.config?.chartConfig?.settings,
  );
  return builder;
};

export const getChartRequestParams = (dataChart: DataChart) => {
  const builder = getChartDataRequestBuilder(dataChart);
  const requestParams = builder.build();
  return requestParams;
};

export const getChartGroupColumns = (dataChart: DataChart) => {
  const chartDataConfigs = dataChart?.config?.chartConfig?.datas;
  if (!chartDataConfigs) return [] as ChartDataSectionField[];
  const groupTypes = [ChartDataSectionType.GROUP, ChartDataSectionType.COLOR];
  //  ChartDataSectionType.MIXED  ??
  const groupColumns = chartDataConfigs.reduce<ChartDataSectionField[]>(
    (acc, cur) => {
      if (!cur.rows) {
        return acc;
      }
      if (groupTypes.includes(cur.type as any)) {
        return acc.concat(cur.rows);
      }
      return acc;
    },
    [],
  );
  return groupColumns;
};

export const getTneWidgetFiltersAndParams = (obj: {
  chartWidget: Widget;
  widgetMap: Record<string, Widget>;
  params: Record<string, string[]> | undefined;
}) => {
  const { chartWidget, widgetMap, params: chartParams } = obj;
  const filterWidgets = Object.values(widgetMap).filter(
    widget => widget.config.type === 'controller',
  );

  let filterParams: ChartRequestFilter[] = [];
  let variableParams: Record<string, any[]> = {};

  // TODO chartParams 实现后添加 --xld
  // if (chartParams) {
  //   Object.keys(chartParams).forEach(key => {
  //     variableParams[key] = chartParams[key];
  //   });
  // }

  filterWidgets.forEach(filterWidget => {
    const hasRelation = filterWidget.relations.find(
      re => re.targetId === chartWidget.id,
    );
    if (!hasRelation) return;

    const content = filterWidget.config.content as ControllerWidgetContent;
    const { relatedViews, config: controllerConfig, type } = content;
    const relatedViewItem = relatedViews
      .filter(view => view.fieldValue)
      .find(view => view.viewId === chartWidget?.viewIds?.[0]);
    if (!relatedViewItem) return;

    const values = getWidgetControlValues({
      type,
      relatedViewItem,
      config: controllerConfig,
    });
    if (!values) {
      console.log(`has no FilterValues return on ${chartWidget.id}`);
      return;
    }
    // 关联变量逻辑
    if (
      relatedViewItem.relatedCategory === ChartDataViewFieldCategory.Variable
    ) {
      const curValues = values.map(item => String(item.value));

      // range类型 控制器关联两个变量的情况 relatedViewItem.fieldValue [string,string]
      if (Array.isArray(relatedViewItem.fieldValue)) {
        let key1 = String(relatedViewItem.fieldValue?.[0]);
        let key2 = String(relatedViewItem.fieldValue?.[1]);

        // TODO need confirm 叠加还是替换？ --xld
        variableParams[key1] = [curValues?.[0]];
        variableParams[key2] = [curValues?.[1]];
      } else {
        const key = String(relatedViewItem.fieldValue);

        // TODO need confirm 叠加还是替换？ --xld
        variableParams[key] = [curValues?.[0]];
      }
    }
    // 关联字段 逻辑
    if (relatedViewItem.relatedCategory === ChartDataViewFieldCategory.Field) {
      const filter: ChartRequestFilter = {
        aggOperator: null,
        column: String(relatedViewItem.fieldValue),
        sqlOperator: controllerConfig.sqlOperator,
        values: values,
      };
      filterParams.push(filter);
    }
  });
  // filter 去重
  filterParams = getDistinctFiltersByColumn(filterParams);
  return {
    filterParams: filterParams,
    variableParams: variableParams,
  };
};

export const getWidgetControlValues = (opt: {
  type: ControllerFacadeTypes;
  relatedViewItem: RelatedView;
  config: ControllerConfig;
}) => {
  const { type, relatedViewItem, config } = opt;
  const valueType = relatedViewItem.fieldValueType;
  switch (type) {
    case ControllerFacadeTypes.RangeTime:
    case ControllerFacadeTypes.Time:
      if (!config?.controllerDate) {
        return false;
      }
      const timeValues = getControllerDateValues(
        config.valueOptionType,
        config.controllerDate,
      );
      const values = timeValues
        .filter(ele => !!ele)
        .map(ele => {
          const item = {
            value: ele,
            valueType: valueType || 'DATE',
          };
          return item;
        });
      return values[0] ? values : null;
    case ControllerFacadeTypes.Value:
    case ControllerFacadeTypes.RangeValue:
    case ControllerFacadeTypes.Slider:
      if (!config.controllerValues || config.controllerValues.length === 0)
        return false;
      const numericValues = config.controllerValues
        .filter(ele => {
          if (ele === 0) return true;
          return !!ele;
        })
        .map(ele => {
          const item = {
            value: ele,
            valueType: valueType || '',
          };
          return item;
        });
      return numericValues[0] ? numericValues : false;

    default:
      if (!config.controllerValues || config.controllerValues.length === 0)
        return false;

      const strValues = config.controllerValues
        .filter(ele => {
          if (ele.trim() === '') return false;
          return !!ele;
        })
        .map(ele => {
          const item = {
            value: ele.trim(),
            valueType: valueType || 'STRING',
          };
          return item;
        });
      return strValues[0] ? strValues : false;
  }
};

export const getControllerDateValues = (
  valueOptionType: ValueOptionType,
  filterDate: ControllerDate,
) => {
  const { endTime, startTime } = filterDate;

  let timeValues: [string, string] = ['', ''];

  if (startTime.relativeOrExact === RelativeOrExactTime.Exact) {
    timeValues[0] = startTime.exactValue as string;
  } else {
    const { amount, unit, direction } = startTime.relativeValue!;
    const time = getTime(+(direction + amount), unit)(unit, true);
    timeValues[0] = time.format('YYYY-MM-DD HH:mm:ss');
  }
  if (endTime) {
    if (endTime.relativeOrExact === RelativeOrExactTime.Exact) {
      timeValues[1] = endTime.exactValue as string;
    } else {
      const { amount, unit, direction } = endTime.relativeValue!;
      const time = getTime(+(direction + amount), unit)(unit, false);
      timeValues[1] = time.format('YYYY-MM-DD HH:mm:ss');
    }
  }

  return timeValues;
};

export const getBoardChartRequests = (params: {
  widgetMap: Record<string, Widget>;
  viewMap: Record<string, ChartDataView>;
  dataChartMap: Record<string, DataChart>;
}) => {
  const { widgetMap, viewMap, dataChartMap } = params;
  const chartWidgetIds = Object.values(widgetMap)
    .filter(w => w.config.type === 'chart')
    .map(w => w.id);

  const chartRequest = chartWidgetIds
    .map(widgetId => {
      return getChartWidgetRequestParams({
        widgetId,
        widgetMap,
        viewMap,
        option: undefined,
        widgetInfo: undefined,
        dataChartMap,
      });
    })
    .filter(res => {
      if (res) {
        return true;
      }
      return false;
    });
  return chartRequest;
};
export const getChartWidgetRequestParams = (obj: {
  widgetId: string;
  widgetMap: Record<string, Widget>;
  widgetInfo: WidgetInfo | undefined;
  option: getDataOption | undefined;
  viewMap: Record<string, ChartDataView>;
  dataChartMap: Record<string, DataChart>;
  boardLinkFilters?: BoardLinkFilter[];
}) => {
  const {
    widgetId,
    widgetMap,
    viewMap,
    widgetInfo,
    dataChartMap,
    option,
    boardLinkFilters,
  } = obj;
  if (!widgetId) return null;
  const curWidget = widgetMap[widgetId];
  if (!curWidget) return null;
  if (curWidget.config.type !== 'chart') return null;
  if (!curWidget.datachartId) return null;
  const dataChart = dataChartMap[curWidget.datachartId];
  if (!dataChart) return null;
  if (!dataChart) {
    errorHandle(`can\`t find Chart ${curWidget.datachartId}`);
    return null;
  }
  const chartDataView = viewMap[dataChart?.viewId];
  if (!chartDataView) {
    errorHandle(`can\`t find View ${dataChart?.viewId}`);
    return null;
  }
  const builder = getChartDataRequestBuilder(dataChart);
  let requestParams = builder.build();
  const viewConfig = transformToViewConfig(chartDataView?.config);
  requestParams = { ...requestParams, ...viewConfig };

  const { filterParams, variableParams } = getTneWidgetFiltersAndParams({
    chartWidget: curWidget,
    widgetMap,
    params: requestParams.params,
  });

  // 全局过滤 filter
  // TODO
  requestParams.filters = requestParams.filters.concat(filterParams);

  // 联动 过滤
  if (boardLinkFilters) {
    const linkFilters: ChartRequestFilter[] = [];
    const links = boardLinkFilters.filter(
      link => link.linkerWidgetId === curWidget.id,
    );

    if (links.length) {
      boardLinkFilters.forEach(link => {
        const { triggerValue, triggerWidgetId } = link;
        const triggerWidget = widgetMap[triggerWidgetId];
        const filter: ChartRequestFilter = {
          aggOperator: null,
          column: getLinkedColumn(link.linkerWidgetId, triggerWidget),
          sqlOperator: FilterSqlOperator.In,
          values: [
            { value: triggerValue, valueType: ChartDataViewFieldType.STRING },
          ],
        };
        linkFilters.push(filter);
      });
      requestParams.filters = requestParams.filters.concat(linkFilters);
    }
  }

  // filter 去重
  requestParams.filters = getDistinctFiltersByColumn(requestParams.filters);
  // 变量
  if (variableParams) {
    requestParams.params = variableParams;
  }
  if (widgetInfo) {
    const { pageInfo } = widgetInfo;
    if (requestParams.pageInfo) {
      requestParams.pageInfo.pageNo = pageInfo.pageNo;
    }
  }
  if (option) {
    const { pageInfo } = option;
    if (requestParams.pageInfo && pageInfo?.pageNo) {
      requestParams.pageInfo.pageNo = pageInfo?.pageNo;
    }
  }
  return requestParams;
};

//  filter 去重
export const getDistinctFiltersByColumn = (filter: ChartRequestFilter[]) => {
  if (!filter) {
    return [] as ChartRequestFilter[];
  }
  const filterMap: Record<string, ChartRequestFilter> = {};
  filter.forEach(item => {
    filterMap[item.column] = item;
  });

  return Object.values(filterMap);
};
