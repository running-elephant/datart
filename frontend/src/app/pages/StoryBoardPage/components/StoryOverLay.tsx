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
  DeleteOutlined,
  ShareAltOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { Menu, Popconfirm } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import React, { memo, useMemo } from 'react';

export interface BoardOverLayProps {
  onOpenShareLink?: () => void;
  onBoardToDownLoad?: () => void;
  onShareDownloadData?: () => void;
  onRecycleStory?: () => void;
  onPublish?;
  allowShare?: boolean;
  allowManage?: boolean;
  isArchived?: boolean;
}
export const StoryOverLay: React.FC<BoardOverLayProps> = memo(
  ({
    onOpenShareLink,
    allowShare,
    allowManage,
    onPublish,
    isArchived,
    onRecycleStory,
  }) => {
    const t = useI18NPrefix(`viz.action`);
    const tg = useI18NPrefix(`global`);

    const renderList = useMemo(
      () => [
        {
          key: 'shareLink',
          icon: <ShareAltOutlined />,
          onClick: onOpenShareLink,
          disabled: false,
          render: allowShare,
          content: t('share.shareLink'),
          className: 'line',
        },
        {
          key: 'publish',
          icon: <VerticalAlignBottomOutlined />,
          onClick: onPublish,
          disabled: false,
          render: allowManage && !isArchived && onPublish,
          content: t('unpublish'),
        },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          disabled: false,
          render: allowManage,
          content: (
            <Popconfirm
              title={tg('operation.archiveConfirm')}
              onConfirm={onRecycleStory}
            >
              {tg('button.archive')}
            </Popconfirm>
          ),
        },
      ],
      [
        t,
        tg,
        onOpenShareLink,
        onRecycleStory,
        allowShare,
        allowManage,
        isArchived,
        onPublish,
      ],
    );
    const actionItems = useMemo(
      () =>
        renderList
          .filter(item => item.render)
          .map(item => {
            return (
              <>
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  onClick={item.onClick}
                >
                  {item.content}
                </Menu.Item>
                {item.className && <Menu.Divider />}
              </>
            );
          }),
      [renderList],
    );
    return <Menu>{actionItems}</Menu>;
  },
);
