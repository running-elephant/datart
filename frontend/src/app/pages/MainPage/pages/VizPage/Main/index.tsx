import { CloseOutlined } from '@ant-design/icons';
import { EmptyFiller, TabPane, Tabs } from 'app/components';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { StoryPlayer } from 'app/pages/StoryBoardPage/Player';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { STICKY_LEVEL } from 'styles/StyleConstants';
import { useVizSlice } from '../slice';
import {
  selectArchivedDashboards,
  selectArchivedDatacharts,
  selectArchivedStoryboards,
  selectPlayingStoryId,
  selectSelectedTab,
  selectStoryboards,
  selectTabs,
  selectVizs,
} from '../slice/selectors';
import { removeTab } from '../slice/thunks';
import { ArchivedViz, Folder, Storyboard } from '../slice/types';
import { VizContainer } from './VizContainer';

export function Main() {
  const { actions } = useVizSlice();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    params: { vizId },
  } = useRouteMatch<{ vizId: string }>();
  const location = useLocation();
  const vizs = useSelector(selectVizs);
  const storyboards = useSelector(selectStoryboards);
  const archivedDatacharts = useSelector(selectArchivedDatacharts);
  const archivedDashboards = useSelector(selectArchivedDashboards);
  const archivedStoryboards = useSelector(selectArchivedStoryboards);
  const tabs = useSelector(selectTabs);
  const selectedTab = useSelector(selectSelectedTab);
  const orgId = useSelector(selectOrgId);
  const playingStoryId = useSelector(selectPlayingStoryId);

  useEffect(() => {
    if (vizId) {
      const viz =
        vizs.find(v => v.relId === vizId) ||
        storyboards.find(({ id }) => id === vizId) ||
        archivedDatacharts.find(({ id }) => id === vizId) ||
        archivedDashboards.find(({ id }) => id === vizId) ||
        archivedStoryboards.find(({ id }) => id === vizId);
      if (viz) {
        if ((viz as ArchivedViz).vizType) {
          const { id, name, vizType } = viz as ArchivedViz;
          dispatch(
            actions.addTab({
              id,
              type: vizType,
              name,
              search: location.search,
              parentId: null,
            }),
          );
        }
        if ((viz as Folder).relType) {
          const { id, name, relId, relType, parentId } = viz as Folder;
          dispatch(
            actions.addTab({
              id: relId,
              type: relType,
              name,
              search: location.search,
              parentId,
              permissionId: id,
            }),
          );
        } else {
          const { id, name } = viz as Storyboard;
          dispatch(
            actions.addTab({
              id,
              type: 'STORYBOARD',
              name,
              search: location.search,
              parentId: null,
            }),
          );
        }
      }
    }
  }, [
    dispatch,
    location,
    actions,
    vizs,
    storyboards,
    archivedDatacharts,
    archivedDashboards,
    archivedStoryboards,
    vizId,
  ]);

  const tabChange = useCallback(
    activeKey => {
      const activeTab = tabs.find(v => v.id === activeKey);
      if (activeTab) {
        history.push(
          `/organizations/${orgId}/vizs/${activeKey}${activeTab.search || ''}`,
        );
      }
    },
    [history, orgId, tabs],
  );

  const tabEdit = useCallback(
    (targetKey, action) => {
      switch (action) {
        case 'remove':
          dispatch(
            removeTab({
              id: targetKey,
              resolve: activeKey => {
                const activeTab = tabs.find(v => v.id === activeKey);
                if (activeTab) {
                  history.push(
                    `/organizations/${orgId}/vizs/${activeKey}${
                      activeTab.search || ''
                    }`,
                  );
                } else {
                  history.push(`/organizations/${orgId}/vizs`);
                }
              },
            }),
          );
          break;
        default:
          break;
      }
    },
    [dispatch, history, orgId, tabs],
  );

  return (
    <Wrapper>
      <TabsWrapper>
        <Tabs
          hideAdd
          mode="dashboard"
          type="editable-card"
          activeKey={selectedTab?.id}
          onChange={tabChange}
          onEdit={tabEdit}
        >
          {tabs.map(({ id, name }) => (
            <TabPane
              key={id}
              tab={name}
              closeIcon={
                <CloseIconWrapper>
                  <CloseOutlined />
                </CloseIconWrapper>
              }
            />
          ))}
        </Tabs>
      </TabsWrapper>
      {tabs.map(tab => (
        <VizContainer
          key={tab.id}
          tab={tab}
          orgId={orgId}
          vizs={vizs}
          selectedId={selectedTab?.id}
        />
      ))}
      {!tabs.length && <EmptyFiller title="请在左侧列表选择可视化" />}

      {playingStoryId && <StoryPlayer storyId={playingStoryId} />}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;

  min-height: 0;
`;

const TabsWrapper = styled.div`
  z-index: ${STICKY_LEVEL};
  flex-shrink: 0;
`;

const CloseIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
`;
