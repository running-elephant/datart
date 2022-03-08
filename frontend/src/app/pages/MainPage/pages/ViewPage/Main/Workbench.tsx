/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Split } from 'app/components';
import { useAccess, useCascadeAccess } from 'app/pages/MainPage/Access';
import debounce from 'lodash/debounce';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { getPath } from 'utils/utils';
import {
  PermissionLevels,
  ResourceTypes,
} from '../../PermissionPage/constants';
import { UNPERSISTED_ID_PREFIX } from '../constants';
import { EditorContext } from '../EditorContext';
import { selectCurrentEditingViewAttr, selectViews } from '../slice/selectors';
import { getSchemaBySourceId } from '../slice/thunks';
import { Editor } from './Editor';
import { Outputs } from './Outputs';
import { Properties } from './Properties';

export const Workbench = memo(() => {
  const dispatch = useDispatch();
  const { editorInstance } = useContext(EditorContext);
  const views = useSelector(selectViews);
  const id = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'id' }),
  ) as string;
  const parentId = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'parentId' }),
  ) as string;
  const sourceId = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'sourceId' }),
  ) as string;

  useEffect(() => {
    if (sourceId) {
      dispatch(getSchemaBySourceId(sourceId));
    }
  }, [dispatch, sourceId]);

  const path = useMemo(
    () =>
      views
        ? getPath(
            views as Array<{ id: string; parentId: string }>,
            { id, parentId },
            ResourceTypes.View,
          )
        : [],
    [views, id, parentId],
  );
  const managePermission = useCascadeAccess({
    module: ResourceTypes.View,
    path,
    level: PermissionLevels.Manage,
  });
  const unpersistedNewView = id.includes(UNPERSISTED_ID_PREFIX);
  const allowManage = managePermission(true) || unpersistedNewView;
  const allowEnableViz = useAccess({
    type: 'module',
    module: ResourceTypes.Viz,
    id: '',
    level: PermissionLevels.Enable,
  })(true);

  useEffect(() => {
    editorInstance?.layout();
  }, [editorInstance, allowManage]);

  const onResize = useCallback(
    debounce(() => {
      editorInstance?.layout();
    }, 300),
    [editorInstance],
  );

  useEffect(() => {
    window.addEventListener('resize', onResize, false);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  const editorResize = useCallback(
    sizes => {
      editorInstance?.layout();
    },
    [editorInstance],
  );

  return (
    <Wrapper>
      <Development
        direction="vertical"
        gutterSize={0}
        className="datart-split"
        onDrag={editorResize}
      >
        <Editor allowManage={allowManage} allowEnableViz={allowEnableViz} />
        <Outputs />
      </Development>
      <Properties allowManage={allowManage} />
    </Wrapper>
  );
});

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

const Development = styled(Split)`
  display: flex;
  flex: 1;
  flex-direction: column;
`;
