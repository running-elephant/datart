import { Children, Component, CSSProperties, ReactNode } from 'react';
import styled from 'styled-components/macro';
import { Pane } from './Pane';
import { Resizer, RESIZER_DEFAULT_CLASSNAME } from './Resizer';

interface SplitPaneProps {
  allowResize?: boolean;
  children: ReactNode;
  className?: string;
  primary?: 'first' | 'second';
  minSize?: string | number;
  maxSize?: string | number;
  // eslint-disable-next-line react/no-unused-prop-types
  defaultSize?: string | number;
  size?: string | number;
  split?: 'vertical' | 'horizontal';
  onDragStarted?: () => void;
  onDragFinished?: (draggedSize: string | number) => void;
  onChange?: (newSize: string | number) => void;
  onResizerClick?: () => void;
  onResizerDoubleClick?: () => void;
  style?: CSSProperties;
  resizerStyle?: CSSProperties;
  paneClassName?: string;
  pane1ClassName?: string;
  pane2ClassName?: string;
  paneStyle?: CSSProperties;
  pane1Style?: CSSProperties;
  pane2Style?: CSSProperties;
  resizerClassName?: string;
  step?: number;
}

interface SplitPaneStates {
  active: boolean;
  position?: number;
  draggedSize?: number;
  resized: boolean;
  pane1Size: string | number;
  pane2Size: string | number;
  instanceProps: {
    size?: string | number;
  };
}

export class SplitPane extends Component<SplitPaneProps, SplitPaneStates> {
  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    // order of setting panel sizes.
    // 1. size
    // 2. getDefaultSize(defaultSize, minsize, maxSize)

    const { size, defaultSize, minSize, maxSize, primary } = props;

    const initialSize =
      size !== undefined
        ? size
        : getDefaultSize(defaultSize, minSize, maxSize, null);

