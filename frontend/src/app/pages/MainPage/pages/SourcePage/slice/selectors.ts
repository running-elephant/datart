import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const selectDomain = (state: RootState) => state.source || initialState;

export const selectSources = createSelector(
  [selectDomain],
  sourceState => sourceState.sources,
);

export const selectArchived = createSelector(
  [selectDomain],
  sourceState => sourceState.archived,
);

export const selectEditingSourceKey = createSelector(
  [selectDomain],
  sourceState => sourceState.editingSource,
);

export const selectEditingSource = createSelector([selectDomain], sourceState =>
  sourceState.sources
    .concat(sourceState.archived)
    .find(({ id }) => sourceState.editingSource === id),
);

export const selectSourceListLoading = createSelector(
  [selectDomain],
  sourceState => sourceState.sourceListLoading,
);

export const selectArchivedListLoading = createSelector(
  [selectDomain],
  sourceState => sourceState.archivedListLoading,
);

export const selectSaveSourceLoading = createSelector(
  [selectDomain],
  sourceState => sourceState.saveSourceLoading,
);

export const selectUnarchiveSourceLoading = createSelector(
  [selectDomain],
  sourceState => sourceState.unarchiveSourceLoading,
);

export const selectDeleteSourceLoading = createSelector(
  [selectDomain],
  sourceState => sourceState.deleteSourceLoading,
);
