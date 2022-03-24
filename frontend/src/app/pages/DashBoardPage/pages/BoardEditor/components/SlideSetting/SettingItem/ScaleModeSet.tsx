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
import { ScaleModeType, SCALE_MODES } from 'app/pages/DashBoardPage/constants';
import React, { FC, memo } from 'react';
export const ScaleModeSet: FC<{
  scaleMode: ScaleModeType;
}> = memo(({ scaleMode }) => {
  const t = useI18NPrefix(`viz.board.setting`);
  const tScale = useI18NPrefix(`viz.scaleMode`);
  return (
    <Form.Item label={t('scaleMode')} name="scaleMode">
      <Select className="datart-ant-select">
        {SCALE_MODES.map(item => (
          <Select.Option key={item} value={item}>
            {tScale(item)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
});

export default ScaleModeSet;
