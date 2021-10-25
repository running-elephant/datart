import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ListNav, ListPane, ListTitle } from 'app/components';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import { useAccess } from 'app/pages/MainPage/Access';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { CommonFormTypes } from 'globalConstants';
import React, { memo, useCallback, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
import { SaveFormContext } from '../../SaveFormContext';
import {
  selectArchivedStoryboardLoading,
  selectArchivedStoryboards,
  selectStoryboards,
} from '../../slice/selectors';
import { addStoryboard, getArchivedStoryboards } from '../../slice/thunks';
import { allowCreateStoryboard } from '../../utils';
import { Recycle } from '../Recycle';
import { List } from './List';

interface FoldersProps {
  selectedId?: string;
  className?: string;
}

export const Storyboards = memo(({ selectedId, className }: FoldersProps) => {
  const dispatch = useDispatch();
  const orgId = useSelector(selectOrgId);
  const { showSaveForm } = useContext(SaveFormContext);
  const list = useSelector(selectStoryboards);
  const allowCreate = useAccess(allowCreateStoryboard());

  const { filteredData: filteredListData, debouncedSearch: listSearch } =
    useDebouncedSearch(list, (keywords, d) =>
      d.name.toLowerCase().includes(keywords.toLowerCase()),
    );
  const archived = useSelector(selectArchivedStoryboards);
  const archivedListLoading = useSelector(selectArchivedStoryboardLoading);
  const { filteredData: filteredRecycleData, debouncedSearch: recycleSearch } =
    useDebouncedSearch(archived, (keywords, d) =>
      d.name.toLowerCase().includes(keywords.toLowerCase()),
    );

  const recycleInit = useCallback(() => {
    dispatch(getArchivedStoryboards(orgId));
  }, [dispatch, orgId]);

  const add = useCallback(() => {
    showSaveForm({
      vizType: 'STORYBOARD',
      type: CommonFormTypes.Add,
      visible: true,
      onSave: (values, onClose) => {
        dispatch(
          addStoryboard({
            storyboard: { name: values.name, orgId },
            resolve: onClose,
          }),
        );
      },
    });
  }, [showSaveForm, dispatch, orgId]);

  const titles = useMemo(
    () => [
      {
        subTitle: '故事板列表',
        search: true,
        ...allowCreate({
          add: {
            items: [{ key: 'STORYBOARD', text: '新建故事板' }],
            icon: <PlusOutlined />,
            callback: add,
          },
        }),
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
        onSearch: listSearch,
      },
      {
        key: 'recycle',
        subTitle: '回收站',
        back: true,
        search: true,
        onSearch: recycleSearch,
      },
    ],
    [add, allowCreate, listSearch, recycleSearch],
  );

  return (
    <Wrapper className={className} defaultActiveKey="list">
      <ListPane key="list">
        <ListTitle {...titles[0]} />
        <List list={filteredListData} selectedId={selectedId} />
      </ListPane>
      <ListPane key="recycle">
        <ListTitle {...titles[1]} />
        <Recycle
          type="storyboard"
          orgId={orgId}
          list={filteredRecycleData}
          listLoading={archivedListLoading}
          selectedId={selectedId}
          onInit={recycleInit}
        />
      </ListPane>
    </Wrapper>
  );
});

const Wrapper = styled(ListNav)`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: ${SPACE_XS} 0;
  background-color: ${p => p.theme.componentBackground};
`;
