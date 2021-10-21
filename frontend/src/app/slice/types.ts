export interface AppState {
  loggedInUser: null | User;
  systemInfo: null | SystemInfo;
  loginLoading: boolean;
  registerLoading: boolean;
  saveProfileLoading: boolean;
  modifyPasswordLoading: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  name: string | null;
  description: string;
  orgOwner?: boolean;
}

export interface SystemInfo {
  tokenTimeout: string;
  version: string;
}

export interface ModifyUserPassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LoginParams {
  params: {
    username: string;
    password: string;
  };
  resolve: () => void;
}
export interface UserInfoByTokenParams {
  token: string;
  resolve: () => void;
}

export interface RegisterParams {
  data: {
    email: string;
    username: string;
    password: string;
  };
  resolve: () => void;
}

export type LogoutParams = undefined | (() => void);

export interface SaveProfileParams {
  user: User;
  resolve: () => void;
}

export interface ModifyPasswordParams {
  params: Omit<ModifyUserPassword, 'confirmPassword'>;
  resolve: () => void;
}
