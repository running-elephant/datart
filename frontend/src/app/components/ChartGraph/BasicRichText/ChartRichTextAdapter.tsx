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
import { Button, Dropdown, Menu, Modal, Row } from 'antd';
import { FONT_FAMILIES, FONT_SIZES } from 'globalConstants';
import debounce from 'lodash/debounce';
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
import styled from 'styled-components/macro';
import './RichTextPluginLoader';
import {
  Formats,
  MarkdownOptions,
} from './RichTextPluginLoader/RichTextConfig';
import TagBlot from './RichTextPluginLoader/TagBlot';

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
  openQuillMarkdown?: boolean;
}> = memo(
  ({
    dataList,
    id,
    isEditing = false,
    initContent,
    onChange,
    openQuillMarkdown = false,
  }) => {
    const [containerId, setContainerId] = useState<string>();
    const [quillModules, setQuillModules] = useState<any>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [quillValue, setQuillValue] = useState<DeltaStatic | string>('');
    const [translate, setTranslate] = useState<DeltaStatic | string>('');

    const quillMarkdownConfigRef = useRef<any>(null);
    const quillRef = useRef<ReactQuill>(null);
    const quillEditRef = useRef<ReactQuill>(null);

    useEffect(() => {
      const value = (initContent && JSON.parse(initContent)) || '';
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

    const debouncedDataChange = useMemo(
      () =>
        debounce(value => {
          onChange?.(value);
        }, 300),
      [onChange],
    );

    const quillChange = useCallback(() => {
      if (quillEditRef.current && quillEditRef.current?.getEditor()) {
        const contents = quillEditRef.current!.getEditor().getContents();
        setQuillValue(contents);
        contents && debouncedDataChange(JSON.stringify(contents));
      }
    }, [debouncedDataChange]);

    useEffect(() => {
      if (typeof quillValue !== 'string') {
        const quill = Object.assign({}, quillValue);
        const ops = quill.ops?.concat().map(item => {
          let insert = item.insert;
          if (typeof insert !== 'string') {
            if (insert.hasOwnProperty('calcfield')) {
              const name = insert.calcfield?.name;
              const config = name
                ? dataList.find(items => items.name === name)
                : null;
              if (typeof config.value === 'number')
                insert = String(config.value);
              else insert = config?.value || '';
            }
          }
          return { ...item, insert };
        });
        setTranslate(ops?.length ? { ...quill, ops } : '');
      } else {
        setTranslate(quillValue);
      }
    }, [quillValue, dataList, setTranslate]);

    useLayoutEffect(() => {
      if (quillEditRef.current) {
        if (openQuillMarkdown) {
          quillMarkdownConfigRef.current = new QuillMarkdown(
            quillEditRef.current.getEditor(),
            MarkdownOptions,
          );
        } else {
          if (quillMarkdownConfigRef.current) {
            quillMarkdownConfigRef.current.destroy();
          }
        }
      }
    }, [openQuillMarkdown, quillModules]);

    const reactQuillView = useMemo(
      () =>
        (!isEditing || visible) && (
          <ReactQuill
            ref={quillRef}
            className="react-quill-view"
            placeholder=""
            value={translate}
            modules={{ toolbar: null }}
            formats={Formats}
            readOnly={true}
          />
        ),
      [translate, quillRef, isEditing, visible],
    );

    const selectField = useCallback(
      (field: any) => () => {
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
              setQuillValue(
                quillEditRef.current?.getEditor().getContents() || '',
              );
            });
          }
        }
      },
      [quillEditRef],
    );

    const fieldItems = useMemo(() => {
      return dataList?.length ? (
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
    }, [dataList, selectField]);

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
            <button className="ql-bold" key="ql-bold" title="加粗" />
            <button className="ql-italic" key="ql-italic" title="斜体" />
            <button
              className="ql-underline"
              key="ql-underline"
              title="下划线"
            />
            <button className="ql-strike" key="ql-strike" title="删除线" />
          </span>

          <span className="ql-formats">
            <select className="ql-color" key="ql-color" />
            <select className="ql-background" key="ql-background" />
          </span>

          <span className="ql-formats">
            <select className="ql-align" key="ql-align" />
            <button
              className="ql-indent"
              value="-1"
              key="ql-indent"
              title="减少缩进"
            />
            <button
              className="ql-indent"
              value="+1"
              key="ql-indent-up"
              title="增加缩进"
            />
          </span>

          <span className="ql-formats">
            <button
              className="ql-list"
              value="ordered"
              key="ql-ordered"
              title="有序列表"
            />
            <button
              className="ql-list"
              value="bullet"
              key="ql-list"
              title="无序列表"
            />
            <button
              className="ql-blockquote"
              key="ql-blockquote"
              title="引用"
            />
            <button
              className="ql-code-block"
              key="ql-code-block"
              title="代码"
            />
          </span>

          <span className="ql-formats">
            <button className="ql-link" key="ql-link" title="超链接" />
            <button className="ql-image" key="ql-image" title="图片" />
            <Dropdown
              overlay={fieldItems}
              trigger={['click']}
              key="ql-selectLink"
            >
              <a className="selectLink" title="引用字段">
                <SelectOutlined />
              </a>
            </Dropdown>
          </span>

          <span className="ql-formats">
            <button className="ql-clean" key="ql-clean" title="清除样式" />
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
              bounds={'#quill-box'}
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
          </>
        ),
      [quillModules, quillValue, isEditing, toolbar, quillChange],
    );

    const ssp = e => {
      e.stopPropagation();
    };

    return (
      <TextWrap onClick={ssp}>
        <div id="editor"></div>
        <QuillBox id="quill-box">
          {quillModules && reactQuillEdit}
          {quillModules && !isEditing && reactQuillView}
        </QuillBox>
        <Modal
          title="富文本预览"
          visible={visible}
          footer={null}
          width="80%"
          getContainer={false}
          onCancel={() => {
            setVisible(false);
          }}
        >
          {isEditing && reactQuillView}
        </Modal>
      </TextWrap>
    );
  },
);
export default ChartRichTextAdapter;

const QuillBox = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  .react-quill {
    flex: 1;
    overflow-y: auto;
  }
  .react-quill-view {
    flex: 1;
    overflow-y: auto;
  }
`;
const TextWrap = styled.div`
  width: 100%;
  height: 100%;

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
