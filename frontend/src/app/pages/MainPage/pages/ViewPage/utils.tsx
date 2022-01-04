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

import { FONT_WEIGHT_MEDIUM, SPACE_UNIT } from 'styles/StyleConstants';
import { getDiffParams, getTextWidth } from 'utils/utils';
import {
  ColumnCategories,
  DEFAULT_PREVIEW_SIZE,
  UNPERSISTED_ID_PREFIX,
  ViewViewModelStages,
} from './constants';
import { Column, Model, QueryResult, ViewViewModel } from './slice/types';

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
    model: {},
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
  lastModel: Model,
): {
  model: Model;
  dataSource: object[];
} {
  const { rows, columns } = data;
  const model = columns.reduce(
    (obj, { name, type, primaryKey }) => ({
      ...obj,
      [name]: {
        type: lastModel[name]?.type || type,
        primaryKey,
        category: lastModel[name]?.category || ColumnCategories.Uncategorized, // FIXME: model 重构时一起改
      },
    }),
    {},
  );
  const dataSource = rows.map(arr =>
    arr.reduce(
      (obj, val, index) => ({ ...obj, [columns[index].name]: val }),
      {},
    ),
  );
  return { model, dataSource };
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
