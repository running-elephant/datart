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
import { vizActions } from 'app/pages/MainPage/pages/VizPage/slice';
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
import { v4 as uuidv4 } from 'uuid';
import StoryPageItem from '../components/StoryPageItem';
import { storyActions } from '../slice';
import {
  makeSelectStoryBoardById,
  makeSelectStoryPagesById,
} from '../slice/selectors';
import { getPageContentDetail } from '../slice/thunks';
import { StoryBoardState } from '../slice/types';

const { Content } = Layout;

export const StoryPlayer: React.FC<{ storyId: string }> = memo(
  ({ storyId }) => {
    const domId = useMemo(() => uuidv4(), []);
    const revealRef = useRef<any>();
    const dispatch = useDispatch();
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const fullRef: RefObject<HTMLDivElement> = useRef(null);
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
          controls: true,
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
              dispatch(vizActions.changePlayingStoryId(''));
            }, // do something custom when ESC is pressed
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
    }, [domId, changePage, sortedPages.length, autoSlide, dispatch]);

    useEffect(() => {
      const curPage = sortedPages[currentPageIndex];
      if (!curPage || !curPage.relId || !curPage.relType) {
        return;
      }
      const { relId, relType } = curPage;
      dispatch(getPageContentDetail({ relId, relType }));
    }, [currentPageIndex, dispatch, sortedPages, pageMap]);
    useEffect(() => {
      setTimeout(() => {
        // if (revealRef.current) {
        //   fullRef.current?.requestFullscreen();
        // }
      }, 0);
    }, []);
    return (
      <DndProvider backend={HTML5Backend}>
        <Wrapper ref={fullRef}>
          <Content>
            <div id={domId} className="reveal">
              <div className="slides">
                {sortedPages.map((page, index) => (
                  <StoryPageItem key={page.id} page={page} autoFit={false} />
                ))}
              </div>
            </div>
          </Content>
        </Wrapper>
      </DndProvider>
    );
  },
);

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 36;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .tool-bar {
    height: 100px;
  }
  & .reveal .slides {
    text-align: left;
  }
`;
