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
  ArrowDownOutlined,
  ArrowUpOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Button, Col, Input, Row, Space, Table } from 'antd';
import {
  ChartDataSectionType,
  ChartStyleSectionConfig,
} from 'app/types/ChartConfig';
import {
  diffHeaderRows,
  flattenHeaderRowsWithoutGroupRow,
  getColumnRenderName,
} from 'app/utils/chartHelper';
import { DATARTSEPERATOR } from 'globalConstants';
import { FC, memo, useState } from 'react';
import styled from 'styled-components';
import { CloneValueDeep } from 'utils/object';
import { BaiscSelector, BasicColorSelector, BasicFont } from '../Basic';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const { Search } = Input;

interface RowValue {
  uid?: string;
  colName: string;
  isGroup?: boolean;
  label?: string;
  aggregate?: string;
  style?: {
    backgroundColor?: string;
    font?: {};
    align?: string;
  };
  children?: RowValue[];
}

const UnControlledTableHeaderPanel: FC<
  ItemLayoutProps<ChartStyleSectionConfig>
> = memo(
  ({
    ancestors,
    translate: t = title => title,
    data,
    onChange,
    dataConfigs,
  }) => {
    const [selectedRowUids, setSelectedRowUids] = useState<string[]>([]);
    const [myData, setMyData] = useState(() => CloneValueDeep(data));
    const [tableDataSource, setTableDataSource] = useState<RowValue[]>(() => {
      const currentHeaderRows = (CloneValueDeep(dataConfigs) || [])
        .filter(
          c =>
            ChartDataSectionType.AGGREGATE === c.type ||
            ChartDataSectionType.GROUP === c.type ||
            ChartDataSectionType.MIXED === c.type,
        )
        .flatMap(config => config.rows || []);

      const oldGroupedHeaderRows: RowValue[] = myData?.value || [];
      const oldFlattenedHeaderRows: RowValue[] = oldGroupedHeaderRows.flatMap(
        row => flattenHeaderRowsWithoutGroupRow(row),
      );
      const isChanged = diffHeaderRows(
        oldFlattenedHeaderRows,
        currentHeaderRows,
      );
      if (!isChanged) {
        oldFlattenedHeaderRows.forEach(oldRow => {
          const current = currentHeaderRows?.find(v => v.uid === oldRow.uid);
          Object.assign(oldRow, current);
        });
        return oldGroupedHeaderRows;
      }

      return (CloneValueDeep(dataConfigs) || [])
        .filter(
          c =>
            ChartDataSectionType.AGGREGATE === c.type ||
            ChartDataSectionType.GROUP === c.type ||
            ChartDataSectionType.MIXED === c.type,
        )
        .flatMap(config => config.rows || [])
        .map(r => {
          const previous = oldFlattenedHeaderRows?.find(v => v.uid === r.uid);
          return { ...previous, ...r };
        });
    });

    const mergeRowToGroup = () => {
      if (selectedRowUids.length === 0) {
        return;
      }
      const lineageRowUids = selectedRowUids.map(uid =>
        getAncestorRowUids(undefined, uid, tableDataSource),
      );
      const noDuplicateLineageRows =
        mergeSameLineageAncesterRows(lineageRowUids);
      const ancestorsRows = makeSameLinageRows(noDuplicateLineageRows);
      const newDataSource = groupTreeNode(ancestorsRows, tableDataSource);

      handleConfigChange([...newDataSource]);
    };

    const mergeSameLineageAncesterRows = lineageRowUids => {
      const allRowKeys = lineageRowUids.map((lr: string[]) =>
        lr.join(DATARTSEPERATOR),
      );
      return lineageRowUids.reduce((acc, next) => {
        const key = next.join(DATARTSEPERATOR);
        if (allRowKeys.some(k => k.includes(key) && k.length !== key.length)) {
          return acc;
        }
        return acc.concat([next]);
      }, []);
    };

    const makeSameLinageRows = rowAncestors => {
      if (rowAncestors && rowAncestors.length === 0) {
        return [];
      }
      const theSortestLength = Math.min(...rowAncestors.map(ra => ra.length));
      let ancestorGeneration = 0;
      for (let i = 0; i < theSortestLength; i++) {
        const ancestor = rowAncestors[0][i];
        if (rowAncestors.every(a => a[i] === ancestor)) {
          ancestorGeneration = i;
        } else {
          break;
        }
      }
      return rowAncestors
        .map(ra => ra.slice(0, ancestorGeneration + 1))
        .reduce((acc, next) => {
          const key = next.join(DATARTSEPERATOR);
          const allRowKeys = acc.map(lr => lr.join(DATARTSEPERATOR));
          if (allRowKeys.includes(key)) {
            return acc;
          }
          return acc.concat([next]);
        }, []);
    };

    const getAncestorRowUids = (parentUid, rowUid, treeRows) => {
      if (treeRows.find(tr => tr.uid === rowUid)) {
        return !!parentUid ? [parentUid, rowUid] : [rowUid];
      }
      return treeRows.reduce((acc, next) => {
        return acc.concat(
          getAncestorRowUids(next.uid, rowUid, next.children || []),
        );
      }, []);
    };

    const groupTreeNode = (rowAncestors, collection) => {
      if (rowAncestors && rowAncestors.length <= 1) {
        return collection;
      }

      const rows = collection || [];
      const linageGeneration = rowAncestors[0].length - 1;
      if (linageGeneration === 0) {
        const mergedKeys = rowAncestors.flatMap(ra => ra);
        return mergeBrotherRows(mergedKeys, rows);
      } else {
        const ancestor = rowAncestors[0][0];
        const subRowAncestors = rowAncestors.map(ra => ra.slice(1));
        const childRow = rows.find(c => c.colName === ancestor);
        childRow.children = groupTreeNode(subRowAncestors, childRow.children);
        return rows;
      }
    };

    const mergeBrotherRows = (mergeKeys: string[], rows: RowValue[]) => {
      const selectedRows = rows.filter(r => mergeKeys.includes(r.uid!));
      const restRows = rows.filter(r => !mergeKeys.includes(r.uid!));
      const insertIndex = rows.findIndex(r => r.uid === mergeKeys[0]);
      const groupRowUid = selectedRows.map(d => d.uid).join(DATARTSEPERATOR);
      const groupRow = {
        uid: groupRowUid,
        colName: groupRowUid,
        label: 'Please input header name',
        isGroup: true,
        children: selectedRows,
      };
      if (!restRows.find(rr => rr.uid === groupRowUid)) {
        restRows.splice(insertIndex, 0, groupRow);
      }
      return restRows;
    };

    const handleRowMoveUp = () => {
      selectedRowUids.forEach(rowUid => {
        const brotherRows = findRowBrothers(rowUid, tableDataSource);
        const idx = brotherRows.findIndex(s => s.uid === rowUid);
        if (idx < 1) {
          return;
        }
        const temp = brotherRows[idx - 1];
        brotherRows[idx - 1] = brotherRows[idx];
        brotherRows[idx] = temp;
      });
      handleConfigChange([...tableDataSource]);
    };

    const handleRowMoveDown = () => {
      selectedRowUids.forEach(uid => {
        const brotherRows = findRowBrothers(uid, tableDataSource);
        const idx = brotherRows.findIndex(s => s.uid === uid);
        if (idx >= brotherRows.length - 1) {
          return;
        }
        const temp = brotherRows[idx];
        brotherRows[idx] = brotherRows[idx + 1];
        brotherRows[idx + 1] = temp;
        handleConfigChange([...tableDataSource]);
      });
    };

    const handleTableRowChange = rowUid => style => prop => (_, value) => {
      const brotherRows = findRowBrothers(rowUid, tableDataSource);
      const row = brotherRows.find(r => r.uid === rowUid);

      if (!row) {
        return;
      }
      if (style) {
        row.style = Object.assign({}, row.style, {
          ...row.style,
          [prop]: value,
        });
      } else {
        row[prop] = value;
      }
      handleConfigChange([...tableDataSource]);
    };

    const handleDeleteGroupRow = rowUid => {
      const brotherRows = findRowBrothers(rowUid, tableDataSource);
      const idx = brotherRows.findIndex(s => s.uid === rowUid);
      brotherRows.splice(idx, 1, ...(brotherRows[idx].children || []));
      handleConfigChange([...tableDataSource]);
    };

    const handleConfigChange = (dataSource: RowValue[]) => {
      myData.value = dataSource;
      setTableDataSource(dataSource);
      setMyData(myData);
      onChange?.(ancestors, myData);
    };

    const findRowBrothers = (uid, rows) => {
      let row = rows.find(r => r.uid === uid);
      if (!!row) {
        return rows;
      }
      let subRows = [];
      for (let i = 0; i < rows.length; i++) {
        subRows = findRowBrothers(uid, rows[i].children || []);
        if (!!subRows && subRows.length > 0) {
          break;
        }
      }
      return subRows;
    };

    const tableColumnsSettings = [
      {
        title: t('table.header.columnName'),
        dataIndex: 'colName',
        key: 'colName',
        render: (_, record) => {
          const { label, isGroup, uid } = record;
          return isGroup ? (
            <>
              <EditableLabel
                label={label}
                onChange={value =>
                  handleTableRowChange(uid)(undefined)('label')([], value)
                }
              />
              <DeleteOutlined onClick={_ => handleDeleteGroupRow(uid)} />
            </>
          ) : (
            getColumnRenderName(record)
          );
        },
      },
      {
        title: t('table.header.backgroundColor'),
        dataIndex: 'backgroundColor',
        key: 'backgroundColor',
        width: 100,
        render: (_, record) => {
          const { style, uid } = record;
          const row = {
            label: 'column.backgroundColor',
            key: 'backgroundColor',
            comType: 'fontColor',
            value: style?.backgroundColor,
            options: {
              hideLabel: true,
            },
          };
          return (
            <BasicColorSelector
              ancestors={ancestors}
              data={row}
              translate={t}
              onChange={handleTableRowChange(uid)('style')('backgroundColor')}
            />
          );
        },
      },
      {
        title: t('table.header.font'),
        dataIndex: 'font',
        key: 'font',
        width: 500,
        render: (_, record) => {
          const { style, uid } = record;
          const row = {
            label: 'column.font',
            key: 'font',
            comType: 'font',
            value: style?.font?.value,
            options: {
              hideLabel: true,
            },
            default: {
              fontFamily: 'PingFang SC',
              fontSize: '12',
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: 'black',
            },
          };
          return (
            <BasicFont
              ancestors={ancestors}
              data={row}
              translate={t}
              onChange={handleTableRowChange(uid)('style')('font')}
            />
          );
        },
      },
      {
        title: t('table.header.align.title'),
        dataIndex: 'align',
        key: 'align',
        width: 150,
        render: (_, record) => {
          const { style, uid } = record;
          const row = {
            label: 'column.align',
            key: 'align',
            comType: 'select',
            default: 'left',
            value: style?.align,
            options: {
              hideLabel: true,
              items: [
                { label: t('table.header.align.left'), value: 'left' },
                { label: t('table.header.align.center'), value: 'center' },
                { label: t('table.header.align.right'), value: 'right' },
              ],
            },
          };
          return (
            <BaiscSelector
              ancestors={ancestors}
              data={row}
              translate={t}
              onChange={handleTableRowChange(uid)('style')('align')}
            />
          );
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys: selectedRowUids,
      onChange: (selectedRowKeys: any[]) => {
        setSelectedRowUids(selectedRowKeys);
      },
    };

    return (
      <StyledUnControlledTableHeaderPanel direction="vertical">
        <Row gutter={24}>
          <Col span={4}>
            <Button
              disabled={selectedRowUids.length === 0}
              type="primary"
              onClick={mergeRowToGroup}
            >
              {t('table.header.merge')}
            </Button>
          </Col>
          <Col span={20}>
            <Row justify="end" align="middle">
              <Space>
                <Button
                  disabled={selectedRowUids.length === 0}
                  icon={<ArrowUpOutlined />}
                  onClick={handleRowMoveUp}
                >
                  {t('table.header.moveUp')}
                </Button>
                <Button
                  disabled={selectedRowUids.length === 0}
                  icon={<ArrowDownOutlined />}
                  onClick={handleRowMoveDown}
                >
                  {t('table.header.moveDown')}
                </Button>
              </Space>
            </Row>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Table
              bordered={true}
              pagination={false}
              {...myData}
              rowKey={record => record.uid!}
              columns={tableColumnsSettings}
              dataSource={tableDataSource}
              rowSelection={rowSelection}
            />
          </Col>
        </Row>
      </StyledUnControlledTableHeaderPanel>
    );
  },
  itemLayoutComparer,
);

const EditableLabel: FC<{
  label: string;
  editable?: Boolean;
  onChange: (value: string) => void;
}> = memo(({ label, editable = true, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  const render = () => {
    if (!editable) {
      return <span>{label}</span>;
    }
    return isEditing ? (
      <Search
        enterButton={<CheckOutlined />}
        placeholder={label}
        size="small"
        onSearch={value => {
          if (!!value) {
            setIsEditing(false);
            onChange(value);
          }
        }}
      />
    ) : (
      <>
        <span>{label}</span>
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => setIsEditing(true)}
        ></Button>
      </>
    );
  };

  return render();
});

const StyledUnControlledTableHeaderPanel = styled(Space)`
  width: 100%;
  margin-top: 10px;
`;

export default UnControlledTableHeaderPanel;
