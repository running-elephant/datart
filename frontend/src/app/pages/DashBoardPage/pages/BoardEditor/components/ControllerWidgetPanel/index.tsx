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
import { Split } from 'app/components';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { selectViewMap } from 'app/pages/DashBoardPage/pages/Board/slice/selector';
import {
  ControllerWidgetContent,
  RelatedView,
  Relation,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import {
  convertToWidgetMap,
  createFilterWidget,
  getCanLinkFilterWidgets,
  getOtherStringControlWidgets,
} from 'app/pages/DashBoardPage/utils/widget';
import {
  ChartDataViewFieldCategory,
  ChartDataViewFieldType,
} from 'app/types/ChartDataView';
import produce from 'immer';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SPACE_XS } from 'styles/StyleConstants';
import { v4 as uuidv4 } from 'uuid';
import { editBoardStackActions, editDashBoardInfoActions } from '../../slice';
import {
  selectControllerPanel,
  selectSortAllWidgets,
} from '../../slice/selectors';
import { addWidgetsToEditBoard } from '../../slice/thunk';
import { WidgetControlForm } from './ControllerConfig';
import { RelatedViewForm } from './RelatedViewForm';
import { RelatedWidgetItem, RelatedWidgets } from './RelatedWidgets';
import { ControllerConfig } from './types';
import {
  getInitWidgetController,
  postControlConfig,
  preformatWidgetFilter,
} from './utils';

