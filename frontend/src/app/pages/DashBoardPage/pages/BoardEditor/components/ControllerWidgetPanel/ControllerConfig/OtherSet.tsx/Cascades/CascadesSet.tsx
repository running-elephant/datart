/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Form, Select } from 'antd';
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel';
import { Widget } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { NamePath } from 'rc-field-form/lib/interface';
import React, { memo } from 'react';
import { RelativeDate } from '../../../types';

export const CascadesSetForm: React.FC<{
  name: NamePath;
  label?: React.ReactNode;
  tooltip?: LabelTooltipType;
  [key: string]: any;
}> = memo(({ name, label, tooltip, ...props }) => {
  return (
    <>
      <Form.Item
        label={label}
        name={name}
        tooltip={tooltip}
        validateTrigger={['onChange', 'onBlur']}
      >
        <CascadesSetter {...props} />
      </Form.Item>
    </>
  );
});
export interface CascadesSetterProps {
  value?: any;
  onChange?: (data: RelativeDate) => any;
  options?: Widget[];
}
export const CascadesSetter: React.FC<CascadesSetterProps> = ({
  value,
  onChange,
  options,
}) => {
  const _onChange = _value => {
    onChange?.(_value);
  };
  return (
    <Select showSearch mode="multiple" value={value} onChange={_onChange}>
      {options?.map(item => {
        let name = item.config.name;
        return (
          <Select.Option key={item.id} value={item.id}>
            {name}
          </Select.Option>
        );
      })}
    </Select>
  );
};
