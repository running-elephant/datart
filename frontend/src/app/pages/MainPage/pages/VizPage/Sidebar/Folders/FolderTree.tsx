import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Menu, message, Popconfirm, TreeDataNode } from 'antd';
import { MenuListItem, Popup, Tree, TreeTitle } from 'app/components';
import { CascadeAccess } from 'app/pages/MainPage/Access';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { CommonFormTypes } from 'globalConstants';
import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { stopPPG } from 'utils/utils';
import {
  PermissionLevels,
  ResourceTypes,
} from '../../../PermissionPage/constants';
import { SaveFormContext } from '../../SaveFormContext';
import { selectVizListLoading } from '../../slice/selectors';
import {
  deleteViz,
  editFolder,
  getFolders,
  removeTab,
} from '../../slice/thunks';

interface FolderTreeProps {
  selectedId?: string;
  treeData?: TreeDataNode[];
}

export function FolderTree({ selectedId, treeData }: FolderTreeProps) {
  const dispatch = useDispatch();
  const history = useHistory();
  const orgId = useSelector(selectOrgId);
  const loading = useSelector(selectVizListLoading);
  const { showSaveForm } = useContext(SaveFormContext);

  useEffect(() => {
    dispatch(getFolders(orgId));
  }, [dispatch, orgId]);

  const redirect = useCallback(
    tabKey => {
      if (tabKey) {
        history.push(`/organizations/${orgId}/vizs/${tabKey}`);
      } else {
        history.push(`/organizations/${orgId}/vizs`);
      }
    },
    [history, orgId],
  );

  const menuSelect = useCallback(
    (_, { node }) => {
      if (node.relType !== 'FOLDER') {
        history.push(`/organizations/${orgId}/vizs/${node.relId}`);
      }
    },
    [history, orgId],
  );

  const archiveViz = useCallback(
    ({ id: folderId, relId, relType }) =>
      () => {
        let id = folderId;
        let archive = false;
        let msg = '成功删除';

        if (['DASHBOARD', 'DATACHART'].includes(relType)) {
          id = relId;
          archive = true;
          msg = '成功移至回收站';
        }
        dispatch(
          deleteViz({
            params: { id, archive },
            type: relType,
            resolve: () => {
              message.success(msg);
              dispatch(removeTab({ id, resolve: redirect }));
            },
          }),
        );
      },
    [dispatch, redirect],
  );

  const moreMenuClick = useCallback(
    node =>
      ({ key, domEvent }) => {
        domEvent.stopPropagation();
        switch (key) {
          case 'info':
            showSaveForm({
              vizType: node.relType,
              type: CommonFormTypes.Edit,
              visible: true,
              initialValues: { ...node, parentId: node.parentId || void 0 },
              onSave: (values, onClose) => {
                dispatch(
                  editFolder({
                    folder: {
                      ...values,
                      parentId: values.parentId || null,
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
            module={ResourceTypes.Viz}
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
                      title={`确定${
                        node.relType === 'FOLDER' ? '删除' : '移至回收站'
                      }？`}
                      onConfirm={archiveViz(node)}
                    >
                      {node.relType === 'FOLDER' ? '删除' : '移至回收站'}
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
    [moreMenuClick, archiveViz],
  );

  return (
    <Tree
      loading={loading}
      treeData={treeData}
      titleRender={renderTreeTitle}
      onSelect={menuSelect}
      {...(selectedId && { selectedKeys: [selectedId] })}
      defaultExpandAll
      draggable
    />
  );
}
