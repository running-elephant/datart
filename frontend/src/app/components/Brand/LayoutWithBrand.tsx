import { ReactNode } from 'react';
import styled from 'styled-components';
import { SPACE_LG, SPACE_TIMES } from 'styles/StyleConstants';
import { Brand } from './Brand';

interface LayoutWithBrandProps {
  className?: string;
  children?: ReactNode;
}

export function LayoutWithBrand({ className, children }: LayoutWithBrandProps) {
  return (
    <Layout {...(className && { className })}>
      <Brand />
      {children}
    </Layout>
  );
}

const Layout = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${SPACE_LG} ${SPACE_LG} ${SPACE_TIMES(30)} ${SPACE_LG};

  &.alert {
    justify-content: flex-start;
    padding: ${SPACE_TIMES(20)} ${SPACE_LG} ${SPACE_LG} ${SPACE_LG};
  }
`;
