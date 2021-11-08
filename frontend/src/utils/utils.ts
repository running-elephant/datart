import { message, TreeDataNode, TreeNodeProps } from 'antd';
import { AxiosError, AxiosResponse } from 'axios';
import classnames from 'classnames';
import { ReactElement } from 'react';
import {
  FONT_FAMILY,
  FONT_SIZE_BODY,
  FONT_WEIGHT_REGULAR,
} from 'styles/StyleConstants';
import { APIResponse } from 'types';
import { removeToken } from './auth';

export function errorHandle(error) {
  if (error?.response) {
    // AxiosError
    const { response } = error as AxiosError;
    switch (response?.status) {
      case 401:
        message.error({ key: '401', content: '未登录或会话过期，请重新登录' });
        removeToken();
        break;
      default:
        message.error(response?.data.message || error.message);
        break;
    }
  } else if (error?.message) {
    // Error
    message.error(error.message);
  } else {
    message.error(error);
  }
  return error;
}

export function rejectHandle(error, rejectWithValue) {
  if ((error as AxiosError).response) {
    return rejectWithValue(
      ((error as AxiosError).response as AxiosResponse<APIResponse<any>>).data
        .message,
    );
  } else {
    return rejectWithValue(error.message);
  }
}

export const mergeClassNames = (origin, added) =>
  classnames({ [origin]: !!origin, [added]: true });

export function stopPPG(e) {
  e.stopPropagation();
}

export function listToTree<
  T extends {
    id: string;
    name: string;
    parentId: string | null;
    isFolder: boolean;
    index: number | null;
  },
>(
  list: undefined | T[],
  parentId: null | string = null,
  parentPath: string[] = [],
  options?: {
    getIcon?: (o: T) => ReactElement | ((props: TreeNodeProps) => ReactElement);
    getDisabled?: (o: T, path: string[]) => boolean;
    getSelectable?: (o: T) => boolean;
  },
): undefined | any[] {
  if (!list) {
    return list;
  }

  const treeNodes: any[] = [];
  const childrenList: T[] = [];

  list.forEach(o => {
    if (o.parentId === parentId) {
      const path = parentPath.concat(o.id);
      treeNodes.push({
        ...o,
        key: o.id,
        title: o.name,
        value: o.id,
        path,
        ...(options?.getIcon && { icon: options.getIcon(o) }),
        ...(options?.getDisabled && { disabled: options.getDisabled(o, path) }),
        ...(options?.getSelectable && { selectable: options.getSelectable(o) }),
      });
    } else {
      childrenList.push(o);
    }
  });

  treeNodes.sort((a, b) => Number(a.index) - Number(b.index));

  return treeNodes.map(node => {
    const children = listToTree(childrenList, node.key, node.path, options);
    return children?.length ? { ...node, children } : { ...node, isLeaf: true };
  });
}

export function findTreeNode<
  T extends {
    key: string | number;
    children?: T[];
  },
>(path: string[], nodes: T[] | undefined): T | undefined {
  if (path.length > 0) {
    const currentNode = nodes?.find(({ key }) => key === path[0]);
    return path.length > 1
      ? findTreeNode(path.slice(1), currentNode?.children)
      : currentNode;
  }
}

export function getPath<T extends { id: string; parentId: string | null }>(
  list: T[],
  item: T,
  rootId: string,
  path: string[] = [],
) {
  if (!item?.parentId) {
    return [rootId].concat(item.id).concat(path);
  } else {
    const parent = list.find(({ id }) => id === item.parentId)!;
    return getPath(list, parent, rootId, [item.id].concat(path));
  }
}

export function filterListOrTree<T extends { children?: T[] }>(
  dataSource: T[],
  keywords: string,
  filterFunc: (keywords: string, data: T) => boolean,
) {
  return keywords
    ? dataSource.reduce<T[]>((filtered, d) => {
        const isMatch = filterFunc(keywords, d);
        const isChildrenMatch =
          d.children && filterListOrTree(d.children, keywords, filterFunc);
        if (isMatch || (isChildrenMatch && isChildrenMatch.length > 0)) {
          filtered.push({ ...d, children: isChildrenMatch });
        }
        return filtered;
      }, [])
    : dataSource;
}

export function getExpandedKeys<T extends TreeDataNode>(nodes: T[]) {
  return nodes.reduce<string[]>(
    (keys, { key, children }) =>
      keys
        .concat(key as string)
        .concat(children ? getExpandedKeys(children) : []),
    [],
  );
}

let utilCanvas: null | HTMLCanvasElement = null;

export const getTextWidth = (
  text: string,
  fontWeight: string = `${FONT_WEIGHT_REGULAR}`,
  fontSize: string = FONT_SIZE_BODY,
  fontFamily: string = FONT_FAMILY,
): number => {
  const canvas = utilCanvas || (utilCanvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  if (context) {
    context.font = `${fontWeight} ${fontSize} ${fontFamily}`;
    const metrics = context.measureText(text);
    return Math.ceil(metrics.width);
  }
  return 0;
};

export function getDiffParams<T extends { id?: string }>(
  origin: T[],
  changed: T[],
  matchFunc: (originElement: T, changedElement: T) => boolean,
  compareFunc: (originElement: T, changedElement: T) => boolean,
  continueFunc?: (originElement: T) => boolean,
) {
  let reserved: T[] = [];
  let created: T[] = [];
  let updated: T[] = [];
  let deleted: T[] = [];

  for (let i = 0; i < origin.length; i += 1) {
    /**
     * 由于 fastDeleteArrayElement 会改变数组元素位置，因此代码中使用 origin[i]、
     * changed[j] 即时获取对应下标元素，而非使用变量暂存
     */
    if (continueFunc && continueFunc(origin[i])) {
      reserved.push(origin[i]);
      fastDeleteArrayElement(origin, i);
      i -= 1;
      continue;
    }

    for (let j = 0; j < changed.length; j += 1) {
      if (matchFunc(origin[i], changed[j])) {
        const updatedElement = { ...changed[j], id: origin[i].id };
        if (compareFunc(origin[i], changed[j])) {
          updated.push(updatedElement);
        }
        reserved.push(updatedElement);
        fastDeleteArrayElement(origin, i);
        fastDeleteArrayElement(changed, j);
        i -= 1;
        break;
      }
    }
  }

  created = [...changed];
  deleted = [...origin];

  return {
    created,
    deleted,
    updated,
    reserved,
  };
}

export function fastDeleteArrayElement(arr: any[], index: number) {
  arr[index] = arr[arr.length - 1];
  arr.pop();
}

export const ResizeEvent = new Event('resize', {
  bubbles: false,
  cancelable: true,
});

export const dispatchResize = () => {
  window.dispatchEvent(ResizeEvent);
};
