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

import { SelectOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal, Row, Tooltip } from 'antd';
import { MarkdownOptions } from 'app/pages/DashBoardPage/components/WidgetCore/MediaWidget/RichTextWidget/configs/MarkdownOptions';
import TagBlot from 'app/pages/DashBoardPage/components/WidgetCore/MediaWidget/RichTextWidget/configs/TagBlot';
import { Formats } from 'app/pages/DashBoardPage/components/WidgetCore/MediaWidget/RichTextWidget/Formats';
import { FONT_FAMILIES, FONT_SIZES } from 'globalConstants';
import { DeltaStatic } from 'quill';
import { ImageDrop } from 'quill-image-drop-module'; // 拖动加载图片组件。
import QuillMarkdown from 'quilljs-markdown';
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.core.css';
import styled from 'styled-components';
import './RichTextPluginLoader';

Quill.register('modules/imageDrop', ImageDrop);
Quill.register('formats/tag', TagBlot);
const size = Quill.import('attributors/style/size');
size.whitelist = FONT_SIZES.map(fontSize => `${fontSize}px`);
Quill.register(size, true);

const font = Quill.import('attributors/style/font');
font.whitelist = FONT_FAMILIES.map(font => font.value);
Quill.register(font, true);

const MenuItem = Menu.Item;

const ChartRichTextAdapter: FC<{
  dataList: any[];
  id: string;
  isEditing?: boolean;
  initContent: string | undefined;
  onChange: (delta: string | undefined) => void;
}> = memo(({ dataList, id, isEditing = false, initContent, onChange }) => {
  const [containerId, setContainerId] = useState<string>();
  const [quillModules, setQuillModules] = useState<any>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [quillValue, setQuillValue] = useState<DeltaStatic | undefined>(
    undefined,
  );
  const quillRef = useRef<ReactQuill>(null);
  const quillEditRef = useRef<ReactQuill>(null);
  const [translate, setTranslate] = useState<DeltaStatic | undefined>(
    undefined,
  );

  useEffect(() => {
    const value = (initContent && JSON.parse(initContent)) || undefined;
    setQuillValue(value);
  }, [initContent]);

  useEffect(() => {
    if (id) {
      const newId = `rich-text-${id}`;
      setContainerId(newId);
      const modules = {
        toolbar: {
          container: isEditing ? `#${newId}` : null,
          handlers: {},
        },
        calcfield: {},
        imageDrop: true,
      };
      setQuillModules(modules);
    }
  }, [id, isEditing]);

  const quillChange = useCallback(() => {
    if (quillEditRef.current && quillEditRef.current?.getEditor()) {
      const contents = quillEditRef.current!.getEditor().getContents();
      setQuillValue(contents);
      onChange && onChange((contents && JSON.stringify(contents)) || undefined);
    }
  }, [onChange]);

  useEffect(() => {
    const quill = Object.assign({}, quillValue);
    const ops = quill.ops?.concat().map(item => {
      let insert = item.insert;
      if (typeof insert !== 'string') {
        const name = insert?.calcfield?.name;
        const config = name
          ? dataList.find(items => items.name === name)
          : null;
        if (config) {
          insert = config.value;
        } else {
          insert = ``;
        }
      }
      return { ...item, insert };
    });
    if (ops?.length) {
      setTranslate({ ...quill, ops } || undefined);
    } else {
      setTranslate(undefined);
    }
  }, [quillValue, dataList, setTranslate]);

  useLayoutEffect(() => {
    if (quillEditRef.current) {
      new QuillMarkdown(quillEditRef.current.getEditor(), MarkdownOptions);
    }
  }, [quillModules]);

  const reactQuillView = useMemo(
    () =>
      (!isEditing || visible) && (
        <ReactQuill
          ref={quillRef}
          className="react-quill"
          placeholder=""
          value={translate}
          modules={{ toolbar: null }}
          formats={Formats}
          readOnly={true}
        />
      ),
    [translate, quillRef, isEditing, visible],
  );

  const selectField = (field: any) => () => {
    if (quillEditRef.current) {
      const quill = quillEditRef.current.getEditor();
      if (field) {
        const text = `[${field.name}]`;
        quill.getModule('calcfield').insertItem(
          {
            denotationChar: '',
            id: field.id,
            name: field.name,
            value: field.value,
            text,
          },
          true,
        );
        setImmediate(() => {
          setQuillValue(quillEditRef.current?.getEditor().getContents());
        });
      }
    }
  };

  const fieldItems = dataList?.length ? (
    <Menu>
      {dataList.map(fieldName => (
        <MenuItem key={fieldName.name}>
          <a onClick={selectField(fieldName)}>{fieldName.name}</a>
        </MenuItem>
      ))}
    </Menu>
  ) : (
    <Menu>
      <MenuItem key="nodata">暂无可用字段</MenuItem>
    </Menu>
  );

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
          <Tooltip title="引用字段" key="ql-selectLink-tooltip">
            <Dropdown
              overlay={fieldItems}
              trigger={['click']}
              key="ql-selectLink"
            >
              <a onClick={e => e.preventDefault()} className="selectLink">
                <SelectOutlined />
              </a>
            </Dropdown>
          </Tooltip>
        </span>

        <span className="ql-formats">
          <Tooltip title="清除样式" key="ql-clean-tooltip">
            <button className="ql-clean" key="ql-clean" />
          </Tooltip>
        </span>
      </div>
    ),
    [containerId, fieldItems],
  );

  const reactQuillEdit = useMemo(
    () =>
      isEditing && (
        <>
          {toolbar}
          <ReactQuill
            ref={quillEditRef}
            className="react-quill"
            placeholder="请输入"
            defaultValue={quillValue}
            onChange={quillChange}
            modules={quillModules}
            formats={Formats}
            readOnly={false}
          />
          <Row align="middle" justify="end" style={{ paddingTop: 16 }}>
            <Button
              onClick={() => {
                setVisible(true);
              }}
              type="primary"
            >
              预览
            </Button>
          </Row>
          <Modal
            title="富文本预览"
            className="rich-text-modal"
            visible={visible}
            footer={null}
            onCancel={() => {
              setVisible(false);
            }}
          >
            {reactQuillView}
          </Modal>
        </>
      ),
    [
      visible,
      setVisible,
      reactQuillView,
      quillModules,
      quillValue,
      quillChange,
      isEditing,
    ],
  );

  useEffect(() => {
    if (reactQuillEdit) {
      const quill = quillEditRef.current?.getEditor();
      if (quill && !quill.hasFocus()) {
        quill.focus();
      }
    }
  }, [reactQuillEdit]);

  const ssp = e => {
    e.stopPropagation();
  };

  return (
    <TextWrap onClick={ssp}>
      {quillModules && reactQuillEdit}
      {quillModules && reactQuillView}
    </TextWrap>
  );
});
export default ChartRichTextAdapter;

const TextWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .react-quill {
    width: 100%;
    height: calc(100% - 90px);
  }

  & .rich-text-modal {
    width: 900px;
  }

  & .ql-snow {
    border: none;
  }

  & .ql-container.ql-snow {
    border: none;
  }

  & .selectLink {
    height: 24px;
    width: 28px;
    padding: 0 5px;
    display: inline-block;
    color: black;

    i {
      font-size: 16px;
    }
  }

  & .selectLink:hover {
    color: #06c;
  }
`;
