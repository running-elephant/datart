import {
  Affix,
  Button,
  Card,
  Form,
  message,
  Popconfirm,
  Spin,
  Tooltip,
} from 'antd';
import { DetailPageHeader } from 'app/components/DetailPageHeader';
import { getFolders } from 'app/pages/MainPage/pages/VizPage/slice/thunks';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components/macro';
import { SPACE_LG, SPACE_MD, SPACE_SM } from 'styles/StyleConstants';
import { DEFAULT_VALUES, FileTypes, JobTypes, TimeModes } from '../constants';
import { useToScheduleDetails } from '../hooks';
import { useScheduleSlice } from '../slice';
import {
  selectDeleteLoading,
  selectEditingSchedule,
  selectSaveLoading,
  selectScheduleDetailLoading,
  selectUnarchiveLoading,
} from '../slice/selectors';
import {
  addSchedule,
  deleteSchedule,
  editSchedule,
  getScheduleDetails,
  getSchedules,
  unarchiveSchedule,
} from '../slice/thunks';
import { FormValues } from '../types';
import {
  getCronExpressionByPartition,
  getTimeValues,
  toEchoFormValues,
  toScheduleSubmitParams,
} from '../utils';
import { BasicBaseForm } from './BasicBaseForm';
import { EmailSettingForm } from './EmailSettingForm';
import { ScheduleErrorLog } from './ScheduleErrorLog';
import { SendContentForm } from './SendContentForm';
import { WeChartSetttingForm } from './WeChartSetttingForm';

