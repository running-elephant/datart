import EventEmitter from 'events';
const eventBus = new EventEmitter();
const WIDGET_MOVE = 'widgetMove';
const WIDGET_MOVE_END = 'widgetMoveEnd';
interface FnWidgetMove {
  (selectedIds: string[], deltaX: number, deltaY: number): void;
}

export const widgetMove = {
  on: (fn: FnWidgetMove) => {
    eventBus.addListener(WIDGET_MOVE, fn);
  },
  emit: (selectedIds: string[], deltaX: number, deltaY: number) => {
    eventBus.emit(WIDGET_MOVE, selectedIds, deltaX, deltaY);
  },
  off: (fn: FnWidgetMove) => {
    eventBus.removeListener(WIDGET_MOVE, fn);
  },
};
export const widgetMoveEnd = {
  on: (fn: () => void) => {
    eventBus.addListener(WIDGET_MOVE_END, fn);
  },
  emit: () => {
    eventBus.emit(WIDGET_MOVE_END);
  },
  off: (fn: () => void) => {
    eventBus.removeListener(WIDGET_MOVE_END, fn);
  },
};
