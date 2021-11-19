import { List, Tag } from 'antd';
import { ListItem } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, memo, useMemo } from 'react';
import styled from 'styled-components/macro';
import {
  ERROR,
  FONT_SIZE_TITLE,
  FONT_WEIGHT_BOLD,
  G50,
  INFO,
  LINE_HEIGHT_TITLE,
  SPACE_SM,
  SPACE_XS,
  SUCCESS,
} from 'styles/StyleConstants';
import { DownloadTask, DownloadTaskState } from '../../slice/types';
import { DownloadListProps } from './types';
const DOWNLOAD_STATUS_TAGS = {
  [DownloadTaskState.CREATE]: '处理中',
  [DownloadTaskState.DOWNLOADED]: '已下载',
  [DownloadTaskState.FINISH]: '完成',
  [DownloadTaskState.FAILED]: '失败',
};
const DOWNLOAD_STATUS_COLORS = {
  [DownloadTaskState.CREATE]: INFO,
  [DownloadTaskState.DOWNLOADED]: G50,
  [DownloadTaskState.FINISH]: SUCCESS,
  [DownloadTaskState.FAILED]: ERROR,
};

interface DownloadFileItemProps extends DownloadTask {
  onDownloadFile: (task: DownloadTask) => void;
}
const DownloadFileItem: FC<DownloadFileItemProps> = ({
  onDownloadFile,
  children,
  ...restProps
}) => {
  const { name, status } = restProps;
  const { color, tagName, titleClasses } = useMemo(() => {
    const titleClasses = ['download-file-name'];
    if (status === DownloadTaskState.DOWNLOADED) {
      titleClasses.push('downloaded');
    } else if (status === DownloadTaskState.FINISH) {
      titleClasses.push('finished');
    }
    return {
      color: DOWNLOAD_STATUS_COLORS[status],
      tagName: DOWNLOAD_STATUS_TAGS[status],
      titleClasses: titleClasses.join(' '),
    };
  }, [status]);
  return (
    <DownloadFileItemWrapper>
      <span className={titleClasses} onClick={() => onDownloadFile(restProps)}>
        {name}
      </span>
      {tagName ? <Tag color={color}>{tagName}</Tag> : null}
    </DownloadFileItemWrapper>
  );
};

export const DownloadList: FC<DownloadListProps> = memo(
  ({ onDownloadFile, tasks }) => {
    const t = useI18NPrefix('main.nav.download');

    const tasksContent = useMemo(() => {
      return (
        <List
          size="small"
          dataSource={tasks}
          rowKey={t => t.name}
          renderItem={t => {
            return (
              <ListItem>
                <DownloadFileItem {...t} onDownloadFile={onDownloadFile} />
              </ListItem>
            );
          }}
        />
      );
    }, [onDownloadFile, tasks]);

    return (
      <Wrapper>
        <Title>
          <h2>{t('title')}</h2>
        </Title>
        <Content>{tasksContent}</Content>
      </Wrapper>
    );
  },
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 256px;
  max-width: 512px;
  max-height: 480px;
  background-color: ${p => p.theme.componentBackground};
`;

const Title = styled.header`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: ${SPACE_SM} ${SPACE_SM} ${SPACE_XS};

  h2 {
    flex: 1;
    font-size: ${FONT_SIZE_TITLE};
    line-height: ${LINE_HEIGHT_TITLE};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const DownloadFileItemWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  overflow: hidden;

  .download-file-name {
    flex: 1;
    overflow: hidden;
    color: ${p => p.theme.textColorDisabled};
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;

    &.finished {
      font-weight: ${FONT_WEIGHT_BOLD};
      color: ${p => p.theme.textColor};
      text-decoration: underline;
      cursor: pointer;
    }

    &.downloaded {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .ant-tag {
    width: 56px;
    margin: 0;
    text-align: center;
  }
`;
