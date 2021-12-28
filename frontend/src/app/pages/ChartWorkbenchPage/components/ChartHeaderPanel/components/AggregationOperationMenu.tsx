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

import { Menu, Modal, Switch } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, memo, useMemo } from 'react';

const AggregationOperationMenu: FC<{
  defaultValue?: boolean;
  onChangeAggregation: (value: boolean) => void;
}> = memo(({ defaultValue = true, onChangeAggregation }) => {
  const checkedValue = useMemo(() => defaultValue, [defaultValue]);
  const t = useI18NPrefix(`viz.workbench.header`);

  const onChange = value => {
    Modal.confirm({
      icon: <></>,
      content: t('aggregationSwitchTip'),
      okText: checkedValue ? t('close') : t('open'),
      // cancelText: t('close'),
      onOk() {
        onChangeAggregation(value);
      },
    });
  };
  return (
    <Menu selectedKeys={[]}>
      <Menu.Item key={0}>
        {t('aggregationSwitch')}{' '}
        <Switch checked={checkedValue} onChange={onChange} />
      </Menu.Item>
    </Menu>
  );
});

export default AggregationOperationMenu;
