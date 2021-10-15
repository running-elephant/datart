import { PlusOutlined } from '@ant-design/icons';
import { Card, Tabs } from 'antd';
import { IW } from 'app/components';
import { useAccess } from 'app/pages/MainPage/Access';
import classnames from 'classnames';
import { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { FONT_SIZE_ICON_SM, SPACE_TIMES } from 'styles/StyleConstants';
import { errorHandle } from 'utils/utils';
import { selectEditingSource } from '../../slice/selectors';
import { allowManageSource } from '../../utils';
import { SchemaForm } from './SchemaForm';
import { FileSourceConfig } from './types';

interface FileConfigProps {
  sourceId: string;
  disabled: boolean;
  onChange: (
    schemas: FileSourceConfig[],
    resolve: (callback: () => void) => void,
  ) => void;
}

export const FileConfig = memo(
  ({ sourceId, disabled, onChange }: FileConfigProps) => {
    const [fileConfigs, setFileConfigs] = useState<FileSourceConfig[]>([]);
    const [activeKey, setActiveKey] = useState('add');
    const editingSource = useSelector(selectEditingSource);
    const allowManage = useAccess(allowManageSource(editingSource?.id));

    useEffect(() => {
      if (editingSource) {
        try {
          const config = JSON.parse(editingSource.config);
          const schemas = config?.schemas as FileSourceConfig[];
          if (schemas) {
            setFileConfigs(schemas);
            schemas.length && setActiveKey(schemas[0].tableName);
          }
        } catch (error) {
          errorHandle(error);
          throw error;
        }
      }
    }, [editingSource]);

    const update = useCallback(
      (config: FileSourceConfig, callback: () => void) => {
        onChange(
          fileConfigs.map(c => (c.tableName === config.tableName ? config : c)),
          callback,
        );
      },
      [fileConfigs, onChange],
    );

    const save = useCallback(
      (config: FileSourceConfig, callback: () => void) => {
        onChange(fileConfigs.concat(config), callback);
        setActiveKey(config.tableName);
      },
      [fileConfigs, onChange],
    );

    const del = useCallback(
      (tableName, callback) => {
        const filtered = fileConfigs.filter(c => c.tableName !== tableName);
        onChange(filtered, () => {
          if (!filtered.length) {
            setActiveKey('add');
          }
          callback();
        });
      },
      [fileConfigs, onChange],
    );

    return (
      <Container title="关联文件" bordered={false}>
        <Tabs
          size="small"
          type="card"
          className={classnames({ hidden: !fileConfigs.length })}
          activeKey={activeKey}
          onChange={setActiveKey}
        >
          {fileConfigs.map(s => (
            <Tabs.TabPane key={s.tableName} tab={s.tableName}>
              <SchemaForm
                sourceId={sourceId}
                editingSource={editingSource}
                config={s}
                disabled={disabled}
                onSave={update}
                onDelete={del}
              />
            </Tabs.TabPane>
          ))}
          {allowManage(true) && !disabled && (
            <Tabs.TabPane
              key="add"
              tab={
                <IW
                  fontSize={FONT_SIZE_ICON_SM}
                  size={SPACE_TIMES(6)}
                  className="add-btn"
                >
                  <PlusOutlined />
                </IW>
              }
            >
              <SchemaForm
                sourceId={sourceId}
                editingSource={editingSource}
                onSave={save}
              />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Container>
    );
  },
);

const Container = styled(Card)`
  .schemaForm {
    max-width: ${SPACE_TIMES(240)};
  }

  .hidden {
    .ant-tabs-nav {
      display: none;
    }
  }

  .add-btn {
    .anticon {
      margin: 0;
    }
  }
`;
