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
import { vizActions } from '../../slice';
import { LocalTreeDataNode } from 'app/pages/MainPage/slice/types';
import { setTreeIndexFn } from './utils';
import { loopTree } from 'utils/utils';
interface FolderTreeProps {
  selectedId?: string;
  treeData?: LocalTreeDataNode[];
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
                let index = node.index;

                if(values.parentId && values.parentId !== node.parentId){
                  index = setTreeIndexFn(values,treeData);
                }
                
                dispatch(
                  editFolder({
                    folder: {
                      ...values,
                      parentId: values.parentId || null,
                      index: index,
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
    [dispatch, showSaveForm, treeData],
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

  const onDrop = (info) =>{
    const dropKey = info.node.key; //落下的key
    const dragKey = info.dragNode.key;//拖动的key
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const data = treeData ? treeData : [];

    let dragObj
    ,   ar
    ,   i
    ,   index = 0;

    loopTree(data, dragKey, 'key', (item) => {
      dragObj = item;
    });

    loopTree(data, dropKey, 'key', (item, index, arr) => {
        ar = arr;
        i = index;
    });

    if(ar[i].parentId === dragObj.id || (ar[i].isFolder && ar[i].id === dragObj.id) ){
      return false;
    }
    
    if(!info.dropToGap){ //如果移动到二级目录里面的第一个，获取到该目录children中[0]元素的index-1
      index = ar[i].children ? (ar[i].children[0]?.index) - 1 : 0
    }else if(dropPosition === -1 ){ // 移动到第一个
      index = ar[i] ? (ar[i].index) - 1 : 0
    }else if(i  === ar.length - 1 ){ // 移动到最后一个
      index = ar[ar.length - 1].index + 1
    }else{ //中间
      index = (ar[i].index  + ar[i+1].index) / 2
    }

    dispatch(
      editFolder({
        folder: {
          id:dragObj.id,
          parentId: !info.dropToGap ? ar[i].id : ar[i].parentId || null, 
                    //如果移动到二级目录里面的第一个，就用当前目录的id,如果不是就用文件的parentId
          index: index,
        },
        resolve: () =>{

        },
      }),
    );

  };

  return (
    <div>
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
      
    </div>
    
  );
}
