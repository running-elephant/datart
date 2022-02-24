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

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Popup, ToolbarButton, Tree } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { selectRoles } from 'app/pages/MainPage/pages/MemberPage/slice/selectors';
import { SubjectTypes } from 'app/pages/MainPage/pages/PermissionPage/constants';
import classnames from 'classnames';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { FONT_SIZE_BASE, INFO } from 'styles/StyleConstants';
import { uuidv4 } from 'utils/utils';
import { useViewSlice } from '../../../slice';
import {
  selectCurrentEditingView,
  selectCurrentEditingViewAttr,
} from '../../../slice/selectors';
import { Column, ColumnPermission, Model } from '../../../slice/types';
import Container from '../Container';
import DataModelNode from './DataModelNode';

const DataModelTree: FC = memo(() => {
  const t = useI18NPrefix('view');
  const { actions } = useViewSlice();
  const dispatch = useDispatch();
  const viewId = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'id' }),
  ) as string;
  const currentEditingView = useSelector(selectCurrentEditingView);
  const roles = useSelector(selectRoles);
  const columnPermissions = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'columnPermissions' }),
  ) as ColumnPermission[];
  const [model, setModel] = useState<Model | undefined>(
    currentEditingView?.model,
  );

  useEffect(() => {
    setModel(currentEditingView?.model);
  }, [currentEditingView?.model]);

  const tableColumns = useMemo<Column[]>(() => {
    const columns = Object.entries(model || {}).map(([name, column], index) => {
      return Object.assign({ index }, column, { name });
    });
    return columns.sort((pre, next) => pre.index - next.index);
  }, [model]);

  const roleDropdownData = useMemo(
    () =>
      roles.map(({ id, name }) => ({
        key: id,
        title: name,
        value: id,
        isLeaf: true,
      })),
    [roles],
  );

  const checkRoleColumnPermission = useCallback(
    columnName => checkedKeys => {
      const fullPermissions = Object.keys(model || {});
      dispatch(
        actions.changeCurrentEditingView({
          columnPermissions: roleDropdownData.reduce<ColumnPermission[]>(
            (updated, { key }) => {
              const permission = columnPermissions.find(
                ({ subjectId }) => subjectId === key,
              );
              const checkOnCurrentRole = checkedKeys.includes(key);
              if (permission) {
                if (checkOnCurrentRole) {
                  const updatedColumnPermission = Array.from(
                    new Set(permission.columnPermission.concat(columnName)),
                  );
                  return fullPermissions.sort().join(',') !==
                    updatedColumnPermission.sort().join(',')
                    ? updated.concat({
                        ...permission,
                        columnPermission: updatedColumnPermission,
                      })
                    : updated;
                } else {
                  return updated.concat({
                    ...permission,
                    columnPermission: permission.columnPermission.filter(
                      c => c !== columnName,
                    ),
                  });
                }
              } else {
                return !checkOnCurrentRole
                  ? updated.concat({
                      id: uuidv4(),
                      viewId,
                      subjectId: key,
                      subjectType: SubjectTypes.Role,
                      columnPermission: fullPermissions.filter(
                        c => c !== columnName,
                      ),
                    })
                  : updated;
              }
            },
            [],
          ),
        }),
      );
    },
    [dispatch, actions, viewId, model, columnPermissions, roleDropdownData],
  );

  const getPermssionButton = useCallback(
    (name: string) => {
      // 没有记录相当于对所有字段都有权限
      const checkedKeys =
        columnPermissions.length > 0
          ? roleDropdownData.reduce<string[]>((selected, { key }) => {
              const permission = columnPermissions.find(
                ({ subjectId }) => subjectId === key,
              );
              if (permission) {
                return permission.columnPermission.includes(name)
                  ? selected.concat(key)
                  : selected;
              } else {
                return selected.concat(key);
              }
            }, [])
          : roleDropdownData.map(({ key }) => key);

      return (
        <Popup
          key={`${name}_columnpermission`}
          trigger={['click']}
          placement="bottomRight"
          content={
            <Tree
              className="dropdown"
              treeData={roleDropdownData}
              checkedKeys={checkedKeys}
              loading={false}
              selectable={false}
              onCheck={checkRoleColumnPermission(name)}
              blockNode
              checkable
            />
          }
        >
          <Tooltip title={t('columnPermission.title')}>
            <ToolbarButton
              size="small"
              iconSize={FONT_SIZE_BASE}
              icon={
                checkedKeys.length > 0 ? (
                  <EyeOutlined
                    style={{ color: INFO }}
                    className={classnames({
                      partial: checkedKeys.length !== roleDropdownData.length,
                    })}
                  />
                ) : (
                  <EyeInvisibleOutlined />
                )
              }
            />
          </Tooltip>
        </Popup>
      );
    },
    [columnPermissions, roleDropdownData, checkRoleColumnPermission, t],
  );

  const handleNodeTypeChange =
    (columnName: string, column: Omit<Column, 'name'>) =>
    ({ key }) => {
      let value;
      if (key.includes('category')) {
        const category = key.split('-')[1];
        value = { ...column, category };
      } else {
        value = { ...column, type: key };
      }
      dispatch(
        actions.changeCurrentEditingView({
          model: { ...model, [columnName]: value },
        }),
      );
    };

  const handleDataModelChange = model => {
    setModel(model);
    dispatch(
      actions.changeCurrentEditingView({
        model: model,
      }),
    );
  };

  const handleDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const newModel = reorder(
      tableColumns,
      result.source.index,
      result.destination.index,
    );
    handleDataModelChange(newModel);
  };

  const reorder = (columns, startIndex, endIndex) => {
    const [removed] = columns.splice(startIndex, 1);
    columns.splice(endIndex, 0, removed);
    return columns?.reduce((acc, cur, newIndex) => {
      acc[cur.name] = Object.assign({}, cur, { index: newIndex });
      return acc;
    }, {});
  };

  return (
    <Container title="model">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided, droppableSnapshot) => (
            <StyledDroppableContainer
              ref={droppableProvided.innerRef}
              isDraggingOver={droppableSnapshot.isDraggingOver}
            >
              {tableColumns.map(col => (
                <DataModelNode
                  node={col}
                  getPermissionButton={getPermssionButton}
                  onNodeTypeChange={handleNodeTypeChange}
                />
              ))}
              {droppableProvided.placeholder}
            </StyledDroppableContainer>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
});

export default DataModelTree;

const StyledDroppableContainer = styled.div<{ isDraggingOver }>`
  user-select: 'none';
  background: ${p => (p.isDraggingOver ? 'lightblue' : 'transparent')};
`;
