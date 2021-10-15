import { Avatar as AntdAvatar, AvatarProps } from 'antd';
import React, { CSSProperties } from 'react';
import styled from 'styled-components/macro';

export function Avatar(props: AvatarProps) {
  let style: CSSProperties = {};
  if (typeof props.size === 'number') {
    style.fontSize = `${props.size * 0.375}px`;
  }
  return (
    <StyledAvatar {...props} style={style}>
      {props.children}
    </StyledAvatar>
  );
}

const StyledAvatar = styled(AntdAvatar)`
  color: ${p => p.theme.textColorLight};
  background-color: ${p => p.theme.emphasisBackground};
`;
