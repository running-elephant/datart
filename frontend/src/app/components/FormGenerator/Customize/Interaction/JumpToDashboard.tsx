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

import { Button, Col, Select } from 'antd';
import { FC, memo } from 'react';

const JumpToDashboard: FC<{
  translate?: (title: string, disablePrefix?: boolean, options?: any) => string;
}> = memo(({ translate: t = title => title }) => {
  return (
    <>
      <Col>
        <Select
          placeholder={t('drillThrough.rule.reference.title')}
          // onChange={handleChange}
        >
          <Select.Option value="table-1">Table A</Select.Option>
          <Select.Option value="table-2">Table B</Select.Option>
        </Select>
      </Col>
      <Col>
        <Button type="link">{t('drillThrough.rule.relation.setting')}</Button>
      </Col>
    </>
  );
});

export default JumpToDashboard;
