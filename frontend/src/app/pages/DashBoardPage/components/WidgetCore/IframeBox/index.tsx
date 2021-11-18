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
import { BoardActionContext } from 'app/pages/DashBoardPage/contexts/BoardActionContext';
import { WidgetContext } from 'app/pages/DashBoardPage/contexts/WidgetContext';
import { WidgetInfoContext } from 'app/pages/DashBoardPage/contexts/WidgetInfoContext';
import { editWidgetInfoActions } from 'app/pages/DashBoardPage/pages/BoardEditor/slice';
import produce from 'immer';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { G20 } from 'styles/StyleConstants';
import { MediaWidgetContent } from '../../../pages/Board/slice/types';

const IframeWidget: React.FC<{}> = () => {
  const widget = useContext(WidgetContext);
  const dispatch = useDispatch();
  const { editing } = useContext(WidgetInfoContext);
  const { widgetUpdate } = useContext(BoardActionContext);
  const src = (widget.config.content as MediaWidgetContent).iframeConfig?.src;
  const [curSrc, setCurSrc] = useState<string | undefined>('');
  useEffect(() => {
    setCurSrc(src);
  }, [src]);

  const onFinish = () => {
    const nextWidget = produce(widget, draft => {
      (draft.config.content as MediaWidgetContent).iframeConfig = {
        src: curSrc,
      };
    });
    dispatch(editWidgetInfoActions.closeWidgetEditing(widget.id));
    widgetUpdate(nextWidget);
  };
  const setter = (
    <div className="wrap-form">
      <Form
        initialValues={{ videoSrc: src }}
        onFinish={onFinish}
        layout="inline"
        autoComplete="off"
      >
        <Form.Item
          label="网址"
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
    <Wrap>
      {editing && setter}
      <iframe
        title=" "
        src={curSrc}
        frameBorder="0"
        allow="autoplay"
        style={{ width: '100%', height: '100%' }}
      />
    </Wrap>
  );
};
export default IframeWidget;
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .wrap-form {
    padding: 4px;
    margin-bottom: 4px;
    background-color: ${G20};
  }
`;
