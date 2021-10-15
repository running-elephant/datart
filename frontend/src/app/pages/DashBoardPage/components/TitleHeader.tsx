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
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { ShareLinkModal } from 'app/components/VizOperationMenu';
import classnames from 'classnames';
import React, { FC, memo, useCallback, useContext, useState } from 'react';
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

const TITLE_SUFFIX = ['[已归档]', '[未发布]'];

interface TitleHeaderProps {
  name?: string;
  publishLoading?: boolean;
  onShareDownloadData?: () => void;
  toggleBoardEditor?: (bool: boolean) => void;
  onPublish?: () => void;
}
const TitleHeader: FC<TitleHeaderProps> = memo(
  ({
    name,
    onShareDownloadData,
    toggleBoardEditor,
    children,
    publishLoading,
    onPublish,
  }) => {
    const [showShareLinkModal, setShowShareLinkModal] = useState(false);
    const {
      editing,
      name: boardName,
      status,
      renderMode,
      allowManage,
    } = useContext(BoardContext);
    const { updateBoard, onGenerateShareLink, onBoardToDownLoad } =
      useContext(BoardActionContext);
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

    const title = `${name || boardName} ${TITLE_SUFFIX[status] || ''}`;
    const isArchived = status === 0;

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
                取消
              </Button>

              <Button
                key="update"
                type="primary"
                loading={saving}
                icon={<SaveOutlined />}
                onClick={onUpdateBoard}
              >
                保存
              </Button>
            </>
          ) : (
            <>
              {allowManage && !isArchived && renderMode === 'read' && (
                <Button
                  key="publish"
                  icon={
                    status === 1 ? (
                      <SendOutlined />
                    ) : (
                      <VerticalAlignBottomOutlined />
                    )
                  }
                  loading={publishLoading}
                  onClick={onPublish}
                >
                  {status === 1 ? '发布' : '取消发布'}
                </Button>
              )}
              {allowManage && !isArchived && renderMode === 'read' && (
                <Button
                  key="edit"
                  icon={<EditOutlined />}
                  onClick={() => toggleBoardEditor?.(true)}
                >
                  编辑
                </Button>
              )}
              {
                <Dropdown
                  overlay={
                    <BoardOverLay
                      onOpenShareLink={onOpenShareLink}
                      onBoardToDownLoad={onBoardToDownLoad}
                      onShareDownloadData={onShareDownloadData}
                    />
                  }
                  placement="bottomCenter"
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
