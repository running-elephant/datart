import ChartDataView, {
  ChartDataViewFieldType,
} from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import {
  ChartDataRequestBuilder,
  transformToViewConfig,
} from 'app/pages/ChartWorkbenchPage/models/ChartHttpRequest';
import { convertRelativeTimeRange, getTime } from 'app/utils/time';
import { FilterSqlOperator } from 'globalConstants';
import { errorHandle } from 'utils/utils';
import { FilterOperatorType, STORAGE_IMAGE_KEY_PREFIX } from '../constants';
import {
  FilterDate,
  WidgetFilterFormType,
} from '../pages/BoardEditor/components/FilterWidgetPanel/types';
import { RelativeOrExactTime } from './../../ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/FilterControlPanel/Constant';
import { ChartRequestFilter } from './../../ChartWorkbenchPage/models/ChartHttpRequest';
import {
  BoardLinkFilter,
  DataChart,
  FilterWidgetContent,
  getDataOption,
  Widget,
  WidgetInfo,
} from './../slice/types';

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
export const getAllFiltersOfOneWidget = (
  chartWidget: Widget,
  widgetMap: Record<string, Widget>,
) => {
  const filterWidgets = Object.values(widgetMap).filter(
    widget => widget.config.type === 'filter',
  );
  let covered = false;
  let filters: ChartRequestFilter[] = [];
  filterWidgets.forEach(filterWidget => {
    const hasRelation = filterWidget.relations.find(
      re => re.targetId === chartWidget.id,
    );
    if (!hasRelation) return;

    const { widgetFilterCovered } = hasRelation.config.filterToWidget!;

    const content = filterWidget.config.content as FilterWidgetContent;
    const { fieldValueType, relatedViews, widgetFilter } = content;
    const view = relatedViews
      .filter(view => view.fieldValue)
      .find(view => view.viewId === chartWidget.viewIds[0]);
    if (!view) return;

    const values = getWidgetFilterValues(fieldValueType, widgetFilter);
    if (!values) {
      return;
    }

    const filter: ChartRequestFilter = {
      aggOperator: widgetFilter.aggregate || null,
      column: String(view.fieldValue),
      sqlOperator: widgetFilter.sqlOperator,
      values: values,
    };
    if (widgetFilterCovered) {
      covered = true;
    }
    filters.push(filter);
  });

  return {
    covered,
    filters,
  };
};
export const getWidgetFilterValues = (
  fieldValueType: ChartDataViewFieldType,
  widgetFilter: WidgetFilterFormType,
) => {
  // Date 类型
  if (fieldValueType === ChartDataViewFieldType.DATE) {
    if (!widgetFilter?.filterDate) {
      return false;
    }
    const timeValues = getWidgetFilterDateValues(
      widgetFilter.operatorType,
      widgetFilter.filterDate,
    );
    const values = timeValues.map(ele => {
      const item = {
        value: ele,
        valueType: fieldValueType,
      };
      return item;
    });
    return values;
  }
  //
  if (!widgetFilter.filterValues || widgetFilter.filterValues.length === 0)
    return false;
  const values = widgetFilter.filterValues.map(ele => {
    const item = {
      value: ele,
      valueType: fieldValueType,
    };
    return item;
  });
  return values;
};
export const getWidgetFilterDateValues = (
  operatorType: FilterOperatorType,
  filterDate: FilterDate,
) => {
  const { commonTime, endTime, startTime } = filterDate;
  if (operatorType === 'common') {
    const timeRange = convertRelativeTimeRange(commonTime);
    return timeRange;
  }
  let timeValues: [string, string] = ['', ''];

  if (startTime.relativeOrExact === RelativeOrExactTime.Exact) {
    timeValues[0] = startTime.exactTime as string;
  } else {
    const { amount, unit, direction } = startTime.relative!;
    const time = getTime(+(direction + amount), unit)(unit, true);
    timeValues[0] = time.format('YYYY-MM-DD HH:mm:ss');
  }
  if (endTime.relativeOrExact === RelativeOrExactTime.Exact) {
    timeValues[1] = endTime.exactTime as string;
  } else {
    const { amount, unit, direction } = endTime.relative!;
    const time = getTime(+(direction + amount), unit)(unit, false);
    timeValues[1] = time.format('YYYY-MM-DD HH:mm:ss');
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
  const { filters, covered } = getAllFiltersOfOneWidget(curWidget, widgetMap);
  // 全局过滤 filter
  requestParams.filters = filters.concat(covered ? [] : requestParams.filters);
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
      requestParams.filters = filters.concat(linkFilters);
    }
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
