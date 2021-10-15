import { DeleteOutlined } from '@ant-design/icons';
import { ListNav, ListPane, ListTitle } from 'app/components';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import { useAccess } from 'app/pages/MainPage/Access';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
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
import { selectArchived, selectSources } from '../slice/selectors';
import { allowCreateSource } from '../utils';
import { Recycle } from './Recycle';
import { SourceList } from './SourceList';

export const Sidebar = memo(() => {
  const history = useHistory();
  const orgId = useSelector(selectOrgId);
  const list = useSelector(selectSources);
  const archived = useSelector(selectArchived);
  const matchSourceDetail = useRouteMatch<{ sourceId: string }>(
    '/organizations/:orgId/sources/:sourceId',
  );
  const sourceId = matchSourceDetail?.params.sourceId;
  const allowCreate = useAccess(allowCreateSource());

  const { filteredData: sourceList, debouncedSearch: listSearch } =
    useDebouncedSearch(list, (keywords, d) =>
      d.name.toLowerCase().includes(keywords.toLowerCase()),
    );
  const { filteredData: archivedList, debouncedSearch: archivedSearch } =
    useDebouncedSearch(archived, (keywords, d) =>
      d.name.toLowerCase().includes(keywords.toLowerCase()),
    );

  const toAdd = useCallback(() => {
    history.push(`/organizations/${orgId}/sources/add`);
  }, [history, orgId]);

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
        title: '数据源列表',
        search: true,
        onSearch: listSearch,
        ...allowCreate({
          add: { items: [{ key: 'add', text: '新建数据源' }], callback: toAdd },
        }),
        more: {
          items: [
            {
              key: 'recycle',
              text: '回收站',
              prefix: <DeleteOutlined className="icon" />,
            },
          ],
          callback: moreMenuClick,
        },
      },
      {
        key: 'recycle',
        title: '回收站',
        back: true,
        search: true,
        onSearch: archivedSearch,
      },
    ],
    [toAdd, moreMenuClick, listSearch, archivedSearch, allowCreate],
  );

  return (
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
