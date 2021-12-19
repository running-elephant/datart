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
import { CloudDownloadOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Menu, Popconfirm } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, { memo, useContext, useMemo } from 'react';
import { BoardContext } from '../contexts/BoardContext';
export interface BoardOverLayProps {
  onOpenShareLink?: () => void;
  onBoardToDownLoad: () => void;
  onShareDownloadData?: () => void;
}

export const BoardOverLay: React.FC<BoardOverLayProps> = memo(
  ({ onOpenShareLink, onBoardToDownLoad, onShareDownloadData }) => {
    const t = useI18NPrefix(`viz.action`);
    const { allowShare, allowDownload, renderMode } = useContext(BoardContext);
    const renderList = useMemo(
      () => [
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
      ],
      [
        onOpenShareLink,
        allowShare,
        renderMode,
        t,
        allowDownload,
        onBoardToDownLoad,
        onShareDownloadData,
      ],
    );
    const actionItems = useMemo(
      () =>
        renderList
          .filter(item => item.render)
          .map(item => {
            return (
              <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
                {item.content}
              </Menu.Item>
            );
          }),
      [renderList],
    );
    return <Menu>{actionItems}</Menu>;
  },
);
