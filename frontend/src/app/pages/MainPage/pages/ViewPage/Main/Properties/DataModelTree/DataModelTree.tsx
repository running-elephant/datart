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
import { Form, Input, Select, Tooltip } from 'antd';
import { Popup, ToolbarButton, Tree } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import useStateModal, { StateModalSize } from 'app/hooks/useStateModal';
import { selectRoles } from 'app/pages/MainPage/pages/MemberPage/slice/selectors';
import { SubjectTypes } from 'app/pages/MainPage/pages/PermissionPage/constants';
import classnames from 'classnames';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { FONT_SIZE_BASE, INFO } from 'styles/StyleConstants';
import { CloneValueDeep, isEmpty, isEmptyArray } from 'utils/object';
import { uuidv4 } from 'utils/utils';
import { ColumnTypes } from '../../../constants';
import { useViewSlice } from '../../../slice';
import {
  selectCurrentEditingView,
  selectCurrentEditingViewAttr,
} from '../../../slice/selectors';
import {
  Column,
  ColumnPermission,
  ColumnRole,
  Model,
} from '../../../slice/types';
import { dataModelColumnSorter } from '../../../utils';
import Container from '../Container';
import {
  ALLOW_COMBINE_COLUMN_TYPES,
  ROOT_CONTAINER_ID,
  TreeNodeHierarchy,
} from './constant';
import DataModelBranch from './DataModelBranch';
import DataModelNode from './DataModelNode';

