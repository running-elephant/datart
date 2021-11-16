import {
  DeleteOutlined,
  MoreOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Menu, message, Popconfirm, TreeDataNode } from 'antd';
import { MenuListItem, Popup, Tree, TreeTitle } from 'app/components';
import { getCascadeAccess } from 'app/pages/MainPage/Access';
import {
  selectIsOrgOwner,
  selectOrgId,
  selectPermissionMap,
} from 'app/pages/MainPage/slice/selectors';
import { CommonFormTypes } from 'globalConstants';
import { memo, useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getInsertedNodeIndex, getPath, stopPPG } from 'utils/utils';
import {
  PermissionLevels,
  ResourceTypes,
} from '../../PermissionPage/constants';
import { SaveFormContext } from '../SaveFormContext';
import {
  selectArchivedListLoading,
  selectCurrentEditingViewKey,
  selectViews,
} from '../slice/selectors';
import {
  deleteView,
  getArchivedViews,
  removeEditingView,
  unarchiveView,
} from '../slice/thunks';

interface RecycleProps {
  list?: TreeDataNode[];
}

export const Recycle = memo(({ list }: RecycleProps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { showSaveForm } = useContext(SaveFormContext);
  const loading = useSelector(selectArchivedListLoading);
  const orgId = useSelector(selectOrgId);
  const currentEditingViewKey = useSelector(selectCurrentEditingViewKey);
  const views = useSelector(selectViews);
  const isOwner = useSelector(selectIsOrgOwner);
  const permissionMap = useSelector(selectPermissionMap);

  useEffect(() => {
    dispatch(getArchivedViews(orgId));
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

  const del = useCallback(
    id => e => {
      e.stopPropagation();
      dispatch(
        deleteView({
          id,
          archive: false,
          resolve: () => {
            dispatch(removeEditingView({ id, resolve: redirect }));
            message.success('删除成功');
          },
        }),
      );
    },
    [dispatch, redirect],
  );

  const moreMenuClick = useCallback(
    (id, name) =>
      ({ key, domEvent }) => {
        domEvent.stopPropagation();
        switch (key) {
          case 'reset':
            showSaveForm({
              type: CommonFormTypes.Edit,
              visible: true,
              simple: true,
              initialValues: { name, parentId: null },
              parentIdLabel: '目录',
              onSave: (values, onClose) => {
                let index = getInsertedNodeIndex(values, views);

                dispatch(
                  unarchiveView({
                    view: { ...values, id, index },
                    resolve: () => {
                      dispatch(removeEditingView({ id, resolve: redirect }));
                      message.success('还原成功');
                      onClose();
                    },
                  }),
                );
              },
            });
            break;
          default:
            break;
        }
      },
    [dispatch, showSaveForm, redirect, views],
  );

  const renderTreeTitle = useCallback(
    ({ key, title, parentId }) => {
      const path = views
        ? getPath(
            views as Array<{ id: string; parentId: string }>,
            { id: key, parentId },
            ResourceTypes.View,
          )
        : [];
      const allowManage = getCascadeAccess(
        isOwner,
        permissionMap,
        ResourceTypes.View,
        path,
        PermissionLevels.Manage,
      );
      return (
        <TreeTitle>
          <h4>{`${title}`}</h4>
          {allowManage && (
            <Popup
              trigger={['click']}
              placement="bottomRight"
              content={
                <Menu
                  prefixCls="ant-dropdown-menu"
                  selectable={false}
                  onClick={moreMenuClick(key, title)}
                >
                  <MenuListItem
                    key="reset"
                    prefix={<ReloadOutlined className="icon" />}
                  >
                    还原
                  </MenuListItem>
                  <MenuListItem
                    key="delelte"
                    prefix={<DeleteOutlined className="icon" />}
                  >
                    <Popconfirm title="确认删除？" onConfirm={del(key)}>
                      删除
                    </Popconfirm>
                  </MenuListItem>
                </Menu>
              }
            >
              <span className="action" onClick={stopPPG}>
                <MoreOutlined />
              </span>
            </Popup>
          )}
        </TreeTitle>
      );
    },
    [moreMenuClick, del, views, isOwner, permissionMap],
  );

  const treeSelect = useCallback(
    (_, { node }) => {
      if (!node.isFolder && node.key !== currentEditingViewKey) {
        history.push(`/organizations/${orgId}/views/${node.key}`);
      }
    },
    [history, orgId, currentEditingViewKey],
  );

  return (
    <Tree
      loading={loading}
      treeData={list}
      titleRender={renderTreeTitle}
      onSelect={treeSelect}
    />
  );
});
