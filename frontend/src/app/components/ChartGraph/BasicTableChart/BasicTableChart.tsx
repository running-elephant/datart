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

import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import { ChartDataViewFieldType } from 'app/types/ChartDataView';
import {
  getColumnRenderName,
  getCustomSortableColumns,
  getUnusedHeaderRows,
  getValueByColumnKey,
  transformToObjectArray,
} from 'app/utils/chartHelper';
import { toFormattedValue } from 'app/utils/number';
import { isEmptyArray, Omit } from 'utils/object';
import { uuidv4 } from 'utils/utils';
import ReactChart from '../models/ReactChart';
import AntdTableWrapper from './AntdTableWrapper';
import {
  getCustomBodyCellStyle,
  getCustomBodyRowStyle,
} from './conditionStyle';
import Config from './config';
import { TableComponentsTd } from './TableComponents';

class BasicTableChart extends ReactChart {
  _useIFrame = false;
  isISOContainer = 'react-table';
  config = Config;
  utilCanvas = null;
  dataColumnWidths = {};
  tablePadding = 16;
  tableCellBorder = 1;
  cachedAntTableOptions = {};
  cachedDatartConfig: ChartConfig = {};
  showSummaryRow = false;
  rowNumberUniqKey = `@datart@rowNumberKey`;

  constructor(props?) {
    super(AntdTableWrapper, {
      id: props?.id || 'react-table',
      name: props?.name || '表格',
      icon: props?.icon || 'table',
    });

    this.meta.requirements = props?.requirements || [
      {
        group: [0, 999],
        aggregate: [0, 999],
      },
    ];
  }

  onUpdated(options, context): void {
    if (!this.isMatchRequirement(options.config)) {
      this.adapter?.unmount();
      return;
    }

    const tableOptions = this.getOptions(
      context,
      options.dataset,
      options.config,
      options.widgetSpecialConfig,
    );
    this.cachedAntTableOptions = tableOptions;
    this.cachedDatartConfig = options.config;
    this.adapter?.updated(tableOptions, context);
  }

  public onResize(options, context?): void {
    this.adapter?.updated(
      Object.assign(this.cachedAntTableOptions, {
        ...this.getAntdTableStyleOptions(
          this.cachedDatartConfig?.styles,
          this.cachedDatartConfig?.settings!,
          context?.height,
        ),
      }),
      context,
    );
  }

  getOptions(
    context,
    dataset?: ChartDataset,
    config?: ChartConfig,
    widgetSpecialConfig?: any,
  ) {
    if (!dataset || !config) {
      return { locale: { emptyText: '  ' } };
    }

    const dataConfigs = config.datas || [];
    const styleConfigs = config.styles || [];
    const settingConfigs = config.settings || [];

    const objDataColumns = transformToObjectArray(
      dataset.rows,
      dataset.columns,
    );
    const dataColumns = getCustomSortableColumns(objDataColumns, dataConfigs);

    const mixedSectionConfigRows = dataConfigs
      .filter(c => c.key === 'mixed')
      .flatMap(config => config.rows || []);
    const groupConfigs = mixedSectionConfigRows.filter(
      r =>
        r.type === ChartDataViewFieldType.STRING ||
        r.type === ChartDataViewFieldType.DATE,
    );
    const aggregateConfigs = mixedSectionConfigRows.filter(
      r => r.type === ChartDataViewFieldType.NUMERIC,
    );
    const tablePagination = this.getPagingOptions(
      settingConfigs,
      dataset?.pageInfo,
    );

    this.dataColumnWidths = this.calcuteFieldsMaxWidth(
      mixedSectionConfigRows,
      dataColumns,
      styleConfigs,
      context,
    );

    const tableColumns = this.getColumns(
      groupConfigs,
      aggregateConfigs,
      styleConfigs,
      dataColumns,
    );

    return {
      rowKey: 'uid',
      pagination: tablePagination,
      dataSource: this.generateTableRowUniqId(dataColumns),
      columns: tableColumns,
      summaryFn: this.getTableSummaryFn(
        settingConfigs,
        dataColumns,
        tableColumns,
        aggregateConfigs,
      ),
      components: this.getTableComponents(styleConfigs, widgetSpecialConfig),
      ...this.getAntdTableStyleOptions(
        styleConfigs,
        settingConfigs,
        context?.height,
      ),
      onChange: (pagination, filters, sorter, extra) => {
        if (extra?.action === 'sort' || extra?.action === 'paginate') {
          this.invokePagingRelatedEvents(
            sorter?.field,
            sorter?.order,
            pagination?.current,
          );
        }
      },
    };
  }

