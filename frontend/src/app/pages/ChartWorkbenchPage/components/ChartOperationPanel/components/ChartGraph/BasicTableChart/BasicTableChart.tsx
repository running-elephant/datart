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

import ReactChart from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartGraph/ReactChart';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataset from 'app/types/ChartDataset';
import { ChartDataViewFieldType } from 'app/types/ChartDataView';
import {
  getColumnRenderName,
  getCustomSortableColumns,
  getUnusedHeaderRows,
  getValueByColumnKey,
  transfromToObjectArray,
} from 'app/utils/chartHelper';
import { toFormattedValue } from 'app/utils/number';
import { isEmptyArray, Omit } from 'utils/object';
import { v4 as uuidv4 } from 'uuid';
import AntdTableWrapper from '../../ChartTools/AntdTableWrapper';
import Config from './config';

class BasicTableChart extends ReactChart {
  _useIFrame = false;
  isISOContainer = 'react-table';
  config = Config;
  protected isAutoMerge = false;
  tableOptions = { dataset: {}, config: {} };

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
    this.tableOptions = options;

    if (!this.isMatchRequirement(options.config)) {
      this.adapter?.unmount();
      return;
    }

    this.adapter?.updated(
      this.getOptions(context, options.dataset, options.config),
      context,
    );
  }

  public onResize(options, context?): void {
    this.onUpdated(this.tableOptions, context);
  }

  getOptions(context, dataset?: ChartDataset, config?: ChartConfig) {
    if (!dataset || !config) {
      return { locale: { emptyText: '  ' } };
    }

    const dataConfigs = config.datas || [];
    const styleConfigs = config.styles || [];
    const settingConfigs = config.settings || [];

    const objDataColumns = transfromToObjectArray(
      dataset.rows,
      dataset.columns,
    );
    const dataColumns = getCustomSortableColumns(objDataColumns, dataConfigs);
    this.isAutoMerge = this.getStyleValue(styleConfigs, ['style', 'autoMerge']);

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
    return {
      rowKey: 'uid',
      pagination: tablePagination,
      dataSource: this.generateTableRowUniqId(dataColumns),
      columns: this.getColumns(
        groupConfigs,
        aggregateConfigs,
        styleConfigs,
        dataColumns,
      ),
      components: this.getTableComponents(styleConfigs),
      ...this.getAntdTableStyleOptions(
        styleConfigs,
        dataset,
        null,
        context?.height,
        tablePagination,
      ),
    };
  }

  generateTableRowUniqId(dataColumns) {
    return (dataColumns || []).map(dc => {
      if (dc.uid === null || dc.uid === undefined) {
        dc.uid = uuidv4();
      }
      return dc;
    });
  }

  getTableComponents(styleConfigs) {
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

    return {
      header: {
        cell: props => {
          const uid = props.uid;
          const { style, ...rest } = props;
          const _findRow = (uid, headers) => {
            let header = headers.find(h => h.uid === uid);
            if (!!header) {
              return header;
            }
            for (let i = 0; i < headers.length; i++) {
              header = _findRow(uid, headers[i].children || []);
              if (!!header) {
                break;
              }
            }
            return header;
          };

          const header = _findRow(uid, tableHeaders || []);
          const cellCssStyle = {
            textAlign: headerTextAlign,
            backgroundColor: headerBgColor,
            ...headerFont,
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
          const uid = props.uid;
          const { style, ...rest } = props;
          // const backgroundColor = this.getStyleValue(styleConfigs, [
          //   'column',
          //   'modal',
          //   'list',
          //   uid,
          //   'basicStyle',
          //   'backgroundColor',
          // ]);
          // const textAlign = this.getStyleValue(styleConfigs, [
          //   'column',
          //   'modal',
          //   'list',
          //   uid,
          //   'basicStyle',
          //   'align',
          // ]);
          // const font = this.getStyleValue(styleConfigs, [
          //   'column',
          //   'modal',
          //   'list',
          //   uid,
          //   'basicStyle',
          //   'font',
          // ]);
          const cellCssStyle = {
            textAlign: bodyTextAlign,
            backgroundColor: bodyBgColor,
            ...bodyFont,
          };
          return (
            <td {...rest} style={Object.assign({}, cellCssStyle, style)} />
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
    const enableFixedHeader = this.getStyleValue(styleConfigs, [
      'style',
      'enableFixedHeader',
    ]);
    const leftFixedColumns = this.getStyleValue(styleConfigs, [
      'style',
      'leftFixedColumns',
    ]);
    const rightFixedColumns = this.getStyleValue(styleConfigs, [
      'style',
      'rightFixedColumns',
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
      return false;
    };

    const _sortFn = rowKey => (prev, next) => {
      if (isNaN(+prev[rowKey])) {
        return prev[rowKey] > next[rowKey];
      }
      return prev[rowKey] - next[rowKey];
    };

    const _getFlatColumns = (groupConfigs, aggregateConfigs, dataColumns) =>
      [...groupConfigs, ...aggregateConfigs].map(c => {
        const colName = c.colName;
        const uid = c.uid;

        const enableFixedCol = this.getStyleValue(styleConfigs, [
          'column',
          'modal',
          'list',
          uid,
          'basicStyle',
          'enableFixedCol',
        ]);
        const fixedColWidth = this.getStyleValue(styleConfigs, [
          'column',
          'modal',
          'list',
          uid,
          'basicStyle',
          'enableFixedCol',
          'fixedColWidth',
        ]);

        const columnRowSpans = this.isAutoMerge
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

        return {
          sorter: _sortFn(colName),
          title: getColumnRenderName(c),
          dataIndex: getValueByColumnKey(c),
          key: getValueByColumnKey(c),
          colName,
          // TODO(Stephen): should be customize column with by use setting, https://github.com/ant-design/ant-design/issues/20397
          width: 100,
          fixed: _getFixedColumn(c?.uid),
          onHeaderCell: record => {
            return {
              ...Omit(record, [
                'dataIndex',
                'onHeaderCell',
                'onCell',
                'colName',
                'render',
              ]),
              uid: c.uid,
            };
          },
          onCell: (record, rowIndex) => {
            return {
              uid: c.uid,
              ...this.registerTableCellEvents(
                getValueByColumnKey(c),
                rowIndex,
                record[getValueByColumnKey(c)],
              ),
            };
          },
          render: (value, row, rowIndex) => {
            const formattedValue = toFormattedValue(value, c.format);
            if (!this.isAutoMerge) {
              return formattedValue;
            }
            return {
              children: formattedValue,
              props: { rowSpan: columnRowSpans[rowIndex] },
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

  getAntdTableStyleOptions(
    styleConfigs,
    dataset: ChartDataset,
    width,
    height,
    tablePagination,
  ) {
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
    const _getMaxHeaderHierarchy = (headerStyles: Array<{ children: [] }>) => {
      const _maxDeeps = (arr: Array<{ children: [] }> = [], deeps: number) => {
        if (!isEmptyArray(arr) && arr?.length > 0) {
          return Math.max(...arr.map(a => _maxDeeps(a.children, deeps + 1)));
        }
        return deeps;
      };
      return _maxDeeps(headerStyles, 0) || 1;
    };

    return {
      scroll: Object.assign({
        scrollToFirstRowOnChange: true,
        x: 'max-content',
        y: !enableFixedHeader
          ? undefined
          : height -
            0 -
            HEADER_HEIGHT[tableSize] *
              _getMaxHeaderHierarchy(tableHeaderStyles) -
            (tablePagination ? PAGINATION_HEIGHT[tableSize] : 0),
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
          ...this.registerTablePagingEvents('paging', 0, null),
        })
      : false;
  }

  registerTablePagingEvents(seriesName: string, dataIndex: number, value: any) {
    const eventParams = {
      componentType: 'series',
      seriesType: 'table',
      seriesName, // column name/index
      dataIndex, // row index
      value, // cell value
    };
    return this._mouseEvents?.reduce((acc, cur) => {
      if (cur.name === 'click') {
        Object.assign(acc, {
          onChange: (page, pageSize) =>
            cur.callback?.(
              Object.assign({}, eventParams, { value: { page, pageSize } }),
            ),
        });
      }
      return acc;
    }, {});
  }

  registerTableCellEvents(seriesName: string, dataIndex: number, value: any) {
    const eventParams = {
      componentType: 'series',
      seriesType: 'table',
      name: value,
      seriesName, // column name/index
      dataIndex, // row index
      value, // cell value
    };
    return this._mouseEvents?.reduce((acc, cur) => {
      if (cur.name === 'click') {
        Object.assign(acc, {
          onClick: event => cur.callback?.(eventParams),
        });
      }
      if (cur.name === 'dblclick') {
        Object.assign(acc, {
          onDoubleClick: event => cur.callback?.(eventParams),
        });
      }
      if (cur.name === 'contextmenu') {
        Object.assign(acc, {
          onContextMenu: event => cur.callback?.(eventParams),
        });
      }
      if (cur.name === 'mouseover') {
        Object.assign(acc, {
          onMouseEnter: event => cur.callback?.(eventParams),
        });
      }
      if (cur.name === 'mouseout') {
        Object.assign(acc, {
          onMouseLeave: event => cur.callback?.(eventParams),
        });
      }
      return acc;
    }, {});
  }
}

export default BasicTableChart;
