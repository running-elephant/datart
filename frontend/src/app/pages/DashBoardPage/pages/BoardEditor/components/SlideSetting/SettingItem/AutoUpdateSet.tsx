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
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, { FC } from 'react';
import NumberSet from './BasicSet/NumberSet';
export const AutoUpdateSet: FC = () => {
  const t = useI18NPrefix(`viz.board.setting`);
  return (
    <>
      <Form.Item valuePropName="checked" name="autoUpdate">
        <Checkbox>{t('openAutoUpdate')}</Checkbox>
      </Form.Item>
      <Form.Item preserve name="frequency">
        <NumberSet label={t('frequency')} name={'frequency'} />
      </Form.Item>
    </>
  );
};

export default AutoUpdateSet;
