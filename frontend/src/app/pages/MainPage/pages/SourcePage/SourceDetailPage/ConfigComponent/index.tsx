import {
  Button,
  Form,
  FormItemProps,
  Input,
  Radio,
  Select,
  Switch,
} from 'antd';
import { QueryResult } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import { DataProviderAttribute } from 'app/pages/MainPage/slice/types';
import { Rule } from 'rc-field-form/lib/interface';
import { ArrayConfig } from './ArrayConfig';
import { Properties } from './Properties';
import { SchemaComponent } from './SchemaComponent';

interface ConfigComponentProps {
  attr: DataProviderAttribute;
  testLoading?: boolean;
  disabled?: boolean;
  allowManage?: boolean;
  schemaDataSource?: object[];
  subFormRowKey?: string;
  subFormRowKeyValidator?: (val: string) => boolean;
  onTest?: () => void;
  onSubFormTest?: (
    config: object,
    callback: (data: QueryResult) => void,
  ) => void;
  onDbTypeChange?: (val: string) => void;
}

export function ConfigComponent({
  attr,
  testLoading,
  disabled,
  allowManage,
  schemaDataSource,
  subFormRowKey,
  subFormRowKeyValidator,
  onTest,
  onSubFormTest,
  onDbTypeChange,
}: ConfigComponentProps) {
  const { name, description, required, defaultValue, type, options } = attr;
  let component;
  let extraFormItemProps: Partial<FormItemProps> = {};

  switch (name) {
    case 'url':
      component = (
        <Input
          suffix={
            <Button
              type="link"
              size="small"
              loading={testLoading}
              onClick={onTest}
            >
              测试连接
            </Button>
          }
          disabled={disabled}
        />
      );
      break;
    case 'dbType':
      component = (
        <Select
          disabled={disabled}
          onChange={onDbTypeChange}
          showSearch
          allowClear
        >
          {options?.map(({ dbType }) => (
            <Select.Option key={dbType} value={dbType}>
              {dbType}
            </Select.Option>
          ))}
        </Select>
      );
      break;
    default:
      switch (type) {
        case 'string':
          if (options && options.length > 0) {
            if (options.length > 3) {
              component = (
                <Select disabled={disabled} showSearch allowClear>
                  {options.map(o => (
                    <Select.Option key={o} value={o}>
                      {o}
                    </Select.Option>
                  ))}
                </Select>
              );
            } else {
              component = (
                <Radio.Group disabled={disabled}>
                  {options.map(o => (
                    <Radio key={o} value={o}>
                      {o}
                    </Radio>
                  ))}
                </Radio.Group>
              );
            }
          } else {
            component = <Input disabled={disabled} />;
          }
          break;
        case 'password':
          component = <Input.Password disabled={disabled} />;
          break;
        case 'bool':
          component = <Switch disabled={disabled} />;
          extraFormItemProps.valuePropName = 'checked';
          break;
        case 'object':
          component = (
            <Properties disabled={disabled} allowManage={allowManage} />
          );
          extraFormItemProps.initialValue = {};
          extraFormItemProps.wrapperCol = { span: 16 };
          break;
        case 'array':
          component = (
            <ArrayConfig
              attr={attr}
              testLoading={testLoading}
              disabled={disabled}
              allowManage={allowManage}
              onSubFormTest={onSubFormTest}
            />
          );
          extraFormItemProps.initialValue = [];
          extraFormItemProps.wrapperCol = { span: 12 };
          break;
        case 'schema':
          component = <SchemaComponent dataSource={schemaDataSource} />;
          extraFormItemProps.wrapperCol = { span: 16 };
          break;
        default:
          return null;
      }
      break;
  }

  let rules: Rule[] = [];

  if (required) {
    rules.push({ required: true, message: `${name}不能为空` });
  }

  if (subFormRowKey === name) {
    rules.push({
      validator: (_, value) => {
        const valid = subFormRowKeyValidator && subFormRowKeyValidator(value);
        return valid
          ? Promise.resolve()
          : Promise.reject(new Error('名称重复'));
      },
    });
  }

  return (
    <Form.Item
      name={['config', name]}
      label={name}
      initialValue={defaultValue}
      extra={description}
      rules={rules}
      {...extraFormItemProps}
    >
      {component}
    </Form.Item>
  );
}
