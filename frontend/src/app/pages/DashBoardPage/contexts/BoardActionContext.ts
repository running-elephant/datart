import { createContext } from 'react';
import { Widget } from '../pages/Board/slice/types';
export interface BoardActionContextProps {
  widgetUpdate: (widget: Widget) => void;
  refreshWidgetsByFilter: (widget: Widget) => void;
  updateBoard?: (callback: () => void) => void;
  onGenerateShareLink?: (date, usePwd) => any;
  onBoardToDownLoad: () => any;
}
export const BoardActionContext = createContext<BoardActionContextProps>(
  {} as BoardActionContextProps,
);
