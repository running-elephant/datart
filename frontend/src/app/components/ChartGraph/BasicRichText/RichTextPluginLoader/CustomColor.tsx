import { Modal } from 'antd';
import { defaultPalette, defaultThemes } from 'app/assets/theme/colorsConfig';
import ChromeColorPicker from 'app/components/ColorPicker/ChromeColorPicker';
import { FONT_FAMILIES, FONT_SIZES } from 'globalConstants';
import { ReactNode } from 'react';
import ReactQuill from 'react-quill';
import styled from 'styled-components/macro';

export interface RichTextCustomColorType {
  background: string;
  color: string;
}

interface QuillPaletteOptions {
  /**
   * 工具栏ID
   * 其值必须和getToolbar函数传递的Id一致
   */
  toolbarId: string;
  /**
   * quill光标位置的color信息变化，用来同步调色盘的value
   */
  onChange: (data: RichTextCustomColorType) => void;
}

/**
 * 开启quill的**文本/背景色**的调色盘
 * 因为没有内置调色盘，使用者需要自己在组件中自行渲染调色盘
 * 必须条件：需要重写modules->toolbar->handlers->[color | background]方法
 * 实际配置方式可参考 src/app/components/ChartGraph/BasicRichText/ChartRichTextAdapter.tsx
 */
export class QuillPalette {
  protected quillJS: ReactQuill;
  protected options: QuillPaletteOptions;
  protected styleNode: HTMLStyleElement | null;

  static RICH_TEXT_CUSTOM_COLOR = 'custom-color';
  static RICH_TEXT_CUSTOM_COLOR_INIT: RichTextCustomColorType = {
    background: 'transparent',
    color: '#000',
  };

  constructor(quillJS, options = {} as QuillPaletteOptions) {
    this.quillJS = quillJS;
    this.options = options;
    this.styleNode = null;

    this.init();
  }

  protected init() {
    this.quillJS.getEditor().on('selection-change', this.selectionChange);
  }

  public destroy() {
    this.quillJS.getEditor()?.off('selection-change', this.selectionChange);
  }

  /**
   * 解决使用官方默认色块之外的颜色，icon无法映射所选颜色的问题
   * @param range
   * @returns
   */
  private selectionChange = (range: { index: number; length: number }) => {
    const { toolbarId, onChange } = this.options;
    if (!range?.index) return;
    if (!toolbarId) return;
    try {
      const index = range.length === 0 ? range.index - 1 : range.index;
      const length = range.length === 0 ? 1 : range.length;
      const delta = this.quillJS!.getEditor().getContents(index, length);

      if (delta.ops?.length === 1 && delta.ops[0]?.attributes) {
        const { background, color } = delta.ops[0].attributes;

        const colorNode = document.querySelector(
          `#${toolbarId} .ql-color .ql-color-label`,
        );
        const backgroundNode = document.querySelector(
          `#${toolbarId} .ql-background .ql-color-label`,
        );
        if (color && !colorNode?.getAttribute('style')) {
          colorNode!.setAttribute('style', `stroke: ${color}`);
        }
        if (background && !backgroundNode?.getAttribute('style')) {
          backgroundNode!.setAttribute('style', `fill: ${background}`);
        }
        onChange({
          background:
            background || QuillPalette.RICH_TEXT_CUSTOM_COLOR_INIT.background,
          color: color || QuillPalette.RICH_TEXT_CUSTOM_COLOR_INIT.color,
        });
      } else {
        onChange({ ...QuillPalette.RICH_TEXT_CUSTOM_COLOR_INIT });
      }
    } catch (error) {
      onChange({ ...QuillPalette.RICH_TEXT_CUSTOM_COLOR_INIT });
      console.error('selection-change callback | error', error);
    }
  };

  /**
   * 渲染通用toolbar
   * @param param0
   * @returns
   */
  // todo (tianlei) Need to nationalize
  static getToolbar = ({
    id,
    extendNodes = {},
    t,
  }: {
    id: string;
    extendNodes?: Record<string, ReactNode | ReactNode[]>;
    t?: (
      key: string,
      disablePrefix?: boolean | undefined,
      options?: any,
    ) => any;
  }) => (
    <ToolbarStyle id={id}>
      <span className="ql-formats">
        <select
          className="ql-font"
          key="ql-font"
          defaultValue={FONT_FAMILIES[0].value}
        >
          {FONT_FAMILIES.map(font => (
            <option value={font.value} key={font.name}>
              {t?.(font.name, true)}
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
        <button className="ql-underline" key="ql-underline" title="下划线" />
        <button className="ql-strike" key="ql-strike" title="删除线" />
        {extendNodes[0]}
      </span>

      <span className="ql-formats">
        <select className="ql-color" key="ql-color">
          {defaultThemes.concat(defaultPalette).map(color => (
            <option value={color} key={color} />
          ))}
          <option
            value={QuillPalette.RICH_TEXT_CUSTOM_COLOR}
            key={QuillPalette.RICH_TEXT_CUSTOM_COLOR}
          />
        </select>
        <select className="ql-background" key="ql-background">
          {defaultThemes.concat(defaultPalette).map(color => (
            <option value={color} key={color} />
          ))}
          <option
            value={QuillPalette.RICH_TEXT_CUSTOM_COLOR}
            key={QuillPalette.RICH_TEXT_CUSTOM_COLOR}
          />
        </select>
        {extendNodes[1]}
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
        {extendNodes[2]}
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
        <button className="ql-blockquote" key="ql-blockquote" title="引用" />
        <button className="ql-code-block" key="ql-code-block" title="代码" />
        {extendNodes[3]}
      </span>

      <span className="ql-formats">
        <button className="ql-link" key="ql-link" title="超链接" />
        <button className="ql-image" key="ql-image" title="图片" />
        {extendNodes[4]}
      </span>

      <span className="ql-formats">
        <button className="ql-clean" key="ql-clean" title="清除样式" />
        {extendNodes[5]}
      </span>
    </ToolbarStyle>
  );
}

export function CustomColor({
  visible,
  onCancel,
  color,
  colorChange,
}: {
  visible: boolean;
  onCancel: () => void;
  color: string;
  colorChange: (color: string | boolean) => void;
}) {
  return (
    <Modal
      width={273}
      mask={false}
      visible={visible}
      footer={null}
      closable={false}
      onCancel={onCancel}
    >
      <ChromeColorPicker
        // TODO(TM): 该组件无法更新color 暂时用key解决
        key={color}
        color={color}
        onChange={colorChange}
      />
    </Modal>
  );
}

const ToolbarStyle = styled.div`
  .ql-picker-options [data-value=${QuillPalette.RICH_TEXT_CUSTOM_COLOR}] {
    position: relative;
    width: calc(100% - 4px) !important;
    background-color: transparent !important;
    font-weight: 400;
    font-size: 12px;
    &::after {
      content: '更多';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .ql-color .ql-picker-options,
  .ql-background .ql-picker-options {
    width: 232px !important;
  }
`;
