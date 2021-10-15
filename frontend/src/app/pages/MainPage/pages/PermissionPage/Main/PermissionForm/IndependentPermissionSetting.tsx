import { Form, Radio, RadioChangeEvent } from 'antd';
import { memo } from 'react';
import { PermissionLevels } from '../../constants';

interface IndependentPermissionSettingProps {
  enabled: PermissionLevels;
  label: string;
  extra?: string;
  values: Array<{ text: string; value: PermissionLevels }>;
  onChange: (e: RadioChangeEvent) => void;
}

export const IndependentPermissionSetting = memo(
  ({
    enabled,
    label,
    extra,
    values,
    onChange,
  }: IndependentPermissionSettingProps) => {
    return (
      <Form.Item label={label} extra={extra}>
        <Radio.Group value={enabled} onChange={onChange}>
          {values.map(({ text, value }) => (
            <Radio key={value} value={value}>
              {text}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    );
  },
);
