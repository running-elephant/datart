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

import { Form } from 'antd';
import {
  BasicFont,
  BasicInput,
  BasicInputNumber,
} from 'app/components/FormGenerator/Basic';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { MediaWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { TIME_FORMATTER } from 'globalConstants';
import produce from 'immer';
import moment from 'moment';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { G90 } from 'styles/StyleConstants';
import { WidgetActionContext } from '../../ActionProvider/WidgetActionProvider';
import { WidgetInfoContext } from '../../WidgetProvider/WidgetInfoProvider';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';

const FONT_DATA = {
  comType: 'font',
  default: {
    fontFamily: 'PingFang SC',
    fontSize: '18',
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: G90,
  },
  disabled: undefined,
  key: 'font',
  label: '字体',
};
const FORMAT_DATA = {
  comType: 'input',
  default: TIME_FORMATTER,
  disabled: undefined,
  key: 'timeFormat',
  label: '格式',
};
const DURATION_DATA = {
  comType: 'inputNumber',
  default: 1000,
  disabled: undefined,
  key: 'timeDuration',
  label: '时间间隔',
};
export type TimerConfig = NonNullable<MediaWidgetContent['timerConfig']>;
export const TimerWidgetCore: React.FC = memo(() => {
  const widget = useContext(WidgetContext);

  const { editing } = useContext(WidgetInfoContext);
  const { onWidgetUpdate } = useContext(WidgetActionContext);
  const [form] = Form.useForm();
  const preTimerConfig = (widget.config.content as MediaWidgetContent)
    .timerConfig;
  const [timerConfig, setTimerConfig] = useState<TimerConfig>(
    {} as TimerConfig,
  );

  const [currentTime, setCurrentTime] = useState(
    moment().format(timerConfig?.time?.timeFormat || TIME_FORMATTER),
  );

  const t = useI18NPrefix();

  useEffect(() => {
    const timerConfig: TimerConfig = {
      time: preTimerConfig?.time || {
        timeFormat: FORMAT_DATA.default,
        timeDuration: DURATION_DATA.default,
      },
      font: preTimerConfig?.font || FONT_DATA.default,
    };
    setTimerConfig(timerConfig);
    form.setFieldsValue({ ...timerConfig });
  }, [form, preTimerConfig]);

  const fontData = useMemo(() => {
    const data = { ...FONT_DATA, value: timerConfig.font };
    return data;
  }, [timerConfig.font]);
  const formatData = useMemo(() => {
    const data = { ...FORMAT_DATA, value: timerConfig?.time?.timeFormat };
    return data;
  }, [timerConfig?.time?.timeFormat]);
  const durationData = useMemo(() => {
    const data = { ...DURATION_DATA, value: timerConfig?.time?.timeDuration };
    return data;
  }, [timerConfig?.time?.timeDuration]);
  const onFontChange = (ancestors, data, needRefresh) => {
    const font = { ...timerConfig.font, ...data.value };
    const newTimerConfig = { ...timerConfig, font: font };
    const nextWidget = produce(widget, draft => {
      (draft.config.content as MediaWidgetContent).timerConfig = newTimerConfig;
    });
    onWidgetUpdate(nextWidget);
  };

  const onTimeChange = (ancestors, data, needRefresh) => {
    const time = { ...timerConfig.time, ...data };
    const newTimerConfig = { ...timerConfig, time: time };
    const nextWidget = produce(widget, draft => {
      (draft.config.content as MediaWidgetContent).timerConfig = newTimerConfig;
    });
    onWidgetUpdate(nextWidget);
  };
  const onFormatChange = (ancestors, data) => {
    onTimeChange([], { timeFormat: data }, false);
  };
  const onDurationChange = (ancestors, data) => {
    onTimeChange([], { timeDuration: data }, false);
  };
  const setter = (
    <div className="wrap-form">
      <BasicInput
        ancestors={[0, 0]}
        data={formatData}
        onChange={onFormatChange}
      />
      <BasicInputNumber
        ancestors={[0, 0]}
        data={durationData}
        onChange={onDurationChange}
      />
      <BasicFont
        translate={t}
        ancestors={[0, 0]}
        data={fontData}
        onChange={onFontChange}
      />
    </div>
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format(timerConfig?.time?.timeFormat));
    }, timerConfig?.time?.timeDuration);
    return () => {
      clearInterval(timer);
    };
  }, [timerConfig]);

  return (
    <Wrap {...timerConfig}>
      {editing && setter}
      <div className="time-text">{currentTime}</div>
    </Wrap>
  );
});

const Wrap = styled.div<TimerConfig>`
  display: flex;
  /* flex-direction: column; */
  width: 100%;
  overflow-y: hidden;
  .time-text {
    flex: 1;
    font-family: ${p => p.font?.fontFamily};
    font-size: ${p => p.font?.fontSize}px;
    font-style: ${p => p.font?.fontStyle};
    font-weight: ${p => p.font?.fontWeight};
    color: ${p => p.font?.color};
  }
  .wrap-form {
    width: 340px;
    padding: 4px;
    margin-bottom: 4px;
    overflow-y: auto;
    background-color: ${p => p.theme.bodyBackground};
  }
`;
