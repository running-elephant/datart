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

import { FontConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { darken, getLuminance, lighten } from 'polished';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { WidgetActionContext } from '../../ActionProvider/WidgetActionProvider';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';

export const ResetBtnWidgetCore: React.FC<{}> = () => {
  const widget = useContext(WidgetContext);
  const { onWidgetsReset } = useContext(WidgetActionContext);

  const onQuery = e => {
    e.stopPropagation();
    onWidgetsReset();
  };

  const { name, nameConfig, background } = widget.config;

  return (
    <Wrap {...nameConfig} background={background.color} onClick={onQuery}>
      <span>{name}</span>
    </Wrap>
  );
};

const Wrap = styled.div<FontConfig & { background: string }>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  font: ${p =>
    `${p.fontStyle} ${p.fontWeight} ${p.fontSize}px ${p.fontFamily}`};
  color: ${p => p.color};
  cursor: pointer;
  &:hover {
    background: ${p =>
      getLuminance(p.background) > 0.5
        ? darken(0.05, p.background)
        : lighten(0.05, p.background)};
  }
`;
