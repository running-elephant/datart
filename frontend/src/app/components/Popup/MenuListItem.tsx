import { Menu, MenuItemProps } from 'antd';
import React, { cloneElement, ReactElement } from 'react';
import styled, { css } from 'styled-components/macro';
import { LINE_HEIGHT_HEADING, SPACE, SPACE_XS } from 'styles/StyleConstants';
import { mergeClassNames } from 'utils/utils';

const WrapperStyle = css`
  line-height: ${LINE_HEIGHT_HEADING};

  &.selected {
    background-color: ${p => p.theme.emphasisBackground};
  }
`;

interface MenuListItemProps extends Omit<MenuItemProps, 'prefix'> {
  prefix?: ReactElement;
  suffix?: ReactElement;
}

export function MenuListItem({
  prefix,
  suffix,
  ...menuProps
}: MenuListItemProps) {
  return (
    <Menu.Item css={WrapperStyle} {...menuProps}>
      <ListItem>
        {prefix &&
          cloneElement(prefix, {
            className: mergeClassNames(prefix.props.className, 'prefix'),
          })}
        {menuProps.children}
        {suffix &&
          cloneElement(suffix, {
            className: mergeClassNames(suffix.props.className, 'suffix'),
          })}
      </ListItem>
    </Menu.Item>
  );
}

const ListItem = styled.div`
  display: flex;
  align-items: center;

  > .prefix {
    flex-shrink: 0;
    margin-right: ${SPACE_XS};
  }

  > .suffix {
    flex-shrink: 0;
    padding: 0 ${SPACE};
  }

  > .prefix,
  > .suffix {
    &.icon {
      color: ${p => p.theme.textColorLight};
    }
  }

  > p {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
