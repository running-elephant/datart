import { Split } from 'app/components';
import { useSplitSizes } from 'app/hooks/useSplitSizes';
import { useBoardSlice } from 'app/pages/DashBoardPage/pages/Board/slice';
import { useEditBoardSlice } from 'app/pages/DashBoardPage/pages/BoardEditor/slice';
import { useStoryBoardSlice } from 'app/pages/StoryBoardPage/slice';
import React, { useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { dispatchResize } from 'utils/utils';
import { Main } from './Main';
import { SaveForm } from './SaveForm';
import { SaveFormContext, useSaveFormContext } from './SaveFormContext';
import { Sidebar } from './Sidebar';
import { useVizSlice } from './slice';

export function VizPage() {
  useVizSlice();
  useBoardSlice();
  useEditBoardSlice();
  useStoryBoardSlice();
  const match = useRouteMatch();
  const saveFormContextValue = useSaveFormContext();
  const { sizes, setSizes } = useSplitSizes({
    limitedSide: 0,
    range: [256, 768],
  });

  const siderDragEnd = useCallback(
    sizes => {
      setSizes(sizes);
      dispatchResize();
    },
    [setSizes],
  );

  return (
    <SaveFormContext.Provider value={saveFormContextValue}>
      <Container
        sizes={sizes}
        minSize={[256, 0]}
        maxSize={[768, Infinity]}
        gutterSize={0}
        onDragEnd={siderDragEnd}
        className="datart-split"
      >
        <Sidebar />
        <Main />
        <SaveForm
          width={400}
          formProps={{
            labelAlign: 'left',
            labelCol: { offset: 1, span: 6 },
            wrapperCol: { span: 15 },
          }}
          okText="保存"
        />
      </Container>
    </SaveFormContext.Provider>
  );
}

const Container = styled(Split)`
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
`;
