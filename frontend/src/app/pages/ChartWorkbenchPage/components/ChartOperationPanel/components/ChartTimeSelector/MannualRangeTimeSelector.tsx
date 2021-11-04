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

import { Row, Space } from 'antd';
import TimeConfigContext from 'app/pages/ChartWorkbenchPage/contexts/TimeConfigContext';
import useI18NPrefix, { I18NComponentProps } from 'app/hooks/useI18NPrefix';
import {
  FilterCondition,
  FilterConditionType,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import moment from 'moment';
import { FC, memo, useContext, useState } from 'react';
import ChartFilterCondition, {
  ConditionBuilder,
} from '../../../../models/ChartFilterCondition';
import ManualSingleTimeSelector from './ManualSingleTimeSelector';

const MannualRangeTimeSelector: FC<
  {
    condition?: FilterCondition;
    onFilterChange: (filter: ChartFilterCondition) => void;
  } & I18NComponentProps
> = memo(({ i18nPrefix, condition, onFilterChange }) => {
  const t = useI18NPrefix(i18nPrefix);
  const { format } = useContext(TimeConfigContext);
  const [timeRange, setTimeRange] = useState(() => {
    if (condition?.type === FilterConditionType.RangeTime) {
      const startTime = moment(condition?.value?.[0]);
      const endTime = moment(condition?.value?.[1]);
      return [startTime, endTime];
    }
    return [];
  });

  const handleTimeChange = index => time => {
    timeRange[index] = time;
    setTimeRange(timeRange);

    const filterRow = new ConditionBuilder(condition)
      .setValue((timeRange || []).map(d => d.toString()))
      .asRangeTime();
    onFilterChange && onFilterChange(filterRow);
  };

  return (
    <div>
      <Row>
        {/* {`${t('currentTime')} : ${timeRange
          ?.map(time => formatTime(time, format))
          ?.join(' - ')}`} */}
      </Row>
      <Space direction="vertical" size={12}>
        <ManualSingleTimeSelector
          isStart={true}
          i18nPrefix={i18nPrefix}
          onTimeChange={handleTimeChange(0)}
        />
        <ManualSingleTimeSelector
          isStart={false}
          i18nPrefix={i18nPrefix}
          onTimeChange={handleTimeChange(1)}
        />
      </Space>
    </div>
  );
});

export default MannualRangeTimeSelector;
