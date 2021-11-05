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
import { ReactColorPicker } from 'app/components/ReactColorPicker';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { ChartDataSectionField } from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import ChartDataset from 'app/pages/ChartWorkbenchPage/models/ChartDataset';
import { updateBy } from 'app/utils/mutation';
import { FC, memo, useState } from 'react';
import styled from 'styled-components/macro';

const ColorizeSingleAction: FC<{
  config: ChartDataSectionField;
  dataset?: ChartDataset;
  onConfigChange: (
    config: ChartDataSectionField,
    needRefresh?: boolean,
  ) => void;
}> = memo(({ config, onConfigChange }) => {
  const actionNeedNewRequest = false;
  const t = useI18NPrefix(`viz.palette.data.actions`);

  const [colorRange, setColorRange] = useState<
    | {
        start?: string;
      }
    | undefined
  >(config?.color!);

  const handleColorChange = (newColorValue?: string) => {
    const newConfig = updateBy(config, draft => {
      if (!newColorValue) {
        delete draft.color;
      } else {
        draft.color = { start: newColorValue };
      }
    });
    setColorRange(newConfig?.color);
    onConfigChange?.(newConfig, actionNeedNewRequest);
  };

  const hanldeEnableColorChecked = checked => {
    if (Boolean(checked)) {
      handleColorChange('#7567bd');
    } else {
      handleColorChange();
    }
  };

  return (
    <StyledColorizeRangeAction>
      <Col span={12}>
        <Row>
          <Checkbox
            checked={!!colorRange?.start}
            onChange={e => hanldeEnableColorChecked(e.target?.checked)}
          >
            {t('color.enable')}
          </Checkbox>
        </Row>
        <Row align="middle">
          <ReactColorPicker
            value={colorRange?.start}
            onChange={v => handleColorChange(v)}
          />
        </Row>
      </Col>
    </StyledColorizeRangeAction>
  );
});

export default ColorizeSingleAction;

const StyledColorizeRangeAction = styled(Row)`
  justify-content: center;

  & .sketch-picker {
    padding: 0 !important;
    border: none;
    box-shadow: none !important;
  }
`;
