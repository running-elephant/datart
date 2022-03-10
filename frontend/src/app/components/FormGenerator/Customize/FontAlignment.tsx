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

import { Select } from 'antd';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { BORDER_RADIUS } from 'styles/StyleConstants';
import { BW } from '../Basic/components/BasicWrapper';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const template = [
  {
    name: `viz.common.enum.fontAlignment.left`,
    value: 'left',
  },
  {
    name: `viz.common.enum.fontAlignment.center`,
    value: 'center',
  },
  {
    name: `viz.common.enum.fontAlignment.right`,
    value: 'right',
  },
];

const FontAlignment: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({ ancestors, translate: t = title => title, data: row, onChange }) => {
    const { comType, options, ...rest } = row;

    return (
      <StyledVizLegendType
        label={!options?.hideLabel ? t(row.label, true) : ''}
      >
        <Select
          dropdownMatchSelectWidth
          {...rest}
          {...options}
          placeholder={t('select')}
          onChange={value => onChange?.(ancestors, value)}
        >
          {template.map(o => (
            <Select.Option key={o.value} value={o.value}>
              {t(o.name, true)}
            </Select.Option>
          ))}
        </Select>
      </StyledVizLegendType>
    );
  },
  itemLayoutComparer,
);

export default FontAlignment;

const StyledVizLegendType = styled(BW)`
  .ant-select {
    color: ${p => p.theme.textColorSnd};
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background-color: ${p => p.theme.emphasisBackground};
    border-color: ${p => p.theme.emphasisBackground} !important;
    border-radius: ${BORDER_RADIUS};
    box-shadow: none !important;
  }
`;
