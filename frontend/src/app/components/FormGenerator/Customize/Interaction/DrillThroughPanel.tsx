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

import { Button, Form, Radio, Space } from 'antd';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { uuidv4 } from 'utils/utils';
import { InteractionMouseEvent } from '../../constants';
import { ItemLayoutProps } from '../../types';
import { itemLayoutComparer } from '../../utils';
import RuleList from './RuleList';
import { InteractionRule } from './types';

const DrillThroughPanel: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({
    ancestors,
    translate: t = title => title,
    data,
    dataConfigs,
    onChange,
  }) => {
    const [drillThroughEvent, setDrillThroughEvent] = useState(
      data.value?.event,
    );
    const [rules, setRules] = useState<InteractionRule[]>([]);

    console.log('rules ----> ', rules);

    const handleDrillThroughEventChange = e => {
      const event = e.target.value;
      setDrillThroughEvent(event);
    };

    const handleAddRule = () => {
      setRules(
        (rules || []).concat([
          {
            id: uuidv4(),
          },
        ]),
      );
    };

    const handleDeleteRule = (id: string) => {
      const newRules = rules?.filter(r => r.id !== id);
      setRules(newRules);
    };

    const handleUpdateRule = (id: string, prop: string, value: any) => {
      const currentRule = rules?.find(r => r.id === id);
      if (currentRule) {
        currentRule[prop] = value;
        setRules([...rules]);
      }
    };

    return (
      <StyledDrillThroughPanel direction="vertical">
        <Form
          labelCol={{ offset: 2, span: 2 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          size="middle"
          // onValuesChange={onFormLayoutChange}
        >
          <Form.Item label={t('drillThrough.event')} name="event">
            <Radio.Group
              defaultValue={InteractionMouseEvent.Left}
              onChange={handleDrillThroughEventChange}
              value={drillThroughEvent}
            >
              <Radio value={InteractionMouseEvent.Left}>
                {t('drillThrough.leftClick')}
              </Radio>
              <Radio value={InteractionMouseEvent.Right}>
                {t('drillThrough.rightClick')}
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={t('drillThrough.rule.title')} name="rule">
            <Button type="link" onClick={handleAddRule}>
              {t('drillThrough.rule.addRule')}
            </Button>
            <RuleList
              translate={t}
              rules={rules}
              onRuleChange={handleUpdateRule}
              onDeleteRule={handleDeleteRule}
            />
          </Form.Item>
        </Form>
      </StyledDrillThroughPanel>
    );
  },
  itemLayoutComparer,
);

export default DrillThroughPanel;

const StyledDrillThroughPanel = styled(Space)`
  width: 100%;
`;
