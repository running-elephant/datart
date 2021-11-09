import { createSlice } from '@reduxjs/toolkit';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import { getMembers, getRoles } from '../../MemberPage/slice/thunks';
import { getSchedules } from '../../SchedulePage/slice/thunks';
import { getSources } from '../../SourcePage/slice/thunks';
import { getViews } from '../../ViewPage/slice/thunks';
import { getFolders, getStoryboards } from '../../VizPage/slice/thunks';
import {
  ResourceTypes,
  SubjectTypes,
  Viewpoints,
  VizResourceSubTypes,
} from '../constants';
import { generateRootNode, getDefaultPermissionArray } from '../utils';
import {
  getResourcePermission,
  getSubjectPermission,
  grantPermissions,
} from './thunks';
import {
  PermissionState,
  ResourcePermissions,
  SubjectPermissions,
} from './types';

export const initialState: PermissionState = {
  folders: void 0,
  storyboards: void 0,
  views: void 0,
  sources: void 0,
  schedules: void 0,
  roles: void 0,
  members: void 0,
  folderListLoading: false,
  storyboardListLoading: false,
  viewListLoading: false,
  sourceListLoading: false,
  scheduleListLoading: false,
  roleListLoading: false,
  memberListLoading: false,
  permissions: {
    [Viewpoints.Subject]: {
      loading: false,
      permissionObject: void 0,
    },
    [Viewpoints.Resource]: {
      loading: false,
      permissionObject: void 0,
    },
  },
};

