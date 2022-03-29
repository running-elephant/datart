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

import { createAsyncThunk } from '@reduxjs/toolkit';
import sqlReservedWords from 'app/assets/javascripts/sqlReservedWords';
import { migrateViewConfig } from 'app/migration/ViewConfig/migrationViewDetailConfig';
import beginViewModelMigration from 'app/migration/ViewConfig/migrationViewModelConfig';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import i18n from 'i18next';
import { monaco } from 'react-monaco-editor';
import { RootState } from 'types';
import { request, request2 } from 'utils/request';
import { errorHandle, getErrorMessage, rejectHandle } from 'utils/utils';
import { viewActions } from '.';
import { View } from '../../../../../types/View';
import { selectVariables } from '../../VariablePage/slice/selectors';
import { Variable } from '../../VariablePage/slice/types';
import { ViewViewModelStages } from '../constants';
import {
  generateEditingView,
  generateNewEditingViewName,
  getSaveParamsFromViewModel,
  isNewView,
  transformModelToViewModel,
} from '../utils';
import {
  selectCurrentEditingView,
  selectCurrentEditingViewAttr,
  selectCurrentEditingViewKey,
  selectEditingViews,
  selectSourceDatabaseSchemas,
  selectViews,
} from './selectors';
import {
  DeleteViewParams,
  QueryResult,
  SaveFolderParams,
  SaveViewParams,
  UnarchiveViewParams,
  UpdateViewBaseParams,
  VariableHierarchy,
  ViewBase,
  ViewSimple,
  ViewViewModel,
} from './types';

