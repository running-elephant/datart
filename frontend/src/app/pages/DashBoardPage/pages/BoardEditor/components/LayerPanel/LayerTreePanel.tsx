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
import { FC, memo } from 'react';
import styled from 'styled-components/macro';
import { LayerTree } from './LayerTree';
export const LayerTreePanel: FC<{}> = memo(() => {
  const t = useI18NPrefix(`viz.board.action`);
  return (
    <StyledWrapper>
      <h3 className="title">{t('widgetList')}</h3>
      <div className="layerTree-box">
        <LayerTree />
      </div>
      <div className="bottom"> </div>
    </StyledWrapper>
  );
});
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 190px;
  min-width: 190px;
  max-width: 190px;
  overflow-y: auto;
  background-color: ${p => p.theme.componentBackground};
  box-shadow: ${p => p.theme.shadowSider};
  & .title {
    text-align: center;
  }
  & .layerTree-box {
    min-height: 0;
    overflow-y: auto;
  }
  & .bottom {
    padding: 5px;
    text-align: center;
  }
`;
