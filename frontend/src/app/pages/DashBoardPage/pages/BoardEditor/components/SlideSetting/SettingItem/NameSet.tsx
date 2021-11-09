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
import { Checkbox, Form, Input } from 'antd';
import { WidgetNameConfig } from 'app/pages/DashBoardPage/pages/Dashboard/slice/types';
import React, { FC, memo } from 'react';
import ColorSet from './BasicSet/ColorSet';
export const NameSet: FC<{
  config: WidgetNameConfig;
}> = memo(({ config }) => {
  return (
    <>
      <Form.Item label="名称" preserve name="name">
        <Input placeholder="fill a name" />
      </Form.Item>
      <Form.Item valuePropName="checked" name={['nameConfig', 'show']}>
        <Checkbox>显示标题</Checkbox>
      </Form.Item>
      <Form.Item label="标题颜色">
        <ColorSet
          filedName={['nameConfig', 'color']}
          filedValue={config.color}
        />
      </Form.Item>
    </>
  );
});

export default NameSet;
