import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectLoggedInUser } from 'app/slice/selectors';
import { RootState } from 'types';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { mainActions } from '.';
import { SubjectTypes } from '../pages/PermissionPage/constants';
import { SubjectPermissions } from '../pages/PermissionPage/slice/types';
import {
  selectOrganizations,
  selectOrgId,
  selectUserSettings,
} from './selectors';
import {
  AddOrganizationParams,
  AddOrganizationPayload,
  DataProvider,
  DataProviderConfigTemplate,
  DataProviderViewModel,
  DeleteOrganizationPayload,
  DownloadTask,
  DownloadTaskState,
  EditOrganizationParams,
  Organization,
  UserSetting,
  UserSettingsPayload,
} from './types';
import { findLvoSetting, updateLvoUserSettings } from './utils';

export const getUserSettings = createAsyncThunk<
  UserSettingsPayload,
  string | undefined
>('main/getUserSettings', async orgId => {
  try {
    const [{ data: userSettings }, { data: organizations }] = await Promise.all(
      [
        request<UserSetting[]>('settings/user'),
        request<Organization[]>('/orgs'),
      ],
    );

    if (orgId) {
      const index = organizations.findIndex(({ id }) => id === orgId);
      if (index >= 0) {
        return {
          userSettings: await updateLvoUserSettings(userSettings, orgId),
          organizations,
          orgId,
        };
      }
    } else {
      const lvoSetting = findLvoSetting(userSettings);
      if (lvoSetting) {
        return { userSettings, organizations, orgId: lvoSetting.relId };
      } else if (organizations.length > 0) {
        return {
          userSettings: await updateLvoUserSettings(
            userSettings,
            organizations[0].id,
          ),
          organizations,
          orgId: organizations[0].id,
        };
      }
    }

    return { userSettings, organizations };
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const getLoggedInUserPermissions = createAsyncThunk<
  SubjectPermissions,
  string,
  { state: RootState }
>('main/getLoggedInUserPermissions', async (orgId, { getState }) => {
  try {
    const loggedInUser = selectLoggedInUser(getState());
    const { data } = await request<SubjectPermissions>({
      url: '/roles/permission/subject',
      method: 'GET',
      params: {
        orgId,
        subjectType: SubjectTypes.User,
        subjectId: loggedInUser?.id,
      },
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const switchOrganization = createAsyncThunk<
  null,
  string,
  { state: RootState }
>('main/switchOrganization', async (orgId, { getState, dispatch }) => {
  try {
    const userSettings = selectUserSettings(getState());
    dispatch(mainActions.setOrgId(orgId));
    dispatch(
      mainActions.setUserSettings(
        await updateLvoUserSettings(userSettings, orgId),
      ),
    );
    return null;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const getOrganizations = createAsyncThunk<Organization[]>(
  'main/getOrganizations',
  async () => {
    try {
      const { data } = await request<Organization[]>('/orgs');
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getDataProviders = createAsyncThunk<DataProviderViewModel>(
  'main/getDataProviders',
  async () => {
    try {
      const { data } = await request<DataProvider[]>(
        '/data-provider/providers',
      );
      return data.reduce<DataProviderViewModel>(
        (obj, { name, type }) => ({ ...obj, [type]: { name, config: null } }),
        {},
      );
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getDataProviderConfigTemplate = createAsyncThunk<
  DataProviderConfigTemplate,
  string
>('main/getDataProviderConfigTemplate', async type => {
  try {
    const { data } = await request<DataProviderConfigTemplate>(
      `/data-provider/${type}/config/template`,
    );
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const getDataProviderDatabases = createAsyncThunk<string[], string>(
  'main/getDataProviderDatabases',
  async sourceId => {
    try {
      const { data } = await request<string[]>(
        `/data-provider/${sourceId}/databases`,
      );
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const addOrganization = createAsyncThunk<
  AddOrganizationPayload,
  AddOrganizationParams,
  { state: RootState }
>(
  'main/addOrganization',
  async ({ organization, resolve }, { getState, dispatch }) => {
    const userSettings = selectUserSettings(getState());
    try {
      const { data } = await request<Organization>({
        url: '/orgs',
        method: 'POST',
        data: organization,
      });
      dispatch(mainActions.setOrgId(''));
      resolve();
      return {
        organization: data,
        userSettings: await updateLvoUserSettings(userSettings, data.id),
      };
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const editOrganization = createAsyncThunk<
  Omit<Organization, 'avatar'>,
  EditOrganizationParams
>('main/editOrganization', async ({ organization, resolve }) => {
  try {
    await request<boolean>({
      url: `/orgs/${organization.id}`,
      method: 'PUT',
      data: organization,
    });
    resolve();
    return organization;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const deleteOrganization = createAsyncThunk<
  DeleteOrganizationPayload,
  (redirectOrgId?: string) => void,
  { state: RootState }
>('main/deleteOrganization', async (resolve, { getState, dispatch }) => {
  const orgId = selectOrgId(getState());
  const organizations = selectOrganizations(getState());
  const userSettings = selectUserSettings(getState());

  try {
    await request<boolean>({ url: `/orgs/${orgId}`, method: 'DELETE' });
    dispatch(mainActions.setOrgId(''));
    resolve();
    const rest = organizations.filter(({ id }) => id !== orgId);
    const nextOrgId = rest[0]?.id || '';
    return {
      delOrgId: orgId,
      nextOrgId,
      userSettings: await updateLvoUserSettings(userSettings, nextOrgId),
    };
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

interface FetchDownloadTasksPayload {
  resolve?: (isNeedClear: boolean) => void;
}
export const fetchDownloadTasks = createAsyncThunk(
  'main/fetchDownloadTasks',
  async (payload: FetchDownloadTasksPayload | undefined, { dispatch }) => {
    try {
      const { data } = await request<DownloadTask[]>({
        url: `/download/tasks`,
        method: 'GET',
      });
      dispatch(mainActions.setDownloadManagement({ newTasks: data }));
      const isNeedClear = !(data || []).some(
        v => v.status === DownloadTaskState.CREATE,
      );
      payload?.resolve?.(isNeedClear);
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);
