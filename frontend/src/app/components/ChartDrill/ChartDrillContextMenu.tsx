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
import {
  ChartDataSectionType,
  ChartDataViewFieldCategory,
  interimDateAggregatedKey,
} from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { DrillMode } from 'app/models/ChartDrillOption';
import DateMeunItem from 'app/pages/ChartWorkbenchPage/components/ChartOperationPanel/components/ChartFieldAction/DateAggregationAction/DateMeunItem';
import ChartDrillContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDrillContext';
import { ChartConfig, ChartDataSectionField } from 'app/types/ChartConfig';
import { getInterimDateAggregateRows } from 'app/utils/chartHelper';
import { updateBy } from 'app/utils/mutation';
import { FC, memo, useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';

const ChartDrillContextMenu: FC<{ chartConfig?: ChartConfig }> = memo(
  ({ children, chartConfig }) => {
    const t = useI18NPrefix(`viz.palette.drill`);
    const {
      drillOption,
      onDrillOptionChange,
      sourceSupportDateField,
      onChartDrillDataAggregationChange,
    } = useContext(ChartDrillContext);
    const currentFields = drillOption?.getCurrentFields();

    const currentDrillField = useMemo(() => {
      if (!drillOption) {
        return;
      }
      const allFields = drillOption.getAllFields();
      const groupSection = chartConfig?.datas?.find(
        v => v.type === ChartDataSectionType.GROUP,
      );
      let rows: ChartDataSectionField[] | undefined = [];

      if (currentFields) {
        rows = groupSection?.rows?.filter(v =>
          currentFields.some(val => val.uid === v.uid),
        );
      } else {
        rows = groupSection?.rows?.filter(v => v.uid === allFields[0].uid);
      }
      return getInterimDateAggregateRows(rows);
    }, [currentFields, drillOption, chartConfig?.datas]);

    const handleChangeDataAggregate = useCallback(
      (config: ChartDataSectionField) => {
        const groupData = chartConfig?.datas?.find(v => v.type === 'group');

        if (groupData) {
          const _groupData = updateBy(groupData, draft => {
            if (draft.rows) {
              const index = draft.rows.findIndex(v => v.uid === config.uid);
              const interimDateAggregatedValue =
                draft.rows[index][interimDateAggregatedKey];
              const deleteColName = interimDateAggregatedValue
                ? interimDateAggregatedValue.colName
                : draft.rows[index].colName;

              draft.rows[index][interimDateAggregatedKey] = config;
              draft.deleteColName = deleteColName;
            }
          });

          onChartDrillDataAggregationChange?.('data', {
            needRefresh: true,
            ancestors: [0],
            value: _groupData,
          });
        }
      },
      [chartConfig?.datas, onChartDrillDataAggregationChange],
    );

    const contextMenu = useMemo(() => {
      return (
        <Menu
          style={{ width: 200 }}
          onClick={({ key, keyPath }) => {
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
            } else if (key === 'rollUp') {
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
          {currentDrillField?.map((v, i) => {
            if (
              v.category === ChartDataViewFieldCategory.DateAggregationField
            ) {
              return (
                <Menu.SubMenu key={i} title={v.colName}>
                  <DateMeunItem
                    sourceSupportDateField={sourceSupportDateField}
                    config={v[interimDateAggregatedKey] || v}
                    onChange={config => handleChangeDataAggregate(config)}
                  />
                </Menu.SubMenu>
              );
            }
            return false;
          })}
        </Menu>
      );
    }, [
      drillOption,
      t,
      onDrillOptionChange,
      currentDrillField,
      sourceSupportDateField,
      handleChangeDataAggregate,
    ]);

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
  },
);

export default ChartDrillContextMenu;

const StyledChartDrill = styled.div`
  position: relative;
  width: 100%;
`;
