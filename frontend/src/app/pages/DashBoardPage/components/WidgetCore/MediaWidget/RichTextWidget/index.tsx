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
import { Tooltip } from 'antd';
import {
  MediaWidgetContent,
  Widget,
  WidgetInfo,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { FONT_FAMILIES, FONT_SIZES } from 'globalConstants';
import { DeltaStatic } from 'quill';
import { ImageDrop } from 'quill-image-drop-module'; // 拖动加载图片组件。
import QuillMarkdown from 'quilljs-markdown';
import 'quilljs-markdown/dist/quilljs-markdown-common-style.css';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactQuill, { Quill } from 'react-quill';
// DeltaStatic
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { editBoardStackActions } from '../../../../pages/BoardEditor/slice';
import { MarkdownOptions } from './configs/MarkdownOptions';
import TagBlot from './configs/TagBlot';
import { Formats } from './Formats';

Quill.register('modules/imageDrop', ImageDrop);
Quill.register('formats/tag', TagBlot);

type RichTextWidgetProps = {
  widgetConfig: Widget;
  widgetInfo: WidgetInfo;
};
export const RichTextWidget: React.FC<RichTextWidgetProps> = ({
  widgetConfig,
  widgetInfo,
}) => {
  const dispatch = useDispatch();
  const initContent = useMemo(() => {
    return (widgetConfig.config.content as MediaWidgetContent).richTextConfig
      ?.content;
  }, [widgetConfig.config.content]);
  const [quillValue, setQuillValue] = useState<DeltaStatic | undefined>(
    initContent,
  );
  const [containerId, setContainerId] = useState<string>();
  const [quillModules, setQuillModules] = useState<any>(null);

  useEffect(() => {
    setQuillValue(initContent);
  }, [initContent]);

  useEffect(() => {
    if (widgetInfo.editing === false) {
      if (quillRef.current) {
        let contents = quillRef.current?.getEditor().getContents();
        const strContents = JSON.stringify(contents);
        if (strContents !== JSON.stringify(initContent)) {
          dispatch(
            editBoardStackActions.changeMediaWidgetConfig({
              id: widgetConfig.id,
              mediaWidgetConfig: {
                ...(widgetConfig.config.content as MediaWidgetContent),
                richTextConfig: {
                  content: JSON.parse(strContents),
                },
              },
            }),
          );
        }
      }
    }
  }, [
    dispatch,
    initContent,
    widgetConfig.config.content,
    widgetConfig.id,
    widgetInfo.editing,
  ]);

  useEffect(() => {
    const newId = `rich-text-${widgetInfo.id + new Date().getTime()}`;
    setContainerId(newId);
    const modules = {
      toolbar: {
        container: `#${newId}`,
      },
      imageDrop: true,
    };
    setQuillModules(modules);
  }, [widgetInfo.id]);

  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current) {
      new QuillMarkdown(quillRef.current.getEditor(), MarkdownOptions);
    }
  }, [quillModules]);

  const ssp = e => {
    e.stopPropagation();
  };

  const quillChange = useCallback(() => {
    if (quillRef.current && quillRef.current?.getEditor()) {
      let contents = quillRef.current!.getEditor().getContents();
      setQuillValue(contents);
    }
  }, []);

  const toolbar = useMemo(
    () => (
      <div id={containerId}>
        <span className="ql-formats">
          <select
            className="ql-font"
            key="ql-font"
            defaultValue={FONT_FAMILIES[0].value}
          >
            {FONT_FAMILIES.map(font => (
              <option value={font.value} key={font.name}>
                {font.name}
              </option>
            ))}
          </select>
          <select className="ql-size" key="ql-size" defaultValue="13px">
            {FONT_SIZES.map(size => (
              <option value={`${size}px`} key={size}>{`${size}px`}</option>
            ))}
          </select>
          <Tooltip title="加粗" key="ql-bold-tooltip">
            <button className="ql-bold" key="ql-bold" />
          </Tooltip>
          <Tooltip title="斜体" key="ql-italic-tooltip">
            <button className="ql-italic" key="ql-italic" />
          </Tooltip>
          <Tooltip title="下划线" key="ql-underline-tooltip">
            <button className="ql-underline" key="ql-underline" />
          </Tooltip>
          <Tooltip title="删除线" key="ql-strike-tooltip">
            <button className="ql-strike" key="ql-strike" />
          </Tooltip>
        </span>

        <span className="ql-formats">
          <select className="ql-color" key="ql-color" />
          <select className="ql-background" key="ql-background" />
        </span>

        <span className="ql-formats">
          <select className="ql-align" key="ql-align" />
          <Tooltip title="减少缩进" key="ql-indent-tooltip">
            <button className="ql-indent" value="-1" key="ql-indent" />
          </Tooltip>
          <Tooltip title="增加缩进" key="ql-indent-tooltip-up">
            <button className="ql-indent" value="+1" key="ql-indent-up" />
          </Tooltip>
        </span>

        <span className="ql-formats">
          <Tooltip title="有序列表" key="ql-ordered-tooltip">
            <button className="ql-list" value="ordered" key="ql-ordered" />
          </Tooltip>
          <Tooltip title="无序列表" key="ql-bullet-tooltip">
            <button className="ql-list" value="bullet" key="ql-list" />
          </Tooltip>
          <Tooltip title="引用" key="ql-blockquote-tooltip">
            <button className="ql-blockquote" key="ql-blockquote" />
          </Tooltip>
          <Tooltip title="代码" key="ql-code-block-tooltip">
            <button className="ql-code-block" key="ql-code-block" />
          </Tooltip>
        </span>

        <span className="ql-formats">
          <Tooltip title="超链接" key="ql-link-tooltip">
            <button className="ql-link" key="ql-link" />
          </Tooltip>
          <Tooltip title="图片" key="ql-image-tooltip">
            <button className="ql-image" key="ql-image" />
          </Tooltip>
        </span>

        <span className="ql-formats">
          <Tooltip title="清除样式" key="ql-clean-tooltip">
            <button className="ql-clean" key="ql-clean" />
          </Tooltip>
        </span>
      </div>
    ),
    [containerId],
  );

  return (
    <TextWrap onClick={ssp} editing={widgetInfo.editing}>
      <div className="react-quill react-quill-edit">
        {quillModules && (
          <>
            {toolbar}
            <ReactQuill
              ref={quillRef}
              className="react-quill"
              placeholder="请输入"
              value={quillValue}
              onChange={quillChange}
              modules={quillModules}
              formats={Formats}
              readOnly={false}
              theme={'bubble'}
            />
          </>
        )}
      </div>
      <div className="react-quill react-quill-view">
        <ReactQuill
          className="react-quill"
          placeholder=""
          value={initContent}
          modules={{ toolbar: null }}
          formats={Formats}
          readOnly={true}
        />
      </div>
    </TextWrap>
  );
};
export default RichTextWidget;

interface TextWrapProps {
  editing: boolean;
}
const TextWrap = styled.div<TextWrapProps>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: ${p => (p.editing ? '' : 'hidden')};

  .react-quill {
    width: 100%;
    height: 100%;
  }

  .react-quill-edit {
    display: ${p => (p.editing ? 'block' : 'none')};
  }

  .react-quill-view {
    display: ${p => (p.editing ? 'none' : 'block')};
  }

  & .ql-snow {
    border: none;
  }
  & .ql-container.ql-snow {
    border: none;
  }
`;
