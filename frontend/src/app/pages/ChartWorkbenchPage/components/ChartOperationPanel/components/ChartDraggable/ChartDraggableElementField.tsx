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

import {
  BgColorsOutlined,
  DiffOutlined,
  DownOutlined,
  FilterOutlined,
  FontSizeOutlined,
  FormatPainterOutlined,
  GroupOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import Dropdown from 'antd/lib/dropdown';
import { SortActionType } from 'app/constants';
import { getColumnRenderName } from 'app/utils/chartHelper';
import { FC, memo } from 'react';
import ChartDataConfigSectionActionMenu from './ChartDataConfigSectionActionMenu';

const ChartDraggableElementField: FC<{
  modalSize;
  config;
  columnConfig;
  ancestors;
  aggregation;
  onConfigChanged;
  handleOpenActionModal;
}> = memo(
  ({
    modalSize,
    config,
    columnConfig,
    ancestors,
    aggregation,
    onConfigChanged,
    handleOpenActionModal,
  }) => {
    const renderActionExtensionMenu = (uid: string, type: string, category) => {
      return (
        <ChartDataConfigSectionActionMenu
          uid={uid}
          type={type}
          category={category}
          ancestors={ancestors}
          config={config}
          modalSize={modalSize}
          onConfigChanged={onConfigChanged}
          onOpenModal={handleOpenActionModal}
        />
      );
    };

    const enableActionsIcons = col => {
      const icons = [] as any;
      if (col.alias) {
        icons.push(<DiffOutlined key="alias" />);
      }
      if (col.sort) {
        if (col.sort.type === SortActionType.ASC) {
          icons.push(<SortAscendingOutlined key="sort" />);
        }
        if (col.sort.type === SortActionType.DESC) {
          icons.push(<SortDescendingOutlined key="sort" />);
        }
      }
      if (col.format) {
        icons.push(<FormatPainterOutlined key="format" />);
      }
      if (col.aggregate) {
        icons.push(<GroupOutlined key="aggregate" />);
      }
      if (col.filter) {
        icons.push(<FilterOutlined key="filter" />);
      }
      if (col.color) {
        icons.push(<BgColorsOutlined key="color" />);
      }
      if (col.size) {
        icons.push(<FontSizeOutlined key="size" />);
      }
      return icons;
    };

    return (
      <Dropdown
        key={columnConfig.uid}
        disabled={!config?.actions}
        destroyPopupOnHide={true}
        overlay={renderActionExtensionMenu(
          columnConfig.uid!,
          columnConfig.type,
          columnConfig.category,
        )}
        overlayClassName="datart-data-section-dropdown"
        trigger={['click']}
      >
        <div>
          {config?.actions && <DownOutlined style={{ marginRight: '10px' }} />}
          <span>
            {aggregation === false
              ? columnConfig.colName
              : getColumnRenderName(columnConfig)}
          </span>
          <div style={{ display: 'inline-block', marginLeft: '5px' }}>
            {enableActionsIcons(columnConfig)}
          </div>
        </div>
      </Dropdown>
    );
  },
);

export default ChartDraggableElementField;
