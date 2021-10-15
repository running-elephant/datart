import { DeleteOutlined } from '@ant-design/icons';
import { ListNav, ListPane, ListTitle } from 'app/components';
import { useDebouncedSearch } from 'app/hooks/useDebouncedSearch';
import { useAccess } from 'app/pages/MainPage/Access';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
import { useToScheduleDetails } from '../hooks';
import { selectArchived, selectSchedules } from '../slice/selectors';
import { allowCreateSchedule } from '../utils';
import { Recycle } from './Recycle';
import { ScheduleList } from './ScheduleList';

export const Sidebar = memo(() => {
  const matchScheduleDetail = useRouteMatch<{
    scheduleId: string;
  }>('/organizations/:orgId/schedules/:scheduleId');
  const scheduleId = matchScheduleDetail?.params?.scheduleId;
  const orgId = useSelector(selectOrgId);
  const list = useSelector(selectSchedules);
  const archived = useSelector(selectArchived);
  const allowCreate = useAccess(allowCreateSchedule());

  const { filteredData: scheduleList, debouncedSearch: listSearch } =
    useDebouncedSearch(list, (keywords, d) =>
      d.name.toLowerCase().includes(keywords.toLowerCase()),
    );
  const { filteredData: archivedList, debouncedSearch: archivedSearch } =
    useDebouncedSearch(archived, (keywords, d) =>
      d.name.toLowerCase().includes(keywords.toLowerCase()),
    );

  const { toDetails } = useToScheduleDetails();
  const toAdd = useCallback(() => {
    toDetails(orgId, 'add');
  }, [toDetails, orgId]);

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
        title: '定时任务列表',
        search: true,
        onSearch: listSearch,
        ...allowCreate({
          add: {
            items: [{ key: 'add', text: '新建定时任务' }],
            callback: toAdd,
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
        <ScheduleList
          orgId={orgId}
          scheduleId={scheduleId}
          list={scheduleList}
        />
      </ListPane>
      <ListPane key="recycle">
        <ListTitle {...titles[1]} />
        <Recycle scheduleId={scheduleId} list={archivedList} />
      </ListPane>
    </Wrapper>
  );
});

const Wrapper = styled(ListNav)`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 320px;
  padding: ${SPACE_XS} 0;
  background-color: ${p => p.theme.componentBackground};
  box-shadow: ${p => p.theme.shadowSider};
`;
