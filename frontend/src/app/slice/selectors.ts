import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';

const selectDomain = (state: RootState) => state.app || initialState;

export const selectLoggedInUser = createSelector(
  [selectDomain],
  appState => appState.loggedInUser,
);

export const selectLoginLoading = createSelector(
  [selectDomain],
  appState => appState.loginLoading,
);

export const selectRegisterLoading = createSelector(
  [selectDomain],
  appState => appState.registerLoading,
);

export const selectSaveProfileLoading = createSelector(
  [selectDomain],
  appState => appState.saveProfileLoading,
);

export const selectModifyPasswordLoading = createSelector(
  [selectDomain],
  appState => appState.modifyPasswordLoading,
);
