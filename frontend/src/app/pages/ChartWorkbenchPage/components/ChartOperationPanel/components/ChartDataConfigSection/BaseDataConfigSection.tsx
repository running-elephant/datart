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
import { SPACE } from 'styles/StyleConstants';
import { ChartDataConfigSectionProps } from '.';
import { ChartDraggableTargetContainer } from '../ChartDraggable';
import { dataConfigSectionComparer } from './utils';

const BaseDataConfigSection: FC<ChartDataConfigSectionProps> = memo(
  ({ modalSize, config, extra, translate = title => title, ...rest }) => {
    return (
      <Container>
        <Title>
          {translate(config.label)}
          {extra?.()}
        </Title>
        <ChartDraggableTargetContainer
          {...rest}
          translate={translate}
          modalSize={modalSize}
          config={config}
        />
      </Container>
    );
  },
  dataConfigSectionComparer,
);

export default BaseDataConfigSection;

const Container = styled.div`
  padding: ${SPACE} 0;
`;

const Title = styled.div`
  color: ${p => p.theme.textColor};
`;
