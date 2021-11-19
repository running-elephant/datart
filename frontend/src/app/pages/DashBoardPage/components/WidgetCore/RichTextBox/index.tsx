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
import { Cascader, Modal } from 'antd';
import {
  MediaWidgetContent,
  Widget,
  WidgetInfo,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
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
import { editBoardStackActions } from '../../../pages/BoardEditor/slice';
// TODO 计算字段
// import './CalcField/index';
import { MarkdownOptions } from './configs/MarkdownOptions';
import TagBlot from './configs/TagBlot';
import { Formats } from './Formats';
import { ToolList } from './Toolbar/ToolList';
import { Options as viewOptions } from './ViewBox/index';

Quill.register('modules/imageDrop', ImageDrop);
Quill.register('formats/tag', TagBlot);

type RichTextprops = {
  widgetConfig: Widget;
  widgetInfo: WidgetInfo;
};
export const RichText: React.FC<RichTextprops> = ({
  widgetConfig,
  widgetInfo,
}) => {
  const dispatch = useDispatch();
  const [viewMoal, setViewMoal] = useState<{
    show: boolean;
    byToolBar?: boolean;
  }>({ show: false, byToolBar: false });
  const [calcFieldValue, setCalcFieldValue] = useState<any[]>([]);
  const initContent = useMemo(() => {
    return (widgetConfig.config.content as MediaWidgetContent).richTextConfig
      ?.content;
  }, [widgetConfig.config.content]);
  const [quillValue, setQuillValue] = useState<DeltaStatic | undefined>(
    initContent,
  );

  useEffect(() => {
    setQuillValue(initContent);
  }, [initContent]);

  const addCalcField = useCallback(itemData => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      if (itemData) {
        const text = `${itemData.model}/${itemData.agg}`;
        quill
          .getModule('calcfield')
          .insertItem({ ...itemData, text, denotationChar: '@' }, true);
        setImmediate(() => {
          let contents = quillRef.current?.getEditor().getContents();
          setQuillValue(contents);
        });
      }
    }
  }, []);
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
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: widgetInfo.editing ? ToolList : null,
        handlers: {
          // TODO 计算字段
          // calcfield() {
          //   setViewMoal({ show: true, byToolBar: true });
          // },
        },
      },
      // TODO 计算字段
      // calcfield: {},
      imageDrop: true,
      keyboard: {
        bindings: {
          // custom: {
          //   key: '2',
          //   shiftKey: true,
          //   handler: function (range, context) {
          //     // TODO 计算
          //      setViewMoal({ show: true });
          //   },
          // },
        },
      },
    };
  }, [widgetInfo.editing]);

  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (quillRef.current) {
      new QuillMarkdown(quillRef.current.getEditor(), MarkdownOptions);
    }
  }, []);

  const ssp = e => {
    e.stopPropagation();
  };
  const changeCalcField = useCallback(data => {
    setCalcFieldValue(data);
  }, []);

  const onOkCalcField = useCallback(() => {
    const quill = quillRef.current?.getEditor() as Quill;
    const [viewId, model, agg] = calcFieldValue;
    const index = quill.getSelection()?.index || 0;

    addCalcField({ viewId, model, agg });
    setViewMoal({ show: false });
  }, [addCalcField, calcFieldValue]);

  const onCancelCalcField = useCallback(() => {
    setCalcFieldValue([]);
    if (!viewMoal.byToolBar) {
      quillRef.current?.getEditor().insertText(0, '@');
    }
    setViewMoal({ show: false });
  }, [viewMoal.byToolBar]);
  const quillChange = useCallback(() => {
    if (quillRef.current && quillRef.current?.getEditor()) {
      let contents = quillRef.current!.getEditor().getContents();
      setQuillValue(contents);
    }
  }, []);
  // TODO
  const translate = value => {
    // console.log('value', value);
    return value;
  };
  return (
    <TextWrap onClick={ssp} editing={widgetInfo.editing}>
      <div className="react-quill react-quill-edit">
        <ReactQuill
          ref={quillRef}
          className="react-quill"
          placeholder="请输入"
          value={quillValue}
          onChange={quillChange}
          modules={modules}
          formats={Formats}
          readOnly={false}
        />
      </div>

      <div className="react-quill react-quill-view">
        <ReactQuill
          className="react-quill"
          placeholder=""
          value={translate(initContent)}
          modules={{ toolbar: null }}
          formats={Formats}
          readOnly={true}
        />
      </div>

      <Modal
        title=""
        visible={viewMoal.show}
        onOk={onOkCalcField}
        onCancel={onCancelCalcField}
        okButtonProps={{ disabled: !calcFieldValue.length }}
      >
        <div style={{ height: 200 }}>
          <Cascader
            style={{ width: 380 }}
            options={viewOptions}
            onChange={changeCalcField}
            value={calcFieldValue}
            placeholder="Please select"
          />
          <div>viewid/字段/聚合方式</div>
        </div>
      </Modal>
    </TextWrap>
  );
};
export default RichText;

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
