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
import ChartDrillContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDrillContext';
import { FC, memo, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';

const ChartDrillContextMenu: FC<{}> = memo(({ children }) => {
  const t = useI18NPrefix(`viz.palette.drill`);
  const { drillOption, onDrillOptionChange } = useContext(ChartDrillContext);

  const contextMenu = useMemo(() => {
    return (
      <Menu
        style={{ width: 200 }}
        onClick={({ key }) => {
          if (!drillOption) {
            return;
          }
          if (key === 'enable') {
            if (!drillOption?.isSelectedDrill) {
              drillOption?.toggleSelectedDrill(true);
              onDrillOptionChange?.(drillOption);
            }
          } else if (key === 'disable') {
            if (drillOption?.isSelectedDrill) {
              drillOption?.toggleSelectedDrill(false);
              onDrillOptionChange?.(drillOption);
            }
          } else if (key === DrillMode.Drill) {
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
        <Menu.Item key={'rollUp'}>{t('rollUp')}</Menu.Item>
        <Menu.Item
          disabled={drillOption?.mode === DrillMode.Expand}
          key={DrillMode.Drill}
        >
          {t('showNextLevel')}
        </Menu.Item>
        <Menu.Item
          disabled={drillOption?.mode === DrillMode.Drill}
          key={DrillMode.Expand}
        >
          {t('expandNextLevel')}
        </Menu.Item>
        <Menu.SubMenu
          disabled={drillOption?.mode === DrillMode.Expand}
          key="selectDrillStatus"
          title={t('selectDrillStatus')}
        >
          <Menu.Item key="enable" disabled={drillOption?.isSelectedDrill}>
            {t('enable')}
          </Menu.Item>
          <Menu.Item key="disable" disabled={!drillOption?.isSelectedDrill}>
            {t('disable')}
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    );
  }, [drillOption, t, onDrillOptionChange]);

  return (
    <StyledChartDrill className="chart-drill-menu-container">
      <Dropdown
        disabled={!drillOption}
        overlay={contextMenu}
        destroyPopupOnHide={true}
        trigger={['contextMenu']}
        getPopupContainer={triggerNode => triggerNode}
      >
        <div style={{ height: '100%' }}>{children}</div>
      </Dropdown>
    </StyledChartDrill>
  );
});

export default ChartDrillContextMenu;

const StyledChartDrill = styled.div`
  position: relative;
  width: 100%;
`;
