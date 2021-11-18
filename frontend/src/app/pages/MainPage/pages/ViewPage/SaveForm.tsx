import { DoubleRightOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Radio,
  Switch,
  TreeSelect,
} from 'antd';
import { ModalForm, ModalFormProps } from 'app/components';
import debounce from 'debounce-promise';
import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_MD } from 'styles/StyleConstants';
import { request } from 'utils/request';
import { getCascadeAccess } from '../../Access';
import {
  selectIsOrgOwner,
  selectOrgId,
  selectPermissionMap,
} from '../../slice/selectors';
import { PermissionLevels, ResourceTypes } from '../PermissionPage/constants';
import {
  ConcurrencyControlModes,
  CONCURRENCY_CONTROL_MODE_LABEL,
  ViewViewModelStages,
} from './constants';
import { SaveFormContext } from './SaveFormContext';
import {
  makeSelectViewFolderTree,
  selectCurrentEditingView,
} from './slice/selectors';

type SaveFormProps = Omit<ModalFormProps, 'type' | 'visible' | 'onSave'>;

export function SaveForm({ formProps, ...modalProps }: SaveFormProps) {
  const [advancedVisible, setAdvancedVisible] = useState(false);
  const [concurrencyControl, setConcurrencyControl] = useState(true);
  const [cache, setCache] = useState(false);
  const selectViewFolderTree = useMemo(makeSelectViewFolderTree, []);

  const {
    type,
    visible,
    simple,
    parentIdLabel,
    initialValues,
    onSave,
    onCancel,
    onAfterClose,
  } = useContext(SaveFormContext);
  const isOwner = useSelector(selectIsOrgOwner);
  const permissionMap = useSelector(selectPermissionMap);

  const getDisabled = useCallback(
    (_, path: string[]) =>
      !getCascadeAccess(
        isOwner,
        permissionMap,
        ResourceTypes.View,
        path,
        PermissionLevels.Create,
      ),
    [isOwner, permissionMap],
  );

  const folderTree = useSelector(state =>
    selectViewFolderTree(state, { id: initialValues?.id, getDisabled }),
  );
  const currentEditingView = useSelector(selectCurrentEditingView);
  const orgId = useSelector(selectOrgId);
  const formRef = useRef<FormInstance>();

  useEffect(() => {
    if (initialValues) {
      formRef.current?.setFieldsValue({
        ...initialValues,
        parentId: initialValues.parentId || void 0,
      });
    }
  }, [initialValues]);

  const toggleAdvanced = useCallback(() => {
    setAdvancedVisible(!advancedVisible);
  }, [advancedVisible]);

  const save = useCallback(
    values => {
      onSave(values, onCancel);
    },
    [onSave, onCancel],
  );

  const afterClose = useCallback(() => {
    formRef.current?.resetFields();
    setAdvancedVisible(false);
    setConcurrencyControl(true);
    setCache(false);
    onAfterClose && onAfterClose();
  }, [onAfterClose]);

  return (
    <ModalForm
      formProps={formProps}
      {...modalProps}
      type={type}
      visible={visible}
      confirmLoading={currentEditingView?.stage === ViewViewModelStages.Saving}
      onSave={save}
      onCancel={onCancel}
      afterClose={afterClose}
      ref={formRef}
    >
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
                url: `/views/check/name`,
                method: 'POST',
                params: { name: value, orgId, parentId: parentId || null },
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
      <Form.Item name="parentId" label={parentIdLabel}>
        <TreeSelect
          placeholder="根目录"
          treeData={folderTree || []}
          allowClear
        />
      </Form.Item>
      {!simple && (
        <>
          <AdvancedToggle
            type="link"
            icon={<DoubleRightOutlined rotate={advancedVisible ? -90 : 90} />}
            onClick={toggleAdvanced}
          >
            高级配置
          </AdvancedToggle>
          <AdvancedWrapper show={advancedVisible}>
            <Form.Item
              name={['config', 'concurrencyControl']}
              label="并发控制"
              valuePropName="checked"
              initialValue={concurrencyControl}
            >
              <Switch onChange={setConcurrencyControl} />
            </Form.Item>
            <Form.Item
              name={['config', 'concurrencyControlMode']}
              label="模式"
              initialValue={ConcurrencyControlModes.DirtyRead}
            >
              <Radio.Group disabled={!concurrencyControl}>
                {Object.values(ConcurrencyControlModes).map(value => (
                  <Radio key={value} value={value}>
                    {CONCURRENCY_CONTROL_MODE_LABEL[value]}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name={['config', 'cache']}
              label="缓存"
              valuePropName="checked"
              initialValue={cache}
            >
              <Switch onChange={setCache} />
            </Form.Item>
            <Form.Item
              name={['config', 'cacheExpires']}
              label="失效时间"
              initialValue={0}
            >
              <InputNumber disabled={!cache} />
            </Form.Item>
          </AdvancedWrapper>
        </>
      )}
    </ModalForm>
  );
}

const AdvancedToggle = styled(Button)`
  margin-bottom: ${SPACE_MD};
`;

const AdvancedWrapper = styled.div<{ show: boolean }>`
  display: ${p => (p.show ? 'block' : 'none')};
`;
