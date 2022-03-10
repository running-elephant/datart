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

import { ChartDataSectionField } from 'app/types/ChartConfig';
import { ChartDataConfigSectionProps } from 'app/types/ChartDataConfigSection';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { SPACE } from 'styles/StyleConstants';
import { ChartDraggableTargetContainer } from '../ChartDraggable';
import { dataConfigSectionComparer } from './utils';

export interface BaseDataConfigSectionProps
  extends ChartDataConfigSectionProps {
  canDraggableItemMove?: (
    rows: ChartDataSectionField[],
    dragIndex: number,
    hoverIndex: number,
  ) => boolean;
}

const BaseDataConfigSection: FC<BaseDataConfigSectionProps> = memo(
  ({ modalSize, config, extra, translate = title => title, ...rest }) => {
    return (
      <StyledBaseDataConfigSection>
        <StyledBaseDataConfigSectionTitle>
          {translate(config.label || '')}
          {extra?.()}
        </StyledBaseDataConfigSectionTitle>
        <ChartDraggableTargetContainer
          {...rest}
          translate={translate}
          modalSize={modalSize}
          config={config}
        />
      </StyledBaseDataConfigSection>
    );
  },
  dataConfigSectionComparer,
);

export default BaseDataConfigSection;

const StyledBaseDataConfigSection = styled.div`
  padding: ${SPACE} 0;
`;

const StyledBaseDataConfigSectionTitle = styled.div`
  color: ${p => p.theme.textColor};
  user-select: none;
`;
