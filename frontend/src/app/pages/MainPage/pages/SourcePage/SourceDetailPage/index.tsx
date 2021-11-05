import { LoadingOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
} from 'antd';
import { DetailPageHeader } from 'app/components/DetailPageHeader';
import { Access, useAccess } from 'app/pages/MainPage/Access';
import debounce from 'debounce-promise';
import {
  CommonFormTypes,
  COMMON_FORM_TITLE_PREFIX,
  DEFAULT_DEBOUNCE_WAIT,
} from 'globalConstants';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  SPACE_LG,
  SPACE_MD,
  SPACE_TIMES,
} from 'styles/StyleConstants';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import {
  selectDataProviderConfigTemplateLoading,
  selectDataProviderListLoading,
  selectDataProviders,
  selectOrgId,
} from '../../../slice/selectors';
import { getDataProviderConfigTemplate } from '../../../slice/thunks';
import { QueryResult } from '../../ViewPage/slice/types';
import { useSourceSlice } from '../slice';
import {
  selectDeleteSourceLoading,
  selectEditingSource,
  selectSaveSourceLoading,
  selectUnarchiveSourceLoading,
} from '../slice/selectors';
import {
  addSource,
  deleteSource,
  editSource,
  getSource,
  unarchiveSource,
} from '../slice/thunks';
import { Source, SourceFormModel } from '../slice/types';
import { allowManageSource } from '../utils';
import { ConfigComponent } from './ConfigComponent';

