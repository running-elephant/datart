import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Menu, message, Popconfirm, TreeDataNode } from 'antd';
import { MenuListItem, Popup, Tree, TreeTitle } from 'app/components';
import { CascadeAccess } from 'app/pages/MainPage/Access';
import {
  selectIsOrgOwner,
  selectOrgId,
  selectPermissionMap,
} from 'app/pages/MainPage/slice/selectors';
import { CommonFormTypes } from 'globalConstants';
import React, { memo, useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { stopPPG } from 'utils/utils';
import {
  PermissionLevels,
  ResourceTypes,
} from '../../PermissionPage/constants';
import { SaveFormContext } from '../SaveFormContext';
import {
  selectCurrentEditingViewKey,
  selectViewListLoading,
} from '../slice/selectors';
import {
  deleteView,
  getViews,
  removeEditingView,
  updateViewBase,
} from '../slice/thunks';

interface FolderTreeProps {
  treeData?: TreeDataNode[];
}

export const FolderTree = memo(({ treeData }: FolderTreeProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { showSaveForm } = useContext(SaveFormContext);
  const loading = useSelector(selectViewListLoading);
  const currentEditingViewKey = useSelector(selectCurrentEditingViewKey);
  const orgId = useSelector(selectOrgId);
  const isOwner = useSelector(selectIsOrgOwner);
  const permissionMap = useSelector(selectPermissionMap);

  useEffect(() => {
    dispatch(getViews(orgId));
  }, [dispatch, orgId]);

  const redirect = useCallback(
    currentEditingViewKey => {
      if (currentEditingViewKey) {
        history.push(`/organizations/${orgId}/views/${currentEditingViewKey}`);
      } else {
        history.push(`/organizations/${orgId}/views`);
      }
    },
    [history, orgId],
  );

  const archive = useCallback(
    (id, isFolder) => e => {
      e.stopPropagation();
      dispatch(
        deleteView({
          id,
          archive: !isFolder,
          resolve: () => {
            dispatch(removeEditingView({ id, resolve: redirect }));
            message.success(`成功${isFolder ? '删除' : '移至回收站'}`);
          },
        }),
      );
    },
    [dispatch, redirect],
  );

  const moreMenuClick = useCallback(
    ({ id, name, parentId, index }) =>
      ({ key, domEvent }) => {
        domEvent.stopPropagation();
        switch (key) {
          case 'info':
            showSaveForm({
              type: CommonFormTypes.Edit,
              visible: true,
              simple: true,
              initialValues: {
                id,
                name,
                parentId,
              },
              parentIdLabel: '目录',
              onSave: (values, onClose) => {
                dispatch(
                  updateViewBase({
                    view: {
                      id,
                      ...values,
                      parentId: values.parentId || null,
                      index,
                    },
                    resolve: onClose,
                  }),
                );
              },
            });
            break;
          case 'delete':
            break;
          default:
            break;
        }
      },
    [dispatch, showSaveForm],
  );

  const renderTreeTitle = useCallback(
    node => {
      return (
        <TreeTitle>
          <h4>{`${node.title}`}</h4>
          <CascadeAccess
            module={ResourceTypes.View}
            path={node.path}
            level={PermissionLevels.Manage}
          >
            <Popup
              trigger={['click']}
              placement="bottom"
              content={
                <Menu
                  prefixCls="ant-dropdown-menu"
                  selectable={false}
                  onClick={moreMenuClick(node)}
                >
                  <MenuListItem
                    key="info"
                    prefix={<EditOutlined className="icon" />}
                  >
                    基本信息
                  </MenuListItem>
                  <MenuListItem
                    key="delete"
                    prefix={<DeleteOutlined className="icon" />}
                  >
                    <Popconfirm
                      title={`确定${node.isFolder ? '删除' : '移至回收站'}？`}
                      onConfirm={archive(node.id, node.isFolder)}
                    >
                      {node.isFolder ? '删除' : '移至回收站'}
                    </Popconfirm>
                  </MenuListItem>
                </Menu>
              }
            >
              <span className="action" onClick={stopPPG}>
                <MoreOutlined />
              </span>
            </Popup>
          </CascadeAccess>
        </TreeTitle>
      );
    },
    [archive, moreMenuClick],
  );

  const treeSelect = useCallback(
    (_, { node }) => {
      if (!node.isFolder && node.id !== currentEditingViewKey) {
        history.push(`/organizations/${orgId}/views/${node.id}`);
      }
    },
    [history, orgId, currentEditingViewKey],
  );

  return (
    <Tree
      loading={loading}
      treeData={treeData}
      titleRender={renderTreeTitle}
      selectedKeys={[currentEditingViewKey]}
      onSelect={treeSelect}
      defaultExpandAll
      draggable
    />
  );
});
