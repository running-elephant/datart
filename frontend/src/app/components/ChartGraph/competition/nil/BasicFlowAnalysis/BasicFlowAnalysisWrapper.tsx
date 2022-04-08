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

import { FlowAnalysisGraph } from '@ant-design/graphs';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';


const BasicFlowAnalysisWrapper: FC<{
  options;
}> = memo(({
  options
}) => {
  const { data = { nodes: [], edges: [] }, nodeCfg = {}, edgeCfg = {}, markerCfg = {}, behaviors = {} } = options || {}

  return (
    <FlowAnalysisGraphWrapper
      key={`BasicFlowAnalysisWrapper-${new Date().getTime()}`}
      data={data}
      nodeCfg={nodeCfg}
      edgeCfg={edgeCfg}
      markerCfg={markerCfg}
      behaviors={behaviors}
    />
  );
});

const FlowAnalysisGraphWrapper = styled(FlowAnalysisGraph)``;

export default BasicFlowAnalysisWrapper;
