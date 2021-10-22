import styled from 'styled-components';
import { SPACE_LG } from 'styles/StyleConstants';

interface VersionProps {
  version?: string;
}

export function Version({ version }: VersionProps) {
  return version ? <Content>Version: {version}</Content> : null;
}

const Content = styled.h5`
  position: absolute;
  right: ${SPACE_LG};
  bottom: ${SPACE_LG};
`;
