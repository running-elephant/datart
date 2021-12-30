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
import { Cascader, CascaderProps } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardContext } from 'app/pages/DashBoardPage/contexts/BoardContext';
import { saveToViewMapAction } from 'app/pages/DashBoardPage/pages/Board/slice/asyncActions';
import {
  View,
  ViewSimple,
} from 'app/pages/MainPage/pages/ViewPage/slice/types';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { request } from 'utils/request';
import { errorHandle } from 'utils/utils';
export interface AssistViewFieldsProps
  extends Omit<CascaderProps, 'options' | 'onChange'> {
  onChange?: (value: string[]) => void;
  value?: string[];
}
export const AssistViewFields: React.FC<AssistViewFieldsProps> = memo(
  ({ onChange, value }) => {
    const tc = useI18NPrefix(`viz.control`);
    const dispatch = useDispatch();
    const { orgId } = useContext(BoardContext);
    const [options, setOptions] = useState<CascaderOptionType[]>([]);
    const getViewData = useCallback(async viewId => {
      try {
        const { data } = await request<View>(`/views/${viewId}`);
        return data;
      } catch (error) {
        errorHandle(error);
      }
    }, []);
    const setViews = useCallback(
      async orgId => {
        try {
          const { data } = await request<ViewSimple[]>(`/views?orgId=${orgId}`);
          const views: CascaderOptionType[] = data.map(item => {
            return {
              value: item.id,
              label: item.name,
              isLeaf: false,
            };
          });
          if (Array.isArray(value) && value.length === 2) {
            const data = await getViewData(value[0]);
            if (!data) return;

            const model = JSON.parse(data.model);
            const children: CascaderOptionType[] = Object.keys(model).map(
              key => {
                return {
                  value: key,
                  label: key,
                };
              },
            );
            setTimeout(() => {
              dispatch(saveToViewMapAction(data));
            }, 0);

            views.forEach(view => {
              if (view.value === value[0]) {
                view.children = children;
              }
            });
          }
          setOptions([...views]);
        } catch (error) {
          errorHandle(error);
          throw error;
        }
      },
      [dispatch, getViewData, value],
    );

    useEffect(() => {
      setViews(orgId);
    }, [setViews, orgId]);

    const loadData = useCallback(
      async (selectedOptions: CascaderOptionType[]) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        const data = await getViewData(targetOption.value);
        if (!data || !data.model) return; // make page can edit after click folder
        const model = JSON.parse(data.model);
        const children: CascaderOptionType[] = Object.keys(model).map(key => {
          return {
            value: key,
            label: key,
          };
        });
        targetOption.children = children;
        //
        targetOption.loading = false;
        const nextOptions = [...options].map(item => {
          if (item.value === targetOption.value) {
            return targetOption;
          } else {
            return item;
          }
        });
        setOptions(nextOptions);
      },
      [options, getViewData],
    );

    return (
      <Cascader
        allowClear
        placeholder={tc('selectViewField')}
        options={options}
        onChange={onChange as any}
        value={value}
        style={{ margin: '6px 0' }}
        loadData={loadData as any}
      />
    );
  },
);
