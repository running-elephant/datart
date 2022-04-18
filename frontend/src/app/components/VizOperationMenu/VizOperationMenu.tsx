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
  VerticalAlignBottomOutlined,
} from '@ant-design/icons';
import { Menu, Popconfirm } from 'antd';
import { DownloadFileType } from 'app/constants';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';

const VizOperationMenu: FC<{
  onShareLinkClick?;
  onDownloadDataLinkClick?;
  onSaveAsVizs?;
  onReloadData?;
  onAddToDashBoard?;
  onPublish?;
  onRecycleViz?;
  allowDownload?: boolean;
  allowShare?: boolean;
  allowManage?: boolean;
  isArchived?: boolean;
}> = memo(
  ({
    onShareLinkClick,
    onDownloadDataLinkClick,
    onSaveAsVizs,
    onReloadData,
    onAddToDashBoard,
    onPublish,
    allowDownload,
    allowShare,
    allowManage,
    isArchived,
    onRecycleViz,
  }) => {
    const t = useI18NPrefix(`viz.action`);
    const tg = useI18NPrefix(`global`);

    const moreActionMenu = () => {
      const menus: any[] = [];

      if (onReloadData) {
        menus.push(
          <Menu.Item
            key="reloadData"
            icon={<ReloadOutlined />}
            onClick={onReloadData}
          >
            {t('syncData')}
          </Menu.Item>,
          <Menu.Divider key={'reloadDataLine'} />,
        );
      }

      if (allowManage && onSaveAsVizs) {
        menus.push(
          <Menu.Item key="saveAs" icon={<CopyFilled />} onClick={onSaveAsVizs}>
            {tg('button.saveAs')}
          </Menu.Item>,
        );
      }

      if (allowManage && onSaveAsVizs) {
        menus.push(
          <Menu.Item
            key="addToDash"
            icon={<FileAddOutlined />}
            onClick={() => onAddToDashBoard(true)}
          >
            {t('addToDash')}
          </Menu.Item>,
          <Menu.Divider key="addToDashLine" />,
        );
      }

      if (allowShare && onShareLinkClick) {
        menus.push(
          <Menu.Item
            key="shareLink"
            icon={<ShareAltOutlined />}
            onClick={onShareLinkClick}
          >
            {t('share.shareLink')}
          </Menu.Item>,
        );
      }

      if (allowDownload && onDownloadDataLinkClick) {
        menus.push(
          <Menu.Item key="downloadData" icon={<CloudDownloadOutlined />}>
            <Popconfirm
              placement="left"
              title={t('common.confirm')}
              onConfirm={() => {
                onDownloadDataLinkClick(DownloadFileType.Excel);
              }}
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
            >
              {t('share.downloadData')}
            </Popconfirm>
          </Menu.Item>,
          <Menu.Item key="downloadPDF" icon={<CloudDownloadOutlined />}>
            <Popconfirm
              placement="left"
              title={t('common.confirm')}
              onConfirm={() => {
                onDownloadDataLinkClick(DownloadFileType.Pdf);
              }}
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
            >
              {t('share.downloadPDF')}
            </Popconfirm>
          </Menu.Item>,
          <Menu.Item key="downloadPicture" icon={<CloudDownloadOutlined />}>
            <Popconfirm
              placement="left"
              title={t('common.confirm')}
              onConfirm={() => {
                onDownloadDataLinkClick(DownloadFileType.Image);
              }}
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
            >
              {t('share.downloadPicture')}
            </Popconfirm>
          </Menu.Item>,
          <Menu.Divider />,
          <Menu.Divider key="downloadDataLine" />,
        );
      }

      if (allowManage && !isArchived && onPublish) {
        menus.push(
          <Menu.Item
            key="publish"
            icon={<VerticalAlignBottomOutlined />}
            onClick={onPublish}
          >
            {t('unpublish')}
          </Menu.Item>,
        );
      }

      if (allowManage && onRecycleViz) {
        menus.push(
          <Menu.Item key="delete" icon={<DeleteOutlined />}>
            <Popconfirm
              title={tg('operation.archiveConfirm')}
              onConfirm={onRecycleViz}
            >
              {tg('button.archive')}
            </Popconfirm>
          </Menu.Item>,
        );
      }

      return <Menu>{menus}</Menu>;
    };

    return <StyleVizOperationMenu>{moreActionMenu()}</StyleVizOperationMenu>;
  },
);

export default VizOperationMenu;

const StyleVizOperationMenu = styled.div``;
