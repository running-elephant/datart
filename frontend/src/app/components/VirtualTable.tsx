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

/**
 * Table组件中使用了虚拟滚动条 渲染的速度变快 基于（react-windows）
 * 使用方法：import { VirtualTable } from 'app/components/VirtualTable';
 * <VirtualTable
    dataSource={dataSourceWithKey}
    columns={columns}
    width={width}
    ...tableProps
  />
 */

import { Empty, Table, TableProps } from 'antd';
import classNames from 'classnames';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import { CloneValueDeep } from 'utils/object';
interface VirtualTableProps extends TableProps<object> {
  width: number;
  scroll: { x: number; y: number };
  columns: any;
}

export const VirtualTable = memo((props: VirtualTableProps) => {
  let firstTime = new Date().getTime();
  console.log(firstTime, 'firstTime');
  const { columns: tableColumns, scroll, width: boxWidth, dataSource } = props;
  const columns = CloneValueDeep(tableColumns);
  const gridRef: any = useRef();
  const isFull = useRef<boolean>(false);
  const widthColumnCount = columns.filter(({ width }) => !width).length;
  const [connectObject] = useState(() => {
    const obj = {};
    Object.defineProperty(obj, 'scrollLeft', {
      get: () => null,
      set: scrollLeft => {
        if (gridRef.current) {
          gridRef.current.scrollTo({
            scrollLeft,
          });
        }
      },
    });
    return obj;
  });
  isFull.current = boxWidth > scroll.x;

  if (isFull.current === true) {
    columns.forEach((v, i) => {
      return (columns[i].width =
        columns[i].width + (boxWidth - scroll.x) / columns.length);
    });
  }

  const mergedColumns = useMemo(() => {
    return columns.map(column => {
      if (column.width) {
        return column;
      }

      return { ...column, width: Math.floor(boxWidth / widthColumnCount) };
    });
  }, [boxWidth, columns, widthColumnCount]);
  console.log(new Date().getTime() - firstTime);
  const resetVirtualGrid = useCallback(() => {
    console.log('resetVirtualGrid');
    gridRef.current?.resetAfterIndices({
      columnIndex: 0,
      shouldForceUpdate: true,
    });
  }, [gridRef]);

  useEffect(() => resetVirtualGrid, [boxWidth, dataSource, resetVirtualGrid]);

  const renderVirtualList = useCallback(
    (rawData, { scrollbarSize, ref, onScroll }) => {
      ref.current = connectObject;
      const totalHeight = rawData.length * 39;

      if (!dataSource?.length) {
        //如果数据为空 If the data is empty
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
      }

      return (
        <Grid
          ref={gridRef}
          className="virtual-grid"
          columnCount={mergedColumns.length}
          columnWidth={index => {
            const { width } = mergedColumns[index];
            return totalHeight > scroll.y && index === mergedColumns.length - 1
              ? width - scrollbarSize - 16
              : width;
          }}
          height={scroll.y}
          rowCount={rawData.length}
          rowHeight={() => 39}
          width={boxWidth}
          onScroll={({ scrollLeft }) => {
            onScroll({
              scrollLeft,
            });
          }}
        >
          {({ rowIndex, columnIndex, style }) => {
            style = {
              padding: '8px',
              textAlign: mergedColumns[columnIndex].align,
              ...style,
              borderBottom: '1px solid #f0f0f0',
            };
            return (
              <div
                className={classNames('virtual-table-cell', {
                  'virtual-table-cell-last':
                    columnIndex === mergedColumns.length - 1,
                })}
                style={style}
                key={columnIndex}
              >
                {rawData[rowIndex][mergedColumns[columnIndex].dataIndex]}
              </div>
            );
          }}
        </Grid>
      );
    },
    [mergedColumns, boxWidth, connectObject, dataSource, scroll],
  );

  return (
    <Table
      {...props}
      columns={mergedColumns}
      components={{
        body: renderVirtualList,
        ...props.components,
      }}
    />
  );
});
