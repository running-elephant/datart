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
import { Layout } from 'antd';
import { Split } from 'app/components';
import { useSplitSizes } from 'app/hooks/useSplitSizes';
import { vizActions } from 'app/pages/MainPage/pages/VizPage/slice';
import {
  selectEditingStoryId,
  selectPlayingStoryId,
} from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import { StoryContext } from 'app/pages/StoryBoardPage/contexts/StoryContext';
import React, {
  memo,
  RefObject,
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
import { dispatchResize } from 'utils/utils';
import { v4 as uuidv4 } from 'uuid';
import PageThumbnailList from '../components/PageThumbnailList';
import StoryHeader from '../components/StoryHeader';
import StoryPageItem from '../components/StoryPageItem';
import { storyActions } from '../slice';
import {
  makeSelectStoryBoardById,
  makeSelectStoryPagesById,
} from '../slice/selectors';
import { getPageContentDetail, getStoryDetail } from '../slice/thunks';
import { StoryBoardState } from '../slice/types';

const { Content } = Layout;

export const StoryPreview: React.FC<{ storyId: string }> = memo(
  ({ storyId }) => {
    const domId = useMemo(() => uuidv4(), []);
    const revealRef = useRef<any>();

    const fullRef: RefObject<HTMLDivElement> = useRef(null);
    const dispatch = useDispatch();
    const editingStoryId = useSelector(selectEditingStoryId);
    const playingStoryId = useSelector(selectPlayingStoryId);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [storyEditing, setStoryEditing] = useState(false);

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
      dispatch(getStoryDetail(storyId));
    }, [dispatch, storyId]);

    const changePage = useCallback(
      e => {
        const { indexh: slideIdx } = e;
        if (editingStoryId || playingStoryId) {
          return;
        }
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
      [dispatch, editingStoryId, playingStoryId, sortedPages, storyId],
    );
    useEffect(() => {
      if (editingStoryId) {
        revealRef.current.removeEventListener('slidechanged', changePage);
      }
    }, [changePage, editingStoryId]);

    useEffect(() => {
      if (sortedPages.length === 0) {
        return;
      }
      const pageId = sortedPages[0].id;
      dispatch(
        storyActions.changePageSelected({
          storyId,
          pageId,
          multiple: false,
        }),
      );
    }, [dispatch, sortedPages, storyId]);
    const autoSlide = useMemo(() => {
      if (storyBoard?.config?.autoPlay?.auto) {
        return storyBoard?.config?.autoPlay?.delay * 1000;
      }
      return null;
    }, [
      storyBoard?.config?.autoPlay?.auto,
      storyBoard?.config?.autoPlay?.delay,
    ]);
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
          autoSlide: autoSlide,
          transition: 'convex',
          // backgroundTransition: 'fade',
          transitionSpeed: 'slow',
          viewDistance: 100,
          plugins: [RevealZoom],
          keyboard: {
            27: () => {
              // disabled esc
            },
            70: () => {
              // disabled fullscreen f
            },
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
    }, [domId, changePage, sortedPages.length, autoSlide]);

    useEffect(() => {
      const curPage = sortedPages[currentPageIndex];
      if (!curPage || curPage.relId || curPage.relType) {
        return;
      }
      const { relId, relType } = curPage;
      dispatch(getPageContentDetail({ relId, relType }));
    }, [currentPageIndex, dispatch, sortedPages, pageMap]);

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
    const goEditStory = useCallback(() => {
      dispatch(vizActions.changeEditingStoryId(storyId || ''));
    }, [dispatch, storyId]);
    const toggleEdit = useCallback(() => {
      setStoryEditing(c => !c);
      dispatch(vizActions.changeEditingStoryId(storyId || ''));
      // fullRef.current?.requestFullscreen();
    }, [dispatch, storyId]);
    const playStory = useCallback(() => {
      // setStoryEditing(c => !c);
      dispatch(vizActions.changePlayingStoryId(storyId || ''));
      // fullRef.current?.requestFullscreen();
    }, [dispatch, storyId]);

    return (
      <DndProvider backend={HTML5Backend}>
        <StoryContext.Provider
          value={{ stroyBoardId: storyId, editing: false }}
        >
          <Wrapper>
            <StoryHeader
              playStory={playStory}
              storyEditing={storyEditing}
              status={storyBoard?.status}
              toggleEdit={toggleEdit}
            />
            <Container
              sizes={sizes}
              minSize={[256, 0]}
              maxSize={[768, Infinity]}
              gutterSize={0}
              onDragEnd={siderDragEnd}
              className="datart-split"
            >
              <div className="page-list">
                <PageThumbnailList
                  sortedPages={sortedPages}
                  onPageClick={onPageClick}
                />
              </div>
              <Content>
                <div ref={fullRef} id={domId} className="reveal">
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
  },
);

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;

  .page-list {
    height: calc(100vh - 112px);
    overflow-y: auto;
  }
`;
const Container = styled(Split)`
  display: flex;
  flex: 1;
`;