export function SourceDetailPage() {
  const [formType, setFormType] = useState(CommonFormTypes.Add);
  const [providerType, setProviderType] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const { actions } = useSourceSlice();
  const dispatch = useDispatch();
  const history = useHistory();
  const orgId = useSelector(selectOrgId);
  const editingSource = useSelector(selectEditingSource);
  const dataProviders = useSelector(selectDataProviders);
  const dataProviderListLoading = useSelector(selectDataProviderListLoading);
  const dataProviderConfigTemplateLoading = useSelector(
    selectDataProviderConfigTemplateLoading,
  );
  const saveSourceLoading = useSelector(selectSaveSourceLoading);
  const unarchiveSourceLoading = useSelector(selectUnarchiveSourceLoading);
  const deleteSourceLoading = useSelector(selectDeleteSourceLoading);
  const { params } = useRouteMatch<{ sourceId: string }>();
  const { sourceId } = params;
  const [form] = Form.useForm<SourceFormModel>();
  const isArchived = editingSource?.status === 0;
  const allowManage = useAccess(allowManageSource(editingSource?.id));

  const config = useMemo(
    () => dataProviders[providerType]?.config,
    [providerType, dataProviders],
  );

  const resetForm = useCallback(() => {
    setProviderType('');
    form.resetFields();
    dispatch(actions.clearEditingSource());
  }, [dispatch, form, actions]);

  useEffect(() => {
    resetForm();
    if (sourceId === 'add') {
      setFormType(CommonFormTypes.Add);
    } else {
      setFormType(CommonFormTypes.Edit);
      dispatch(getSource(sourceId));
    }
  }, [dispatch, resetForm, sourceId]);

  useEffect(() => {
    if (editingSource) {
      const { name, type, config } = editingSource;
      try {
        setProviderType(type);
        form.setFieldsValue({ name, type, config: JSON.parse(config) });
      } catch (error) {
        message.error('配置解析错误');
        throw error;
      }
    }
  }, [form, editingSource]);

  useEffect(() => {
    if (
      dataProviders[providerType]?.config === null &&
      !dataProviderConfigTemplateLoading
    ) {
      dispatch(getDataProviderConfigTemplate(providerType));
    }
  }, [
    dispatch,
    providerType,
    dataProviders,
    dataProviderConfigTemplateLoading,
  ]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [resetForm]);

  const dataProviderChange = useCallback(
    val => {
      setProviderType(val);
      if (dataProviders[val].config === null) {
        dispatch(getDataProviderConfigTemplate(val));
      }
    },
    [dispatch, dataProviders],
  );

  const dbTypeChange = useCallback(
    val => {
      const dbTypeConfig = config?.attributes.find(
        ({ name }) => name === 'dbType',
      );
      if (dbTypeConfig) {
        const selected = dbTypeConfig.options?.find(
          ({ dbType }) => dbType === val,
        );
        if (selected) {
          const { url, driverClass } = selected;
          form.setFieldsValue({ config: { url, driverClass } });
        }
      }
    },
    [config, form],
  );

  const test = useCallback(async () => {
    await form.validateFields();
    const { type, config } = form.getFieldsValue();
    const { name } = dataProviders[type];

    try {
      setTestLoading(true);
      await request<QueryResult>({
        url: '/data-provider/test',
        method: 'POST',
        data: { name, type, properties: config },
      });
      message.success('测试成功');
    } catch (error) {
      errorHandle(error);
      throw error;
    } finally {
      setTestLoading(false);
    }
  }, [form, dataProviders]);

  const subFormTest = useCallback(
    async (config, callback) => {
      const { name } = dataProviders[providerType];
      try {
        setTestLoading(true);
        const { data } = await request<QueryResult>({
          url: '/data-provider/test',
          method: 'POST',
          data: {
            name,
            type: providerType,
            properties:
              providerType === 'FILE'
                ? { path: config.path, format: config.format }
                : config,
            sourceId: editingSource?.id,
          },
        });
        callback(data);
      } catch (error) {
        errorHandle(error);
        throw error;
      } finally {
        setTestLoading(false);
      }
    },
    [dataProviders, providerType, editingSource],
  );

  const formSubmit = useCallback(
    (values: SourceFormModel) => {
      const { config, ...rest } = values;
      let configStr = '';

      try {
        configStr = JSON.stringify(config);
      } catch (error) {
        message.error((error as Error).message);
        throw error;
      }

      switch (formType) {
        case CommonFormTypes.Add:
          dispatch(
            addSource({
              source: { ...rest, orgId, config: configStr },
              resolve: id => {
                message.success('新建成功');
                history.push(`/organizations/${orgId}/sources/${id}`);
              },
            }),
          );
          break;
        case CommonFormTypes.Edit:
          dispatch(
            editSource({
              source: {
                ...(editingSource as Source),
                ...rest,
                orgId,
                config: configStr,
              },
              resolve: () => {
                message.success('修改成功');
              },
            }),
          );
          break;
        default:
          break;
      }
    },
    [dispatch, history, orgId, editingSource, formType],
  );

  const del = useCallback(
    archive => () => {
      dispatch(
        deleteSource({
          id: editingSource!.id,
          archive,
          resolve: () => {
            message.success(`成功${archive ? '移至回收站' : '删除'}`);
            history.replace(`/organizations/${orgId}/sources`);
          },
        }),
      );
    },
    [dispatch, history, orgId, editingSource],
  );

  const unarchive = useCallback(() => {
    dispatch(
      unarchiveSource({
        id: editingSource!.id,
        resolve: () => {
          message.success('还原成功');
          history.replace(`/organizations/${orgId}/sources`);
        },
      }),
    );
  }, [dispatch, history, orgId, editingSource]);

  const titleLabelPrefix = useMemo(
    () => (isArchived ? '已归档' : COMMON_FORM_TITLE_PREFIX[formType]),
    [isArchived, formType],
  );

  return (
    <Wrapper>
      <DetailPageHeader
        title={`${titleLabelPrefix}数据源`}
        actions={
          <Access {...allowManageSource(editingSource?.id)}>
            {!isArchived ? (
              <Space>
                <Button
                  type="primary"
                  loading={saveSourceLoading}
                  onClick={form.submit}
                >
                  保存
                </Button>
                {formType === CommonFormTypes.Edit && (
                  <Popconfirm title="确定移至回收站？" onConfirm={del(true)}>
                    <Button loading={deleteSourceLoading} danger>
                      移至回收站
                    </Button>
                  </Popconfirm>
                )}
              </Space>
            ) : (
              <Space>
                <Popconfirm title="确定还原？" onConfirm={unarchive}>
                  <Button loading={unarchiveSourceLoading}>还原</Button>
                </Popconfirm>
                <Popconfirm title="确认删除？" onConfirm={del(false)}>
                  <Button loading={deleteSourceLoading} danger>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            )}
          </Access>
        }
      />
      <Content>
        <Card bordered={false}>
          <Form
            name="source_form_"
            className="detailForm"
            form={form}
            labelAlign="left"
            labelCol={{ offset: 1, span: 5 }}
            wrapperCol={{ span: 8 }}
            onFinish={formSubmit}
          >
            <Form.Item
              name="name"
              label="名称"
              validateFirst
              rules={[
                { required: true, message: '名称不能为空' },
                {
                  validator: debounce((_, value) => {
                    if (value === editingSource?.name) {
                      return Promise.resolve();
                    }
                    return request({
                      url: `/sources/check/name`,
                      method: 'POST',
                      params: { name: value, orgId },
                    }).then(
                      () => Promise.resolve(),
                      () => Promise.reject(new Error('名称重复')),
                    );
                  }, DEFAULT_DEBOUNCE_WAIT),
                },
              ]}
            >
              <Input disabled={isArchived} />
            </Form.Item>
            <Form.Item
              name="type"
              label="类型"
              rules={[{ required: true, message: '类型为必选项' }]}
            >
              <Select
                loading={dataProviderListLoading}
                disabled={isArchived}
                onChange={dataProviderChange}
              >
                {Object.keys(dataProviders).map(key => (
                  <Select.Option key={key} value={key}>
                    {key}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {dataProviderConfigTemplateLoading && <LoadingOutlined />}

            {(providerType !== 'FILE' || formType === CommonFormTypes.Edit) &&
              config?.attributes.map(attr => (
                <ConfigComponent
                  key={`${providerType}_${attr.name}`}
                  attr={attr}
                  form={form}
                  sourceId={editingSource?.id}
                  testLoading={testLoading}
                  disabled={isArchived}
                  allowManage={allowManage(true)}
                  onTest={test}
                  onSubFormTest={subFormTest}
                  onDbTypeChange={dbTypeChange}
                />
              ))}
          </Form>
        </Card>
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding: ${SPACE_LG};
  overflow-y: auto;

  .ant-card {
    margin-top: ${SPACE_LG};
    background-color: ${p => p.theme.componentBackground};
    border-radius: ${BORDER_RADIUS};
    box-shadow: ${p => p.theme.shadowBlock};

    &:first-of-type {
      margin-top: 0;
    }
  }

  .detailForm {
    max-width: ${SPACE_TIMES(240)};
    padding-top: ${SPACE_MD};
  }
`;
