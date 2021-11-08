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
import { Layout, Modal } from 'antd';
import { Split } from 'app/components';
import { useSplitSizes } from 'app/hooks/useSplitSizes';
import { StoryContext } from 'app/pages/StoryBoardPage/contexts/StoryContext';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';
import RevealZoom from 'reveal.js/plugin/zoom/plugin';
import styled from 'styled-components/macro';
import { SPACE_MD } from 'styles/StyleConstants';
import { dispatchResize } from 'utils/utils';
import { v4 as uuidv4 } from 'uuid';
import PageThumbnailList from '../components/PageThumbnailList';
import StoryPageItem from '../components/StoryPageItem';
import { storyActions } from '../slice';
import {
  makeSelectStoryBoardById,
  makeSelectStoryPagesById,
} from '../slice/selectors';
import { deleteStoryPage, getPageContentDetail } from '../slice/thunks';
import { StoryBoardState } from '../slice/types';
import { StoryToolBar } from './StoryToolBar';

const { Content } = Layout;
export const StoryEditor: React.FC<{
  storyId: string;
  onCloseEditor?: () => void;
}> = memo(({ storyId, onCloseEditor }) => {
  const domId = useMemo(() => uuidv4(), []);
  const revealRef = useRef<any>();
  const dispatch = useDispatch();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const storyBoard = useSelector((state: { storyBoard: StoryBoardState }) =>
    makeSelectStoryBoardById(state, storyId),
  );
  const pageMap = useSelector((state: { storyBoard: StoryBoardState }) =>
    makeSelectStoryPagesById(state, storyId),
  );

  const sortedPages = useMemo(() => {
    const sortedPages = Object.values(pageMap).sort(
      (a, b) => a.config.index - b.config.index,
    );
    return sortedPages;
  }, [pageMap]);

  useEffect(() => {
    // dispatch(getStoryDetail(storyId));
  }, [dispatch, storyId]);

  const changePage = useCallback(
    e => {
      const { indexh: slideIdx } = e;
      setCurrentPageIndex(slideIdx);
      const pageId = sortedPages[slideIdx].id;
      dispatch(
        storyActions.changePageSelected({
          storyId,
          pageId,
          multiple: false,
        }),
      );
    },
    [dispatch, sortedPages, storyId],
  );

  useEffect(() => {
    if (sortedPages.length === 0) {
      return;
    }
    if (!sortedPages[currentPageIndex]) {
      return;
    }
    const pageId = sortedPages[currentPageIndex].id;
    dispatch(
      storyActions.changePageSelected({
        storyId,
        pageId,
        multiple: false,
      }),
    );
  }, [dispatch, currentPageIndex, sortedPages, storyId]);
  useEffect(() => {
    if (sortedPages.length > 0) {
      revealRef.current = new Reveal(document.getElementById(domId), {
        hash: false,
        history: false,
        controls: false,
        controlsLayout: 'none',
        slideNumber: 'c/t',
        controlsTutorial: false,
        progress: false,
        loop: true,
        width: '100%',
        height: '100%',
        margin: 0,
        minScale: 1,
        maxScale: 1,
        autoSlide: null,
        transition: 'convex',
        // backgroundTransition: 'fade',
        transitionSpeed: 'slow',
        viewDistance: 100,
        plugins: [RevealZoom],
        keyboard: {
          70: () => {},
        },
      });
      revealRef.current?.initialize();
      if (revealRef.current) {
        revealRef.current.addEventListener('slidechanged', changePage);
      }
      return () => {
        revealRef.current.removeEventListener('slidechanged', changePage);
      };
    }

    // "none" | "fade" | "slide" | "convex" | "concave" | "zoom"
  }, [domId, changePage, sortedPages.length]);

  useEffect(() => {
    const curPage = sortedPages[currentPageIndex];
    if (!curPage || !curPage.relId || !curPage.relType) {
      return;
    }
    const { relId, relType } = curPage;
    dispatch(getPageContentDetail({ relId, relType }));
  }, [currentPageIndex, dispatch, sortedPages]);

  const onPageClick = useCallback(
    (index: number, pageId: string, multiple: boolean) => {
      if (!multiple) {
        revealRef.current.slide(index);
      } else {
        dispatch(
          storyActions.changePageSelected({
            storyId,
            pageId,
            multiple: true,
          }),
        );
      }
    },
    [dispatch, storyId],
  );
  const { sizes, setSizes } = useSplitSizes({
    limitedSide: 0,
    range: [150, 768],
  });
  const siderDragEnd = useCallback(
    sizes => {
      setSizes(sizes);
      dispatchResize();
    },

    [setSizes],
  );
  const onDeletePages = useCallback(
    (pageIds: string[]) => {
      Modal.confirm({
        title:
          pageIds.length > 1
            ? '确认删除所有选中的故事页？'
            : '确认删除此故事页？',
        onOk: () => {
          // onDelete(selectedIds);
          pageIds.forEach(pageId => {
            dispatch(deleteStoryPage({ storyId, pageId }));
          });
        },
      });
    },
    [dispatch, storyId],
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <StoryContext.Provider
        value={{
          stroyBoardId: storyId,
          editing: true,
          name: storyBoard?.name,
          allowShare: false,
        }}
      >
        <Wrapper>
          <StoryToolBar onCloseEditor={onCloseEditor} />
          <Container
            sizes={sizes}
            minSize={[256, 0]}
            maxSize={[768, Infinity]}
            gutterSize={0}
            onDragEnd={siderDragEnd}
            className="datart-split"
          >
            <PageListWrapper>
              <PageThumbnailList
                sortedPages={sortedPages}
                onPageClick={onPageClick}
                onDeletePages={onDeletePages}
              />
            </PageListWrapper>
            <Content>
              <div id={domId} className="reveal">
                <div className="slides">
                  {sortedPages.map((page, index) => (
                    <StoryPageItem key={page.id} page={page} />
                  ))}
                </div>
              </div>
            </Content>
          </Container>
        </Wrapper>
      </StoryContext.Provider>
    </DndProvider>
  );
});

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 35;
  display: flex;
  flex-direction: column;
  background-color: ${p => p.theme.bodyBackground};
`;

const Container = styled(Split)`
  display: flex;
  flex: 1;

  .reveal-box {
    width: 100%;
    height: 100%;
  }
  & .reveal .slides {
    text-align: left;
  }
`;

const PageListWrapper = styled.div`
  padding: ${SPACE_MD} ${SPACE_MD} 0;
  overflow-y: auto;
`;
