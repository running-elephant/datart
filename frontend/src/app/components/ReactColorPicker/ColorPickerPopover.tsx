import { Button, Popover, PopoverProps, Row } from 'antd';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { SPACE_MD } from 'styles/StyleConstants';
import { ColorPanelProps, ColorResult, ReactColorPicker } from './ColorPanel';
import { ColorPicker } from './ColorTag';

interface ColorPickerPopoverProps extends ColorPanelProps {
  popoverProps?: PopoverProps;
  defaultValue?: string;
  onSubmit?: ColorPanelProps['onChange'];
  colorPickerClass?: string;
}
export const ColorPickerPopover: FC<Omit<ColorPickerPopoverProps, 'onChange'>> =
  ({ children, defaultValue, popoverProps, onSubmit, colorPickerClass }) => {
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState<string | undefined>(defaultValue);
    const [colorResult, setColorResult] = useState<ColorResult>();

    useEffect(() => {
      if (visible) {
        setColor(defaultValue);
      }
    }, [visible, defaultValue]);
    const onCancel = useCallback(() => {
      setVisible(false);
    }, []);
    const onSure = useCallback(() => {
      onSubmit?.(color, colorResult);
      onCancel();
    }, [onSubmit, color, colorResult, onCancel]);
    const onColorChange = useCallback((color, result) => {
      setColor(color);
      setColorResult(result);
    }, []);
    const _popoverProps = useMemo(() => {
      return typeof popoverProps === 'object' ? popoverProps : {};
    }, [popoverProps]);
    return (
      <Popover
        {..._popoverProps}
        visible={visible}
        onVisibleChange={setVisible}
        content={
          <ContentWrapper>
            <ReactColorPicker value={color} onChange={onColorChange} />
            <Row justify="end">
              <Button size="small" onClick={onCancel}>
                取消
              </Button>
              <Button size="small" type="primary" onClick={onSure}>
                确定
              </Button>
            </Row>
          </ContentWrapper>
        }
        trigger="click"
        placement="right"
      >
        {children || (
          <ColorPicker color={defaultValue} className={colorPickerClass} />
        )}
      </Popover>
    );
  };

const ContentWrapper = styled.div`
  .ant-btn-primary {
    margin-left: ${SPACE_MD};
  }
`;
