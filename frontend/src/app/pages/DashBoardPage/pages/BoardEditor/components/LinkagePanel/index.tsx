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

import { Form, Modal } from 'antd';
import {
  selectDataChartById,
  selectViewMap,
} from 'app/pages/DashBoardPage/pages/Board/slice/selector';
import {
  BoardState,
  Relation,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getChartDataRequestBuilder } from 'app/pages/DashBoardPage/utils';
import {
  convertToWidgetMap,
  getCanLinkFilterWidgets,
} from 'app/pages/DashBoardPage/utils/widget';
import produce from 'immer';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editBoardStackActions, editDashBoardInfoActions } from '../../slice';
import {
  selectLinkagePanel,
  selectSortAllWidgets,
} from '../../slice/selectors';
import { diffViewLinkageItem, LinkageFields } from './LinkageFields';
import { LinkageOpenUse } from './LinkageOpenUse';
import { LinkageWidgets } from './linkageWidgets';
export interface LinkagePanelProps {}
export const LinkagePanel: React.FC<LinkagePanelProps> = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { type, widgetId } = useSelector(selectLinkagePanel);
  const allWidgets = useSelector(selectSortAllWidgets);
  const viewMap = useSelector(selectViewMap);
  const widgets = useMemo(
    () => getCanLinkFilterWidgets(allWidgets).filter(w => w.id !== widgetId),
    [allWidgets, widgetId],
  );

  // selectDataChartById
  const widgetMap = useMemo(() => convertToWidgetMap(allWidgets), [allWidgets]);

  const [visible, setVisible] = useState(false);
  // const [sameViewWidgetIds, setSameViewWidgetIds] = useState<string[]>([]);
  const sameViewWidgetIds = useRef<string[]>([]);
  const linkagesRef = useRef<diffViewLinkageItem[]>([]);
  useEffect(() => {
    const hide = !type || type === 'hide';
    setVisible(!hide);
  }, [type]);
  const curWidget = useMemo(() => widgetMap[widgetId], [widgetId, widgetMap]);
  const dataChart = useSelector((state: { board: BoardState }) =>
    selectDataChartById(state, curWidget?.datachartId),
  );
  const chartGroupColumns = useMemo(() => {
    if (!dataChart) {
      return [];
    }
    const builder = getChartDataRequestBuilder(dataChart);
    let groupColumns = builder.buildGroupColumns();
    return groupColumns;
  }, [dataChart]);

  const formItemStyles = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const onSubmit = useCallback(() => {
    // handle onFinish
    form.submit();
  }, [form]);
  const afterClose = useCallback(() => {
    form.resetFields();
    dispatch(
      editDashBoardInfoActions.changeLinkagePanel({
        type: 'hide',
        widgetId: '',
      }),
    );
  }, [dispatch, form]);
  const onFinish = useCallback(
    (values: { diffLinkages: diffViewLinkageItem[]; open: boolean }) => {
      // console.log('--0 values', values);
      const diffLinkages = values.diffLinkages;
      // console.log('-links-', diffLinkages);
      const sourceId = curWidget.id;
      const newRelations: Relation[] = [];
      sameViewWidgetIds.current.forEach(targetId => {
        // TODO 暂时选择第一个 后需添加都加入
        const item: Relation = {
          sourceId,
          targetId,
          config: {
            type: 'widgetToWidget',
            widgetToWidget: {
              sameView: true,
              triggerColumn: '',
              linkerColumn: '',
            },
          },
        };
        newRelations.push(item);
      });
      if (diffLinkages) {
        diffLinkages.forEach(diffLink => {
          const item: Relation = {
            sourceId,
            targetId: diffLink.linkerId,
            config: {
              type: 'widgetToWidget',
              widgetToWidget: {
                sameView: false,
                triggerColumn: diffLink.triggerColumn!,
                linkerColumn: diffLink.linkerColumn!,
              },
            },
          };
          newRelations.push(item);
        });
      }
      const newWidget = produce(curWidget, draft => {
        draft.relations = newRelations;
        draft.config.linkageConfig = {
          open: newRelations.length > 0 ? values.open : false,
          chartGroupColumns,
        };
      });
      dispatch(editBoardStackActions.updateWidget(newWidget));
      setVisible(false);
    },
    [chartGroupColumns, curWidget, dispatch],
  );
  const setColNames = useCallback(
    (pickedIds: string[]) => {
      const sameIds: string[] = [];
      const diffIds: string[] = [];

      pickedIds.forEach(pickedId => {
        if (curWidget?.viewIds[0] === widgetMap[pickedId]?.viewIds?.[0]) {
          sameIds.push(pickedId);
        } else {
          diffIds.push(pickedId);
        }
      });
      sameViewWidgetIds.current = sameIds;
      const linkages: diffViewLinkageItem[] =
        form?.getFieldValue('diffLinkages') || [];
      const nextDiffLinkages: diffViewLinkageItem[] = [];
      diffIds.forEach(pickedId => {
        const widget = widgetMap[pickedId];
        if (!widget) return;
        const linkerViewId = widget.viewIds?.[0];
        const oldItem = linkages.find(item => item.linkerId === pickedId);
        if (oldItem) {
          nextDiffLinkages.push({ ...oldItem });
        } else {
          const newItem: diffViewLinkageItem = {
            triggerViewId: curWidget.viewIds[0],
            triggerColumn: undefined,
            linkerId: pickedId,
            linkerName: widgetMap[pickedId]?.config.name,
            linkerViewId: linkerViewId,
            linkerColumn: undefined,
          };
          nextDiffLinkages.push(newItem);
        }
      });
      linkagesRef.current = nextDiffLinkages;
      form?.setFieldsValue({ diffLinkages: nextDiffLinkages });
    },
    [curWidget?.viewIds, form, widgetMap],
  );
  useEffect(() => {
    if (!curWidget) {
      setColNames([]);
      return;
    }

    const relations = curWidget.relations
      .filter(ele => ele.config.type === 'widgetToWidget')
      .filter(ele => {
        if (ele.config.widgetToWidget && !ele.config.widgetToWidget.sameView) {
          return true;
        }
        return false;
      });
    const diffLinkages: diffViewLinkageItem[] = [];
    relations.forEach(re => {
      const link = re.config.widgetToWidget;
      if (!widgetMap[re.targetId]) {
        return;
      }
      const linkWidget = widgetMap[re.targetId];
      const item: diffViewLinkageItem = {
        triggerViewId: curWidget.viewIds[0],
        triggerColumn: link?.triggerColumn,
        linkerViewId: linkWidget.viewIds[0],
        linkerColumn: link?.linkerColumn,
        linkerId: linkWidget.id,
        linkerName: linkWidget.config.name,
      };
      diffLinkages.push(item);
    });
    const open = curWidget.config.linkageConfig?.open;
    form?.setFieldsValue({ diffLinkages: diffLinkages, open: open });
  }, [curWidget, form, setColNames, widgetMap]);
  return (
    <Modal
      title={`${type} 联动`}
      visible={visible}
      onOk={onSubmit}
      centered
      destroyOnClose
      width={1100}
      afterClose={afterClose}
      onCancel={() => setVisible(false)}
    >
      <Form
        form={form}
        size="middle"
        {...formItemStyles}
        requiredMark={false}
        onFinish={onFinish}
        preserve
      >
        <h3>{curWidget?.config.name}</h3>

        <LinkageOpenUse />
        <LinkageWidgets
          curWidget={curWidget}
          widgets={widgets}
          onChange={setColNames}
        />
        {curWidget && (
          <LinkageFields
            chartGroupColumns={chartGroupColumns}
            curWidget={curWidget}
            form={form}
            viewMap={viewMap}
          />
        )}
      </Form>
    </Modal>
  );
});
