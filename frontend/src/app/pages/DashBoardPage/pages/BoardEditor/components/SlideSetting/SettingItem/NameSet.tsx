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
import BasicFont from 'app/components/FormGenerator/Basic/BasicFont';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { WIDGET_TITLE_ALIGN_OPTIONS } from 'app/pages/DashBoardPage/constants';
import { WidgetNameConfig } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { fontDefault } from 'app/pages/DashBoardPage/utils/widget';
import React, { FC, memo, useMemo } from 'react';
import SelectSet from './BasicSet/SelectSet';

const FONT_DATA = {
  comType: 'font',
  default: fontDefault,
  disabled: undefined,
  key: 'font',
  label: '字体',
};

export const NameSet: FC<{
  config: WidgetNameConfig;
}> = memo(({ config }) => {
  const t = useI18NPrefix(`viz.board.setting`);
  const fontData = useMemo(() => {
    const data = {
      ...FONT_DATA,
      value: config,
    };
    return data;
  }, [config]);

  const normFontData = (ancestors, data) => {
    const nameConfig = { ...config, ...data.value };
    return nameConfig;
  };

  return (
    <>
      <Form.Item preserve name="name">
        <Input className="datart-ant-input" placeholder="fill a name" />
      </Form.Item>
      <Form.Item valuePropName="checked" name={['nameConfig', 'show']}>
        <Checkbox>{t('showTitle')} </Checkbox>
      </Form.Item>
      <Form.Item label={t('align')}>
        <SelectSet
          name={['nameConfig', 'textAlign']}
          options={WIDGET_TITLE_ALIGN_OPTIONS}
          value={config.textAlign}
          defaultValue="left"
        />
      </Form.Item>
      <Form.Item
        getValueFromEvent={normFontData}
        label=""
        name={['nameConfig']}
        preserve
      >
        <BasicFont translate={t} ancestors={[]} data={fontData} />
      </Form.Item>
    </>
  );
});

export default NameSet;
