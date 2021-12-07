import {
  BarChartOutlined,
  FolderFilled,
  FolderOpenFilled,
  FundFilled,
} from '@ant-design/icons';
import { Form, Input, Modal, ModalProps, Select } from 'antd';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { selectDataChartById } from 'app/pages/DashBoardPage/pages/Board/slice/selector';
import { BoardState } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getChartDataRequestBuilder } from 'app/pages/DashBoardPage/utils';
import { convertToWidgetMap } from 'app/pages/DashBoardPage/utils/widget';
import { makeSelectVizTree } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import { Folder } from 'app/pages/MainPage/pages/VizPage/slice/types';
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
import { jumpTypes } from './config';
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

  const getIcon = useCallback(({ relType }: Folder) => {
    switch (relType) {
      case 'DASHBOARD':
        return <FundFilled />;
      case 'DATACHART':
        return <BarChartOutlined />;
      default:
        return p => (p.expanded ? <FolderOpenFilled /> : <FolderFilled />);
    }
  }, []);
  const treeData = useSelector(state => selectVizTree(state, { getIcon }));
  useEffect(() => {
    const _jumpConfig = curJumpWidget?.config?.jumpConfig;
    setVisible(jumpVisible);
    setTargetType(_jumpConfig?.targetType || jumpTypes[0].value);
    if (jumpVisible && _jumpConfig) {
      if (
        curJumpWidget?.config?.jumpConfig?.targetType === 'DASHBOARD_DATACHART'
      ) {
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
  const chartGroupColumns = useMemo(() => {
    if (!dataChart) {
      return [];
    }
    const builder = getChartDataRequestBuilder(dataChart);
    let groupColumns = builder.buildGroupColumns();
    return groupColumns;
  }, [dataChart]);
  const onTargetChange = useCallback(
    value => {
      form.setFieldsValue({ filter: undefined });
      onGetController(value);
    },
    [form, onGetController],
  );
  const onTargetTypeChange = useCallback(value => {
    setTargetType(value);
    // form.setFieldsValue({ filter: undefined });
    // onGetController(value);
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
      title="跳转设置"
      visible={visible}
      width={520}
      {...restProps}
      onOk={form.submit}
      onCancel={handleClose}
    >
      <Form {...formItemLayout} form={form} onFinish={onFinish}>
        <Form.Item
          label="跳转类型"
          name="targetType"
          initialValue={'DASHBOARD_DATACHART'}
          rules={[{ required: true, message: '跳转类型不能为空' }]}
        >
          <Select onChange={onTargetTypeChange}>
            {jumpTypes.map(({ name, value }) => (
              <Option key={value} value={value}>
                {name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {targetType === 'DASHBOARD_DATACHART' && (
          <Form.Item
            label="跳转目标"
            name="target"
            rules={[{ required: true, message: '跳转目标不能为空' }]}
          >
            <TargetTreeSelect
              filterBoardId={boardId}
              treeData={treeData}
              onChange={onTargetChange}
            />
          </Form.Item>
        )}

        {targetType === 'HTTP' && (
          <Form.Item
            label="HTTP URL"
            name="httpUrl"
            rules={[{ required: true, message: '跳转目标HTTP URL不能为空' }]}
          >
            <Input placeholder="请输入跳转地址" />
          </Form.Item>
        )}
        {targetType === 'HTTP' && (
          <Form.Item
            label="URL参数"
            name="queryName"
            rules={[{ required: true, message: 'URL参数名称不能为空' }]}
          >
            <Input placeholder="请输入跳转地址的参数" />
          </Form.Item>
        )}
        {chartGroupColumns?.length > 1 && (
          <Form.Item
            label="关联字段"
            name="field"
            rules={[{ required: true, message: '请选择关联字段' }]}
          >
            <SelectJumpFields
              chartGroupColumns={chartGroupColumns}
            ></SelectJumpFields>
          </Form.Item>
        )}
        {targetType === 'DASHBOARD_DATACHART' && (
          <Form.Item
            label="关联筛选"
            name="filter"
            rules={[{ required: true, message: '关联筛选不能为空' }]}
          >
            <FilterSelect
              loading={controllerLoading}
              options={controllers}
              placeholder="请选择关联筛选"
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
