import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const selectDomain = (state: RootState) => state.variable || initialState;

export const selectVariables = createSelector(
  [selectDomain],
  variableState => variableState.variables,
);

export const selectVariableListLoading = createSelector(
  [selectDomain],
  variableState => variableState.variableListLoading,
);

export const selectSaveVariableLoading = createSelector(
  [selectDomain],
  variableState => variableState.saveVariableLoading,
);

export const selectDeleteVariablesLoading = createSelector(
  [selectDomain],
  variableState => variableState.deleteVariablesLoading,
);
