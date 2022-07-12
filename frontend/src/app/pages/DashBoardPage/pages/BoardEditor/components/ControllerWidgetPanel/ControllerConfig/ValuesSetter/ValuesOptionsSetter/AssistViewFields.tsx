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
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { ViewSimple } from 'app/pages/MainPage/pages/ViewPage/slice/types';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { request2 } from 'utils/request';

export interface AssistViewFieldsProps
  extends Omit<CascaderProps, 'options' | 'onChange'> {
  onChange?: (value: string[]) => void;
  getViewOption: (
    viewId: string,
  ) => Promise<{ option: CascaderOptionType[] | undefined }>;
  value?: string[];
}
export const AssistViewFields: React.FC<AssistViewFieldsProps> = memo(
  ({ onChange, value: propsValue, getViewOption }) => {
    const tc = useI18NPrefix(`viz.control`);
    const [val, setVal] = useState<string[]>([]);
    const { orgId } = useContext(BoardContext);
    const [options, setOptions] = useState<CascaderOptionType[]>([]);
    useEffect(() => {
      setVal(propsValue || []);
    }, [onChange, propsValue]);

    const setViews = useCallback(
      async orgId => {
        const { data } = await request2<ViewSimple[]>(`/views?orgId=${orgId}`);
        const views: CascaderOptionType[] = data.map(item => {
          return {
            value: item.id,
            label: item.name,
            isLeaf: false,
          };
        });
        if (Array.isArray(propsValue) && propsValue.length) {
          const { option } = await getViewOption(propsValue[0]);

          views.forEach(view => {
            if (view.value === propsValue[0]) {
              view.children = option;
            }
          });
        }
        setOptions([...views]);
      },
      [getViewOption, propsValue],
    );

    useEffect(() => {
      setViews(orgId);
    }, [setViews, orgId]);

    const loadData = useCallback(
      async (selectedOptions: CascaderOptionType[]) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        const { option } = await getViewOption(targetOption.value as string);
        targetOption.children = option;
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
      [options, getViewOption],
    );
    const optionChange = value => {
      setVal(value);
      onChange?.(value || []);
    };

    return (
      <Cascader
        allowClear
        placeholder={tc('selectViewField')}
        options={options}
        onChange={optionChange}
        value={[...val]}
        style={{ margin: '6px 0' }}
        loadData={loadData as any}
      />
    );
  },
);
