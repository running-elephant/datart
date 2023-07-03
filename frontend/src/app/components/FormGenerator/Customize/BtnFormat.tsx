import { Input, Radio, Select, Space, Switch, Typography } from 'antd';
import { FC, memo, useEffect } from 'react';
import { ChartStyleConfig } from '../../../types/ChartConfig';

import { ItemLayoutProps } from '../types';
import { updateByKey } from '../../../utils/mutation';
import { IconList } from '../../../pages/DashBoardPage/components/Widgets/CustomBtnWidget/util/Icon';

const BtnFormat: FC<ItemLayoutProps<ChartStyleConfig>> = memo(
  ({ ancestors, translate: t = title => title, data, onChange, context }) => {
    const TextSecondary = props => (
      <Typography.Text type={'secondary'} {...props} />
    );

    const handleSettingChange = key => e => {
      const val = e.target.value;
      handleSettingChangeWithValue(key)(val);
    };

    const handleSettingChangeWithValue = key => val => {
      const newData = updateByKey(
        data,
        'value',
        Object.assign({}, data.value, { [key]: val }),
      );
      onChange?.(ancestors, newData);
    };

    const BtnTypes = [
      {
        name: '默认',
        value: 'default',
      },
      {
        name: '主要',
        value: 'primary',
      },
      {
        name: '文字',
        value: 'text',
      },
      {
        name: '链接',
        value: 'link',
      },
      {
        name: '虚线',
        value: 'dashed',
      },
    ];

    const BtnSizes = [
      {
        name: '大',
        value: 'large',
      },
      {
        name: '中',
        value: 'middle',
      },
      {
        name: '小',
        value: 'small',
      },
    ];

    return (
      <Space direction={'vertical'}>
        <Space direction={'vertical'}>
          <TextSecondary>按钮文字</TextSecondary>
          <Input
            value={data.value?.content}
            style={{ width: '100%' }}
            onChange={handleSettingChange('content')}
            className={'datart-antd-input'}
          />
        </Space>
        <Space direction={'vertical'}>
          <TextSecondary>按钮类型</TextSecondary>
          <Select
            value={data.value?.btnType}
            style={{ minWidth: '100%' }}
            onChange={handleSettingChangeWithValue('btnType')}
          >
            {BtnTypes.map(ele => (
              <Select.Option key={ele.value} value={ele.value}>
                {ele.name}
              </Select.Option>
            ))}
          </Select>
        </Space>
        <Space direction={'vertical'}>
          <TextSecondary>危险操作</TextSecondary>
          <Switch
            checked={data.value?.danger}
            style={{ minWidth: '100%' }}
            onChange={handleSettingChangeWithValue('danger')}
          />
        </Space>
        <Space direction={'vertical'}>
          <TextSecondary>按钮图标</TextSecondary>
          <Select
            value={data.value?.icon}
            placeholder={'Ant Design的图标'}
            style={{ minWidth: 150 }}
            showSearch={true}
            onChange={handleSettingChangeWithValue('icon')}
            options={IconList}
          />
        </Space>
        <Space direction={'vertical'}>
          <TextSecondary>按钮大小</TextSecondary>
          <Select
            value={data.value?.btnSize}
            style={{ minWidth: '100%' }}
            onChange={handleSettingChangeWithValue('btnSize')}
          >
            {BtnSizes.map(ele => (
              <Select.Option key={ele.value} value={ele.value}>
                {ele.name}
              </Select.Option>
            ))}
          </Select>
        </Space>
        <Space direction={'vertical'}>
          <TextSecondary>跳转设置</TextSecondary>
          <Radio.Group
            value={data.value?.jumpType}
            onChange={handleSettingChange('jumpType')}
          >
            <Radio.Button value={'url'}>URL</Radio.Button>
            <Radio.Button value={'dashboard'}>仪表板</Radio.Button>
            <Radio.Button value={'datachart'}>图表</Radio.Button>
          </Radio.Group>
        </Space>
        {data.value?.jumpType && (
          <Space direction={'vertical'}>
            <TextSecondary>打开方式</TextSecondary>
            <Radio.Group
              value={data.value?.target}
              onChange={handleSettingChange('target')}
            >
              <Radio.Button value={'_blank'}>新窗口</Radio.Button>
              <Radio.Button value={'_self'}>当前页</Radio.Button>
            </Radio.Group>
          </Space>
        )}
        {data.value?.jumpType === 'url' && (
          <Space direction={'vertical'}>
            <TextSecondary>URL</TextSecondary>
            <Input.TextArea
              value={data.value?.href}
              style={{ minWidth: '100%' }}
              onChange={handleSettingChange('href')}
              className={'datart-antd-input'}
            />
          </Space>
        )}
        {data.value?.jumpType === 'dashboard' && (
          <Space direction={'vertical'}>
            <TextSecondary>仪表板</TextSecondary>
            <Select
              virtual
              showSearch
              value={data.value?.dashboardId}
              style={{ minWidth: 100, maxWidth: 200 }}
              dropdownMatchSelectWidth={false}
              onChange={handleSettingChangeWithValue('dashboardId')}
              className={'datart-antd-input'}
            >
              {context?.vizs
                ?.filter(v => v.relType === 'DASHBOARD')
                ?.map(c => {
                  return (
                    <Select.Option key={c.relId} value={c.relId}>
                      {c.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </Space>
        )}
        {data.value?.jumpType === 'datachart' && (
          <Space direction={'vertical'}>
            <TextSecondary>图表</TextSecondary>
            <Select
              virtual
              showSearch
              value={data.value?.datachartId}
              style={{ minWidth: 100, maxWidth: 200 }}
              dropdownMatchSelectWidth={false}
              onChange={handleSettingChangeWithValue('datachartId')}
              className={'datart-antd-input'}
            >
              {context?.vizs
                ?.filter(v => v.relType === 'DATACHART')
                ?.map(c => {
                  return (
                    <Select.Option key={c.relId} value={c.relId}>
                      {c.name}
                    </Select.Option>
                  );
                })}
            </Select>
          </Space>
        )}
      </Space>
    );
  },
);

export default BtnFormat;
