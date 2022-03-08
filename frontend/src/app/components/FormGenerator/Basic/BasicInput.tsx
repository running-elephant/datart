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

import { Input } from 'antd';
import useDebouncedFormValue from 'app/hooks/useDebouncedFormValue';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { ItemLayoutProps } from '../types';
import { itemLayoutComparer } from '../utils';
import { BW } from './components/BasicWrapper';

const BasicInput: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({ ancestors, translate: t = title => title, data, onChange }) => {
    const { options, ...rest } = data;
    const [formValue, debouncedUpdateValue] = useDebouncedFormValue(
      data?.value,
      {
        ancestors,
        needRefresh: options?.needRefresh,
        delay: 500,
      },
      onChange,
    );

    return (
      <Wrapper label={t(data?.label, true)}>
        <Input
          {...rest}
          {...options}
          value={formValue}
          onChange={e => {
            debouncedUpdateValue(e.target.value);
          }}
          defaultValue={data?.default}
        />
      </Wrapper>
    );
  },
  itemLayoutComparer,
);

export default BasicInput;

const Wrapper = styled(BW)`
  .ant-input {
    color: ${p => p.theme.textColorSnd};
    background-color: ${p => p.theme.emphasisBackground};
    border-color: ${p => p.theme.emphasisBackground};
    box-shadow: none;
  }
`;
