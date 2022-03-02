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

interface FontConfig {
  color: string;
  fontFamily: string;
  fontSize: string;
  fontStyle: string;
  fontWeight: string;
  lineHeight: number;
}

const ScorecardAdapter: FC<{
  dataConfig: FontConfig;
  labelConfig: {
    show: boolean;
    font: FontConfig;
    position: string;
    alignment: string;
  };
  padding: string;
  context: {
    width: number;
    height: number;
  };
  width: number;
  data: {
    label: string;
    value: number | string;
  };
  background: string;
}> = memo(({ dataConfig, labelConfig, padding, data, background }) => {
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
});
export default ScorecardAdapter;

interface ScorecardBoxProp {
  padding: string | number;
}

interface AggregateBoxProp {
  position: string;
  alignment: string;
}

const ScorecardBox = styled.div<ScorecardBoxProp>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: ${p => p.padding};
  justify-content: center;
  align-items: center;
  min-width: 0;
  min-height: 0;
`;

const AggregateBox = styled.div<AggregateBoxProp>`
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: ${p => p.alignment};
  justify-content: center;
  flex-direction: ${p => p.position};
  min-width: 0;
  min-height: 0;
`;

const ValueBox = styled.div`
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const LabelBox = styled.div`
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
