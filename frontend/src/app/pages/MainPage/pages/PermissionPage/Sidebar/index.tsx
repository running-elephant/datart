import { FileProtectOutlined, TeamOutlined } from '@ant-design/icons';
import { ListSwitch } from 'app/components';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
import {
  ResourceTypes,
  SubjectTypes,
  Viewpoints,
  VIEWPOINT_LABEL,
} from '../constants';
import { getDataSource } from '../slice/thunks';
import { ResourcePanels } from './ResourcePanels';
import { SubjectPanels } from './SubjectPanels';

interface SidebarProps {
  viewpoint: Viewpoints;
  viewpointType?: ResourceTypes | SubjectTypes;
  viewpointId?: string;
}

export const Sidebar = memo(
  ({ viewpoint, viewpointType, viewpointId }: SidebarProps) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const orgId = useSelector(selectOrgId);

    useEffect(() => {
      if (viewpointType) {
        dispatch(getDataSource({ viewpoint, dataSourceType: viewpointType }));
      }
    }, [dispatch, viewpoint, viewpointType, orgId]);

    const changeViewpoint = useCallback(
      key => {
        history.push(`/organizations/${orgId}/permissions/${key}`);
      },
      [history, orgId],
    );

    const togglePanel = useCallback(
      (active, key) => {
        if (active) {
          dispatch(getDataSource({ viewpoint, dataSourceType: key }));
        }
      },
      [dispatch, viewpoint],
    );

    const toDetail = useCallback(
      (id, type) => () => {
        history.push(
          `/organizations/${orgId}/permissions/${viewpoint}/${type}/${id}`,
        );
      },
      [history, orgId, viewpoint],
    );

    const titles = useMemo(
      () => [
        {
          key: Viewpoints.Subject,
          icon: <TeamOutlined />,
          text: VIEWPOINT_LABEL[Viewpoints.Subject],
        },
        {
          key: Viewpoints.Resource,
          icon: <FileProtectOutlined />,
          text: VIEWPOINT_LABEL[Viewpoints.Resource],
        },
      ],
      [],
    );

    return (
      <Wrapper>
        <ListSwitch
          titles={titles}
          selectedKey={viewpoint}
          onSelect={changeViewpoint}
        />
        {viewpoint === Viewpoints.Subject ? (
          <SubjectPanels
            viewpointId={viewpointId}
            viewpointType={viewpointType}
            onToggle={togglePanel}
            onToDetail={toDetail}
          />
        ) : (
          <ResourcePanels
            viewpointId={viewpointId}
            viewpointType={viewpointType}
            onToggle={togglePanel}
            onToDetail={toDetail}
          />
        )}
      </Wrapper>
    );
  },
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: ${SPACE_XS} 0;
  background-color: ${p => p.theme.componentBackground};
  border-right: 1px solid ${p => p.theme.borderColorSplit};
`;
