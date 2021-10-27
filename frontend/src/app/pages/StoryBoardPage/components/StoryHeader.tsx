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

import { SendOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { DetailPageHeader } from 'app/components/DetailPageHeader';
import React, { FC, memo } from 'react';

// import { useSelector } from 'react-redux';

const TITLE_SUFFIX = ['[已归档]', '[未发布]'];

interface StoryHeaderProps {
  name?: string;

  status?: number;
  publishLoading?: boolean;
  onPublish?: () => void;
  toggleEdit: () => void;
  playStory: () => void;
  allowShare?: boolean;
  allowManage?: boolean;
}
export const StoryHeader: FC<StoryHeaderProps> = memo(
  ({
    name,
    toggleEdit,
    status,
    publishLoading,
    playStory,
    onPublish,

    allowShare,
    allowManage,
  }) => {
    const title = `${name || ''} ${TITLE_SUFFIX[Number(status)] || ''}`;
    const isArchived = Number(status) === 0;

    return (
      <DetailPageHeader
        title={title}
        disabled={Number(status) < 2}
        actions={
          <>
            {allowManage && !isArchived && (
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
            {allowManage && !isArchived && (
              <Button key="edit" onClick={toggleEdit}>
                编辑
              </Button>
            )}
            <Button key="run" onClick={playStory}>
              播放
            </Button>
            <Button key="other">...</Button>
          </>
        }
      />
    );
  },
);

export default StoryHeader;
