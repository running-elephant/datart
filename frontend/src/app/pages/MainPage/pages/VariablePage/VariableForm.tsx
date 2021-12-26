import { Checkbox, Form, FormInstance, Input, Radio } from 'antd';
import { ModalForm, ModalFormProps } from 'app/components';
import debounce from 'debounce-promise';
import { DEFAULT_DEBOUNCE_WAIT } from 'globalConstants';
import moment from 'moment';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SPACE_XS } from 'styles/StyleConstants';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { VariableHierarchy } from '../ViewPage/slice/types';
import {
  VariableScopes,
  VariableTypes,
  VariableValueTypes,
  VARIABLE_TYPE_LABEL,
  VARIABLE_VALUE_TYPE_LABEL,
} from './constants';
import { DefaultValue } from './DefaultValue';
import { Variable } from './slice/types';
import { VariableFormModel } from './types';

interface VariableFormProps extends ModalFormProps {
  scope: VariableScopes;
  orgId: string;
  editingVariable: undefined | Variable;
  variables?: VariableHierarchy[];
}

export const VariableForm = memo(
  ({
    scope,
    orgId,
    editingVariable,
    variables,
    visible,
    formProps,
    afterClose,
    ...modalProps
  }: VariableFormProps) => {
    const [type, setType] = useState<VariableTypes>(
      scope === VariableScopes.Public
        ? VariableTypes.Permission
        : VariableTypes.Query,
    );
    const [valueType, setValueType] = useState<VariableValueTypes>(
      VariableValueTypes.String,
    );
    const [expression, setExpression] = useState(false);
    const formRef = useRef<FormInstance<VariableFormModel>>();

    useEffect(() => {
      if (visible && editingVariable) {
        try {
          const { type, valueType, expression } = editingVariable;
          let defaultValue = editingVariable.defaultValue
            ? JSON.parse(editingVariable.defaultValue)
            : [];
          if (valueType === VariableValueTypes.Date) {
            defaultValue = defaultValue.map(str => moment(str));
          }
          setType(type);
          setValueType(valueType);
          setExpression(expression || false);
          formRef.current?.setFieldsValue({
            ...editingVariable,
            defaultValue,
          });
        } catch (error) {
          errorHandle(error);
          throw error;
        }
      }
    }, [visible, editingVariable, formRef]);

    const onAfterClose = useCallback(() => {
      setType(
        scope === VariableScopes.Public
          ? VariableTypes.Permission
          : VariableTypes.Query,
      );
      setValueType(VariableValueTypes.String);
      setExpression(false);
      afterClose && afterClose();
    }, [scope, afterClose]);

    const typeChange = useCallback(e => {
      setType(e.target.value);
    }, []);

    const valueTypeChange = useCallback(e => {
      setValueType(e.target.value);
      formRef.current?.setFieldsValue({ defaultValue: [] });
    }, []);

    const expressionChange = useCallback(e => {
      setExpression(e.target.checked);
      formRef.current?.setFieldsValue({ defaultValue: [] });
    }, []);

    const nameValidator = useMemo(
      () =>
        scope === VariableScopes.Private
          ? (_, value) => {
              if (value === editingVariable?.name) {
                return Promise.resolve();
              }
              if (variables?.find(({ name }) => name === value)) {
                return Promise.reject(new Error('名称重复'));
              } else {
                return Promise.resolve();
              }
            }
          : debounce((_, value) => {
              if (!value || value === editingVariable?.name) {
                return Promise.resolve();
              }
              return request({
                url: `/variables/check/name`,
                method: 'POST',
                params: { name: value, orgId },
              }).then(
                () => Promise.resolve(),
                () => Promise.reject(new Error('名称重复')),
              );
            }, DEFAULT_DEBOUNCE_WAIT),
      [scope, editingVariable?.name, variables, orgId],
    );

    return (
      <ModalForm
        {...modalProps}
        visible={visible}
        formProps={{
          labelAlign: 'left',
          labelCol: { offset: 1, span: 5 },
          wrapperCol: { span: 16 },
          className: '',
        }}
        afterClose={onAfterClose}
        ref={formRef}
        destroyOnClose
      >
        <Form.Item
          name="name"
          label="名称"
          validateFirst
          rules={[
            { required: true, message: '名称不能为空' },
            {
              validator: nameValidator,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="label" label="标题">
          <Input />
        </Form.Item>
        <Form.Item name="type" label="类型" initialValue={type}>
          <Radio.Group onChange={typeChange}>
            {Object.values(VariableTypes).map(value => (
              <Radio.Button key={value} value={value}>
                {VARIABLE_TYPE_LABEL[value]}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item name="valueType" label="值类型" initialValue={valueType}>
          <Radio.Group onChange={valueTypeChange}>
            {Object.values(VariableValueTypes).map(value => (
              <Radio.Button key={value} value={value}>
                {VARIABLE_VALUE_TYPE_LABEL[value]}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
        {scope === VariableScopes.Public && type === VariableTypes.Permission && (
          <Form.Item name="permission" label="编辑权限" initialValue={0}>
            <Radio.Group>
              <Radio.Button value={0}>不可见</Radio.Button>
              <Radio.Button value={1}>只读</Radio.Button>
              <Radio.Button value={2}>可编辑</Radio.Button>
            </Radio.Group>
          </Form.Item>
        )}
        <Form.Item
          name="defaultValue"
          label="默认值"
          css={`
            margin-bottom: ${SPACE_XS};
          `}
        >
          <DefaultValue type={valueType} expression={expression} />
        </Form.Item>
        {valueType !== VariableValueTypes.Expression && (
          <Form.Item
            name="expression"
            label=" "
            colon={false}
            valuePropName="checked"
            initialValue={expression}
          >
            <Checkbox onChange={expressionChange}>
              使用表达式作为默认值
            </Checkbox>
          </Form.Item>
        )}
      </ModalForm>
    );
  },
);
