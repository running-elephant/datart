import {
  PermissionLevels,
  ResourceTypes,
  Viewpoints,
  VizResourceSubTypes,
} from './constants';
import { DataSourceViewModel } from './slice/types';

export function getDefaultPermissionArray() {
  return [
    PermissionLevels.Disable,
    PermissionLevels.Disable,
    PermissionLevels.Disable,
    PermissionLevels.Disable,
  ];
}

export function generateRootNode(
  type: ResourceTypes,
  vizId?: VizResourceSubTypes,
): DataSourceViewModel {
  return {
    id: type === ResourceTypes.Viz ? (vizId as string) : (type as string),
    name: '所有资源',
    type,
    parentId: null,
    index: null,
    isFolder: true,
    permissionArray: getDefaultPermissionArray(),
  };
}

export function getInverseViewpoints(viewpoint: Viewpoints) {
  return viewpoint === Viewpoints.Resource
    ? Viewpoints.Subject
    : Viewpoints.Resource;
}
