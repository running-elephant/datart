import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import {
  PermissionLevels,
  ResourceTypes,
  VizResourceSubTypes,
} from '../PermissionPage/constants';

export const urlSearchTransfer = {
  toParams: (url: string) => {
    const params = new URLSearchParams(url);
    const obj: any = {};
    const keysEntries = params.keys();
    for (const key of keysEntries) {
      obj[key] = params.getAll(key);
    }
    return obj;
  },
  toUrlString: (obj: Object): string => {
    const keys = Object.keys(obj);
    const params = new URLSearchParams();
    keys.forEach(k => {
      const value = obj[k];
      if (value instanceof Array) {
        value.forEach(v => {
          params.append(k, v);
        });
      } else {
        params.append(k, value);
      }
    });
    return params.toString();
  },
};

export function allowCreateStoryboard() {
  return {
    module: ResourceTypes.Viz,
    id: VizResourceSubTypes.Storyboard,
    level: PermissionLevels.Create,
  };
}

export function allowManageStoryboard(id?: string) {
  return {
    module: ResourceTypes.Viz,
    id,
    level: PermissionLevels.Manage,
  };
}

export async function getVizDetail(backendChartId: string, type: string) {
  try {
    const { data } = await request<any>({
      method: 'GET',
      url: `viz/${type.toLowerCase()}s/${backendChartId}`,
    });
    return data;
  } catch (error) {
    errorHandle(error);
    return {} as any;
  }
}
