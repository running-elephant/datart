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

import React, { FC } from 'react';
import styled from 'styled-components/macro';
import {
  WidgetConf,
  WidgetNameConfig,
  WidgetType,
} from '../../../pages/Board/slice/types';
export const HideTitleTypes: WidgetType[] = ['query', 'reset', 'controller'];

export const LabelName: FC<{ config: WidgetConf }> = ({ config }) => {
  return (
    <NameWrap className="widget-name" conf={config.nameConfig}>
      {config.name}
    </NameWrap>
  );
};

export const WidgetName: FC<{
  config: WidgetConf;
  zIndex?: number;
}> = ({ config, zIndex }) => {
  if (HideTitleTypes.includes(config.type)) {
    return null;
  }

  if (!config.nameConfig.show) {
    return null;
  }
  return (
    <StyledWrap conf={config.nameConfig} zIndex={zIndex}>
      <LabelName config={config} />
    </StyledWrap>
  );
};

const StyledWrap = styled.div<{ conf: WidgetNameConfig; zIndex?: number }>`
  width: 100%;
  line-height: 24px;
  cursor: pointer;
  text-align: ${p => p.conf.textAlign};
`;
const NameWrap = styled.span<{ conf: WidgetNameConfig }>`
  font-size: ${p => p.conf.fontSize}px;
  color: ${p => p.conf.color};
  text-align: ${p => p.conf.textAlign};
  font-family: ${p => p.conf.fontFamily};
  font-weight: ${p => p.conf.fontWeight};
  font-style: ${p => p.conf.fontStyle};
`;