export const EditorPage: FC = () => {
  const [form] = Form.useForm();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const [jobType, setJobType] = useState(JobTypes.Email);
  const [fileType, setFileType] = useState<FileTypes[]>(
    DEFAULT_VALUES.type || [],
  );
  const [periodUnit, setPeriodUnit] = useState<TimeModes>(TimeModes.Minute);
  const [periodInput, setPeriodInput] = useState(false);
  const { params } = useRouteMatch<{ scheduleId: string; orgId: string }>();
  const editingSchedule = useSelector(selectEditingSchedule);
  const loading = useSelector(selectScheduleDetailLoading);
  const saveLoding = useSelector(selectSaveLoading);
  const unarchiveLoading = useSelector(selectUnarchiveLoading);
  const deleteLoding = useSelector(selectDeleteLoading);
  const { toDetails } = useToScheduleDetails();
  const isArchived = editingSchedule?.status === 0;

  const { actions } = useScheduleSlice();
  const { scheduleId, orgId } = params;
  const isAdd = useMemo(() => {
    return scheduleId === 'add';
  }, [scheduleId]);
  const active = useMemo(() => {
    return editingSchedule?.active;
  }, [editingSchedule]);
  const refreshScheduleList = useCallback(() => {
    dispatch(getSchedules(orgId));
  }, [dispatch, orgId]);
  const onFinish = useCallback(() => {
    form.validateFields().then((values: FormValues) => {
      if (!(values?.folderContent && values?.folderContent?.length > 0)) {
        message.error('请勾选发送内容');
        return;
      }
      const params = toScheduleSubmitParams(values, orgId);
      if (isAdd) {
        dispatch(
          addSchedule({
            params,
            resolve: (id: string) => {
              message.success('新增成功');
              toDetails(orgId, id);
              refreshScheduleList();
            },
          }),
        );
      } else {
        dispatch(
          editSchedule({
            scheduleId: editingSchedule?.id as string,
            params: { ...params, id: editingSchedule?.id as string },
            resolve: () => {
              message.success('保存成功');
              refreshScheduleList();
            },
          }),
        );
      }
    });
  }, [
    form,
    isAdd,
    orgId,
    dispatch,
    editingSchedule,
    refreshScheduleList,
    toDetails,
  ]);

  const onResetForm = useCallback(() => {
    form.resetFields();
    setJobType(DEFAULT_VALUES.jobType as JobTypes);
    setPeriodUnit(TimeModes.Minute);
    setPeriodInput(false);
    setFileType([FileTypes.Image]);
    dispatch(actions.clearEditingSchedule);
  }, [form, dispatch, actions?.clearEditingSchedule]);

  useEffect(() => {
    dispatch(getFolders(orgId));
    if (scheduleId === 'add') {
      onResetForm();
    } else if (scheduleId) {
      dispatch(getScheduleDetails(scheduleId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId, dispatch]);
  const onJobTypeChange = useCallback(
    (v: JobTypes) => {
      setJobType(v);
      setFileType([FileTypes.Image]);
      form.setFieldsValue({
        type: [FileTypes.Image],
        imageWidth: DEFAULT_VALUES.imageWidth,
      });
    },
    [form],
  );
  const onFileTypeChange = useCallback(
    (v: FileTypes[]) => {
      setFileType(v);
      form.setFieldsValue({
        imageWidth:
          v && v.includes(FileTypes.Image)
            ? DEFAULT_VALUES.imageWidth
            : undefined,
      });
    },
    [form],
  );
  const onPeriodUnitChange = useCallback(
    (v: TimeModes) => {
      setPeriodUnit(v);
      switch (v) {
        case TimeModes.Minute:
          form.setFieldsValue({ minute: 10 });
          break;
      }
    },
    [form],
  );
  const onPeriodInputChange = useCallback(
    (v: boolean) => {
      if (v) {
        form.setFieldsValue({
          cronExpression: getCronExpressionByPartition(form.getFieldsValue()),
        });
      } else {
        const timeValues = getTimeValues(form.getFieldValue('cronExpression'));
        form.setFieldsValue(timeValues);
        setPeriodUnit(timeValues?.periodUnit);
      }
      setPeriodInput(v);
    },
    [form],
  );

  const unarchive = useCallback(() => {
    dispatch(
      unarchiveSchedule({
        id: editingSchedule!.id,
        resolve: () => {
          message.success('还原成功');
          toDetails(orgId);
        },
      }),
    );
  }, [dispatch, toDetails, orgId, editingSchedule]);

  const del = useCallback(
    archive => () => {
      dispatch(
        deleteSchedule({
          id: editingSchedule!.id,
          archive,
          resolve: () => {
            message.success(`成功${archive ? '移至回收站' : '删除'}`);
            toDetails(orgId);
          },
        }),
      );
    },
    [dispatch, toDetails, orgId, editingSchedule],
  );

  useEffect(() => {
    if (editingSchedule) {
      const _type = editingSchedule?.type as JobTypes,
        echoValues = toEchoFormValues(editingSchedule);
      form.setFieldsValue(echoValues);
      setFileType(echoValues?.type as FileTypes[]);
      setJobType(_type);
      setPeriodUnit(echoValues?.periodUnit as TimeModes);
      setPeriodInput(!!echoValues?.setCronExpressionManually);
    }
    return () => {
      setJobType(DEFAULT_VALUES.jobType as JobTypes);
      dispatch(actions.clearEditingSchedule);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingSchedule]);

  return (
    <Container ref={setContainer}>
      <Affix offsetTop={0} target={() => container}>
        <DetailPageHeader
          title={isAdd ? '新建定时任务' : editingSchedule?.name}
          actions={
            isArchived ? (
              <>
                <Popconfirm title="确定还原？" onConfirm={unarchive}>
                  <Button loading={unarchiveLoading}>还原</Button>
                </Popconfirm>
                <Popconfirm title="确定删除？" onConfirm={del(false)}>
                  <Button loading={deleteLoding} danger>
                    删除
                  </Button>
                </Popconfirm>
              </>
            ) : (
              <>
                <Tooltip
                  placement="bottom"
                  title={active ? '停止后允许修改' : ''}
                >
                  <Button
                    loading={saveLoding}
                    type="primary"
                    onClick={form.submit}
                    disabled={active}
                  >
                    保存
                  </Button>
                </Tooltip>
                {!isAdd && (
                  <Tooltip
                    placement="bottom"
                    title={active ? '停止后允许移至回收站' : ''}
                  >
                    <Popconfirm title="确定移至回收站？" onConfirm={del(true)}>
                      <Button loading={deleteLoding} disabled={active} danger>
                        移至回收站
                      </Button>
                    </Popconfirm>
                  </Tooltip>
                )}
              </>
            )
          }
        />
      </Affix>
      <EditorWrapper>
        <Spin spinning={loading}>
          <Form
            wrapperCol={{ span: 19 }}
            labelCol={{ span: 5 }}
            initialValues={DEFAULT_VALUES}
            form={form}
            onFinish={onFinish}
            scrollToFirstError
          >
            <FormAreaWrapper>
              {!isAdd && editingSchedule?.id ? (
                <ScheduleErrorLog scheduleId={editingSchedule?.id} />
              ) : null}
              <FormCard title="基本设置">
                <FormWrapper>
                  <BasicBaseForm
                    isAdd={isAdd}
                    orgId={orgId}
                    onJobTypeChange={onJobTypeChange}
                    initialName={editingSchedule?.name}
                    periodUnit={periodUnit}
                    onPeriodUnitChange={onPeriodUnitChange}
                    periodInput={periodInput}
                    onPeriodInputChange={onPeriodInputChange}
                  />
                </FormWrapper>
              </FormCard>

              {jobType === JobTypes.Email ? (
                <FormCard title="邮件设置">
                  <FormWrapper>
                    <EmailSettingForm
                      fileType={fileType}
                      onFileTypeChange={onFileTypeChange}
                    />
                  </FormWrapper>
                </FormCard>
              ) : (
                <FormCard title="企业微信设置">
                  <FormWrapper>
                    <WeChartSetttingForm />
                  </FormWrapper>
                </FormCard>
              )}
              <FormCard title="发送内容设置">
                <FormWrapper>
                  <SendContentForm />
                </FormWrapper>
              </FormCard>
            </FormAreaWrapper>
          </Form>
        </Spin>
      </EditorWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const EditorWrapper = styled.div`
  flex: 1;
  padding: 0 ${SPACE_LG} ${SPACE_LG} ${SPACE_LG};
  overflow-y: auto;
`;

const FormAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .image_width_form_item_wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: flex-start;
    .ant-row.ant-form-item {
      width: 70%;
    }
    .ant-input-number {
      width: 100%;
    }
    .image_width_unit {
      display: inline-block;
      height: 30px;
      margin-left: ${SPACE_SM};
      line-height: 30px;
    }
  }
`;

const FormCard = styled(Card)`
  margin-top: ${SPACE_MD};
`;
const FormWrapper = styled.div`
  width: 860px;
`;
