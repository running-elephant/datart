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
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { DatabaseSchema } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SPACE_SM } from 'styles/StyleConstants';
import { selectAllSourceDatabaseSchemas } from '../../../slice/selectors';
import { JoinTableProps, StructViewQueryProps } from '../../../slice/types';

interface SelectJoinColumnsProps {
  structure: StructViewQueryProps;
  joinTable: JoinTableProps;
  conditionsIndex: number;
  joinIndex: number;
  sourceId: string;
  onChange: (field, type, index) => void;
}

const SelectJoinColumns = memo(
  ({
    structure,
    joinTable,
    conditionsIndex,
    joinIndex,
    sourceId,
    onChange,
  }: SelectJoinColumnsProps) => {
    const t = useI18NPrefix(`view.structView`);
    const allDatabaseSchemas = useSelector(selectAllSourceDatabaseSchemas);

    const currentDatabaseSchemas = useMemo((): DatabaseSchema[] => {
      return allDatabaseSchemas[sourceId];
    }, [allDatabaseSchemas, sourceId]);

    const getTableColumns = useCallback(
      joinTableName => {
        const column =
          joinTableName.length === 1
            ? currentDatabaseSchemas[0].tables
                .find(v => v.tableName === joinTableName[0])
                ?.columns.map(v => {
                  return v.name[0];
                })
            : currentDatabaseSchemas
                ?.find(v => v.dbName === joinTableName?.[0])
                ?.tables.find(v => v.tableName === joinTableName[1])
                ?.columns.map(v => {
                  return v.name[0];
                });
        return column;
      },
      [currentDatabaseSchemas],
    );

    const handleLeftColumn = useCallback(() => {
      const tableName = structure.table;
      const childrenData = structure['columns']?.map((v, i) => {
        return { title: v, key: [...tableName, v] };
      });
      const joinTable: any = [];
      for (let i = 0; i < joinIndex; i++) {
        const tableName = structure.joins[i].table!;
        const joinColumn = getTableColumns(tableName);
        const childrenData = joinColumn?.map((v, i) => {
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
    }, [joinIndex, structure, getTableColumns]);

    const handleRightColumn = useCallback((): any => {
      const joinTableName = joinTable.table!;
      const joinColumn = getTableColumns(joinTableName);
      const childrenData = joinColumn?.map((v, i) => {
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
    }, [joinTable.table, getTableColumns]);

    useEffect(() => {
      handleLeftColumn();
    }, [handleLeftColumn]);

    return (
      <Line key={conditionsIndex}>
        <ColumnSelect
          dropdownMatchSelectWidth={false}
          allowClear
          placeholder={t('selectField')}
          treeDefaultExpandAll={true}
          value={joinTable.conditions?.[conditionsIndex]?.left.slice(-1)}
          onChange={columnName => {
            onChange(columnName || [], 'left', conditionsIndex);
          }}
          treeData={handleLeftColumn()}
        />
        <Equal>=</Equal>
        <ColumnSelect
          dropdownMatchSelectWidth={false}
          allowClear
          placeholder={t('selectField')}
          treeDefaultExpandAll={true}
          value={joinTable.conditions?.[conditionsIndex]?.right.slice(-1)}
          onChange={columnName => {
            onChange(columnName || [], 'right', conditionsIndex);
          }}
          treeData={handleRightColumn()}
        />
      </Line>
    );
  },
);

const Line = styled.div``;

const ColumnSelect = styled(TreeSelect)`
  min-width: 120px;
`;

const Equal = styled.span`
  margin: 0 ${SPACE_SM};
`;

export default SelectJoinColumns;
