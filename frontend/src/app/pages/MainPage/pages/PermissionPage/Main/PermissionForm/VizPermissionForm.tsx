import { Form, Radio } from 'antd';
import { LoadingMask } from 'app/components';
import classnames from 'classnames';
import { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { listToTree } from 'utils/utils';
import {
  CREATE_PERMISSION_VALUES,
  MODULE_PERMISSION_VALUES,
  PermissionLevels,
  ResourceTypes,
  SubjectTypes,
  Viewpoints,
  VizResourceSubTypes,
} from '../../constants';
import { makeSelectPrivileges } from '../../slice/selectors';
import { grantPermissions } from '../../slice/thunks';
import {
  DataSourceTreeNode,
  DataSourceViewModel,
  GrantPermissionParams,
  Privilege,
} from '../../slice/types';
import { getDefaultPermissionArray } from '../../utils';
import { IndependentPermissionSetting } from './IndependentPermissionSetting';
import { PermissionTable } from './PermissionTable';
import {
  calcPermission,
  getChangedPermission,
  getIndependentPermissionChangeParams,
  getPrivilegeResult,
  getRecalculatedPrivileges,
  getTreeNodeWithPermission,
  setTreeDataWithPrivilege,
} from './utils';

interface PermissionFormProps {
  viewpoint: Viewpoints;
  viewpointType: ResourceTypes | SubjectTypes;
  viewpointId: string;
  selected: boolean;
  orgId: string;
  dataSourceType: ResourceTypes;
  folders: DataSourceViewModel[] | undefined;
  storyboards: DataSourceViewModel[] | undefined;
  folderListLoading: boolean;
  storyboardListLoading: boolean;
  permissionLoading: boolean;
}

export const VizPermissionForm = memo(
  ({
    viewpoint,
    viewpointType,
    viewpointId,
    selected,
    orgId,
    dataSourceType,
    folders,
    storyboards,
    folderListLoading,
    storyboardListLoading,
    permissionLoading,
  }: PermissionFormProps) => {
    const [vizType, setVizType] = useState<'folder' | 'persentation'>('folder');
    const dispatch = useDispatch();
    const selectPrivileges = useMemo(makeSelectPrivileges, []);
    const privileges = useSelector(state =>
      selectPrivileges(state, { viewpoint, dataSourceType }),
    );

    const vizTreeData = useMemo(() => {
      if (folders && storyboards && privileges) {
        const originTreeData = listToTree(
          folders.concat(storyboards),
          null,
          [],
        ) as DataSourceTreeNode[];
        return setTreeDataWithPrivilege(
          originTreeData,
          [...privileges],
          viewpoint,
          viewpointType,
          dataSourceType,
        );
      } else {
        return [];
      }
    }, [
      viewpoint,
      viewpointType,
      dataSourceType,
      folders,
      storyboards,
      privileges,
    ]);

    const vizTypeChange = useCallback(e => {
      setVizType(e.target.value);
    }, []);

    const { moduleEnabled, storyboardCreateEnabled } = useMemo(() => {
      let moduleEnabled = PermissionLevels.Disable;
      let storyboardCreateEnabled = PermissionLevels.Disable;
      privileges?.forEach(({ resourceId, permission }) => {
        if (resourceId === '*') {
          moduleEnabled = permission;
        }
        if (resourceId === VizResourceSubTypes.Storyboard) {
          storyboardCreateEnabled = permission;
        }
      });
      return { moduleEnabled, storyboardCreateEnabled };
    }, [privileges]);

    const independentPermissionChange = useCallback(
      resourceId => e => {
        if (privileges) {
          const val = e.target.value;
          const params = getIndependentPermissionChangeParams(
            resourceId,
            val,
            privileges,
            orgId,
            viewpointId,
            viewpointType as SubjectTypes,
            dataSourceType as ResourceTypes,
          );
          dispatch(
            grantPermissions({
              params,
              options: {
                viewpoint,
                viewpointType,
                dataSourceType,
                reserved: val
                  ? privileges
                  : privileges.filter(p => p.resourceId !== resourceId),
              },
              resolve: () => {},
            }),
          );
        }
      },
      [
        dispatch,
        viewpoint,
        viewpointType,
        viewpointId,
        dataSourceType,
        privileges,
        orgId,
      ],
    );

    const privilegeChange = useCallback(
      () =>
        (
          record: DataSourceTreeNode,
          newPermissionArray: PermissionLevels[],
          index: number,
          base: PermissionLevels,
        ) => {
          if (viewpoint === Viewpoints.Subject) {
            // 找到变化的的单条资源，设置它及其子资源权限
            const changedTreeData = getTreeNodeWithPermission(
              vizTreeData,
              ({ id, permissionArray, path }, parentPermissionArray) =>
                id === record.id
                  ? newPermissionArray
                  : path.includes(record.id)
                  ? getChangedPermission(
                      parentPermissionArray[index] === PermissionLevels.Disable,
                      permissionArray,
                      index,
                      base,
                    )
                  : permissionArray,
              getDefaultPermissionArray(),
            );
            // 根据改变后的树重新计算出权限列表
            const recalculatedPrivileges = getRecalculatedPrivileges(
              changedTreeData,
              viewpoint,
              viewpointType,
              viewpointId,
              orgId,
            );
            // 根据新旧权限列表计算出请求参数
            const { created, updated, deleted, reserved } = getPrivilegeResult(
              [...privileges!],
              recalculatedPrivileges,
            );
            dispatch(
              grantPermissions({
                params: {
                  permissionToCreate: created,
                  permissionToDelete: deleted,
                  permissionToUpdate: updated,
                },
                options: { viewpoint, viewpointType, dataSourceType, reserved },
                resolve: () => {},
              }),
            );
          } else {
            let changedPrivilege: Privilege | undefined;
            const params: GrantPermissionParams['params'] = {
              permissionToCreate: [],
              permissionToDelete: [],
              permissionToUpdate: [],
            };
            let reserved: Privilege[] = [];
            const newPermission = calcPermission(newPermissionArray);

            if (
              calcPermission(record.permissionArray) ===
              PermissionLevels.Disable
            ) {
              changedPrivilege = {
                orgId,
                resourceId: viewpointId,
                resourceType: viewpointType as ResourceTypes,
                subjectId: record.id,
                subjectType: record.type as SubjectTypes,
                permission: newPermission,
              };
              params.permissionToCreate.push(changedPrivilege);
              reserved = [...privileges!];
            } else {
              privileges!.forEach(p => {
                if (p.subjectId === record.id) {
                  changedPrivilege = {
                    ...p,
                    permission: newPermission,
                  };

                  if (newPermission === PermissionLevels.Disable) {
                    params.permissionToDelete.push(changedPrivilege);
                  } else {
                    params.permissionToUpdate.push(changedPrivilege);
                    reserved.push(changedPrivilege);
                  }
                } else {
                  reserved.push(p);
                }
              });
            }
            dispatch(
              grantPermissions({
                params,
                options: { viewpoint, viewpointType, dataSourceType, reserved },
                resolve: () => {},
              }),
            );
          }
        },
      [
        dispatch,
        viewpoint,
        viewpointId,
        viewpointType,
        dataSourceType,
        orgId,
        privileges,
        vizTreeData,
      ],
    );

    return (
      <Wrapper className={classnames({ selected })}>
        <LoadingMask loading={permissionLoading}>
          <FormContent
            labelAlign="left"
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 19 }}
          >
            <IndependentPermissionSetting
              enabled={moduleEnabled}
              label="功能权限"
              extra="开启功能权限之后，用户才能在 Datart 界面上使用该功能"
              values={MODULE_PERMISSION_VALUES}
              onChange={independentPermissionChange('*')}
            />
            <Form.Item label="资源明细">
              <Radio.Group value={vizType} onChange={vizTypeChange}>
                <Radio value="folder">目录</Radio>
                <Radio value="persentation">演示</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label=" "
              colon={false}
              className={classnames({
                vizTable: true,
                selected: vizType === 'folder',
              })}
            >
              <PermissionTable
                viewpoint={viewpoint}
                viewpointType={viewpointType}
                dataSourceType={dataSourceType}
                dataSource={folders}
                resourceLoading={folderListLoading}
                privileges={privileges}
                onPrivilegeChange={privilegeChange}
              />
            </Form.Item>
            {vizType === 'persentation' && (
              <IndependentPermissionSetting
                enabled={storyboardCreateEnabled}
                label="新增故事板"
                values={CREATE_PERMISSION_VALUES}
                onChange={independentPermissionChange(
                  VizResourceSubTypes.Storyboard,
                )}
              />
            )}
            <Form.Item
              label=" "
              colon={false}
              className={classnames({
                vizTable: true,
                selected: vizType === 'persentation',
              })}
            >
              <PermissionTable
                viewpoint={viewpoint}
                viewpointType={viewpointType}
                dataSourceType={dataSourceType}
                dataSource={storyboards}
                resourceLoading={storyboardListLoading}
                privileges={privileges}
                onPrivilegeChange={privilegeChange}
              />
            </Form.Item>
          </FormContent>
        </LoadingMask>
      </Wrapper>
    );
  },
);

const Wrapper = styled.div`
  display: none;

  &.selected {
    position: relative;
    display: block;
  }
`;

const FormContent = styled(Form)`
  width: 960px;

  .vizTable {
    display: none;

    &.selected {
      display: flex;
    }
  }
`;
