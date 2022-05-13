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

import { Col, Row } from 'antd';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import { FC, memo } from 'react';
import { ItemLayoutProps } from '../../types';
import { itemLayoutComparer } from '../../utils';

const JumpSettingPanel: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({
    ancestors,
    translate: t = title => title,
    data,
    dataConfigs,
    onChange,
  }) => {
    return (
      <>
        <Row gutter={24}>
          <Col span={4}>交互事件</Col>
          <Col span={20}></Col>
        </Row>
        <Row gutter={24}>
          <Col span={4}>规则设置</Col>
          <Col span={20}></Col>
        </Row>
      </>
    );
  },
  itemLayoutComparer,
);

export default JumpSettingPanel;
