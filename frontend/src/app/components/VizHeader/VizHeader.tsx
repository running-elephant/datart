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
  CaretRightFilled,
  EditOutlined,
  MoreOutlined,
  SendOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import {
  ShareLinkModal,
  VizOperationMenu,
} from 'app/components/VizOperationMenu';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { TITLE_SUFFIX } from 'globalConstants';
import { FC, memo, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { DetailPageHeader } from '../DetailPageHeader';

const VizHeader: FC<{
  chartName?: string;
  status?: number;
  publishLoading?: boolean;
  chartDescription?: string;
  onRun?;
  onGotoEdit?;
  onPublish?: () => void;
  onGenerateShareLink?: (date, usePwd?) => any;
  onDownloadData?;
  onSaveAsVizs?;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowManage?: boolean;
}> = memo(
  ({
    chartName,
    status,
    publishLoading,
    chartDescription,
    onRun,
    onPublish,
    onGotoEdit,
    onGenerateShareLink,
    onDownloadData,
    onSaveAsVizs,
    allowDownload,
    allowShare,
    allowManage,
  }) => {
    const t = useI18NPrefix(`viz.action`);
    const [showShareLinkModal, setShowShareLinkModal] = useState(false);

    const handleCloseShareLinkModal = () => {
      setShowShareLinkModal(false);
    };

    const handleOpenShareLinkModal = () => {
      setShowShareLinkModal(true);
    };

    const getOverlays = () => {
      return (
        <VizOperationMenu
          onShareLinkClick={onGenerateShareLink && handleOpenShareLinkModal}
          onDownloadDataLinkClick={onDownloadData}
          onSaveAsVizs={onSaveAsVizs}
          allowDownload={allowDownload}
          allowShare={allowShare}
          allowManage={allowManage}
        />
      );
    };

    const title = useMemo(() => {
      const base = chartName || '';
      const suffix = TITLE_SUFFIX[Number(status)]
        ? `[${t(TITLE_SUFFIX[Number(status)])}]`
        : '';
      return base + suffix;
    }, [chartName, status, t]);
    const isArchived = Number(status) === 0;

    return (
      <Wrapper>
        <DetailPageHeader
          title={title}
          description={chartDescription}
          disabled={Number(status) < 2}
          actions={
            <>
              {onRun && (
                <Button key="run" icon={<CaretRightFilled />} onClick={onRun}>
                  {t('run')}
                </Button>
              )}
              {allowManage && !isArchived && onPublish && (
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
                  {status === 1 ? t('publish') : t('unpublish')}
                </Button>
              )}
              {allowManage && !isArchived && onGotoEdit && (
                <Button key="edit" icon={<EditOutlined />} onClick={onGotoEdit}>
                  {t('edit')}
                </Button>
              )}
              <Dropdown key="more" trigger={['click']} overlay={getOverlays()}>
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            </>
          }
        />
        {showShareLinkModal && (
          <ShareLinkModal
            visibility={showShareLinkModal}
            onOk={handleCloseShareLinkModal}
            onCancel={handleCloseShareLinkModal}
            onGenerateShareLink={onGenerateShareLink}
          />
        )}
      </Wrapper>
    );
  },
);

export default VizHeader;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;
