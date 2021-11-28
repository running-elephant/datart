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
import moment from 'moment';
import { FC, memo, useEffect, useState } from 'react';
interface FilterRangTimeProps {
  value: any[];
  onRangeTimeChange: (timeValues: string[] | null) => void;
}
const FilterRangTime: FC<FilterRangTimeProps> = memo(
  ({ value, onRangeTimeChange }) => {
    const [timeRange, setTimeRange] = useState<string[] | null>(() => value);
    useEffect(() => {
      if (!value?.[0] && !value?.[1]) {
        setTimeRange(null);
      } else {
        setTimeRange(value);
      }
    }, [value]);
    const handleDateChange = times => {
      if (!times) {
        setTimeRange(null);
        onRangeTimeChange(null);
        return;
      }
      const formatTemp = 'YYYY-MM-DD HH:mm:ss';
      const newValues = [
        times?.[0].format(formatTemp),
        times?.[1].format(formatTemp),
      ];
      onRangeTimeChange(newValues);
    };
    return (
      <DatePicker.RangePicker
        showTime
        allowClear={true}
        value={
          timeRange
            ? [
                timeRange[0] ? moment(timeRange[0]) : null,
                timeRange[1] ? moment(timeRange[1]) : null,
              ]
            : undefined
        }
        onChange={handleDateChange}
      />
    );
  },
);

export default FilterRangTime;
