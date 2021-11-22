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
import { ControllerFacadeTypes } from 'app/types/FilterControlPanel';
import produce from 'immer';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { WidgetControlForm } from './ControllerOption';
import { RelatedViewForm } from './RelatedViewForm';
import { RelatedWidgetItem, RelatedWidgets } from './RelatedWidgets';
import { ValueTypes, WidgetControllerOption } from './types';
import {
  formatWidgetFilter,
  getInitWidgetFilter,
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
  const [form] = Form.useForm();
  const curFilterWidget = useMemo(
    () => widgetMap[widgetId] || undefined,
    [widgetId, widgetMap],
  );

  const [fieldValueType, setFieldValueType] = useState<ValueTypes>(
    ChartDataViewFieldType.STRING,
  );
  const [fieldCategory, setFieldCategory] =
    useState<ChartDataViewFieldCategory>(ChartDataViewFieldCategory.Field);

  let widgetList = useRef<RelatedWidgetItem[]>([]);

  const getFormRelatedViews = useCallback(() => {
    return form?.getFieldValue('relatedViews') as RelatedView[];
  }, [form]);

  const onChangeFieldProps = useCallback(
    (views: RelatedView[] | undefined) => {
      let relatedViews: RelatedView[] = [];
      if (views) {
        relatedViews = views;
      } else {
        relatedViews = getFormRelatedViews();
      }

      const trimmedViews = relatedViews.filter(
        item => item.fieldValue && item.fieldValueType,
      );
      if (!trimmedViews || trimmedViews.length < 1) {
        setFieldValueType(ChartDataViewFieldType.STRING);
        return;
      }
      setFieldValueType(
        trimmedViews[0].fieldValueType || ChartDataViewFieldType.STRING,
      );
      const hasVariable = trimmedViews.find(
        view => view.relatedCategory === ChartDataViewFieldCategory.Variable,
      );
      // 如果有变量 就按变量处理

      setFieldCategory(
        hasVariable
          ? ChartDataViewFieldCategory.Variable
          : ChartDataViewFieldCategory.Field,
      );

      form.validateFields();
    },
    [form, getFormRelatedViews],
  );
  const setViews = useCallback(
    (relatedWidgets: RelatedWidgetItem[]) => {
      const relatedViews = getFormRelatedViews();
      const nextRelatedViews: RelatedView[] = [];
      relatedWidgets.forEach(option => {
        const widget = widgetMap[option.widgetId];
        if (!widget) return;
        widget.viewIds.forEach((viewId, index) => {
          const oldViewItem = relatedViews?.find(
            view => view.viewId === viewId,
          );
          const newViewItem = nextRelatedViews.find(
            view => view.viewId === viewId,
          );
          if (!newViewItem) {
            if (oldViewItem) {
              nextRelatedViews.push({ ...oldViewItem });
            } else {
              const view = viewMap[viewId];
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
      });
      form?.setFieldsValue({ relatedViews: nextRelatedViews });
      onChangeFieldProps(nextRelatedViews);
    },
    [form, getFormRelatedViews, onChangeFieldProps, viewMap, widgetMap],
  );

  // 初始化数据
  useEffect(() => {
    if (!curFilterWidget || !curFilterWidget?.relations) {
      setViews([]);
      form.setFieldsValue({
        controllerOption: preformatWidgetFilter(getInitWidgetFilter()),
        type: '',
        fieldValueType: ChartDataViewFieldType.STRING,
      });

      return;
    }
    const confContent = curFilterWidget.config
      .content as ControllerWidgetContent;
    try {
      const { relatedViews, type, controllerOption } = confContent;
      form.setFieldsValue({
        type,
        filterName: curFilterWidget.config.name,
        relatedViews,
        controllerOption: preformatWidgetFilter(controllerOption),
      });
    } catch (error) {}
    const widgetOptions = curFilterWidget?.relations
      .filter(ele => ele.config.type === 'filterToWidget')
      .map(item => {
        const option: RelatedWidgetItem = {
          widgetId: item.targetId,
        };
        return option;
      });
    setViews(widgetOptions);
  }, [curFilterWidget, setViews, form]);

  const onFinish = useCallback(
    values => {
      console.log('--values', values);
      console.log('--fieldValueType', fieldValueType);
      console.log('--fieldCategory', fieldCategory);
      console.log('--type', type);
      const { relatedViews, controllerOption, name } = values;
      if (type === 'add') {
        const sourceId = uuidv4();
        const filterToWidgetRelations: Relation[] = relatedWidgets.map(
          option => {
            const widget = widgetMap[option.widgetId];
            const relation: Relation = {
              sourceId,
              targetId: widget.id,
              config: {
                type: 'filterToWidget',
                filterToWidget: {
                  widgetRelatedViewIds: widget.viewIds,
                },
              },
              id: uuidv4(),
            };
            return relation;
          },
        );
        const newRelations = [...filterToWidgetRelations];
        const ControllerVisibility = (
          controllerOption as WidgetControllerOption
        ).visibility;
        if (ControllerVisibility) {
          const { visibilityType, condition } = ControllerVisibility;
          if (visibilityType === 'condition' && condition) {
            const filterToFilterRelation: Relation = {
              sourceId,
              targetId: condition.dependentFilterId,
              config: {
                type: 'filterToFilter',
              },
              id: uuidv4(),
            };
            newRelations.concat([filterToFilterRelation]);
          }
        }

        const widget = createFilterWidget({
          boardId,
          boardType,
          name,
          relations: newRelations,
          controllerType: controllerType!,
          views: relatedViews,
          fieldValueType: fieldValueType,
          controllerOption: formatWidgetFilter(controllerOption),
          hasVariable: fieldCategory === ChartDataViewFieldCategory.Variable,
        });

        dispatch(addWidgetsToEditBoard([widget]));
      } else if (type === 'edit') {
        const sourceId = curFilterWidget.id;

        const filterToWidgetRelations: Relation[] = widgetList.current
          .filter(option => {
            return widgetMap[option.widgetId];
          })
          .map(option => {
            const widget = widgetMap[option.widgetId];
            return {
              sourceId,
              targetId: widget.id,
              config: {
                type: 'filterToWidget',
                filterToWidget: {
                  widgetRelatedViewIds: widget.viewIds,
                },
              },
              id: uuidv4(),
            };
          });
        const newRelations = [...filterToWidgetRelations];
        const controllerVisible = (controllerOption as WidgetControllerOption)
          .visibility;
        if (controllerVisible) {
          const { visibilityType, condition } = controllerVisible;
          if (visibilityType === 'condition' && condition) {
            const filterToFilterRelation: Relation = {
              sourceId,
              targetId: condition.dependentFilterId,
              config: {
                type: 'filterToFilter',
              },
              id: uuidv4(),
            };
            newRelations.concat([filterToFilterRelation]);
          }
        }
        const nextContent: ControllerWidgetContent = {
          ...curFilterWidget.config.content,
          name: '',
          relatedViews,
          type: ControllerFacadeTypes.DropdownList,
          controllerOption: formatWidgetFilter(controllerOption),
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
      fieldCategory,
      fieldValueType,
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
      };
      return item;
    });
    setRelatedWidgets(relatedWidgets);
    setViews(relatedWidgets);
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
              fieldCategory={fieldCategory}
              fieldValueType={fieldValueType}
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
              fieldValueType={fieldValueType}
              viewMap={viewMap}
              queryVariables={queryVariables}
              onChangeFieldProps={onChangeFieldProps}
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
