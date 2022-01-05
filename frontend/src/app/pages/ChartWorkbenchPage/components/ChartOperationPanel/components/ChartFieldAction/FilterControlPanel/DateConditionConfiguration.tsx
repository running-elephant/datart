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

import { Tabs } from 'antd';
import useI18NPrefix, { I18NComponentProps } from 'app/hooks/useI18NPrefix';
import { FilterConditionType } from 'app/types/ChartConfig';
import { formatTime } from 'app/utils/time';
import { RECOMMEND_TIME, TIME_FORMATTER } from 'globalConstants';
import moment from 'moment';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import ChartFilterCondition, {
  ConditionBuilder,
} from '../../../../../models/ChartFilterCondition';
import TimeSelector from '../../ChartTimeSelector';

const DateConditionConfiguration: FC<
  {
    condition?: ChartFilterCondition;
    onChange: (confconditionig: ChartFilterCondition) => void;
  } & I18NComponentProps
> = memo(({ i18nPrefix, condition, onChange: onConditionChange }) => {
  const t = useI18NPrefix(i18nPrefix);
  const [type, setType] = useState<string>(() =>
    condition?.type === FilterConditionType.RangeTime
      ? String(FilterConditionType.RangeTime)
      : String(FilterConditionType.RecommendTime),
  );

  const clearFilterWhenTypeChange = (type: string) => {
    setType(type);
    const conditionType = Number(type);
    if (conditionType === FilterConditionType.RecommendTime) {
      const filter = new ConditionBuilder(condition)
        .setValue(RECOMMEND_TIME.TODAY)
        .asRecommendTime();
      onConditionChange?.(filter);
    } else if (conditionType === FilterConditionType.RangeTime) {
      const filterRow = new ConditionBuilder(condition)
        .setValue([
          formatTime(moment(), TIME_FORMATTER),
          formatTime(moment(), TIME_FORMATTER),
        ])
        .asRangeTime();
      onConditionChange?.(filterRow);
    }
  };

  return (
    <StyledDateConditionConfiguration
      activeKey={type}
      onChange={clearFilterWhenTypeChange}
      destroyInactiveTabPane={true}
    >
      <Tabs.TabPane
        tab={t('recommend')}
        key={FilterConditionType.RecommendTime}
      >
        <TimeSelector.RecommendRangeTimeSelector
          i18nPrefix={i18nPrefix}
          condition={condition}
          onConditionChange={onConditionChange}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t('manual')} key={FilterConditionType.RangeTime}>
        <TimeSelector.MannualRangeTimeSelector
          i18nPrefix={i18nPrefix}
          condition={condition}
          onConditionChange={onConditionChange}
        />
      </Tabs.TabPane>
    </StyledDateConditionConfiguration>
  );
});

export default DateConditionConfiguration;

const StyledDateConditionConfiguration = styled(Tabs)`
  width: 100%;
  padding: 0 !important;

  .ant-tabs-content-holder {
    margin: 10px 0;
  }
`;
