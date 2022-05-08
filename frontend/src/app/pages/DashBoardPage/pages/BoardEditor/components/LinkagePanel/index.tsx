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
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { getCanLinkageWidgets } from 'app/pages/DashBoardPage/components/Widgets/DataChartWidget/config';
import {
  selectDataChartById,
  selectViewMap,
} from 'app/pages/DashBoardPage/pages/Board/slice/selector';
import {
  BoardState,
  Relation,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { getChartGroupColumns } from 'app/pages/DashBoardPage/utils';
import { convertToWidgetMap } from 'app/pages/DashBoardPage/utils/widget';
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
import { LinkageFields, ViewLinkageItem } from './LinkageFields';
import { LinkageWidgets } from './linkageWidgets';

export interface LinkagePanelProps {}
export const LinkagePanel: React.FC<LinkagePanelProps> = memo(() => {
  const t = useI18NPrefix(`viz.linkage`);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { type, widgetId } = useSelector(selectLinkagePanel);
  const allWidgets = useSelector(selectSortAllWidgets);
  const viewMap = useSelector(selectViewMap);
  const widgets = useMemo(
    () =>
      getCanLinkageWidgets(allWidgets as any).filter(w => w.id !== widgetId),
    [allWidgets, widgetId],
  );
  const widgetMap = useMemo(() => convertToWidgetMap(allWidgets), [allWidgets]);

  const [visible, setVisible] = useState(false);

  const sameViewWidgetIds = useRef<string[]>([]);
  const linkagesRef = useRef<ViewLinkageItem[]>([]);
  useEffect(() => {
    const hide = !type || type === 'hide';
    setVisible(!hide);
  }, [type]);
  const curWidget = useMemo(() => widgetMap[widgetId], [widgetId, widgetMap]);
  const dataChart = useSelector((state: { board: BoardState }) =>
    selectDataChartById(state, curWidget?.datachartId),
  );
  const chartGroupColumns = getChartGroupColumns(
    dataChart?.config?.chartConfig?.datas,
  );

  const formItemStyles = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const onSubmit = useCallback(() => {
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
    (values: { viewLinkages: ViewLinkageItem[]; open: boolean }) => {
      const viewLinkages = values.viewLinkages;

      const sourceId = curWidget.id;
      const newRelations: Relation[] = [];

      if (viewLinkages) {
        viewLinkages.forEach(linkItem => {
          const item: Relation = {
            sourceId,
            targetId: linkItem.linkerId,
            config: {
              type: 'widgetToWidget',
              widgetToWidget: {
                sameView: false,
                triggerColumn: linkItem.triggerColumn!,
                linkerColumn: linkItem.linkerColumn!,
              },
            },
          };
          newRelations.push(item);
        });
      }
      const newWidget = produce(curWidget, draft => {
        draft.relations = newRelations;
        draft.config.linkageConfig = {
          open: newRelations.length > 0 ? true : false,
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
        if (curWidget?.viewIds?.[0] === widgetMap[pickedId]?.viewIds?.[0]) {
          sameIds.push(pickedId);
        } else {
          diffIds.push(pickedId);
        }
      });
      sameViewWidgetIds.current = sameIds;
      const linkages: ViewLinkageItem[] =
        form?.getFieldValue('viewLinkages') || [];
      const nextViewLinkages: ViewLinkageItem[] = [];
      sameIds.forEach(sameId => {
        const widget = widgetMap[sameId];
        if (!widget) return;
        const linkerViewId = widget?.viewIds?.[0];
        const oldItem = linkages.find(item => item.linkerId === sameId);
        if (oldItem) {
          nextViewLinkages.push({ ...oldItem });
        } else {
          const newItem: ViewLinkageItem = {
            sameView: true,
            triggerViewId: curWidget?.viewIds[0],
            triggerColumn: chartGroupColumns?.[0]?.colName,
            linkerId: sameId,
            linkerName: widgetMap[sameId]?.config.name,
            linkerViewId: linkerViewId,
            linkerColumn: chartGroupColumns?.[0]?.colName,
          };
          nextViewLinkages.push(newItem);
        }
      });
      diffIds.forEach(pickedId => {
        const widget = widgetMap[pickedId];
        if (!widget) return;
        const linkerViewId = widget?.viewIds?.[0];
        const oldItem = linkages.find(item => item.linkerId === pickedId);
        if (oldItem) {
          nextViewLinkages.push({ ...oldItem });
        } else {
          const newItem: ViewLinkageItem = {
            sameView: false,
            triggerViewId: curWidget?.viewIds[0],
            triggerColumn: chartGroupColumns?.[0]?.colName,
            linkerId: pickedId,
            linkerName: widgetMap[pickedId]?.config.name,
            linkerViewId: linkerViewId,
            linkerColumn: undefined,
          };
          nextViewLinkages.push(newItem);
        }
      });
      linkagesRef.current = nextViewLinkages;
      form?.setFieldsValue({ viewLinkages: nextViewLinkages });
    },
    [chartGroupColumns, curWidget?.viewIds, form, widgetMap],
  );
  useEffect(() => {
    if (!curWidget) {
      setColNames([]);
      return;
    }

    const relations = curWidget.relations.filter(
      ele => ele.config.type === 'widgetToWidget',
    );

    const viewLinkages: ViewLinkageItem[] = [];
    relations.forEach(re => {
      const link = re.config.widgetToWidget;
      if (!widgetMap[re.targetId]) {
        return;
      }
      const linkWidget = widgetMap[re.targetId];
      const item: ViewLinkageItem = {
        sameView: curWidget?.viewIds?.[0] === linkWidget?.viewIds?.[0],
        triggerViewId: curWidget?.viewIds?.[0],
        triggerColumn: link?.triggerColumn,
        linkerViewId: linkWidget?.viewIds?.[0],
        linkerColumn: link?.linkerColumn,
        linkerId: linkWidget.id,
        linkerName: linkWidget.config.name,
      };
      viewLinkages.push(item);
    });
    const open = curWidget.config.linkageConfig?.open;
    form?.setFieldsValue({ viewLinkages: viewLinkages, open: open });
  }, [curWidget, form, setColNames, widgetMap]);
  return (
    <Modal
      title={t('title')}
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

        <LinkageWidgets
          curWidget={curWidget}
          widgets={widgets as any}
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
