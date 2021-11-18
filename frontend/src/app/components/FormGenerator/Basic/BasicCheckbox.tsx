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

import { Checkbox, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ChartStyleSectionConfig } from 'app/types/ChartConfig';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { LINE_HEIGHT_ICON_MD } from 'styles/StyleConstants';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';

const BasicCheckbox: FC<ItemLayoutProps<ChartStyleSectionConfig>> = memo(
  ({ ancestors, translate: t = title => title, data: row, onChange }) => {
    const { comType, options, ...rest } = row;

    const handleCheckedChange = (e: CheckboxChangeEvent) => {
      onChange?.(ancestors, e.target?.checked, options?.needRefresh);
    };

    return (
      <StyledVizBasicCheckbox align={'middle'}>
        <Checkbox
          {...rest}
          {...options}
          checked={row.value}
          onChange={handleCheckedChange}
        >
          {t(row.label)}
        </Checkbox>
      </StyledVizBasicCheckbox>
    );
  },
  itemLayoutComparer,
);

export default BasicCheckbox;

const StyledVizBasicCheckbox = styled(Row)`
  line-height: ${LINE_HEIGHT_ICON_MD};

  .ant-checkbox-wrapper {
    color: ${p => p.theme.textColorLight};
  }
`;
