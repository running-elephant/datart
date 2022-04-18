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

import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { WidgetNameConfig } from '../../pages/Board/slice/types';

export const WidgetTitle: FC<{
  name: string;
  config: WidgetNameConfig;
}> = memo(({ config, name }) => {
  if (!config.show) {
    return null;
  }
  return (
    <StyledWrap conf={config}>
      <NameWrap className="widget-name" conf={config}>
        {name}
      </NameWrap>
    </StyledWrap>
  );
});

const StyledWrap = styled.div<{ conf: WidgetNameConfig }>`
  width: 100%;
  line-height: 24px;
  text-align: ${p => p.conf.textAlign};
  cursor: pointer;
`;
const NameWrap = styled.span<{ conf: WidgetNameConfig }>`
  font-family: ${p => p.conf.fontFamily};
  font-size: ${p => p.conf.fontSize}px;
  font-style: ${p => p.conf.fontStyle};
  font-weight: ${p => p.conf.fontWeight};
  color: ${p => p.conf.color};
  text-align: ${p => p.conf.textAlign};
`;