  getTableSummaryFn(
    settingConfigs,
    dataColumns,
    tableColumns,
    aggregateConfigs,
  ) {
    const aggregateFields = this.getStyleValue(settingConfigs, [
      'summary',
      'aggregateFields',
    ]);
    this.showSummaryRow = aggregateFields && aggregateFields.length > 0;
    if (!this.showSummaryRow) {
      return;
    }

    const aggregateFieldConfigs = aggregateConfigs.filter(c =>
      aggregateFields.includes(c.uid),
    );

    const _flatChildren = node => {
      if (Array.isArray(node?.children)) {
        return (node.children || []).reduce((acc, cur) => {
          return acc.concat(..._flatChildren(cur));
        }, []);
      }
      return [node];
    };
    const flatHeaderColumns = (tableColumns || []).reduce((acc, cur) => {
      return acc.concat(..._flatChildren(cur));
    }, []);

    return _ => {
      return {
        summarys: flatHeaderColumns
          .map(c => c.key)
          .map(k => {
            const currentSummaryField = aggregateFieldConfigs.find(
              c => getValueByColumnKey(c) === k,
            );
            if (currentSummaryField) {
              const total = dataColumns.map(
                dc => dc?.[getValueByColumnKey(currentSummaryField)],
              );
              return total.reduce((acc, cur) => acc + cur, 0);
            }
            return null;
          }),
      };
    };
  }

  calcuteFieldsMaxWidth(
    mixedSectionConfigRows,
    dataColumns,
    styleConfigs,
    context,
  ) {
    const bodyFont = this.getStyleValue(styleConfigs, [
      'tableBodyStyle',
      'font',
    ]);
    const headerFont = this.getStyleValue(styleConfigs, [
      'tableHeaderStyle',
      'font',
    ]);
    const tableHeaders = this.getStyleValue(styleConfigs, [
      'header',
      'modal',
      'tableHeaders',
    ]);
    const enableRowNumber = this.getStyleValue(styleConfigs, [
      'style',
      'enableRowNumber',
    ]);
    const maxContentByFields = mixedSectionConfigRows.map(c => {
      const header = this.findHeader(c.uid, tableHeaders);
      const rowUniqKey = getValueByColumnKey(c);
      const datas = dataColumns?.map(dc => {
        const text = dc[rowUniqKey];
        let width = this.getTextWidth(
          context,
          text,
          bodyFont?.fontWeight,
          bodyFont?.fontSize,
          bodyFont?.fontFamily,
        );
        const headerWidth = this.getTextWidth(
          context,
          header?.label || header?.colName,
          headerFont?.fontWeight,
          headerFont?.fontSize,
          headerFont?.fontFamily,
        );
        const sorterIconWidth = 12;
        return Math.max(width, headerWidth + sorterIconWidth);
      });

      const getRowNumberWidth = maxContent => {
        if (!enableRowNumber) {
          return 0;
        }

        return this.getTextWidth(
          context,
          maxContent,
          bodyFont?.fontWeight,
          bodyFont?.fontSize,
          bodyFont?.fontFamily,
        );
      };

      return {
        [this.rowNumberUniqKey]:
          getRowNumberWidth(dataColumns?.length) +
          this.tablePadding * 2 +
          this.tableCellBorder * 2,
        [rowUniqKey]:
          Math.max(...datas) + this.tablePadding * 2 + this.tableCellBorder * 2,
      };
    });

    return maxContentByFields.reduce((acc, cur) => {
      return Object.assign({}, acc, { ...cur });
    }, {});
  }

  generateTableRowUniqId(dataColumns) {
    return (dataColumns || []).map(dc => {
      if (dc.uid === null || dc.uid === undefined) {
        dc.uid = uuidv4();
      }
      return dc;
    });
  }

