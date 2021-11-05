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

import { Input } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataSectionField } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { updateBy } from 'app/utils/mutation';
import { FC, useState } from 'react';

const AliasAction: FC<{
  config: ChartDataSectionField;
  onConfigChange: (config: ChartDataSectionField) => void;
}> = ({ config, onConfigChange }) => {
  const t = useI18NPrefix(`viz.palette.data.actions`);
  const [aliasName, setAliasName] = useState(config?.alias?.name);
  const [nameDesc, setNameDesc] = useState(config?.alias?.desc);

  const onChange = (alias, desc) => {
    const newConfig = updateBy(config, draft => {
      draft.alias = { name: alias, desc: desc };
    });
    setAliasName(alias);
    setNameDesc(desc);
    onConfigChange?.(newConfig);
  };

  return (
    <div>
      {t('alias.name')}
      <Input
        value={aliasName}
        onChange={({ target: { value } }) => {
          onChange(value, nameDesc);
        }}
      />
      {t('alias.description')}
      <Input
        value={nameDesc}
        onChange={({ target: { value } }) => {
          onChange(aliasName, value);
        }}
      />
    </div>
  );
};

export default AliasAction;
