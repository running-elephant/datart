import { CSSProperties, LegacyRef, PureComponent, ReactNode } from 'react';

interface PaneProps {
  className: string;
  children: ReactNode;
  size?: string | number;
  split?: 'vertical' | 'horizontal';
  style?: CSSProperties;
  eleRef: LegacyRef<HTMLDivElement>;
}

export class Pane extends PureComponent<PaneProps> {
  render() {
    const {
      children,
      className,
      split,
      style: styleProps,
      size,
      eleRef,
    } = this.props;

    const classes = ['Pane', split, className];

    let style: CSSProperties = {
      flex: 1,
      position: 'relative',
      outline: 'none',
    };

    if (size !== undefined) {
      if (split === 'vertical') {
        style.width = size;
      } else {
        style.height = size;
        style.display = 'flex';
      }
      style.flex = 'none';
    }

    style = Object.assign({}, style, styleProps || {});

    return (
      <div ref={eleRef} className={classes.join(' ')} style={style}>
        {children}
      </div>
    );
  }
}
