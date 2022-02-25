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
import {
  CustomColor,
  QuillPalette,
} from 'app/components/ChartGraph/BasicRichText/RichTextPluginLoader/CustomColor';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import {
  MediaWidgetContent,
  Widget,
  WidgetInfo,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { editBoardStackActions } from 'app/pages/DashBoardPage/pages/BoardEditor/slice';
import produce from 'immer';
import { DeltaStatic } from 'quill';
import { ImageDrop } from 'quill-image-drop-module'; // 拖动加载图片组件。
import QuillMarkdown from 'quilljs-markdown';
import 'quilljs-markdown/dist/quilljs-markdown-common-style.css';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactQuill, { Quill } from 'react-quill';
// DeltaStatic
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { MarkdownOptions } from './configs/MarkdownOptions';
import TagBlot from './configs/TagBlot';
import { Formats } from './Formats';
// import produce from 'immer';
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('formats/tag', TagBlot);

const CUSTOM_COLOR = 'custom-color';
const CUSTOM_COLOR_INIT = {
  background: 'transparent',
  color: '#000',
};

type RichTextWidgetProps = {
  widgetConfig: Widget;
  widgetInfo: WidgetInfo;
};
export const RichTextWidget: React.FC<RichTextWidgetProps> = ({
  widgetConfig,
  widgetInfo,
}) => {
  const t = useI18NPrefix();
  const dispatch = useDispatch();
  const { editing: boardEditing } = useContext(BoardContext);
  const initContent = useMemo(() => {
    return (widgetConfig.config.content as MediaWidgetContent).richTextConfig
      ?.content;
  }, [widgetConfig.config.content]);
  const [quillValue, setQuillValue] = useState<DeltaStatic | undefined>(
    initContent,
  );
  const [containerId, setContainerId] = useState<string>();
  const [quillModules, setQuillModules] = useState<any>(null);

  const [customColorVisible, setCustomColorVisible] = useState<boolean>(false);
  const [customColor, setCustomColor] = useState<{
    background: string;
    color: string;
  }>({ ...QuillPalette.RICH_TEXT_CUSTOM_COLOR_INIT });
  const [customColorType, setCustomColorType] = useState<
    'color' | 'background'
  >('color');

  useEffect(() => {
    setQuillValue(initContent);
  }, [initContent]);

  useEffect(() => {
    if (widgetInfo.editing === false && boardEditing) {
      if (quillRef.current) {
        let contents = quillRef.current?.getEditor().getContents();
        const strContents = JSON.stringify(contents);
        if (strContents !== JSON.stringify(initContent)) {
          const nextMediaWidgetContent = produce(
            widgetConfig.config.content,
            draft => {
              (draft as MediaWidgetContent).richTextConfig = {
                content: JSON.parse(strContents),
              };
            },
          ) as MediaWidgetContent;

          dispatch(
            editBoardStackActions.changeMediaWidgetConfig({
              id: widgetConfig.id,
              mediaWidgetContent: nextMediaWidgetContent,
            }),
          );
        }
      }
    }
  }, [
    boardEditing,
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
        handlers: {
          color: function (value) {
            if (value === QuillPalette.RICH_TEXT_CUSTOM_COLOR) {
              setCustomColorType('color');
              setCustomColorVisible(true);
            }
            quillRef.current!.getEditor().format('color', value);
          },
          background: function (value) {
            if (value === QuillPalette.RICH_TEXT_CUSTOM_COLOR) {
              setCustomColorType('background');
              setCustomColorVisible(true);
            }
            quillRef.current!.getEditor().format('background', value);
          },
        },
      },
      imageDrop: true,
    };
    setQuillModules(modules);
  }, [widgetInfo.id]);

  const quillRef = useRef<ReactQuill>(null);

  useLayoutEffect(() => {
    if (quillRef.current) {
      quillRef.current
        .getEditor()
        .on('selection-change', (r: { index: number; length: number }) => {
          if (!r?.index) return;
          try {
            const index = r.length === 0 ? r.index - 1 : r.index;
            const length = r.length === 0 ? 1 : r.length;
            const delta = quillRef
              .current!.getEditor()
              .getContents(index, length);

            if (delta.ops?.length === 1 && delta.ops[0]?.attributes) {
              const { background, color } = delta.ops[0].attributes;
              setCustomColor({
                background: background || CUSTOM_COLOR_INIT.background,
                color: color || CUSTOM_COLOR_INIT.color,
              });

              const colorNode = document.querySelector(
                '.ql-color .ql-color-label',
              );
              const backgroundNode = document.querySelector(
                '.ql-background .ql-color-label',
              );
              if (color && !colorNode?.getAttribute('style')) {
                colorNode!.setAttribute('style', `stroke: ${color}`);
              }
              if (background && !backgroundNode?.getAttribute('style')) {
                backgroundNode!.setAttribute('style', `fill: ${background}`);
              }
            } else {
              setCustomColor({ ...CUSTOM_COLOR_INIT });
            }
          } catch (error) {
            console.error('selection-change callback | error', error);
          }
        });
      new QuillMarkdown(quillRef.current.getEditor(), MarkdownOptions);
    }
  }, [quillModules]);

  useEffect(() => {
    let palette: QuillPalette | null = null;
    if (quillRef.current && containerId) {
      palette = new QuillPalette(quillRef.current, {
        toolbarId: containerId,
        onChange: setCustomColor,
      });
    }

    return () => {
      palette?.destroy();
    };
  }, [containerId]);

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
    () => QuillPalette.getToolbar({ id: containerId as string }),
    [containerId],
  );

  const customColorChange = color => {
    console.log(color);
    if (color) {
      quillRef.current!.getEditor().format(customColorType, color);
    }
    setCustomColorVisible(false);
  };

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
      <CustomColor
        visible={customColorVisible}
        onCancel={() => setCustomColorVisible(false)}
        color={customColor?.[customColorType]}
        colorChange={customColorChange}
      />
    </TextWrap>
  );
};
export default RichTextWidget;

interface TextWrapProps {
  editing: boolean;
}
// todo (tianlei) Need to nationalize
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

  .ql-picker-options [data-value=${CUSTOM_COLOR}] {
    position: relative;
    width: calc(100% - 4px);
    background-color: transparent !important;
    color: #343a40;
    font-weight: 400;
    font-size: 12px;
    &::after {
      content: '更多';
      position: absolute;
      top: 50%;
      left: 50%;
      color: #fff;
      transform: translate(-50%, -50%);
    }
    &:hover {
      border: none;
    }
  }
  .ql-bubble .ql-color .ql-picker-options,
  .ql-bubble .ql-background .ql-picker-options {
    width: 232px;
  }
`;
