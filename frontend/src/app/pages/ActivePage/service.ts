import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
export const activeAccount = async (token: string) => {
  try {
    const { data } = await request<string>({
      url: `/users/active?token=${token}`,
      method: 'GET',
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};
