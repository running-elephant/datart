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
import { TimeFilterSubType } from 'app/types/FilterControlPanel';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
import ChartFilterCondition from '../../../../../models/ChartFilterCondition';
import TimeSelector from '../../ChartTimeSelector';

const DateConditionConfiguration: FC<
  {
    condition?: ChartFilterCondition;
    onChange: (confconditionig: ChartFilterCondition) => void;
  } & I18NComponentProps
> = memo(({ i18nPrefix, condition, onChange: onConditionChange }) => {
  const t = useI18NPrefix(i18nPrefix);
  const [subType, setSubType] = useState(
    () => condition?.subType || TimeFilterSubType.Recommend,
  );

  const handleConditionChanged = filter => {
    onConditionChange?.(Object.assign(filter, { subType }));
  };

  return (
    <StyledDateConditionConfiguration activeKey={subType} onChange={setSubType}>
      <Tabs.TabPane tab={t('recommend')} key={TimeFilterSubType.Recommend}>
        <TimeSelector.RecommendRangeTimeSelector
          i18nPrefix={i18nPrefix}
          condition={condition}
          onConditionChange={handleConditionChanged}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t('manual')} key={TimeFilterSubType.Manual}>
        <TimeSelector.MannualRangeTimeSelector
          i18nPrefix={i18nPrefix}
          condition={condition}
          onFilterChange={handleConditionChanged}
        />
      </Tabs.TabPane>
    </StyledDateConditionConfiguration>
  );
});

export default DateConditionConfiguration;

const StyledDateConditionConfiguration = styled(Tabs)`
  width: 100%;

  .ant-tabs-content-holder {
    margin: 10px 0;
  }
`;
