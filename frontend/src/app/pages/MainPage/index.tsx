import { useAppSlice } from 'app/slice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router';
import styled from 'styled-components/macro';
import { NotFoundPage } from '../NotFoundPage';
import { AccessRoute } from './AccessRoute';
import { Background } from './Background';
import { Navbar } from './Navbar';
import { ConfirmInvitePage } from './pages/ConfirmInvitePage';
import { MemberPage } from './pages/MemberPage';
import { OrgSettingPage } from './pages/OrgSettingPage';
import { PermissionPage } from './pages/PermissionPage';
import { ResourceTypes } from './pages/PermissionPage/constants';
import { SchedulePage } from './pages/SchedulePage';
import { SourcePage } from './pages/SourcePage';
import { VariablePage } from './pages/VariablePage';
import { ViewPage } from './pages/ViewPage';
import { useViewSlice } from './pages/ViewPage/slice';
import { VizPage } from './pages/VizPage';
import { useVizSlice } from './pages/VizPage/slice';
import { useMainSlice } from './slice';
import { selectOrgId } from './slice/selectors';
import {
  getDataProviders,
  getLoggedInUserPermissions,
  getUserSettings,
} from './slice/thunks';
import { MainPageRouteParams } from './types';

export function MainPage() {
  useAppSlice();
  const { actions } = useMainSlice();
  const { actions: vizActions } = useVizSlice();
  const { actions: viewActions } = useViewSlice();
  const dispatch = useDispatch();
  const history = useHistory();
  const organizationMatch = useRouteMatch<MainPageRouteParams>(
    '/organizations/:orgId',
  );
  const { isExact } = useRouteMatch();
  const orgId = useSelector(selectOrgId);

  // loaded first time
  useEffect(() => {
    dispatch(getUserSettings(organizationMatch?.params.orgId));
    dispatch(getDataProviders());
    return () => {
      dispatch(actions.clear());
    };
  }, []);

  useEffect(() => {
    if (orgId) {
      dispatch(vizActions.clear());
      dispatch(viewActions.clear());
      dispatch(getLoggedInUserPermissions(orgId));
    }
  }, [dispatch, vizActions, viewActions, orgId]);

  useEffect(() => {
    if (isExact && orgId) {
      history.push(`/organizations/${orgId}`);
    }
  }, [isExact, orgId, history]);

  return (
    <AppContainer>
      <Background />
      <Navbar />
      {orgId && (
        <Switch>
          <Route path="/confirminvite" component={ConfirmInvitePage} />
          <Route path="/organizations/:orgId" exact>
            <Redirect
              to={`/organizations/${organizationMatch?.params.orgId}/vizs`}
            />
          </Route>
          <Route
            path="/organizations/:orgId/vizs/:vizId?"
            render={() => (
              <AccessRoute module={ResourceTypes.Viz}>
                <VizPage />
              </AccessRoute>
            )}
          />
          <Route
            path="/organizations/:orgId/views/:viewId?"
            render={() => (
              <AccessRoute module={ResourceTypes.View}>
                <ViewPage />
              </AccessRoute>
            )}
          />
          <Route
            path="/organizations/:orgId/sources"
            render={() => (
              <AccessRoute module={ResourceTypes.Source}>
                <SourcePage />
              </AccessRoute>
            )}
          />
          <Route
            path="/organizations/:orgId/schedules"
            render={() => (
              <AccessRoute module={ResourceTypes.Schedule}>
                <SchedulePage />
              </AccessRoute>
            )}
          />
          <Route
            path="/organizations/:orgId/members"
            render={() => (
              <AccessRoute module={ResourceTypes.User}>
                <MemberPage />
              </AccessRoute>
            )}
          />
          <Route
            path="/organizations/:orgId/roles"
            render={() => (
              <AccessRoute module={ResourceTypes.User}>
                <MemberPage />
              </AccessRoute>
            )}
          />
          <Route path="/organizations/:orgId/permissions" exact>
            <Redirect
              to={`/organizations/${organizationMatch?.params.orgId}/permissions/subject`}
            />
          </Route>
          <Route
            path="/organizations/:orgId/permissions/:viewpoint"
            render={() => (
              <AccessRoute module={ResourceTypes.Manager}>
                <PermissionPage />
              </AccessRoute>
            )}
          />
          <Route
            path="/organizations/:orgId/variables"
            render={() => (
              <AccessRoute module={ResourceTypes.Manager}>
                <VariablePage />
              </AccessRoute>
            )}
          />
          <Route
            path="/organizations/:orgId/orgSettings"
            render={() => (
              <AccessRoute module={ResourceTypes.Manager}>
                <OrgSettingPage />
              </AccessRoute>
            )}
          />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      )}
    </AppContainer>
  );
}

const AppContainer = styled.main`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  background-color: ${p => p.theme.bodyBackground};
`;
