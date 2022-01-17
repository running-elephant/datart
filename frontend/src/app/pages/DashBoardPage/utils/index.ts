import { ChartDataRequestBuilder } from 'app/pages/ChartWorkbenchPage/models/ChartDataRequestBuilder';
import { RelatedView } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import {
  ChartDataSectionField,
  ChartDataSectionType,
} from 'app/types/ChartConfig';
import { transformToViewConfig } from 'app/types/ChartDataRequest';
import ChartDataView, {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
import {
  ControllerFacadeTypes,
  TimeFilterValueCategory,
} from 'app/types/FilterControlPanel';
import { getTime } from 'app/utils/time';
import { FilterSqlOperator, TIME_FORMATTER } from 'globalConstants';
import i18next from 'i18next';
import moment from 'moment';
import { ChartDataRequestFilter } from '../../../types/ChartDataRequest';
import { STORAGE_IMAGE_KEY_PREFIX } from '../constants';
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
import { DateControllerTypes } from './../pages/BoardEditor/components/ControllerWidgetPanel/constants';
import { PickerType } from './../pages/BoardEditor/components/ControllerWidgetPanel/types';
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
  // // url=resources/image/dashboard/boardIdXXXXXXX/fileIDxxxxxxxxx
  const splitter = '/image/dashboard/';
  if (url.includes(splitter)) {
    const originalBoardId = url.split(splitter)[1].split('/')[0];
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
    {},
    false,
    dataChart?.config?.aggregation,
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
  const groupColumns = chartDataConfigs.reduce<ChartDataSectionField[]>(
    (acc, cur) => {
      if (!cur.rows) {
        return acc;
      }
      if (groupTypes.includes(cur.type as any)) {
        return acc.concat(cur.rows);
      }
      if (cur.type === ChartDataSectionType.MIXED) {
        return acc.concat(
          cur.rows.filter(({ type }) => type === ChartDataViewFieldType.STRING),
        );
      }
      return acc;
    },
    [],
  );
  return groupColumns;
};

export const getTheWidgetFiltersAndParams = (obj: {
  chartWidget: Widget;
  widgetMap: Record<string, Widget>;
  params: Record<string, string[]> | undefined;
}) => {
  // TODO chart 本身携带了变量，board没有相关配置的时候要拿到 chart本身的 变量值 Params
  const { chartWidget, widgetMap, params: chartParams } = obj;
  const controllerWidgets = Object.values(widgetMap).filter(
    widget => widget.config.type === 'controller',
  );

  let filterParams: ChartDataRequestFilter[] = [];
  let variableParams: Record<string, any[]> = {};

  controllerWidgets.forEach(filterWidget => {
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

        //
        variableParams[key1] = [curValues?.[0]];
        variableParams[key2] = [curValues?.[1]];
      } else {
        const key = String(relatedViewItem.fieldValue);

        //单个变量的取值逻辑 不限制为1个
        variableParams[key] = curValues;
      }
    }
    // 关联字段 逻辑
    if (relatedViewItem.relatedCategory === ChartDataViewFieldCategory.Field) {
      const filter: ChartDataRequestFilter = {
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
  if (DateControllerTypes.includes(type)) {
    if (config?.controllerDate) {
      return false;
    }
    const timeValues = getControllerDateValues({
      controlType: type,
      filterDate: config.controllerDate!,
      execute: true,
    });

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
  } else {
    if (!config?.controllerValues?.[0]) {
      return false;
    }

    const values = config.controllerValues
      .filter(ele => {
        if (typeof ele === 'number') {
          return true;
        }
        if (typeof ele === 'string' && ele.trim() !== '') {
          return true;
        }
        return false;
      })
      .map(ele => {
        const item = {
          value: typeof ele === 'string' ? ele.trim() : ele,
          valueType: valueType || 'STRING',
        };
        return item;
      });
    return values[0] ? values : false;
  }
};

export const getControllerDateValues = (obj: {
  controlType: ControllerFacadeTypes;
  filterDate: ControllerDate;
  execute?: boolean;
}) => {
  const { endTime, startTime, pickerType } = obj.filterDate;
  let timeValues: [string, string] = ['', ''];
  if (startTime.relativeOrExact === TimeFilterValueCategory.Exact) {
    timeValues[0] = startTime.exactValue as string;
  } else {
    const { amount, unit, direction } = startTime.relativeValue!;
    const time = getTime(+(direction + amount), unit)(unit, true);
    timeValues[0] = time.format(TIME_FORMATTER);
  }
  if (endTime) {
    if (endTime.relativeOrExact === TimeFilterValueCategory.Exact) {
      timeValues[1] = endTime.exactValue as string;
      if (obj.execute) {
        timeValues[1] = adjustRangeDataEndValue(
          pickerType,
          endTime.exactValue as string,
        );
      } else {
        timeValues[1] = endTime.exactValue as string;
      }
    } else {
      const { amount, unit, direction } = endTime.relativeValue!;
      const time = getTime(+(direction + amount), unit)(unit, false);
      timeValues[1] = time.format(TIME_FORMATTER);
    }
  }

  return timeValues;
};
export const adjustRangeDataEndValue = (
  pickerType: PickerType,
  timeValue: string,
) => {
  if (!timeValue) {
    return timeValue;
  }
  let adjustTime = moment(timeValue);
  switch (pickerType) {
    case 'dateTime':
      // 比较特殊 不做增值处理
      break;
    case 'date':
      adjustTime = adjustTime.add(1, 'days').startOf('days');
      break;
    case 'month':
      adjustTime = adjustTime.add(1, 'months').startOf('months');
      break;
    case 'quarter':
      adjustTime = adjustTime.add(1, 'quarters').startOf('quarters');
      break;
    case 'week':
      adjustTime = adjustTime.add(1, 'weeks').startOf('week');
      break;
    case 'year':
      adjustTime = adjustTime.add(1, 'years').startOf('years');
      break;
    default:
      break;
  }
  let end = adjustTime.format(TIME_FORMATTER);
  return end;
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
  if (!dataChart) {
    // errorHandle(`can\`t find Chart ${curWidget.datachartId}`);
    return null;
  }
  const chartDataView = viewMap[dataChart?.viewId];

  if (!chartDataView) {
    // errorHandle(`can\`t find View ${dataChart?.viewId}`);
    return null;
  }

  const builder = getChartDataRequestBuilder(dataChart);
  let requestParams = builder
    .addExtraSorters((option?.sorters as any) || [])
    .build();
  const viewConfig = transformToViewConfig(chartDataView?.config);
  requestParams = { ...requestParams, ...viewConfig };

  const { filterParams, variableParams } = getTheWidgetFiltersAndParams({
    chartWidget: curWidget,
    widgetMap,
    params: requestParams.params,
  });

  // 全局过滤 filter
  // TODO
  requestParams.filters = requestParams.filters.concat(filterParams);

  // 联动 过滤
  if (boardLinkFilters) {
    const linkFilters: ChartDataRequestFilter[] = [];
    const links = boardLinkFilters.filter(
      link => link.linkerWidgetId === curWidget.id,
    );

    links.forEach(link => {
      const { triggerValue, triggerWidgetId } = link;
      const triggerWidget = widgetMap[triggerWidgetId];
      const filter: ChartDataRequestFilter = {
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
export const getDistinctFiltersByColumn = (
  filter: ChartDataRequestFilter[],
) => {
  if (!filter) {
    return [] as ChartDataRequestFilter[];
  }
  const filterMap: Record<string, ChartDataRequestFilter> = {};
  filter.forEach(item => {
    filterMap[item.column] = item;
  });

  return Object.values(filterMap);
};

export const getDefaultWidgetName = (widget: Widget, index: number) => {
  const widgetType = widget.config.type;
  const subWidgetType = widget.config.content.type;
  const typeTitle = i18next.t(`viz.widget.type.${widgetType}`);
  const subTypeTitle = i18next.t(`viz.widget.type.${subWidgetType}`);
  switch (widgetType) {
    case 'chart':
      return `${subTypeTitle}_${index}`;
    case 'container':
      return `${subTypeTitle}_${index}`;
    case 'controller':
      return `${subTypeTitle}_${index}`;
    case 'media':
      return `${subTypeTitle}_${index}`;
    case 'query':
    case 'reset':
      return `${typeTitle}`;
    default:
      return `xxx${index}`;
  }
};
