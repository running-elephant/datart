import { ReactElement } from 'react';
import styled from 'styled-components/macro';
import { BORDER_RADIUS, SPACE_LG, SPACE_MD } from 'styles/StyleConstants';
import { stopPPG } from 'utils/utils';

interface SettingPanelProps {
  title?: string;
  children?: ReactElement;
}

export function SettingPanel({ title, children }: SettingPanelProps) {
  return (
    <Wrapper>
      <h3>{title}</h3>
      <div onClick={stopPPG} className="form-wrapper">
        {children}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 0 ${SPACE_MD};

  > h3 {
    flex-shrink: 0;
    padding: ${SPACE_MD} 0;
  }

  .form-wrapper {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
  }
`;

export const Group = styled.div`
  padding: 0 ${SPACE_LG};

  .ant-input {
    color: ${p => p.theme.textColorSnd};
    background-color: ${p => p.theme.emphasisBackground};
    border-color: ${p => p.theme.emphasisBackground};
    box-shadow: none;
  }

  .ant-input-number {
    width: 100%;
    background-color: ${p => p.theme.emphasisBackground};
    border-color: ${p => p.theme.emphasisBackground};
    border-radius: ${BORDER_RADIUS};
    box-shadow: none;
  }

  .ant-input-number-input {
    color: ${p => p.theme.textColorSnd};
  }

  .ant-input-number-handler-wrap {
    background-color: ${p => p.theme.emphasisBackground};
  }

  .ant-select {
    color: ${p => p.theme.textColorSnd};
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    background-color: ${p => p.theme.emphasisBackground};
    border-color: ${p => p.theme.emphasisBackground} !important;
    border-radius: ${BORDER_RADIUS};
    box-shadow: none !important;
  }

  .ant-upload.ant-upload-drag {
    background-color: ${p => p.theme.emphasisBackground};
    border-color: transparent !important;
    border-radius: ${BORDER_RADIUS};
  }
`;
