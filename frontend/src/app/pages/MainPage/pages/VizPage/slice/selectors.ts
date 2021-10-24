import { createSelector } from '@reduxjs/toolkit';
import { TreeNodeProps } from 'antd';
import { ReactElement } from 'react';
import { RootState } from 'types';
import { listToTree } from 'utils/utils';
import { initialState } from '.';
import { VizResourceSubTypes } from '../../PermissionPage/constants';
import { FolderViewModel } from './types';

const selectDomain = (state: RootState) => state.viz || initialState;

export const selectVizs = createSelector(
  [selectDomain],
  vizState => vizState.vizs,
);

export const makeSelectVizTree = () =>
  createSelector(
    [
      selectVizs,
      (
        _,
        props: {
          getIcon: (
            o: FolderViewModel,
          ) => ReactElement | ((props: TreeNodeProps) => ReactElement);
        },
      ) => props.getIcon,
      (
        _,
        props: {
          getDisabled?: (o: FolderViewModel) => boolean;
        },
      ) => props.getDisabled,
    ],
    (vizs, getIcon, getDisabled) =>
      listToTree(
        vizs.map(v => ({ ...v, isFolder: v.relType === 'FOLDER' })),
        null,
        [VizResourceSubTypes.Folder],
        { getIcon, getDisabled },
      ),
  );

export const makeSelectVizFolderTree = () =>
  createSelector(
    [
      selectVizs,
      (_, props: { id?: string }) => props.id,
      (
        _,
        props: {
          getDisabled: (o: FolderViewModel, path: string[]) => boolean;
        },
      ) => props.getDisabled,
    ],
    (vizs, id, getDisabled) =>
      listToTree(
        vizs &&
          vizs
            .filter(v => v.relType === 'FOLDER' && v.id !== id)
            .map(v => ({ ...v, isFolder: true })),
        null,
        [VizResourceSubTypes.Folder],
        { getDisabled },
      ),
  );

export const selectStoryboards = createSelector(
  [selectDomain],
  vizState => vizState.storyboards,
);

export const selectVizListLoading = createSelector(
  [selectDomain],
  vizState => vizState.vizListLoading,
);

export const selectStoryboardListLoading = createSelector(
  [selectDomain],
  vizState => vizState.storyboardListLoading,
);

export const selectSaveFolderLoading = createSelector(
  [selectDomain],
  vizState => vizState.saveFolderLoading,
);

export const selectSaveStoryboardLoading = createSelector(
  [selectDomain],
  vizState => vizState.saveStoryboardLoading,
);

export const selectPublishLoading = createSelector(
  [selectDomain],
  vizState => vizState.publishLoading,
);

export const selectArchivedDatacharts = createSelector(
  [selectDomain],
  vizState => vizState.archivedDatacharts,
);

export const selectArchivedDashboards = createSelector(
  [selectDomain],
  vizState => vizState.archivedDashboards,
);

export const selectArchivedStoryboards = createSelector(
  [selectDomain],
  vizState => vizState.archivedStoryboards,
);

export const selectArchivedDatachartLoading = createSelector(
  [selectDomain],
  vizState => vizState.archivedDatachartLoading,
);

export const selectArchivedDashboardLoading = createSelector(
  [selectDomain],
  vizState => vizState.archivedDashboardLoading,
);

export const selectArchivedStoryboardLoading = createSelector(
  [selectDomain],
  vizState => vizState.archivedStoryboardLoading,
);

export const selectTabs = createSelector(
  [selectDomain],
  vizState => vizState.tabs,
);

export const selectSelectedTab = createSelector([selectDomain], vizState =>
  vizState.tabs.find(t => t.id === vizState.selectedTab),
);

export const selectEditingStoryId = createSelector(
  [selectDomain],
  vizState => vizState.editingStoryId,
);
export const selectPlayingStoryId = createSelector(
  [selectDomain],
  vizState => vizState.playingStoryId,
);
// editingStoryId
export const selectPreviewCharts = createSelector(
  [selectDomain],
  vizState => vizState.chartPreviews,
);
