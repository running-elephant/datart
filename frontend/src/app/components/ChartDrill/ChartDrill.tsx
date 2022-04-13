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

import { Dropdown, Menu } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { DrillMode } from 'app/models/ChartDrillOption';
import ChartDatasetContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDatasetContext';
import { FC, memo, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import ChartDrillPaths from './ChartDrillPaths';

const ChartDrill: FC<{}> = memo(({ children }) => {
  const drillTranslator = useI18NPrefix(`viz.palette.drill`);
  const { drillOption, onDrillOptionChange } = useContext(ChartDatasetContext);

  const contextMenu = useMemo(() => {
    return (
      <Menu
        style={{ width: 200 }}
        onClick={({ key }) => {
          if (!drillOption) {
            return;
          }
          if (key === DrillMode.Drill) {
            drillOption?.drillDown();
            onDrillOptionChange?.(drillOption);
          } else if (key === DrillMode.Expand) {
            drillOption?.expandDown();
            onDrillOptionChange?.(drillOption);
          } else {
            drillOption?.rollUp();
            onDrillOptionChange?.(drillOption);
          }
        }}
      >
        <Menu.Item key={'rollUp'}>{drillTranslator('rollUp')}</Menu.Item>
        <Menu.Item
          disabled={drillOption?.mode === DrillMode.Expand}
          key={DrillMode.Drill}
        >
          {drillTranslator('showNextLevel')}
        </Menu.Item>
        <Menu.Item
          disabled={drillOption?.mode === DrillMode.Drill}
          key={DrillMode.Expand}
        >
          {drillTranslator('expandNextLevel')}
        </Menu.Item>
      </Menu>
    );
  }, [drillOption, drillTranslator, onDrillOptionChange]);

  return (
    <StyledChartDrill>
      <Dropdown
        disabled={!drillOption}
        overlay={contextMenu}
        destroyPopupOnHide={true}
        trigger={['contextMenu']}
        getPopupContainer={triggerNode => triggerNode}
      >
        <div>
          {children}
          <ChartDrillPaths />
        </div>
      </Dropdown>
    </StyledChartDrill>
  );
});

export default ChartDrill;

const StyledChartDrill = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;
