import React from 'react';
import styled from 'styled-components/macro';
import { BLUE } from 'styles/StyleConstants';

export const TableComponentsTd = (props: any) => {
  return <Td {...props} />;
};

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
