import styled from 'styled-components/macro';
import {
  BORDER_RADIUS,
  SPACE_TIMES,
  SPACE_XL,
  SPACE_XS,
} from 'styles/StyleConstants';

export const AuthForm = styled.div`
  width: ${SPACE_TIMES(100)};
  padding: ${SPACE_XL} ${SPACE_XL} ${SPACE_TIMES(8)};
  margin-top: ${SPACE_TIMES(10)};
  background-color: ${p => p.theme.componentBackground};
  border-radius: ${BORDER_RADIUS};
  box-shadow: ${p => p.theme.shadowSider};

  .ant-form-item {
    margin-bottom: ${SPACE_XL};

    &.last {
      margin-bottom: 0;
    }
  }

  .ant-form-item-with-help {
    margin-bottom: ${SPACE_XS};
  }

  .ant-input,
  .ant-input-affix-wrapper {
    color: ${p => p.theme.textColorSnd};
    background-color: ${p => p.theme.bodyBackground};
    border-color: ${p => p.theme.bodyBackground};

    &:hover,
    &:focus {
      border-color: ${p => p.theme.bodyBackground};
      box-shadow: none;
    }

    &:focus {
      background-color: ${p => p.theme.emphasisBackground};
    }
  }

  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    background-color: ${p => p.theme.emphasisBackground};
    box-shadow: none;
  }
`;
