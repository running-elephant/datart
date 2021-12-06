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

import { Menu, Dropdown } from 'antd';
import ReactDOM from 'react-dom';
import { CaretDownOutlined } from '@ant-design/icons';
import TagBlot from 'app/pages/DashBoardPage/components/WidgetCore/RichTextBox/configs/TagBlot';
import { DeltaStatic } from 'quill';
import { ImageDrop } from 'quill-image-drop-module'; // 拖动加载图片组件。
import QuillMarkdown from 'quilljs-markdown';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import styled from 'styled-components';
import { MarkdownOptions } from '../../../../../DashBoardPage/components/WidgetCore/RichTextBox/configs/MarkdownOptions';
import { MediaWidgetContent } from '../../../../../DashBoardPage/pages/Board/slice/types';
import { Widget } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { Formats } from '../../../../../DashBoardPage/components/WidgetCore/RichTextBox/Formats';
import { ToolList } from '../../../../../DashBoardPage/components/WidgetCore/RichTextBox/Toolbar/ToolList';
import QuillConfig from 'quill';

const MenuItem = Menu.Item;
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('formats/tag', TagBlot);

const ChartRichTextAdapter: FC<{ dataList: any[] }> = memo(
  ({ dataList, ...rest }) => {
    const quillRef = useRef<ReactQuill>(null);
    const toolbarId = `rich-text-${new Date().getTime()}`;
    const modules = {
      toolbar: {
        container: ToolList, // `#${toolbarId}`,
        handlers: {},
      },
      imageDrop: true,
      keyboard: {
        bindings: {},
      },
    };
    useEffect(() => {
      if (quillRef.current) {
        new QuillMarkdown(quillRef.current.getEditor(), MarkdownOptions);
      }
    }, []);

    const ssp = e => {
      e.stopPropagation();
    };

    /* const quillChange = useCallback(() => {
       if (quillRef.current && quillRef.current?.getEditor()) {
         const contents: any = quillRef.current!.getEditor().getContents();
         setQuillValue(contents);
       }
     }, []);*/

    const selectField = (field: string) => () => {
      console.log(field);
      /*const [ prefix, suffix ] = this.props.fieldBoundaries
      const editor = this.reactQuill.current.getEditor()
      const selection = editor.getSelection()
      const cursorPosition = selection ? selection.index : 0
      const placeholderText = `${prefix}${field}${suffix}`
      editor.insertText(cursorPosition, placeholderText)
      editor.setSelection(cursorPosition, placeholderText.length)*/
    };

    /*const fieldItems = Object.keys(dataList).length ? (
      <Menu>
        {Object.keys(dataList).map((fieldName) => (
          <MenuItem key={fieldName}>
            <a href="javascript:void(0)" onClick={selectField(fieldName)}>{fieldName}</a>
          </MenuItem>
        ))}
      </Menu>
    ) : (
      <Menu><MenuItem>暂无可用字段</MenuItem></Menu>
    )*/
    // console.log(QuillConfig);
    /*const element: any = quillBoxRef && ReactDOM.findDOMNode(quillBoxRef);
    console.log(new QuillConfig(element, {
      theme: 'snow',
    }));*/
    return (
      <TextWrap onClick={ssp} editing={true}>
        <div className="react-quill react-quill-edit">
          <div id={toolbarId}>
            <select className="ql-header" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              e.persist();
            }}/>
            <select className="ql-font"/>
            <button className="ql-bold"/>
            <button className="ql-italic"/>
            <button className="ql-underline"/>
            <button className="ql-strike"/>
            <select className="ql-color"/>
            <select className="ql-background"/>
            <button className="ql-list" value="ordered"/>
            <button className="ql-list" value="bullet"/>
            <select className="ql-align"/>
            <button className="ql-link"/>
            <button className="ql-image"/>
            <button className="ql-clean"/>
          </div>
          <ReactQuill
            ref={quillRef}
            placeholder="请输入"
            modules={modules}
            formats={Formats}
            readOnly={false}
            theme={"snow"}
          />
        </div>
      </TextWrap>
    );
  },
);
export default ChartRichTextAdapter;

interface TextWrapProps {
  editing: boolean;
}

const TextWrap = styled.div<TextWrapProps>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .react-quill {
    width: 100%;
    height: 100%;
  }

  .react-quill-edit {
    display: ${p => (p.editing ? 'block' : 'none')};
  }

  .react-quill-view {
    display: ${p => (p.editing ? 'node' : 'block')};
  }

  & .ql-snow {
    border: none;
  }
  & .ql-container.ql-snow {
    border: none;
  }
`;
