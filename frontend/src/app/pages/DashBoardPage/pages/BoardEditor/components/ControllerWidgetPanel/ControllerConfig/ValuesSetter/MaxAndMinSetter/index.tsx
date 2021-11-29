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
import { FormItemProps } from 'antd';
import React, { memo } from 'react';
import { NumberSetForm } from '../NumberSetter/NumberSetFrom';
import { MaxValueName, MinValueName } from '../ValuesSetter';

export interface NumberSetterProps {}
export const MaxValueSetter: React.FC<NumberSetterProps> = memo(() => {
  const itemProps: FormItemProps<any> = {
    preserve: true,
    name: MaxValueName,
    label: '最大值',
    required: true,
  };
  return <NumberSetForm {...itemProps} />;
});
export const MinValueSetter: React.FC<NumberSetterProps> = memo(() => {
  const itemProps: FormItemProps<any> = {
    preserve: true,
    name: MinValueName,
    label: '最小值',
    required: true,
  };
  return <NumberSetForm {...itemProps} />;
});

export const MaxAndMinSetter: React.FC<NumberSetterProps> = memo(() => {
  return (
    <>
      <MaxValueSetter />
      <MinValueSetter />
    </>
  );
});
