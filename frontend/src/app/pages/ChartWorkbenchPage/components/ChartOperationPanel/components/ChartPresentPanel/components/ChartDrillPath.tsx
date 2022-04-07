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

import { RightOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { ChartDrillOption } from 'app/models/ChartDrillOption';
import { getColumnRenderName } from 'app/utils/chartHelper';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';

const ChartDrillPath: FC<{
  drillOption?: ChartDrillOption;
  onChartDrillOptionChange?: (option: ChartDrillOption) => void;
}> = memo(({ drillOption, onChartDrillOptionChange }) => {
  if (!drillOption) return <div></div>;

  const drillFields = drillOption.getAllDrillFields();
  return (
    <StyledChartDrillPath>
      {drillFields.map((f, index) => {
        return (
          <>
            <StyledDrillNode
              isActive={drillOption?.getCurDrillField()?.uid === f.uid}
              onClick={() => {
                if (index === 0) {
                  drillOption.clearDrill();
                } else {
                  drillOption.drillDown(f);
                }
                onChartDrillOptionChange?.(drillOption);
              }}
            >
              {getColumnRenderName(f)}
            </StyledDrillNode>
            {index !== drillFields?.length - 1 ? <StyledIndicatorIcon /> : ''}
          </>
        );
      })}
    </StyledChartDrillPath>
  );
});

export default ChartDrillPath;

const StyledChartDrillPath = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  align-items: center;
  padding-left: 8px;
`;

const StyledDrillNode = styled(Tag)<{ isActive: boolean }>`
  cursor: pointer;
  user-select: none;
  color: ${p => (p.isActive ? p.theme.primary : p.theme.normal)} !important;
`;

const StyledIndicatorIcon = styled(RightOutlined)`
  width: 24px;
  font-size: 12px;
  color: ${p => p.theme.normal} !important;
`;
