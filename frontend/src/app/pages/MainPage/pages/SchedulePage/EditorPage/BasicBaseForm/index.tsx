import { DatePicker, Form, Input, Radio } from 'antd';
import { FC, useCallback } from 'react';
import { JobTypes, JOB_TYPES_OPTIONS } from '../../constants';
import { checkScheduleName } from '../../services';
import { ExecuteFormItem, ExecuteFormItemProps } from './ExecuteFormItem';
const { RangePicker } = DatePicker;

interface BasicBaseFormProps extends ExecuteFormItemProps {
  orgId: string;
  isAdd?: boolean;
  initialName?: string;
  onJobTypeChange: (j: JobTypes) => void;
}
export const BasicBaseForm: FC<BasicBaseFormProps> = ({
  onJobTypeChange,
  orgId,
  isAdd,
  initialName,
  children,
  ...restProps
}) => {
  const checkNameUnique = useCallback(
    async (_, name) => {
      if (!isAdd && initialName === name) {
        return Promise.resolve();
      }
      if (!name) {
        return Promise.resolve();
      } else {
        const res = await checkScheduleName(orgId, name);
        return res ? Promise.resolve() : Promise.reject('名称已存在');
      }
    },
    [orgId, isAdd, initialName],
  );
  return (
    <>
      <Form.Item
        label="名称"
        hasFeedback
        name="name"
        validateTrigger={'onBlur'}
        rules={[
          { required: true, message: '名称为必填项' },
          { validator: checkNameUnique },
        ]}
      >
        <Input autoComplete="new-name" />
      </Form.Item>
      <Form.Item label="类型" name="jobType">
        <Radio.Group
          options={JOB_TYPES_OPTIONS}
          onChange={e => onJobTypeChange(e.target.value)}
        />
      </Form.Item>
      <Form.Item label="有效时间范围" name={'dateRange'}>
        <RangePicker allowClear showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <ExecuteFormItem {...restProps} />
    </>
  );
};
