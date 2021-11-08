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

import { Checkbox, Col, Row } from 'antd';
import { FormItemEx } from 'app/components/From';
import { ReactColorPicker } from 'app/components/ReactColorPicker';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataSectionField } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import { updateBy } from 'app/utils/mutation';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';

const ColorizeRangeAction: FC<{
  config: ChartDataSectionField;
  dataset?: ChartDataset;
  onConfigChange: (
    config: ChartDataSectionField,
    needRefresh?: boolean,
  ) => void;
}> = memo(({ config, onConfigChange }) => {
  const actionNeedNewRequest = false;
  const t = useI18NPrefix(`viz.palette.data.actions`);

  const [colorRange, setColorRange] = useState<{
    start?: string;
    end?: string;
  }>(config?.color!);

  const handleColorRangeChange = (start?, end?) => {
    const newConfig = updateBy(config, draft => {
      if (!start && !end) {
        delete draft.color;
      } else {
        draft.color = { start, end };
      }
    });
    setColorRange(newConfig?.color!);
    onConfigChange?.(newConfig, actionNeedNewRequest);
  };

  const hanldeEnableColorChecked = checked => {
    if (Boolean(checked)) {
      handleColorRangeChange('#7567bd', '#7567bd');
    } else {
      handleColorRangeChange();
    }
  };

  return (
    <StyledColorizeRangeAction>
      <Col span={24}>
        <Checkbox
          checked={!!colorRange?.start || !!colorRange?.end}
          onChange={e => hanldeEnableColorChecked(e.target?.checked)}
        >
          {t('color.enable')}
        </Checkbox>
      </Col>
      <Col span={12}>
        <Row align="middle">
          <FormItemEx
            label={t('color.start')}
            name="StartColor"
            rules={[{ required: true }]}
            initialValue={colorRange?.start}
          >
            <ReactColorPicker
              value={colorRange?.start}
              onChange={v => {
                handleColorRangeChange(v, colorRange?.end);
              }}
            />
          </FormItemEx>
        </Row>
      </Col>
      <Col span={12}>
        <Row align="middle">
          <FormItemEx
            label={t('color.end')}
            name="EndColor"
            rules={[{ required: true }]}
            initialValue={colorRange?.end}
          >
            <ReactColorPicker
              value={colorRange?.end}
              onChange={v => {
                handleColorRangeChange(colorRange?.start, v);
              }}
            />
          </FormItemEx>
        </Row>
      </Col>
    </StyledColorizeRangeAction>
  );
});

export default ColorizeRangeAction;

const StyledColorizeRangeAction = styled(Row)`
  justify-content: center;
`;
