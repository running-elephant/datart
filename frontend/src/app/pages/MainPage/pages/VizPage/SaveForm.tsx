import { Form, FormInstance, Input, Radio, TreeSelect } from 'antd';
import { ModalForm, ModalFormProps } from 'app/components';
import { BoardTypeMap } from 'app/pages/DashBoardPage/slice/types';
import debounce from 'debounce-promise';
import { CommonFormTypes, DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { request } from 'utils/request';
import { getCascadeAccess } from '../../Access';
import {
  selectIsOrgOwner,
  selectOrgId,
  selectPermissionMap,
} from '../../slice/selectors';
import { PermissionLevels, ResourceTypes } from '../PermissionPage/constants';
import { SaveFormContext } from './SaveFormContext';
import {
  makeSelectVizFolderTree,
  selectSaveFolderLoading,
  selectSaveStoryboardLoading,
} from './slice/selectors';

const VIZ_TYPE_TITLES = {
  DATACHART: '数据图表',
  DASHBOARD: '仪表板',
  FOLDER: '目录',
  STORYBOARD: '故事板',
};

type SaveFormProps = Omit<ModalFormProps, 'type' | 'visible' | 'onSave'>;

export function SaveForm({ formProps, ...modalProps }: SaveFormProps) {
  const {
    vizType,
    type,
    visible,
    initialValues,
    onSave,
    onCancel,
    onAfterClose,
  } = useContext(SaveFormContext);
  const selectVizFolderTree = useMemo(makeSelectVizFolderTree, []);
  const saveFolderLoading = useSelector(selectSaveFolderLoading);
  const saveStoryboardLoading = useSelector(selectSaveStoryboardLoading);
  const orgId = useSelector(selectOrgId);
  const isOwner = useSelector(selectIsOrgOwner);
  const permissionMap = useSelector(selectPermissionMap);
  const formRef = useRef<FormInstance>();

  const getDisabled = useCallback(
    (_, path: string[]) =>
      !getCascadeAccess(
        isOwner,
        permissionMap,
        ResourceTypes.Viz,
        path,
        PermissionLevels.Create,
      ),
    [isOwner, permissionMap],
  );

  const treeData = useSelector(state =>
    selectVizFolderTree(state, { id: initialValues?.id, getDisabled }),
  );
  useEffect(() => {
    if (initialValues) {
      formRef.current?.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  const save = useCallback(
    values => {
      onSave(values, onCancel);
    },
    [onSave, onCancel],
  );

  const afterClose = useCallback(() => {
    formRef.current?.resetFields();
    onAfterClose && onAfterClose();
  }, [onAfterClose]);

  return (
    <ModalForm
      formProps={formProps}
      {...modalProps}
      title={VIZ_TYPE_TITLES[vizType]}
      type={type}
      visible={visible}
      confirmLoading={saveFolderLoading || saveStoryboardLoading}
      onSave={save}
      onCancel={onCancel}
      afterClose={afterClose}
      ref={formRef}
    >
      <IdField name="id" hidden={type === CommonFormTypes.Add}>
        <Input />
      </IdField>
      <Form.Item
        name="name"
        label="名称"
        rules={[
          { required: true, message: '名称不能为空' },
          {
            validator: debounce((_, value) => {
              if (!value || initialValues?.name === value) {
                return Promise.resolve();
              }
              const parentId = formRef.current?.getFieldValue('parentId');
              return request({
                url: `/viz/check/name`,
                method: 'POST',
                params: {
                  name: value,
                  orgId,
                  vizType,
                  parentId: parentId || null,
                },
              }).then(
                () => Promise.resolve(),
                () => Promise.reject(new Error('名称重复')),
              );
            }, DEFAULT_DEBOUNCE_WAIT),
          },
        ]}
      >
        <Input />
      </Form.Item>
      {vizType === 'DATACHART' && (
        <Form.Item name="description" label="描述">
          <Input.TextArea />
        </Form.Item>
      )}
      {vizType === 'DASHBOARD' && type === CommonFormTypes.Add && (
        <Form.Item name="boardType" label="布局类型">
          <Radio.Group>
            <Radio.Button value={BoardTypeMap.auto}>自动</Radio.Button>
            <Radio.Button value={BoardTypeMap.free}>自由</Radio.Button>
          </Radio.Group>
        </Form.Item>
      )}
      {vizType !== 'STORYBOARD' && (
        <Form.Item name="parentId" label="所属目录">
          <TreeSelect placeholder="根目录" treeData={treeData} allowClear />
        </Form.Item>
      )}
    </ModalForm>
  );
}

const IdField = styled(Form.Item)`
  display: none;
`;
