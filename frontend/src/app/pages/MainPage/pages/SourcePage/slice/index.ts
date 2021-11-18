import { createSlice } from '@reduxjs/toolkit';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import {
  addSource,
  deleteSource,
  editSource,
  getArchivedSources,
  getSource,
  getSources,
  unarchiveSource,
} from './thunks';
import { SourceState } from './types';

export const initialState: SourceState = {
  sources: [],
  archived: [],
  editingSource: '',
  sourceListLoading: false,
  archivedListLoading: false,
  sourceDetailLoading: false,
  saveSourceLoading: false,
  unarchiveSourceLoading: false,
  deleteSourceLoading: false,
};

const slice = createSlice({
  name: 'source',
  initialState,
  reducers: {
    clearEditingSource(state) {
      state.editingSource = '';
    },
  },
  extraReducers: builder => {
    // getSources
    builder.addCase(getSources.pending, state => {
      state.sourceListLoading = true;
    });
    builder.addCase(getSources.fulfilled, (state, action) => {
      state.sourceListLoading = false;
      state.sources = action.payload;
    });
    builder.addCase(getSources.rejected, state => {
      state.sourceListLoading = false;
    });

    // getArchivedSources
    builder.addCase(getArchivedSources.pending, state => {
      state.archivedListLoading = true;
    });
    builder.addCase(getArchivedSources.fulfilled, (state, action) => {
      state.archivedListLoading = false;
      state.archived = action.payload;
    });
    builder.addCase(getArchivedSources.rejected, state => {
      state.archivedListLoading = false;
    });

    // getSource
    builder.addCase(getSource.pending, state => {
      state.sourceDetailLoading = true;
    });
    builder.addCase(getSource.fulfilled, (state, action) => {
      state.sourceDetailLoading = false;
      state.sources = state.sources.map(s =>
        s.id === action.payload.id ? action.payload : s,
      );
      state.editingSource = action.payload.id;
    });
    builder.addCase(getSource.rejected, state => {
      state.sourceDetailLoading = false;
    });

    // addSource
    builder.addCase(addSource.pending, state => {
      state.saveSourceLoading = true;
    });
    builder.addCase(addSource.fulfilled, (state, action) => {
      state.saveSourceLoading = false;
      state.sources.unshift(action.payload);
    });
    builder.addCase(addSource.rejected, state => {
      state.saveSourceLoading = false;
    });

    // editSource
    builder.addCase(editSource.pending, state => {
      state.saveSourceLoading = true;
    });
    builder.addCase(editSource.fulfilled, (state, action) => {
      state.saveSourceLoading = false;
      state.sources = state.sources.map(s =>
        s.id === action.payload.id ? action.payload : s,
      );
    });
    builder.addCase(editSource.rejected, state => {
      state.saveSourceLoading = false;
    });

    // unarchiveSource
    builder.addCase(unarchiveSource.pending, state => {
      state.unarchiveSourceLoading = true;
    });
    builder.addCase(unarchiveSource.fulfilled, (state, action) => {
      state.unarchiveSourceLoading = false;
      state.archived = state.archived.filter(s => s.id !== action.meta.arg.id);
    });
    builder.addCase(unarchiveSource.rejected, state => {
      state.unarchiveSourceLoading = false;
    });

    // deleteSource
    builder.addCase(deleteSource.pending, state => {
      state.deleteSourceLoading = true;
    });
    builder.addCase(deleteSource.fulfilled, (state, action) => {
      state.deleteSourceLoading = false;
      if (action.meta.arg.archive) {
        state.sources = state.sources.filter(s => s.id !== action.meta.arg.id);
      } else {
        state.archived = state.archived.filter(
          s => s.id !== action.meta.arg.id,
        );
      }
    });
    builder.addCase(deleteSource.rejected, state => {
      state.deleteSourceLoading = false;
    });
  },
});

export const { actions: sourceActions, reducer } = slice;

export const useSourceSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
