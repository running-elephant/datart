import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { Menu, message, Popconfirm } from 'antd';
import { MenuListItem, Popup, Tree, TreeTitle } from 'app/components';
import useI18NPrefix, { I18NComponentProps } from 'app/hooks/useI18NPrefix';
import { CascadeAccess } from 'app/pages/MainPage/Access';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { LocalTreeDataNode } from 'app/pages/MainPage/slice/types';
import { CommonFormTypes } from 'globalConstants';
import React, { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getInsertedNodeIndex, onDropTreeFn, stopPPG } from 'utils/utils';
import { isParentIdEqual } from '../../../../slice/utils';
import {
  PermissionLevels,
  ResourceTypes,
} from '../../../PermissionPage/constants';
import { SaveFormContext } from '../../SaveFormContext';
import { selectVizListLoading, selectVizs } from '../../slice/selectors';
import {
  deleteViz,
  editFolder,
  getFolders,
  removeTab,
} from '../../slice/thunks';

interface FolderTreeProps extends I18NComponentProps {
  selectedId?: string;
  treeData?: LocalTreeDataNode[];
}

export function FolderTree({
  selectedId,
  treeData,
  i18nPrefix,
}: FolderTreeProps) {
  const dispatch = useDispatch();
  const history = useHistory();
  const orgId = useSelector(selectOrgId);
  const loading = useSelector(selectVizListLoading);
  const vizsData = useSelector(selectVizs);
  const { showSaveForm } = useContext(SaveFormContext);
  const tg = useI18NPrefix('global');

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
        let msg = tg('operation.deleteSuccess');

        if (['DASHBOARD', 'DATACHART'].includes(relType)) {
          id = relId;
          archive = true;
          msg = tg('operation.archiveSuccess');
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
    [dispatch, redirect, tg],
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
                let index = node.index;
                if (isParentIdEqual(node.parentId, values.parentId)) {
                  index = getInsertedNodeIndex(values, vizsData);
                }

                dispatch(
                  editFolder({
                    folder: {
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
    [dispatch, showSaveForm, vizsData],
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
                    {tg('button.info')}
                  </MenuListItem>
                  <MenuListItem
                    key="delete"
                    prefix={<DeleteOutlined className="icon" />}
                  >
                    <Popconfirm
                      title={`${
                        node.relType === 'FOLDER'
                          ? tg('operation.deleteConfirm')
                          : tg('operation.archiveConfirm')
                      }？`}
                      onConfirm={archiveViz(node)}
                    >
                      {node.relType === 'FOLDER'
                        ? tg('button.delete')
                        : tg('button.archive')}
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
    [moreMenuClick, archiveViz, tg],
  );

  const onDrop = info => {
    onDropTreeFn({
      info,
      treeData,
      callback: (id, parentId, index) => {
        dispatch(
          editFolder({
            folder: {
              id,
              parentId,
              index: index,
            },
            resolve: () => {},
          }),
        );
      },
    });
  };
  return (
    <Tree
      loading={loading}
      treeData={treeData}
      titleRender={renderTreeTitle}
      onSelect={menuSelect}
      onDrop={onDrop}
      {...(selectedId && { selectedKeys: [selectedId] })}
      defaultExpandAll
      draggable
    />
  );
}
