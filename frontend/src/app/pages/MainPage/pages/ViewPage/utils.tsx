/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { TreeDataNode } from 'antd';
import { APP_CURRENT_VERSION } from 'app/migration/constants';
import { FONT_WEIGHT_MEDIUM, SPACE_UNIT } from 'styles/StyleConstants';
import { Nullable } from 'types';
import { isEmptyArray } from 'utils/object';
import { getDiffParams, getTextWidth } from 'utils/utils';
import {
  ColumnCategories,
  ColumnTypes,
  DEFAULT_PREVIEW_SIZE,
  UNPERSISTED_ID_PREFIX,
  ViewViewModelStages,
} from './constants';
import {
  Column,
  ColumnRole,
  HierarchyModel,
  Model,
  QueryResult,
  ViewViewModel,
} from './slice/types';

export function generateEditingView(
  attrs?: Partial<ViewViewModel>,
): ViewViewModel {
  return {
    id: '',
    name: '',
    parentId: null,
    index: null,
    script: '',
    config: {},
    model: {
      version: APP_CURRENT_VERSION,
    },
    originVariables: [],
    variables: [],
    originColumnPermissions: [],
    columnPermissions: [],
    size: DEFAULT_PREVIEW_SIZE,
    touched: false,
    stage: ViewViewModelStages.Fresh,
    previewResults: [],
    error: '',
    fragment: '',
    ...attrs,
  };
}

export function generateNewEditingViewName(editingViews: ViewViewModel[]) {
  let name = '';
  if (editingViews) {
    const prefix = 'Untitled';
    const spliter = '-';
    let index = 0;
    const unpersistedNewViews = editingViews.filter(v =>
      v.id.includes(UNPERSISTED_ID_PREFIX),
    );

    if (unpersistedNewViews.length > 0) {
      index = Math.max(
        ...unpersistedNewViews.map(v => {
          const arr = v.name.split(spliter);
          return Number(arr[arr.length - 1]);
        }),
      );
    }
    name = `${prefix}${spliter}${index + 1}`;
  }
  return name;
}

export function isNewView(id: string | undefined): boolean {
  return id ? id.includes(UNPERSISTED_ID_PREFIX) : true;
}

export function transformQueryResultToModelAndDataSource(
  data: QueryResult,
  lastModel: HierarchyModel,
): {
  model: HierarchyModel;
  dataSource: object[];
} {
  const { rows, columns } = data;
  const newColumns = columns.reduce((obj, { name, type, primaryKey }) => {
    const hierarchyColumn = getHierarchyColumn(
      name,
      lastModel?.hierarchy || {},
    );
    return {
      ...obj,
      [name]: {
        type: hierarchyColumn?.type || type,
        primaryKey,
        category: hierarchyColumn?.category || ColumnCategories.Uncategorized, // FIXME: model 重构时一起改
      },
    };
  }, {});
  const dataSource = rows.map(arr =>
    arr.reduce(
      (obj, val, index) => ({ ...obj, [columns[index].name]: val }),
      {},
    ),
  );
  return {
    model: { ...lastModel, columns: newColumns },
    dataSource,
  };
}

export function getHierarchyColumn(
  columnName: string,
  hierarchyModel: Model,
): Nullable<Column> {
  return Object.entries(hierarchyModel)
    .flatMap(([name, value]) => {
      if (!isEmptyArray(value.children)) {
        return value.children;
      }
      return value;
    })
    ?.find(col => col?.name === columnName);
}

export function getColumnWidthMap(
  model: { [key: string]: Omit<Column, 'name'> },
  dataSource: object[],
) {
  const HEADER_PADDING = SPACE_UNIT * (2 + 1);
  const CELL_PADDING = SPACE_UNIT * (2 + 2);
  const ICON_WIDTH = 24;
  const ICON_MARGIN = SPACE_UNIT;

  return Object.keys(model).reduce((map, name) => {
    if (!map[name]) {
      // header width
      map[name] =
        getTextWidth(name, `${FONT_WEIGHT_MEDIUM}`) +
        HEADER_PADDING +
        ICON_WIDTH * 2 +
        ICON_MARGIN;
    }
    if (dataSource.length > 0) {
      map[name] = dataSource.reduce((width, o) => {
        // column width
        return Math.min(
          // MAX_RESULT_TABLE_COLUMN_WIDTH,
          Math.max(
            width,
            map[name],
            o[name] !== null && o[name] !== undefined
              ? getTextWidth(`${o[name]}`) + CELL_PADDING
              : 0,
          ),
        );
      }, 0);
    }
    return map;
  }, {});
}

export function comparePermissionChange<
  T extends { subjectId: string; variableId?: string; viewId?: string },
>(
  origin: T[],
  changed: T[],
  compareFunc: (originElement: T, changedElement: T) => boolean,
) {
  return (
    changed.length === origin.length &&
    changed.every(cp =>
      origin.find(
        op =>
          cp.subjectId === op.subjectId &&
          cp.variableId === op.variableId &&
          cp.viewId === op.viewId &&
          compareFunc(op, cp),
      ),
    )
  );
}

