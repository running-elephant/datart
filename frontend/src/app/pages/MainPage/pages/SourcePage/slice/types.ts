export interface SourceState {
  sources: Source[];
  archived: Source[];
  editingSource: string;
  sourceListLoading: boolean;
  archivedListLoading: boolean;
  sourceDetailLoading: boolean;
  saveSourceLoading: boolean;
  unarchiveSourceLoading: boolean;
  deleteSourceLoading: boolean;
}

export interface Source {
  config: string;
  createBy: string;
  createTime: string;
  id: string;
  name: string;
  orgId: string;
  status: number;
  type: string;
  updateBy: string;
  updateTime: string;
}

export interface SourceFormModel extends Pick<Source, 'name' | 'type'> {
  id?: string;
  config: object;
}

export interface AddSourceParams {
  source: Pick<Source, 'name' | 'type' | 'orgId' | 'config'>;
  resolve: (redirectId: string) => void;
}

export interface EditSourceParams {
  source: Source;
  resolve: () => void;
  reject?: () => void;
}

export interface UnarchiveSourceParams {
  id: string;
  resolve: () => void;
}

export interface DeleteSourceParams {
  id: string;
  archive?: boolean;
  resolve: () => void;
}
