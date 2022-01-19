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
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { CommonFormTypes } from 'globalConstants';
import { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { request } from 'utils/request';
import { errorHandle, getInsertedNodeIndex } from 'utils/utils';
import { SaveFormContext, SaveFormModel } from '../SaveFormContext';
import { selectVizs } from '../slice/selectors';
import { addViz, copyDashboard } from '../slice/thunks';
import { VizType } from '../slice/types';

export function useSaveAsViz() {
  const { showSaveForm } = useContext(SaveFormContext);
  const vizsData = useSelector(selectVizs);
  const dispatch = useDispatch();
  const tg = useI18NPrefix('global');

  const getVizDetail = useCallback(
    async (backendChartId: string, type: string) => {
      try {
        const { data } = await request<any>({
          method: 'GET',
          url: `viz/${type.toLowerCase()}s/${backendChartId}`,
        });

        return data;
      } catch (error) {
        errorHandle(error);

        return {} as any;
      }
    },
    [],
  );

  const saveAsViz = useCallback(
    async (vizId: string, type: VizType) => {
      let vizData = await getVizDetail(vizId, type).then(data => {
        return data;
      });

      showSaveForm({
        vizType: type,
        type: CommonFormTypes.SaveAs,
        visible: true,
        initialValues: {
          ...vizData,
          parentId: vizData.parentId || void 0,
          name: vizData.name + '_' + tg('copy'),
          boardType: JSON.parse(vizData.config)?.type,
        },
        onSave: async (values: SaveFormModel, onClose) => {
          let index = getInsertedNodeIndex(values, vizsData);
          let requestData: any = [];

          if (type === 'DATACHART') {
            requestData = Object.assign({}, vizData, {
              ...values,
              parentId: values.parentId || null,
              index,
            });

            dispatch(
              addViz({
                viz: requestData,
                type,
                resolve: onClose,
              }),
            );
          } else {
            requestData = {
              config: vizData.config,
              id: vizData.id,
              index,
              name: values.name,
              orgId: vizData.orgId,
              parentId: values.parentId || null,
              permissions: vizData.permissions,
            };

            dispatch(
              copyDashboard({
                viz: requestData,
                dashboardId: vizData.id,
                resolve: onClose,
              }),
            );
          }
        },
      });
    },
    [showSaveForm, tg, vizsData, dispatch],
  );

  return saveAsViz;
}
