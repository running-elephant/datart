import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  message,
  Popconfirm,
  Space,
  Table,
  TableColumnProps,
  Tag,
  Tooltip,
} from 'antd';
import { CommonFormTypes } from 'globalConstants';
import { Moment } from 'moment';
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  FONT_SIZE_TITLE,
  FONT_WEIGHT_MEDIUM,
  INFO,
  LINE_HEIGHT_TITLE,
  SPACE_LG,
  SPACE_MD,
  WARNING,
} from 'styles/StyleConstants';
import { request } from 'utils/request';
import { errorHandle, getDiffParams } from 'utils/utils';
import { selectOrgId } from '../../slice/selectors';
import { useMemberSlice } from '../MemberPage/slice';
import { getMembers, getRoles } from '../MemberPage/slice/thunks';
import {
  DEFAULT_VALUE_DATE_FORMAT,
  VariableScopes,
  VariableTypes,
  VariableValueTypes,
  VARIABLE_TYPE_LABEL,
  VARIABLE_VALUE_TYPE_LABEL,
} from './constants';
import { useVariableSlice } from './slice';
import {
  selectDeleteVariablesLoading,
  selectSaveVariableLoading,
  selectVariableListLoading,
  selectVariables,
} from './slice/selectors';
import {
  addVariable,
  deleteVariable,
  editVariable,
  getVariables,
} from './slice/thunks';
import {
  RowPermission,
  RowPermissionRaw,
  Variable,
  VariableViewModel,
} from './slice/types';
import { SubjectForm } from './SubjectForm';
import { VariableFormModel } from './types';
import { VariableForm } from './VariableForm';

