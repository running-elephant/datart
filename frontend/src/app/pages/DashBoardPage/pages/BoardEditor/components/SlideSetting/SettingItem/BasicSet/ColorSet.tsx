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
import { BgColorsOutlined } from '@ant-design/icons';
import { Form, Popover } from 'antd';
import { SingleColorSelection } from 'app/components/ColorPicker';
import { NamePath } from 'rc-field-form/lib/interface';
import React, { FC, memo } from 'react';
import styled from 'styled-components/macro';
export const ColorSet: FC<{
  filedName: NamePath;
  filedValue: string;
}> = memo(({ filedValue, filedName }) => {
  const widgetContent = (
    <Form.Item noStyle name={filedName} preserve>
      <SingleColorSelection color={filedValue} />
    </Form.Item>
  );
  return (
    <StyledWrap>
      <Popover content={widgetContent} title={filedName} placement="left">
        <StyledColorIcon color={filedValue}>
          <BgColorsOutlined />
        </StyledColorIcon>
      </Popover>
    </StyledWrap>
  );
});

export default ColorSet;
const StyledWrap = styled.div`
  display: inline-block;
  cursor: pointer;
`;
const StyledColorIcon = styled.span<{ color: string }>`
  font-size: 1.4em;
  color: ${p => p.color};
  background-color: ${p => p.theme.componentBackground};
  border: 1px solid ${p => p.theme.borderColorEmphasis};
`;
