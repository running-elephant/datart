import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { ListSwitch } from 'app/components';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
import { MemberList } from './MemberList';
import { RoleList } from './RoleList';

export const Sidebar = memo(() => {
  const [selectedKey, setSelectedKey] = useState('');
  const history = useHistory();
  const orgId = useSelector(selectOrgId);
  const { url } = useRouteMatch();

  useEffect(() => {
    const urlArr = url.split('/');
    setSelectedKey(urlArr[urlArr.length - 1]);
  }, [url]);

  const titles = useMemo(
    () => [
      { key: 'members', icon: <UserOutlined />, text: '成员' },
      {
        key: 'roles',
        icon: <TeamOutlined />,
        text: '角色',
      },
    ],
    [],
  );

  const switchSelect = useCallback(
    key => {
      history.push(`/organizations/${orgId}/${key}`);
    },
    [history, orgId],
  );

  return (
    <Wrapper>
      <ListSwitch
        titles={titles}
        selectedKey={selectedKey}
        onSelect={switchSelect}
      />
      {selectedKey === 'members' && <MemberList />}
      {selectedKey === 'roles' && <RoleList />}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 320px;
  padding: ${SPACE_XS} 0;
  background-color: ${p => p.theme.componentBackground};
  border-right: 1px solid ${p => p.theme.borderColorSplit};
`;
