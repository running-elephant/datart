import { Split } from 'app/components';
import { useSplitSizes } from 'app/hooks/useSplitSizes';
import React, { useCallback, useContext } from 'react';
import styled from 'styled-components/macro';
import { EditorContext } from './EditorContext';
import { Main } from './Main';
import { SaveForm } from './SaveForm';
import { Sidebar } from './Sidebar';

export function Container() {
  const { editorInstance } = useContext(EditorContext);

  const editorResize = useCallback(() => {
    editorInstance?.layout();
  }, [editorInstance]);

  const { sizes, setSizes } = useSplitSizes({
    limitedSide: 0,
    range: [256, 768],
  });

  const siderDrag = useCallback(
    sizes => {
      setSizes(sizes);
      editorResize();
    },
    [setSizes, editorResize],
  );

  return (
    <StyledContainer
      sizes={sizes}
      minSize={[256, 0]}
      maxSize={[768, Infinity]}
      gutterSize={0}
      onDrag={siderDrag}
      className="datart-split"
    >
      <Sidebar />
      <Main />
      <SaveForm
        title="数据视图"
        formProps={{
          labelAlign: 'left',
          labelCol: { offset: 1, span: 6 },
          wrapperCol: { span: 15 },
        }}
        okText="保存"
      />
    </StyledContainer>
  );
}

const StyledContainer = styled(Split)`
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
`;