const FilterWidgetPanel: React.FC = memo(props => {
  const dispatch = useDispatch();
  const t = useI18NPrefix('viz.common.enum.controllerFacadeTypes');
  const { type, widgetId, controllerType } = useSelector(selectControllerPanel);
  const { boardId, boardType, queryVariables } = useContext(BoardContext);

  const allWidgets = useSelector(selectSortAllWidgets);
  const widgets = useMemo(
    () => getCanLinkFilterWidgets(allWidgets),
    [allWidgets],
  );
  const otherStrFilterWidgets = useMemo(
    () => getOtherStringControlWidgets(allWidgets, widgetId),
    [allWidgets, widgetId],
  );
  const widgetMap = useMemo(() => convertToWidgetMap(allWidgets), [allWidgets]);
  const viewMap = useSelector(selectViewMap);

  const [relatedWidgets, setRelatedWidgets] = useState<RelatedWidgetItem[]>([]);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const hide = !type || type === 'hide';
    setVisible(!hide);
  }, [type]);
  const [form] = Form.useForm<ControllerWidgetContent>();

  const curFilterWidget = useMemo(
    () => widgetMap[widgetId] || undefined,
    [widgetId, widgetMap],
  );

  const getFormRelatedViews = useCallback(() => {
    return form?.getFieldValue('relatedViews') as RelatedView[];
  }, [form]);

  const setViewsRelatedView = useCallback(
    (relatedWidgets: RelatedWidgetItem[]) => {
      const relatedViews = getFormRelatedViews();
      const nextRelatedViews: RelatedView[] = [];
      relatedWidgets.forEach(widgetItem => {
        const oldViewItem = relatedViews?.find(
          view => view.viewId === widgetItem.viewId && viewMap[view.viewId],
        );
        const newViewItem = nextRelatedViews.find(
          view => view.viewId === widgetItem.viewId && viewMap[view.viewId],
        );
        if (!newViewItem) {
          if (oldViewItem) {
            nextRelatedViews.push({ ...oldViewItem });
          } else {
            const view = viewMap[widgetItem.viewId];
            if (!view) return;
            const relatedView: RelatedView = {
              viewId: view.id,
              relatedCategory: ChartDataViewFieldCategory.Field,
              fieldValue: '',
              fieldValueType: ChartDataViewFieldType.STRING,
            };
            nextRelatedViews.push(relatedView);
          }
        }
      });
      return nextRelatedViews;
    },
    [getFormRelatedViews, viewMap],
  );
  const setFormRelatedViews = useCallback(
    (nextRelatedViews: RelatedView[]) => {
      form?.setFieldsValue({ relatedViews: nextRelatedViews });
    },
    [form],
  );
  // 初始化数据
  useEffect(() => {
    if (!curFilterWidget || !curFilterWidget?.relations) {
      form.setFieldsValue({
        config: preformatWidgetFilter(getInitWidgetController(controllerType)),
        relatedViews: [],
      });
      return;
    }
    const confContent = curFilterWidget.config
      .content as ControllerWidgetContent;
    const oldRelations = curFilterWidget?.relations;
    const oldRelatedWidgetIds = oldRelations
      .filter(t => widgetMap[t.targetId])
      .map(t => {
        const tt: RelatedWidgetItem = {
          widgetId: t.targetId,
          viewId: widgetMap[t.targetId].viewIds?.[0],
        };
        return tt;
      });
    setRelatedWidgets(oldRelatedWidgetIds);
    setFormRelatedViews(setViewsRelatedView(oldRelatedWidgetIds));
    const oldRelatedViews = confContent.relatedViews.filter(t => t.viewId);
    form?.setFieldsValue({ relatedViews: oldRelatedViews });

    const { config } = confContent;
    form.setFieldsValue({
      ...confContent,
      relatedViews: oldRelatedViews,
      config: preformatWidgetFilter(config),
    });
  }, [
    curFilterWidget,
    controllerType,
    form,
    widgetMap,
    setFormRelatedViews,
    setViewsRelatedView,
  ]);

  const onFinish = useCallback(
    (values: ControllerWidgetContent) => {
      console.log('--values', values);

      const { relatedViews, config, name } = values;
      if (type === 'add') {
        const sourceId = uuidv4();
        const controlToWidgetRelations: Relation[] = relatedWidgets
          .filter(relatedWidgetItem => {
            return widgetMap[relatedWidgetItem.widgetId];
          })
          .map(relatedWidgetItem => {
            const widget = widgetMap[relatedWidgetItem.widgetId];
            const relation: Relation = {
              sourceId,
              targetId: widget.id,
              config: {
                type: 'controlToWidget',
                controlToWidget: {
                  widgetRelatedViewIds: widget.viewIds,
                },
              },
              id: uuidv4(),
            };
            return relation;
          });
        let newRelations = [...controlToWidgetRelations];
        const ControllerVisibility = (config as ControllerConfig).visibility;
        if (ControllerVisibility) {
          const { visibilityType, condition } = ControllerVisibility;
          if (visibilityType === 'condition' && condition) {
            const controlToControlRelation: Relation = {
              sourceId,
              targetId: condition.dependentControllerId,
              config: {
                type: 'controlToControl',
              },
              id: uuidv4(),
            };
            newRelations = newRelations.concat([controlToControlRelation]);
          }
        }

        const widget = createFilterWidget({
          boardId,
          boardType,
          name,
          relations: newRelations,
          controllerType: controllerType!,
          views: relatedViews,
          config: postControlConfig(config, controllerType!),
          hasVariable: false,
        });

        dispatch(addWidgetsToEditBoard([widget]));
      } else if (type === 'edit') {
        const sourceId = curFilterWidget.id;

        const controlToWidgetRelations: Relation[] = relatedWidgets
          .filter(relatedWidgetItem => {
            return widgetMap[relatedWidgetItem.widgetId];
          })
          .map(relatedWidgetItem => {
            const widget = widgetMap[relatedWidgetItem.widgetId];
            return {
              sourceId,
              targetId: widget.id,
              config: {
                type: 'controlToWidget',
                controlToWidget: {
                  widgetRelatedViewIds: widget.viewIds,
                },
              },
              id: uuidv4(),
            };
          });
        let newRelations = [...controlToWidgetRelations];
        const controllerVisible = (config as ControllerConfig).visibility;
        if (controllerVisible) {
          const { visibilityType, condition } = controllerVisible;
          if (visibilityType === 'condition' && condition) {
            const controlToControlRelation: Relation = {
              sourceId,
              targetId: condition.dependentControllerId,
              config: {
                type: 'controlToControl',
              },
              id: uuidv4(),
            };
            newRelations = newRelations.concat([controlToControlRelation]);
          }
        }
        const nextContent: ControllerWidgetContent = {
          ...(curFilterWidget.config.content as ControllerWidgetContent),
          name,
          relatedViews,
          config: postControlConfig(config, controllerType),
        };

        const newWidget = produce(curFilterWidget, draft => {
          draft.relations = newRelations;
          draft.config.name = name;
          draft.config.content = nextContent;
        });
        dispatch(editBoardStackActions.updateWidget(newWidget));
      }
      setVisible(false);
    },
    [
      boardId,
      boardType,
      controllerType,
      curFilterWidget,
      dispatch,
      relatedWidgets,
      type,
      widgetMap,
    ],
  );
  const onSubmit = useCallback(() => {
    form.submit();
  }, [form]);

  const formItemStyles = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const afterClose = useCallback(() => {
    form.resetFields();
    setRelatedWidgets([]);
    dispatch(
      editDashBoardInfoActions.changeControllerPanel({
        type: 'hide',
        widgetId: '',
        controllerType: undefined,
      }),
    );
  }, [dispatch, form]);
  const onChangeRelatedWidgets = (values: string[]) => {
    const relatedWidgets = values.map(t => {
      const item: RelatedWidgetItem = {
        widgetId: t,
        viewId: widgetMap[t].viewIds?.[0],
      };
      return item;
    });
    setRelatedWidgets(relatedWidgets);
    setFormRelatedViews(setViewsRelatedView(relatedWidgets));
  };
  return (
    <Modal
      title={`${type} ${t(controllerType || '')}`}
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
        <Container className="datart-split">
          <div>
            <WidgetControlForm
              controllerType={controllerType!}
              otherStrFilterWidgets={otherStrFilterWidgets}
              boardType={boardType}
              viewMap={viewMap}
              form={form}
            />
          </div>
          <div className="split-left">
            <RelatedWidgets
              relatedWidgets={relatedWidgets}
              widgets={widgets}
              onChange={onChangeRelatedWidgets}
            />
            <RelatedViewForm
              form={form}
              viewMap={viewMap}
              queryVariables={queryVariables}
              getFormRelatedViews={getFormRelatedViews}
            />
          </div>
        </Container>
      </Form>
    </Modal>
  );
});

export default FilterWidgetPanel;
const Container = styled(Split)`
  display: flex;
  flex: 1;

  .split-left {
    padding: ${SPACE_XS};
    background-color: ${p => p.theme.componentBackground};
    border-right: 1px solid ${p => p.theme.borderColorSplit};
  }
`;
