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

import { Button, Form, Input } from 'antd';
import { MediaWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { editWidgetInfoActions } from 'app/pages/DashBoardPage/pages/BoardEditor/slice';
import produce from 'immer';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';
import { BoardActionContext } from '../../../BoardProvider/BoardActionProvider';
import { WidgetInfoContext } from '../../../WidgetProvider/WidgetInfoProvider';
import { WidgetContext } from '../../../WidgetProvider/WidgetProvider';

const VideoWidget: React.FC = () => {
  const widget = useContext(WidgetContext);
  const dispatch = useDispatch();
  const { editing } = useContext(WidgetInfoContext);
  const { widgetUpdate } = useContext(BoardActionContext);
  const src = (widget.config.content as MediaWidgetContent).videoConfig?.src;
  const [curSrc, setCurSrc] = useState<string | undefined>('');
  useEffect(() => {
    setCurSrc(src);
  }, [src]);
  let srcWithParams = curSrc;
  const onFinish = () => {
    const nextWidget = produce(widget, draft => {
      (draft.config.content as MediaWidgetContent).videoConfig = {
        src: curSrc,
      };
    });
    dispatch(editWidgetInfoActions.closeWidgetEditing(widget.id));
    widgetUpdate(nextWidget, true);
  };
  const setter = (
    <div className="wrap-form">
      <Form
        initialValues={{ videoSrc: src }}
        onFinish={onFinish}
        layout="inline"
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="视频地址"
          name="videoSrc"
          rules={[{ required: true, message: 'input video URL' }]}
        >
          <Input onChange={e => setCurSrc(e.target.value)} value={curSrc} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
  return (
    <WrapVideo className="WrapVideo">
      {editing && setter}

      <Player>
        <source src={srcWithParams} />
      </Player>
    </WrapVideo>
  );
};

export default VideoWidget;
const WrapVideo = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .wrap-form {
    padding: 6px;
    margin-bottom: 4px;
    background-color: ${p => p.theme.emphasisBackground};
  }
`;
