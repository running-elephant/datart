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
import { DatePicker } from 'antd';
import React, { memo } from 'react';
import { PickerType } from '../../../types';
const { RangePicker } = DatePicker;
export const RangeTimeSet: React.FC<{
  pickerType: PickerType;
  value?: any;
  onChange?: any;
}> = memo(({ pickerType }) => {
  function onChange(date, dateString) {
    console.log(date, dateString);
  }

  return (
    <>
      {pickerType === 'dateTime' ? (
        <RangePicker showTime onChange={onChange} />
      ) : (
        <RangePicker onChange={onChange} picker={pickerType as any} />
      )}
    </>
  );
});
