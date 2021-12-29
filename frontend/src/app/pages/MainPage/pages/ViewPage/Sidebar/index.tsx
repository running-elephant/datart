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
  CodeFilled,
  DeleteOutlined,
  FileOutlined,
  FolderFilled,
  FolderOpenFilled,
  FolderOutlined,
} from '@ant-design/icons';
import { ListNav, ListPane, ListTitle } from 'app/components';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { CommonFormTypes } from 'globalConstants';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
import { getInsertedNodeIndex, uuidv4 } from 'utils/utils';
import { UNPERSISTED_ID_PREFIX } from '../constants';
import { SaveFormContext } from '../SaveFormContext';
import {
  makeSelectViewTree,
  selectArchived,
  selectViews,
} from '../slice/selectors';
import { saveFolder } from '../slice/thunks';
import { ViewSimpleViewModel } from '../slice/types';
import { FolderTree } from './FolderTree';
import { Recycle } from './Recycle';

export const Sidebar = memo(() => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { showSaveForm } = useContext(SaveFormContext);
  const orgId = useSelector(selectOrgId);
  const selectViewTree = useMemo(makeSelectViewTree, []);
  const viewsData = useSelector(selectViews);

  const getIcon = useCallback(
    ({ isFolder }: ViewSimpleViewModel) =>
      isFolder ? (
        p => (p.expanded ? <FolderOpenFilled /> : <FolderFilled />)
      ) : (
        <CodeFilled />
      ),
    [],
  );
  const getDisabled = useCallback(
    ({ deleteLoading }: ViewSimpleViewModel) => deleteLoading,
    [],
  );

  const treeData = useSelector(state =>
    selectViewTree(state, { getIcon, getDisabled }),
  );

  const { filteredData: filteredTreeData, debouncedSearch: treeSearch } =
    useDebouncedSearch(treeData, (keywords, d) =>
      d.title.toLowerCase().includes(keywords.toLowerCase()),
    );
  const archived = useSelector(selectArchived);
  const recycleList = useMemo(
    () =>
      archived?.map(({ id, name, parentId, isFolder, deleteLoading }) => ({
        key: id,
        title: name,
        parentId,
        icon: isFolder ? <FolderOutlined /> : <FileOutlined />,
        isFolder,
        disabled: deleteLoading,
      })),
    [archived],
  );
  const { filteredData: filteredListData, debouncedSearch: listSearch } =
    useDebouncedSearch(recycleList, (keywords, d) =>
      d.title.toLowerCase().includes(keywords.toLowerCase()),
    );

  const add = useCallback(
    ({ key }) => {
      switch (key) {
        case 'view':
          history.push(
            `/organizations/${orgId}/views/${`${UNPERSISTED_ID_PREFIX}${uuidv4()}`}`,
          );
          break;
        case 'folder':
          showSaveForm({
            type: CommonFormTypes.Add,
            visible: true,
            simple: true,
            parentIdLabel: '所属目录',
            onSave: (values, onClose) => {
              let index = getInsertedNodeIndex(values, viewsData);

              dispatch(
                saveFolder({
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
        default:
          break;
      }
    },
    [dispatch, history, orgId, showSaveForm, viewsData],
  );

  const titles = useMemo(
    () => [
      {
        key: 'list',
        title: '数据视图列表',
        search: true,
        add: {
          items: [
            { key: 'view', text: '新建数据视图' },
            { key: 'folder', text: '新建目录' },
          ],
          callback: add,
        },
        more: {
          items: [
            {
              key: 'recycle',
              text: '回收站',
              prefix: <DeleteOutlined className="icon" />,
            },
          ],
          callback: (key, _, onNext) => {
            switch (key) {
              case 'recycle':
                onNext();
                break;
            }
          },
        },
        onSearch: treeSearch,
      },
      {
        key: 'recycle',
        title: '回收站',
        back: true,
        search: true,
        onSearch: listSearch,
      },
    ],
    [add, treeSearch, listSearch],
  );

  return (
    <Wrapper defaultActiveKey="list">
      <ListPane key="list">
        <ListTitle {...titles[0]} />
        <FolderTree treeData={filteredTreeData} />
      </ListPane>
      <ListPane key="recycle">
        <ListTitle {...titles[1]} />
        <Recycle list={filteredListData} />
      </ListPane>
    </Wrapper>
  );
});

const Wrapper = styled(ListNav)`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: ${SPACE_XS} 0;
  background-color: ${p => p.theme.componentBackground};
  border-right: 1px solid ${p => p.theme.borderColorSplit};
`;
