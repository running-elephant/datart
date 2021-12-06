import { createAsyncThunk } from '@reduxjs/toolkit';
import sqlReservedWords from 'app/assets/javascripts/sqlReservedWords';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { monaco } from 'react-monaco-editor';
import { RootState } from 'types';
import { request } from 'utils/request';
import { errorHandle, rejectHandle } from 'utils/utils';
import { viewActions } from '.';
import { selectVariables } from '../../VariablePage/slice/selectors';
import { Variable } from '../../VariablePage/slice/types';
import { ViewViewModelStages } from '../constants';
import {
  generateEditingView,
  generateNewEditingViewName,
  getSaveParamsFromViewModel,
  isNewView,
} from '../utils';
import {
  selectCurrentEditingView,
  selectCurrentEditingViewAttr,
  selectCurrentEditingViewKey,
  selectDatabases,
  selectEditingViews,
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
  View,
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
      name: viewSimple?.name || '加载中...',
      stage: ViewViewModelStages.Loading,
    });
    dispatch(viewActions.addEditingView(tempViewModel));

    try {
      const { data } = await request<View>(`/views/${viewId}`);
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
    } catch (error) {
      return rejectHandle(error, rejectWithValue);
    }
  },
);

export const runSql = createAsyncThunk<
  QueryResult,
  { id: string; isFragment: boolean },
  { state: RootState }
>('view/runSql', async (_, { getState, rejectWithValue }) => {
  const currentEditingView = selectCurrentEditingView(
    getState(),
  ) as ViewViewModel;
  const { script, sourceId, size, fragment, variables } = currentEditingView;

  if (!sourceId) {
    return rejectWithValue('请选择数据源');
  }

  if (!script.trim()) {
    return rejectWithValue('');
  }

  try {
    const { data } = await request<QueryResult>({
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
    return data;
  } catch (error) {
    return rejectHandle(error, rejectWithValue);
  }
});

export const saveView = createAsyncThunk<
  ViewViewModel,
  SaveViewParams,
  { state: RootState }
>('view/saveView', async ({ resolve }, { getState }) => {
  const currentEditingView = selectCurrentEditingView(
    getState(),
  ) as ViewViewModel;
  const orgId = selectOrgId(getState());

  try {
    if (isNewView(currentEditingView.id)) {
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
      const databases = selectDatabases(getState(), { name: sourceId });
      databases?.forEach(db => {
        dbKeywords.add(db.title as string);
        db.children?.forEach(table => {
          tableKeywords.add(table.title as string);
          table.children?.forEach(column => {
            schemaKeywords.add(column.title as string);
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
