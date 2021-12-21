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

import { S2Theme } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { FC, memo } from 'react';
import styled from 'styled-components/macro';

const AntVS2Wrapper: FC<{ dataCfg; options; theme?: S2Theme }> = memo(
  ({ dataCfg, options, theme }) => {
    return (
      <StyledAntVS2Wrapper
        sheetType="pivot"
        dataCfg={dataCfg}
        options={options}
        themeCfg={{ theme }}
      />
    );
  },
);

const StyledAntVS2Wrapper = styled(SheetComponent)``;

export default AntVS2Wrapper;
