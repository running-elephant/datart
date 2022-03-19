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
import {
  DataChart,
  RelatedView,
  WidgetType,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import {
  ControllerConfig,
  ControllerDate,
} from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import { ChartDataConfig } from 'app/types/ChartConfig';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
import {
  ControllerFacadeTypes,
  TimeFilterValueCategory,
} from 'app/types/FilterControlPanel';
import { FilterSqlOperator } from 'globalConstants';
import {
  adaptBoardImageUrl,
  adjustRangeDataEndValue,
  checkLinkAndJumpErr,
  convertImageUrl,
  fillPx,
  getBackgroundImage,
  getBoardChartRequests,
  getChartGroupColumns,
  getControllerDateValues,
  getDataChartRequestParams,
  getDefaultWidgetName,
  getRGBAColor,
  getTheWidgetFiltersAndParams,
  getWidgetControlValues,
} from '..';
import { BOARD_FILE_IMG_PREFIX } from '../../constants';
const oldBoardId = 'xxxBoardIdXxx555';
const boardId = 'xxxBoardIdXxx666';
describe('dashboard.utils.index', () => {
  it(' should convertImageUrl get url', () => {
    const str1 = '';
    const str2 = 'http://www.qq.png';
    expect(convertImageUrl(str1)).toBe(str1);
    expect(convertImageUrl(str2)).toBe(str2);

    const str3 = BOARD_FILE_IMG_PREFIX + 'www.pan';
    const origin = window.location.origin;
    expect(convertImageUrl(str3)).toBe(`${origin}/${str3}`);
  });
  it('should getBackgroundImage ', () => {
    const str1 = '';
    const str2 = '123';
    expect(getBackgroundImage(str1)).toBe('none');
    expect(getBackgroundImage(str2)).toBe(`url(${convertImageUrl(str2)})`);
  });

  it('should adaptBoardImageUrl', () => {
    const str1 = `resources/image/dashboard/${oldBoardId}/fileID123`;
    const str2 = `resources/image/dashboard/${boardId}/fileID123`;
    const str3 = `resources/image/chart/343/fileID123`;
    const boardId2 = ``;
    expect(adaptBoardImageUrl(str1, boardId)).toBe(str2);
    expect(adaptBoardImageUrl(str3, boardId)).toBe(str3);
    expect(adaptBoardImageUrl(str1, boardId2)).toBe(str1);
  });

  it('should fillPx', () => {
    expect(fillPx(0)).toBe(0);
    expect(fillPx(2)).toBe('2px');
  });

  it('should getRGBAColor', () => {
    const val = `rgba(0, 0, 0, 1)`;
    expect(getRGBAColor('')).toBe(val);
    expect(getRGBAColor(null)).toBe(val);
    expect(getRGBAColor(undefined)).toBe(val);
    expect(getRGBAColor(0)).toBe(val);
    const color = {
      rgb: { r: 10, g: 111, b: 123, a: 0.3 },
    };
    const tColor = `rgba(10, 111, 123, 0.3)`;
    expect(getRGBAColor(color)).toBe(tColor);
    expect(getRGBAColor('#ccc')).toBe('#ccc');
  });
});
describe('should getDataChartRequestParams', () => {
  it('stack-area-chart', () => {
    const dataChart = {
      id: 'widget_b3f707ebc67643fb8e56c853f302d836_11411a8ff5694719963d97ccad99b9bc',
      name: '',
      viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
      orgId: '90fa5a6c58fc45d9bf684e2177690d5b',
      config: {
        chartConfig: {
          datas: [
            {
              label: 'dimension',
              key: 'dimension',
              required: true,
              type: 'group',
              limit: 1,
              rows: [
                {
                  uid: 'e1630ee5-ba5d-441d-9cd1-7e6bfac54781',
                  colName: '城市',
                  category: 'field',
                  type: 'STRING',
                },
              ],
            },
            {
              label: 'metrics',
              key: 'metrics',
              required: true,
              type: 'aggregate',
              limit: [1, 999],
              rows: [
                {
                  uid: '76696cb5-b286-4441-aa94-5023f616c790',
                  colName: 'GDP（亿元）',
                  category: 'field',
                  type: 'NUMERIC',
                  aggregate: 'SUM',
                },
              ],
            },
            {
              label: 'filter',
              key: 'filter',
              type: 'filter',
              allowSameField: true,
            },
            {
              label: 'colorize',
              key: 'color',
              type: 'color',
              limit: [0, 1],
            },
            {
              label: 'info',
              key: 'info',
              type: 'info',
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
                  value: 100,
                },
              ],
            },
            {
              label: 'reference.title',
              key: 'reference',
              comType: 'group',
              rows: [
                {
                  label: 'reference.open',
                  key: 'panel',
                  comType: 'reference',
                  options: {
                    type: 'modal',
                  },
                },
              ],
            },
          ],
          i18ns: [],
        },
        chartGraphId: 'stack-area-chart',
        computedFields: [],
        aggregation: true,
      },
      status: 1,
      description: '',
    };
    const opt = {
      pageInfo: {
        pageNo: 1,
      },
    };
    const res = {
      viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
      aggregators: [
        {
          column: 'GDP（亿元）',
          sqlOperator: 'SUM',
        },
      ],
      groups: [
        {
          column: '城市',
        },
      ],
      filters: [],
      orders: [],
      pageInfo: {
        countTotal: false,
        pageNo: undefined,
        pageSize: 100,
      },
      functionColumns: [],
      columns: [],
      script: false,
    };
    expect(getDataChartRequestParams(dataChart as DataChart, opt)).toEqual(res);
  });
  it('mingxi-table', () => {
    const dataChart = {
      id: 'widget_b3f707ebc67643fb8e56c853f302d836_8ad4845fe5724acfa27a8e910da90fb4',
      name: '',
      viewId: '64f14c71b487424eb165f0304e77a28e',
      orgId: '90fa5a6c58fc45d9bf684e2177690d5b',
      config: {
        chartConfig: {
          datas: [
            {
              actions: {
                NUMERIC: ['aggregate', 'alias', 'format', 'sortable'],
                STRING: ['alias', 'sortable'],
                DATE: ['alias', 'sortable'],
              },
              label: 'mixed',
              key: 'mixed',
              required: true,
              type: 'mixed',
              rows: [
                {
                  uid: 'a2b004cb-dc90-4766-bdb7-d31817f87549',
                  colName: 'name_level2',
                  category: 'field',
                  type: 'STRING',
                },
                {
                  uid: '8d5d6af1-22a1-46b8-b64d-9030bc54a59d',
                  colName: 'name_level1',
                  category: 'field',
                  type: 'STRING',
                },
                {
                  uid: 'dec8e9de-1dc2-4d7f-b76a-068a081909dd',
                  colName: '总访问次数',
                  category: 'field',
                  type: 'NUMERIC',
                  aggregate: 'SUM',
                },
              ],
            },
            {
              allowSameField: true,
              disableAggregate: true,
              actions: {
                NUMERIC: ['filter'],
                STRING: ['filter'],
                DATE: ['filter'],
              },
              label: 'filter',
              key: 'filter',
              type: 'filter',
              rows: [
                {
                  uid: '7ab1f6b3-15be-4348-8869-b9cd79c1a336',
                  colName: 'name_level3',
                  category: 'field',
                  type: 'STRING',
                  aggregate: 'NONE',
                  filter: {
                    visibility: 'show',
                    condition: {
                      name: 'name_level3',
                      type: 8,
                      value: 'wewe',
                      visualType: 'STRING',
                      operator: 'PREFIX_NOT_LIKE',
                    },
                    facade: 'text',
                    width: 'auto',
                  },
                },
              ],
            },
          ],
          styles: [],
          settings: [
            {
              label: 'paging.title',
              key: 'paging',
              comType: 'group',
              rows: [
                {
                  label: 'paging.enablePaging',
                  key: 'enablePaging',
                  default: true,
                  comType: 'checkbox',
                  options: {
                    needRefresh: true,
                  },
                  value: true,
                },
                {
                  label: 'paging.pageSize',
                  key: 'pageSize',
                  default: 100,
                  comType: 'inputNumber',
                  options: {
                    needRefresh: true,
                    step: 1,
                    min: 0,
                  },
                  watcher: {
                    deps: ['enablePaging'],
                  },
                  value: 100,
                },
              ],
            },
            {
              label: 'summary.title',
              key: 'summary',
              comType: 'group',
              rows: [
                {
                  label: 'summary.aggregateFields',
                  key: 'aggregateFields',
                  comType: 'select',
                  options: {
                    mode: 'multiple',
                  },
                },
                {
                  label: 'common.backgroundColor',
                  key: 'summaryBcColor',
                  default: 'rgba(0, 0, 0, 0)',
                  comType: 'fontColor',
                  value: 'rgba(0, 0, 0, 0)',
                },
                {
                  label: 'viz.palette.style.font',
                  key: 'summaryFont',
                  comType: 'font',
                  default: {
                    fontFamily:
                      '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                    fontSize: '14',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    color: 'black',
                  },
                  value: {
                    fontFamily:
                      '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                    fontSize: '14',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    color: 'black',
                  },
                },
              ],
            },
          ],
          i18ns: [],
        },
        chartGraphId: 'mingxi-table',
        computedFields: [],
        aggregation: true,
      },
      status: 1,
      description: '',
    };
    const opt = {
      pageInfo: {
        pageNo: 1,
      },
      sorters: [
        {
          column: 'name_level1',
          operator: 'ASC',
        },
      ],
    };
    const res = {
      viewId: '64f14c71b487424eb165f0304e77a28e',
      aggregators: [
        {
          column: '总访问次数',
          sqlOperator: 'SUM',
        },
      ],
      groups: [
        {
          column: 'name_level2',
        },
        {
          column: 'name_level1',
        },
      ],
      filters: [
        {
          aggOperator: null,
          column: 'name_level3',
          sqlOperator: 'PREFIX_NOT_LIKE',
          values: [
            {
              value: 'wewe',
              valueType: 'STRING',
            },
          ],
        },
      ],
      orders: [
        {
          column: 'name_level1',
          operator: 'ASC',
        },
      ],
      pageInfo: {
        countTotal: true,
        pageNo: undefined,
        pageSize: 100,
      },
      functionColumns: [],
      columns: [],
      script: false,
    };
    expect(getDataChartRequestParams(dataChart as DataChart, opt)).toEqual(res);
  });
});
describe('getChartGroupColumns', () => {
  it('should datas is undefined', () => {
    const datas = undefined;
    expect(getChartGroupColumns(datas)).toEqual([]);
  });
  it('should GROUP and COLOR', () => {
    const datas: ChartDataConfig[] = [
      {
        label: 'dimension',
        key: 'dimension',
        required: true,
        type: 'group',
        limit: 1,
        rows: [
          {
            uid: 'e1630ee5-ba5d-441d-9cd1-7e6bfac54781',
            colName: '城市',
            category: 'field',
            type: 'STRING',
          },
        ],
      },
      {
        label: 'metrics',
        key: 'metrics',
        required: true,
        type: 'aggregate',
        limit: [1, 999],
        rows: [
          {
            uid: '76696cb5-b286-4441-aa94-5023f616c790',
            colName: 'GDP（亿元）',
            category: 'field',
            type: 'NUMERIC',
            aggregate: 'SUM',
          },
        ],
      },
      {
        label: 'filter',
        key: 'filter',
        type: 'filter',
        allowSameField: true,
      },
      {
        actions: {
          STRING: ['alias', 'colorize'],
        },
        label: 'colorize',
        key: 'color',
        type: 'color',
        limit: [0, 1],
        rows: [
          {
            uid: '2d6a8030-2e66-468f-829f-a0bda470c051',
            colName: '地区',
            category: 'field',
            type: 'STRING',
          },
        ],
      },
      {
        label: 'info',
        key: 'info',
        type: 'info',
      },
    ] as ChartDataConfig[];
    const columns = [
      {
        uid: 'e1630ee5-ba5d-441d-9cd1-7e6bfac54781',
        colName: '城市',
        category: 'field',
        type: 'STRING',
      },
      {
        uid: '2d6a8030-2e66-468f-829f-a0bda470c051',
        colName: '地区',
        category: 'field',
        type: 'STRING',
      },
    ];
    expect(getChartGroupColumns(datas)).toEqual(columns);
  });

  it('should mixed', () => {
    const datas: ChartDataConfig[] = [
      {
        label: 'mixed',
        key: 'mixed',
        required: true,
        type: 'mixed',
        rows: [
          {
            uid: 'a2b004cb-dc90-4766-bdb7-d31817f87549',
            colName: 'name_level2',
            category: 'field',
            type: 'STRING',
          },
          {
            uid: '8d5d6af1-22a1-46b8-b64d-9030bc54a59d',
            colName: 'name_level1',
            category: 'field',
            type: 'STRING',
          },
          {
            uid: 'dec8e9de-1dc2-4d7f-b76a-068a081909dd',
            colName: '总访问次数',
            category: 'field',
            type: 'NUMERIC',
            aggregate: 'SUM',
          },
        ],
      },
      {
        label: 'filter',
        key: 'filter',
        type: 'filter',
        disableAggregate: true,
        rows: [
          {
            uid: '7ab1f6b3-15be-4348-8869-b9cd79c1a336',
            colName: 'name_level3',
            category: 'field',
            type: 'STRING',
            aggregate: 'NONE',
            filter: {
              visibility: 'show',
              condition: {
                name: 'name_level3',
                type: 8,
                value: 'wewe',
                visualType: 'STRING',
                operator: 'PREFIX_NOT_LIKE',
              },
              facade: 'text',
              width: 'auto',
            },
          },
        ],
      },
    ] as ChartDataConfig[];
    const columns = [
      {
        uid: 'a2b004cb-dc90-4766-bdb7-d31817f87549',
        colName: 'name_level2',
        category: 'field',
        type: 'STRING',
      },
      {
        uid: '8d5d6af1-22a1-46b8-b64d-9030bc54a59d',
        colName: 'name_level1',
        category: 'field',
        type: 'STRING',
      },
    ];
    expect(getChartGroupColumns(datas)).toEqual(columns);
  });
});
describe('getTheWidgetFiltersAndParams', () => {
  it('should has Params', () => {
    const obj = {
      chartWidget: {
        config: {
          version: '1.0.0-beta.2',
          type: 'chart',
          index: 1,
          name: '私有图表_1',
          linkageConfig: {
            open: false,
            chartGroupColumns: [],
          },
          autoUpdate: false,
          lock: false,
          frequency: 60,
          rect: {
            x: 0,
            y: 0,
            width: 6,
            height: 6,
          },
          background: {
            color: '#FFFFFF',
            image:
              'resources/image/dashboard/b3f707ebc67643fb8e56c853f302d836/7b3d39a7-9043-4c76-9c87-53909cac3e5f@大海1.png',
            size: '100% 100%',
            repeat: 'no-repeat',
          },
          border: {
            color: 'transparent',
            width: 1,
            style: 'solid',
            radius: 1,
          },
          content: {
            type: 'widgetChart',
          },
          nameConfig: {
            show: true,
            textAlign: 'left',
            fontFamily:
              '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            fontSize: '14',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#181C32',
          },
          padding: {
            top: 8,
            right: 8,
            bottom: 8,
            left: 8,
          },
          jumpConfig: {
            targetType: 'INTERNAL',
            target: {
              id: '171e52cec2f842588596ce8c55c139be',
              relId: '88ca31a509fb42f8bdb4728b2a9a6e0b',
              relType: 'DASHBOARD',
            },
            filter: {
              filterId: 'a53182d9f3a04f20baee2c933164d493',
              filterLabel: 'dee ',
            },
            field: {
              jumpFieldName: '城市',
            },
            open: true,
          },
        },
        createBy: '96f0c5013921456b9937ba528ba5b266',
        createTime: '2022-03-19 10:55:06',
        dashboardId: '6a1bded77a424fb3abb18c84a6af2d7b',
        datachartId:
          'widget_6a1bded77a424fb3abb18c84a6af2d7b_a8c7191e276d41cba67743041c650ee3',
        id: 'a8c7191e276d41cba67743041c650ee3',
        parentId: '',
        permission: null,
        relations: [],
        updateBy: '96f0c5013921456b9937ba528ba5b266',
        updateTime: '2022-03-19 10:55:34',
        viewIds: ['3ca2a12f09c84c8ca1a5714fc6fa44d8'],
      },
      widgetMap: {
        '60540b62ff7c4c61b229b977a2485d9e': {
          config: {
            version: '1.0.0-beta.2',
            type: 'controller',
            index: 11,
            name: 'slider',
            linkageConfig: {
              open: false,
              chartGroupColumns: [],
            },
            autoUpdate: false,
            lock: false,
            frequency: 60,
            rect: {
              x: 0,
              y: 8,
              width: 3,
              height: 1,
            },
            background: {
              color: '#FFFFFF',
              image: '',
              size: '100% 100%',
              repeat: 'no-repeat',
            },
            border: {
              radius: 1,
              width: 1,
              style: 'solid',
              color: 'transparent',
            },
            content: {
              type: 'dropdownList',
              relatedViews: [
                {
                  viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
                  relatedCategory: 'variable',
                  fieldValue: 'area1',
                  fieldValueType: 'FRAGMENT',
                },
              ],
              name: 'slider',
              config: {
                controllerValues: ['山东'],
                valueOptions: [],
                valueOptionType: 'common',
                assistViewFields: [
                  '3ca2a12f09c84c8ca1a5714fc6fa44d8',
                  '地区',
                  '地区',
                ],
                sqlOperator: 'NE',
                visibility: {
                  visibilityType: 'show',
                },
              },
            },
            nameConfig: {
              fontFamily:
                '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              fontSize: '14',
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#181C32',
              show: true,
              textAlign: 'left',
            },
            padding: {
              left: 8,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2022-03-19 10:55:06',
          dashboardId: '6a1bded77a424fb3abb18c84a6af2d7b',
          datachartId: null,
          id: '60540b62ff7c4c61b229b977a2485d9e',
          parentId: '',
          permission: null,
          relations: [
            {
              config: {
                type: 'controlToWidget',
                controlToWidget: {
                  widgetRelatedViewIds: ['3ca2a12f09c84c8ca1a5714fc6fa44d8'],
                },
              },
              createBy: null,
              createTime: null,
              id: '9f6124b9bee048058728931b7671536d',
              permission: null,
              sourceId: '60540b62ff7c4c61b229b977a2485d9e',
              targetId: 'a8c7191e276d41cba67743041c650ee3',
              updateBy: null,
              updateTime: null,
            },
          ],
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-03-19 10:55:34',
          viewIds: ['3ca2a12f09c84c8ca1a5714fc6fa44d8'],
        },
        '8c4c4262912f49c2a02da7057c9ca730': {
          config: {
            version: '1.0.0-beta.2',
            type: 'controller',
            index: 10,
            name: '日期',
            linkageConfig: {
              open: false,
              chartGroupColumns: [],
            },
            autoUpdate: false,
            lock: false,
            frequency: 60,
            rect: {
              x: 9,
              y: 0,
              width: 3,
              height: 1,
            },
            background: {
              color: '#FFFFFF',
              image: '',
              size: '100% 100%',
              repeat: 'no-repeat',
            },
            border: {
              radius: 1,
              width: 1,
              style: 'solid',
              color: 'transparent',
            },
            content: {
              type: 'time',
              relatedViews: [
                {
                  viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
                  relatedCategory: 'field',
                  fieldValue: '日期',
                  fieldValueType: 'DATE',
                },
              ],
              name: '日期',
              config: {
                controllerValues: [],
                valueOptions: [],
                controllerDate: {
                  pickerType: 'date',
                  startTime: {
                    relativeOrExact: 'exact',
                    exactValue: '2022-03-01 00:00:00',
                  },
                },
                sqlOperator: 'NE',
                visibility: {
                  visibilityType: 'show',
                },
              },
            },
            nameConfig: {
              fontFamily:
                '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              fontSize: '14',
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#181C32',
              show: true,
              textAlign: 'left',
            },
            padding: {
              left: 8,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2022-03-19 10:55:06',
          dashboardId: '6a1bded77a424fb3abb18c84a6af2d7b',
          datachartId: null,
          id: '8c4c4262912f49c2a02da7057c9ca730',
          parentId: '',
          permission: null,
          relations: [
            {
              config: {
                type: 'controlToWidget',
                controlToWidget: {
                  widgetRelatedViewIds: ['3ca2a12f09c84c8ca1a5714fc6fa44d8'],
                },
              },
              createBy: null,
              createTime: null,
              id: '065903d542ac4f7ca3270f07d8515265',
              permission: null,
              sourceId: '8c4c4262912f49c2a02da7057c9ca730',
              targetId: 'a8c7191e276d41cba67743041c650ee3',
              updateBy: null,
              updateTime: null,
            },
          ],
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-03-19 10:55:34',
          viewIds: [],
        },
        a8c7191e276d41cba67743041c650ee3: {
          config: {
            version: '1.0.0-beta.2',
            type: 'chart',
            index: 1,
            name: '私有图表_1',
            linkageConfig: {
              open: false,
              chartGroupColumns: [],
            },
            autoUpdate: false,
            lock: false,
            frequency: 60,
            rect: {
              x: 0,
              y: 0,
              width: 6,
              height: 6,
            },
            background: {
              color: '#FFFFFF',
              image:
                'resources/image/dashboard/b3f707ebc67643fb8e56c853f302d836/7b3d39a7-9043-4c76-9c87-53909cac3e5f@大海1.png',
              size: '100% 100%',
              repeat: 'no-repeat',
            },
            border: {
              color: 'transparent',
              width: 1,
              style: 'solid',
              radius: 1,
            },
            content: {
              type: 'widgetChart',
            },
            nameConfig: {
              show: true,
              textAlign: 'left',
              fontFamily:
                '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              fontSize: '14',
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#181C32',
            },
            padding: {
              top: 8,
              right: 8,
              bottom: 8,
              left: 8,
            },
            jumpConfig: {
              targetType: 'INTERNAL',
              target: {
                id: '171e52cec2f842588596ce8c55c139be',
                relId: '88ca31a509fb42f8bdb4728b2a9a6e0b',
                relType: 'DASHBOARD',
              },
              filter: {
                filterId: 'a53182d9f3a04f20baee2c933164d493',
                filterLabel: 'dee ',
              },
              field: {
                jumpFieldName: '城市',
              },
              open: true,
            },
          },
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2022-03-19 10:55:06',
          dashboardId: '6a1bded77a424fb3abb18c84a6af2d7b',
          datachartId:
            'widget_6a1bded77a424fb3abb18c84a6af2d7b_a8c7191e276d41cba67743041c650ee3',
          id: 'a8c7191e276d41cba67743041c650ee3',
          parentId: '',
          permission: null,
          relations: [],
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-03-19 10:55:34',
          viewIds: ['3ca2a12f09c84c8ca1a5714fc6fa44d8'],
        },
      },
    };
    const res = {
      filterParams: [
        {
          aggOperator: null,
          column: '日期',
          sqlOperator: 'NE',
          values: [
            {
              value: '2022-03-01 00:00:00',
              valueType: 'DATE',
            },
          ],
        },
      ],
      variableParams: {
        area1: ['山东'],
      },
    };
    expect(getTheWidgetFiltersAndParams(obj as any)).toEqual(res);
  });

  it('should no Params ', () => {
    const obj = {
      chartWidget: {
        config: {
          version: '1.0.0-beta.2',
          type: 'chart',
          index: 5,
          name: '私有图表_5',
          linkageConfig: {
            open: false,
            chartGroupColumns: [],
          },
          autoUpdate: false,
          lock: false,
          frequency: 60,
          rect: {
            x: 6,
            y: 0,
            width: 6,
            height: 6,
          },
          background: {
            color: '#FFFFFF',
            image: '',
            size: '100% 100%',
            repeat: 'no-repeat',
          },
          border: {
            radius: 1,
            width: 1,
            style: 'solid',
            color: 'transparent',
          },
          content: {
            type: 'widgetChart',
          },
          nameConfig: {
            fontFamily:
              '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            fontSize: '14',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#181C32',
            show: true,
            textAlign: 'left',
          },
          padding: {
            left: 8,
            right: 8,
            top: 8,
            bottom: 8,
          },
        },
        createBy: '96f0c5013921456b9937ba528ba5b266',
        createTime: '2022-03-18 15:57:44',
        dashboardId: 'b3f707ebc67643fb8e56c853f302d836',
        datachartId:
          'widget_b3f707ebc67643fb8e56c853f302d836_8ad4845fe5724acfa27a8e910da90fb4',
        id: '8ad4845fe5724acfa27a8e910da90fb4',
        parentId: '',
        permission: null,
        relations: [],
        updateBy: '96f0c5013921456b9937ba528ba5b266',
        updateTime: '2022-03-19 11:00:12',
        viewIds: ['64f14c71b487424eb165f0304e77a28e'],
      },
      widgetMap: {
        '3af65d6dc4f14150851db50ef39a52b7': {
          config: {
            version: '1.0.0-beta.2',
            type: 'controller',
            index: 12,
            name: '12',
            linkageConfig: {
              open: false,
              chartGroupColumns: [],
            },
            autoUpdate: false,
            lock: false,
            frequency: 60,
            rect: {
              x: 0,
              y: 0,
              width: 4,
              height: 2,
            },
            background: {
              color: '#FFFFFF',
              image: '',
              size: '100% 100%',
              repeat: 'no-repeat',
            },
            border: {
              radius: 1,
              width: 1,
              style: 'solid',
              color: 'transparent',
            },
            content: {
              type: 'dropdownList',
              relatedViews: [
                {
                  viewId: '64f14c71b487424eb165f0304e77a28e',
                  relatedCategory: 'field',
                  fieldValue: 'name_level1',
                  fieldValueType: 'STRING',
                },
              ],
              name: '12',
              config: {
                controllerValues: ['线上渠道'],
                valueOptions: [],
                valueOptionType: 'common',
                assistViewFields: [
                  '64f14c71b487424eb165f0304e77a28e',
                  'name_level1',
                  'name_level1',
                ],
                sqlOperator: 'NE',
                visibility: {
                  visibilityType: 'show',
                },
              },
            },
            nameConfig: {
              fontFamily:
                '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              fontSize: '14',
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#181C32',
              show: true,
              textAlign: 'left',
            },
            padding: {
              left: 8,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2022-03-19 10:49:32',
          dashboardId: 'b3f707ebc67643fb8e56c853f302d836',
          datachartId: null,
          id: '3af65d6dc4f14150851db50ef39a52b7',
          parentId: '',
          permission: null,
          relations: [
            {
              config: {
                type: 'controlToWidget',
                controlToWidget: {
                  widgetRelatedViewIds: ['64f14c71b487424eb165f0304e77a28e'],
                },
              },
              createBy: null,
              createTime: null,
              id: '24b55e185a864691ac76a70688f757eb',
              permission: null,
              sourceId: '3af65d6dc4f14150851db50ef39a52b7',
              targetId: '8ad4845fe5724acfa27a8e910da90fb4',
              updateBy: null,
              updateTime: null,
            },
          ],
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-03-19 11:00:12',
          viewIds: ['64f14c71b487424eb165f0304e77a28e'],
        },
        '8ad4845fe5724acfa27a8e910da90fb4': {
          config: {
            version: '1.0.0-beta.2',
            type: 'chart',
            index: 5,
            name: '私有图表_5',
            linkageConfig: {
              open: false,
              chartGroupColumns: [],
            },
            autoUpdate: false,
            lock: false,
            frequency: 60,
            rect: {
              x: 6,
              y: 0,
              width: 6,
              height: 6,
            },
            background: {
              color: '#FFFFFF',
              image: '',
              size: '100% 100%',
              repeat: 'no-repeat',
            },
            border: {
              radius: 1,
              width: 1,
              style: 'solid',
              color: 'transparent',
            },
            content: {
              type: 'widgetChart',
            },
            nameConfig: {
              fontFamily:
                '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              fontSize: '14',
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#181C32',
              show: true,
              textAlign: 'left',
            },
            padding: {
              left: 8,
              right: 8,
              top: 8,
              bottom: 8,
            },
          },
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2022-03-18 15:57:44',
          dashboardId: 'b3f707ebc67643fb8e56c853f302d836',
          datachartId:
            'widget_b3f707ebc67643fb8e56c853f302d836_8ad4845fe5724acfa27a8e910da90fb4',
          id: '8ad4845fe5724acfa27a8e910da90fb4',
          parentId: '',
          permission: null,
          relations: [],
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-03-19 11:00:12',
          viewIds: ['64f14c71b487424eb165f0304e77a28e'],
        },
      },
    };

    const res = {
      filterParams: [
        {
          aggOperator: null,
          column: 'name_level1',
          sqlOperator: 'NE',
          values: [
            {
              value: '线上渠道',
              valueType: 'STRING',
            },
          ],
        },
      ],
      variableParams: {},
    };
    expect(getTheWidgetFiltersAndParams(obj as any)).toEqual(res);
  });
});
describe('getWidgetControlValues', () => {
  test('control DropdownList value', () => {
    const type = ControllerFacadeTypes.DropdownList;
    const relatedViewItem: RelatedView = {
      viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
      relatedCategory: ChartDataViewFieldCategory.Field,
      fieldValue: '地区',
      fieldValueType: ChartDataViewFieldType.STRING,
    };
    const config: ControllerConfig = {
      required: false,
      controllerValues: ['山东'],
      valueOptions: [],
      valueOptionType: 'common',
      assistViewFields: ['3ca2a12f09c84c8ca1a5714fc6fa44d8', '地区', '地区'],
      sqlOperator: FilterSqlOperator.Equal,
      visibility: {
        visibilityType: 'show',
      },
    };
    const opt = { type, relatedViewItem, config };
    const res = [
      {
        value: '山东',
        valueType: 'STRING',
      },
    ];
    expect(getWidgetControlValues(opt)).toEqual(res);
  });
  test('control rangeValue value', () => {
    const type = ControllerFacadeTypes.RangeValue;
    const relatedViewItem: RelatedView = {
      viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
      relatedCategory: ChartDataViewFieldCategory.Field,
      fieldValue: 'GDP第一产业（亿元）',
      fieldValueType: ChartDataViewFieldType.NUMERIC,
    };

    const config: ControllerConfig = {
      required: false,
      controllerValues: [1, 10000],
      valueOptions: [],
      valueOptionType: 'common',
      assistViewFields: ['3ca2a12f09c84c8ca1a5714fc6fa44d8', '地区', '地区'],
      sqlOperator: FilterSqlOperator.Between,
      visibility: {
        visibilityType: 'show',
      },
    };

    const opt = { type, relatedViewItem, config };
    const res = [
      {
        value: 1,
        valueType: 'NUMERIC',
      },
      {
        value: 10000,
        valueType: 'NUMERIC',
      },
    ];
    expect(getWidgetControlValues(opt)).toEqual(res);
  });
  test('control RangeTime value', () => {
    const type = ControllerFacadeTypes.RangeTime;
    const relatedViewItem: RelatedView = {
      viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
      relatedCategory: ChartDataViewFieldCategory.Field,
      fieldValue: '日期',
      fieldValueType: ChartDataViewFieldType.DATE,
    };

    const config: ControllerConfig = {
      required: false,
      controllerValues: [],
      valueOptions: [],
      controllerDate: {
        pickerType: 'date',
        startTime: {
          relativeOrExact: TimeFilterValueCategory.Exact,
          exactValue: '2021-09-01 00:00:00',
        },
        endTime: {
          relativeOrExact: TimeFilterValueCategory.Exact,
          exactValue: '2022-01-15 00:00:00',
        },
      },
      assistViewFields: [],
      valueOptionType: 'common',
      sqlOperator: FilterSqlOperator.Between,
      visibility: {
        visibilityType: 'show',
      },
    };

    const opt = { type, relatedViewItem, config };
    const res = [
      {
        value: '2021-09-01 00:00:00',
        valueType: 'DATE',
      },
      {
        value: '2022-01-16 00:00:00',
        valueType: 'DATE',
      },
    ];
    expect(getWidgetControlValues(opt)).toEqual(res);
  });
});
describe('getControllerDateValues', () => {
  interface Params {
    controlType: ControllerFacadeTypes;
    filterDate: ControllerDate;
    execute?: boolean;
  }
  it('should startTime.relativeOrExact Exact', () => {
    const obj = {
      mmm: '2',
      controlType: 'time',
      filterDate: {
        pickerType: 'date',
        startTime: {
          relativeOrExact: 'exact',
          exactValue: '2022-03-01 00:00:00',
        },
      },
    } as Params;
    const res = ['2022-03-01 00:00:00', ''];
    expect(getControllerDateValues(obj)).toEqual(res);
  });
  it('should startTime.relativeOrExact relative', () => {
    const obj = {
      controlType: 'time',
      filterDate: {
        pickerType: 'date',
        startTime: {
          relativeOrExact: 'relative',
          relativeValue: {
            amount: 1,
            unit: 'd',
            direction: '-',
          },
        },
      },
      execute: true,
    } as Params;
    const res = ['2022-03-18 00:00:00', ''];
    expect(getControllerDateValues(obj)).toEqual(res);
  });
  it('should endTime.relativeOrExact Exact and relative ', () => {
    // no execute
    const obj = {
      controlType: 'rangeTime',
      filterDate: {
        pickerType: 'date',
        startTime: {
          relativeOrExact: 'exact',
          exactValue: '2022-03-01 00:00:00',
        },
        endTime: {
          relativeOrExact: 'exact',
          exactValue: '2022-03-20 00:00:00',
          relativeValue: {
            amount: 1,
            unit: 'd',
            direction: '-',
          },
        },
      },
    } as Params;
    const res = ['2022-03-01 00:00:00', '2022-03-20 00:00:00'];
    expect(getControllerDateValues(obj)).toEqual(res);
    // has execute
    const obj2 = {
      controlType: 'rangeTime',
      filterDate: {
        pickerType: 'date',
        startTime: {
          relativeOrExact: 'exact',
          exactValue: '2022-03-01 00:00:00',
        },
        endTime: {
          relativeOrExact: 'relative',
          exactValue: '2022-03-20 00:00:00',
          relativeValue: {
            amount: 1,
            unit: 'd',
            direction: '-',
          },
        },
      },
      execute: true,
    } as Params;
    const res2 = ['2022-03-01 00:00:00', '2022-03-19 00:00:00'];

    expect(getControllerDateValues(obj2)).toEqual(res2);
  });
});

describe('adjustRangeDataEndValue', () => {
  it('should timeValue is null', () => {
    expect(adjustRangeDataEndValue('date', '')).toEqual('');
  });
  it('should pickerType=dateTime', () => {
    expect(adjustRangeDataEndValue('dateTime', '2022-03-01 01:01:23')).toEqual(
      '2022-03-01 01:01:23',
    );
  });
  it('should pickerType=date', () => {
    expect(adjustRangeDataEndValue('date', '2022-03-01 01:01:23')).toEqual(
      '2022-03-02 00:00:00',
    );
  });
  it('should pickerType=month', () => {
    expect(adjustRangeDataEndValue('month', '2022-03-01 01:01:23')).toEqual(
      '2022-04-01 00:00:00',
    );
  });
  it('should pickerType=quarter', () => {
    expect(adjustRangeDataEndValue('quarter', '2022-03-01 01:01:23')).toEqual(
      '2022-04-01 00:00:00',
    );
    expect(adjustRangeDataEndValue('quarter', '2022-04-01 01:01:23')).toEqual(
      '2022-07-01 00:00:00',
    );
  });
  it('should pickerType=week', () => {
    expect(adjustRangeDataEndValue('week', '2022-03-28 00:00:00')).toEqual(
      '2022-04-03 00:00:00',
    );
  });
  it('should pickerType=year', () => {
    expect(adjustRangeDataEndValue('year', '2022-03-28 00:00:00')).toEqual(
      '2023-01-01 00:00:00',
    );
  });
});

describe('getBoardChartRequests', () => {
  it('should timeValue is null', () => {
    const obj = {
      widgetMap: {
        '24f59d7da2e84687a2a3fb465a10f819': {
          config: {
            version: '1.0.0-beta.2',
            type: 'chart',
            index: 16,
            name: "de'de",
            linkageConfig: {
              open: false,
              chartGroupColumns: [],
            },
            autoUpdate: false,
            lock: false,
            frequency: 60,
            rect: {
              x: 0,
              y: 6,
              width: 6,
              height: 6,
            },
            background: {
              color: '#FFFFFF',
              image: '',
              size: '100% 100%',
              repeat: 'no-repeat',
            },
            border: {
              radius: 1,
              width: 1,
              style: 'solid',
              color: 'transparent',
            },
            content: {
              type: 'dataChart',
            },
            nameConfig: {
              fontFamily:
                '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              fontSize: '14',
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#181C32',
              show: true,
              textAlign: 'left',
            },
            padding: {
              left: 8,
              right: 8,
              top: 8,
              bottom: 8,
            },
          },
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2022-03-19 14:34:14',
          dashboardId: '6a1bded77a424fb3abb18c84a6af2d7b',
          datachartId: '2421674d25f740809433ace249506624',
          id: '24f59d7da2e84687a2a3fb465a10f819',
          parentId: '',
          permission: null,
          relations: [],
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-03-19 14:34:25',
          viewIds: ['836614b7c86042cdbd38fc40da270846'],
        },
        '26b234e597fe475daeb7dc29b7bfe455': {
          config: {
            version: '1.0.0-beta.2',
            type: 'controller',
            index: 17,
            name: 'ww',
            linkageConfig: {
              open: false,
              chartGroupColumns: [],
            },
            autoUpdate: false,
            lock: false,
            frequency: 60,
            rect: {
              x: 9,
              y: 0,
              width: 3,
              height: 3,
            },
            background: {
              color: '#FFFFFF',
              image: '',
              size: '100% 100%',
              repeat: 'no-repeat',
            },
            border: {
              radius: 1,
              width: 1,
              style: 'solid',
              color: 'transparent',
            },
            content: {
              type: 'checkboxGroup',
              relatedViews: [
                {
                  viewId: '836614b7c86042cdbd38fc40da270846',
                  relatedCategory: 'field',
                  fieldValue: 'name_level1',
                  fieldValueType: 'STRING',
                },
              ],
              name: 'ww',
              config: {
                controllerValues: ['线上渠道', '新媒体营销'],
                valueOptions: [],
                valueOptionType: 'common',
                assistViewFields: [
                  '64f14c71b487424eb165f0304e77a28e',
                  'name_level1',
                  'name_level1',
                ],
                sqlOperator: 'IN',
                visibility: {
                  visibilityType: 'show',
                },
              },
            },
            nameConfig: {
              fontFamily:
                '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              fontSize: '14',
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#181C32',
              show: true,
              textAlign: 'left',
            },
            padding: {
              left: 8,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2022-03-19 14:34:14',
          dashboardId: '6a1bded77a424fb3abb18c84a6af2d7b',
          datachartId: null,
          id: '26b234e597fe475daeb7dc29b7bfe455',
          parentId: '',
          permission: null,
          relations: [
            {
              config: {
                type: 'controlToWidget',
                controlToWidget: {
                  widgetRelatedViewIds: ['836614b7c86042cdbd38fc40da270846'],
                },
              },
              createBy: null,
              createTime: null,
              id: '1e301113262940a7805b2c99e4d9266b',
              permission: null,
              sourceId: '26b234e597fe475daeb7dc29b7bfe455',
              targetId: '24f59d7da2e84687a2a3fb465a10f819',
              updateBy: null,
              updateTime: null,
            },
          ],
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-03-19 14:34:25',
          viewIds: ['64f14c71b487424eb165f0304e77a28e'],
        },
        '60540b62ff7c4c61b229b977a2485d9e': {
          config: {
            version: '1.0.0-beta.2',
            type: 'controller',
            index: 11,
            name: 'slider',
            linkageConfig: {
              open: false,
              chartGroupColumns: [],
            },
            autoUpdate: false,
            lock: false,
            frequency: 60,
            rect: {
              x: 6,
              y: 0,
              width: 3,
              height: 1,
            },
            background: {
              color: '#FFFFFF',
              image: '',
              size: '100% 100%',
              repeat: 'no-repeat',
            },
            border: {
              radius: 1,
              width: 1,
              style: 'solid',
              color: 'transparent',
            },
            content: {
              type: 'dropdownList',
              relatedViews: [
                {
                  viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
                  relatedCategory: 'variable',
                  fieldValue: 'area1',
                  fieldValueType: 'FRAGMENT',
                },
              ],
              name: 'slider',
              config: {
                controllerValues: ['山东'],
                valueOptions: [],
                valueOptionType: 'common',
                assistViewFields: [
                  '3ca2a12f09c84c8ca1a5714fc6fa44d8',
                  '地区',
                  '地区',
                ],
                sqlOperator: 'NE',
                visibility: {
                  visibilityType: 'show',
                },
              },
            },
            nameConfig: {
              fontFamily:
                '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              fontSize: '14',
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#181C32',
              show: true,
              textAlign: 'left',
            },
            padding: {
              left: 8,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2022-03-19 10:55:06',
          dashboardId: '6a1bded77a424fb3abb18c84a6af2d7b',
          datachartId: null,
          id: '60540b62ff7c4c61b229b977a2485d9e',
          parentId: '',
          permission: null,
          relations: [
            {
              config: {
                type: 'controlToWidget',
                controlToWidget: {
                  widgetRelatedViewIds: ['3ca2a12f09c84c8ca1a5714fc6fa44d8'],
                },
              },
              createBy: null,
              createTime: null,
              id: 'bda3b1ad14ac4e26adb5cdd0ae1df4f8',
              permission: null,
              sourceId: '60540b62ff7c4c61b229b977a2485d9e',
              targetId: 'a8c7191e276d41cba67743041c650ee3',
              updateBy: null,
              updateTime: null,
            },
          ],
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-03-19 14:34:25',
          viewIds: ['3ca2a12f09c84c8ca1a5714fc6fa44d8'],
        },
        a8c7191e276d41cba67743041c650ee3: {
          config: {
            version: '1.0.0-beta.2',
            type: 'chart',
            index: 1,
            name: '私有图表_1',
            linkageConfig: {
              open: false,
              chartGroupColumns: [],
            },
            autoUpdate: false,
            lock: false,
            frequency: 60,
            rect: {
              x: 0,
              y: 0,
              width: 6,
              height: 6,
            },
            background: {
              color: '#FFFFFF',
              image:
                'resources/image/dashboard/b3f707ebc67643fb8e56c853f302d836/7b3d39a7-9043-4c76-9c87-53909cac3e5f@大海1.png',
              size: '100% 100%',
              repeat: 'no-repeat',
            },
            border: {
              color: 'transparent',
              width: 1,
              style: 'solid',
              radius: 1,
            },
            content: {
              type: 'widgetChart',
            },
            nameConfig: {
              show: true,
              textAlign: 'left',
              fontFamily:
                '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
              fontSize: '14',
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '#181C32',
            },
            padding: {
              top: 8,
              right: 8,
              bottom: 8,
              left: 8,
            },
            jumpConfig: {
              targetType: 'INTERNAL',
              target: {
                id: '171e52cec2f842588596ce8c55c139be',
                relId: '88ca31a509fb42f8bdb4728b2a9a6e0b',
                relType: 'DASHBOARD',
              },
              filter: {
                filterId: 'a53182d9f3a04f20baee2c933164d493',
                filterLabel: 'dee ',
              },
              field: {
                jumpFieldName: '城市',
              },
              open: true,
            },
          },
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2022-03-19 10:55:06',
          dashboardId: '6a1bded77a424fb3abb18c84a6af2d7b',
          datachartId:
            'widget_6a1bded77a424fb3abb18c84a6af2d7b_a8c7191e276d41cba67743041c650ee3',
          id: 'a8c7191e276d41cba67743041c650ee3',
          parentId: '',
          permission: null,
          relations: [],
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-03-19 14:34:25',
          viewIds: ['3ca2a12f09c84c8ca1a5714fc6fa44d8'],
        },
      },
      viewMap: {
        '3ca2a12f09c84c8ca1a5714fc6fa44d8': {
          config:
            '{"concurrencyControl":true,"concurrencyControlMode":"DIRTYREAD","cache":false,"cacheExpires":0}',
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2021-10-15 11:10:52',
          description: null,
          id: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
          index: null,
          isFolder: false,
          model: '',
          name: 'gdp-view',
          orgId: '90fa5a6c58fc45d9bf684e2177690d5b',
          parentId: null,
          permission: null,
          script: 'SELECT * FROM GDP WHERE 地区 IN ($gdp_area1$)',
          sourceId: 'c65e293daae04233abe7d254d730fa22',
          status: 1,
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-01-19 16:30:46',
          meta: [
            {
              type: 'NUMERIC',
              category: 'field',
              id: 'GDP（亿元）',
            },
            {
              type: 'DATE',
              category: 'field',
              id: '日期',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: 'GDP第一产业（亿元）',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: 'GDP第三产业（亿元）',
            },
            {
              type: 'STRING',
              category: 'field',
              id: '地区',
            },
            {
              type: 'STRING',
              category: 'field',
              id: '年份',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: '人均GDP（元）',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: 'GDP指数（上年=100）',
            },
            {
              type: 'STRING',
              category: 'field',
              id: '城市',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: 'GDP第二产业（亿元）',
            },
          ],
          computedFields: [],
        },
        '836614b7c86042cdbd38fc40da270846': {
          config:
            '{"concurrencyControl":true,"concurrencyControlMode":"DIRTYREAD","cache":false,"cacheExpires":0}',
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2021-11-08 11:20:29',
          description: null,
          id: '836614b7c86042cdbd38fc40da270846',
          index: null,
          isFolder: false,
          model: '',
          name: '渠道view2',
          orgId: '90fa5a6c58fc45d9bf684e2177690d5b',
          parentId: null,
          permission: null,
          script: 'SELECT * FROM dad ',
          sourceId: 'c65e293daae04233abe7d254d730fa22',
          status: 1,
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-01-19 14:19:23',
          meta: [
            {
              type: 'STRING',
              category: 'field',
              id: 'name_level1',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: '总停留时间',
            },
            {
              type: 'STRING',
              category: 'field',
              id: 'name_level2',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: '总调出次数',
            },
            {
              type: 'STRING',
              category: 'field',
              id: 'name_level3',
            },
            {
              type: 'STRING',
              category: 'field',
              id: 'platform',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: '总访问次数',
            },
            {
              type: 'STRING',
              category: 'field',
              id: 'QD_id',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: '总页数',
            },
          ],
          computedFields: [],
        },
        '64f14c71b487424eb165f0304e77a28e': {
          config:
            '{"expensiveQuery":true,"concurrencyControl":true,"concurrencyControlMode":"DIRTYREAD","cache":false,"cacheExpires":0}',
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2021-10-18 20:14:15',
          description: null,
          id: '64f14c71b487424eb165f0304e77a28e',
          index: null,
          isFolder: false,
          model: '',
          name: '渠道数据',
          orgId: '90fa5a6c58fc45d9bf684e2177690d5b',
          parentId: null,
          permission: null,
          script: 'SELECT * FROM dad',
          sourceId: 'c65e293daae04233abe7d254d730fa22',
          status: 1,
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-03-01 10:00:59',
          meta: [
            {
              type: 'STRING',
              category: 'field',
              id: 'name_level1',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: '总停留时间',
            },
            {
              type: 'STRING',
              category: 'field',
              id: 'name_level2',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: '总调出次数',
            },
            {
              type: 'STRING',
              category: 'field',
              id: 'name_level3',
            },
            {
              type: 'STRING',
              category: 'field',
              id: 'platform',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: '总访问次数',
            },
            {
              type: 'STRING',
              category: 'field',
              id: 'QD_id',
            },
            {
              type: 'NUMERIC',
              category: 'field',
              id: '总页数',
            },
          ],
          computedFields: [],
        },
      },
      dataChartMap: {
        widget_6a1bded77a424fb3abb18c84a6af2d7b_a8c7191e276d41cba67743041c650ee3:
          {
            id: 'widget_6a1bded77a424fb3abb18c84a6af2d7b_a8c7191e276d41cba67743041c650ee3',
            name: '',
            viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
            orgId: '90fa5a6c58fc45d9bf684e2177690d5b',
            config: {
              chartConfig: {
                datas: [
                  {
                    label: 'dimension',
                    key: 'dimension',
                    required: true,
                    type: 'group',
                    limit: 1,
                    rows: [
                      {
                        uid: 'e1630ee5-ba5d-441d-9cd1-7e6bfac54781',
                        colName: '城市',
                        category: 'field',
                        type: 'STRING',
                      },
                    ],
                  },
                  {
                    label: 'metrics',
                    key: 'metrics',
                    required: true,
                    type: 'aggregate',
                    limit: [1, 999],
                    rows: [
                      {
                        uid: '76696cb5-b286-4441-aa94-5023f616c790',
                        colName: 'GDP（亿元）',
                        category: 'field',
                        type: 'NUMERIC',
                        aggregate: 'SUM',
                      },
                    ],
                  },
                  {
                    label: 'filter',
                    key: 'filter',
                    type: 'filter',
                    allowSameField: true,
                  },
                  {
                    label: 'colorize',
                    key: 'color',
                    type: 'color',
                    limit: [0, 1],
                  },
                  {
                    label: 'info',
                    key: 'info',
                    type: 'info',
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
                        value: false,
                      },
                      {
                        label: 'graph.step',
                        key: 'step',
                        default: false,
                        comType: 'checkbox',
                        value: false,
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
                        default: true,
                        comType: 'checkbox',
                        value: true,
                      },
                      {
                        label: 'label.position',
                        key: 'position',
                        comType: 'select',
                        default: 'top',
                        options: {
                          items: [
                            {
                              label: '上',
                              value: 'top',
                            },
                            {
                              label: '左',
                              value: 'left',
                            },
                            {
                              label: '右',
                              value: 'right',
                            },
                            {
                              label: '下',
                              value: 'bottom',
                            },
                            {
                              label: '内',
                              value: 'inside',
                            },
                            {
                              label: '内左',
                              value: 'insideLeft',
                            },
                            {
                              label: '内右',
                              value: 'insideRight',
                            },
                            {
                              label: '内上',
                              value: 'insideTop',
                            },
                            {
                              label: '内下',
                              value: 'insideBottom',
                            },
                            {
                              label: '内左上',
                              value: 'insideTopLeft',
                            },
                            {
                              label: '内左下',
                              value: 'insideBottomLeft',
                            },
                            {
                              label: '内右上',
                              value: 'insideTopRight',
                            },
                            {
                              label: '内右下',
                              value: 'insideBottomRight',
                            },
                          ],
                        },
                        value: 'top',
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
                          color: '#495057',
                        },
                        value: {
                          fontFamily: 'PingFang SC',
                          fontSize: '12',
                          fontWeight: 'normal',
                          fontStyle: 'normal',
                          color: '#495057',
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
                        value: true,
                      },
                      {
                        label: 'legend.type',
                        key: 'type',
                        comType: 'legendType',
                        default: 'scroll',
                        value: 'scroll',
                      },
                      {
                        label: 'legend.selectAll',
                        key: 'selectAll',
                        default: true,
                        comType: 'checkbox',
                        value: true,
                      },
                      {
                        label: 'legend.position',
                        key: 'position',
                        comType: 'select',
                        default: 'right',
                        options: {
                          items: [
                            {
                              label: '右',
                              value: 'right',
                            },
                            {
                              label: '上',
                              value: 'top',
                            },
                            {
                              label: '下',
                              value: 'bottom',
                            },
                            {
                              label: '左',
                              value: 'left',
                            },
                          ],
                        },
                        value: 'right',
                      },
                      {
                        label: 'legend.height',
                        key: 'height',
                        default: 0,
                        comType: 'inputNumber',
                        options: {
                          step: 40,
                          min: 0,
                        },
                        value: 0,
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
                          color: '#495057',
                        },
                        value: {
                          fontFamily: 'PingFang SC',
                          fontSize: '12',
                          fontWeight: 'normal',
                          fontStyle: 'normal',
                          color: '#495057',
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
                        value: true,
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
                          color: '#ced4da',
                        },
                        value: {
                          type: 'solid',
                          width: 1,
                          color: '#ced4da',
                        },
                      },
                      {
                        label: 'common.showLabel',
                        key: 'showLabel',
                        default: true,
                        comType: 'checkbox',
                        options: [],
                        value: true,
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
                          color: '#495057',
                        },
                        value: {
                          fontFamily: 'PingFang SC',
                          fontSize: '12',
                          fontWeight: 'normal',
                          fontStyle: 'normal',
                          color: '#495057',
                        },
                      },
                      {
                        label: 'common.rotate',
                        key: 'rotate',
                        default: 0,
                        comType: 'inputNumber',
                        value: 0,
                      },
                      {
                        label: 'common.showInterval',
                        key: 'showInterval',
                        default: false,
                        comType: 'checkbox',
                        value: false,
                      },
                      {
                        label: 'common.overflow',
                        key: 'overflow',
                        comType: 'select',
                        default: 'break',
                        options: {
                          translateItemLabel: true,
                          items: [
                            {
                              label: '@global@.common.overflowType.none',
                              value: 'none',
                            },
                            {
                              label: '@global@.common.overflowType.truncate',
                              value: 'truncate',
                            },
                            {
                              label: '@global@.common.overflowType.break',
                              value: 'break',
                            },
                            {
                              label: '@global@.common.overflowType.breakAll',
                              value: 'breakAll',
                            },
                          ],
                        },
                        value: 'break',
                      },
                      {
                        label: 'common.interval',
                        key: 'interval',
                        default: 0,
                        comType: 'inputNumber',
                        value: 0,
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
                        value: true,
                      },
                      {
                        label: 'common.inverseAxis',
                        key: 'inverseAxis',
                        default: false,
                        comType: 'checkbox',
                        value: false,
                      },
                      {
                        label: 'common.lineStyle',
                        key: 'lineStyle',
                        comType: 'line',
                        default: {
                          type: 'dashed',
                          width: 1,
                          color: '#ced4da',
                        },
                        value: {
                          type: 'solid',
                          width: 1,
                          color: '#ced4da',
                        },
                      },
                      {
                        label: 'common.showLabel',
                        key: 'showLabel',
                        default: true,
                        comType: 'checkbox',
                        options: [],
                        value: true,
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
                          color: '#495057',
                        },
                        value: {
                          fontFamily: 'PingFang SC',
                          fontSize: '12',
                          fontWeight: 'normal',
                          fontStyle: 'normal',
                          color: '#495057',
                        },
                      },
                      {
                        label: 'common.showTitleAndUnit',
                        key: 'showTitleAndUnit',
                        default: true,
                        comType: 'checkbox',
                        options: [],
                        value: true,
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
                          color: '#495057',
                        },
                        value: {
                          fontFamily: 'PingFang SC',
                          fontSize: '12',
                          fontWeight: 'normal',
                          fontStyle: 'normal',
                          color: '#495057',
                        },
                      },
                      {
                        label: 'common.nameLocation',
                        key: 'nameLocation',
                        default: 'center',
                        comType: 'nameLocation',
                        value: 'center',
                      },
                      {
                        label: 'common.nameRotate',
                        key: 'nameRotate',
                        default: 90,
                        comType: 'inputNumber',
                        value: 90,
                      },
                      {
                        label: 'common.nameGap',
                        key: 'nameGap',
                        default: 20,
                        comType: 'inputNumber',
                        value: 20,
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
                        value: true,
                      },
                      {
                        label: 'common.lineStyle',
                        key: 'horizonLineStyle',
                        comType: 'line',
                        default: {
                          type: 'dashed',
                          width: 1,
                          color: '#ced4da',
                        },
                        value: {
                          type: 'dashed',
                          width: 1,
                          color: '#ced4da',
                        },
                      },
                      {
                        label: 'splitLine.showVerticalLine',
                        key: 'showVerticalLine',
                        default: true,
                        comType: 'checkbox',
                        value: true,
                      },
                      {
                        label: 'common.lineStyle',
                        key: 'verticalLineStyle',
                        comType: 'line',
                        default: {
                          type: 'dashed',
                          width: 1,
                          color: '#ced4da',
                        },
                        value: {
                          type: 'dashed',
                          width: 1,
                          color: '#ced4da',
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
                        value: true,
                      },
                      {
                        label: 'viz.palette.style.margin.left',
                        key: 'marginLeft',
                        default: '5%',
                        comType: 'marginWidth',
                        value: '5%',
                      },
                      {
                        label: 'viz.palette.style.margin.right',
                        key: 'marginRight',
                        default: '5%',
                        comType: 'marginWidth',
                        value: '5%',
                      },
                      {
                        label: 'viz.palette.style.margin.top',
                        key: 'marginTop',
                        default: '5%',
                        comType: 'marginWidth',
                        value: '5%',
                      },
                      {
                        label: 'viz.palette.style.margin.bottom',
                        key: 'marginBottom',
                        default: '5%',
                        comType: 'marginWidth',
                        value: '5%',
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
                        value: 100,
                      },
                    ],
                  },
                  {
                    label: 'reference.title',
                    key: 'reference',
                    comType: 'group',
                    rows: [
                      {
                        label: 'reference.open',
                        key: 'panel',
                        comType: 'reference',
                        options: {
                          type: 'modal',
                        },
                      },
                    ],
                  },
                ],
                i18ns: [
                  {
                    lang: 'zh-CN',
                    translation: {
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
                        overflow: '文本溢出',
                        showTitleAndUnit: '显示标题和刻度',
                        nameLocation: '标题位置',
                        nameRotate: '标题旋转',
                        nameGap: '标题与轴线距离',
                        min: '最小值',
                        max: '最大值',
                        overflowType: {
                          none: '溢出',
                          truncate: '截断',
                          break: '换行',
                          breakAll: '强制换行',
                        },
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
                        height: '图例高度',
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
                        overflow: 'Overflow',
                        showTitleAndUnit: 'Show Title and Unit',
                        nameLocation: 'Name Location',
                        nameRotate: 'Name Rotate',
                        nameGap: 'Name Gap',
                        min: 'Min',
                        max: 'Max',
                        overflowType: {
                          none: 'None',
                          truncate: 'Truncate',
                          break: 'Break',
                          breakAll: 'BreakAll',
                        },
                      },
                      label: {
                        title: 'Label',
                        showLabel: 'Show Label',
                        position: 'Position',
                        height: 'Height',
                      },
                      legend: {
                        title: 'Legend',
                        showLegend: 'Show Legend',
                        type: 'Type',
                        selectAll: 'Select All',
                        position: 'Position',
                        height: 'Height',
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
              chartGraphId: 'stack-area-chart',
              computedFields: [],
              aggregation: true,
            },
            status: 1,
            description: '',
          },
        '2421674d25f740809433ace249506624': {
          config: {
            aggregation: true,
            chartConfig: {
              datas: [
                {
                  label: 'dimension',
                  key: 'dimension',
                  required: true,
                  type: 'group',
                  limit: [0, 1],
                  actions: {
                    NUMERIC: ['alias', 'colorize', 'sortable'],
                    STRING: ['alias', 'colorize', 'sortable'],
                  },
                  rows: [
                    {
                      uid: '3e320dd9-6a7e-44a6-91bd-06e27bc33e79',
                      colName: 'name_level2',
                      category: 'field',
                      type: 'STRING',
                    },
                  ],
                },
                {
                  label: 'metrics',
                  key: 'metrics',
                  required: true,
                  type: 'aggregate',
                  limit: [1, 999],
                  rows: [
                    {
                      uid: 'f978df76-e5df-4cbe-8221-7fb7eb1c7f93',
                      colName: '总停留时间',
                      category: 'field',
                      type: 'NUMERIC',
                      aggregate: 'SUM',
                    },
                  ],
                },
                {
                  allowSameField: true,
                  disableAggregate: false,
                  actions: {
                    NUMERIC: ['filter'],
                    STRING: ['filter'],
                    DATE: ['filter'],
                  },
                  label: 'filter',
                  key: 'filter',
                  type: 'filter',
                  rows: [
                    {
                      uid: '1a323cde-9ba5-47b0-9000-6001bff781a2',
                      colName: 'name_level3',
                      category: 'field',
                      type: 'STRING',
                      aggregate: 'NONE',
                      filter: {
                        visibility: 'hide',
                        condition: {
                          name: 'name_level3',
                          type: 2,
                          value: [
                            {
                              key: 'PC',
                              label: 'PC',
                              isSelected: true,
                            },
                          ],
                          visualType: 'STRING',
                          operator: 'IN',
                        },
                        width: 'auto',
                      },
                    },
                  ],
                },
                {
                  label: 'info',
                  key: 'info',
                  type: 'info',
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
                      value: true,
                      comType: 'checkbox',
                      rows: [],
                    },
                    {
                      label: 'label.position',
                      key: 'position',
                      value: 'outside',
                      comType: 'select',
                      rows: [],
                    },
                    {
                      label: 'viz.palette.style.font',
                      key: 'font',
                      value: {
                        fontFamily: 'PingFang SC',
                        fontSize: '12',
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        color: '#495057',
                      },
                      comType: 'font',
                      rows: [],
                    },
                    {
                      label: 'label.showName',
                      key: 'showName',
                      value: true,
                      comType: 'checkbox',
                      rows: [],
                    },
                    {
                      label: 'label.showValue',
                      key: 'showValue',
                      value: false,
                      comType: 'checkbox',
                      rows: [],
                    },
                    {
                      label: 'label.showPercent',
                      key: 'showPercent',
                      value: true,
                      comType: 'checkbox',
                      rows: [],
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
                      value: true,
                      comType: 'checkbox',
                      rows: [],
                    },
                    {
                      label: 'legend.type',
                      key: 'type',
                      value: 'scroll',
                      comType: 'legendType',
                      rows: [],
                    },
                    {
                      label: 'legend.selectAll',
                      key: 'selectAll',
                      value: true,
                      comType: 'checkbox',
                      rows: [],
                    },
                    {
                      label: 'legend.position',
                      key: 'position',
                      value: 'right',
                      comType: 'select',
                      rows: [],
                    },
                    {
                      label: 'legend.height',
                      key: 'height',
                      value: 0,
                      comType: 'inputNumber',
                      rows: [],
                    },
                    {
                      label: 'viz.palette.style.font',
                      key: 'font',
                      value: {
                        fontFamily: 'PingFang SC',
                        fontSize: '12',
                        fontWeight: 'normal',
                        fontStyle: 'normal',
                        color: '#495057',
                      },
                      comType: 'font',
                      rows: [],
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
                      value: true,
                      comType: 'checkbox',
                      rows: [],
                    },
                    {
                      label: 'viz.palette.style.margin.left',
                      key: 'marginLeft',
                      value: '5%',
                      comType: 'marginWidth',
                      rows: [],
                    },
                    {
                      label: 'viz.palette.style.margin.right',
                      key: 'marginRight',
                      value: '5%',
                      comType: 'marginWidth',
                      rows: [],
                    },
                    {
                      label: 'viz.palette.style.margin.top',
                      key: 'marginTop',
                      value: '5%',
                      comType: 'marginWidth',
                      rows: [],
                    },
                    {
                      label: 'viz.palette.style.margin.bottom',
                      key: 'marginBottom',
                      value: '5%',
                      comType: 'marginWidth',
                      rows: [],
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
                      value: 1000,
                      comType: 'inputNumber',
                      rows: [],
                    },
                  ],
                },
              ],
            },
            chartGraphId: 'pie-chart',
            computedFields: [],
          },
          createBy: '96f0c5013921456b9937ba528ba5b266',
          createTime: '2022-03-17 12:37:08',
          description: null,
          id: '2421674d25f740809433ace249506624',
          name: "de'de",
          orgId: '90fa5a6c58fc45d9bf684e2177690d5b',
          permission: null,
          status: 1,
          thumbnail: null,
          updateBy: '96f0c5013921456b9937ba528ba5b266',
          updateTime: '2022-03-17 17:43:35',
          viewId: '836614b7c86042cdbd38fc40da270846',
        },
      },
    };
    const res = [
      {
        viewId: '836614b7c86042cdbd38fc40da270846',
        aggregators: [
          {
            column: '总停留时间',
            sqlOperator: 'SUM',
          },
        ],
        groups: [
          {
            column: 'name_level2',
          },
        ],
        filters: [
          {
            aggOperator: null,
            column: 'name_level3',
            sqlOperator: 'IN',
            values: [
              {
                value: 'PC',
                valueType: 'STRING',
              },
            ],
          },
          {
            aggOperator: null,
            column: 'name_level1',
            sqlOperator: 'IN',
            values: [
              {
                value: '线上渠道',
                valueType: 'STRING',
              },
              {
                value: '新媒体营销',
                valueType: 'STRING',
              },
            ],
          },
        ],
        orders: [],
        pageInfo: {
          countTotal: false,
          pageSize: 1000,
        },
        functionColumns: [],
        columns: [],
        script: false,
        cache: false,
        cacheExpires: 0,
        concurrencyControl: true,
        concurrencyControlMode: 'DIRTYREAD',
        params: {},
        vizName: "de'de",
        vizId: '2421674d25f740809433ace249506624',
        analytics: false,
        vizType: 'dataChart',
      },
      {
        viewId: '3ca2a12f09c84c8ca1a5714fc6fa44d8',
        aggregators: [
          {
            column: 'GDP（亿元）',
            sqlOperator: 'SUM',
          },
        ],
        groups: [
          {
            column: '城市',
          },
        ],
        filters: [],
        orders: [],
        pageInfo: {
          countTotal: false,
          pageSize: 100,
        },
        functionColumns: [],
        columns: [],
        script: false,
        cache: false,
        cacheExpires: 0,
        concurrencyControl: true,
        concurrencyControlMode: 'DIRTYREAD',
        params: {
          area1: ['山东'],
        },
        vizName: '私有图表_1',
        vizId: 'a8c7191e276d41cba67743041c650ee3',
        analytics: false,
        vizType: 'widget',
      },
    ];
    expect(getBoardChartRequests(obj as any)).toEqual(res);
  });
});

describe('getDefaultWidgetName', () => {
  const chart: WidgetType = 'chart';
  const media: WidgetType = 'media';
  const query: WidgetType = 'query';
  const reset: WidgetType = 'reset';
  it('should chart', () => {
    expect(getDefaultWidgetName(chart, 'widgetChart', 3)).toEqual(
      'privateChart_3',
    );
    expect(getDefaultWidgetName(media, 'image', 3)).toEqual('Image_3');
  });
  it('should btn', () => {
    expect(getDefaultWidgetName(query, 'query', 3)).toEqual('Query');
    expect(getDefaultWidgetName(reset, 'reset', 3)).toEqual('Reset');
  });
  it('should other', () => {
    expect(getDefaultWidgetName('other' as any, 'query', 3)).toEqual('xxx3');
  });
});

describe('checkLinkAndJumpErr', () => {
  it('should linkageError', () => {
    const widget1 = {
      config: { linkageConfig: { open: true } },
      relations: [],
    } as any;
    expect(checkLinkAndJumpErr(widget1, [''])).toBe('viz.linkage.linkageError');
  });
  it('should jumpError', () => {
    const widget2 = {
      config: {
        jumpConfig: {
          open: true,
          targetType: 'INTERNAL',
          target: { relId: 'id123' },
        },
      },
    } as any;
    expect(checkLinkAndJumpErr(widget2, [])).toBe('viz.jump.jumpError');
  });
});
