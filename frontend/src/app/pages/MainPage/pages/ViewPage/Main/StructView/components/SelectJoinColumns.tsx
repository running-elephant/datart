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

import { TreeSelect } from 'antd';
import { memo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { SPACE_SM } from 'styles/StyleConstants';
import { JoinTableProps, StructViewQueryProps } from '../../../slice/types';

interface SelectJoinColumnsProps {
  tableJSON: StructViewQueryProps;
  joinTable: JoinTableProps;
  callbackFn: (field, type, index) => void;
  conditionsIndex: number;
  joinIndex: number;
}

const SelectJoinColumns = memo(
  ({
    tableJSON,
    callbackFn,
    joinTable,
    conditionsIndex,
    joinIndex,
  }: SelectJoinColumnsProps) => {
    const handleLeftColumn = useCallback(() => {
      const tableName = tableJSON.table;
      const childrenData = tableJSON['columns']?.map((v, i) => {
        return { title: v, key: [...tableName, v] };
      });
      const joinTable: any = [];
      for (let i = 0; i < joinIndex; i++) {
        const tableName = tableJSON.joins[i].table!;
        const childrenData = tableJSON.joins[i]['columns']?.map((v, i) => {
          return { title: v, key: [...tableName, v] };
        });
        joinTable.push({
          title: tableName,
          key: tableName,
          selectable: false,
          children: childrenData,
        });
      }
      const treeData = [
        {
          title: tableName[tableName.length - 1],
          key: tableName[tableName.length - 1],
          selectable: false,
          children: childrenData,
        },
        ...joinTable,
      ];
      return treeData;
    }, [joinIndex, tableJSON]);

    const handleRightColumn = useCallback((): any => {
      const joinTableName = joinTable.table!;
      const childrenData = joinTable.columns?.map((v, i) => {
        return { title: v, key: [...joinTableName, v] };
      });
      const treeData: any = [
        {
          title: joinTableName[joinTableName.length - 1],
          key: joinTableName,
          selectable: false,
          children: childrenData,
        },
      ];
      return treeData;
    }, [joinTable.table, joinTable.columns]);

    useEffect(() => {
      handleLeftColumn();
    }, [handleLeftColumn]);

    return (
      <JoinColumnsWrapper key={conditionsIndex}>
        <TreeSelect
          allowClear
          style={{ minWidth: '100px' }}
          placeholder={'选择一个字段'}
          treeDefaultExpandAll={true}
          value={joinTable.conditions?.[conditionsIndex]?.left.slice(-1)}
          onChange={columnName => {
            callbackFn(columnName || [], 'left', conditionsIndex);
          }}
          treeData={handleLeftColumn()}
        ></TreeSelect>
        <JoinConditionLabel>=</JoinConditionLabel>
        <TreeSelect
          allowClear
          style={{ minWidth: '100px' }}
          placeholder={'选择一个字段'}
          treeDefaultExpandAll={true}
          value={joinTable.conditions?.[conditionsIndex]?.right.slice(-1)}
          onChange={(columnName, label) => {
            callbackFn(columnName || [], 'right', conditionsIndex);
          }}
          treeData={handleRightColumn()}
        ></TreeSelect>
      </JoinColumnsWrapper>
    );
  },
);

const JoinColumnsWrapper = styled.div``;

const JoinConditionLabel = styled.span`
  margin: 0 ${SPACE_SM};
`;

export default SelectJoinColumns;
