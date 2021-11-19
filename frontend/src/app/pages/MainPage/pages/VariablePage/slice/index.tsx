import { createSlice } from '@reduxjs/toolkit';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import {
  addVariable,
  deleteVariable,
  editVariable,
  getVariables,
} from './thunks';
import { VariableState } from './types';

export const initialState: VariableState = {
  variables: [],
  variableListLoading: false,
  saveVariableLoading: false,
  deleteVariablesLoading: false,
};

const slice = createSlice({
  name: 'variable',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // getVariables
    builder.addCase(getVariables.pending, state => {
      state.variableListLoading = true;
    });
    builder.addCase(getVariables.fulfilled, (state, action) => {
      state.variableListLoading = false;
      state.variables = action.payload.map(v => ({
        ...v,
        deleteLoading: false,
      }));
    });
    builder.addCase(getVariables.rejected, state => {
      state.variableListLoading = false;
    });

    // addVariable
    builder.addCase(addVariable.pending, state => {
      state.saveVariableLoading = true;
    });
    builder.addCase(addVariable.fulfilled, (state, action) => {
      state.saveVariableLoading = false;
      state.variables.push({ ...action.payload, deleteLoading: false });
    });
    builder.addCase(addVariable.rejected, state => {
      state.saveVariableLoading = false;
    });

    // editVariable
    builder.addCase(editVariable.pending, state => {
      state.saveVariableLoading = true;
    });
    builder.addCase(editVariable.fulfilled, (state, action) => {
      state.saveVariableLoading = false;
      state.variables = state.variables.map(v =>
        v.id === action.payload.id
          ? { ...action.payload, deleteLoading: false }
          : v,
      );
    });
    builder.addCase(editVariable.rejected, state => {
      state.saveVariableLoading = false;
    });

    // deleteVariable
    builder.addCase(deleteVariable.pending, (state, action) => {
      if (action.meta.arg.ids.length === 1) {
        const variable = state.variables.find(
          ({ id }) => id === action.meta.arg.ids[0],
        );
        if (variable) {
          variable.deleteLoading = true;
        }
      } else {
        state.deleteVariablesLoading = true;
      }
    });
    builder.addCase(deleteVariable.fulfilled, (state, action) => {
      state.deleteVariablesLoading = false;
      state.variables = state.variables.filter(
        ({ id }) => !action.meta.arg.ids.includes(id),
      );
    });
    builder.addCase(deleteVariable.rejected, (state, action) => {
      if (action.meta.arg.ids.length === 1) {
        const variable = state.variables.find(
          ({ id }) => id === action.meta.arg.ids[0],
        );
        if (variable) {
          variable.deleteLoading = false;
        }
      } else {
        state.deleteVariablesLoading = false;
      }
    });
  },
});

export const { actions: variableActions, reducer } = slice;

export const useVariableSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
