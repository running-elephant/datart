import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_XS } from 'styles/StyleConstants';

export const Group = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: ${SPACE_XS};

  &:last-of-type {
    margin-bottom: 0;
  }

  .ant-select {
    margin-left: ${SPACE_XS};
    overflow: hidden;
    color: ${p => p.theme.textColorSnd};

    &:first-of-type {
      margin-left: 0;
    }
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background-color: ${p => p.theme.emphasisBackground};
    border-color: transparent !important;
    border-radius: ${BORDER_RADIUS};
    box-shadow: none !important;
  }
`;

export const WithColorPicker = styled.div`
  display: flex;
  align-items: center;

  > div:first-of-type {
    margin-bottom: 0;
  }

  > div:last-of-type {
    margin-left: ${SPACE_XS};
  }
`;
