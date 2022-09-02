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
import { Menu, Radio, Space } from 'antd';
import {
  AdvanceCalcFieldActionType,
  AdvanceCalcFieldSubAggregateType,
  ChartDataSectionFieldActionType,
  ChartDataSectionType,
  DataViewFieldType,
} from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataSectionField } from 'app/types/ChartConfig';
import { updateBy } from 'app/utils/mutation';
import { FC, useContext, useState } from 'react';
import ChartPaletteContext from '../../../../contexts/ChartPaletteContext';

const AdvanceCalcAction: FC<{
  config: ChartDataSectionField;
  onConfigChange: (
    config: ChartDataSectionField,
    needRefresh?: boolean,
  ) => void;
  mode?: 'menu';
}> = ({ config, onConfigChange, mode, ...rest }) => {
  const t = useI18NPrefix(`viz.common.enum.advanceCalc`);

  const { datas } = useContext(ChartPaletteContext);
  const actionNeedNewRequest = true;
  const [calc, setCalc] = useState(config?.calc);

  const onChange = selectedValue => {
    selectedValue = selectedValue === 'NONE' ? undefined : selectedValue;
    const newConfig = updateBy(config, draft => {
      draft.calc = selectedValue;
    });
    setCalc(selectedValue);
    onConfigChange?.(newConfig, actionNeedNewRequest);
  };

  let items =
    AdvanceCalcFieldSubAggregateType[
      ChartDataSectionFieldActionType.AdvanceCalc
    ] || [];

  // 同环比需要日期维度才能计算
  if (
    datas &&
    datas
      .filter(
        c =>
          c.type === ChartDataSectionType.Group ||
          c.type === ChartDataSectionType.Mixed,
      )
      .filter(
        c => c.rows?.findIndex(s => s.type === DataViewFieldType.DATE) !== -1,
      ).length === 0
  ) {
    items = items.filter(
      t =>
        ![
          AdvanceCalcFieldActionType.Ratio_Year,
          AdvanceCalcFieldActionType.Ratio_Last,
        ].includes(t),
    );
  }

  const renderOptions = mode => {
    if (mode === 'menu') {
      return (
        <>
          {items.map(agg => {
            return (
              <Menu.Item
                key={agg}
                eventKey={agg}
                icon={calc === agg ? <CheckOutlined /> : ''}
                onClick={() => onChange(agg)}
              >
                {t(agg)}
              </Menu.Item>
            );
          })}
        </>
      );
    }

    return (
      <Radio.Group onChange={e => onChange(e.target?.value)} value={calc}>
        <Space direction="vertical">
          {items.map(agg => {
            return (
              <Radio key={agg} value={agg}>
                {t(agg)}
              </Radio>
            );
          })}
        </Space>
      </Radio.Group>
    );
  };

  return renderOptions(mode);
};

export default AdvanceCalcAction;
