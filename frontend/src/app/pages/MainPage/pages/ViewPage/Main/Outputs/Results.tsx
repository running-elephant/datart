import {
  CaretRightOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Popup, ToolbarButton, Tree } from 'app/components';
import classnames from 'classnames';
import { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { FONT_FAMILY, FONT_SIZE_BASE } from 'styles/StyleConstants';
import { v4 as uuidv4 } from 'uuid';
import { selectRoles } from '../../../MemberPage/slice/selectors';
import { SubjectTypes } from '../../../PermissionPage/constants';
import { SchemaTable } from '../../components/SchemaTable';
import { ViewViewModelStages } from '../../constants';
import { useViewSlice } from '../../slice';
import { selectCurrentEditingViewAttr } from '../../slice/selectors';
import {
  Column,
  ColumnPermission,
  Model,
  ViewViewModel,
} from '../../slice/types';

const ROW_KEY = 'DATART_ROW_KEY';

interface ResultsProps {
  height?: number;
}

export const Results = memo(({ height = 0 }: ResultsProps) => {
  const { actions } = useViewSlice();
  const dispatch = useDispatch();
  const viewId = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'id' }),
  ) as string;
  const model = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'model' }),
  ) as Model;
  const columnPermissions = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'columnPermissions' }),
  ) as ColumnPermission[];
  const stage = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'stage' }),
  ) as ViewViewModelStages;
  const previewResults = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'previewResults' }),
  ) as ViewViewModel['previewResults'];
  const roles = useSelector(selectRoles);

  const dataSource = useMemo(
    () => previewResults.map(o => ({ ...o, [ROW_KEY]: uuidv4() })),
    [previewResults],
  );

  const modelChange = useCallback(
    (columnName: string, column: Omit<Column, 'name'>) =>
      ({ key }) => {
        let value;
        if (key.includes('category')) {
          const category = key.split('-')[1];
          value = { ...column, category };
        } else {
          value = { ...column, type: key };
        }
        dispatch(
          actions.changeCurrentEditingView({
            model: { ...model, [columnName]: value },
          }),
        );
      },
    [dispatch, actions, model],
  );

  const roleDropdownData = useMemo(
    () =>
      roles.map(({ id, name }) => ({
        key: id,
        title: name,
        value: id,
        isLeaf: true,
      })),
    [roles],
  );

  const checkRoleColumnPermission = useCallback(
    columnName => checkedKeys => {
      const fullPermissions = Object.keys(model);
      dispatch(
        actions.changeCurrentEditingView({
          columnPermissions: roleDropdownData.reduce<ColumnPermission[]>(
            (updated, { key }) => {
              const permission = columnPermissions.find(
                ({ subjectId }) => subjectId === key,
              );
              const checkOnCurrentRole = checkedKeys.includes(key);
              if (permission) {
                if (checkOnCurrentRole) {
                  const updatedColumnPermission = Array.from(
                    new Set(permission.columnPermission.concat(columnName)),
                  );
                  return fullPermissions.sort().join(',') !==
                    updatedColumnPermission.sort().join(',')
                    ? updated.concat({
                        ...permission,
                        columnPermission: updatedColumnPermission,
                      })
                    : updated;
                } else {
                  return updated.concat({
                    ...permission,
                    columnPermission: permission.columnPermission.filter(
                      c => c !== columnName,
                    ),
                  });
                }
              } else {
                return !checkOnCurrentRole
                  ? updated.concat({
                      id: uuidv4(),
                      viewId,
                      subjectId: key,
                      subjectType: SubjectTypes.Role,
                      columnPermission: fullPermissions.filter(
                        c => c !== columnName,
                      ),
                    })
                  : updated;
              }
            },
            [],
          ),
        }),
      );
    },
    [dispatch, actions, viewId, model, columnPermissions, roleDropdownData],
  );

  const getExtraHeaderActions = useCallback(
    (name: string, column: Omit<Column, 'name'>) => {
      // 没有记录相当于对所有字段都有权限
      const checkedKeys =
        columnPermissions.length > 0
          ? roleDropdownData.reduce<string[]>((selected, { key }) => {
              const permission = columnPermissions.find(
                ({ subjectId }) => subjectId === key,
              );
              if (permission) {
                return permission.columnPermission.includes(name)
                  ? selected.concat(key)
                  : selected;
              } else {
                return selected.concat(key);
              }
            }, [])
          : roleDropdownData.map(({ key }) => key);
      return [
        <Popup
          key={`${name}_columnpermission`}
          trigger={['click']}
          placement="bottomRight"
          content={
            <Tree
              className="dropdown"
              treeData={roleDropdownData}
              checkedKeys={checkedKeys}
              loading={false}
              selectable={false}
              onCheck={checkRoleColumnPermission(name)}
              blockNode
              checkable
            />
          }
        >
          <Tooltip title="列权限">
            <ToolbarButton
              size="small"
              iconSize={FONT_SIZE_BASE}
              icon={
                checkedKeys.length > 0 ? (
                  <EyeOutlined
                    className={classnames({
                      partial: checkedKeys.length !== roleDropdownData.length,
                    })}
                  />
                ) : (
                  <EyeInvisibleOutlined />
                )
              }
            />
          </Tooltip>
        </Popup>,
      ];
    },
    [columnPermissions, roleDropdownData, checkRoleColumnPermission],
  );

  const pagination = useMemo(
    () => ({
      defaultPageSize: 100,
      pageSizeOptions: ['100', '200', '500', '1000'],
    }),
    [],
  );

  return stage > ViewViewModelStages.Fresh ? (
    <TableWrapper>
      <SchemaTable
        height={height ? height - 96 : 0}
        model={model}
        dataSource={dataSource}
        pagination={pagination}
        getExtraHeaderActions={getExtraHeaderActions}
        onSchemaTypeChange={modelChange}
        hasCategory
      />
    </TableWrapper>
  ) : (
    <InitialDesc>
      <p>
        请点击 <CaretRightOutlined /> 按钮执行，运行结果将在此处展示
      </p>
    </InitialDesc>
  );
});

const InitialDesc = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  p {
    color: ${p => p.theme.textColorLight};
  }
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  font-family: ${FONT_FAMILY};
  background-color: ${p => p.theme.componentBackground};
`;
