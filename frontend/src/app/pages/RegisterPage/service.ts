import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
export const sendEmail = async usernameOrEmail => {
  try {
    const { data } = await request<string>({
      url: '/users/sendmail',
      method: 'POST',
      params: { usernameOrEmail },
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};
