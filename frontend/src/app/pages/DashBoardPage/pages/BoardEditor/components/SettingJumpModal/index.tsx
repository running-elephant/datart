import {
  BarChartOutlined,
  FolderFilled,
  FolderOpenFilled,
  FundFilled,
} from '@ant-design/icons';
import { Form, Modal, ModalProps, Radio } from 'antd';
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
import { fetchGlobalFiltersOptions } from './service';
import { TargetTreeSelect } from './TargetTreeSelect';
import { FilterOptionItem } from './types';
const USE_OPTIONS = [
  { label: '是', value: true },
  { label: '否', value: false },
];
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
  const [filterLoading, setfilterLoading] = useState(false);
  const [widgetId, setWidgetId] = useState('');
  const [filters, setFilters] = useState<FilterOptionItem[]>([]);
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
  const onGetFileters = useCallback(targetValue => {
    const relId = targetValue?.relId,
      relType = targetValue?.relType;
    if (relId && relType) {
      setfilterLoading(true);
      fetchGlobalFiltersOptions(relId, relType)
        .then(data => setFilters(data))
        .finally(() => {
          setfilterLoading(false);
        });
    } else {
      setFilters([]);
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
      onGetFileters(curJumpWidget?.config?.jumpConfig?.target);
      form.setFieldsValue(_jumpConfig);
    }
  }, [jumpVisible, curJumpWidget, form, onGetFileters]);
  useEffect(() => {
    setWidgetId(jumpWidgetId);
  }, [jumpWidgetId]);

  const onTargetChange = useCallback(
    value => {
      form.setFieldsValue({ filter: undefined });
      onGetFileters(value);
    },
    [form, onGetFileters],
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
          name="open"
          label="是否启用"
          initialValue={false}
          rules={[{ required: true, message: '是否启用不能为空' }]}
        >
          <Radio.Group options={USE_OPTIONS} />
        </Form.Item>
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
            loading={filterLoading}
            options={filters}
            placeholder="请选择关联筛选"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
