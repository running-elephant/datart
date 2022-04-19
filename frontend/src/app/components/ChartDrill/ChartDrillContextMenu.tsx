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

import { CheckOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { DrillMode } from 'app/models/ChartDrillOption';
import ChartDrillContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDrillContext';
import classnames from 'classnames';
import { FC, memo, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { FONT_WEIGHT_MEDIUM, SPACE_SM } from 'styles/StyleConstants';

const ChartDrillContextMenu: FC<{}> = memo(({ children }) => {
  const t = useI18NPrefix(`viz.palette.drill`);
  const { drillOption, onDrillOptionChange } = useContext(ChartDrillContext);

  const currentDrillLevel = drillOption?.getCurrentDrillLevel();

  const contextMenu = useMemo(() => {
    return (
      <StyledChartDrillMenu
        onClick={({ key }) => {
          if (!drillOption) {
            return;
          }
          if (key === 'selectDrillStatus') {
            drillOption?.toggleSelectedDrill(!drillOption?.isSelectedDrill);
            onDrillOptionChange?.(drillOption);
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
        {!!currentDrillLevel && (
          <Menu.Item key={'rollUp'}>{t('rollUp')}</Menu.Item>
        )}
        {drillOption?.mode !== DrillMode.Expand &&
          !drillOption?.isBottomLevel && (
            <Menu.Item key={DrillMode.Drill}>{t('showNextLevel')}</Menu.Item>
          )}
        {drillOption?.mode !== DrillMode.Drill &&
          !drillOption?.isBottomLevel && (
            <Menu.Item key={DrillMode.Expand}>{t('expandNextLevel')}</Menu.Item>
          )}
        {drillOption?.mode !== DrillMode.Expand && (
          <Menu.Item key="selectDrillStatus">
            <MenuSwitch
              className={classnames({ on: !!drillOption?.isSelectedDrill })}
            >
              <p>
                {drillOption?.isSelectedDrill
                  ? t('selectDrillOn')
                  : t('selectDrillOff')}
              </p>
              <CheckOutlined className="icon" />
            </MenuSwitch>
          </Menu.Item>
        )}
      </StyledChartDrillMenu>
    );
  }, [drillOption, currentDrillLevel, t, onDrillOptionChange]);

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

const StyledChartDrillMenu = styled(Menu)`
  min-width: 200px;
`;

const MenuSwitch = styled.div`
  display: flex;
  align-items: center;

  p {
    flex: 1;
  }

  .icon {
    display: none;
  }

  &.on {
    p {
      font-weight: ${FONT_WEIGHT_MEDIUM};
    }

    .icon {
      display: block;
      flex-shrink: 0;
      padding-left: ${SPACE_SM};
      color: ${p => p.theme.success};
    }
  }
`;
