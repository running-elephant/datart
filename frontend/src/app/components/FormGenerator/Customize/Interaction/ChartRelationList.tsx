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
import { Variable } from 'app/pages/MainPage/pages/VariablePage/slice/types';
import { ChartDataViewMeta } from 'app/types/ChartDataViewMeta';
import {
  createDateLevelComputedFieldForConfigComputedFields,
  getAllColumnInMeta,
} from 'app/utils/chartHelper';
import { fetchDataChart } from 'app/utils/fetch';
import { updateBy } from 'app/utils/mutation';
import { FC, useState } from 'react';
import styled from 'styled-components/macro';
import { errorHandle, uuidv4 } from 'utils/utils';
import { InteractionRelationType } from '../../constants';
import { CustomizeRelation, I18nTranslator } from './types';

const ChartRelationList: FC<
  {
    targetRelId?: string;
    relations?: CustomizeRelation[];
    sourceFields?: ChartDataViewMeta[];
    sourceVariables?: Array<{ id: string; name: string }>;
    onRelationChange: (relations?: CustomizeRelation[]) => void;
  } & I18nTranslator
> = ({
  targetRelId,
  relations,
  sourceFields,
  sourceVariables,
  onRelationChange,
  translate: t,
}) => {
  const [targetFields, setTargetFields] = useState<ChartDataViewMeta[]>([]);
  const [targetVariables, setTargetVariables] = useState<Variable[]>([]);

  useMount(async () => {
    if (targetRelId) {
      const data = await fetchDataChart(targetRelId).catch(errorHandle);
      setTargetFields(
        getAllColumnInMeta(data?.view?.meta)?.concat(
          createDateLevelComputedFieldForConfigComputedFields(
            data?.view?.meta,
            data?.config?.computedFields,
          ),
        ) || [],
      );
      setTargetVariables(data?.queryVariables || []);
    }
  });

  const handleAddRelation = () => {
    onRelationChange(
      (relations || []).concat({
        id: uuidv4(),
        type: InteractionRelationType.Field,
      }),
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
        draft![index] = { id: uuidv4(), type: value };
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
          dropdownMatchSelectWidth={false}
        >
          {(isFieldType(record) ? sourceFields : sourceVariables)?.map(sf => {
            return <Select.Option value={sf?.name}>{sf?.name}</Select.Option>;
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
          dropdownMatchSelectWidth={false}
        >
          {(isFieldType(record) ? targetFields : targetVariables)?.map(sf => {
            return <Select.Option value={sf?.name}>{sf?.name}</Select.Option>;
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
        rowKey={'id'}
        columns={columns}
        dataSource={relations}
        pagination={{ hideOnSinglePage: true, pageSize: 3 }}
      />
    </StyledRelationList>
  );
};

export default ChartRelationList;

const StyledRelationList = styled.div`
  background: ${p => p.theme.emphasisBackground};
`;
