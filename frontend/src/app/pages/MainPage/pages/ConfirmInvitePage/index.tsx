import { message } from 'antd';
import { EmptyFiller } from 'app/components/EmptyFiller';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { confirmInvite } from './service';

export const ConfirmInvitePage = () => {
  const history = useHistory();
  const onConfirm = useCallback(
    token => {
      confirmInvite(token).then(() => {
        message.success('成功加入组织');
        history.replace('/');
      });
    },
    [history],
  );
  useEffect(() => {
    const search = window.location.search,
      searchParams = new URLSearchParams(search),
      token = searchParams.get('token');
    if (token) {
      onConfirm(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Wrapper>
      <EmptyFiller loading title="确认邀请中" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;
