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

import { Button, Dropdown, Select, Space } from 'antd';
import ChartDataView from 'app/types/ChartDataView';
import { FC, memo, useState } from 'react';
import { InteractionFieldRelation } from '../../constants';
import RelationList from './RalationList';
import { I18nTransator, JumpToChartRule, VizType } from './types';

const JumpToChart: FC<
  {
    vizs: VizType[];
    dataview?: ChartDataView;
    value?: JumpToChartRule;
    onValueChange: (value) => void;
  } & I18nTransator
> = memo(({ vizs, dataview, value, onValueChange, translate: t }) => {
  const [relations, setRelations] = useState(
    value?.[InteractionFieldRelation.Customize] || [],
  );

  const handleUpdateRelations = relations => {
    const newRelations = [...relations];
    setRelations(newRelations);
    onValueChange({
      ...value,
      ...{ [InteractionFieldRelation.Customize]: newRelations },
    });
  };

  return (
    <Space>
      <Select
        value={value?.relId}
        placeholder={t('drillThrough.rule.reference.title')}
        onChange={relId => onValueChange({ ...value, ...{ relId } })}
      >
        {vizs
          ?.filter(v => v.relType === 'DATACHART')
          ?.map(c => {
            return (
              <Select.Option key={c.relId} value={c.relId}>
                {c.name}
              </Select.Option>
            );
          })}
      </Select>
      <Select
        value={value?.relation}
        placeholder={t('drillThrough.rule.relation.title')}
        onChange={relation => onValueChange({ ...value, ...{ relation } })}
      >
        <Select.Option value={InteractionFieldRelation.Auto}>
          {t('drillThrough.rule.relation.auto')}
        </Select.Option>
        <Select.Option value={InteractionFieldRelation.Customize}>
          {t('drillThrough.rule.relation.customize')}
        </Select.Option>
      </Select>
      <Dropdown
        destroyPopupOnHide
        overlayStyle={{ margin: 4 }}
        overlay={() => (
          <RelationList
            translate={t}
            targetRelId={value?.relId}
            sourceFields={
              dataview?.meta?.concat(dataview?.computedFields || []) || []
            }
            sourceVariables={[]}
            relations={relations}
            onRelationChange={handleUpdateRelations}
          />
        )}
        placement="bottomLeft"
        trigger={['click']}
        arrow
      >
        <Button
          disabled={value?.relation === InteractionFieldRelation.Auto}
          type="link"
        >
          {t('drillThrough.rule.relation.setting')}
        </Button>
      </Dropdown>
    </Space>
  );
});

export default JumpToChart;
