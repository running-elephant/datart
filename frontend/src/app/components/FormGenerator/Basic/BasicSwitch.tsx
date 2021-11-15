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

import { Col, Row, Switch } from 'antd';
import {
  ChartStyleSectionConfig,
  ChartStyleSectionRow,
} from 'app/types/ChartConfig';
import { updateByKey } from 'app/utils/mutation';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import ItemLayout from '../Layout/ItemLayout';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const BasicSwitch: FC<ItemLayoutProps<ChartStyleSectionConfig>> = memo(
  ({ ancestors, translate = title => title, data: row, onChange }) => {
    const { comType, options, ...rest } = row;

    const renderChildrenRow = (r, index) => {
      return (
        <ItemLayout
          ancestors={ancestors.concat([index])}
          key={r.key}
          data={r}
          translate={translate}
          onChange={handleChildChange}
        />
      );
    };

    const handleChildChange = (
      ancestors: number[],
      newRow: ChartStyleSectionRow,
      needRefresh?: boolean,
    ) => {
      onChange?.(ancestors, newRow, needRefresh);
    };

    const hanldeSwitchChange = value => {
      const newRow = updateByKey(row, 'value', value);
      onChange?.(ancestors, newRow);
    };

    const renderChildren = () => {
      if (!row.value) {
        return;
      }
      const rows = row?.rows || [];
      return rows.map(renderChildrenRow);
    };

    return (
      <>
        <StyledVizBasicSwitch align={'middle'}>
          <Col span={12}>{translate(row.label)}</Col>
          <Col span={12}>
            <Switch
              {...rest}
              {...options}
              checked={row.value}
              onChange={hanldeSwitchChange}
            />
          </Col>
        </StyledVizBasicSwitch>
        <StyledVizBasicSwitch align={'middle'}>
          <Col span={12}></Col>
          <Col span={12}>{renderChildren()}</Col>
        </StyledVizBasicSwitch>
      </>
    );
  },
  itemLayoutComparer,
);

export default BasicSwitch;

const StyledVizBasicSwitch = styled(Row)`
  line-height: 32px;
`;
