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
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import { ChartDataViewFieldType } from 'app/types/ChartDataView';
import {
  getColumnRenderName,
  getStyles,
  getUnusedHeaderRows,
  getValue,
  toFormattedValue,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { DATARTSEPERATOR } from 'globalConstants';
import { Debugger } from 'utils/debugger';
import { CloneValueDeep, isEmptyArray, Omit } from 'utils/object';
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
  pageInfo = {
    pageNo: 0,
    pageSize: 0,
    total: 0,
  };

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
    const columns = this.getDataColumnWidths(options, context);
    const tableOptions = Object.assign(
      this.cachedAntTableOptions,
      {
        ...this.getAntdTableStyleOptions(
          this.cachedDatartConfig?.styles,
          this.cachedDatartConfig?.settings!,
          context,
        ),
      },
      { columns },
    );
    this.adapter?.updated(tableOptions, context);
  }

  protected getOptions(
    context,
    dataset?: ChartDataSetDTO,
    config?: ChartConfig,
    widgetSpecialConfig?: any,
  ) {
    if (!dataset || !config) {
      return { locale: { emptyText: '  ' } };
    }

    const dataConfigs = config.datas || [];
    const styleConfigs = config.styles || [];
    const settingConfigs = config.settings || [];
    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    const mixedSectionConfigRows = dataConfigs
      .filter(c => c.key === 'mixed')
      .flatMap(config => config.rows || []);
    const aggregateConfigs = mixedSectionConfigRows.filter(
      r => r.type === ChartDataViewFieldType.NUMERIC,
    );
    this.dataColumnWidths = this.calcuteFieldsMaxWidth(
      mixedSectionConfigRows,
      chartDataSet,
      styleConfigs,
      context,
    );
    this.totalWidth = Object.values<any>(this.dataColumnWidths).reduce(
      (a, b) => a + (b.columnWidthValue || 0),
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
      chartDataSet,
      context,
    );
    return {
      rowKey: 'id',
      pagination: tablePagination,
      dataSource: chartDataSet.map(row => row.convertToObject()),
      columns: tableColumns,
      summaryFn: this.getTableSummaryFn(
        settingConfigs,
        chartDataSet,
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
      tableStyleConfig: this.getTableStyle(styleConfigs),
    };
  }

  private getDataColumnWidths(options, context) {
    const dataConfigs = options.config.datas || [];
    const styleConfigs = options.config.styles || [];

    const chartDataSet = transformToDataSet(
      options.dataset.rows,
      options.dataset.columns,
      dataConfigs,
    );

    const mixedSectionConfigRows = dataConfigs
      .filter(c => c.key === 'mixed')
      .flatMap(config => config.rows || []);
    this.dataColumnWidths = this.calcuteFieldsMaxWidth(
      mixedSectionConfigRows,
      chartDataSet as IChartDataSet<string>,
      styleConfigs,
      context,
    );
    this.totalWidth = Object.values<any>(this.dataColumnWidths).reduce(
      (a, b) => a + (b.columnWidthValue || 0),
      0,
    );
    this.exceedMaxContent = this.totalWidth >= context.width;
    return this.getColumns(
      mixedSectionConfigRows,
      styleConfigs,
      chartDataSet,
      context,
    );
  }

  private getTableStyle(styles) {
    const [oddBgColor, oddFontColor, evenBgColor, evenFontColor] = getStyles(
      styles,
      ['tableBodyStyle'],
      ['oddBgColor', 'oddFontColor', 'evenBgColor', 'evenFontColor'],
    );
    const [rightFixedColumns] = getStyles(
      styles,
      ['style'],
      ['rightFixedColumns'],
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
      isFixedColumns: rightFixedColumns ? true : false,
    };
  }

  private getTableSummaryFn(
    settingConfigs,
    chartDataSet,
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
              c => chartDataSet.getFieldKey(c) === k,
            );
            if (currentSummaryField) {
              const total = chartDataSet?.map((dc: any) =>
                dc.getCell(currentSummaryField),
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
    chartDataSet: IChartDataSet<string>,
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
      getRowNumberWidth(chartDataSet?.length) +
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
      const rowUniqKey = chartDataSet.getFieldKey(c);

      const [columnWidth, getUseColumnWidth] = getStyles(
        getAllColumnListInfo,
        [c.uid, 'columnStyle'],
        ['columnWidth', 'useColumnWidth'],
      );
      const datas = chartDataSet?.map(dc => {
        const text = dc.getCell(c);
        let width = this.getTextWidth(
          context,
          text,
          fontWeight,
          fontSize,
          fontFamily,
        );
        const headerWidth = this.getTextWidth(
          context,
          header?.label || chartDataSet.getFieldKey(c),
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
            : (datas.length ? Math.max(...datas) : 0) +
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
                this.tablePadding * 2 +
                this.tableCellBorder * 2,
              rowSummaryWidth +
                this.tablePadding * 2 +
                this.tableCellBorder * 2,
            )
          : 0,
      },
    });
    return maxContentByFields.reduce((acc, cur: any) => {
      return Object.assign({}, acc, { ...cur });
    }, {});
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
      const [getConditionStyleValue] = getStyles(
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
    chartDataSet,
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

    const _getFlatColumns = (dataConfigs, chartDataSet) => {
      const columnList = dataConfigs.map(c => {
        const colName = c.colName;
        const columnRowSpans = (autoMergeFields || []).includes(c.uid)
          ? chartDataSet
              ?.map(dc => dc.getCell(c))
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
              }, [] as any[])
              .map(x => x.rowSpan)
              .reverse()
          : [];
        const columnConfig =
          this.dataColumnWidths?.[chartDataSet.getFieldKey(c)];
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
          dataIndex: chartDataSet.getFieldKey(c),
          key: chartDataSet.getFieldKey(c),
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
            const row = chartDataSet[rowIndex];
            const cellValue = row.getCell(c);
            return {
              uid: c.uid,
              cellValue,
              dataIndex: row.getFieldKey(c),
              ...this.registerTableCellEvents(
                row.getFieldKey(c),
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

    const _getFlattenedColumns = (tableHeader, mixedSectionConfigRows) => {
      const list: any = [];
      const _getFlattenedChildren = tableHeaderStylesConfig => {
        if (tableHeaderStylesConfig.children?.length) {
          tableHeaderStylesConfig.children.map(item =>
            _getFlattenedChildren(item),
          );
        } else {
          const currentConfig = mixedSectionConfigRows?.find(
            c => c.uid === tableHeaderStylesConfig.uid,
          );
          list.push(Object.assign({}, tableHeaderStylesConfig, currentConfig));
        }
      };
      tableHeader.forEach(item => {
        if (item.children?.length) {
          item.children.map(items => _getFlattenedChildren(items));
        } else {
          const currentConfig = mixedSectionConfigRows?.find(
            c => c.uid === item.uid,
          );
          list.push(Object.assign({}, item, currentConfig));
        }
      });
      return list;
    };

    const _getGroupColumns = (
      mixedSectionConfigRows,
      tableHeader,
      chartDataSet,
    ) => {
      const dataConfigs = _getFlattenedColumns(
        tableHeader,
        mixedSectionConfigRows,
      );
      const flattenedColumns = _getFlatColumns(dataConfigs, chartDataSet);
      const groupedHeaderColumns =
        tableHeader
          ?.map(style =>
            this.getHeaderColumnGroup(chartDataSet, style, flattenedColumns),
          )
          ?.filter(Boolean) || [];

      const unusedHeaderRows = getUnusedHeaderRows(
        flattenedColumns,
        groupedHeaderColumns,
      );

      return groupedHeaderColumns.concat(unusedHeaderRows);
    };
    const columnsList =
      !tableHeaderStyles || tableHeaderStyles.length === 0
        ? _getFlatColumns(mixedSectionConfigRows, chartDataSet)
        : _getGroupColumns(
            mixedSectionConfigRows,
            tableHeaderStyles,
            chartDataSet,
          );
    const rowNumbers = enableRowNumber
      ? [
          {
            key: `${DATARTSEPERATOR}id`,
            title: context?.translator?.('viz.palette.graph.number'),
            width:
              this.dataColumnWidths?.[this.rowNumberUniqKey]
                ?.columnWidthValue || 0,
            fixed: leftFixedColumns || rightFixedColumns ? 'left' : null,
            render: (value, row, rowIndex) => {
              return (
                (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize +
                rowIndex +
                1
              );
            },
          } as any,
        ]
      : [];
    return rowNumbers.concat(columnsList);
  }

  private getHeaderColumnGroup(chartDataSet, tableHeader, columns) {
    if (!tableHeader.isGroup) {
      const column = columns.find(
        c => c.key === chartDataSet.getFieldKey(tableHeader),
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
          return this.getHeaderColumnGroup(chartDataSet, th, columns);
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
      ((font?.fontSize || 0) * TABLE_LINE_HEIGHT +
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
    this.pageInfo = pageInfo;
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
