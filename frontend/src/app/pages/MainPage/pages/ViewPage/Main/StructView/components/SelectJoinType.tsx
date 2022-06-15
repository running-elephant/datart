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

import { MenuListItem, MenuWrapper, Popup } from 'app/components';
import classnames from 'classnames';
import { memo } from 'react';
import styled from 'styled-components';
import { SPACE_SM } from 'styles/StyleConstants';
import { StructViewJoinType } from '../../../constants';

interface SelectJoinTypeProps {
  type: StructViewJoinType;
  callbackFn: (type) => void;
}

const SelectJoinType = memo(({ type, callbackFn }: SelectJoinTypeProps) => {
  return (
    <Popup
      trigger={['click']}
      placement="bottomLeft"
      content={
        <MenuWrapper selectedKeys={[type]} onClick={e => callbackFn(e.key)}>
          <MenuListItem key={StructViewJoinType['innerJoin']}>
            Inner Join
          </MenuListItem>
          <MenuListItem key={StructViewJoinType['leftJoin']}>
            Left Join
          </MenuListItem>
          <MenuListItem key={StructViewJoinType['rightJoin']}>
            Right Join
          </MenuListItem>
        </MenuWrapper>
      }
    >
      <Icon
        className={classnames('iconfont', {
          'icon-join_inner': type === StructViewJoinType['innerJoin'],
          'icon-join_right': type === StructViewJoinType['leftJoin'],
          'icon-join_left': type === StructViewJoinType['rightJoin'],
        })}
      ></Icon>
    </Popup>
  );
});

const Icon = styled.i`
  margin: 0 ${SPACE_SM};
  color: ${p => p.theme.blue};
  cursor: pointer;
`;

export default SelectJoinType;
