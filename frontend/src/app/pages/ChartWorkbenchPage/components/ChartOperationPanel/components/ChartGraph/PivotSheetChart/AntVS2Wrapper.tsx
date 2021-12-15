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

import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';

const AntVS2Wrapper: FC<{ dataCfg; options }> = memo(({ dataCfg, options }) => {
  return (
    <StyledAntVS2Wrapper
      dataCfg={dataCfg}
      options={options}
      // getSpreadSheet={instance => {
      //   instance.showTooltip = tooltipOptions => {
      //     const { position, data = {}, options } = tooltipOptions;
      //     const name = `${data.name} - 测试`; // 只有单元格中文案被省略才显示
      //     const infos = '按住 Shift 多选或框选，查看多个数据点';
      //     const tips = '说明：这是个说明';
      //     const customSummaries = (data.summaries || []).map(item => {
      //       return { ...item, name: `${item.name} - 测试` };
      //     });
      //     const { cols = [], rows = [] } = data.headInfo || {};
      //     const customCols = cols.map(item => {
      //       return { ...item, value: `${item.value} - 测试` };
      //     });
      //     const customDetails = (data.details || []).map(item => {
      //       return {
      //         name: `${item.name} - 测试`,
      //         value: `${item.value} - w`,
      //       };
      //     });
      //     const customOperator = {
      //       onClick: () => {
      //         console.log('测试');
      //       },
      //       menus: [
      //         {
      //           id: 'trend',
      //           icon: 'trend',
      //           text: '趋势',
      //         },
      //       ],
      //     };
      //     const customOptions = {
      //       ...tooltipOptions,
      //       position: { x: position.x + 1, y: position.y + 1 },
      //       data: {
      //         ...data,
      //         name: data.name ? name : '',
      //         infos,
      //         tips,
      //         summaries: customSummaries,
      //         headInfo: { rows, cols: customCols },
      //         details: customDetails,
      //       },
      //       options: {
      //         ...options,
      //         operator: customOperator,
      //       },
      //     };
      //     instance.tooltip.show(customOptions);
      //   };
      // }}
    />
  );
});

const StyledAntVS2Wrapper = styled(SheetComponent)``;

export default AntVS2Wrapper;
