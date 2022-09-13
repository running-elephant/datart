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

import { CheckOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import {
  AdvanceCalcFieldActionType,
  DataViewFieldType,
  DateLevelTypes,
} from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataSectionField } from 'app/types/ChartConfig';
import { ChartDataViewMeta } from 'app/types/ChartDataViewMeta';
import { updateBy } from 'app/utils/mutation';
import { FC, useState } from 'react';

const AdvanceCalcAction: FC<{
  uid?: string;
  config: ChartDataSectionField;
  onConfigChange: (
    config: ChartDataSectionField,
    needRefresh?: boolean,
  ) => void;
  onOpenModal?;
  metas?: ChartDataViewMeta[];
  availableSourceFunctions?: string[];
}> = ({
  uid,
  config,
  onConfigChange,
  onOpenModal,
  metas,
  availableSourceFunctions,
  ...rest
}) => {
  const t = useI18NPrefix(`viz.common.enum.advanceCalc`);

  const actionNeedNewRequest = true;
  const [calc, setCalc] = useState(config?.calc);

  const items: AdvanceCalcFieldActionType[] = [];

  // 同环比需要数据视图包含日期维度且支持日期聚合才能计算
  if (
    metas &&
    metas.filter(meta => meta.type === DataViewFieldType.DATE).length > 0 &&
    availableSourceFunctions &&
    availableSourceFunctions.filter(f => DateLevelTypes.includes(f)).length > 0
  ) {
    items.push(AdvanceCalcFieldActionType.Ratio);
  }

  return (
    <>
      <Menu.Item
        key={AdvanceCalcFieldActionType.None}
        eventKey={AdvanceCalcFieldActionType.None}
        icon={!calc ? <CheckOutlined /> : ''}
        onClick={() => {
          const newConfig = updateBy(config, draft => {
            draft.calc = undefined;
          });
          setCalc(undefined);
          onConfigChange?.(newConfig, actionNeedNewRequest);
        }}
      >
        {t(AdvanceCalcFieldActionType.None)}
      </Menu.Item>
      {items.map(agg => {
        return (
          <Menu.Item
            key={agg}
            eventKey={agg}
            icon={calc?.type === agg ? <CheckOutlined /> : ''}
            onClick={() => onOpenModal(uid)(agg)}
          >
            {t(agg)}
          </Menu.Item>
        );
      })}
    </>
  );
};

export default AdvanceCalcAction;