  getTableComponents(styleConfigs, widgetSpecialConfig) {
    const linkFields = widgetSpecialConfig?.linkFields;
    const jumpField = widgetSpecialConfig?.jumpField;

    const tableHeaders = this.getStyleValue(styleConfigs, [
      'header',
      'modal',
      'tableHeaders',
    ]);
    const headerBgColor = this.getStyleValue(styleConfigs, [
      'tableHeaderStyle',
      'bgColor',
    ]);
    const headerFont = this.getStyleValue(styleConfigs, [
      'tableHeaderStyle',
      'font',
    ]);
    const headerTextAlign = this.getStyleValue(styleConfigs, [
      'tableHeaderStyle',
      'align',
    ]);
    const bodyBgColor = this.getStyleValue(styleConfigs, [
      'tableBodyStyle',
      'bgColor',
    ]);
    const bodyFont = this.getStyleValue(styleConfigs, [
      'tableBodyStyle',
      'font',
    ]);
    const bodyTextAlign = this.getStyleValue(styleConfigs, [
      'tableBodyStyle',
      'align',
    ]);

    const getAllColumnListInfo = this.getValue(
      styleConfigs,
      ['column', 'modal', 'list'],
      'rows',
    );
    let allConditionStyle: any[] = [];
    getAllColumnListInfo?.forEach(info => {
      const getConditionStyleValue = this.getValue(
        info.rows,
        ['conditionStyle', 'conditionStylePanel'],
        'value',
      );
      if (Array.isArray(getConditionStyleValue)) {
        allConditionStyle = [...allConditionStyle, ...getConditionStyleValue];
      }
    });
    return {
      header: {
        cell: props => {
          const uid = props.uid;
          const { style, title, ...rest } = props;
          const header = this.findHeader(uid, tableHeaders || []);
          const cellCssStyle = {
            textAlign: headerTextAlign,
            backgroundColor: headerBgColor,
            ...headerFont,
            fontSize: +headerFont?.fontSize,
          };
          if (header && header.style) {
            const fontStyle = header.style?.font?.value;
            Object.assign(
              cellCssStyle,
              {
                textAlign: header.style.align,
                backgroundColor: header.style.backgroundColor,
              },
              { ...fontStyle },
            );
          }
          return <th {...rest} style={Object.assign(cellCssStyle, style)} />;
        },
      },
      body: {
        cell: props => {
          const { style, dataIndex, ...rest } = props;
          const uid = props.uid;
          const conditionStyle = this.getStyleValue(getAllColumnListInfo, [
            uid,
            'conditionStyle',
            'conditionStylePanel',
          ]);
          const conditionalCellStyle = getCustomBodyCellStyle(
            props,
            conditionStyle,
          );
          return (
            <TableComponentsTd
              {...rest}
              style={Object.assign(style || {}, conditionalCellStyle)}
              isLinkCell={linkFields?.includes(dataIndex)}
              isJumpCell={jumpField === dataIndex}
            />
          );
        },
        row: props => {
          const { style, ...rest } = props;
          const rowStyle = getCustomBodyRowStyle(props, allConditionStyle);
          return <tr {...rest} style={Object.assign(style || {}, rowStyle)} />;
        },
        wrapper: props => {
          const { style, ...rest } = props;
          const bodyStyle = {
            textAlign: bodyTextAlign,
            backgroundColor: bodyBgColor,
            ...bodyFont,
            fontSize: +bodyFont?.fontSize,
          };
          return (
            <tbody {...rest} style={Object.assign(style || {}, bodyStyle)} />
          );
        },
      },
    };
  }

