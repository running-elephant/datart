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
import { ChartStyleSectionConfig } from 'app/types/ChartConfig';
import { FONT_FAMILIES } from 'globalConstants';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const BasicFontFamilySelector: FC<ItemLayoutProps<ChartStyleSectionConfig>> =
  memo(({ ancestors, translate: t = title => title, data: row, onChange }) => {
    const { comType, options, ...rest } = row;

    return (
      <StyledVizFontFamilySelector align={'middle'}>
        <Col span={12}>{t(row.label)}</Col>
        <Col span={12}>
          <Select
            dropdownMatchSelectWidth
            {...rest}
            {...options}
            placeholder={t('pleaseSelect')}
            onChange={value => onChange?.(ancestors, value)}
          >
            {FONT_FAMILIES.map(o => (
              <Select.Option key={o.value} value={o.value}>
                {o.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </StyledVizFontFamilySelector>
    );
  }, itemLayoutComparer);

export default BasicFontFamilySelector;

const StyledVizFontFamilySelector = styled(Row)`
  line-height: 32px;
`;
