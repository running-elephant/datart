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

import { Collapse } from 'antd';
import { GroupLayout } from 'app/components';
import { GroupLayoutMode } from 'app/components/FormGenerator/types';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import {
  ChartDataSectionConfig,
  ChartStyleSectionConfig,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { FC, memo } from 'react';

const ChartSettingConfigPanel: FC<{
  configs?: ChartStyleSectionConfig[];
  dataConfigs?: ChartDataSectionConfig[];
  onChange: (
    ancestors: number[],
    config: ChartStyleSectionConfig,
    needRefresh?: boolean,
  ) => void;
}> = memo(
  ({ configs, dataConfigs, onChange }) => {
    const t = useI18NPrefix(`viz.palette.setting`);

    return (
      <Collapse className="datart-config-panel" ghost>
        {configs?.map((c, index) => (
          <Collapse.Panel header={t(c.label)} key={c.key}>
            <GroupLayout
              ancestors={[index]}
              mode={
                c.comType === 'group'
                  ? GroupLayoutMode.INNER
                  : GroupLayoutMode.OUTTER
              }
              data={c}
              translate={t}
              dataConfigs={dataConfigs}
              onChange={onChange}
              flatten
            />
          </Collapse.Panel>
        ))}
      </Collapse>
    );
  },
  (prev, next) =>
    prev.configs === next.configs && prev.dataConfigs === next.dataConfigs,
);

export default ChartSettingConfigPanel;
