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

import {
  CloseOutlined,
  EditOutlined,
  LeftOutlined,
  MoreOutlined,
  SaveOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { ShareLinkModal } from 'app/components/VizOperationMenu';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
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
import styled from 'styled-components/macro';
import {
  FONT_SIZE_ICON_SM,
  FONT_WEIGHT_MEDIUM,
  LINE_HEIGHT_ICON_SM,
  SPACE_LG,
  SPACE_SM,
} from 'styles/StyleConstants';
import { BoardActionContext } from '../contexts/BoardActionContext';
import { BoardContext } from '../contexts/BoardContext';
import { BoardInfoContext } from '../contexts/BoardInfoContext';
import { BoardOverLay } from './BoardOverLay';
import SaveToStoryBoard from './SaveToStoryBoard';

interface TitleHeaderProps {
  name?: string;
  publishLoading?: boolean;
  orgId?: string;
  onShareDownloadData?: () => void;
  toggleBoardEditor?: (bool: boolean) => void;
  onPublish?: () => void;
  onRecycleViz?: () => void;
  onAddToStory?: (id) => void;
  onSyncData?: () => void;
}
const TitleHeader: FC<TitleHeaderProps> = memo(
  ({
    name,
    children,
    publishLoading,
    orgId,
    onPublish,
    onRecycleViz,
    onShareDownloadData,
    toggleBoardEditor,
    onAddToStory,
    onSyncData,
  }) => {
    const t = useI18NPrefix(`viz.action`);
    const [showShareLinkModal, setShowShareLinkModal] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const {
      editing,
      name: boardName,
      status,
      renderMode,
      allowManage,
    } = useContext(BoardContext);
    const {
      updateBoard,
      onGenerateShareLink,
      onBoardToDownLoad,
      onSaveAsVizs,
    } = useContext(BoardActionContext);
    const { saving } = useContext(BoardInfoContext);

    const onOpenShareLink = useCallback(() => {
      setShowShareLinkModal(true);
    }, []);

    const onUpdateBoard = useCallback(() => {
      updateBoard?.(() => toggleBoardEditor?.(false));
    }, [toggleBoardEditor, updateBoard]);

    const closeBoardEditor = () => {
      toggleBoardEditor?.(false);
    };

    const title = useMemo(() => {
      const base = name || boardName;
      const suffix = TITLE_SUFFIX[status] ? `[${t(TITLE_SUFFIX[status])}]` : '';
      return base + suffix;
    }, [boardName, name, status, t]);
    const isArchived = status === 0;

    const handleModalVisible = useCallback(() => {
      setIsModalVisible(!isModalVisible);
    }, [isModalVisible]);

    const handleModalOk = useCallback(
      (storyId: string) => {
        handleModalVisible();
        onAddToStory?.(storyId);
      },
      [onAddToStory, handleModalVisible],
    );

    return (
      <Wrapper>
        <h1 className={classnames({ disabled: status < 2 })}>
          {editing && <LeftOutlined onClick={closeBoardEditor} />}
          {title}
        </h1>
        <Space>
          {children}
          {editing ? (
            <>
              <Button
                key="cancel"
                icon={<CloseOutlined />}
                onClick={closeBoardEditor}
              >
                {t('common.cancel')}
              </Button>

              <Button
                key="update"
                type="primary"
                loading={saving}
                icon={<SaveOutlined />}
                onClick={onUpdateBoard}
              >
                {t('common.save')}
              </Button>
            </>
          ) : (
            <>
              {allowManage &&
                !isArchived &&
                renderMode === 'read' &&
                Number(status) === 1 && (
                  <Button
                    key="publish"
                    icon={<SendOutlined />}
                    loading={publishLoading}
                    onClick={onPublish}
                  >
                    {t('publish')}
                  </Button>
                )}
              {allowManage && !isArchived && renderMode === 'read' && (
                <Button
                  key="edit"
                  icon={<EditOutlined />}
                  onClick={() => toggleBoardEditor?.(true)}
                >
                  {t('edit')}
                </Button>
              )}
              {
                <Dropdown
                  overlay={
                    <BoardOverLay
                      onOpenShareLink={onOpenShareLink}
                      onBoardToDownLoad={onBoardToDownLoad}
                      onShareDownloadData={onShareDownloadData}
                      onSaveAsVizs={onSaveAsVizs}
                      onSyncData={onSyncData}
                      onRecycleViz={onRecycleViz}
                      onAddToStory={onAddToStory && handleModalVisible}
                      onPublish={Number(status) === 2 ? onPublish : undefined}
                      isArchived={isArchived}
                    />
                  }
                  placement="bottomRight"
                  arrow
                >
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              }
            </>
          )}
        </Space>
        {showShareLinkModal && (
          <ShareLinkModal
            visibility={showShareLinkModal}
            onOk={() => setShowShareLinkModal(false)}
            onCancel={() => setShowShareLinkModal(false)}
            onGenerateShareLink={onGenerateShareLink}
          />
        )}
        {!!onSaveAsVizs && (
          <SaveToStoryBoard
            title={t('addToStory')}
            orgId={orgId as string}
            isModalVisible={isModalVisible}
            handleOk={handleModalOk}
            handleCancel={handleModalVisible}
          ></SaveToStoryBoard>
        )}
      </Wrapper>
    );
  },
);

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