    this.state = {
      active: false,
      resized: false,
      pane1Size: primary === 'first' ? initialSize : undefined,
      pane2Size: primary === 'second' ? initialSize : undefined,

      // these are props that are needed in static functions. ie: gDSFP
      instanceProps: {
        size,
      },
    };
  }

  private splitPane: HTMLDivElement | null = null;
  private pane1: HTMLDivElement | null = null;
  private pane2: HTMLDivElement | null = null;

  static defaultProps = {
    allowResize: true,
    minSize: 50,
    primary: 'first',
    split: 'vertical',
    paneClassName: '',
    pane1ClassName: '',
    pane2ClassName: '',
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('touchmove', this.onTouchMove);
    this.setState<any>(SplitPane.getSizeUpdate(this.props, this.state));
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return SplitPane.getSizeUpdate(nextProps, prevState);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('touchmove', this.onTouchMove);
  }

  onMouseDown(event) {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }],
    });
    this.onTouchStart(eventWithTouches);
  }

  onTouchStart(event) {
    const { allowResize, onDragStarted, split } = this.props;
    if (allowResize) {
      unFocus(document, window);
      const position =
        split === 'vertical'
          ? event.touches[0].clientX
          : event.touches[0].clientY;

      if (typeof onDragStarted === 'function') {
        onDragStarted();
      }
      this.setState({
        active: true,
        position,
      });
    }
  }

  onMouseMove(event) {
    const eventWithTouches = Object.assign({}, event, {
      touches: [{ clientX: event.clientX, clientY: event.clientY }],
    });
    this.onTouchMove(eventWithTouches);
  }

  onTouchMove(event) {
    const { allowResize, maxSize, minSize, onChange, split, step } = this.props;
    const { active, position } = this.state;

    if (allowResize && active) {
      unFocus(document, window);
      const isPrimaryFirst = this.props.primary === 'first';
      const ref = isPrimaryFirst ? this.pane1 : this.pane2;
      const ref2 = isPrimaryFirst ? this.pane2 : this.pane1;
      if (ref && ref2) {
        const node = ref;
        const node2 = ref2;

        if (node.getBoundingClientRect) {
          const width = node.getBoundingClientRect().width;
          const height = node.getBoundingClientRect().height;
          const current =
            split === 'vertical'
              ? event.touches[0].clientX
              : event.touches[0].clientY;
          const size = split === 'vertical' ? width : height;
          let positionDelta = position! - current;
          if (step) {
            if (Math.abs(positionDelta) < step) {
              return;
            }
            // Integer division
            // eslint-disable-next-line no-bitwise
            positionDelta = ~~(positionDelta / step) * step;
          }
          let sizeDelta = isPrimaryFirst ? positionDelta : -positionDelta;

          const pane1Order = parseInt(window.getComputedStyle(node).order);
          const pane2Order = parseInt(window.getComputedStyle(node2).order);
          if (pane1Order > pane2Order) {
            sizeDelta = -sizeDelta;
          }

          let newMaxSize = Number(maxSize);
          if (maxSize !== undefined && Number(maxSize) <= 0) {
            const splitPane = this.splitPane;
            if (split === 'vertical') {
              newMaxSize =
                splitPane!.getBoundingClientRect().width + Number(maxSize);
            } else {
              newMaxSize =
                splitPane!.getBoundingClientRect().height + Number(maxSize);
            }
          }

          let newSize = size - sizeDelta;
          const newPosition = position! - positionDelta;

          if (newSize < Number(minSize)) {
            newSize = Number(minSize);
          } else if (maxSize !== undefined && newSize > newMaxSize) {
            newSize = newMaxSize;
          } else {
            this.setState({
              position: newPosition,
              resized: true,
            });
          }

          if (onChange) onChange(newSize);

          this.setState<any>({
            draggedSize: newSize,
            [isPrimaryFirst ? 'pane1Size' : 'pane2Size']: newSize,
          });
        }
      }
    }
  }

  onMouseUp() {
    const { allowResize, onDragFinished } = this.props;
    const { active, draggedSize } = this.state;
    if (allowResize && active) {
      if (typeof onDragFinished === 'function') {
        onDragFinished(draggedSize!);
      }
      this.setState({ active: false });
    }
  }

  // we have to check values since gDSFP is called on every render and more in StrictMode
  static getSizeUpdate(props, state) {
    const newState: Partial<SplitPaneStates> = {};
    const { instanceProps } = state;

    if (instanceProps.size === props.size && props.size !== undefined) {
      return {};
    }

    const newSize =
      props.size !== undefined
        ? props.size
        : getDefaultSize(
            props.defaultSize,
            props.minSize,
            props.maxSize,
            state.draggedSize,
          );

    if (props.size !== undefined) {
      newState.draggedSize = newSize;
    }

    const isPanel1Primary = props.primary === 'first';

    newState[isPanel1Primary ? 'pane1Size' : 'pane2Size'] = newSize;
    newState[isPanel1Primary ? 'pane2Size' : 'pane1Size'] = undefined;

    newState.instanceProps = { size: props.size };

    return newState;
  }

  render() {
    const {
      allowResize,
      children,
      className,
      onResizerClick,
      onResizerDoubleClick,
      paneClassName,
      pane1ClassName,
      pane2ClassName,
      paneStyle,
      pane1Style: pane1StyleProps,
      pane2Style: pane2StyleProps,
      resizerClassName,
      resizerStyle,
      split,
      style: styleProps,
    } = this.props;

    const { pane1Size, pane2Size } = this.state;

    const disabledClass = allowResize ? '' : 'disabled';
    const resizerClassNamesIncludingDefault = resizerClassName
      ? `${resizerClassName} ${RESIZER_DEFAULT_CLASSNAME}`
      : resizerClassName;

    const notNullChildren = removeNullChildren(children);

    const style: CSSProperties = {
      display: 'flex',
      flex: 1,
      height: '100%',
      // position: 'absolute',
      outline: 'none',
      overflow: 'hidden',
      userSelect: 'text',
      ...styleProps,
    };

    if (split === 'vertical') {
      Object.assign(style, {
        flexDirection: 'row',
        // left: 0,
        // right: 0,
      });
    } else {
      Object.assign(style, {
        // bottom: 0,
        flexDirection: 'column',
        minHeight: '100%',
        // top: 0,
        width: '100%',
      });
    }

    const classes = ['SplitPane', className, split, disabledClass];

    const pane1Style = { ...paneStyle, ...pane1StyleProps };
    const pane2Style = { ...paneStyle, ...pane2StyleProps };

    const pane1Classes = ['Pane1', paneClassName, pane1ClassName].join(' ');
    const pane2Classes = ['Pane2', paneClassName, pane2ClassName].join(' ');

    return (
      <Wrapper
        className={classes.join(' ')}
        ref={node => {
          this.splitPane = node;
        }}
        style={style}
      >
        <Pane
          className={pane1Classes}
          key="pane1"
          eleRef={node => {
            this.pane1 = node;
          }}
          size={pane1Size}
          split={split}
          style={pane1Style}
        >
          {notNullChildren[0]}
        </Pane>
        <Resizer
          className={disabledClass}
          onClick={onResizerClick}
          onDoubleClick={onResizerDoubleClick}
          onMouseDown={this.onMouseDown}
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onMouseUp}
          key="resizer"
          resizerClassName={resizerClassNamesIncludingDefault}
          split={split}
          style={resizerStyle || {}}
        />
        <Pane
          className={pane2Classes}
          key="pane2"
          eleRef={node => {
            this.pane2 = node;
          }}
          size={pane2Size}
          split={split}
          style={pane2Style}
        >
          {notNullChildren[1]}
        </Pane>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  .Resizer {
    z-index: 1;
    box-sizing: border-box;
    background: transparent;
    background-clip: padding-box;
  }

  .Resizer:hover {
    /* transition: all 2s ease; */
  }

  .Resizer.horizontal {
    width: 100%;
    height: 10px;
    margin: -5px 0;
    cursor: row-resize;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }

  .Resizer.horizontal:hover {
    background-color: ${p => p.theme.primary};
    border-top-width: 4px;
    border-bottom-width: 4px;
  }

  .Resizer.vertical {
    width: 10px;
    margin: 0 -5px;
    cursor: col-resize;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
  }

  .Resizer.vertical:hover {
    background-color: ${p => p.theme.primary};
    border-right-width: 4px;
    border-left-width: 4px;
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }
`;

function unFocus(document, window) {
  if (document.selection) {
    document.selection.empty();
  } else {
    try {
      window.getSelection().removeAllRanges();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

function getDefaultSize(
  defaultSize: string | number,
  minSize: string | number,
  maxSize: string | number,
  draggedSize?: string | number | null,
) {
  if (typeof draggedSize === 'number') {
    const min = typeof minSize === 'number' ? minSize : 0;
    const max =
      typeof maxSize === 'number' && maxSize >= 0 ? maxSize : Infinity;
    return Math.max(min, Math.min(max, draggedSize));
  }
  if (defaultSize !== undefined) {
    return defaultSize;
  }
  return minSize;
}

function removeNullChildren(children) {
  return Children.toArray(children).filter(c => c);
}
