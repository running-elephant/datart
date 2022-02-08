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
import { calcAc } from 'app/pages/MainPage/Access';
import {
  PermissionLevels,
  ResourceTypes,
} from 'app/pages/MainPage/pages/PermissionPage/constants';
import {
  selectIsOrgOwner,
  selectPermissionMap,
} from 'app/pages/MainPage/slice/selectors';
import React, { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import AccessContext from './context/AccessContext';
import { EditorContext } from './EditorContext';
import { Main } from './Main';
import { SaveForm } from './SaveForm';
import { Sidebar } from './Sidebar';
import { selectSliderVisible } from './slice/selectors';

export function Container() {
  const { editorInstance } = useContext(EditorContext);
  const sliderVisible = useSelector(selectSliderVisible);
  const isOwner = useSelector(selectIsOrgOwner);
  const permissionMap = useSelector(selectPermissionMap);
  const t = useI18NPrefix('view.saveForm');
  const tg = useI18NPrefix('global');
  const [isDragging, setIsDragging] = useState(false);

  const allowEnableViz = calcAc(
    isOwner,
    permissionMap,
    ResourceTypes.Viz,
    PermissionLevels.Enable,
    '',
    'module',
  );
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

  const siderDragEnd = useCallback(
    sizes => {
      setSizes(sizes);
      editorResize();
      setIsDragging(false);
    },
    [setIsDragging, setSizes, editorResize],
  );

  const siderDragStart = useCallback(() => {
    if (!isDragging) setIsDragging(true);
  }, [setIsDragging, isDragging]);

  return (
    <AccessContext.Provider value={{ allowEnableViz }}>
      <StyledContainer
        sizes={sizes}
        minSize={[256, 0]}
        maxSize={[768, Infinity]}
        gutterSize={0}
        // onDrag={siderDrag}
        onDragStart={siderDragStart}
        onDragEnd={siderDragEnd}
        className="datart-split"
        sliderVisible={sliderVisible}
      >
        <Sidebar width={sizes[0]} isDragging={isDragging} />
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
    </AccessContext.Provider>
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
