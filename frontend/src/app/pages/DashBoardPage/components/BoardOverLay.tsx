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
  CloudDownloadOutlined,
  CopyFilled,
  DeleteOutlined,
  FileAddOutlined,
  ReloadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Menu, Popconfirm } from 'antd';
import { MeunBox } from 'app/components/VizOperationMenu/VizOperationMenu';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, { memo, useContext, useMemo } from 'react';
import { BoardContext } from '../contexts/BoardContext';
export interface BoardOverLayProps {
  onOpenShareLink?: () => void;
  onBoardToDownLoad: () => void;
  onShareDownloadData?: () => void;
  onSaveAsVizs?: () => void;
  onSyncData?: () => void;
  onRecycleViz?: () => void;
  onAddToStory?;
  onPublish?;
  isArchived?: boolean;
}

export const BoardOverLay: React.FC<BoardOverLayProps> = memo(
  ({
    onOpenShareLink,
    onBoardToDownLoad,
    onShareDownloadData,
    onSaveAsVizs,
    onSyncData,
    onRecycleViz,
    onAddToStory,
    onPublish,
    isArchived,
  }) => {
    const t = useI18NPrefix(`viz.action`);
    const tg = useI18NPrefix(`global`);
    const { allowShare, allowDownload, renderMode, allowManage } =
      useContext(BoardContext);

    const renderList = useMemo(
      () => [
        {
          key: 'getData',
          icon: <ReloadOutlined />,
          onClick: onSyncData,
          disabled: false,
          render: true,
          content: t('syncData'),
          className: 'line',
        },
        {
          key: 'saveAs',
          icon: <CopyFilled />,
          onClick: onSaveAsVizs,
          disabled: false,
          render: allowManage,
          content: tg('button.saveAs'),
        },
        {
          key: 'addToStory',
          icon: <FileAddOutlined />,
          onClick: onAddToStory,
          disabled: false,
          render: allowManage && onAddToStory,
          content: t('addToStory'),
          className: 'line',
        },
        {
          key: 'shareLink',
          icon: <ShareAltOutlined />,
          onClick: onOpenShareLink,
          disabled: false,
          render: allowShare && renderMode === 'read',
          content: t('share.shareLink'),
        },
        {
          key: 'downloadData',
          icon: <CloudDownloadOutlined />,
          onClick: () => {},
          disabled: false,
          render: allowDownload,
          className: 'line',
          content: (
            <Popconfirm
              placement="left"
              title={t('common.confirm')}
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
              onConfirm={() => {
                if (renderMode === 'read') {
                  onBoardToDownLoad?.();
                } else {
                  onShareDownloadData?.();
                }
              }}
            >
              {t('share.downloadData')}
            </Popconfirm>
          ),
        },
        {
          key: 'publish',
          icon: <FileAddOutlined />,
          onClick: onPublish,
          disabled: false,
          render: allowManage && !isArchived && onPublish,
          content: t('unpublish'),
        },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          disabled: false,
          render: allowManage && onRecycleViz,
          content: (
            <Popconfirm
              title={tg('operation.archiveConfirm')}
              onConfirm={onRecycleViz}
            >
              {tg('button.archive')}
            </Popconfirm>
          ),
        },
      ],
      [
        allowShare,
        renderMode,
        allowDownload,
        allowManage,
        isArchived,
        onOpenShareLink,
        onBoardToDownLoad,
        onShareDownloadData,
        onSaveAsVizs,
        onSyncData,
        onPublish,
        onRecycleViz,
        onAddToStory,
        tg,
        t,
      ],
    );
    const actionItems = useMemo(
      () =>
        renderList
          .filter(item => item.render)
          .map(item => {
            return (
              <MeunBox
                className={item.className || ''}
                key={item.key}
                icon={item.icon}
                onClick={item.onClick}
              >
                {item.content}
              </MeunBox>
            );
          }),
      [renderList],
    );
    return <Menu>{actionItems}</Menu>;
  },
);
