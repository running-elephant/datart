import { EmptyFiller, Split } from 'app/components';
import { useSplitSizes } from 'app/hooks/useSplitSizes';
import { useCallback } from 'react';
import { Route, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { useMemberSlice } from '../MemberPage/slice';
import { useScheduleSlice } from '../SchedulePage/slice';
import { useSourceSlice } from '../SourcePage/slice';
import { useViewSlice } from '../ViewPage/slice';
import { useVizSlice } from '../VizPage/slice';
import { ResourceTypes, SubjectTypes, Viewpoints } from './constants';
import { Main } from './Main';
import { Sidebar } from './Sidebar';
import { usePermissionSlice } from './slice';

export function PermissionPage() {
  useMemberSlice();
  useScheduleSlice();
  useSourceSlice();
  useViewSlice();
  useVizSlice();
  usePermissionSlice();
  const {
    params: { viewpoint },
  } = useRouteMatch<{ viewpoint: Viewpoints }>();
  const matchDetail = useRouteMatch<{
    type: ResourceTypes | SubjectTypes;
    id: string;
  }>('/organizations/:orgId/permissions/:viewpoint/:type/:id');
  const { sizes, setSizes } = useSplitSizes({
    limitedSide: 0,
    range: [256, 768],
  });

  const siderDrag = useCallback(
    sizes => {
      setSizes(sizes);
    },
    [setSizes],
  );

  return (
    <Container
      sizes={sizes}
      minSize={[320, 0]}
      maxSize={[768, Infinity]}
      gutterSize={0}
      onDrag={siderDrag}
      className="datart-split"
    >
      <Sidebar
        viewpoint={viewpoint}
        viewpointType={matchDetail?.params.type}
        viewpointId={matchDetail?.params.id}
      />
      {matchDetail ? (
        <Route
          path={`/organizations/:orgId/permissions/:viewpoint/:type/:id`}
          component={Main}
        />
      ) : (
        <EmptyFiller
          title={`请在左侧列表选择${
            viewpoint === Viewpoints.Resource ? '资源项' : '角色或用户'
          }`}
        />
      )}
    </Container>
  );
}

const Container = styled(Split)`
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
`;
