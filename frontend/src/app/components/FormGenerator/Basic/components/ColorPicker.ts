import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_TIMES } from 'styles/StyleConstants';

export const ColorPicker = styled.div<{ color?: string }>`
  flex-shrink: 0;
  width: ${SPACE_TIMES(8)};
  height: ${SPACE_TIMES(8)};
  cursor: pointer;
  background-color: ${p => p.color || 'transparent'};
  border-radius: ${BORDER_RADIUS};
`;
