import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useInjectReducer } from 'utils/@reduxjs/injectReducer';
import {
  getSystemInfo,
  getUserInfoByToken,
  login,
  logout,
  modifyAccountPassword,
  register,
  saveProfile,
  setLoggedInUser,
} from './thunks';
import { AppState, User } from './types';

export const initialState: AppState = {
  loggedInUser: null,
  systemInfo: null,
  loginLoading: false,
  registerLoading: false,
  saveProfileLoading: false,
  modifyPasswordLoading: false,
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateUser(state, { payload }: PayloadAction<User>) {
      state.loggedInUser = payload;
    },
  },
  extraReducers: builder => {
    // login
    builder.addCase(login.pending, state => {
      state.loginLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loginLoading = false;
      state.loggedInUser = action.payload;
    });
    builder.addCase(login.rejected, state => {
      state.loginLoading = false;
    });

    // getUserInfoByToken
    builder.addCase(getUserInfoByToken.fulfilled, (state, action) => {
      state.loggedInUser = action.payload;
    });

    // register
    builder.addCase(register.pending, state => {
      state.registerLoading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.registerLoading = false;
    });
    builder.addCase(register.rejected, state => {
      state.registerLoading = false;
    });

    // setLoggedInUser
    builder.addCase(
      setLoggedInUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loggedInUser = action.payload;
      },
    );

    // logout
    builder.addCase(logout.fulfilled, state => {
      state.loggedInUser = null;
    });

    // saveProfile
    builder.addCase(saveProfile.pending, state => {
      state.saveProfileLoading = true;
    });
    builder.addCase(saveProfile.fulfilled, (state, action) => {
      state.saveProfileLoading = false;
      state.loggedInUser = action.payload;
    });
    builder.addCase(saveProfile.rejected, state => {
      state.saveProfileLoading = false;
    });

    // modifyAccountPassword
    builder.addCase(modifyAccountPassword.pending, state => {
      state.modifyPasswordLoading = true;
    });
    builder.addCase(modifyAccountPassword.fulfilled, state => {
      state.modifyPasswordLoading = false;
    });
    builder.addCase(modifyAccountPassword.rejected, state => {
      state.modifyPasswordLoading = false;
    });

    // getSystemInfo
    builder.addCase(getSystemInfo.fulfilled, (state, action) => {
      state.systemInfo = action.payload;
    });
  },
});

export const { actions: appActions, reducer } = slice;

export const useAppSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  return { actions: slice.actions };
};
