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

import { Col, Row, Select } from 'antd';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import { CHART_NAME_LOCATION } from 'globalConstants';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const BasicNameLocation: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({ ancestors, translate: t = title => title, data: row, onChange }) => {
    const { comType, options, ...rest } = row;

    return (
      <StyledVizNameLocation align={'middle'}>
        <Col span={12}>{t(row.label, true)}</Col>
        <Col span={12}>
          <Select
            dropdownMatchSelectWidth
            {...rest}
            {...options}
            placeholder={t('select')}
            onChange={value => onChange?.(ancestors, value)}
          >
            {CHART_NAME_LOCATION.map(o => (
              <Select.Option key={o.value} value={o.value}>
                {t(o.name)}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </StyledVizNameLocation>
    );
  },
  itemLayoutComparer,
);

export default BasicNameLocation;

const StyledVizNameLocation = styled(Row)`
  line-height: 32px;
`;
