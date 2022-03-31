import { Form, Input, Modal, ModalProps, Select } from 'antd';
import useGetVizIcon from 'app/hooks/useGetVizIcon';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { jumpTypes } from 'app/pages/DashBoardPage/constants';
import { selectDataChartById } from 'app/pages/DashBoardPage/pages/Board/slice/selector';
import { BoardState } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getChartGroupColumns } from 'app/pages/DashBoardPage/utils';
import { convertToWidgetMap } from 'app/pages/DashBoardPage/utils/widget';
import { makeSelectVizTree } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import produce from 'immer';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editBoardStackActions, editDashBoardInfoActions } from '../../slice';
import { selectJumpPanel, selectSortAllWidgets } from '../../slice/selectors';
import { SelectJumpFields } from './FieldsSelect';
import { FilterSelect } from './FilterSelect';
import { fetchGlobalControllerOptions } from './service';
import { TargetTreeSelect } from './TargetTreeSelect';
import { ControlOptionItem } from './types';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const { Option } = Select;
interface SettingJumpModalProps extends ModalProps {}
export const SettingJumpModal: FC<SettingJumpModalProps> = ({
  children,
  ...restProps
}) => {
  const t = useI18NPrefix(`viz.jump`);
  const tv = useI18NPrefix(`global.validation`);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const selectVizTree = useMemo(makeSelectVizTree, []);
  const allWidgets = useSelector(selectSortAllWidgets),
    currentJumpPanel = useSelector(selectJumpPanel);
  const { boardId } = useContext(BoardContext);

  const [visible, setVisible] = useState(false);
  const [controllerLoading, setControllerLoading] = useState(false);
  const [widgetId, setWidgetId] = useState('');
  const [controllers, setControllers] = useState<ControlOptionItem[]>([]);
  const widgetMap = useMemo(() => convertToWidgetMap(allWidgets), [allWidgets]);
  const curJumpWidget = useMemo(() => {
    return widgetMap[widgetId] || undefined;
  }, [widgetId, widgetMap]);
  const { jumpVisible, jumpWidgetId } = useMemo(() => {
    return {
      jumpVisible: currentJumpPanel?.visible,
      jumpWidgetId: currentJumpPanel?.widgetId,
    };
  }, [currentJumpPanel]);
  const onGetController = useCallback(targetValue => {
    const relId = targetValue?.relId,
      relType = targetValue?.relType;
    if (relId && relType) {
      setControllerLoading(true);
      fetchGlobalControllerOptions(relId, relType)
        .then(data => setControllers(data))
        .finally(() => {
          setControllerLoading(false);
        });
    } else {
      setControllers([]);
    }
  }, []);

  const getIcon = useGetVizIcon();
  const treeData = useSelector(state => selectVizTree(state, { getIcon }));
  useEffect(() => {
    const _jumpConfig = curJumpWidget?.config?.jumpConfig;
    setVisible(jumpVisible);
    setTargetType(_jumpConfig?.targetType || jumpTypes[0].value);
    if (jumpVisible && _jumpConfig) {
      if (curJumpWidget?.config?.jumpConfig?.targetType === 'INTERNAL') {
        onGetController(curJumpWidget?.config?.jumpConfig?.target);
      }
      form.setFieldsValue(_jumpConfig);
    }
  }, [jumpVisible, curJumpWidget, form, onGetController]);
  useEffect(() => {
    setWidgetId(jumpWidgetId);
  }, [jumpWidgetId]);
  const dataChart = useSelector((state: { board: BoardState }) =>
    selectDataChartById(state, curJumpWidget?.datachartId),
  );
  const [targetType, setTargetType] = useState(jumpTypes[0].value);
  const chartGroupColumns = useMemo(
    () => getChartGroupColumns(dataChart?.config?.chartConfig?.datas),
    [dataChart],
  );
  const onTargetChange = useCallback(
    value => {
      form.setFieldsValue({ filter: undefined });
      onGetController(value);
    },
    [form, onGetController],
  );
  const onTargetTypeChange = useCallback(value => {
    setTargetType(value);
  }, []);
  const handleClose = useCallback(() => {
    dispatch(
      editDashBoardInfoActions.changeJumpPanel({
        visible: false,
        widgetId: '',
      }),
    );
    form.resetFields();
  }, [dispatch, form]);
  const onFinish = useCallback(
    values => {
      if (chartGroupColumns?.length === 1) {
        values = produce(values, draft => {
          draft.field = { jumpFieldName: chartGroupColumns[0].colName };
        });
      }
      const newWidget = produce(curJumpWidget, draft => {
        draft.config.jumpConfig = { ...values };
        draft.config.jumpConfig!.open = true;
      });
      handleClose();
      dispatch(editBoardStackActions.updateWidget(newWidget));
    },
    [dispatch, curJumpWidget, handleClose, chartGroupColumns],
  );
  return (
    <Modal
      title={t('title')}
      visible={visible}
      width={520}
      {...restProps}
      onOk={form.submit}
      onCancel={handleClose}
    >
      <Form {...formItemLayout} form={form} onFinish={onFinish}>
        <Form.Item
          label={t('mode')}
          name="targetType"
          initialValue={'INTERNAL'}
          rules={[{ required: true, message: `${t('mode')}${tv('required')}` }]}
        >
          <Select onChange={onTargetTypeChange}>
            {jumpTypes.map(({ name, value }) => (
              <Option key={value} value={value}>
                {t(value)}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {targetType === 'INTERNAL' && (
          <Form.Item
            label={t('target')}
            name="target"
            rules={[
              { required: true, message: `${t('target')}${tv('required')}` },
            ]}
          >
            <TargetTreeSelect
              filterBoardId={boardId}
              treeData={treeData}
              onChange={onTargetChange}
            />
          </Form.Item>
        )}

        {targetType === 'URL' && (
          <Form.Item
            label="URL"
            name="URL"
            rules={[
              { required: true, message: `${t('target')}${tv('required')}` },
            ]}
          >
            <Input placeholder="URL" />
          </Form.Item>
        )}
        {targetType === 'URL' && (
          <Form.Item
            label={`URL ${t('parameters')}`}
            name="queryName"
            rules={[
              {
                required: true,
                message: `URL ${t('parameters')}${tv('required')}`,
              },
            ]}
          >
            <Input placeholder={`URL${t('parameters')}`} />
          </Form.Item>
        )}
        {chartGroupColumns?.length > 1 && (
          <Form.Item
            label={t('associatedFields')}
            name="field"
            rules={[
              {
                required: true,
                message: `${t('associatedFields')}${tv('required')}`,
              },
            ]}
          >
            <SelectJumpFields
              form={form}
              chartGroupColumns={chartGroupColumns}
            ></SelectJumpFields>
          </Form.Item>
        )}
        {targetType === 'INTERNAL' && (
          <Form.Item
            label={t('controller')}
            name="filter"
            rules={[
              {
                required: true,
                message: `${t('controller')}${tv('required')}`,
              },
            ]}
          >
            <FilterSelect
              loading={controllerLoading}
              options={controllers}
              placeholder={t('controller')}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
