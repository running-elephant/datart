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

import { DatePicker, Select, Space } from 'antd';
import useI18NPrefix, { I18NComponentProps } from 'app/hooks/useI18NPrefix';
import { Moment } from 'moment';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import { RelativeOrExactTime } from '../ChartFieldAction/FilterControlPanel/Constant';
import RelativeTimeSelector from './RelativeTimeSelector';

const ManualSingleTimeSelector: FC<
  {
    isStart?: boolean;
    time?: Moment;
    onTimeChange: (time: Moment) => void;
  } & I18NComponentProps
> = memo(({ isStart, i18nPrefix, time, onTimeChange }) => {
  const t = useI18NPrefix(i18nPrefix);
  const [type, setType] = useState(RelativeOrExactTime.Exact);

  const handleTimeChange = time => {
    onTimeChange?.(time);
  };

  const renderTimeSelector = type => {
    switch (type) {
      case RelativeOrExactTime.Exact:
        return (
          <DatePicker
            showTime
            value={time}
            onChange={handleTimeChange}
            placeholder={t('pleaseSelect')}
          />
        );
      case RelativeOrExactTime.Relative:
        return (
          <RelativeTimeSelector
            isStart={isStart}
            i18nPrefix={i18nPrefix}
            onChange={handleTimeChange}
          />
        );
    }
  };

  return (
    <StyledManualSingleTimeSelector>
      <Select value={type} onChange={value => setType(value)}>
        <Select.Option value={RelativeOrExactTime.Exact}>
          {t(RelativeOrExactTime.Exact)}
        </Select.Option>
        <Select.Option value={RelativeOrExactTime.Relative}>
          {t(RelativeOrExactTime.Relative)}
        </Select.Option>
      </Select>
      {isStart ? `${t('startTime')} : ` : `${t('endTime')} : `}
      {renderTimeSelector(type)}
    </StyledManualSingleTimeSelector>
  );
});

export default ManualSingleTimeSelector;

const StyledManualSingleTimeSelector = styled(Space)`
  & .ant-select {
    width: 80px;
  }
`;
