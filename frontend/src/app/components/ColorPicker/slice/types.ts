import { ReactNode } from 'react';

export interface colorSelectionPropTypes {
  color?: string;
  onOk?: (color) => void;
}
export interface themeColorPropTypes {
  children: ReactNode;
  callbackFn: (Array) => void;
}
