import {
  DatabaseOutlined,
  FunctionOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { PaneWrapper } from 'app/components';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components/macro';
import { EditorContext } from '../../EditorContext';
import { ColumnPermissions } from './ColumnPermissions';
import { Resource } from './Resource';
import { Variables } from './Variables';
import { VerticalTabs } from './VerticalTabs';

interface PropertiesProps {
  allowManage: boolean;
}

export const Properties = memo(({ allowManage }: PropertiesProps) => {
  const [selectedTab, setSelectedTab] = useState('');
  const { editorInstance } = useContext(EditorContext);

  useEffect(() => {
    editorInstance?.layout();
  }, [editorInstance, selectedTab]);

  const tabTitle = useMemo(
    () => [
      { name: 'resource', title: '数据源信息', icon: <DatabaseOutlined /> },
      { name: 'variable', title: '变量配置', icon: <FunctionOutlined /> },
      {
        name: 'columnPermissions',
        title: '列权限',
        icon: <SafetyCertificateOutlined />,
      },
    ],
    [],
  );

  const tabSelect = useCallback(tab => {
    setSelectedTab(tab);
  }, []);

  return allowManage ? (
    <Container>
      <PaneWrapper selected={selectedTab === 'variable'}>
        <Variables />
      </PaneWrapper>
      <PaneWrapper selected={selectedTab === 'resource'}>
        <Resource />
      </PaneWrapper>
      <PaneWrapper selected={selectedTab === 'columnPermissions'}>
        <ColumnPermissions />
      </PaneWrapper>
      <VerticalTabs tabs={tabTitle} onSelect={tabSelect} />
    </Container>
  ) : null;
});

const Container = styled.div`
  display: flex;
  flex-shrink: 0;
  background-color: ${p => p.theme.componentBackground};
`;