export function getSaveParamsFromViewModel(
  orgId: string,
  editingView: ViewViewModel,
  isUpdate?: boolean,
) {
  const {
    name,
    sourceId,
    parentId,
    script,
    model,
    config,
    originVariables,
    variables,
    originColumnPermissions,
    columnPermissions,
    index,
  } = editingView;

  if (isUpdate) {
    const { created, updated, deleted } = getDiffParams(
      [...originVariables],
      [...variables],
      (oe, ce) => oe.id === ce.id,
      (oe, ce) =>
        Object.entries(ce).some(([key, value]) => {
          if (key === 'relVariableSubjects') {
            return !comparePermissionChange(
              oe[key],
              value,
              (subOe, subCe) =>
                subOe.useDefaultValue === subCe.useDefaultValue &&
                subOe.value === subCe.value,
            );
          } else {
            return value !== oe[key];
          }
        }),
    );
    return {
      orgId,
      name,
      sourceId,
      parentId,
      isFolder: false,
      index,
      script,
      config: JSON.stringify(config),
      model: JSON.stringify(model),
      variablesToCreate: created,
      // 关联关系未改变传空值，服务端将不做处理
      variablesToUpdate: updated.map(uv => {
        const originVariable = originVariables.find(o => o.id === uv.id);
        return originVariable
          ? comparePermissionChange(
              originVariable['relVariableSubjects'],
              uv.relVariableSubjects,
              (oe, ce) =>
                oe.useDefaultValue === ce.useDefaultValue &&
                oe.value === ce.value,
            )
            ? { ...uv, relVariableSubjects: null }
            : uv
          : uv;
      }),
      variableToDelete: deleted.map(({ id }) => id),
      columnPermission: comparePermissionChange(
        originColumnPermissions,
        columnPermissions,
        (oe, ce) =>
          Array.from(oe.columnPermission).sort().join(',') ===
          Array.from(ce.columnPermission).sort().join(','),
      )
        ? null
        : columnPermissions.map(cp => ({
            ...cp,
            columnPermission: JSON.stringify(cp.columnPermission),
          })),
    };
  } else {
    return {
      orgId,
      name,
      sourceId,
      parentId,
      isFolder: false,
      index,
      script,
      config: JSON.stringify(config),
      model: JSON.stringify(model),
      variablesToCreate: variables,
      columnPermission: columnPermissions.map(cp => ({
        ...cp,
        columnPermission: JSON.stringify(cp.columnPermission),
      })),
    };
  }
}

export function transformModelToViewModel(
  data,
  tempViewModel?: object,
): ViewViewModel {
  const {
    config,
    model,
    variables,
    relVariableSubjects,
    relSubjectColumns,
    ...rest
  } = data;

  return {
    ...tempViewModel,
    ...rest,
    config: JSON.parse(config),
    model: JSON.parse(model),
    originVariables: variables.map(v => ({ ...v, relVariableSubjects })),
    variables: variables.map(v => ({ ...v, relVariableSubjects })),
    originColumnPermissions: relSubjectColumns.map(r => ({
      ...r,
      columnPermission: JSON.parse(r.columnPermission),
    })),
    columnPermissions: relSubjectColumns.map(r => ({
      ...r,
      columnPermission: JSON.parse(r.columnPermission),
    })),
  };
}

export const dataModelColumnSorter = (prev: Column, next: Column): number => {
  const columnTypePriority = {
    [ColumnTypes.Date]: 1,
    [ColumnTypes.String]: 1,
    [ColumnTypes.Number]: 2,
  };
  const hierarchyPriority = {
    [ColumnRole.Hierarchy]: 10,
    [ColumnRole.Role]: 100,
  };
  const calcPriority = (column: Column) => {
    return (
      columnTypePriority[column?.type || ColumnTypes.String] *
      hierarchyPriority[column?.role || ColumnRole.Role]
    );
  };
  return (
    calcPriority(prev) - calcPriority(next) ||
    (prev?.name || '').localeCompare(next?.name || '')
  );
};

export const diffMergeHierarchyModel = (model: HierarchyModel) => {
  const hierarchy = model?.hierarchy || {};
  const columns = model?.columns || {};
  const allHierarchyColumnNames = Object.keys(hierarchy).flatMap(name => {
    if (!isEmptyArray(hierarchy[name].children)) {
      return hierarchy[name].children!.map(child => child.name);
    }
    return name;
  });
  const additionalObjs = Object.keys(columns).reduce((acc, name) => {
    if (allHierarchyColumnNames.includes(name)) {
      return acc;
    }
    acc[name] = columns[name];
    return acc;
  }, {});
  const newHierarchy = Object.keys(hierarchy).reduce((acc, name) => {
    if (name in columns) {
      acc[name] = hierarchy[name];
    } else if (!isEmptyArray(hierarchy[name]?.children)) {
      const hierarchyColumn = hierarchy[name];
      hierarchyColumn.children = hierarchyColumn.children?.filter(child =>
        Object.keys(columns).includes(child.name),
      );
      if (hierarchyColumn.children?.length) {
        acc[name] = hierarchyColumn;
      }
    }
    return acc;
  }, additionalObjs);
  model.hierarchy = newHierarchy;
  return model;
};

export function buildAntdTreeNodeModel<T extends TreeDataNode & { value: any }>(
  ancestors: string[] = [],
  nodeName: string,
  children?: T[],
  isLeaf?: boolean,
): T {
  const TREE_HIERARCHY_SEPERATOR = String.fromCharCode(0);
  const fullNames = ancestors.concat(nodeName);
  return {
    key: fullNames.join(TREE_HIERARCHY_SEPERATOR),
    title: nodeName,
    value: fullNames,
    children,
    isLeaf,
  } as any;
}
