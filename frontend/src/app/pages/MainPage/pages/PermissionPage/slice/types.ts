import { TreeDataNode } from 'antd';
import {
  PermissionLevels,
  ResourceTypes,
  SubjectTypes,
  Viewpoints,
} from '../constants';

export interface PermissionState {
  folders: DataSourceViewModel[] | undefined;
  storyboards: DataSourceViewModel[] | undefined;
  views: DataSourceViewModel[] | undefined;
  sources: DataSourceViewModel[] | undefined;
  schedules: DataSourceViewModel[] | undefined;
  roles: DataSourceViewModel[] | undefined;
  members: DataSourceViewModel[] | undefined;
  folderListLoading: boolean;
  storyboardListLoading: boolean;
  viewListLoading: boolean;
  sourceListLoading: boolean;
  scheduleListLoading: boolean;
  roleListLoading: boolean;
  memberListLoading: boolean;
  permissions: ViewpointPermissionMap;
}

export interface ViewpointPermissionMap {
  [viewpoint: string]: {
    loading: boolean;
    permissionObject: ResourcePermissions | SubjectPermissions | undefined;
  };
}

export interface DataSourceViewModel {
  id: string;
  name: string;
  type: SubjectTypes | ResourceTypes;
  parentId: string | null;
  index: number | null;
  isFolder: boolean;
  permissionArray: PermissionLevels[];
}

export type DataSourceTreeNode = DataSourceViewModel &
  TreeDataNode & {
    path: string[];
    children?: DataSourceTreeNode[];
  };

export interface Privilege {
  id?: string;
  orgId: string;
  permission: PermissionLevels;
  resourceId: string;
  resourceType: ResourceTypes;
  subjectId: string;
  subjectType: SubjectTypes;
}

export interface ResourcePermissions {
  orgId: string;
  resourceId: string;
  resourceType: ResourceTypes;
  rolePermissions: Privilege[];
  userPermissions: Privilege[];
}

export interface SubjectPermissions {
  orgId: string;
  orgOwner?: boolean;
  subjectId: string;
  subjectType: SubjectTypes;
  permissionInfos: Privilege[];
}

export interface GetPermissionParams<T> {
  orgId: string;
  type: T;
  id: string;
}

export interface GrantPermissionParams {
  params: {
    permissionToCreate: Privilege[];
    permissionToDelete: Privilege[];
    permissionToUpdate: Privilege[];
  };
  options: {
    viewpoint: Viewpoints;
    viewpointType: ResourceTypes | SubjectTypes;
    dataSourceType: ResourceTypes | SubjectTypes;
    reserved: Privilege[];
  };
  resolve: () => void;
}

export interface SelectPrivilegesProps {
  viewpoint: Viewpoints;
  dataSourceType: ResourceTypes | SubjectTypes;
}
