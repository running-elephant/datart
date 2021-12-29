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
import { Form } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BackgroundConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import React, { FC, memo } from 'react';
import ColorSet from './BasicSet/ColorSet';
import { ImageUpload } from './BasicSet/ImageUpload';
export const BackgroundSet: FC<{
  background: BackgroundConfig;
}> = memo(({ background }) => {
  const t = useI18NPrefix(`viz.board.setting`);
  return (
    <>
      <Form.Item label={t('color')}>
        <ColorSet filedName={'backgroundColor'} filedValue={background.color} />
      </Form.Item>
      <ImageUpload
        filedName={'backgroundImage'}
        value={background.image as string}
        label={t('image')}
        placeholder={t('uploadTip')}
      />
    </>
  );
});

export default BackgroundSet;