const DataModelTree: FC = memo(() => {
  const t = useI18NPrefix('view');
  const { actions } = useViewSlice();
  const dispatch = useDispatch();
  const [openStateModal, contextHolder] = useStateModal({});
  const viewId = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'id' }),
  ) as string;
  const currentEditingView = useSelector(selectCurrentEditingView);
  const roles = useSelector(selectRoles);
  const columnPermissions = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'columnPermissions' }),
  ) as ColumnPermission[];
  const [hierarchy, setHierarchy] = useState<Model | undefined>(
    currentEditingView?.model,
  );

  useEffect(() => {
    setHierarchy(currentEditingView?.hierarchy);
  }, [currentEditingView?.hierarchy]);

  const tableColumns = useMemo<Column[]>(() => {
    return Object.entries(hierarchy || {})
      .map(([name, column], index) => {
        return Object.assign({ index }, column, { name });
      })
      .sort(dataModelColumnSorter);
  }, [hierarchy]);

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
      const fullPermissions = Object.keys(hierarchy || {});
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
    [dispatch, actions, viewId, hierarchy, columnPermissions, roleDropdownData],
  );

  const handleDeleteBranch = (node: Column) => {
    const newHierarchy = deleteBranch(tableColumns, node);
    handleDataModelHierarchyChange(newHierarchy);
  };

  const handleNodeTypeChange = (type, name) => {
    const targetNode = tableColumns?.find(n => n.name === name);
    if (targetNode) {
      let newNode;
      if (type.includes('category')) {
        const category = type.split('-')[1];
        newNode = { ...targetNode, category };
      } else {
        newNode = { ...targetNode, type: type };
      }
      const newHierarchy = updateNode(tableColumns, newNode, targetNode.index);
      handleDataModelHierarchyChange(newHierarchy);
      return;
    }
    const targetBranch = tableColumns?.find(b => {
      if (b.children) {
        return b.children?.find(bn => bn.name === name);
      }
      return false;
    });
    if (!!targetBranch) {
      const newNodeIndex = targetBranch.children?.findIndex(
        bn => bn.name === name,
      );
      if (newNodeIndex !== undefined && newNodeIndex > -1) {
        const newTargetBranch = CloneValueDeep(targetBranch);
        if (newTargetBranch.children) {
          let newNode = newTargetBranch.children[newNodeIndex];
          if (type.includes('category')) {
            const category = type.split('-')[1];
            newNode = { ...newNode, category };
          } else {
            newNode = { ...newNode, type: type };
          }
          newTargetBranch.children[newNodeIndex] = newNode;
          const newHierarchy = updateNode(
            tableColumns,
            newTargetBranch,
            newTargetBranch.index,
          );
          handleDataModelHierarchyChange(newHierarchy);
        }
      }
    }
  };

  const handleDataModelHierarchyChange = hierarchy => {
    setHierarchy(hierarchy);
    dispatch(
      actions.changeCurrentEditingView({
        hierarchy: hierarchy,
      }),
    );
  };

  const handleDragEnd = result => {
    if (Boolean(result.destination) && isEmpty(result?.combine)) {
      const newHierarchy = reorderNode(
        CloneValueDeep(tableColumns),
        { name: result.draggableId },
        {
          name: result.destination.droppableId,
          index: result.destination.index,
        },
      );
      return handleDataModelHierarchyChange(newHierarchy);
    }
    if (!Boolean(result.destination) && !isEmpty(result?.combine)) {
      const clonedTableColumns = CloneValueDeep(tableColumns);
      const sourceNode = clonedTableColumns?.find(
        c => c.name === result.draggableId,
      );
      const targetNode = clonedTableColumns?.find(
        c => c.name === result.combine.draggableId,
      );
      if (
        sourceNode &&
        sourceNode.role !== ColumnRole.Hierarchy &&
        targetNode &&
        targetNode.role !== ColumnRole.Hierarchy &&
        ALLOW_COMBINE_COLUMN_TYPES.includes(sourceNode.type) &&
        ALLOW_COMBINE_COLUMN_TYPES.includes(targetNode.type)
      ) {
        return openCreateHierarchyModal(sourceNode, targetNode);
      } else if (
        sourceNode &&
        sourceNode.role !== ColumnRole.Hierarchy &&
        targetNode &&
        targetNode.role === ColumnRole.Hierarchy &&
        ALLOW_COMBINE_COLUMN_TYPES.includes(sourceNode.type)
      ) {
        const newHierarchy = reorderNode(
          clonedTableColumns,
          { name: result.draggableId },
          {
            name: result.combine.draggableId,
            index: -1,
          },
        );
        return handleDataModelHierarchyChange(newHierarchy);
      }
    }
  };

  const openCreateHierarchyModal = (...nodes: Column[]) => {
    return (openStateModal as Function)({
      title: t('model.newHierarchy'),
      modalSize: StateModalSize.XSMALL,
      onOk: hierarchyName => {
        if (!hierarchyName) {
          return;
        }
        const hierarchyNode: Column = {
          name: hierarchyName,
          type: ColumnTypes.String,
          role: ColumnRole.Hierarchy,
          children: nodes,
        };
        const newHierarchy = insertNode(tableColumns, hierarchyNode, nodes);
        handleDataModelHierarchyChange(newHierarchy);
      },
      content: onChangeEvent => {
        const allNodeNames = tableColumns?.flatMap(c => {
          if (!isEmptyArray(c.children)) {
            return [c.name].concat(c.children?.map(cc => cc.name) || []);
          }
          return c.name;
        });
        return (
          <Form.Item
            label={t('model.hierarchyName')}
            name="hierarchyName"
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!allNodeNames.includes(getFieldValue('hierarchyName'))) {
                    return Promise.resolve(value);
                  }
                  return Promise.reject(new Error('名称重复，请检查!'));
                },
              }),
            ]}
          >
            <Input onChange={e => onChangeEvent(e.target?.value)} />
          </Form.Item>
        );
      },
    });
  };

  const openMoveToHierarchyModal = (node: Column) => {
    const currrentHierarchies = tableColumns?.filter(
      c =>
        c.role === ColumnRole.Hierarchy &&
        !c?.children?.find(cn => cn.name === node.name),
    );

    return (openStateModal as Function)({
      title: t('model.addToHierarchy'),
      modalSize: StateModalSize.XSMALL,
      onOk: hierarchyName => {
        if (currrentHierarchies?.find(h => h.name === hierarchyName)) {
          let newHierarchy = moveNode(
            tableColumns,
            node,
            currrentHierarchies,
            hierarchyName,
          );
          handleDataModelHierarchyChange(newHierarchy);
        }
      },
      content: onChangeEvent => {
        return (
          <Form.Item
            label={t('model.hierarchyName')}
            name="hierarchyName"
            rules={[{ required: true }]}
          >
            <Select defaultActiveFirstOption onChange={onChangeEvent}>
              {currrentHierarchies?.map(n => (
                <Select.Option value={n.name}>{n.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      },
    });
  };

  const openEditBranchModal = (node: Column) => {
    const allNodeNames = tableColumns
      ?.flatMap(c => {
        if (!isEmptyArray(c.children)) {
          return c.children?.map(cc => cc.name);
        }
        return c.name;
      })
      .filter(n => n !== node.name);

    return (openStateModal as Function)({
      title: t('model.rename'),
      modalSize: StateModalSize.XSMALL,
      onOk: newName => {
        if (!newName) {
          return;
        }
        const newHierarchy = updateNode(
          tableColumns,
          { ...node, name: newName },
          node.index,
        );
        handleDataModelHierarchyChange(newHierarchy);
      },
      content: onChangeEvent => {
        return (
          <Form.Item
            label={t('model.rename')}
            initialValue={node?.name}
            name="rename"
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!allNodeNames.includes(getFieldValue('rename'))) {
                    return Promise.resolve(value);
                  }
                  return Promise.reject(new Error('名称重复，请检查!'));
                },
              }),
            ]}
          >
            <Input
              onChange={e => {
                onChangeEvent(e.target?.value);
              }}
            />
          </Form.Item>
        );
      },
    });
  };

  const reorderNode = (
    columns: Column[],
    source: { name: string },
    target: { name: string; index: number },
  ) => {
    let sourceItem: Column | undefined;
    const removeIndex = columns.findIndex(c => c.name === source.name);
    if (removeIndex > -1) {
      sourceItem = columns.splice(removeIndex, 1)?.[0];
    } else {
      const branchNode = columns.filter(
        c =>
          c.role === ColumnRole.Hierarchy &&
          c.children?.find(cc => cc.name === source.name),
      )?.[0];
      if (!branchNode) {
        return toModel(columns);
      }
      const removeIndex = branchNode.children!.findIndex(
        c => c.name === source.name,
      );
      if (removeIndex === -1) {
        return toModel(columns);
      }
      sourceItem = branchNode.children?.splice(removeIndex, 1)?.[0];
    }

    if (!sourceItem) {
      return toModel(columns);
    }

    if (target.name === ROOT_CONTAINER_ID) {
      columns.splice(target.index, 0, sourceItem);
    } else {
      const branchNode = columns.filter(
        c => c.role === ColumnRole.Hierarchy && c.name === target.name,
      )?.[0];
      if (!branchNode) {
        return toModel(columns);
      }
      if (target.index === -1) {
        branchNode.children!.push(sourceItem);
      } else {
        branchNode.children!.splice(target.index, 0, sourceItem);
      }
    }
    return toModel(columns);
  };

  const insertNode = (columns: Column[], newNode, nodes: Column[]) => {
    const newColumns = columns.filter(
      c => !nodes.map(n => n.name).includes(c.name),
    );
    newColumns.unshift(newNode);
    return toModel(newColumns);
  };

  const updateNode = (columns: Column[], newNode, updateIndex) => {
    columns[updateIndex] = newNode;
    return toModel(columns);
  };

  const deleteBranch = (columns: Column[], node: Column) => {
    const deletedBranchIndex = columns.findIndex(c => c.name === node.name);
    if (deletedBranchIndex > -1) {
      const branch = columns[deletedBranchIndex];
      const children = branch?.children || [];
      columns.splice(deletedBranchIndex, 1);
      return toModel(columns, ...children);
    }
  };

  const moveNode = (
    columns: Column[],
    node: Column,
    currrentHierarchies: Column[],
    hierarchyName,
  ) => {
    const nodeIndex = columns?.findIndex(c => c.name === node.name);
    if (nodeIndex !== undefined && nodeIndex > -1) {
      columns.splice(nodeIndex, 1);
    } else {
      const branch = columns?.find(c =>
        c.children?.find(cc => cc.name === node.name),
      );
      if (branch) {
        branch.children =
          branch.children?.filter(bc => bc.name !== node.name) || [];
      }
    }
    const targetHierarchy = currrentHierarchies?.find(
      h => h.name === hierarchyName,
    );
    const clonedhierarchy = CloneValueDeep(targetHierarchy!);
    clonedhierarchy.children = (clonedhierarchy.children || []).concat([node]);
    return updateNode(
      columns,
      clonedhierarchy,
      columns.findIndex(c => c.name === clonedhierarchy.name),
    );
  };

  const toModel = (columns: Column[], ...additional) => {
    return columns.concat(...additional)?.reduce((acc, cur, newIndex) => {
      if (cur?.role === ColumnRole.Hierarchy && isEmptyArray(cur?.children)) {
        return acc;
      }
      if (cur?.role === ColumnRole.Hierarchy && !isEmptyArray(cur?.children)) {
        const orderedChildren = cur.children?.map((child, newIndex) => {
          return {
            ...child,
            index: newIndex,
          };
        });
        acc[cur.name] = Object.assign({}, cur, {
          index: newIndex,
          children: orderedChildren,
        });
      } else {
        acc[cur.name] = Object.assign({}, cur, { index: newIndex });
      }
      return acc;
    }, {});
  };

  const getPermissionButton = useCallback(
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

  return (
    <Container title="model">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId={ROOT_CONTAINER_ID}
          type={TreeNodeHierarchy.Root}
          isCombineEnabled={true}
        >
          {(droppableProvided, droppableSnapshot) => (
            <StyledDroppableContainer
              ref={droppableProvided.innerRef}
              isDraggingOver={droppableSnapshot.isDraggingOver}
            >
              {tableColumns.map(col => {
                return col.role === ColumnRole.Hierarchy ? (
                  <DataModelBranch
                    node={col}
                    key={col.name}
                    getPermissionButton={getPermissionButton}
                    onNodeTypeChange={handleNodeTypeChange}
                    onMoveToHierarchy={openMoveToHierarchyModal}
                    onEditBranch={openEditBranchModal}
                    onDelete={handleDeleteBranch}
                  />
                ) : (
                  <DataModelNode
                    node={col}
                    key={col.name}
                    getPermissionButton={getPermissionButton}
                    onCreateHierarchy={openCreateHierarchyModal}
                    onNodeTypeChange={handleNodeTypeChange}
                    onMoveToHierarchy={openMoveToHierarchyModal}
                  />
                );
              })}
              {droppableProvided.placeholder}
            </StyledDroppableContainer>
          )}
        </Droppable>
      </DragDropContext>
      {contextHolder}
    </Container>
  );
});

export default DataModelTree;

const StyledDroppableContainer = styled.div<{ isDraggingOver }>`
  user-select: 'none';
`;
