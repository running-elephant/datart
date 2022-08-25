/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components/macro';
import { SaveFormContext, useSaveFormContext } from './SaveFormContext';
import { Sidebar } from './Sidebar';
import { useSourceSlice } from './slice';
import { SourceDetailPage } from './SourceDetailPage';

export function SourcePage() {
  useSourceSlice();
  const saveFormContextValue = useSaveFormContext();
  return (
    <SaveFormContext.Provider value={saveFormContextValue}>
      <Container>
        <Sidebar />
        <Route
          path="/organizations/:orgId/sources/:sourceId"
          component={SourceDetailPage}
        />
      </Container>
    </SaveFormContext.Provider>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
`;
