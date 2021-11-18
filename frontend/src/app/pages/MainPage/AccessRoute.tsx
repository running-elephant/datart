import React from 'react';
import { Redirect } from 'react-router-dom';
import { Access, AccessProps } from './Access';
import { PermissionLevels } from './pages/PermissionPage/constants';

export function AccessRoute(
  props: Omit<AccessProps, 'type' | 'level' | 'denied'>,
) {
  return (
    <Access
      {...props}
      type="module"
      level={PermissionLevels.Enable}
      denied={<Redirect to="/404" />}
    />
  );
}
