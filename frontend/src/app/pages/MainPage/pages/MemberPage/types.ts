import { MainPageRouteParams } from '../../types';

export interface MemberPageRouteParams extends MainPageRouteParams {
  memberId: string;
}