  getColumns(groupConfigs, aggregateConfigs, styleConfigs, dataColumns) {
    const enableRowNumber = this.getStyleValue(styleConfigs, [
      'style',
      'enableRowNumber',
    ]);
    const leftFixedColumns = this.getStyleValue(styleConfigs, [
      'style',
      'leftFixedColumns',
    ]);
    const rightFixedColumns = this.getStyleValue(styleConfigs, [
      'style',
      'rightFixedColumns',
    ]);
    const autoMergeFields = this.getStyleValue(styleConfigs, [
      'style',
      'autoMergeFields',
    ]);
    const tableHeaderStyles = this.getStyleValue(styleConfigs, [
      'header',
      'modal',
      'tableHeaders',
    ]);

    const _getFixedColumn = uid => {
      if (String(leftFixedColumns).includes(uid)) {
        return 'left';
      }
      if (String(rightFixedColumns).includes(uid)) {
        return 'right';
      }
      return null;
    };

    const _getFlatColumns = (groupConfigs, aggregateConfigs, dataColumns) =>
      [...groupConfigs, ...aggregateConfigs].map(c => {
        const colName = c.colName;
        const columnRowSpans = (autoMergeFields || []).includes(c.uid)
          ? dataColumns
              ?.map(dc => dc[getValueByColumnKey(c)])
              .reverse()
              .reduce((acc, cur, index, array) => {
                if (array[index + 1] === cur) {
                  let prevRowSpan = 0;
                  if (acc.length === index && index > 0) {
                    prevRowSpan = acc[index - 1].nextRowSpan;
                  }
                  return acc.concat([
                    { rowSpan: 0, nextRowSpan: prevRowSpan + 1 },
                  ]);
                } else {
                  let prevRowSpan = 0;
                  if (acc.length === index && index > 0) {
                    prevRowSpan = acc[index - 1].nextRowSpan;
                  }
                  return acc.concat([
                    { rowSpan: prevRowSpan + 1, nextRowSpan: 0 },
                  ]);
                }
              }, [])
              .map(x => x.rowSpan)
              .reverse()
          : [];

        const colMaxWidth =
          this.dataColumnWidths?.[getValueByColumnKey(c)] || 100;
        return {
          sorter: true,
          title: getColumnRenderName(c),
          dataIndex: getValueByColumnKey(c),
          key: getValueByColumnKey(c),
          colName,
          width: colMaxWidth,
          fixed: _getFixedColumn(c?.uid),
          onHeaderCell: record => {
            return {
              ...Omit(record, [
                'dataIndex',
                'onHeaderCell',
                'onCell',
                'colName',
                'render',
                'sorter',
              ]),
              uid: c.uid,
            };
          },
          onCell: (record, rowIndex) => {
            const cellValue = record[getValueByColumnKey(c)];

            return {
              uid: c.uid,
              cellValue,
              dataIndex: getValueByColumnKey(c),
              ...this.registerTableCellEvents(
                getValueByColumnKey(c),
                cellValue,
                rowIndex,
                record,
              ),
            };
          },
          render: (value, row, rowIndex) => {
            const formattedValue = toFormattedValue(value, c.format);
            if (!(autoMergeFields || []).includes(c.uid)) {
              return formattedValue;
            }
            return {
              children: formattedValue,
              props: { rowSpan: columnRowSpans[rowIndex], cellValue: value },
            };
          },
        };
      });

    const _getGroupColumns = (
      groupConfigs,
      aggregateConfigs,
      tableHeaderStyles,
      dataColumns,
    ) => {
      const flattenedColumns = _getFlatColumns(
        groupConfigs,
        aggregateConfigs,
        dataColumns,
      );

      const groupedHeaderColumns =
        tableHeaderStyles
          ?.map(style => this.getHeaderColumnGroup(style, flattenedColumns))
          ?.filter(Boolean) || [];

      const unusedHeaderRows = getUnusedHeaderRows(
        flattenedColumns,
        groupedHeaderColumns,
      );

      return groupedHeaderColumns.concat(unusedHeaderRows);
    };

    const rowNumbers = enableRowNumber
      ? [
          {
            key: 'id',
            title: '',
            dataIndex: 'id',
            width: this.dataColumnWidths?.[this.rowNumberUniqKey] || 0,
            fixed: leftFixedColumns?.length > 0 ? 'left' : null,
          } as any,
        ]
      : [];

    return !tableHeaderStyles || tableHeaderStyles.length === 0
      ? rowNumbers.concat(
          _getFlatColumns(groupConfigs, aggregateConfigs, dataColumns),
        )
      : rowNumbers.concat(
          _getGroupColumns(
            groupConfigs,
            aggregateConfigs,
            tableHeaderStyles,
            dataColumns,
          ),
        );
  }

  getHeaderColumnGroup(tableHeader, columns) {
    if (!tableHeader.isGroup) {
      const column = columns.find(
        c => c.key === getValueByColumnKey(tableHeader),
      );
      return column;
    }
    return {
      uid: tableHeader?.uid,
      colName: tableHeader?.colName,
      title: tableHeader.label,
      onHeaderCell: record => {
        return {
          ...Omit(record, ['dataIndex', 'onHeaderCell', 'onCell', 'colName']),
        };
      },
      children: (tableHeader.children || [])
        .map(th => {
          return this.getHeaderColumnGroup(th, columns);
        })
        .filter(Boolean),
    };
  }

