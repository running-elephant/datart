import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { SubjectTypes } from '../constants';
import {
  selectMemberListLoading,
  selectMembers,
  selectRoleListLoading,
  selectRoles,
} from '../slice/selectors';
import { FlexCollapse } from './FlexCollapse';
import { SubjectList } from './SubjectList';
import { PanelsProps } from './types';
const { Panel } = FlexCollapse;

export const SubjectPanels = memo(
  ({ viewpointId, viewpointType, onToggle, onToDetail }: PanelsProps) => {
    const roles = useSelector(selectRoles);
    const members = useSelector(selectMembers);
    const roleListLoading = useSelector(selectRoleListLoading);
    const memberListLoading = useSelector(selectMemberListLoading);

    const subjectPanels = useMemo(
      () => [
        {
          type: SubjectTypes.Role,
          label: '角色',
          dataSource: roles,
          loading: roleListLoading,
        },
        {
          type: SubjectTypes.UserRole,
          label: '成员',
          dataSource: members,
          loading: memberListLoading,
        },
      ],
      [roles, members, roleListLoading, memberListLoading],
    );

    return (
      <FlexCollapse defaultActiveKeys={viewpointType && [viewpointType]}>
        {subjectPanels.map(
          ({ type: subjectType, label, dataSource, loading }) => (
            <Panel
              key={subjectType}
              id={subjectType}
              title={label}
              onChange={onToggle}
            >
              <SubjectList
                viewpointId={viewpointId}
                viewpointType={viewpointType as SubjectTypes}
                dataSource={dataSource}
                loading={loading}
                onToDetail={onToDetail}
              />
            </Panel>
          ),
        )}
      </FlexCollapse>
    );
  },
);
