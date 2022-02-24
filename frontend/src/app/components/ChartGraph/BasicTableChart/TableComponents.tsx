import { Tooltip } from 'antd';
import React from 'react';
import { Resizable } from 'react-resizable';
import styled from 'styled-components/macro';
import { BLUE } from 'styles/StyleConstants';

export const TableComponentsTd = ({ children, ...rest }: any) => {
  if (rest.className.includes('ellipsis')) {
    return (
      <Tooltip placement="topLeft" title={children}>
        <Td {...rest}>{children}</Td>
      </Tooltip>
    );
  }
  return <Td {...rest}>{children}</Td>;
};

export const ResizableTitle = props => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <ResizableHandleStyle
          onClick={e => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
    >
      <th {...restProps} />
    </Resizable>
  );
};

const ResizableHandleStyle = styled.span`
  position: absolute;
  right: -5px;
  bottom: 0;
  z-index: 1;
  width: 10px;
  height: 100%;
  cursor: col-resize;
`;
const Td = styled.td<any>`
  ${p =>
    p.isLinkCell
      ? `
    :hover {
      color: ${BLUE};
      cursor: pointer;
    }
    `
      : p.isJumpCell
      ? `
        :hover {
          color: ${BLUE};
          cursor: pointer;
          text-decoration: underline;
        }
      `
      : null}
`;