  getAntdTableStyleOptions(styleConfigs?, settingConfigs?, height?) {
    const enablePaging = this.getStyleValue(settingConfigs, [
      'paging',
      'enablePaging',
    ]);
    const showTableBorder = this.getStyleValue(styleConfigs, [
      'style',
      'enableBorder',
    ]);
    const enableFixedHeader = this.getStyleValue(styleConfigs, [
      'style',
      'enableFixedHeader',
    ]);
    const tableHeaderStyles = this.getStyleValue(styleConfigs, [
      'header',
      'modal',
      'tableHeaders',
    ]);
    const tableSize =
      this.getStyleValue(styleConfigs, ['style', 'tableSize']) || 'default';
    const HEADER_HEIGHT = { default: 56, middle: 48, small: 40 };
    const PAGINATION_HEIGHT = { default: 64, middle: 56, small: 56 };
    const SUMMRAY_ROW_HEIGHT = { default: 64, middle: 56, small: 56 };
    const _getMaxHeaderHierarchy = (headerStyles: Array<{ children: [] }>) => {
      const _maxDeeps = (arr: Array<{ children: [] }> = [], deeps: number) => {
        if (!isEmptyArray(arr) && arr?.length > 0) {
          return Math.max(...arr.map(a => _maxDeeps(a.children, deeps + 1)));
        }
        return deeps;
      };
      return _maxDeeps(headerStyles, 0) || 1;
    };

    const totalWidth = Object.values<number>(this.dataColumnWidths).reduce(
      (a, b) => a + b,
      0,
    );
    return {
      scroll: Object.assign({
        scrollToFirstRowOnChange: true,
        x: !enableFixedHeader ? 'max-content' : totalWidth,
        y: !enableFixedHeader
          ? undefined
          : height -
            (this.showSummaryRow ? SUMMRAY_ROW_HEIGHT[tableSize] : 0) -
            HEADER_HEIGHT[tableSize] *
              _getMaxHeaderHierarchy(tableHeaderStyles) -
            (enablePaging ? PAGINATION_HEIGHT[tableSize] : 0),
      }),
      bordered: !!showTableBorder,
      size: tableSize,
    };
  }

  getPagingOptions(settingConfigs, pageInfo?) {
    const enablePaging = this.getStyleValue(settingConfigs, [
      'paging',
      'enablePaging',
    ]);
    return enablePaging
      ? Object.assign({
          showSizeChanger: false,
          current: pageInfo?.pageNo,
          pageSize: pageInfo?.pageSize,
          total: pageInfo?.total,
        })
      : false;
  }

  createrEventParams = params => ({
    type: 'click',
    componentType: 'table',
    seriesType: undefined,
    data: undefined,
    dataIndex: undefined,
    event: undefined,
    name: undefined,
    seriesName: undefined,
    value: undefined,
    ...params,
  });

  invokePagingRelatedEvents(seriesName: string, value: any, pageNo: number) {
    const eventParams = this.createrEventParams({
      seriesType: 'paging-sort-filter',
      seriesName,
      value: {
        direction:
          value === undefined ? undefined : value === 'ascend' ? 'ASC' : 'DESC',
        pageNo,
      },
    });
    this._mouseEvents?.forEach(cur => {
      if (cur.name === 'click') {
        cur.callback?.(eventParams);
      }
    });
  }

  registerTableCellEvents(
    seriesName: string,
    value: any,
    dataIndex: number,
    record: any,
  ) {
    const eventParams = this.createrEventParams({
      seriesType: 'body',
      name: seriesName,
      data: {
        format: undefined,
        name: seriesName,
        rowData: record,
        value: value,
      },
      seriesName, // column name/index
      dataIndex, // row index
      value, // cell value
    });
    return this._mouseEvents?.reduce((acc, cur) => {
      cur.name && (eventParams.type = cur.name);
      if (cur.name === 'click') {
        Object.assign(acc, {
          onClick: event => cur.callback?.({ ...eventParams, event }),
        });
      }
      if (cur.name === 'dblclick') {
        Object.assign(acc, {
          onDoubleClick: event => cur.callback?.({ ...eventParams, event }),
        });
      }
      if (cur.name === 'contextmenu') {
        Object.assign(acc, {
          onContextMenu: event => cur.callback?.({ ...eventParams, event }),
        });
      }
      if (cur.name === 'mouseover') {
        Object.assign(acc, {
          onMouseEnter: event => cur.callback?.({ ...eventParams, event }),
        });
      }
      if (cur.name === 'mouseout') {
        Object.assign(acc, {
          onMouseLeave: event => cur.callback?.({ ...eventParams, event }),
        });
      }
      return acc;
    }, {});
  }

  getTextWidth = (
    context,
    text: string,
    fontWeight: string,
    fontSize: string,
    fontFamily: string,
  ): number => {
    const canvas =
      this.utilCanvas ||
      (this.utilCanvas = context.document.createElement('canvas'));
    const measureLayer = canvas.getContext('2d');
    measureLayer.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = measureLayer.measureText(text);
    return Math.ceil(metrics.width);
  };

  findHeader = (uid, headers) => {
    let header = (headers || [])
      .filter(h => !h.isGroup)
      .find(h => h.uid === uid);
    if (!!header) {
      return header;
    }
    for (let i = 0; i < (headers || []).length; i++) {
      header = this.findHeader(uid, headers[i].children || []);
      if (!!header) {
        break;
      }
    }
    return header;
  };
}

export default BasicTableChart;
