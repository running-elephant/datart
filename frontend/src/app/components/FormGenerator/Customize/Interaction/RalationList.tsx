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

import { Button, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import useMount from 'app/hooks/useMount';
import { ChartDataViewMeta } from 'app/types/ChartDataViewMeta';
import { fetchDataChart } from 'app/utils/fetch';
import { FC, useState } from 'react';
import styled from 'styled-components/macro';
import { CustomizeRelation, I18nTransator } from './types';

const RelationList: FC<
  {
    targetRelId?: string;
    relations?: CustomizeRelation[];
    sourceFields?: ChartDataViewMeta[];
    sourceVariables?: [];
    onRelationChange: (relations?: CustomizeRelation[]) => void;
  } & I18nTransator
> = ({
  targetRelId,
  relations,
  sourceFields,
  sourceVariables,
  onRelationChange,
  translate: t,
}) => {
  const [targetFields, setTargetFields] = useState<ChartDataViewMeta[]>([]);

  useMount(async () => {
    if (targetRelId) {
      const data = await fetchDataChart(targetRelId);
      setTargetFields(data?.view?.meta || []);
    }
  });

  const handleAddRelation = () => {
    onRelationChange(relations?.concat({}));
  };

  const handleDeleteRelation = index => {
    relations?.splice(index, 1);
    onRelationChange(relations);
  };

  const handleRelationChange = (index, key, value) => {
    const current = relations?.[index];
    if (current) {
      current[key] = value;
      onRelationChange(relations);
    }
  };

  const columns: ColumnsType<CustomizeRelation> = [
    {
      title: t('drillThrough.rule.relation.source'),
      dataIndex: 'source',
      key: 'source',
      render: (value, _, index) => (
        <Select
          style={{ width: '150px' }}
          defaultValue={value}
          onChange={value => handleRelationChange(index, 'source', value)}
        >
          {sourceFields?.map(sf => {
            return (
              <Select.Option value={sf?.id}>{sf?.name || sf.id}</Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: t('drillThrough.rule.relation.target'),
      dataIndex: 'target',
      key: 'target',
      render: (value, _, index) => (
        <Select
          style={{ width: '150px' }}
          defaultValue={value}
          onChange={value => handleRelationChange(index, 'target', value)}
        >
          {targetFields?.map(sf => {
            return (
              <Select.Option value={sf?.id}>{sf?.name || sf.id}</Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      key: 'operation',
      width: 50,
      render: (_1, _2, index) => (
        <Button type="link" onClick={() => handleDeleteRelation(index)}>
          {t('drillThrough.rule.operation.delete')}
        </Button>
      ),
    },
  ];

  return (
    <StyledRelationList>
      <Button type="link" onClick={handleAddRelation}>
        {t('drillThrough.rule.relation.addRelation')}
      </Button>
      <Table
        size="small"
        style={{ overflow: 'auto' }}
        rowKey={r => `${r?.source}+${r?.target}`}
        columns={columns}
        dataSource={relations}
        pagination={{ hideOnSinglePage: true, pageSize: 3 }}
      />
    </StyledRelationList>
  );
};

export default RelationList;

const StyledRelationList = styled.div`
  background: ${p => p.theme.emphasisBackground};
`;
