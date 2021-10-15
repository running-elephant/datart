import { Card, Table, TableColumnsType } from 'antd';
import { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { SPACE_MD } from 'styles/StyleConstants';
import { LogStatus, LOG_STATUS_TEXT } from '../../constants';
import { useScheduleSlice } from '../../slice';
import {
  selectScheduleLogs,
  selectScheduleLogsLoading,
} from '../../slice/selectors';
import { getScheduleErrorLogs } from '../../slice/thunks';
import { ErrorLog } from '../../slice/types';

interface ScheduleErrorLogProps {
  scheduleId: string;
}
export const ScheduleErrorLog: FC<ScheduleErrorLogProps> = ({ scheduleId }) => {
  const dispatch = useDispatch();
  const logs = useSelector(selectScheduleLogs),
    loading = useSelector(selectScheduleLogsLoading);
  const { actions } = useScheduleSlice();
  useEffect(() => {
    if (scheduleId) {
      dispatch(getScheduleErrorLogs({ scheduleId, count: 100 }));
    }
    return () => {
      dispatch(actions.clearLogs);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId, dispatch]);
  const columns: TableColumnsType<ErrorLog> = useMemo(() => {
    return [
      { title: '开始时间', dataIndex: 'start', key: 'start' },
      { title: '结束时间', dataIndex: 'end', key: 'end' },
      {
        title: '日志阶段',
        dataIndex: 'status',
        key: 'status',
        render(status: LogStatus) {
          return LOG_STATUS_TEXT[status];
        },
      },
      {
        title: '执行信息',
        dataIndex: 'message',
        key: 'message',
        render(text, record) {
          const isSuccess = record?.status === LogStatus.S15;
          return isSuccess ? '成功' : text;
        },
      },
    ];
  }, []);
  if (logs?.length > 0) {
    return (
      <FormCard title="日志">
        <FormWrapper>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={logs || []}
            size="small"
            scroll={{ y: 400 }}
            pagination={false}
          />
        </FormWrapper>
      </FormCard>
    );
  } else {
    return <></>;
  }
};

const FormCard = styled(Card)`
  margin-top: ${SPACE_MD};
`;
const FormWrapper = styled.div`
  width: 860px;
`;
