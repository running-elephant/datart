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

import { Button, Space } from 'antd';
import DragSortEditTable from 'app/components/DragSortEditTable';
import useI18NPrefix, { I18NComponentProps } from 'app/hooks/useI18NPrefix';
import { FilterValueOption } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataView from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import ChartFilterCondition, {
  ConditionBuilder,
} from 'app/pages/ChartWorkbenchPage/models/ChartFilterCondition';
import { getDistinctFields } from 'app/utils/fetch';
import { FilterSqlOperator } from 'globalConstants';
import { FC, memo, useCallback, useEffect, useState } from 'react';

const CategoryConditionEditableTable: FC<
  {
    condition?: ChartFilterCondition;
    dataView?: ChartDataView;
    onConditionChange: (condition: ChartFilterCondition) => void;
    fetchDataByField?: (fieldId) => Promise<string[]>;
  } & I18NComponentProps
> = memo(
  ({
    i18nPrefix,
    condition,
    dataView,
    onConditionChange,
    fetchDataByField,
  }) => {
    const t = useI18NPrefix(i18nPrefix);
    const [rows, setRows] = useState<FilterValueOption[]>([]);
    const [showPopover, setShowPopover] = useState(false);

    useEffect(() => {
      if (Array.isArray(condition?.value)) {
        setRows(condition?.value as FilterValueOption[]);
      } else {
        setRows([]);
      }
    }, [condition?.value]);

    const columns = [
      {
        title: t('tableHeaderKey'),
        dataIndex: 'key',
        width: '40%',
        sorter: (rowA, rowB) => {
          return String(rowA.key).localeCompare(rowB.key);
        },
        editable: true,
      },
      {
        title: t('tableHeaderLabel'),
        dataIndex: 'label',
        width: '40%',
        sorter: (rowA, rowB) => {
          return String(rowA.key).localeCompare(rowB.key);
        },
        editable: true,
      },
      {
        title: t('tableHeaderAction'),
        dataIndex: 'action',
        width: 80,
        render: (_, record: FilterValueOption) => (
          <Space>
            {!record.isSelected && (
              <a
                href="#!"
                onClick={() =>
                  handleRowStateUpdate(
                    Object.assign(record, { isSelected: true }),
                  )
                }
              >
                {t('setDefault')}
              </a>
            )}
            {record.isSelected && (
              <a
                href="#!"
                onClick={() =>
                  handleRowStateUpdate(
                    Object.assign(record, { isSelected: false }),
                  )
                }
              >
                {t('setUnDefault')}
              </a>
            )}
            <a href="#!" onClick={() => handleDelete(record.key)}>
              {t('deleteRow')}
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

    const handleFilterConditionChange = currentVales => {
      setRows([...currentVales]);
      const filter = new ConditionBuilder(condition)
        .setOperator(FilterSqlOperator.In)
        .setValue(currentVales)
        .asCustomize();
      onConditionChange(filter);
    };

    const handleDelete = (key: React.Key) => {
      const currentRows = rows.filter(r => r.key !== key);
      handleFilterConditionChange(currentRows);
    };

    const handleAdd = () => {
      const newKey = rows?.length + 1;
      const newRow: FilterValueOption = {
        key: String(newKey),
        label: String(newKey),
        isSelected: false,
      };
      const currentRows = rows.concat([newRow]);
      handleFilterConditionChange(currentRows);
    };

    const handleRowStateUpdate = (row: FilterValueOption) => {
      const oldRowIndex = rows.findIndex(r => r.index === row.index);
      rows.splice(oldRowIndex, 1, row);
      handleFilterConditionChange(rows);
    };

    const handleFetchDataFromField = field => async () => {
      setShowPopover(false);
      if (fetchDataByField) {
        const dataset = await fetchNewDataset(dataView?.id!, field);
        const newRows = convertToList(dataset?.rows, []);
        setRows(newRows);
        handleFilterConditionChange(newRows);
      }
    };

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

    const fetchNewDataset = async (viewId, colName) => {
      const feildDataset = await getDistinctFields(
        viewId,
        colName,
        undefined,
        undefined,
      );
      return feildDataset;
    };

    const convertToList = (collection, selecteKeys) => {
      const items: string[] = (collection || []).flatMap(c => c);
      const uniqueKeys = Array.from(new Set(items));
      return uniqueKeys.map((item, index) => ({
        index: index,
        key: item,
        label: item,
        isSelected: selecteKeys.includes(item),
      }));
    };

    return (
      <div>
        <Space>
          <Button onClick={handleAdd} type="primary">
            {t('addRow')}
          </Button>
          <Button onClick={handleFetchDataFromField(condition?.name)}>
            {t('AddFromFields')}
          </Button>
        </Space>
        <DragSortEditTable
          style={{ marginTop: 10 }}
          dataSource={rows}
          size="small"
          bordered
          rowKey={(r: FilterValueOption) => `${r.key}-${r.label}`}
          columns={columnsWithCell}
          pagination={false}
          // onMoveRowEnd={onMoveRowEnd}
          onRow={(_, index) =>
            ({
              index,
              moveRow,
            } as any)
          }
        />
      </div>
    );
  },
);

export default CategoryConditionEditableTable;
