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
  CalendarOutlined,
  FieldStringOutlined,
  FileUnknownOutlined,
  MoreOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { IW, ToolbarButton } from 'app/components';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataViewMeta } from 'app/types/ChartDataViewMeta';
import { CHART_DRAG_ELEMENT_TYPE } from 'globalConstants';
import { FC, memo, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_BASE,
  FONT_SIZE_HEADING,
  FONT_SIZE_SUBTITLE,
  FONT_WEIGHT_MEDIUM,
  INFO,
  SPACE,
  SPACE_TIMES,
  SUCCESS,
  WARNING,
} from 'styles/StyleConstants';
import { stopPPG } from 'utils/utils';

export const ChartDraggableSourceContainer: FC<
  {
    onDeleteComputedField?: (fieldName) => void;
    onEditComputedField?: (fieldName) => void;
    onSelectionChange?: (dataItemId, cmdKeyActive, shiftKeyActive) => void;
    onClearCheckedList?: () => void;
  } & ChartDataViewMeta
> = memo(function ChartDraggableSourceContainer({
  id,
  name: colName,
  type,
  category,
  expression,
  onDeleteComputedField,
  onEditComputedField,
  onSelectionChange,
  selectedItems,
  isActive,
  onClearCheckedList,
}) {
  const t = useI18NPrefix(`viz.workbench.dataview`);
  const [, drag] = useDrag(
    () => ({
      type: CHART_DRAG_ELEMENT_TYPE.DATASET_COLUMN,
      canDrag: true,
      item: selectedItems?.length
        ? selectedItems.map(item => ({
            colName: item.id,
            type: item.type,
            category: item.category,
          }))
        : { colName, type, category },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
      end: onClearCheckedList,
    }),
    [selectedItems],
  );

  const styleClasses: Array<string> = useMemo(() => {
    let styleArr: Array<string> = [];
    if (isActive) {
      styleArr.push('container-active');
    }
    return styleArr;
  }, [isActive]);

  const renderContent = useMemo(() => {
    const _handleMenuClick = (e, fieldName) => {
      if (e.key === 'delete') {
        onDeleteComputedField?.(fieldName);
      } else {
        onEditComputedField?.(fieldName);
      }
    };

    const _isNormalField = () => {
      return ChartDataViewFieldCategory.Field === category;
    };

    const _getIconStyle = () => {
      if (
        ChartDataViewFieldCategory.ComputedField === category ||
        ChartDataViewFieldCategory.AggregateComputedField === category
      ) {
        return WARNING;
      } else {
        switch (type) {
          case ChartDataViewFieldType.NUMERIC:
            return SUCCESS;
          default:
            return INFO;
        }
      }
    };

    const _getExtraActionMenus = () => {
      return (
        <Menu onClick={e => _handleMenuClick(e, colName)}>
          <Menu.Item key="edit">{t('editField')}</Menu.Item>
          <Menu.Item key="delete">{t('deleteField')}</Menu.Item>
        </Menu>
      );
    };

    let icon = <FileUnknownOutlined />;
    const props = {
      style: {
        alignSelf: 'center',
        color: _getIconStyle(),
      },
    };
    switch (type) {
      case ChartDataViewFieldType.STRING:
        icon = <FieldStringOutlined {...props} />;
        break;
      case ChartDataViewFieldType.NUMERIC:
        icon = <NumberOutlined {...props} />;
        break;
      case ChartDataViewFieldType.DATE:
        icon = <CalendarOutlined {...props} />;
        break;
      default:
        icon = <FileUnknownOutlined {...props} />;
    }

    return (
      <>
        <IW fontSize={FONT_SIZE_HEADING}>{icon}</IW>
        <p>{colName}</p>
        <div onClick={stopPPG}>
          <Dropdown
            disabled={_isNormalField()}
            overlay={_getExtraActionMenus()}
            trigger={['click']}
          >
            <ToolbarButton
              icon={<MoreOutlined />}
              iconSize={FONT_SIZE_BASE}
              className="setting"
              onClick={e => e.preventDefault()}
            />
          </Dropdown>
        </div>
      </>
    );
  }, [type, colName, onDeleteComputedField, onEditComputedField, category, t]);

  return (
    <Container
      onClick={e => {
        onSelectionChange?.(colName, e.metaKey || e.ctrlKey, e.shiftKey);
      }}
      ref={drag}
      className={styleClasses.join(' ')}
    >
      {renderContent}
    </Container>
  );
});

export default ChartDraggableSourceContainer;

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: ${SPACE_TIMES(0.5)} ${SPACE} ${SPACE_TIMES(0.5)} ${SPACE_TIMES(2)};
  font-size: ${FONT_SIZE_SUBTITLE};
  font-weight: ${FONT_WEIGHT_MEDIUM};
  color: ${p => p.theme.textColorSnd};
  cursor: pointer;
  &.container-active {
    background-color: #f8f9fa;
  }
  > p {
    flex: 1;
  }

  .setting {
    visibility: hidden;
  }

  &:hover {
    color: ${p => p.theme.textColor};

    .setting {
      visibility: visible;
    }
  }
`;
