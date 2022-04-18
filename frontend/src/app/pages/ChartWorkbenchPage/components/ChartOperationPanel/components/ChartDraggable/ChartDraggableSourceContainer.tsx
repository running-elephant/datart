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
  DownOutlined,
  FieldStringOutlined,
  FileUnknownOutlined,
  MoreOutlined,
  NumberOutlined,
} from '@ant-design/icons';
import { Collapse, Dropdown, Menu } from 'antd';
import { IW, ToolbarButton } from 'app/components';
import { ChartDataViewFieldCategory, DataViewFieldType } from 'app/constants';
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
import { dateAggregationList } from '../../../../slice/constant';
import DateAggregateFieldContainer from './DateAggregateFieldContainer';

const { Panel } = Collapse;

export const ChartDraggableSourceContainer: FC<
  {
    sourceSupportDateField?: string[];
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
  selectedItems,
  isActive,
  sourceSupportDateField,
  onDeleteComputedField,
  onEditComputedField,
  onSelectionChange,
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
          case DataViewFieldType.NUMERIC:
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
      case DataViewFieldType.STRING:
        icon = <FieldStringOutlined {...props} />;
        break;
      case DataViewFieldType.NUMERIC:
        icon = <NumberOutlined {...props} />;
        break;
      case DataViewFieldType.DATE:
        icon = <CalendarOutlined {...props} />;
        break;
      default:
        icon = <FileUnknownOutlined {...props} />;
    }

    return (
      <>
        {type === 'DATE' && category === 'field' ? (
          <CollapseWrapper
            defaultActiveKey={[colName]}
            ghost
            expandIconPosition="right"
            expandIcon={({ isActive }) => {
              return <DownOutlined rotate={isActive ? -180 : 0} />;
            }}
          >
            <Panel
              key={colName}
              header={
                <div ref={drag}>
                  <IW fontSize={FONT_SIZE_HEADING}>{icon}</IW>
                  <p>{colName}</p>
                </div>
              }
            >
              {dateAggregationList.map((item, i) => {
                if (sourceSupportDateField?.includes(item.expression)) {
                  return (
                    <DateAggregateFieldContainer
                      colName={colName}
                      key={i}
                      item={item}
                      onClearCheckedList={onClearCheckedList}
                    />
                  );
                }
                return null;
              })}
            </Panel>
          </CollapseWrapper>
        ) : (
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
        )}
      </>
    );
  }, [
    type,
    colName,
    onDeleteComputedField,
    onEditComputedField,
    category,
    t,
    onClearCheckedList,
    drag,
    sourceSupportDateField,
  ]);

  return (
    <Container
      onClick={e => {
        onSelectionChange?.(colName, e.metaKey || e.ctrlKey, e.shiftKey);
      }}
      ref={type === 'DATE' && category === 'field' ? null : drag}
      className={
        type === 'DATE' && category === 'field' ? '' : styleClasses.join(' ')
      }
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
  .ant-collapse-header {
    display: flex;
    flex: 1;
    align-items: center;
    > p {
      flex: 1;
    }
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

const CollapseWrapper = styled(Collapse)`
  .ant-collapse-header {
    padding: 0 !important;
  }
  &.ant-collapse {
    width: 100%;
    .ant-collapse-header {
      > div {
        display: flex;
        align-items: center;
        width: 100% !important;
      }
    }
  }
`;
