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
import { DrillMode } from 'app/models/ChartDrillOption';
import ChartDrillContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDrillContext';
import { getColumnRenderName } from 'app/utils/chartHelper';
import { FC, memo, useContext } from 'react';
import styled from 'styled-components/macro';
import { SPACE_TIMES } from 'styles/StyleConstants';

const ChartDrillPaths: FC<{}> = memo(() => {
  const { drillOption, onDrillOptionChange } = useContext(ChartDrillContext);

  if (!drillOption || drillOption.mode === DrillMode.Normal) {
    return <div></div>;
  }

  const drilledFields = drillOption.getDrilledFields();
  return (
    <StyledChartDrillPaths className="chart-drill-path">
      <Breadcrumb>
        {drilledFields.map(f => {
          return (
            <StyledDrillNode
              isActive={Boolean(
                drillOption?.getCurrentFields()?.some(df => df.uid === f.uid),
              )}
              onClick={() => {
                if (drillOption.mode === DrillMode.Drill) {
                  drillOption.drillUp(f);
                } else if (drillOption.mode === DrillMode.Expand) {
                  drillOption.expandUp(f);
                }
                onDrillOptionChange?.(drillOption);
              }}
            >
              {getColumnRenderName(f)}
            </StyledDrillNode>
          );
        })}
      </Breadcrumb>
    </StyledChartDrillPaths>
  );
});

export default ChartDrillPaths;

const StyledChartDrillPaths = styled.div`
  padding-left: ${SPACE_TIMES(2)};
`;

const StyledDrillNode = styled(Breadcrumb.Item)<{ isActive: boolean }>`
  cursor: pointer;
  user-select: none;
  color: ${p => (p.isActive ? p.theme.primary : p.theme.normal)} !important;
`;
