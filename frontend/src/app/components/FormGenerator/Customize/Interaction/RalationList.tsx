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

import { Button, Radio, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import useMount from 'app/hooks/useMount';
import { ChartDataViewMeta } from 'app/types/ChartDataViewMeta';
import { fetchDataChart } from 'app/utils/fetch';
import { updateBy } from 'app/utils/mutation';
import { FC, useState } from 'react';
import styled from 'styled-components/macro';
import { InteractionRelationType } from '../../constants';
import { CustomizeRelation, I18nTransator } from './types';

const RelationList: FC<
  {
    targetRelId?: string;
    relations?: CustomizeRelation[];
    sourceFields?: ChartDataViewMeta[];
    sourceVariables?: Array<{ id: string; name: string }>;
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
  const [targetVariables, setTargetVariables] = useState<ChartDataViewMeta[]>(
    [],
  );

  useMount(async () => {
    if (targetRelId) {
      const data = await fetchDataChart(targetRelId);
      setTargetFields(
        data?.view?.meta?.concat(data?.config?.computedFields || []) || [],
      );
      setTargetVariables(data?.queryVariables || []);
    }
  });

  const handleAddRelation = () => {
    onRelationChange(
      relations?.concat({ type: InteractionRelationType.Field }),
    );
  };

  const handleDeleteRelation = index => {
    if (index > -1) {
      const newRelations = updateBy(relations, draft => {
        draft?.splice(index, 1);
      });
      onRelationChange(newRelations);
    }
  };

  const handleRelationChange = (index, key, value) => {
    if (index > -1) {
      const newRelations = updateBy(relations, draft => {
        draft![index][key] = value;
      });
      onRelationChange(newRelations);
    }
  };

  const handleRelationTypeChange = (index, value) => {
    if (index > -1) {
      const newRelations = updateBy(relations, draft => {
        draft![index] = { type: value };
      });
      onRelationChange(newRelations);
    }
  };

  const isFieldType = (relation: CustomizeRelation) => {
    return relation?.type === InteractionRelationType.Field;
  };

  const columns: ColumnsType<CustomizeRelation> = [
    {
      title: t('drillThrough.rule.relation.type'),
      dataIndex: 'type',
      key: 'type',
      render: (value, _, index) => (
        <Radio.Group
          size="small"
          style={{ width: '100px' }}
          value={value}
          onChange={e => handleRelationTypeChange(index, e.target.value)}
        >
          <Radio value={InteractionRelationType.Field}>
            {t('drillThrough.rule.relation.field')}
          </Radio>
          <Radio value={InteractionRelationType.Variable}>
            {t('drillThrough.rule.relation.variable')}
          </Radio>
        </Radio.Group>
      ),
    },
    {
      title: t('drillThrough.rule.relation.source'),
      dataIndex: 'source',
      key: 'source',
      render: (value, record, index) => (
        <Select
          style={{ width: '150px' }}
          value={value}
          onChange={value => handleRelationChange(index, 'source', value)}
        >
          {(isFieldType(record) ? sourceFields : sourceVariables)?.map(sf => {
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
      render: (value, record, index) => (
        <Select
          style={{ width: '150px' }}
          value={value}
          onChange={value => handleRelationChange(index, 'target', value)}
        >
          {(isFieldType(record) ? targetFields : targetVariables)?.map(sf => {
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
