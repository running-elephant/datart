import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import styled from 'styled-components/macro';
import { SPACE_MD } from 'styles/StyleConstants';
import { ResourceTypes, SubjectTypes, Viewpoints } from '../constants';
import { ResourcesPermissionSetting } from './ResourcesPermissionSetting';
import { SubjectPermissionSetting } from './SubjectsPermissionSetting';

export const Main = memo(() => {
  const {
    params: { viewpoint, type: viewpointType, id: viewpointId },
  } = useRouteMatch<{
    viewpoint: Viewpoints;
    type: ResourceTypes | SubjectTypes;
    id: string;
  }>();
  const orgId = useSelector(selectOrgId);

  return (
    <Wrapper>
      {viewpoint === Viewpoints.Subject ? (
        <ResourcesPermissionSetting
          viewpoint={viewpoint}
          viewpointId={viewpointId}
          viewpointType={viewpointType}
          orgId={orgId}
        />
      ) : (
        <SubjectPermissionSetting
          viewpoint={viewpoint}
          viewpointId={viewpointId}
          viewpointType={viewpointType}
          orgId={orgId}
        />
      )}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  flex: 1;
  padding: ${SPACE_MD};
  overflow-y: auto;

  .ant-card-head {
    border-bottom: 0;
  }
`;
