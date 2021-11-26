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
import React, { memo, useMemo } from 'react';
const { RangePicker } = DatePicker;

export interface TimeControllerProps {
  value?: any;
  placeholder?: string;
  onChange: (values) => void;
  label?: React.ReactNode;
  name?: string;
  required?: boolean;
  pickerType: PickerType;
}

export const RangeTimeControllerForm: React.FC<TimeControllerProps> = memo(
  ({ label, name, required, ...rest }) => {
    return (
      <Form.Item
        name={name}
        label={label}
        validateTrigger={['onChange', 'onBlur']}
        rules={[{ required: false }]}
      >
        <RangeTimeController {...rest} />
      </Form.Item>
    );
  },
);

export interface TimeSetProps extends FormItemProps<any> {
  pickerType: PickerType;
  value?: any;
  onChange?: any;
}
export const RangeTimeController: React.FC<TimeSetProps> = memo(
  ({ pickerType, value, onChange }) => {
    const _onChange = times => {
      if (!times) {
        onChange?.(null);
        return;
      }
      const formatTemp = 'YYYY-MM-DD HH:mm:ss';
      const newValues = [
        times?.[0].format(formatTemp),
        times?.[1].format(formatTemp),
      ];
      onChange?.(newValues);
    };
    const _values = useMemo(() => {
      if (!value || !Array.isArray(value)) {
        return undefined;
      }
      return [
        value[0] ? moment(value[0]) : null,
        value[1] ? moment(value[1]) : null,
      ];
    }, [value]);
    return (
      <>
        {pickerType === 'dateTime' ? (
          <RangePicker
            showTime
            allowClear={true}
            value={_values as any}
            onChange={_onChange}
          />
        ) : (
          <RangePicker
            onChange={_onChange}
            allowClear={true}
            value={_values as any}
            picker={pickerType as any}
          />
        )}
      </>
    );
  },
);
// const StyledWrap = styled.div`
//   display: flex;

//   justify-content: space-around;
//   width: 100%;

//   & .ant-input {
//     background-color: transparent;
//   }
// `;
