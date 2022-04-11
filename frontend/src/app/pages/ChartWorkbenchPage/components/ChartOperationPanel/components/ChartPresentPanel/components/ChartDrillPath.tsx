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

import { Breadcrumb } from 'antd';
import { ChartDrillOption, DrillMode } from 'app/models/ChartDrillOption';
import { getColumnRenderName } from 'app/utils/chartHelper';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';

const ChartDrillPath: FC<{
  drillOption?: ChartDrillOption;
  onChartDrillOptionChange?: (option: ChartDrillOption) => void;
}> = memo(({ drillOption, onChartDrillOptionChange }) => {
  if (!drillOption || drillOption.getMode() === DrillMode.Normal)
    return <div></div>;

  const drillFields = drillOption.getAllDrillFields();
  return (
    <StyledChartDrillPath>
      <Breadcrumb>
        {drillFields.map(f => {
          return (
            <StyledDrillNode
              isActive={Boolean(
                drillOption?.getFields()?.some(df => df.uid === f.uid),
              )}
              onClick={() => {
                if (drillOption.getMode() === DrillMode.Drill) {
                  drillOption.drillUp(f);
                } else if (drillOption.getMode() === DrillMode.Expand) {
                  drillOption.expandUp(f);
                }
                onChartDrillOptionChange?.(drillOption);
              }}
            >
              {getColumnRenderName(f)}
            </StyledDrillNode>
          );
        })}
      </Breadcrumb>
    </StyledChartDrillPath>
  );
});

export default ChartDrillPath;

const StyledChartDrillPath = styled.div``;

const StyledDrillNode = styled(Breadcrumb.Item)<{ isActive: boolean }>`
  cursor: pointer;
  user-select: none;
  color: ${p => (p.isActive ? p.theme.primary : p.theme.normal)} !important;
`;
