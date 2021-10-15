import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
export const confirmInvite = async (token: string) => {
  try {
    const { data } = await request<string>({
      url: `/orgs/invite/confirm?token=${token}`,
      method: 'GET',
    });
    return data;
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};
