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

import { Button, Input, Space } from 'antd';
import { FC, memo } from 'react';

const JumpToUrl: FC<{
  translate?: (title: string, disablePrefix?: boolean, options?: any) => string;
}> = memo(({ translate: t = title => title }) => {
  return (
    <Space>
      <Input />
      <Button type="link">{t('drillThrough.rule.relation.setting')}</Button>
    </Space>
  );
});

export default JumpToUrl;
