import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { SQLEditor } from './SQLEditor';
import { Toolbar } from './Toolbar';

interface EditorProps {
  allowManage: boolean;
}

export const Editor = memo(({ allowManage }: EditorProps) => {
  return (
    <Wrapper>
      <Toolbar allowManage={allowManage} />
      <SQLEditor />
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
