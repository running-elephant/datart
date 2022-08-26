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

import { Form, FormInstance, Radio, Tooltip } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ControllerWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { useCallback } from 'react';
import { ControllerConfig } from '../../../types';

export interface TreeTypeSetterProps {
  form: FormInstance<ControllerWidgetContent> | undefined;
}

function TreeTypeSetter({ form }: TreeTypeSetterProps) {
  const t = useI18NPrefix('viz.control');

  const getControllerConfig = useCallback(() => {
    return form?.getFieldValue('config') as ControllerConfig;
  }, [form]);

  const handleChangeFn = useCallback(() => {
    form?.setFieldsValue({
      config: {
        ...getControllerConfig,
        parentField: undefined,
        controllerValues: [],
        valueOptions: [],
        assistViewFields: [],
      },
    });
  }, [form, getControllerConfig]);

  return (
    <Form.Item
      shouldUpdate
      label={t('treeSelectType')}
      name={['config', 'treeType']}
    >
      <Radio.Group onChange={handleChangeFn}>
        <Tooltip title={t('treeControlTip')}>
          <Radio.Button value="treeControl">{t('treeControl')}</Radio.Button>
        </Tooltip>
        <Tooltip title={t('treeSelectTip')}>
          <Radio.Button value="treeSelect">{t('treeSelect')}</Radio.Button>
        </Tooltip>
      </Radio.Group>
    </Form.Item>
  );
}

export default TreeTypeSetter;
