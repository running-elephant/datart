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
import { VizRenderMode } from 'app/pages/DashBoardPage/pages/Dashboard/slice/types';
import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { StoryPage } from '../StoryBoardPage/slice/types';
import { BoardPageItem } from './BoardPageItem';

const StoryPageItem: React.FC<{
  page: StoryPage;
  autoFit?: boolean;
  showZoomCtrl?: boolean;
  renderMode?: VizRenderMode;
}> = ({ page, autoFit, showZoomCtrl, renderMode }) => {
  const { relId, relType } = page;

  const SlideContent = useMemo(() => {
    if (relType === 'DASHBOARD') {
      return <BoardPageItem boardId={relId}></BoardPageItem>;
    } else {
      return null;
    }
  }, [relId, relType]);
  const { in: effectIn, out: effectOut, speed } = page.config.transitionEffect;
  return (
    <SectionWrap
      className="story-page"
      data-transition={`${effectIn}${' '}${effectOut}`}
      data-transition-speed={speed}
    >
      {SlideContent}
    </SectionWrap>
  );
};
export default StoryPageItem;
const SectionWrap = styled.section`
  display: flex !important;
  flex: 1;
  flex-direction: column;
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
`;
const Wrapper = styled.div<{}>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;

  padding-bottom: 0;

  background-color: ${p => p.theme.bodyBackground};
`;
