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

import { InputNumber, Select, Space } from 'antd';
import useI18NPrefix, { I18NComponentProps } from 'app/hooks/useI18NPrefix';
import { getTime } from 'app/utils/time';
import { TIME_DIRECTION, TIME_UNIT_OPTIONS } from 'globalConstants';
import { unitOfTime } from 'moment';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';
const RelativeTimeSelector: FC<
  {
    isStart?: boolean;
    onChange: (time) => void;
  } & I18NComponentProps
> = memo(({ isStart, i18nPrefix, onChange }) => {
  const t = useI18NPrefix(i18nPrefix);
  const [amount, setAmount] = useState(0);
  const [unit, setUnit] = useState<unitOfTime.DurationConstructor>('d');
  const [direction, setDirection] = useState('-');

  const handleTimeChange = (
    unit: unitOfTime.DurationConstructor,
    amount: number,
    direction: string,
  ) => {
    const time = getTime(+(direction + amount), unit)(unit, isStart);
    onChange?.(time);
  };

  const handleUnitChange = (newUnit: unitOfTime.DurationConstructor) => {
    setUnit(newUnit);
    handleTimeChange(newUnit, amount, direction);
  };

  const handleAmountChange = newAmount => {
    setAmount(newAmount);
    handleTimeChange(unit, newAmount, direction);
  };

  const handleDirecitonChange = newDirection => {
    setDirection(newDirection);
    handleTimeChange(unit, amount, newDirection);
  };

  return (
    <StyledReativeTimeSelector>
      <InputNumber
        defaultValue={amount}
        step={1}
        min={0}
        onChange={handleAmountChange}
      />
      <Select defaultValue={unit} onChange={handleUnitChange}>
        {TIME_UNIT_OPTIONS.map(item => (
          <Select.Option value={item.value}>{t(item.name)}</Select.Option>
        ))}
      </Select>
      <Select defaultValue={direction} onChange={handleDirecitonChange}>
        {TIME_DIRECTION.map(item => (
          <Select.Option value={item.value}>{t(item.name)}</Select.Option>
        ))}
      </Select>
    </StyledReativeTimeSelector>
  );
});

export default RelativeTimeSelector;

const StyledReativeTimeSelector = styled(Space)`
  & .ant-select,
  .ant-input-number {
    max-width: 80px;
  }
`;
