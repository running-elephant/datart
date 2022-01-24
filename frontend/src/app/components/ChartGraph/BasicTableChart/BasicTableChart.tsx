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
  getStyles,
  getUnusedHeaderRows,
  getValue,
  getValueByColumnKey,
  transformToObjectArray,
} from 'app/utils/chartHelper';
import { toFormattedValue } from 'app/utils/number';
import { DATARTSEPERATOR } from 'globalConstants';
import { Debugger } from 'utils/debugger';
import { CloneValueDeep, isEmptyArray, Omit } from 'utils/object';
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
  useIFrame = false;
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
  totalWidth = 0;
  exceedMaxContent = false;

  constructor(props?) {
    super(AntdTableWrapper, {
      id: props?.id || 'react-table',
      name: props?.name || 'Table',
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

    Debugger.instance.measure(
      'Table OnUpdate cost ---> ',
      () => {
        const tableOptions = this.getOptions(
          context,
          options.dataset,
          options.config,
          options.widgetSpecialConfig,
        );
        this.cachedAntTableOptions = tableOptions;
        this.cachedDatartConfig = options.config;
        this.adapter?.updated(tableOptions, context);
      },
      false,
    );
  }

  public onResize(options, context?): void {
    const tableOptions = Object.assign(
      this.cachedAntTableOptions,
      {
        ...this.getAntdTableStyleOptions(
          this.cachedDatartConfig?.styles,
          this.cachedDatartConfig?.settings!,
          context,
        ),
      },
      { columns: this.getDataColumnWidths(options, context) },
    );
    this.adapter?.updated(tableOptions, context);
  }

  getDataColumnWidths(options, context) {
    const dataConfigs = options.config.datas || [];
    const styleConfigs = options.config.styles || [];

    const objDataColumns = transformToObjectArray(
      options.dataset.rows,
      options.dataset.columns,
    );
    const dataColumns = getCustomSortableColumns(objDataColumns, dataConfigs);
    const mixedSectionConfigRows = dataConfigs
      .filter(c => c.key === 'mixed')
      .flatMap(config => config.rows || []);
    this.dataColumnWidths = this.calcuteFieldsMaxWidth(
      mixedSectionConfigRows,
      dataColumns,
      styleConfigs,
      context,
    );
    this.totalWidth = Object.values<any>(this.dataColumnWidths).reduce(
      (a, b) => a + b.columnWidthValue,
      0,
    );
    this.exceedMaxContent = this.totalWidth >= context.width;
    return this.getColumns(
      mixedSectionConfigRows,
      styleConfigs,
      dataColumns,
      context,
    );
  }

  protected getOptions(
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
    const aggregateConfigs = mixedSectionConfigRows.filter(
      r => r.type === ChartDataViewFieldType.NUMERIC,
    );
    this.dataColumnWidths = this.calcuteFieldsMaxWidth(
      mixedSectionConfigRows,
      dataColumns,
      styleConfigs,
      context,
    );
    this.totalWidth = Object.values<any>(this.dataColumnWidths).reduce(
      (a, b) => a + b.columnWidthValue,
      0,
    );
    this.exceedMaxContent = this.totalWidth >= context.width;
    const tablePagination = this.getPagingOptions(
      settingConfigs,
      dataset?.pageInfo,
    );
    const tableColumns = this.getColumns(
      mixedSectionConfigRows,
      styleConfigs,
      dataColumns,
      context,
    );

    return {
      rowKey: 'uid',
      pagination: tablePagination,
      dataSource: this.generateTableRowUniqId(
        dataColumns,
        mixedSectionConfigRows,
      ),
      columns: tableColumns,
      summaryFn: this.getTableSummaryFn(
        settingConfigs,
        dataColumns,
        tableColumns,
        aggregateConfigs,
        context,
      ),
      components: this.getTableComponents(styleConfigs, widgetSpecialConfig),
      ...this.getAntdTableStyleOptions(styleConfigs, settingConfigs, context),
      onChange: (pagination, filters, sorter, extra) => {
        if (extra?.action === 'sort' || extra?.action === 'paginate') {
          this.invokePagingRelatedEvents(
            sorter?.column?.colName,
            sorter?.order,
            pagination?.current,
            sorter?.column?.aggregate,
          );
        }
      },
      rowClassName: (_, index) => {
        return index % 2 === 0 ? 'odd' : 'even';
      },
      oddAndEven: this.getOddAndEvenStyle(styleConfigs),
    };
  }

  getOddAndEvenStyle(styles) {
    const [oddBgColor, oddFontColor, evenBgColor, evenFontColor] = getStyles(
      styles,
      ['tableBodyStyle'],
      ['oddBgColor', 'oddFontColor', 'evenBgColor', 'evenFontColor'],
    );
    return {
      odd: {
        backgroundColor: oddBgColor,
        color: oddFontColor,
      },
      even: {
        backgroundColor: evenBgColor,
        color: evenFontColor,
      },
    };
  }

  private getTableSummaryFn(
    settingConfigs,
    dataColumns,
    tableColumns,
    aggregateConfigs,
    context,
  ) {
    const [aggregateFields] = getStyles(
      settingConfigs,
      ['summary'],
      ['aggregateFields'],
    );
    this.showSummaryRow = aggregateFields && aggregateFields.length > 0;
    if (!this.showSummaryRow) {
      return;
    }

    const aggregateFieldConfigs = aggregateConfigs.filter(c =>
      aggregateFields.includes(c.uid),
    );
    if (!aggregateFieldConfigs.length) {
      return;
    }

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
          .map((k, index) => {
            const currentSummaryField = aggregateFieldConfigs.find(
              c => getValueByColumnKey(c) === k,
            );
            if (currentSummaryField) {
              const total = dataColumns.map(
                dc => dc?.[getValueByColumnKey(currentSummaryField)],
              );
              return (
                (!index
                  ? context?.translator?.('viz.palette.graph.summary') + ': '
                  : '') +
                toFormattedValue(
                  total.reduce((acc, cur) => acc + cur, 0),
                  currentSummaryField.format,
                )
              );
            }
            if (k === `${DATARTSEPERATOR}id` || !index) {
              return context?.translator?.('viz.palette.graph.summary');
            }
            return null;
          }),
      };
    };
  }

  private calcuteFieldsMaxWidth(
    mixedSectionConfigRows,
    dataColumns,
    styleConfigs,
    context,
  ) {
    const [fontFamily, fontSize, fontWeight] = getStyles(
      styleConfigs,
      ['tableBodyStyle'],
      ['fontFamily', 'fontSize', 'fontWeight'],
    );
    const [headerFont] = getStyles(
      styleConfigs,
      ['tableHeaderStyle'],
      ['font'],
    );
    const [tableHeaders] = getStyles(
      styleConfigs,
      ['header', 'modal'],
      ['tableHeaders'],
    );
    const [enableRowNumber] = getStyles(
      styleConfigs,
      ['style'],
      ['enableRowNumber'],
    );
    const getAllColumnListInfo = getValue(
      styleConfigs,
      ['column', 'modal', 'list'],
      'rows',
    );
    // todo
    const getRowNumberWidth = maxContent => {
      if (!enableRowNumber) {
        return 0;
      }

      return this.getTextWidth(
        context,
        maxContent,
        fontWeight,
        fontSize,
        fontFamily,
      );
    };
    const rowNumberUniqKeyWidth =
      getRowNumberWidth(dataColumns?.length) +
      this.tablePadding * 2 +
      this.tableCellBorder * 2;
    const rowNumberUniqKeyHeaderWidth = this.getTextWidth(
      context,
      context?.translator?.('viz.palette.graph.number'),
      headerFont?.fontWeight,
      headerFont?.fontSize,
      headerFont?.fontFamily,
    );
    const rowSummaryWidth = this.getTextWidth(
      context,
      context?.translator?.('viz.palette.graph.summary'),
      'normal',
      '14',
      'PingFang SC',
    );

    const maxContentByFields = mixedSectionConfigRows.map(c => {
      const header = this.findHeader(c.uid, tableHeaders);
      const rowUniqKey = getValueByColumnKey(c);

      const [columnWidth, getUseColumnWidth] = getStyles(
        getAllColumnListInfo,
        [c.uid, 'columnStyle'],
        ['columnWidth', 'useColumnWidth'],
      );
      const datas = dataColumns?.map(dc => {
        const text = dc[rowUniqKey];
        let width = this.getTextWidth(
          context,
          text,
          fontWeight,
          fontSize,
          fontFamily,
        );
        const headerWidth = this.getTextWidth(
          context,
          header?.label || getValueByColumnKey(header),
          headerFont?.fontWeight,
          headerFont?.fontSize,
          headerFont?.fontFamily,
        );
        const sorterIconWidth = 12;
        return Math.max(width, headerWidth + sorterIconWidth);
      });

      return {
        [rowUniqKey]: {
          columnWidthValue: getUseColumnWidth
            ? columnWidth || 100
            : Math.max(...datas) +
              this.tablePadding * 2 +
              this.tableCellBorder * 2,
          getUseColumnWidth,
        },
      };
    });
    maxContentByFields.push({
      [this.rowNumberUniqKey]: {
        columnWidthValue: enableRowNumber
          ? Math.max(
              rowNumberUniqKeyWidth,
              rowNumberUniqKeyHeaderWidth +
                this.tablePadding +
                this.tableCellBorder * 2,
              rowSummaryWidth + this.tablePadding + this.tableCellBorder * 2,
            )
          : 0,
      },
    });
    return maxContentByFields.reduce((acc, cur: any) => {
      return Object.assign({}, acc, { ...cur });
    }, {});
  }

  protected generateTableRowUniqId(dataColumns, mixedSectionConfigRows) {
    return (dataColumns || []).map(dc => {
      const config = Object.assign({}, dc);
      if (config.uid === null || config.uid === undefined) {
        config.uid = uuidv4();
      }
      mixedSectionConfigRows.map(mixed => {
        config[getValueByColumnKey(mixed)] = toFormattedValue(
          config[getValueByColumnKey(mixed)],
          mixed.format,
        );
      });
      return config;
    });
  }

  protected getTableComponents(styleConfigs, widgetSpecialConfig) {
    const linkFields = widgetSpecialConfig?.linkFields;
    const jumpField = widgetSpecialConfig?.jumpField;

    const [tableHeaders] = getStyles(
      styleConfigs,
      ['header', 'modal'],
      ['tableHeaders'],
    );
    const [headerBgColor, headerFont, headerTextAlign] = getStyles(
      styleConfigs,
      ['tableHeaderStyle'],
      ['bgColor', 'font', 'align'],
    );
    const [fontFamily, fontSize, fontWeight, fontStyle, bodyTextAlign] =
      getStyles(
        styleConfigs,
        ['tableBodyStyle'],
        ['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'align'],
      );
    const getAllColumnListInfo = getValue(
      styleConfigs,
      ['column', 'modal', 'list'],
      'rows',
    );
    let allConditionStyle: any[] = [];
    getAllColumnListInfo?.forEach(info => {
      const getConditionStyleValue = getStyles(
        info.rows,
        ['conditionStyle'],
        ['conditionStylePanel'],
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
          const [conditionStyle] = getStyles(
            getAllColumnListInfo,
            [uid, 'conditionStyle'],
            ['conditionStylePanel'],
          );
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
            fontFamily,
            fontWeight,
            fontStyle,
            fontSize: +fontSize,
          };
          return (
            <tbody {...rest} style={Object.assign(style || {}, bodyStyle)} />
          );
        },
      },
    };
  }

  protected getColumns(
    mixedSectionConfigRows,
    styleConfigs,
    dataColumns,
    context,
  ) {
    const [
      enableRowNumber,
      leftFixedColumns,
      rightFixedColumns,
      autoMergeFields,
    ] = getStyles(
      styleConfigs,
      ['style'],
      [
        'enableRowNumber',
        'leftFixedColumns',
        'rightFixedColumns',
        'autoMergeFields',
      ],
    );
    const [tableHeaderStyles] = getStyles(
      styleConfigs,
      ['header', 'modal'],
      ['tableHeaders'],
    );
    const _getFixedColumns = list => {
      let columnsList = CloneValueDeep(list);
      leftFixedColumns &&
        (columnsList = columnsList.map((item, index) => {
          if (index < Math.min(leftFixedColumns, columnsList.length - 1)) {
            item.fixed = 'left';
          }
          return item;
        }));
      rightFixedColumns &&
        (columnsList = columnsList
          .reverse()
          .map((item, index) => {
            if (index < rightFixedColumns && !item.fixed) {
              item.fixed = 'right';
            }
            return item;
          })
          .reverse());
      return columnsList;
    };

    const _getFlatColumns = (dataConfigs, dataColumns) => {
      const columnList = dataConfigs.map(c => {
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
        const columnConfig = this.dataColumnWidths?.[getValueByColumnKey(c)];
        const colMaxWidth =
          !this.exceedMaxContent &&
          Object.values<{ getUseColumnWidth: undefined | boolean }>(
            this.dataColumnWidths,
          ).some(item => item.getUseColumnWidth)
            ? columnConfig?.getUseColumnWidth
              ? columnConfig?.columnWidthValue
              : ''
            : columnConfig?.columnWidthValue;
        return {
          sorter: true,
          title: getColumnRenderName(c),
          dataIndex: getValueByColumnKey(c),
          key: getValueByColumnKey(c),
          aggregate: c?.aggregate,
          colName,
          width: colMaxWidth,
          fixed: null,
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
      return _getFixedColumns(columnList);
    };

    const _getFlattenedColumns = tableHeader => {
      const list: any = [];
      const _getFlattenedChildren = tableHeaderStylesConfig => {
        if (tableHeaderStylesConfig.children?.length) {
          tableHeaderStylesConfig.children.map(item =>
            _getFlattenedChildren(item),
          );
        } else {
          list.push(tableHeaderStylesConfig);
        }
      };
      tableHeader.forEach(item => {
        if (item.children?.length) {
          item.children.map(items => _getFlattenedChildren(items));
        } else {
          list.push(item);
        }
      });
      return list;
    };

    const _getGroupColumns = (tableHeader, dataColumns) => {
      const dataConfigs = _getFlattenedColumns(tableHeader);
      const flattenedColumns = _getFlatColumns(dataConfigs, dataColumns);
      const groupedHeaderColumns =
        tableHeader
          ?.map(style => this.getHeaderColumnGroup(style, flattenedColumns))
          ?.filter(Boolean) || [];

      const unusedHeaderRows = getUnusedHeaderRows(
        flattenedColumns,
        groupedHeaderColumns,
      );

      return groupedHeaderColumns.concat(unusedHeaderRows);
    };
    const columnsList =
      !tableHeaderStyles || tableHeaderStyles.length === 0
        ? _getFlatColumns(mixedSectionConfigRows, dataColumns)
        : _getGroupColumns(tableHeaderStyles, dataColumns);
    const rowNumbers = enableRowNumber
      ? [
          {
            key: `${DATARTSEPERATOR}id`,
            title: context?.translator?.('viz.palette.graph.number'),
            dataIndex: `${DATARTSEPERATOR}id`,
            width:
              this.dataColumnWidths?.[this.rowNumberUniqKey]
                ?.columnWidthValue || 0,
            fixed: leftFixedColumns || rightFixedColumns ? 'left' : null,
          } as any,
        ]
      : [];
    return rowNumbers.concat(columnsList);
  }

  private getHeaderColumnGroup(tableHeader, columns) {
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

  protected getAntdTableStyleOptions(styleConfigs?, settingConfigs?, context?) {
    const [enablePaging] = getStyles(
      settingConfigs,
      ['paging'],
      ['enablePaging'],
    );
    const [showTableBorder, enableFixedHeader] = getStyles(
      styleConfigs,
      ['style'],
      ['enableBorder', 'enableFixedHeader'],
    );
    const [tableHeaderStyles] = getStyles(
      styleConfigs,
      ['header', 'modal'],
      ['tableHeaders'],
    );
    const [font] = getStyles(styleConfigs, ['tableHeaderStyle'], ['font']);

    const [tableSize] = getStyles(styleConfigs, ['style'], ['tableSize']);
    const HEADER_PADDING = { default: 32, middle: 24, small: 16 };
    const TABLE_LINE_HEIGHT = 1.5715;
    const PAGINATION_HEIGHT = { default: 64, middle: 56, small: 56 };
    const SUMMRAY_ROW_HEIGHT = { default: 56, middle: 48, small: 40 };
    const _getMaxHeaderHierarchy = (headerStyles: Array<{ children: [] }>) => {
      const _maxDeeps = (arr: Array<{ children: [] }> = [], deeps: number) => {
        if (!isEmptyArray(arr) && arr?.length > 0) {
          return Math.max(...arr.map(a => _maxDeeps(a.children, deeps + 1)));
        }
        return deeps;
      };
      return _maxDeeps(headerStyles, 0) || 1;
    };
    const headerHeight =
      (Math.max(font.fontSize, 12) * TABLE_LINE_HEIGHT +
        HEADER_PADDING[tableSize || 'default'] +
        (showTableBorder ? this.tableCellBorder : 0)) *
        _getMaxHeaderHierarchy(tableHeaderStyles) +
      this.tableCellBorder;
    return {
      scroll: Object.assign({
        scrollToFirstRowOnChange: true,
        x: !enableFixedHeader
          ? '100%'
          : this.exceedMaxContent
          ? this.totalWidth
          : '100%',
        y: !enableFixedHeader
          ? '100%'
          : context?.height -
            (this.showSummaryRow
              ? SUMMRAY_ROW_HEIGHT[tableSize || 'default']
              : 0) -
            headerHeight -
            (enablePaging ? PAGINATION_HEIGHT[tableSize || 'default'] : 0),
      }),
      bordered: !!showTableBorder,
      size: tableSize || 'default',
    };
  }

  protected getPagingOptions(settingConfigs, pageInfo?) {
    const [enablePaging] = getStyles(
      settingConfigs,
      ['paging'],
      ['enablePaging'],
    );
    return enablePaging
      ? Object.assign({
          showSizeChanger: false,
          current: pageInfo?.pageNo,
          pageSize: pageInfo?.pageSize,
          total: pageInfo?.total,
        })
      : false;
  }

  private createrEventParams = params => ({
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

  private invokePagingRelatedEvents(
    seriesName: string,
    value: any,
    pageNo: number,
    aggOperator?: string,
  ) {
    const eventParams = this.createrEventParams({
      seriesType: 'paging-sort-filter',
      seriesName,
      value: {
        aggOperator: aggOperator,
        direction:
          value === undefined ? undefined : value === 'ascend' ? 'ASC' : 'DESC',
        pageNo,
      },
    });
    this.mouseEvents?.forEach(cur => {
      if (cur.name === 'click') {
        cur.callback?.(eventParams);
      }
    });
  }

  private registerTableCellEvents(
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
    return this.mouseEvents?.reduce((acc, cur) => {
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

  private getTextWidth = (
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

  private findHeader = (uid, headers) => {
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
