import { EmptyFiller } from 'app/components/EmptyFiller';
import { getUserInfoByToken } from 'app/slice/thunks';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { activeAccount } from './service';

export const ActivePage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const onActiveUser = useCallback(
    token => {
      activeAccount(token).then(loginToken => {
        if (loginToken) {
          dispatch(
            getUserInfoByToken({
              token: loginToken,
              resolve: () => {
                history.replace('/');
              },
            }),
          );
        }
      });
    },
    [dispatch, history],
  );
  useEffect(() => {
    const search = window.location.search,
      searchParams = new URLSearchParams(search),
      token = searchParams.get('token');
    if (token) {
      onActiveUser(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Wrapper>
      <EmptyFiller loading title="激活中" />
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
