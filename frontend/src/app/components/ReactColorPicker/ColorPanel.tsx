import { FC, useCallback } from 'react';
import { ColorResult, SketchPicker, SketchPickerProps } from 'react-color';
import styled from 'styled-components/macro';
type ValueType = string | undefined;
export interface ColorPanelProps {
  value?: ValueType;
  onChange?: (value: ValueType, colorResult?: ColorResult) => void;
  colors?: SketchPickerProps['presetColors'];
}
const toChangeValue = (data: ColorResult) => {
  const { r, g, b, a } = data.rgb;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
export const ReactColorPicker: FC<ColorPanelProps> = ({ value, onChange }) => {
  const onChangeComplete = useCallback(
    v => {
      const rgbaValue = toChangeValue(v);
      onChange?.(rgbaValue, v);
    },
    [onChange],
  );

  return (
    <SketchPickerPanel color={value} onChangeComplete={onChangeComplete} />
  );
};

const SketchPickerPanel = styled(SketchPicker)`
  width: 260px !important;
  padding: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
`;

export type { ColorResult } from 'react-color';
