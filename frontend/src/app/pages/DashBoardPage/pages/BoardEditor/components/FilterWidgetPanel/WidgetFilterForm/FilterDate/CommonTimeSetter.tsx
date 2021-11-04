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

import { Form, Radio, Space } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { RECOMMEND_TIME } from 'globalConstants';
import { NamePath } from 'rc-field-form/lib/interface';
import { FC, memo } from 'react';

const CommonTimeSetter: FC<{ name: NamePath }> = memo(({ name }) => {
  const t = useI18NPrefix('viz.common.filter.date');
  return (
    <Form.Item
      noStyle
      name={name}
      validateTrigger={['onChange', 'onBlur']}
      rules={[{ required: true }]}
    >
      <Radio.Group>
        <Space direction="vertical">
          <Radio value={RECOMMEND_TIME.TODAY}>{t(RECOMMEND_TIME.TODAY)}</Radio>
          <Radio value={RECOMMEND_TIME.YESTERDAY}>
            {t(RECOMMEND_TIME.YESTERDAY)}
          </Radio>
          <Radio value={RECOMMEND_TIME.THISWEEK}>
            {t(RECOMMEND_TIME.THISWEEK)}
          </Radio>
        </Space>
        <Space direction="vertical">
          <Radio value={RECOMMEND_TIME.LAST_7_DAYS}>
            {t(RECOMMEND_TIME.LAST_7_DAYS)}
          </Radio>
          <Radio value={RECOMMEND_TIME.LAST_30_DAYS}>
            {t(RECOMMEND_TIME.LAST_30_DAYS)}
          </Radio>
          <Radio value={RECOMMEND_TIME.LAST_90_DAYS}>
            {t(RECOMMEND_TIME.LAST_90_DAYS)}
          </Radio>
        </Space>
        <Space direction="vertical">
          <Radio value={RECOMMEND_TIME.LAST_1_MONTH}>
            {t(RECOMMEND_TIME.LAST_1_MONTH)}
          </Radio>
          <Radio value={RECOMMEND_TIME.LAST_1_YEAR}>
            {t(RECOMMEND_TIME.LAST_1_YEAR)}
          </Radio>
        </Space>
      </Radio.Group>
    </Form.Item>
  );
});

export default CommonTimeSetter;
