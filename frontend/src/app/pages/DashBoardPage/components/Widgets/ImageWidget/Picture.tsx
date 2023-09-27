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
import styled from 'styled-components/macro';

export function Picture() {
  const t = useI18NPrefix(`viz.board.setting`);

  return (
    <Svg
      viewBox="0 0 1029 1128"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M944.148 94.925H235.336c-46.853 0-84.972 38.118-84.972 84.971v39.87H93.46c-46.064 0-83.537 37.473-83.537 83.538v508.81c0 46.065 37.473 83.538 83.537 83.538h696.07c46.064 0 83.538-37.473 83.538-83.538v-41.298h71.08c46.854 0 84.972-38.113 84.972-84.972V179.896c0-46.858-38.113-84.971-84.972-84.971zM61.61 651.372V303.299c0-17.562 14.29-31.847 31.851-31.847h696.07A31.887 31.887 0 0 1 821.38 303.3v479.098L631.43 619.577 477.932 711.68 255.493 457.482 61.61 651.372zM789.53 843.96H93.46a31.887 31.887 0 0 1-31.85-31.85v-87.65l191.365-191.375 214.508 245.15 158.602-95.15L807.29 838.39a31.135 31.135 0 0 1-17.761 5.57z m154.62-124.84h-71.081V303.298c0-46.065-37.474-83.538-83.538-83.538H202.056v-39.87c0-18.35 14.93-33.28 33.28-33.28h708.812c18.35 0 33.28 14.93 33.28 33.28v505.943a33.321 33.321 0 0 1-33.28 33.285zM644.361 552.34c57.278 0 103.87-46.597 103.87-103.869 0-57.277-46.597-103.87-103.87-103.87s-103.87 46.598-103.87 103.87c-0.004 57.272 46.593 103.87 103.87 103.87z m0-156.047c28.77 0 52.178 23.409 52.178 52.178s-23.408 52.178-52.178 52.178-52.178-23.409-52.178-52.178 23.404-52.178 52.178-52.178z"></path>
      <text x="500" y="1096" textAnchor="middle">
        {t('dbClickToUpload')}
      </text>
    </Svg>
  );
}

const Svg = styled.svg`
  width: 60%;
  height: 60%;

  path {
    fill: ${p => p.theme.borderColorEmphasis};
  }

  text {
    font-size: 120px;
    fill: ${p => p.theme.borderColorBase};
  }
`;
