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
import { Layout, message } from 'antd';
import { Split } from 'app/components';
import { useSplitSizes } from 'app/hooks/useSplitSizes';
import { vizActions } from 'app/pages/MainPage/pages/VizPage/slice';
import { selectPublishLoading } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import { publishViz } from 'app/pages/MainPage/pages/VizPage/slice/thunks';
import { StoryContext } from 'app/pages/StoryBoardPage/contexts/StoryContext';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import 'reveal.js/dist/reveal.css';
import styled from 'styled-components/macro';
import { SPACE_MD } from 'styles/StyleConstants';
import { dispatchResize } from 'utils/utils';
import PageThumbnailList from '../components/PageThumbnailList';
import StoryHeader from '../components/StoryHeader';
import StoryPageItem from '../components/StoryPageItem';
import { StoryEditor } from '../Editor';
import { storyActions } from '../slice';
import {
  makeSelectStoryBoardById,
  makeSelectStoryPagesById,
} from '../slice/selectors';
import { getPageContentDetail, getStoryDetail } from '../slice/thunks';
import { StoryBoardState } from '../slice/types';

const { Content } = Layout;

export const StoryPagePreview: React.FC<{
  storyId: string;
  allowShare?: boolean;
  allowManage?: boolean;
}> = memo(({ storyId, allowShare, allowManage }) => {
  const dispatch = useDispatch();

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  // const [storyEditing, setStoryEditing] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);

  const storyBoard = useSelector((state: { storyBoard: StoryBoardState }) =>
    makeSelectStoryBoardById(state, storyId),
  );
  const pageMap = useSelector((state: { storyBoard: StoryBoardState }) =>
    makeSelectStoryPagesById(state, storyId),
  );
  const onCloseEditor = useCallback(() => {
    setEditorVisible(false);
  }, []);
  const publishLoading = useSelector(selectPublishLoading);

  const sortedPages = useMemo(() => {
    const sortedPages = Object.values(pageMap).sort(
      (a, b) => a.config.index - b.config.index,
    );
    return sortedPages;
  }, [pageMap]);
  const curPageId = useMemo(() => {
    return sortedPages[currentPageIndex]?.id || '';
  }, [currentPageIndex, sortedPages]);
  useEffect(() => {
    dispatch(getStoryDetail(storyId));
  }, [dispatch, storyId]);
  const toggleEdit = useCallback(() => {
    setEditorVisible(c => !c);
  }, []);
  const playStory = useCallback(() => {
    dispatch(vizActions.changePlayingStoryId(storyId || ''));
  }, [dispatch, storyId]);

  useEffect(() => {
    if (sortedPages.length === 0) {
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
  // 点击在加载
  useEffect(() => {
    const curPage = sortedPages[currentPageIndex];
    if (!curPage || !curPage.relId || !curPage.relType) {
      return;
    }
    const { relId, relType } = curPage;
    dispatch(getPageContentDetail({ relId, relType }));
  }, [currentPageIndex, dispatch, sortedPages, pageMap]);

  // 自动加载所有
  // useEffect(() => {
  //   sortedPages.forEach(page => {
  //     try {
  //       const { relId, relType } = page;
  //       dispatch(getPageContentDetail({ relId, relType }));
  //     } catch (error) {}
  //   });
  // }, [dispatch, sortedPages]);
  const onPageClick = useCallback(
    (index: number, pageId: string, multiple: boolean) => {
      setCurrentPageIndex(index);
      dispatch(
        storyActions.changePageSelected({
          storyId,
          pageId,
          multiple: false,
        }),
      );
    },
    [dispatch, storyId],
  );

  const onPublish = useCallback(() => {
    if (storyBoard) {
      dispatch(
        publishViz({
          id: storyBoard.id,
          vizType: 'STORYBOARD',
          publish: storyBoard.status === 1 ? true : false,
          resolve: () => {
            message.success(`${storyBoard.status === 2 ? '取消' : ''}发布成功`);
            dispatch(
              storyActions.changeBoardPublish({
                stroyId: storyBoard.id,
                publish: storyBoard.status === 1 ? 2 : 1,
              }),
            );
          },
        }),
      );
    }
  }, [dispatch, storyBoard]);

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

  return (
    <DndProvider backend={HTML5Backend}>
      <StoryContext.Provider
        value={{
          stroyBoardId: storyId,
          editing: false,
          allowShare: allowShare || false,
        }}
      >
        <Wrapper>
          <StoryHeader
            name={storyBoard?.name}
            playStory={playStory}
            status={storyBoard?.status}
            toggleEdit={toggleEdit}
            publishLoading={publishLoading}
            onPublish={onPublish}
            allowShare={allowShare}
            allowManage={allowManage}
          />
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
              />
            </PageListWrapper>
            <Content>
              {sortedPages.map(page => (
                <PreviewPage key={page.id} show={page.id === curPageId}>
                  <StoryPageItem
                    key={page.id}
                    page={page}
                    showZoomCtrl={true}
                  />
                </PreviewPage>
              ))}
            </Content>
          </Container>
          {editorVisible && (
            <StoryEditor storyId={storyId} onCloseEditor={onCloseEditor} />
          )}
        </Wrapper>
      </StoryContext.Provider>
    </DndProvider>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column;
  min-height: 0;
`;

const PageListWrapper = styled.div`
  padding: ${SPACE_MD} ${SPACE_MD} 0;
  overflow-y: auto;
`;

const Container = styled(Split)`
  display: flex;
  flex: 1;
`;

const PreviewPage = styled.div<{ show: boolean }>`
  display: ${p => (p.show ? 'flex' : 'none')};
  flex: 1;
  height: 100%;
`;
