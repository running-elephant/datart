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
} from '@ant-design/icons';
import { Dropdown } from 'antd';
import useFieldActionModal from 'app/hooks/useFieldActionModal';
import ChartDatasetContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDatasetContext';
import VizDataViewContext from 'app/pages/ChartWorkbenchPage/contexts/ChartDataViewContext';
import {
  AggregateFieldActionType,
  AggregateFieldSubAggregateType,
  ChartDataSectionField,
  ChartDataSectionFieldActionType,
  ChartDataSectionType,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { ChartDataViewFieldCategory } from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { getColumnRenderName } from 'app/utils/chart';
import { updateBy, updateByKey } from 'app/utils/mutation';
import { CHART_DRAG_ELEMENT_TYPE } from 'globalConstants';
import { rgba } from 'polished';
import { FC, memo, useContext, useEffect, useState } from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  LINE_HEIGHT_HEADING,
  SPACE_SM,
} from 'styles/StyleConstants';
import { ValueOf } from 'types';
import { v4 as uuidv4 } from 'uuid';
import { ChartDataConfigSectionProps } from '../ChartDataConfigSection';
import ChartDataConfigSectionActionMenu from './ChartDataConfigSectionActionMenu';
import VizDraggableItem from './ChartDraggableElement';

export const ChartDraggableTargetContainer: FC<ChartDataConfigSectionProps> =
  memo(function ChartDraggableTargetContainer({
    ancestors,
    modalSize,
    config,
    translate: t = title => title,
    onConfigChanged,
  }) {
    const { dataset } = useContext(ChartDatasetContext);
    const { dataView } = useContext(VizDataViewContext);
    const [currentConfig, setCurrentConfig] = useState(config);
    const [showModal, contextHolder] = useFieldActionModal({
      i18nPrefix: 'viz.palette.data.enum.actionType',
    });

    const [{ isOver, canDrop }, drop] = useDrop(
      () => ({
        accept: [
          CHART_DRAG_ELEMENT_TYPE.DATASET_GROUP_COLUMNS,
          CHART_DRAG_ELEMENT_TYPE.DATASET_COLUMN,
          CHART_DRAG_ELEMENT_TYPE.DATA_CONFIG_COLUMN,
        ],
        drop(item: ChartDataSectionField, monitor) {
          let items = [item];
          if (
            monitor.getItemType() ===
            CHART_DRAG_ELEMENT_TYPE.DATASET_GROUP_COLUMNS
          ) {
            items = item as any;
          }
          if (
            monitor.getItemType() === CHART_DRAG_ELEMENT_TYPE.DATASET_COLUMN ||
            monitor.getItemType() === CHART_DRAG_ELEMENT_TYPE.DATA_CONFIG_COLUMN
          ) {
            let defaultAggregate: AggregateFieldActionType;
            if (
              currentConfig?.type === ChartDataSectionType.AGGREGATE ||
              currentConfig?.type === ChartDataSectionType.SIZE ||
              currentConfig?.type === ChartDataSectionType.INFO
            ) {
              if (
                item.category !==
                (ChartDataViewFieldCategory.AggregateComputedField as string)
              ) {
                const aggType = currentConfig?.actions?.[item?.type]?.[0];
                defaultAggregate =
                  AggregateFieldSubAggregateType?.[aggType]?.[0];
              }
            }

            let currentColumns: ChartDataSectionField[] = (
              currentConfig.rows || []
            ).concat(
              items.map(i => ({
                uid: uuidv4(),
                colName: i.colName,
                category: i.category,
                type: i.type,
                aggregate: defaultAggregate,
              })),
            );

            if (
              !!currentConfig.maxFieldCount &&
              currentConfig.maxFieldCount < currentColumns.length
            ) {
              currentColumns.splice(
                0,
                currentColumns.length - currentConfig.maxFieldCount,
              );
            }

            const newCurrentConfig = updateByKey(
              currentConfig,
              'rows',
              currentColumns,
            );
            setCurrentConfig(newCurrentConfig);
            onConfigChanged?.(ancestors, newCurrentConfig, true);
          }

          return { delete: true };
        },
        canDrop: (item: ChartDataSectionField, monitor) => {
          if (
            typeof currentConfig.actions === 'object' &&
            !(item.type in currentConfig.actions)
          ) {
            return false;
          }

          if (currentConfig.allowSameField) {
            return true;
          }

          let items = [item];
          if (
            monitor.getItemType() ===
            CHART_DRAG_ELEMENT_TYPE.DATASET_GROUP_COLUMNS
          ) {
            items = item as any;
          }

          const exists = currentConfig.rows?.map(col => col.colName);
          return items.every(i => !exists?.includes(i.colName));
        },
        collect: (monitor: DropTargetMonitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      }),
      [onConfigChanged, currentConfig, dataView, dataset],
    );

    useEffect(() => {
      setCurrentConfig(config);
    }, [config]);

    const onDraggableItemMove = (dragIndex: number, hoverIndex: number) => {
      const draggedItem = currentConfig.rows?.[dragIndex];

      if (draggedItem && currentConfig.rows && currentConfig.rows.length > 0) {
        const newCurrentConfig = updateBy(currentConfig, draft => {
          const columns = draft.rows || [];
          columns.splice(dragIndex, 1);
          columns.splice(hoverIndex, 0, draggedItem);
        });
        setCurrentConfig(newCurrentConfig);
        onConfigChanged?.(ancestors, newCurrentConfig, true);
      }
    };

    const handleOnDeleteItem = uid => () => {
      if (uid) {
        const newCurrentConfig = updateBy(currentConfig, draft => {
          draft.rows = draft.rows?.filter(c => c.uid !== uid);
        });
        setCurrentConfig(newCurrentConfig);
        onConfigChanged?.(ancestors, newCurrentConfig, true);
      }
    };

    const renderDropItems = () => {
      if (
        !currentConfig.rows ||
        !currentConfig?.rows?.filter(Boolean)?.length
      ) {
        return <DropPlaceholder>{t('drop')}</DropPlaceholder>;
      }

      return currentConfig.rows?.map((columnConfig, index) => {
        return (
          <VizDraggableItem
            key={columnConfig.uid}
            id={columnConfig.uid}
            index={index}
            config={columnConfig}
            content={() => {
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
                    {currentConfig?.actions && (
                      <DownOutlined style={{ marginRight: '10px' }} />
                    )}
                    <span>{getColumnRenderName(columnConfig)}</span>
                    <div style={{ display: 'inline-block', marginLeft: '5px' }}>
                      {enableActionsIcons(columnConfig)}
                    </div>
                  </div>
                </Dropdown>
              );
            }}
            moveCard={onDraggableItemMove}
            onDelete={handleOnDeleteItem(columnConfig.uid)}
          ></VizDraggableItem>
        );
      });
    };

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

    const handleOpenActionModal =
      (uid: string) =>
      (actionType: ValueOf<typeof ChartDataSectionFieldActionType>) => {
        (showModal as Function)(
          uid,
          actionType,
          config,
          handleFieldConfigChanged,
          dataset,
          dataView,
          modalSize,
        );
      };

    const renderActionExtensionMenu = (uid: string, type: string, category) => {
      return (
        <ChartDataConfigSectionActionMenu
          uid={uid}
          type={type}
          category={category}
          ancestors={ancestors}
          config={currentConfig}
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
        icons.push(<SortAscendingOutlined key="sort" />);
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
      <StyledContainer ref={drop} isOver={isOver} canDrop={canDrop}>
        {renderDropItems()}
        {contextHolder}
      </StyledContainer>
    );
  });

export default ChartDraggableTargetContainer;

const StyledContainer = styled.div<{
  isOver: boolean;
  canDrop: boolean;
}>`
  padding: ${SPACE_SM};
  color: ${p => p.theme.textColorLight};
  text-align: center;
  background-color: ${props =>
    props.canDrop
      ? rgba(props.theme.success, 0.25)
      : props.isOver
      ? rgba(props.theme.error, 0.25)
      : props.theme.emphasisBackground};
  border-radius: ${BORDER_RADIUS};

  .draggable-element:last-child {
    margin-bottom: 0;
  }
`;

const DropPlaceholder = styled.p`
  line-height: ${LINE_HEIGHT_HEADING};
`;
