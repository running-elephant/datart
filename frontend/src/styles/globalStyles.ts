import { createGlobalStyle } from 'styled-components';
import {
  EMPHASIS_LEVEL,
  FONT_FAMILY,
  FONT_SIZE_BODY,
  MODAL_LEVEL,
  SPACE_SM,
  SPACE_TIMES,
  SPACE_XS,
} from './StyleConstants';
/* istanbul ignore next */
export const GlobalStyle = createGlobalStyle`
  body {
    font-size: ${FONT_SIZE_BODY};
    font-family: ${FONT_FAMILY};
    background-color: ${p => p.theme.bodyBackground};
  }

  h1,h2,h3,h4,h5,h6 {
    margin: 0;
    font-weight: inherit;
    color: inherit;
  }

  p, figure {
    margin: 0;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  li {
    list-style-type: none;
  }

  input {
    padding: 0;
  }

  table th {
    padding: 0;
    text-align: center;
  }

  * {
    -webkit-overflow-scrolling: touch;
  }
`;

export const OverriddenStyle = createGlobalStyle`
  /* app/components/Popup */
  .datart-popup {
    z-index: ${MODAL_LEVEL - 1};

    &.on-modal {
      z-index: ${MODAL_LEVEL + 30};
    }

    .ant-popover-arrow {
      display: none;
    }
    .ant-popover-inner-content {
      padding: 0;
    }
    .ant-dropdown-menu {
      box-shadow: none;
    }
    &.ant-popover-placement-bottom,
    &.ant-popover-placement-bottomLeft,
    &.ant-popover-placement-bottomRight {
      padding-top: 0;
    }
  }

  .ant-form-item-label > label {
    color: ${p => p.theme.textColorLight};
  }

  .ant-form-item-label-left > label {
    padding-left: ${SPACE_SM};

    &:before {
      position: absolute;
      left: 0;
    }
  }

  .ant-popover-inner {
    box-shadow: ${p => p.theme.shadow3};
  }

  /* react-split */
  .datart-split {
    min-width: 0;
    min-height: 0;

    .gutter-horizontal {
      &:before {
        width: 2px;
        height: 100%;
        transform: translate(-50%, 0);
      }
      &:after {
        width: ${SPACE_TIMES(2)};
        height: 100%;
        cursor: ew-resize;
        transform: translate(-50%, 0);
      }
    }

    .gutter-vertical {
      &:before {
        width: 100%;
        height: 2px;
        transform: translate(0, -50%);
      }
      &:after {
        width: 100%;
        height: ${SPACE_TIMES(2)};
        cursor: ns-resize;
        transform: translate(0, -50%);
      }
    }

    .gutter-horizontal,
    .gutter-vertical{
      position: relative;

      &:before {
        position: absolute;
        z-index: ${EMPHASIS_LEVEL};
        content: '';
      }
      &:after {
        position: absolute;
        z-index: ${EMPHASIS_LEVEL};
        content: '';
      }
      &:hover,
      &:active {
        &:before {
          background-color: ${p => p.theme.primary};
        }
      }
    }
  }

  /* react-grid-layout */
  .react-grid-item.react-grid-placeholder {
    background-color: ${p => p.theme.textColorDisabled} !important;
  }
  

  /* schema table header action dropdown menu */
  .datart-schema-table-header-menu {
    min-width: ${SPACE_TIMES(40)};

    .ant-dropdown-menu-submenu-selected {
      .ant-dropdown-menu-submenu-title {
        color: ${p => p.theme.textColor};
      }
    }
  }

  /* config panel */
  .datart-config-panel {
    &.ant-collapse >
    .ant-collapse-item >
    .ant-collapse-header {
      padding: ${SPACE_XS} 0;
      color: ${p => p.theme.textColor};

      .ant-collapse-arrow {
        margin-right: ${SPACE_XS};
      }
    }

    .ant-collapse-content >
    .ant-collapse-content-box {
      padding: ${SPACE_XS} 0 ${SPACE_SM} !important;
    }
  }

  /* data config section dropdown */
  .datart-data-section-dropdown {
    z-index: ${MODAL_LEVEL - 1};
  }
  .aggregation-colorpopover{
    .ant-popover-arrow{
      display:none;
    }
  }

  /* fix antd bugs #32919 */
  .ant-tabs-dropdown-menu-item {
    display: flex;
    align-items: center;

    > span {
      flex: 1;
      white-space: nowrap;
    }

    &-remove {
      flex: none;
      margin-left: 12px;
      color: #00000073;
      font-size: 12px;
      background: 0 0;
      border: 0;
      cursor: pointer;

      &:hover {
        color: #1B9AEE;
      }
    }
  }
`;
