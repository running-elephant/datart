import {
  ChartDataRequestBuilder,
  transformToViewConfig,
} from 'app/pages/ChartWorkbenchPage/models/ChartHttpRequest';
import { RelatedView } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import ChartDataView, {
  ChartDataViewFieldCategory,
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
export const getChartGroupColumns = dataChart => {
  const builder = getChartDataRequestBuilder(dataChart);
  const groupColumns = builder.buildGroupColumns();
  return groupColumns;
};
export const getAllFiltersOfOneWidget = (options: {
  chartWidget: Widget;
  widgetMap: Record<string, Widget>;
  params: Record<string, string[]> | undefined;
}) => {
  const { chartWidget, widgetMap, params } = options;
  const filterWidgets = Object.values(widgetMap).filter(
    widget => widget.config.type === 'controller',
  );

  let filters: ChartRequestFilter[] = [];
  let variables: Record<string, any[]> = {};
  filterWidgets.forEach(filterWidget => {
    const hasRelation = filterWidget.relations.find(
      re => re.targetId === chartWidget.id,
    );
    if (!hasRelation) return;

    const content = filterWidget.config.content as ControllerWidgetContent;
    const { relatedViews, config, type } = content;
    const relatedViewItem = relatedViews
      .filter(view => view.fieldValue)
      .find(view => view.viewId === chartWidget.viewIds[0]);
    if (!relatedViewItem) return;

    const values = getWidgetFilterValues({
      type,
      relatedViewItem,
      config: config,
    });
    if (!values) {
      return;
    }
    if (
      relatedViewItem.relatedCategory === ChartDataViewFieldCategory.Variable
    ) {
      const key = String(relatedViewItem.fieldValue);
      const curValues = values.map(item => String(item.value));

      // String是叠加的逻辑 concat
      if (key in variables) {
        variables[key] = variables[key].concat(curValues);
      } else {
        variables[key] = curValues;
      }
      if (params && key in params) {
        variables[key] = variables[key].concat(params[key]);
      }
    }
    if (relatedViewItem.relatedCategory === ChartDataViewFieldCategory.Field) {
      const filter: ChartRequestFilter = {
        aggOperator: null,
        column: String(relatedViewItem.fieldValue),
        sqlOperator: config.sqlOperator,
        values: values,
      };
      filters.push(filter);
    }
  });

  return {
    filters,
    variables,
  };
};
export const getWidgetFilterValues = (opt: {
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
  // if (valueOptionType === 'common') {
  //   const timeRange = convertRelativeTimeRange(commonTime);
  //   return timeRange;
  // }
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
export const getChartWidgetRequestParams = (params: {
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
  } = params;
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

  const { filters, variables } = getAllFiltersOfOneWidget({
    chartWidget: curWidget,
    widgetMap: widgetMap,
    params: requestParams.params,
  });
  // 全局过滤 filter
  // TODO
  requestParams.filters = requestParams.filters.concat(filters);

  // 联动 过滤
  if (boardLinkFilters) {
    const linkFilters: ChartRequestFilter[] = [];
    const links = boardLinkFilters.filter(
      link => link.linkerWidgetId === curWidget.id,
    );
    if (links.length) {
      boardLinkFilters.forEach(link => {
        const { triggerDataChartId, triggerValue } = link;
        const dataChart = dataChartMap[triggerDataChartId];
        const builder = getChartDataRequestBuilder(dataChart);
        let chartGroupColumns = builder.buildGroupColumns();
        // TODO 需要确认 FilterSqlOperator.In
        const filter: ChartRequestFilter = {
          aggOperator: null,
          column: chartGroupColumns[0].colName,
          sqlOperator: FilterSqlOperator.In,
          values: [
            { value: triggerValue, valueType: chartGroupColumns[0].type },
          ],
        };
        linkFilters.push(filter);
      });
      requestParams.filters = requestParams.filters.concat(linkFilters);
    }
  }
  // 变量
  if (variables) {
    requestParams.params = variables;
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
