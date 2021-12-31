import { Form, FormInstance, Input, Radio, TreeSelect } from 'antd';
import { ModalForm, ModalFormProps } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardTypeMap } from 'app/pages/DashBoardPage/pages/Board/slice/types';
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
  const t = useI18NPrefix('viz.saveForm');
  const tg = useI18NPrefix('global');

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
      title={t(`vizType.${vizType.toLowerCase()}`)}
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
        label={t('name')}
        rules={[
          {
            required: true,
            message: `${t('name')}${tg('validation.required')}`,
          },
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
                err => Promise.reject(new Error(err.response.data.message)),
              );
            }, DEFAULT_DEBOUNCE_WAIT),
          },
        ]}
      >
        <Input />
      </Form.Item>
      {vizType === 'DATACHART' && (
        <Form.Item name="description" label={t('description')}>
          <Input.TextArea />
        </Form.Item>
      )}
      {vizType === 'DASHBOARD' && type === CommonFormTypes.Add && (
        <Form.Item name="boardType" label={t('boardType.label')}>
          <Radio.Group>
            <Radio.Button value={BoardTypeMap.auto}>
              {t('boardType.auto')}
            </Radio.Button>
            <Radio.Button value={BoardTypeMap.free}>
              {t('boardType.free')}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      )}
      {vizType !== 'STORYBOARD' && (
        <Form.Item name="parentId" label={t('parent')}>
          <TreeSelect
            placeholder={t('root')}
            treeData={treeData}
            allowClear
            onChange={() => {
              formRef.current?.validateFields();
            }}
          />
        </Form.Item>
      )}
    </ModalForm>
  );
}

const IdField = styled(Form.Item)`
  display: none;
`;
