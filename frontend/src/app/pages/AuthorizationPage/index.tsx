import { EmptyFiller } from 'app/components/EmptyFiller';
import { getUserInfoByToken } from 'app/slice/thunks';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router';
import styled from 'styled-components/macro';

export const AuthorizationPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const paramsMatch = useRouteMatch<{ token: string }>();
  const token = paramsMatch.params.token;
  const toApp = useCallback(() => {
    history.replace('/');
  }, [history]);
  useEffect(() => {
    if (token) {
      dispatch(getUserInfoByToken({ token, resolve: toApp }));
    }
  }, [token, dispatch, toApp]);
  return (
    <Wrapper>
      <EmptyFiller loading title="处理中" />
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
