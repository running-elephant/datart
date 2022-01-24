/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Split } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { useSplitSizes } from 'app/hooks/useSplitSizes';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { EditorContext } from './EditorContext';
import { Main } from './Main';
import { SaveForm } from './SaveForm';
import { Sidebar } from './Sidebar';
import { selectSliderVisible } from './slice/selectors';

export function Container() {
  const { editorInstance } = useContext(EditorContext);
  const sliderVisible = useSelector(selectSliderVisible);
  const t = useI18NPrefix('view.saveForm');
  const tg = useI18NPrefix('global');

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
      sliderVisible={sliderVisible}
    >
      <Sidebar />
      <Main />
      <SaveForm
        title={t('title')}
        formProps={{
          labelAlign: 'left',
          labelCol: { offset: 1, span: 8 },
          wrapperCol: { span: 13 },
        }}
        okText={tg('button.save')}
      />
    </StyledContainer>
  );
}

const StyledContainer = styled(Split)<{ sliderVisible: boolean }>`
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  .gutter-horizontal {
    display: ${p => (p.sliderVisible ? 'none' : 'block')};
  }
`;
