import { UserSettingTypes } from '../constants';
import { PermissionLevels } from '../pages/PermissionPage/constants';
import { TreeDataNode } from 'antd';
export interface MainState {
  userSettings: undefined | UserSetting[];
  organizations: Organization[];
  orgId: string;
  dataProviders: DataProviderViewModel;
  isOwner: boolean;
  permissionMap: UserPermissionMap;
  downloadManagement: DownloadManagement;
  userSettingLoading: boolean;
  organizationListLoading: boolean;
  dataProviderListLoading: boolean;
  dataProviderConfigTemplateLoading: boolean;
  dataProviderDatabaseListLoading: boolean;
  saveOrganizationLoading: boolean;
  deleteOrganizationLoading: boolean;
  initializationError: boolean;
  downloadPolling: boolean;
}

export interface DownloadManagement {
  tasks: Array<DownloadTask>;
  status: DownloadManagementStatus;
}

export interface DownloadTask {
  id: string;
  status: number;
  path: string;
  name: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  avatar: string;
}

export interface UserSetting {
  config: string;
  createBy: string;
  createTime: string;
  id: string;
  relId: string;
  relType: UserSettingTypes;
  updateBy: string;
  updateTime: string;
  userId: string;
}

export interface UserPermissionMap {
  [resourceType: string]: { [resourceId: string]: PermissionLevels };
}

export interface DataProvider {
  name: string;
  type: string;
}

export interface DataProviderConfigTemplate {
  name: string;
  type: string;
  attributes: DataProviderAttribute[];
}

export interface DataProviderAttribute {
  name: string;
  defaultValue: any;
  type:
    | 'string'
    | 'password'
    | 'bool'
    | 'object'
    | 'array'
    | 'files'
    | 'schema';
  key?: string;
  required?: boolean;
  description?: string;
  options?: any[];
  children?: DataProviderAttribute[];
}

export interface DataProviderViewModel {
  [type: string]: {
    name: string;
    config: null | DataProviderConfigTemplate;
  };
}

export interface UserSettingsPayload {
  organizations: Organization[];
  orgId?: string;
  userSettings: UserSetting[];
}

export interface AddOrganizationPayload {
  organization: Organization;
  userSettings: UserSetting[];
}

export interface AddOrganizationParams {
  organization: Pick<Organization, 'name' | 'description'>;
  resolve: () => void;
}

export interface EditOrganizationParams {
  organization: Omit<Organization, 'avatar'>;
  resolve: () => void;
}

export interface DeleteOrganizationPayload {
  delOrgId: string;
  nextOrgId: string;
  userSettings: UserSetting[];
}

export enum DownloadManagementStatus {
  INIT = 'init',
  FINISH = 'finish',
  NEW = 'new',
}

export enum DownloadTaskState {
  CREATE = 0,
  FINISH = 1,
  DOWNLOADED = 2,
  FAILED = -1,
}
export interface LocalTreeDataNode extends TreeDataNode{
  index:number | null;
}
