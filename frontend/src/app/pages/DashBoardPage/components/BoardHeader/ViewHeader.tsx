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

import { EditOutlined, MoreOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space } from 'antd';
import { ShareLinkModal } from 'app/components/VizOperationMenu';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { useSaveAsViz } from 'app/pages/MainPage/pages/VizPage/hooks/useSaveAsViz';
import { selectPublishLoading } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import {
  deleteViz,
  publishViz,
  removeTab,
} from 'app/pages/MainPage/pages/VizPage/slice/thunks';
import classnames from 'classnames';
import { TITLE_SUFFIX } from 'globalConstants';
import React, {
  FC,
  memo,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_ICON_SM,
  FONT_WEIGHT_MEDIUM,
  LINE_HEIGHT_ICON_SM,
  SPACE_LG,
  SPACE_SM,
} from 'styles/StyleConstants';
import { boardActions } from '../../pages/Board/slice';
import { widgetsQueryAction } from '../../pages/Board/slice/asyncActions';
import { BoardOverLay } from '../BoardOverLay';
import { BoardActionContext } from '../BoardProvider/BoardActionProvider';
import { BoardContext } from '../BoardProvider/BoardProvider';
import SaveToStoryBoard from '../SaveToStoryBoard';

const TitleHeader: FC = memo(() => {
  const tg = useI18NPrefix('global');
  const t = useI18NPrefix(`viz.action`);
  const publishLoading = useSelector(selectPublishLoading);
  const history = useHistory();
  const dispatch = useDispatch();
  const [showShareLinkModal, setShowShareLinkModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { name, status, allowManage, boardId, renderMode, orgId } =
    useContext(BoardContext);

  const { onGenerateShareLink, onBoardToDownLoad } =
    useContext(BoardActionContext);
  const saveAsViz = useSaveAsViz();
  const onSaveAsVizs = useCallback(() => {
    saveAsViz(boardId, 'DASHBOARD');
  }, [boardId, saveAsViz]);

  const handleAddToStory = useCallback(
    storyId => {
      history.push({
        pathname: `/organizations/${orgId}/vizs/storyEditor/${storyId}`,
        state: {
          addDashboardId: boardId,
        },
      });
    },
    [history, orgId, boardId],
  );

  const handlePublish = useCallback(() => {
    dispatch(
      publishViz({
        id: boardId,
        vizType: 'DASHBOARD',
        publish: status === 1 ? true : false,
        resolve: () => {
          message.success(
            `${status === 2 ? t('unpublishSuccess') : t('publishSuccess')}`,
          );
          dispatch(
            boardActions.changeBoardPublish({
              boardId,
              publish: status === 1 ? 2 : 1,
            }),
          );
        },
      }),
    );
  }, [boardId, status, dispatch, t]);

  const redirect = useCallback(
    tabKey => {
      if (tabKey) {
        history.push(`/organizations/${orgId}/vizs/${tabKey}`);
      } else {
        history.push(`/organizations/${orgId}/vizs`);
      }
    },
    [history, orgId],
  );
  const handleRecycleViz = useCallback(() => {
    dispatch(
      deleteViz({
        params: { id: boardId, archive: true },
        type: 'DASHBOARD',
        resolve: () => {
          message.success(tg('operation.archiveSuccess'));
          dispatch(removeTab({ id: boardId, resolve: redirect }));
        },
      }),
    );
  }, [boardId, dispatch, redirect, tg]);
  const onOpenShareLink = useCallback(() => {
    setShowShareLinkModal(true);
  }, []);

  const toBoardEditor = () => {
    const pathName = history.location.pathname;
    if (pathName.includes(boardId)) {
      history.push(`${pathName.split(boardId)[0]}${boardId}/boardEditor`);
    } else if (pathName.includes('/vizs')) {
      history.push(
        `${pathName.split('/vizs')[0]}${'/vizs/'}${boardId}/boardEditor`,
      );
    }
  };
  const title = useMemo(() => {
    const base = name;
    const suffix = TITLE_SUFFIX[status] ? `[${t(TITLE_SUFFIX[status])}]` : '';
    return base + suffix;
  }, [name, status, t]);

  const isArchived = status === 0;

  const handleModalVisible = useCallback(() => {
    setIsModalVisible(!isModalVisible);
  }, [isModalVisible]);

  const handleModalOk = useCallback(
    (storyId: string) => {
      handleModalVisible();
      handleAddToStory?.(storyId);
    },
    [handleAddToStory, handleModalVisible],
  );

  const handleSyncData = useCallback(() => {
    dispatch(widgetsQueryAction({ boardId, renderMode }));
  }, [dispatch, boardId, renderMode]);
  return (
    <Wrapper>
      <h1 className={classnames({ disabled: status < 2 })}>{title}</h1>
      <Space>
        {allowManage && !isArchived && Number(status) === 1 && (
          <Button
            key="publish"
            icon={<SendOutlined />}
            loading={publishLoading}
            onClick={handlePublish}
          >
            {t('publish')}
          </Button>
        )}
        {allowManage && !isArchived && (
          <Button key="edit" icon={<EditOutlined />} onClick={toBoardEditor}>
            {t('edit')}
          </Button>
        )}
        <Dropdown
          overlay={
            <BoardOverLay
              onOpenShareLink={onOpenShareLink}
              onBoardToDownLoad={onBoardToDownLoad}
              onSaveAsVizs={onSaveAsVizs}
              onSyncData={handleSyncData}
              onRecycleViz={handleRecycleViz}
              onAddToStory={handleModalVisible}
              onPublish={Number(status) === 2 ? handlePublish : undefined}
              isArchived={isArchived}
            />
          }
          placement="bottomRight"
          arrow
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      </Space>
      <SaveToStoryBoard
        title={t('addToStory')}
        orgId={orgId as string}
        isModalVisible={isModalVisible}
        handleOk={handleModalOk}
        handleCancel={handleModalVisible}
      ></SaveToStoryBoard>
      {showShareLinkModal && (
        <ShareLinkModal
          visibility={showShareLinkModal}
          onOk={() => setShowShareLinkModal(false)}
          onCancel={() => setShowShareLinkModal(false)}
          onGenerateShareLink={onGenerateShareLink}
        />
      )}
    </Wrapper>
  );
});

export default TitleHeader;
const Wrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: ${SPACE_SM} ${SPACE_LG};
  background-color: ${p => p.theme.componentBackground};
  box-shadow: ${p => p.theme.shadowSider};

  h1 {
    flex: 1;
    font-size: ${FONT_SIZE_ICON_SM};
    font-weight: ${FONT_WEIGHT_MEDIUM};
    line-height: ${LINE_HEIGHT_ICON_SM};

    &.disabled {
      color: ${p => p.theme.textColorLight};
    }
  }
`;
