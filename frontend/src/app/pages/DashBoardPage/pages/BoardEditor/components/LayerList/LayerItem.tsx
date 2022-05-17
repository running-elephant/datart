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
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { WidgetWrapProvider } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetWrapProvider';
import classNames from 'classnames';
import { FC, memo, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { ORIGINAL_TYPE_MAP } from '../../../../constants';
export const LayerItem: FC<{ wid: string; boardId: string }> = memo(
  ({ wid, boardId }) => {
    return (
      <WidgetWrapProvider
        id={wid}
        key={wid}
        boardEditing={true}
        boardId={boardId}
      >
        <LayerItemRender boardId={boardId} />
      </WidgetWrapProvider>
    );
  },
);

export const LayerItemRender: FC<{ boardId: string }> = memo(({ boardId }) => {
  const widget = useContext(WidgetContext);
  const renderItem = useMemo(() => {
    if (widget.config.originalType === ORIGINAL_TYPE_MAP.group) {
      return (
        <div className={classNames(['layer-item', 'layer-group'])}>
          {widget.config.name}
          {widget.config.children?.map(childId => {
            return <LayerItem wid={childId} boardId={boardId} />;
          })}
        </div>
      );
    } else {
      return (
        <div className={classNames(['layer-item', 'layer-widget'])}>
          {widget.config.name}
        </div>
      );
    }
  }, [
    boardId,
    widget.config.children,
    widget.config.name,
    widget.config.originalType,
  ]);
  return <StyledWrapper>{renderItem}</StyledWrapper>;
});
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 4px 0;
  .layer-group {
    background-color: yellow;
  }
  .layer-widget {
    background-color: #0099ff;
  }
`;
