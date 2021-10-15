import { User } from 'app/slice/types';

export interface MemberState {
  members: User[];
  roles: Role[];
  editingMember: null | {
    info: User;
    roles: Role[];
  };
  editingRole: null | {
    info: Role;
    members: User[];
  };
  memberListLoading: boolean;
  roleListLoading: boolean;
  inviteMemberLoading: boolean;
  getMemberRolesLoading: boolean;
  saveMemberLoading: boolean;
  removeMemberLoading: boolean;
  roleDetailLoading: boolean;
  saveRoleLoading: boolean;
  deleteRoleLoading: boolean;
  getRoleMembersLoading: boolean;
  grantOwnerLoading: boolean;
}

export interface InviteMemberParams {
  params: {
    orgId: string;
    emails: string[];
    sendMail: boolean;
  };
  resolve: ({ success, fail }: { success: string[]; fail: string[] }) => void;
}

export interface EditMemberParams {
  orgId: string;
  roles: Role[];
  resolve: () => void;
}

export interface RemoveMemberParams {
  id: string;
  orgId: string;
  resolve: () => void;
}

export interface Role {
  avatar: string;
  description: string;
  id: string;
  name: string;
  orgId: string;
}

export interface RoleViewModel extends Role {
  members: User[];
}

export interface AddRoleParams {
  role: Omit<Role, 'id'>;
  resolve: () => void;
}

export interface EditRoleParams {
  role: Partial<Role>;
  members: User[];
  resolve: () => void;
}

export interface DeleteRoleParams {
  id: string;
  resolve: () => void;
}

export interface GrantOwnerParams {
  orgId: string;
  userId: string;
  resolve: () => void;
}
