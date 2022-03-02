import React from 'react';

export default function UseCSSPosition(props) {
  const { style, ...rest } = props;
  let newStyle = { ...style };

  try {
    // 劫持style
    // style组成来源
    // https://github.com/react-grid-layout/react-grid-layout/blob/de45d2d19a1001a656bcb31140a47ba543d6a39a/lib/GridItem.jsx#L310
    if (style.transform) {
      (style.transform as string).replace(
        /translate\((.*)px,(.*)px\)/,
        (origin, left, top) => {
          newStyle.left = `${left}px`;
          newStyle.top = `${top}px`;
          return origin;
        },
      );

      delete newStyle.MozTransform;
      delete newStyle.OTransform;
      delete newStyle.WebkitTransform;
      delete newStyle.msTransform;
      delete newStyle.transform;
    }
  } catch (error) {
    newStyle = { ...style };
    console.error('UseCSSPosition | error', error);
  }
  return <div {...rest} style={newStyle} />;
}
