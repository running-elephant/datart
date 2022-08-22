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
  DeleteOutlined,
  FileOutlined,
  FolderFilled,
  FolderOpenFilled,
  FolderOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import { ListNav, ListPane, ListTitle } from 'app/components';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { CommonFormTypes } from 'globalConstants';
import { memo, useCallback, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_LABEL,
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_MEDIUM,
  LINE_HEIGHT_BODY,
  LINE_HEIGHT_HEADING,
  SPACE_LG,
  SPACE_MD,
  SPACE_TIMES,
  SPACE_XS,
} from 'styles/StyleConstants';
import { getInsertedNodeIndex } from 'utils/utils';
import { SaveForm } from '../SaveForm';
import { SaveFormContext } from '../SaveFormContext';
import {
  makeSelectSourceTree,
  selectArchived,
  selectSources,
} from '../slice/selectors';
import { addSource } from '../slice/thunks';
import { SourceSimpleViewModel } from '../slice/types';
import { Recycle } from './Recycle';
import { SourceList } from './SourceList';

export const Sidebar = memo(() => {
  const dispatch = useDispatch();
  const history = useHistory();
  const orgId = useSelector(selectOrgId);
  const archived = useSelector(selectArchived);
  const sourceData = useSelector(selectSources);
  const matchSourceDetail = useRouteMatch<{ sourceId: string }>(
    '/organizations/:orgId/sources/:sourceId',
  );
  const sourceId = matchSourceDetail?.params.sourceId;
  const t = useI18NPrefix('source');
  const tg = useI18NPrefix('global');
  const selectSourceTree = useMemo(makeSelectSourceTree, []);
  const { showSaveForm } = useContext(SaveFormContext);

  const getIcon = useCallback(
    ({ isFolder, type }: SourceSimpleViewModel) =>
      isFolder
        ? p => (p.expanded ? <FolderOpenFilled /> : <FolderFilled />)
        : undefined,
    [],
  );
  const getDisabled = useCallback(
    ({ deleteLoading }: SourceSimpleViewModel) => deleteLoading,
    [],
  );

  const treeData = useSelector(state =>
    selectSourceTree(state, { getIcon, getDisabled }),
  );

  const recycleList = useMemo(
    () =>
      archived?.map(({ id, name, parentId, isFolder, deleteLoading }) => ({
        id,
        key: id,
        title: name,
        parentId,
        icon: isFolder ? <FolderOutlined /> : <FileOutlined />,
        isFolder,
        disabled: deleteLoading,
      })),
    [archived],
  );

  const { filteredData: sourceList, debouncedSearch: listSearch } =
    useDebouncedSearch(treeData, (keywords, d) =>
      d.title.toLowerCase().includes(keywords.toLowerCase()),
    );
  const { filteredData: archivedList, debouncedSearch: archivedSearch } =
    useDebouncedSearch(recycleList, (keywords, d) =>
      d.title.toLowerCase().includes(keywords.toLowerCase()),
    );
  const toAdd = useCallback(
    ({ key }) => {
      switch (key) {
        case 'add':
          history.push(`/organizations/${orgId}/sources/add`);
          break;
        case 'folder':
          showSaveForm({
            sourceType: 'folder',
            type: CommonFormTypes.Add,
            visible: true,
            simple: false,
            parentIdLabel: t('sidebar.parent'),
            onSave: (values, onClose) => {
              let index = getInsertedNodeIndex(values, sourceData);
              dispatch(
                addSource({
                  source: {
                    ...values,
                    config: JSON.stringify(values.config),
                    parentId: values.parentId || null,
                    index,
                    orgId,
                    isFolder: true,
                  },
                  resolve: () => {
                    onClose();
                    message.success(t('sidebar.addSuccess'));
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
    [dispatch, history, orgId, showSaveForm, sourceData, t],
  );

  const moreMenuClick = useCallback((key, _, onNext) => {
    switch (key) {
      case 'recycle':
        onNext();
        break;
    }
  }, []);

  const titles = useMemo(
    () => [
      {
        key: 'list',
        title: t('sidebar.title'),
        search: true,
        onSearch: listSearch,
        add: {
          items: [
            { key: 'add', text: t('sidebar.add') },
            { key: 'folder', text: t('sidebar.addFolder') },
          ],
          callback: toAdd,
        },
        more: {
          items: [
            {
              key: 'recycle',
              text: t('sidebar.recycle'),
              prefix: <DeleteOutlined className="icon" />,
            },
          ],
          callback: moreMenuClick,
        },
      },
      {
        key: 'recycle',
        title: t('sidebar.recycle'),
        back: true,
        search: true,
        onSearch: archivedSearch,
      },
    ],
    [toAdd, moreMenuClick, listSearch, archivedSearch, t],
  );

  return (
    <>
      <Wrapper defaultActiveKey="list">
        <ListPane key="list">
          <ListTitle {...titles[0]} />
          <SourceList sourceId={sourceId} list={sourceList} />
        </ListPane>
        <ListPane key="recycle">
          <ListTitle {...titles[1]} />
          <Recycle sourceId={sourceId} list={archivedList} />
        </ListPane>
      </Wrapper>
      <SaveForm
        formProps={{
          labelAlign: 'left',
          labelCol: { offset: 1, span: 8 },
          wrapperCol: { span: 13 },
        }}
        okText={tg('button.save')}
      />
    </>
  );
});

const Wrapper = styled(ListNav)`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: ${SPACE_XS} 0;
  background-color: ${p => p.theme.componentBackground};
  box-shadow: ${p => p.theme.shadowSider};
`;

export const List = styled.div`
  flex: 1;
  width: 320px;
  padding: ${SPACE_XS} 0;
  overflow-y: auto;
  background-color: ${p => p.theme.componentBackground};
`;

export const ListItem = styled.div`
  padding: ${SPACE_XS} ${SPACE_MD} ${SPACE_XS} ${SPACE_LG};
  cursor: pointer;
  transition: background-color 0.3s;

  header {
    display: flex;
    align-items: center;
    line-height: ${LINE_HEIGHT_HEADING};

    h4 {
      flex: 1;
      overflow: hidden;
      font-weight: ${FONT_WEIGHT_MEDIUM};
      color: ${p => p.theme.textColorSnd};
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      flex-shrink: 0;
      margin: 0 0 0 ${SPACE_MD};
      font-size: ${FONT_SIZE_LABEL};
      font-weight: ${FONT_WEIGHT_BOLD};
      color: ${p => p.theme.textColorDisabled};
    }
  }

  footer {
    display: flex;

    p {
      flex: 1;
      overflow: hidden;
      line-height: ${LINE_HEIGHT_BODY};
      color: ${p => p.theme.textColorLight};
      text-overflow: ellipsis;
    }
  }

  &:hover,
  &.selected {
    h4 {
      color: ${p => p.theme.primary};
    }
  }

  &.selected {
    background-color: ${p => p.theme.bodyBackground};
  }
  &.recycle {
    padding: ${SPACE_XS} ${SPACE_MD} ${SPACE_XS} ${SPACE_TIMES(10)};
  }
`;
