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
  BranchesOutlined,
  CalendarOutlined,
  FieldStringOutlined,
  FileUnknownOutlined,
  NumberOutlined,
  SisternodeOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Dropdown, Menu, Tooltip } from 'antd';
import { IW, ToolbarButton } from 'app/components';
import { DataViewFieldType } from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, memo, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_BASE,
  FONT_SIZE_HEADING,
  INFO,
  SPACE,
  SUCCESS,
  WARNING,
} from 'styles/StyleConstants';
import { ColumnCategories } from '../../../constants';
import { Column } from '../../../slice/types';
import { ALLOW_COMBINE_COLUMN_TYPES } from './constant';

const DataModelNode: FC<{
  node: Column;
  getPermissionButton: (name) => JSX.Element;
  onNodeTypeChange: (type: any, name: string) => void;
  onMoveToHierarchy: (node: Column) => void;
  onCreateHierarchy?: (node: Column) => void;
}> = memo(
  ({
    node,
    getPermissionButton,
    onCreateHierarchy,
    onMoveToHierarchy,
    onNodeTypeChange,
  }) => {
    const t = useI18NPrefix('view.model');
    const tg = useI18NPrefix('global');
    const [isHover, setIsHover] = useState(false);
    const hasCategory = true;

    const renderNode = (node, isDragging) => {
      let icon;
      switch (node.type) {
        case DataViewFieldType.NUMERIC:
          icon = (
            <NumberOutlined style={{ alignSelf: 'center', color: SUCCESS }} />
          );
          break;
        case DataViewFieldType.STRING:
          icon = (
            <FieldStringOutlined style={{ alignSelf: 'center', color: INFO }} />
          );
          break;
        case DataViewFieldType.DATE:
          icon = (
            <CalendarOutlined style={{ alignSelf: 'center', color: INFO }} />
          );
          break;
        default:
          icon = (
            <FileUnknownOutlined
              style={{ alignSelf: 'center', color: WARNING }}
            />
          );
          break;
      }

      const isAllowCreateHierarchy = node => {
        return ALLOW_COMBINE_COLUMN_TYPES.includes(node.type);
      };

      return (
        <div
          className="content"
          onMouseEnter={() => {
            setIsHover(true);
          }}
          onMouseLeave={() => {
            setIsHover(false);
          }}
        >
          <IW fontSize={FONT_SIZE_HEADING}>{icon}</IW>
          <span>{node.name}</span>
          <div className="action">
            {isHover && !isDragging && (
              <Dropdown
                trigger={['click']}
                overlay={
                  <Menu
                    selectedKeys={[node.type, `category-${node.category}`]}
                    className="datart-schema-table-header-menu"
                    onClick={({ key }) => onNodeTypeChange(key, node?.name)}
                  >
                    {Object.values(DataViewFieldType).map(t => (
                      <Menu.Item key={t}>
                        {tg(`columnType.${t.toLowerCase()}`)}
                      </Menu.Item>
                    ))}
                    {hasCategory && (
                      <>
                        <Menu.Divider />
                        <Menu.SubMenu
                          key="categories"
                          title={t('category')}
                          popupClassName="datart-schema-table-header-menu"
                        >
                          {Object.values(ColumnCategories).map(t => (
                            <Menu.Item key={`category-${t}`}>
                              {tg(`columnCategory.${t.toLowerCase()}`)}
                            </Menu.Item>
                          ))}
                        </Menu.SubMenu>
                      </>
                    )}
                  </Menu>
                }
              >
                <Tooltip
                  title={hasCategory ? t('typeAndCategory') : t('category')}
                >
                  <ToolbarButton
                    size="small"
                    iconSize={FONT_SIZE_BASE}
                    className="suffix"
                    icon={<SwapOutlined style={{ color: INFO }} />}
                  />
                </Tooltip>
              </Dropdown>
            )}
            {isHover && !isDragging && getPermissionButton(node?.name)}
            {isHover &&
              !isDragging &&
              isAllowCreateHierarchy(node) &&
              onCreateHierarchy && (
                <Tooltip title={t('newHierarchy')}>
                  <ToolbarButton
                    size="small"
                    iconSize={FONT_SIZE_BASE}
                    className="suffix"
                    onClick={() => onCreateHierarchy(node)}
                    icon={<BranchesOutlined style={{ color: INFO }} />}
                  />
                </Tooltip>
              )}
            {isHover && !isDragging && isAllowCreateHierarchy(node) && (
              <Tooltip title={t('addToHierarchy')}>
                <ToolbarButton
                  size="small"
                  iconSize={FONT_SIZE_BASE}
                  className="suffix"
                  onClick={() => onMoveToHierarchy(node)}
                  icon={<SisternodeOutlined style={{ color: INFO }} />}
                />
              </Tooltip>
            )}
          </div>
        </div>
      );
    };

    return (
      <Draggable key={node?.name} draggableId={node?.name} index={node?.index}>
        {(draggableProvided, draggableSnapshot) => (
          <StyledDataModelNode
            isDragging={draggableSnapshot.isDragging}
            style={draggableProvided.draggableProps.style}
            ref={draggableProvided.innerRef}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
          >
            {renderNode(node, draggableSnapshot.isDragging)}
          </StyledDataModelNode>
        )}
      </Draggable>
    );
  },
);

export default DataModelNode;

const StyledDataModelNode = styled.div<{
  isDragging: boolean;
}>`
  line-height: 32px;
  margin: ${SPACE};
  user-select: 'none';
  background: ${p =>
    p.isDragging ? p.theme.highlightBackground : 'transparent'};
  font-size: ${FONT_SIZE_BASE};

  & .content {
    display: flex;
  }

  & .action {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    padding-right: ${FONT_SIZE_BASE}px;
  }
`;
