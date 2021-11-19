import { Split } from 'app/components';
import { useCascadeAccess } from 'app/pages/MainPage/Access';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { getPath } from 'utils/utils';
import {
  PermissionLevels,
  ResourceTypes,
} from '../../PermissionPage/constants';
import { UNPERSISTED_ID_PREFIX } from '../constants';
import { EditorContext } from '../EditorContext';
import { selectCurrentEditingViewAttr, selectViews } from '../slice/selectors';
import { Editor } from './Editor';
import { Outputs } from './Outputs';
import { Properties } from './Properties';

export const Workbench = memo(() => {
  const { editorInstance } = useContext(EditorContext);
  const views = useSelector(selectViews);
  const id = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'id' }),
  ) as string;
  const parentId = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'parentId' }),
  ) as string;
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

  useEffect(() => {
    editorInstance?.layout();
  }, [editorInstance, allowManage]);

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
        <Editor allowManage={allowManage} />
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