const slice = createSlice({
  name: 'permission',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // getMembers
    builder.addCase(getMembers.pending, state => {
      state.memberListLoading = true;
    });
    builder.addCase(getMembers.fulfilled, (state, action) => {
      state.memberListLoading = false;
      state.members = action.payload.map(({ id, username, name }) => ({
        id,
        name: name ? `${name}(${username})` : username,
        type: SubjectTypes.UserRole,
        parentId: null,
        index: null,
        isFolder: false,
        permissionArray: getDefaultPermissionArray(),
      }));
    });
    builder.addCase(getMembers.rejected, state => {
      state.memberListLoading = false;
    });

    // getRoles
    builder.addCase(getRoles.pending, state => {
      state.roleListLoading = true;
    });
    builder.addCase(getRoles.fulfilled, (state, action) => {
      state.roleListLoading = false;
      state.roles = action.payload.map(({ id, name }) => ({
        id,
        name,
        type: SubjectTypes.Role,
        parentId: null,
        index: null,
        isFolder: false,
        permissionArray: getDefaultPermissionArray(),
      }));
    });
    builder.addCase(getRoles.rejected, state => {
      state.roleListLoading = false;
    });

    // getSchedules
    builder.addCase(getSchedules.pending, state => {
      state.scheduleListLoading = true;
    });
    builder.addCase(getSchedules.fulfilled, (state, action) => {
      state.scheduleListLoading = false;
      state.schedules = action.payload.map(({ id, name }) => ({
        id,
        name,
        type: ResourceTypes.Schedule,
        parentId: null,
        index: null,
        isFolder: false,
        permissionArray: getDefaultPermissionArray(),
      }));
    });
    builder.addCase(getSchedules.rejected, state => {
      state.scheduleListLoading = false;
    });

    // getSources
    builder.addCase(getSources.pending, state => {
      state.sourceListLoading = true;
    });
    builder.addCase(getSources.fulfilled, (state, action) => {
      state.sourceListLoading = false;
      state.sources = action.payload.map(({ id, name }) => ({
        id,
        name,
        type: ResourceTypes.Source,
        parentId: null,
        index: null,
        isFolder: false,
        permissionArray: getDefaultPermissionArray(),
      }));
    });
    builder.addCase(getSources.rejected, state => {
      state.sourceListLoading = false;
    });

    // getViews
    builder.addCase(getViews.pending, state => {
      state.viewListLoading = true;
    });
    builder.addCase(getViews.fulfilled, (state, action) => {
      const root = generateRootNode(ResourceTypes.View);
      state.viewListLoading = false;
      state.views = [root].concat(
        action.payload.map(({ id, name, parentId, index, isFolder }) => ({
          id,
          name,
          type: root.type,
          parentId: parentId === null ? root.id : parentId,
          index,
          isFolder,
          permissionArray: getDefaultPermissionArray(),
        })),
      );
    });
    builder.addCase(getViews.rejected, state => {
      state.viewListLoading = false;
    });

    // getFolders
    builder.addCase(getFolders.pending, state => {
      state.folderListLoading = true;
    });
    builder.addCase(getFolders.fulfilled, (state, action) => {
      const root = generateRootNode(
        ResourceTypes.Viz,
        VizResourceSubTypes.Folder,
      );
      state.folderListLoading = false;
      state.folders = [root].concat(
        action.payload.map(({ id, name, parentId, index, relType }) => ({
          id,
          name,
          type: root.type,
          parentId: parentId === null ? root.id : parentId,
          index,
          isFolder: relType === 'FOLDER',
          permissionArray: getDefaultPermissionArray(),
        })),
      );
    });
    builder.addCase(getFolders.rejected, state => {
      state.folderListLoading = false;
    });

    // getStoryboards
    builder.addCase(getStoryboards.pending, state => {
      state.storyboardListLoading = true;
    });
    builder.addCase(getStoryboards.fulfilled, (state, action) => {
      state.storyboardListLoading = false;
      state.storyboards = action.payload.map(({ id, name }) => ({
        id,
        name,
        type: ResourceTypes.Viz,
        parentId: null,
        index: null,
        isFolder: false,
        permissionArray: getDefaultPermissionArray(),
      }));
    });
    builder.addCase(getStoryboards.rejected, state => {
      state.storyboardListLoading = false;
    });

    // getResourcePermission
    builder.addCase(getResourcePermission.pending, state => {
      state.permissions[Viewpoints.Resource].loading = true;
    });
    builder.addCase(getResourcePermission.fulfilled, (state, action) => {
      state.permissions[Viewpoints.Resource].loading = false;
      state.permissions[Viewpoints.Resource].permissionObject = action.payload;
    });
    builder.addCase(getResourcePermission.rejected, state => {
      state.permissions[Viewpoints.Resource].loading = false;
    });

    // getSubjectPermission
    builder.addCase(getSubjectPermission.pending, state => {
      state.permissions[Viewpoints.Subject].loading = true;
    });
    builder.addCase(getSubjectPermission.fulfilled, (state, action) => {
      state.permissions[Viewpoints.Subject].loading = false;
      state.permissions[Viewpoints.Subject].permissionObject = action.payload;
    });
    builder.addCase(getSubjectPermission.rejected, state => {
      state.permissions[Viewpoints.Subject].loading = false;
    });

    // grantPermissions
    builder.addCase(grantPermissions.pending, state => {});
    builder.addCase(grantPermissions.fulfilled, (state, action) => {
      const { viewpoint, viewpointType, dataSourceType } =
        action.meta.arg.options;
      if (viewpoint === Viewpoints.Resource) {
        const permissionObject = state.permissions[viewpoint]
          .permissionObject as ResourcePermissions;
        if (dataSourceType === SubjectTypes.Role) {
          permissionObject.rolePermissions = permissionObject.rolePermissions
            .filter(({ resourceType }) => resourceType !== viewpointType)
            .concat(action.payload);
        } else {
          permissionObject.userPermissions = permissionObject.userPermissions
            .filter(({ resourceType }) => resourceType !== viewpointType)
            .concat(action.payload);
        }
      } else {
        const permissionObject = state.permissions[viewpoint]
          .permissionObject as SubjectPermissions;
        permissionObject.permissionInfos = permissionObject.permissionInfos
          .filter(({ resourceType }) => resourceType !== dataSourceType)
          .concat(action.payload);
      }
    });
    builder.addCase(grantPermissions.rejected, state => {});
  },
});

export const { actions: permissionActions, reducer } = slice;

export const usePermissionSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
