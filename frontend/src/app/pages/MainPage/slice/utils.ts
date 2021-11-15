import { request } from 'utils/request';
import { UserSettingTypes } from '../constants';
import { UserSetting } from './types';

export function findLvoSetting(
  userSettings: UserSetting[],
): undefined | UserSetting {
  return userSettings.find(
    ({ relType }) => relType === UserSettingTypes.LastVisitedOrganization,
  );
}

export const updateLvoUserSettings = async (
  userSettings: undefined | UserSetting[],
  orgId?: string,
): Promise<UserSetting[]> => {
  if (userSettings) {
    const lvoSetting = findLvoSetting(userSettings);

    if (lvoSetting) {
      if (!orgId) {
        await request<boolean>({
          url: `/settings/user/${lvoSetting.id}`,
          method: 'DELETE',
        });
        return userSettings.filter(({ id }) => id !== lvoSetting.id);
      } else {
        const updated = { ...lvoSetting, relId: orgId };
        await request<UserSetting>({
          url: `/settings/user/${lvoSetting.id}`,
          method: 'PUT',
          data: updated,
        });
        return userSettings.map(s => (s.id === updated.id ? updated : s));
      }
    } else {
      const { data } = await request<UserSetting>({
        url: '/settings/user',
        method: 'POST',
        data: {
          relId: orgId,
          relType: UserSettingTypes.LastVisitedOrganization,
          config: null,
        },
      });
      return userSettings.concat(data);
    }
  }
  return [];
};

export const isParentIdEqual = function (
  prevParentId: string | null,
  nextParentId: string | null | undefined,
) {
  return prevParentId != nextParentId;
  //prevParentId有可能是null nextParentId有可能是undefined 所以这里用双等号。 Prevparentid may be null and nextparentid may be undefined, so the double equal sign is used here.
};
