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

import { Button, Col, Form, Radio, Row, Select, Space } from 'antd';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { ItemLayoutProps } from '../../types';
import { itemLayoutComparer } from '../../utils';

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

    const handleDrillThroughEventChange = () => {};

    return (
      <StyledDrillThroughPanel direction="vertical">
        <Form
          labelCol={{ offset: 2, span: 2 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          size="middle"
          initialValues={{}}
          // onValuesChange={onFormLayoutChange}
        >
          <Form.Item label={t('drillThrough.event')} name="event">
            <Radio.Group
              onChange={handleDrillThroughEventChange}
              value={drillThroughEvent}
            >
              <Radio value={'left'}>{t('drillThrough.leftClick')}</Radio>
              <Radio value={'right'}>{t('drillThrough.rightClick')}</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={t('drillThrough.rule.title')} name="rule">
            <Button>{t('drillThrough.rule.addRule')}</Button>
            <Row>
              <Col>
                <Select
                  placeholder={t('drillThrough.rule.category.title')}
                  // onChange={handleChange}
                >
                  <Select.Option value="chart">
                    {t('drillThrough.rule.category.jumpToChart')}
                  </Select.Option>
                  <Select.Option value="dashboard">
                    {t('drillThrough.rule.category.jumpToDashboard')}
                  </Select.Option>
                  <Select.Option value="url">
                    {t('drillThrough.rule.category.jumpToUrl')}
                  </Select.Option>
                </Select>
              </Col>
              <Col>
                <Select
                  placeholder={t('drillThrough.rule.type.title')}
                  // onChange={handleChange}
                >
                  <Select.Option value="chart">
                    {t('drillThrough.rule.type.redirect')}
                  </Select.Option>
                  <Select.Option value="dashboard">
                    {t('drillThrough.rule.type.openNew')}
                  </Select.Option>
                  <Select.Option value="url">
                    {t('drillThrough.rule.type.openDialog')}
                  </Select.Option>
                </Select>
              </Col>
              <Col>
                <Select
                  placeholder={t('drillThrough.rule.reference.title')}
                  // onChange={handleChange}
                >
                  <Select.Option value="chart">
                    {t('drillThrough.rule.type.redirect')}
                  </Select.Option>
                  <Select.Option value="dashboard">
                    {t('drillThrough.rule.type.openNew')}
                  </Select.Option>
                  <Select.Option value="url">
                    {t('drillThrough.rule.type.openDialog')}
                  </Select.Option>
                </Select>
              </Col>
              <Col>
                <Select
                  placeholder={t('drillThrough.rule.relation.title')}
                  // onChange={handleChange}
                >
                  <Select.Option value="chart">
                    {t('drillThrough.rule.type.redirect')}
                  </Select.Option>
                  <Select.Option value="dashboard">
                    {t('drillThrough.rule.type.openNew')}
                  </Select.Option>
                  <Select.Option value="url">
                    {t('drillThrough.rule.type.openDialog')}
                  </Select.Option>
                </Select>
              </Col>
            </Row>
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
