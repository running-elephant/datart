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
import { currentDataViewSelector } from 'app/pages/ChartWorkbenchPage/slice/selectors';
import { selectVizs } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import { updateBy } from 'app/utils/mutation';
import { FC, memo, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { uuidv4 } from 'utils/utils';
import { InteractionMouseEvent } from '../../constants';
import { ItemLayoutProps } from '../../types';
import { itemLayoutComparer } from '../../utils';
import RuleList from './RuleList';
import { DrillThroughSetting, InteractionRule } from './types';

const ViewDetailPanel: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({ ancestors, translate: t = title => title, data, onChange }) => {
    const vizs = useSelector(selectVizs);
    const dataview = useSelector(currentDataViewSelector);
    const [drillThroughEvent, setDrillThroughEvent] = useState<
      DrillThroughSetting['event']
    >(data.value?.event || InteractionMouseEvent.Left);
    const [drillThroughRules, setDrillThroughRules] = useState<
      DrillThroughSetting['rules']
    >(data.value?.rules || []);

    const handleDrillThroughEventChange = e => {
      const event = e.target.value;
      handleDrillThroughSettingChange(event);
    };

    const handleAddRule = () => {
      const newRules = (drillThroughRules || []).concat([
        {
          id: uuidv4(),
        },
      ]);
      handleDrillThroughSettingChange(undefined, newRules);
    };

    const handleDeleteRule = (id: string) => {
      const newRules = drillThroughRules?.filter(r => r.id !== id);
      handleDrillThroughSettingChange(undefined, newRules);
    };

    const handleUpdateRule = (id: string, prop: string, value: any) => {
      const updatorIndex = (drillThroughRules || []).findIndex(
        r => r.id === id,
      );
      if (updatorIndex > -1) {
        const newRules = updateBy(drillThroughRules, draft => {
          draft![updatorIndex][prop] = value;
        });
        handleDrillThroughSettingChange(undefined, newRules);
      }
    };

    const handleDrillThroughSettingChange = (
      newEvent?: string,
      newRules?: InteractionRule[],
    ) => {
      let newSetting: DrillThroughSetting = {
        event: drillThroughEvent,
        rules: drillThroughRules,
      };
      if (newEvent) {
        newSetting.event = newEvent;
        setDrillThroughEvent(newEvent);
      }
      if (newRules) {
        newSetting.rules = [...newRules];
        setDrillThroughRules([...newRules]);
      }
      onChange?.(ancestors, newSetting, false);
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
              vizs={vizs}
              dataview={dataview}
              rules={drillThroughRules}
              onRuleChange={handleUpdateRule}
              onDeleteRule={handleDeleteRule}
              translate={t}
            />
          </Form.Item>
        </Form>
      </StyledDrillThroughPanel>
    );
  },
  itemLayoutComparer,
);

export default ViewDetailPanel;

const StyledDrillThroughPanel = styled(Space)`
  width: 100%;
`;
