import { BoardConfigContext } from 'app/pages/DashBoardPage/contexts/BoardConfigContext';
import React, { createContext, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { BoardContext } from '../contexts/BoardContext';
import StyledBackground from '../pages/Board/components/StyledBackground';
export const scaleContext = createContext<[number, number]>([1, 1]);
export interface IProps {
  scale: [number, number];
  slideTranslate: [number, number];
}
const SlideBackground: React.FC<IProps> = props => {
  const {
    config: { width: slideWidth, height: slideHeight, scaleMode, background },
  } = useContext(BoardConfigContext);
  const { editing } = useContext(BoardContext);
  const { scale, slideTranslate } = props;
  const slideStyle = useMemo(() => {
    const [translateX, translateY] = slideTranslate;
    const cssStyle: React.CSSProperties = {
      width: `${slideWidth}px`,
      height: `${slideHeight}px`,
      transform: `translate(${translateX}%, ${translateY}%) scale(${scale[0]}, ${scale[1]})`,
    };

    const backgroundStyle: React.CSSProperties = {};

    const setStyleToBody =
      scaleMode === 'scaleWidth' && window.screen.width <= 1024;
    Object.entries(backgroundStyle).forEach(([key, value]) => {
      setStyleToBody
        ? (document.body.style[key] = value)
        : (cssStyle[key] = value);
    });

    return cssStyle;
  }, [slideTranslate, slideWidth, slideHeight, scale, scaleMode]);

  return (
    <Warp
      bg={background}
      className="display-slide"
      style={slideStyle}
      editing={editing}
    >
      <scaleContext.Provider value={scale}>
        {props.children}
      </scaleContext.Provider>
    </Warp>
  );
};
export default SlideBackground;
const Warp = styled(StyledBackground)<{ editing: boolean }>`
  position: relative;
  box-shadow: ${p => (p.editing ? '0px 1px 8px 2px #8cb4be;' : '')};
  transition: all ease-in 200ms;
  transform-origin: 0 0;
`;
