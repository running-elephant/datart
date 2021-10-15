import { Checkbox, Space } from 'antd';
import { memo, useCallback, useEffect, useState } from 'react';
import {
  PermissionLevels,
  ResourceTypes,
  RESOURCE_TYPE_PERMISSION_LABEL,
  RESOURCE_TYPE_PERMISSION_MAPPING,
  SubjectTypes,
  Viewpoints,
} from '../../constants';
import { DataSourceTreeNode } from '../../slice/types';
import { getDefaultPermissionArray } from '../../utils';
import { getChangedPermission, getPrivilegeSettingType } from './utils';

interface PrivilegeSettingProps {
  record: DataSourceTreeNode;
  viewpoint: Viewpoints;
  viewpointType: ResourceTypes | SubjectTypes;
  dataSourceType: ResourceTypes | SubjectTypes;
  onChange: (
    record: DataSourceTreeNode,
    newPermissionArray: PermissionLevels[],
    index: number,
    base: PermissionLevels,
  ) => void;
}

export const PrivilegeSetting = memo(
  ({
    record,
    viewpoint,
    viewpointType,
    dataSourceType,
    onChange,
  }: PrivilegeSettingProps) => {
    const [values, setValues] = useState<PermissionLevels[]>(
      getDefaultPermissionArray(),
    );

    const resourceType = getPrivilegeSettingType(
      viewpoint,
      viewpointType,
      dataSourceType,
    );

    const privilegeChange = useCallback(
      (index, changedValue) => e => {
        const changedValues = getChangedPermission(
          !e.target.checked,
          values,
          index,
          changedValue,
        );
        onChange(record, changedValues, index, changedValue);
      },
      [record, values, onChange],
    );

    useEffect(() => {
      setValues(record.permissionArray);
    }, [record]);

    return (
      <Space>
        {RESOURCE_TYPE_PERMISSION_MAPPING[resourceType!].map((level, index) => (
          <Checkbox
            key={PermissionLevels[level]}
            checked={level === values[index]}
            onChange={privilegeChange(index, level)}
          >
            {RESOURCE_TYPE_PERMISSION_LABEL[resourceType!][index]}
          </Checkbox>
        ))}
      </Space>
    );
  },
);
