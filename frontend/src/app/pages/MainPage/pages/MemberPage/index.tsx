import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { MemberDetailPage } from './pages/MemberDetailPage';
import { RoleDetailPage } from './pages/RoleDetailPage';
import { Sidebar } from './Sidebar';
import { useMemberSlice } from './slice';
import { MemberPageRouteParams } from './types';

export function MemberPage() {
  const { params } = useRouteMatch<MemberPageRouteParams>();
  useMemberSlice();

  return (
    <Container>
      <Sidebar />
      <Switch>
        <Route
          path="/organizations/:orgId/members/:memberId"
          component={MemberDetailPage}
        />
        <Route
          path="/organizations/:orgId/roles/:roleId"
          component={RoleDetailPage}
        />
      </Switch>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
`;
