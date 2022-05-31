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
import { Input } from 'antd';
import { BW } from 'app/components/FormGenerator/Basic/components/BasicWrapper';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { WidgetActionContext } from 'app/pages/DashBoardPage/components/ActionProvider/WidgetActionProvider';
import debounce from 'lodash/debounce';
import {
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components/macro';
import { Group } from '../SettingPanel';
export const NameSet: FC<{ wid: string; name: string }> = memo(
  ({ wid, name }) => {
    const { onUpdateWidgetConfigByKey } = useContext(WidgetActionContext);
    const t = useI18NPrefix(`viz.board.setting`);
    const [nameVal, setNameVal] = useState('');
    useEffect(() => {
      setNameVal(name);
    }, [name]);

    const debounceSetName = useMemo(
      () =>
        debounce(value => {
          onUpdateWidgetConfigByKey({
            wid: wid,
            key: 'name',
            val: value,
          });
        }, 300),
      [onUpdateWidgetConfigByKey, wid],
    );

    const changeName = useCallback(
      e => {
        setNameVal(e.target.value);
        debounceSetName(e.target.value);
      },
      [debounceSetName],
    );
    return (
      <Group>
        <BW label={t('widget') + t('title')}>
          <StyledFlex>
            <Input
              value={nameVal}
              className="datart-ant-input"
              onChange={changeName}
            />
          </StyledFlex>
        </BW>
      </Group>
    );
  },
);
const StyledFlex = styled.div`
  display: flex;
`;
