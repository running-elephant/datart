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
import { Button, Form, FormInstance, Input, Space } from 'antd';
import { DragSortEditTable } from 'app/components/DragSortEditTable';
import { FilterValueOption } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import React, { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
export interface FilterCustomOptionsProps {
  // [string]: any;
  form: FormInstance<any> | undefined;
  optionValues: FilterValueOption[];
}
export const FilterCustomOptions: React.FC<FilterCustomOptionsProps> = memo(
  ({ optionValues, form }) => {
    const [rows, setRows] = useState<FilterValueOption[]>([]);

    const onChangeFilterOptions = useCallback(
      (rows: FilterValueOption[]) => {
        setRows(rows);
        const widgetFilter = form?.getFieldValue('widgetFilter');
        form?.setFieldsValue({
          widgetFilter: {
            ...widgetFilter,
            filterValueOptions: [...rows.slice()],
          },
        });
      },
      [form],
    );

    useEffect(() => {
      const { filterValueOptions } = form?.getFieldValue('widgetFilter');
      setRows(filterValueOptions);
    }, [form]);
    const handleRowStateUpdate = useCallback(
      (row: FilterValueOption) => {
        const oldRowIndex = rows.findIndex(r => r.index === row.index);
        rows.splice(oldRowIndex, 1, row);
        onChangeFilterOptions(rows.slice());
      },
      [onChangeFilterOptions, rows],
    );

    const handleAdd = () => {
      const newKey = rows?.length + 1;
      const newRow: FilterValueOption = {
        index: newKey,
        key: String(newKey),
        label: String(newKey),
        isSelected: false,
      };
      const currentRows = rows.concat([newRow]);
      onChangeFilterOptions(currentRows);
    };
    const addRowByField = useCallback(() => {
      onChangeFilterOptions(optionValues);
    }, [onChangeFilterOptions, optionValues]);
    const handleDelete = (key: React.Key) => {
      const currentRows = rows.filter(r => r.key !== key);
      onChangeFilterOptions(currentRows);
    };
    const columns = [
      {
        title: '备选项值',
        dataIndex: 'key',
        width: '30%',
        sorter: (rowA, rowB) => {
          return String(rowA.key).localeCompare(rowB.key);
        },
        editable: true,
      },
      {
        title: '备选项标签',
        dataIndex: 'label',
        width: '40%',
        sorter: (rowA, rowB) => {
          return String(rowA.key).localeCompare(rowB.key);
        },
        editable: true,
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: '30%',
        render: (_, record: FilterValueOption) => (
          <Space>
            <a
              href="#!"
              style={{ color: record.isSelected ? 'red' : '' }}
              onClick={() =>
                handleRowStateUpdate(
                  Object.assign(record, { isSelected: !record.isSelected }),
                )
              }
            >
              {record.isSelected ? '取消默认值' : '设为默认值'}
            </a>

            <a href="#!" onClick={() => handleDelete(record.key)}>
              删除
            </a>
          </Space>
        ),
      },
    ];

    const columnsWithCell = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: FilterValueOption) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleRowStateUpdate,
        }),
      };
    });
    const moveRow = useCallback(
      (dragIndex, hoverIndex) => {
        const dragRow = rows[dragIndex];
        const newRows = rows.slice();
        newRows.splice(dragIndex, 1);
        newRows.splice(hoverIndex, 0, dragRow);
        setRows([...newRows]);
      },
      [rows],
    );
    return (
      <Wrap>
        <Form.Item
          noStyle
          shouldUpdate
          name={['widgetFilter', 'filterValueOptions']}
          label="备选项"
          preserve
          validateTrigger={['onBlur', 'onChange']}
          rules={[{ required: true }]}
        >
          <Input style={{ display: 'none' }}></Input>
        </Form.Item>
        <div>
          <Space>
            <Button onClick={addRowByField}>从字段填充备选项</Button>
            <Button onClick={handleAdd} type="primary">
              添加一条备选项
            </Button>
          </Space>
          <DragSortEditTable
            style={{ marginTop: 10 }}
            scroll={{ y: 240 }}
            dataSource={rows}
            size="small"
            bordered
            rowKey={(r: FilterValueOption) => `${r.key}-${r.label}`}
            columns={columnsWithCell}
            pagination={false}
            onRow={(_, index) =>
              ({
                index,
                moveRow,
              } as any)
            }
          />
        </div>
      </Wrap>
    );
  },
);
const Wrap = styled.div`
  display: block;
`;
