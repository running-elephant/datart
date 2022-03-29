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
import { AggregateBoxProp, ScorecardBoxProp, ScorecardConfig } from './types';

const ScorecardAdapter: FC<ScorecardConfig> = memo(
  ({ dataConfig, labelConfig, padding, data, background }) => {
    const ssp = e => {
      e.stopPropagation();
    };
    return (
      <ScorecardBox padding={padding} onClick={ssp} style={{ background }}>
        <AggregateBox
          alignment={labelConfig?.alignment || 'center'}
          position={labelConfig?.position || 'column'}
        >
          <ValueBox style={dataConfig?.[0].font}>{data?.[0]?.value}</ValueBox>
          {labelConfig?.show && (
            <LabelBox style={labelConfig?.font}>{data?.[0]?.label}</LabelBox>
          )}
        </AggregateBox>
      </ScorecardBox>
    );
  },
);
export default ScorecardAdapter;

const ScorecardBox = styled.div<ScorecardBoxProp>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 0;
  padding: ${p => p.padding};
`;

const AggregateBox = styled.div<AggregateBoxProp>`
  display: flex;
  flex-direction: ${p => p.position};
  align-items: ${p => p.alignment};
  justify-content: center;
  min-width: 0;
  max-width: 100%;
  min-height: 0;
  max-height: 100%;
`;

const ValueBox = styled.div`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LabelBox = styled.div`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
