import { TreeDataNode, TreeNodeProps } from 'antd';
import { ReactElement } from 'react';
import { SubjectTypes } from '../../PermissionPage/constants';
import { RowPermissionRaw, Variable } from '../../VariablePage/slice/types';
import {
  ColumnCategories,
  ColumnTypes,
  ViewStatus,
  ViewViewModelStages,
} from '../constants';

export interface ViewState {
  views: undefined | ViewSimpleViewModel[];
  archived: undefined | ViewSimpleViewModel[];
  viewListLoading: boolean;
  archivedListLoading: boolean;
  editingViews: ViewViewModel[];
  currentEditingView: string;
  sourceDatabases: {
    [name: string]: TreeDataNode[];
  };
  saveViewLoading: boolean;
  unarchiveLoading: boolean;
}

export interface ViewBase {
  id: string;
  name: string;
  parentId: string | null;
  index: number | null;
}

export interface ViewSimple extends ViewBase {
  description?: string;
  isFolder: boolean;
  sourceId: string;
}

export interface ViewSimpleViewModel extends ViewSimple {
  deleteLoading: boolean;
}

export interface View extends ViewSimple {
  config: string;
  model: string;
  script: string;
  variables: Variable[];
  relVariableSubjects: RowPermissionRaw[];
  relSubjectColumns: ColumnPermissionRaw[];
}

export interface ViewViewModel<T = object>
  extends Pick<View, 'name' | 'script'> {
  id: string;
  description?: string;
  index: number | null;
  isFolder?: boolean;
  model: Model;
  config: object;
  originVariables: VariableHierarchy[];
  variables: VariableHierarchy[];
  originColumnPermissions: ColumnPermission[];
  columnPermissions: ColumnPermission[];
  parentId: string | null;
  sourceId?: string;
  status?: ViewStatus;
  size: number;
  touched: boolean;
  stage: ViewViewModelStages;
  previewResults: T[];
  error: string;
  fragment: string;
}

export interface QueryResult {
  columns: Schema[];
  rows: any[][];
  pageInfo: PageInfo;
  script?: string;
}
export interface PageInfo {
  pageNo: number;
  pageSize: number;
  total: number;
}
export interface Schema {
  name: string;
  primaryKey?: boolean;
  type: ColumnTypes;
}

export interface Column extends Schema {
  category: ColumnCategories;
}

export interface Model {
  [key: string]: Omit<Column, 'name'>;
}

export interface ColumnPermissionRaw {
  id: string;
  viewId: string;
  subjectId: string;
  subjectType: SubjectTypes;
  columnPermission: string;
  permission?: number;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

export interface ColumnPermission
  extends Omit<ColumnPermissionRaw, 'columnPermission'> {
  columnPermission: string[];
}

export interface VariableHierarchy extends Variable {
  relVariableSubjects: RowPermissionRaw[];
}

export interface SaveViewParams {
  resolve?: () => void;
}

export interface UpdateViewBaseParams {
  view: ViewBase;
  resolve: () => void;
}

export interface SaveFolderParams {
  folder:
    | ViewSimpleViewModel
    | {
        name: string;
        parentId: string | null;
      };
  resolve?: () => void;
}

export interface UnarchiveViewParams {
  view: Pick<ViewSimpleViewModel, 'id' | 'name' | 'parentId'>;
  resolve: () => void;
}
export interface DeleteViewParams {
  id: string;
  archive?: boolean;
  resolve: () => void;
}

export interface SelectViewTreeProps {
  getIcon: (
    o: ViewSimpleViewModel,
  ) => ReactElement | ((props: TreeNodeProps) => ReactElement);
  getDisabled: (o: ViewSimpleViewModel) => boolean;
}

export interface SelectViewFolderTreeProps {
  id?: string;
  getDisabled: (o: ViewSimpleViewModel, path: string[]) => boolean;
}
