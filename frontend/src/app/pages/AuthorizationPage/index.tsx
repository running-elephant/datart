import { EmptyFiller } from 'app/components/EmptyFiller';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { getUserInfoByToken } from 'app/slice/thunks';
import { StorageKeys } from 'globalConstants';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router';
import styled from 'styled-components/macro';
import persistence from 'utils/persistence';

export const AuthorizationPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const paramsMatch = useRouteMatch<{ token: string }>();
  const token = paramsMatch.params.token;
  const t = useI18NPrefix('authorization');

  useEffect(() => {
    if (token) {
      dispatch(
        getUserInfoByToken({
          token,
          resolve: () => {
            const redirectUrl = persistence.session.get(
              StorageKeys.AuthRedirectUrl,
            );
            if (redirectUrl) {
              persistence.session.remove(StorageKeys.AuthRedirectUrl);
              window.location.href = redirectUrl;
            } else {
              history.replace('/');
            }
          },
        }),
      );
    }
  }, [token, dispatch, history]);
  return (
    <Wrapper>
      <EmptyFiller loading title={t('processing')} />
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
