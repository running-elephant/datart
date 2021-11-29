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

import { DatePicker, FormItemProps } from 'antd';
import { PickerType } from 'app/pages/DashBoardPage/pages/BoardEditor/components/ControllerWidgetPanel/types';
import moment from 'moment';
import { FC, memo, useEffect, useState } from 'react';
interface FilterTimeProps {
  value: any[];
  onTimeChange: (timeValues: string[]) => void;
}
const FilterTime: FC<FilterTimeProps> = memo(({ value, onTimeChange }) => {
  const [timeRange, setTimeRange] = useState<string[]>(() => value);
  useEffect(() => {
    setTimeRange(value);
  }, [value]);
  const handleDateChange = times => {
    const formatTemp = 'YYYY-MM-DD HH:mm:ss';
    const newValues = [times.format(formatTemp)];
    onTimeChange(newValues);
  };
  return (
    <DatePicker
      showTime
      allowClear={false}
      value={moment(timeRange[0])}
      onChange={handleDateChange}
    />
  );
});
export interface SingleTimeSetProps extends FormItemProps<any> {
  pickerType: PickerType;
  value?: any;
  onChange?: any;
}
export const SingleTimeSet: React.FC<SingleTimeSetProps> = memo(
  ({ pickerType, value, onChange }) => {
    function _onChange(date, dateString) {
      onChange?.(date);
    }

    return (
      <>
        {pickerType === 'dateTime' ? (
          <DatePicker
            allowClear={true}
            value={value?.[0]}
            showTime
            onChange={_onChange}
          />
        ) : (
          <DatePicker
            allowClear={true}
            value={value?.[0]}
            onChange={_onChange}
            picker={pickerType as any}
          />
        )}
      </>
    );
  },
);
export default FilterTime;
