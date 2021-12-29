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

import classnames from 'classnames';
import { cloneElement, memo, ReactElement, useCallback, useState } from 'react';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_TITLE,
  FONT_WEIGHT_MEDIUM,
  SPACE,
  SPACE_XS,
} from 'styles/StyleConstants';

interface TabProps {
  name: string;
  title: string;
  icon?: ReactElement;
}

interface VerticalTabsProps {
  tabs: TabProps[];
  onSelect?: (key: string) => void;
}

export const VerticalTabs = memo(({ tabs, onSelect }: VerticalTabsProps) => {
  const [selectedTab, setSelectedTab] = useState('');

  const selectTab = useCallback(
    name => () => {
      const nextSelectedTab = name === selectedTab ? '' : name;
      setSelectedTab(nextSelectedTab);
      onSelect && onSelect(nextSelectedTab);
    },
    [selectedTab, onSelect],
  );

  return (
    <Wrapper>
      {tabs.map(({ name, title, icon }) => (
        <Tab
          key={name}
          className={classnames({ selected: selectedTab === name })}
          onClick={selectTab(name)}
        >
          {icon && <Word className="icon">{cloneElement(icon)}</Word>}
          {title.split('').map((s, index) => (
            <Word key={index}>{s}</Word>
          ))}
        </Tab>
      ))}
    </Wrapper>
  );
});

const Wrapper = styled.ul`
  flex-shrink: 0;
  width: 32px;
  background-color: ${p => p.theme.componentBackground};
  border-left: 1px solid ${p => p.theme.borderColorSplit};
`;

const Tab = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${SPACE_XS};
  color: ${p => p.theme.textColorSnd};
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid ${p => p.theme.borderColorSplit};

  &:hover {
    color: ${p => p.theme.textColor};
    background-color: ${p => p.theme.bodyBackground};
  }

  &.selected {
    font-weight: ${FONT_WEIGHT_MEDIUM};
    color: ${p => p.theme.textColor};
    background-color: ${p => p.theme.emphasisBackground};
  }
`;

const Word = styled.span`
  display: block;
  width: ${FONT_SIZE_TITLE};
  height: ${FONT_SIZE_TITLE};
  line-height: ${FONT_SIZE_TITLE};
  /* transform: rotate(90deg); */

  &.icon {
    margin-bottom: ${SPACE};
  }
`;
