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
import { Form, Select } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, { FC, memo } from 'react';

const { Option } = Select;

export const ControllerGroupSet: FC<{}> = memo(() => {
  const t = useI18NPrefix(`viz.board.setting`);
  return (
    <>
      <Form.Item
        label={t('controllerGroupPosition')}
        name={['specialContainerConfig', 'controllerGroup', 'position']}
      >
        <Select>
          <Option value="top">{t('fixedToTop')}</Option>
          <Option value="bottom">{t('fixedToBottom')}</Option>
          {/* <Option value="left">左</Option>
          <Option value="right">右</Option> */}
        </Select>
      </Form.Item>
    </>
  );
});

export default ControllerGroupSet;
