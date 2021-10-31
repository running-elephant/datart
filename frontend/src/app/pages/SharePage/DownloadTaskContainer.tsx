import {
  DownloadListPopup,
  OnLoadTasksType,
} from 'app/pages/MainPage/Navbar/DownloadListPopup';
import { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_MD } from 'styles/StyleConstants';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
import { DownloadTask, DownloadTaskState } from '../MainPage/slice/types';
import { useShareSlice } from './slice';
import { selectShareDownloadPolling } from './slice/selectors';
const SHARE_HEADER_HEIGHT = 50;
export const loadShareTask = async params => {
  try {
    const { data } = await request<DownloadTask[]>({
      url: `/share/download/task`,
      method: 'GET',
      params,
    });
    const isNeedStopPolling = !(data || []).some(
      v => v.status === DownloadTaskState.CREATE,
    );
    return {
      isNeedStopPolling,
      data: data || [],
    };
  } catch (error) {
    errorHandle(error);
    throw error;
  }
};

interface DownloadTaskContainerProps {
  onLoadTasks: OnLoadTasksType;
  onDownloadFile: (item: DownloadTask) => void;
}
export const DownloadTaskContainer: FC<DownloadTaskContainerProps> = ({
  children,
  ...restProps
}) => {
  const sharePolling = useSelector(selectShareDownloadPolling);
  const { shareActions } = useShareSlice();
  const dispatch = useDispatch();
  const onSetSharePolling = useCallback(
    (polling: boolean) => {
      dispatch(shareActions.setShareDownloadPolling(polling));
    },
    [dispatch, shareActions],
  );
  return (
    <>
      <HeaderArea>
        <DownloadListPopup
          polling={sharePolling}
          setPolling={onSetSharePolling}
          {...restProps}
        />
      </HeaderArea>
      <Content>{children}</Content>
    </>
  );
};
const HeaderArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: ${SHARE_HEADER_HEIGHT}px;
  padding: ${SPACE_MD};
`;
const Content = styled.div`
  height: calc(100% - ${SHARE_HEADER_HEIGHT}px);
`;
