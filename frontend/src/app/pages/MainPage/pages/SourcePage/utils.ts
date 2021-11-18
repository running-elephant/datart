import { PermissionLevels, ResourceTypes } from '../PermissionPage/constants';

export function allowCreateSource() {
  return {
    module: ResourceTypes.Source,
    id: ResourceTypes.Source,
    level: PermissionLevels.Create,
  };
}

export function allowManageSource(id?: string) {
  return {
    module: ResourceTypes.Source,
    id,
    level: PermissionLevels.Manage,
  };
}
