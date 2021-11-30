import {
  BarChartOutlined,
  FolderFilled,
  FolderOpenFilled,
  FundFilled,
} from '@ant-design/icons';
import { Form, Modal, ModalProps } from 'antd';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
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
import { FilterSelect } from './FilterSelect';
import { fetchGlobalControllerOptions } from './service';
import { TargetTreeSelect } from './TargetTreeSelect';
import { ControlOptionItem } from './types';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
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
    if (jumpVisible && _jumpConfig) {
      onGetController(curJumpWidget?.config?.jumpConfig?.target);
      form.setFieldsValue(_jumpConfig);
    }
  }, [jumpVisible, curJumpWidget, form, onGetController]);
  useEffect(() => {
    setWidgetId(jumpWidgetId);
  }, [jumpWidgetId]);

  const onTargetChange = useCallback(
    value => {
      form.setFieldsValue({ filter: undefined });
      onGetController(value);
    },
    [form, onGetController],
  );
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
      const newWidget = produce(curJumpWidget, draft => {
        draft.config.jumpConfig = { ...values };
        draft.config.jumpConfig!.open = true;
      });
      handleClose();
      dispatch(editBoardStackActions.updateWidget(newWidget));
    },
    [dispatch, curJumpWidget, handleClose],
  );
  return (
    <Modal
      title="设置跳转"
      visible={visible}
      width={520}
      {...restProps}
      onOk={form.submit}
      onCancel={handleClose}
    >
      <Form {...formItemLayout} form={form} onFinish={onFinish}>
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
      </Form>
    </Modal>
  );
};
