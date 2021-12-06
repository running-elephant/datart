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
import { Checkbox, Form } from 'antd';
import React, { FC } from 'react';
import NumberSet from './BasicSet/NumberSet';
export const AutoUpdateSet: FC = () => {
  return (
    <>
      <Form.Item valuePropName="checked" name="autoUpdate">
        <Checkbox>定时同步数据</Checkbox>
      </Form.Item>
      <Form.Item preserve name="frequency">
        <NumberSet label={'定时同步频率(秒)'} name={'frequency'} />
      </Form.Item>
    </>
  );
};

export default AutoUpdateSet;
