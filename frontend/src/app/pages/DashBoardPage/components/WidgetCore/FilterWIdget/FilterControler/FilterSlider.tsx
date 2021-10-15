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
import { Slider } from 'antd';
import React, { memo, useCallback, useState } from 'react';
export interface FilterSliderProps {
  value?: any[];
  onValuesChange: (values) => void;
  minValue: number;
  maxValue: number;
}

export const FilterSlider: React.FC<FilterSliderProps> = memo(
  ({ value, onValuesChange, minValue, maxValue }) => {
    const [valueRange, setValueRange] = useState(() => {
      if (Array.isArray(value)) {
        return value as [number, number];
      } else {
        return [1, 9] as [number, number];
      }
    });

    const onSelectChange = useCallback(
      values => {
        setValueRange(values);
        onValuesChange(values);
      },
      [onValuesChange],
    );

    return (
      <Slider
        range
        value={valueRange}
        onChange={onSelectChange}
        min={minValue}
        max={maxValue}
      />
    );
  },
);
