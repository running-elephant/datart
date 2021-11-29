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
import { DatePicker, Form, FormItemProps } from 'antd';
import { PickerType } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import moment from 'moment';
import React, { memo } from 'react';

export interface TimeControllerProps {
  value?: any;
  placeholder?: string;
  onChange: (values) => void;
  label?: React.ReactNode;
  name?: string;
  required?: boolean;
  pickerType: PickerType;
}

export const TimeControllerForm: React.FC<TimeControllerProps> = memo(
  ({ label, name, required, ...rest }) => {
    return (
      <Form.Item
        name={name}
        label={label}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{ required: false }]}
      >
        <TimeController {...rest} />
      </Form.Item>
    );
  },
);

export interface SingleTimeSetProps extends FormItemProps<any> {
  pickerType: PickerType;
  value?: any;
  onChange?: any;
}
export const TimeController: React.FC<SingleTimeSetProps> = memo(
  ({ pickerType, value, onChange }) => {
    const _onChange = time => {
      if (!time) {
        return onChange(null);
      }
      const formatTemp = 'YYYY-MM-DD HH:mm:ss';
      const newValues = time.format(formatTemp);
      onChange(newValues);
    };

    return (
      <>
        {pickerType === 'dateTime' ? (
          <DatePicker
            allowClear={true}
            value={value ? moment(value) : null}
            showTime
            onChange={_onChange}
          />
        ) : (
          <DatePicker
            allowClear={true}
            value={value ? moment(value) : null}
            onChange={_onChange}
            picker={pickerType as any}
          />
        )}
      </>
    );
  },
);
