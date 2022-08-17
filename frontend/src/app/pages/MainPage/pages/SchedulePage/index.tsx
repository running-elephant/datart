import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useVizSlice } from '../VizPage/slice';
import { EditorPage } from './EditorPage';
import { SaveForm } from './SaveForm';
import { SaveFormContext, useSaveFormContext } from './SaveFormContext';
import { Sidebar } from './Sidebar';
import { useScheduleSlice } from './slice';

export function SchedulePage() {
  const tg = useI18NPrefix('global');
  const saveFormContextValue = useSaveFormContext();
  useScheduleSlice();
  useVizSlice();
  return (
    <SaveFormContext.Provider value={saveFormContextValue}>
      <Container>
        <Sidebar />
        <Route
          path="/organizations/:orgId/schedules/:scheduleId"
          component={EditorPage}
        />
        <SaveForm
          formProps={{
            labelAlign: 'left',
            labelCol: { offset: 1, span: 8 },
            wrapperCol: { span: 13 },
          }}
          okText={tg('button.save')}
        />
      </Container>
    </SaveFormContext.Provider>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
`;
