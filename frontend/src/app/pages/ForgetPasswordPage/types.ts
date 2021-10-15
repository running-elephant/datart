import { FindWays } from './constants';

export interface CaptchaParams {
  type: FindWays;
  principal: string;
}
export interface ResetPasswordParams {
  newPassword: string;
  token: string;
  verifyCode: string;
}