export function VariablePage() {
  useMemberSlice();
  useVariableSlice();
  const [formType, setFormType] = useState(CommonFormTypes.Add);
  const [formVisible, setFormVisible] = useState(false);
  const [editingVariable, setEditingVariable] = useState<undefined | Variable>(
    void 0,
  );
  const [rowPermissions, setRowPermissions] = useState<
    undefined | RowPermission[]
  >(void 0);
  const [rowPermissionLoading, setRowPermissionLoading] = useState(false);
  const [subjectFormVisible, setSubjectFormVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [updateRowPermissionLoading, setUpdateRowPermissionLoading] =
    useState(false);
  const dispatch = useDispatch();
  const variables = useSelector(selectVariables);
  const listLoading = useSelector(selectVariableListLoading);
  const saveLoading = useSelector(selectSaveVariableLoading);
  const deleteVariablesLoading = useSelector(selectDeleteVariablesLoading);
  const orgId = useSelector(selectOrgId);

  useEffect(() => {
    dispatch(getVariables(orgId));
    dispatch(getMembers(orgId));
    dispatch(getRoles(orgId));
  }, [dispatch, orgId]);

  const showAddForm = useCallback(() => {
    setFormType(CommonFormTypes.Add);
    setFormVisible(true);
  }, []);

  const hideForm = useCallback(() => {
    setFormVisible(false);
  }, []);

  const afterFormClose = useCallback(() => {
    setEditingVariable(void 0);
  }, []);

  const showEditForm = useCallback(
    id => () => {
      setEditingVariable(variables.find(v => v.id === id));
      setFormType(CommonFormTypes.Edit);
      setFormVisible(true);
    },
    [variables],
  );

  const showSubjectForm = useCallback(
    id => async () => {
      const variable = variables.find(v => v.id === id)!;
      setEditingVariable(variable);
      setSubjectFormVisible(true);

      try {
        setRowPermissionLoading(true);
        const { data } = await request<RowPermissionRaw[]>(
          `/variables/value?variableId=${id}`,
        );
        setRowPermissions(
          data.map(d => ({
            ...d,
            value: d.value && JSON.parse(d.value),
          })),
        );
      } catch (error) {
        errorHandle(error);
        throw error;
      } finally {
        setRowPermissionLoading(false);
      }
    },
    [variables],
  );

  const hideSubjectForm = useCallback(() => {
    setSubjectFormVisible(false);
  }, []);

  const del = useCallback(
    id => () => {
      dispatch(
        deleteVariable({
          ids: [id],
          resolve: () => {
            message.success('删除成功');
          },
        }),
      );
    },
    [dispatch],
  );

  const delSelectedVariables = useCallback(() => {
    dispatch(
      deleteVariable({
        ids: selectedRowKeys as string[],
        resolve: () => {
          message.success('删除成功');
          setSelectedRowKeys([]);
        },
      }),
    );
  }, [dispatch, selectedRowKeys]);

  const save = useCallback(
    (values: VariableFormModel) => {
      let defaultValue: any = values.defaultValue;
      if (values.valueType === VariableValueTypes.Date) {
        defaultValue = values.defaultValue.map(d =>
          (d as Moment).format(DEFAULT_VALUE_DATE_FORMAT),
        );
      }

      try {
        if (defaultValue !== void 0 && defaultValue !== null) {
          defaultValue = JSON.stringify(defaultValue);
        }
      } catch (error) {
        errorHandle(error);
        throw error;
      }

      if (formType === CommonFormTypes.Add) {
        dispatch(
          addVariable({
            variable: { ...values, orgId, defaultValue },
            resolve: () => {
              hideForm();
            },
          }),
        );
      } else {
        dispatch(
          editVariable({
            variable: { ...editingVariable!, ...values, defaultValue },
            resolve: () => {
              hideForm();
              message.success('修改成功');
            },
          }),
        );
      }
    },
    [dispatch, formType, orgId, editingVariable, hideForm],
  );

  const saveRelations = useCallback(
    async (changedRowPermissions: RowPermission[]) => {
      if (rowPermissions) {
        const { created, updated, deleted } = getDiffParams(
          [...rowPermissions],
          changedRowPermissions,
          (oe, ce) =>
            oe.subjectId === ce.subjectId && oe.variableId === ce.variableId,
          (oe, ce) =>
            oe.useDefaultValue !== ce.useDefaultValue || oe.value !== ce.value,
        );

        if (created.length > 0 || updated.length > 0 || deleted.length > 0) {
          try {
            setUpdateRowPermissionLoading(true);
            await request<null>({
              url: '/variables/rel',
              method: 'PUT',
              data: {
                relToCreate: created.map(r => ({
                  ...r,
                  value: JSON.stringify(r.value),
                })),
                relToUpdate: updated.map(r => ({
                  ...r,
                  value: JSON.stringify(r.value),
                })),
                relToDelete: deleted.map(({ id }) => id),
              },
            });
            message.success('修改成功');
            setSubjectFormVisible(false);
          } catch (error) {
            errorHandle(error);
            throw error;
          } finally {
            setUpdateRowPermissionLoading(false);
          }
        }
      }
    },
    [rowPermissions],
  );

  const columns: TableColumnProps<VariableViewModel>[] = useMemo(
    () => [
      { dataIndex: 'name', title: '名称' },
      { dataIndex: 'label', title: '标签' },
      {
        dataIndex: 'type',
        title: '类型',
        render: (_, record) => (
          <Tag
            color={record.type === VariableTypes.Permission ? WARNING : INFO}
          >
            {VARIABLE_TYPE_LABEL[record.type]}
          </Tag>
        ),
      },
      {
        dataIndex: 'valueType',
        title: '值类型',
        render: (_, record) => VARIABLE_VALUE_TYPE_LABEL[record.valueType],
      },
      {
        title: '操作',
        align: 'center',
        width: 140,
        render: (_, record) => (
          <Actions>
            {record.type === VariableTypes.Permission && (
              <Tooltip title="关联角色或用户">
                <Button
                  type="link"
                  icon={<TeamOutlined />}
                  onClick={showSubjectForm(record.id)}
                />
              </Tooltip>
            )}
            <Tooltip title="编辑">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={showEditForm(record.id)}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Popconfirm title="确认删除？" onConfirm={del(record.id)}>
                <Button type="link" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </Actions>
        ),
      },
    ],
    [del, showEditForm, showSubjectForm],
  );

  const pagination = useMemo(
    () => ({ pageSize: 20, pageSizeOptions: ['20', '50', '100'] }),
    [],
  );

  return (
    <Wrapper>
      <Card>
        <TableHeader>
          <h3>公共变量列表</h3>
          <Toolbar>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title="确认删除全部？"
                onConfirm={delSelectedVariables}
              >
                <Button
                  icon={<DeleteOutlined />}
                  loading={deleteVariablesLoading}
                >
                  批量删除
                </Button>
              </Popconfirm>
            )}
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={showAddForm}
            >
              新建
            </Button>
          </Toolbar>
        </TableHeader>
        <Table
          rowKey="id"
          size="small"
          dataSource={variables}
          columns={columns}
          loading={listLoading}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          pagination={pagination}
        />
        <VariableForm
          scope={VariableScopes.Public}
          orgId={orgId}
          editingVariable={editingVariable}
          visible={formVisible}
          title="公共变量"
          type={formType}
          confirmLoading={saveLoading}
          onSave={save}
          onCancel={hideForm}
          afterClose={afterFormClose}
          keyboard={false}
          maskClosable={false}
        />
        <SubjectForm
          scope={VariableScopes.Public}
          editingVariable={editingVariable}
          loading={rowPermissionLoading}
          rowPermissions={rowPermissions}
          visible={subjectFormVisible}
          confirmLoading={updateRowPermissionLoading}
          onSave={saveRelations}
          onCancel={hideSubjectForm}
          afterClose={afterFormClose}
          keyboard={false}
          maskClosable={false}
        />
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex: 1;
  padding: ${SPACE_LG};

  .ant-card {
    background-color: ${p => p.theme.componentBackground};
    border-radius: ${BORDER_RADIUS};
    box-shadow: ${p => p.theme.shadow1};

    .ant-card-body {
      padding: 0 ${SPACE_LG};
    }
  }
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${SPACE_MD} 0;

  h3 {
    flex: 1;
    font-size: ${FONT_SIZE_TITLE};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    line-height: ${LINE_HEIGHT_TITLE};
  }
`;

const Toolbar = styled(Space)`
  flex-shrink: 0;
`;

const Actions = styled(Space)`
  display: flex;
  justify-content: flex-end;
`;
