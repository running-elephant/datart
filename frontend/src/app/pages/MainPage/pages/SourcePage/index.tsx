import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components/macro';
import { Sidebar } from './Sidebar';
import { useSourceSlice } from './slice';
import { SourceDetailPage } from './SourceDetailPage';

export function SourcePage() {
  useSourceSlice();
  return (
    <Container>
      <Sidebar />
      <Route
        path="/organizations/:orgId/sources/:sourceId"
        component={SourceDetailPage}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
`;
