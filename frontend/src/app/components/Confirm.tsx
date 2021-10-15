import { Modal, ModalProps } from 'antd';
import React, { cloneElement, ReactElement, ReactNode } from 'react';
import styled from 'styled-components/macro';
import {
  FONT_SIZE_HEADING,
  FONT_SIZE_ICON_MD,
  SPACE_MD,
  SPACE_SM,
} from 'styles/StyleConstants';
import { mergeClassNames } from 'utils/utils';

interface ConfirmProps extends ModalProps {
  icon?: ReactElement;
  title?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
}

export function Confirm({
  title,
  content,
  icon,
  footer,
  ...modalProps
}: ConfirmProps) {
  return (
    <Modal width={400} footer={false} closable={false} {...modalProps}>
      <ConfirmBody>
        {icon &&
          cloneElement(icon, {
            className: mergeClassNames(icon.props.className, 'icon'),
          })}
        <ConfirmContent>
          {title && typeof title === 'string' ? <h2>{title}</h2> : title}
          {content && typeof content === 'string' ? <p>{content}</p> : content}
          <Actions>{footer}</Actions>
        </ConfirmContent>
      </ConfirmBody>
    </Modal>
  );
}

const ConfirmBody = styled.div`
  display: flex;

  .icon {
    margin: 0 ${SPACE_SM};
    font-size: ${FONT_SIZE_ICON_MD};
  }
`;

const ConfirmContent = styled.div`
  flex: 1;

  h2 {
    margin-bottom: ${SPACE_SM};
    font-size: ${FONT_SIZE_HEADING};
  }
`;

const Actions = styled.div`
  margin-top: ${SPACE_MD};
  text-align: right;
`;