export const getViews = createAsyncThunk<ViewSimple[], string>(
  'view/getViews',
  async orgId => {
    try {
      const { data } = await request<ViewSimple[]>(`/views?orgId=${orgId}`);
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getArchivedViews = createAsyncThunk<ViewSimple[], string>(
  'view/getArchivedViews',
  async orgId => {
    try {
      const { data } = await request<ViewSimple[]>(
        `/views/archived?orgId=${orgId}`,
      );
      return data;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const getViewDetail = createAsyncThunk<
  ViewViewModel,
  string,
  { state: RootState }
>(
  'view/getViewDetail',
  async (viewId, { dispatch, getState, rejectWithValue }) => {
    const views = selectViews(getState());
    const editingViews = selectEditingViews(getState());
    const selected = editingViews.find(v => v.id === viewId);

    if (selected) {
      dispatch(viewActions.switchCurrentEditingView(viewId));
      return selected;
    }

    if (isNewView(viewId)) {
      const newView = generateEditingView({
        id: viewId,
        name: generateNewEditingViewName(editingViews),
      });
      dispatch(viewActions.addEditingView(newView));
      return newView;
    }

    const viewSimple = views?.find(v => v.id === viewId);
    const tempViewModel = generateEditingView({
      id: viewId,
      name: viewSimple?.name || i18n.t('view.loading'),
      stage: ViewViewModelStages.Loading,
    });

    dispatch(viewActions.addEditingView(tempViewModel));

    try {
      const { data } = await request<View>(`/views/${viewId}`);
      data.config = migrateViewConfig(data.config);
      data.model = beginViewModelMigration(data?.model);
      return transformModelToViewModel(data, tempViewModel);
    } catch (error) {
      return rejectHandle(error, rejectWithValue);
    }
  },
);

export const getSchemaBySourceId = createAsyncThunk<any, string>(
  'source/getSchemaBySourceId',
  async (sourceId, { getState }) => {
    const sourceSchemas = selectSourceDatabaseSchemas(getState() as RootState, {
      id: sourceId,
    });
    if (sourceSchemas) {
      return;
    }
    const { data } = await request2<any>({
      url: `/sources/schemas/${sourceId}`,
      method: 'GET',
    });
    return {
      sourceId,
      data,
    };
  },
);

export const runSql = createAsyncThunk<
  QueryResult | null,
  { id: string; isFragment: boolean },
  { state: RootState }
>('view/runSql', async (_, { getState, dispatch }) => {
  const currentEditingView = selectCurrentEditingView(
    getState(),
  ) as ViewViewModel;
  const { script, sourceId, size, fragment, variables } = currentEditingView;

  try {
    if (!sourceId) {
      throw Error(i18n.t('view.selectSource'));
    }

    if (!script.trim()) {
      throw Error(i18n.t('view.sqlRequired'));
    }

    const { data, warnings } = await request2<QueryResult>({
      url: '/data-provider/execute/test',
      method: 'POST',
      data: {
        script: fragment || script,
        sourceId,
        size,
        variables: variables.map(
          ({ name, type, valueType, defaultValue, expression }) => ({
            name,
            type,
            valueType,
            values: defaultValue ? JSON.parse(defaultValue) : null,
            expression,
          }),
        ),
      },
    });
    return { ...data, warnings };
  } catch (error) {
    dispatch(
      viewActions.changeCurrentEditingView({
        stage: ViewViewModelStages.Initialized,
        error: getErrorMessage(error),
      }),
    );
    return null;
  }
});

export const saveView = createAsyncThunk<
  ViewViewModel,
  SaveViewParams,
  { state: RootState }
>('view/saveView', async ({ resolve, isSaveAs, currentView }, { getState }) => {
  let currentEditingView = isSaveAs
    ? (currentView as ViewViewModel)
    : (selectCurrentEditingView(getState()) as ViewViewModel);
  const orgId = selectOrgId(getState());

  try {
    if (isNewView(currentEditingView.id) || isSaveAs) {
      const { data } = await request<View>({
        url: '/views',
        method: 'POST',
        data: getSaveParamsFromViewModel(orgId, currentEditingView),
      });
      resolve && resolve();

      return {
        ...currentEditingView,
        ...data,
        config: currentEditingView.config,
        model: currentEditingView.model,
        variables: data.variables.map(v => ({
          ...v,
          relVariableSubjects: data.relVariableSubjects,
        })),
        isSaveAs,
      };
    } else {
      await request<View>({
        url: `/views/${currentEditingView.id}`,
        method: 'PUT',
        data: getSaveParamsFromViewModel(orgId, currentEditingView, true),
      });
      resolve && resolve();
      return currentEditingView;
    }
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const saveFolder = createAsyncThunk<
  ViewSimple,
  SaveFolderParams,
  { state: RootState }
>('view/saveFolder', async ({ folder, resolve }, { getState }) => {
  const orgId = selectOrgId(getState());
  try {
    if (!(folder as ViewSimple).id) {
      const { data } = await request<View>({
        url: '/views',
        method: 'POST',
        data: { orgId, isFolder: true, ...folder },
      });
      resolve && resolve();
      return data;
    } else {
      await request<View>({
        url: `/views/${(folder as ViewSimple).id}`,
        method: 'PUT',
        data: folder,
      });
      resolve && resolve();
      return folder as ViewSimple;
    }
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const updateViewBase = createAsyncThunk<ViewBase, UpdateViewBaseParams>(
  'view/updateViewBase',
  async ({ view, resolve }) => {
    try {
      await request<boolean>({
        url: `/views/${view.id}/base`,
        method: 'PUT',
        data: view,
      });
      resolve();
      return view;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const removeEditingView = createAsyncThunk<
  null,
  { id: string; resolve: (currentEditingViewKey: string) => void },
  { state: RootState }
>('view/removeEditingView', async ({ id, resolve }, { dispatch, getState }) => {
  dispatch(viewActions.removeEditingView(id));
  const currentEditingViewKey = selectCurrentEditingViewKey(getState());
  resolve(currentEditingViewKey);
  return null;
});

export const unarchiveView = createAsyncThunk<
  string,
  UnarchiveViewParams,
  { state: RootState }
>(
  'view/unarchiveView',
  async ({ view: { id, name, parentId, index }, resolve }, { dispatch }) => {
    try {
      await request<null>({
        url: `/views/unarchive/${id}`,
        method: 'PUT',
        params: { name, parentId, index },
      });
      resolve();
      return id;
    } catch (error) {
      errorHandle(error);
      throw error;
    }
  },
);

export const deleteView = createAsyncThunk<
  null,
  DeleteViewParams,
  { state: RootState }
>('view/deleteView', async ({ id, archive, resolve }, { dispatch }) => {
  try {
    await request<boolean>({
      url: `/views/${id}`,
      method: 'DELETE',
      params: { archive },
    });
    resolve();
    return null;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
});

export const getEditorProvideCompletionItems = createAsyncThunk<
  null,
  { sourceId?: string; resolve: (getItems: any) => void },
  { state: RootState }
>(
  'view/getEditorProvideCompletionItems',
  ({ sourceId, resolve }, { getState }) => {
    const variables = selectCurrentEditingViewAttr(getState(), {
      name: 'variables',
    }) as VariableHierarchy[];
    const publicVariables = selectVariables(getState());

    const dbKeywords = new Set<string>();
    const tableKeywords = new Set<string>();
    const schemaKeywords = new Set<string>();
    const variableKeywords = new Set<string>();

    if (sourceId) {
      const currentDBSchemas = selectSourceDatabaseSchemas(getState(), {
        id: sourceId,
      });
      currentDBSchemas?.forEach(db => {
        dbKeywords.add(db.dbName);
        db.tables?.forEach(table => {
          tableKeywords.add(table.tableName);
          table.columns?.forEach(column => {
            schemaKeywords.add(column.name as string);
          });
        });
      });
    }

    ([] as Array<VariableHierarchy | Variable>)
      .concat(variables)
      .concat(publicVariables)
      .forEach(({ name }) => {
        variableKeywords.add(name);
      });

    const getItems = (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      const dataSource = [
        { detail: 'SQL', keywords: sqlReservedWords },
        { detail: 'Database', keywords: Array.from(dbKeywords) },
        { detail: 'Table', keywords: Array.from(tableKeywords) },
        { detail: 'Column', keywords: Array.from(schemaKeywords) },
        { detail: 'Variable', keywords: Array.from(variableKeywords) },
      ];
      return {
        suggestions: dataSource
          .filter(({ keywords }) => !!keywords)
          .reduce<monaco.languages.CompletionItem[]>(
            (arr, { detail, keywords }) =>
              arr.concat(
                keywords!.map(str => ({
                  label: str,
                  detail,
                  kind: monaco.languages.CompletionItemKind.Keyword,
                  insertText: detail === 'Variable' ? `$${str}$` : str,
                  range,
                })),
              ),
            [],
          ),
      };
    };

    resolve(getItems);

    return null;
  },
);
