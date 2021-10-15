import { EmptyFiller } from 'app/components';
import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { selectOrgId } from '../../../slice/selectors';
import { useMemberSlice } from '../../MemberPage/slice';
import { useSourceSlice } from '../../SourcePage/slice';
import { getSources } from '../../SourcePage/slice/thunks';
import { useVariableSlice } from '../../VariablePage/slice';
import { selectEditingViews } from '../slice/selectors';
import { getViewDetail } from '../slice/thunks';
import { Tabs } from './Tabs';
import { Workbench } from './Workbench';

export const Main = memo(() => {
  useSourceSlice();
  useMemberSlice();
  useVariableSlice();
  const dispatch = useDispatch();
  const {
    params: { viewId },
  } = useRouteMatch<{ viewId: string }>();
  const orgId = useSelector(selectOrgId);
  const editingViews = useSelector(selectEditingViews);

  useEffect(() => {
    dispatch(getSources(orgId));
  }, [dispatch, orgId]);

  useEffect(() => {
    if (viewId) {
      dispatch(getViewDetail(viewId));
    }
  }, [dispatch, viewId, orgId]);

  return (
    <Container>
      {editingViews.length > 0 ? (
        <>
          <Tabs />
          <Workbench />
        </>
      ) : (
        <EmptyFiller title="请在左侧列表选择数据视图" />
      )}
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
