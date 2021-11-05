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

import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import {
  ChartDataSectionField,
  ChartDataSectionFieldActionType,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { ChartDataViewFieldCategory } from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { updateBy } from 'app/utils/mutation';
import { FC } from 'react';
import { ChartDataConfigSectionProps } from '../ChartDataConfigSection';
import AggregationAction from '../ChartFieldAction/AggregationAction';
import AggregationLimitAction from '../ChartFieldAction/AggregationLimitAction';
import SortAction from '../ChartFieldAction/SortAction';

const ChartDataConfigSectionActionMenu: FC<
  {
    uid: string;
    type: string;
    onOpenModal;
  } & ChartDataConfigSectionProps
> = ({
  uid,
  type,
  onOpenModal,
  ancestors,
  config,
  modalSize,
  category,
  onConfigChanged,
}) => {
  const t = useI18NPrefix(`viz.palette.data.enum.actionType`);
  const subMenuAction = [
    ChartDataSectionFieldActionType.Sortable,
    ChartDataSectionFieldActionType.Aggregate,
    ChartDataSectionFieldActionType.AggregateLimit,
  ];

  const handleFieldConfigChanged = (
    columnUid: string,
    fieldConfig: ChartDataSectionField,
    needRefresh?: boolean,
  ) => {
    if (!fieldConfig) {
      return;
    }
    const newConfig = updateBy(config, draft => {
      const index = (draft.rows || []).findIndex(r => r.uid === columnUid);
      if (index !== -1 && fieldConfig) {
        (draft.rows || [])[index] = fieldConfig;
      }
    });
    onConfigChanged?.(ancestors, newConfig, needRefresh);
  };

  const getModalActions = (actions, type, category) => {
    return getActionsByTypeAndCategory(actions, type, category)?.filter(
      a => !subMenuAction.includes(a),
    );
  };

  const getSubMenuActions = (actions, type, category) => {
    return getActionsByTypeAndCategory(actions, type, category)?.filter(a =>
      subMenuAction.includes(a),
    );
  };

  const getActionsByTypeAndCategory = (actions, type, category) => {
    let modalActions: string[] = [];
    if (Array.isArray(actions)) {
      modalActions = actions;
    } else if (type in actions) {
      modalActions = actions[type] as string[];
    }
    if (category === ChartDataViewFieldCategory.AggregateComputedField) {
      modalActions = modalActions.filter(
        action =>
          ![
            ChartDataSectionFieldActionType.Aggregate,
            ChartDataSectionFieldActionType.AggregateLimit,
          ].includes(action),
      );
    }
    return modalActions;
  };

  const getSubMenuActionComponent = (actionName, uid) => {
    const fieldConfig = config.rows?.find(c => c.uid === uid)!;
    if (actionName === ChartDataSectionFieldActionType.Sortable) {
      return (
        <SortAction
          config={fieldConfig}
          onConfigChange={(config, needRefresh) => {
            handleFieldConfigChanged(uid, config, needRefresh);
          }}
          mode="menu"
        />
      );
    }
    if (actionName === ChartDataSectionFieldActionType.Aggregate) {
      return (
        <AggregationAction
          config={fieldConfig}
          onConfigChange={(config, needRefresh) => {
            handleFieldConfigChanged(uid, config, needRefresh);
          }}
          mode="menu"
        />
      );
    }
    if (actionName === ChartDataSectionFieldActionType.AggregateLimit) {
      return (
        <AggregationLimitAction
          config={fieldConfig}
          onConfigChange={(config, needRefresh) => {
            handleFieldConfigChanged(uid, config, needRefresh);
          }}
          mode="menu"
        />
      );
    }
  };

  return (
    <Menu>
      {getModalActions(config?.actions, type, category).map(actionName => (
        <Menu.Item
          key={actionName}
          onClick={() => onOpenModal(uid)(actionName)}
        >
          {t(actionName)}
        </Menu.Item>
      ))}
      {getSubMenuActions(config?.actions, type, category).map(actionName => (
        <SubMenu key={actionName} title={t(actionName)}>
          {getSubMenuActionComponent(actionName, uid)}
        </SubMenu>
      ))}
    </Menu>
  );
};

export default ChartDataConfigSectionActionMenu;
