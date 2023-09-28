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

import { Space } from 'antd';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import {
  editBoardStackActions,
  editWidgetInfoActions,
} from 'app/pages/DashBoardPage/pages/BoardEditor/slice';
import { memo, useCallback, useContext, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { BoardContext } from '../../BoardProvider/BoardProvider';
import { FlexStyle, ZIndexStyle } from '../../WidgetComponents/constants';
import { EditMask } from '../../WidgetComponents/EditMask';
import { LockIconFn } from '../../WidgetComponents/StatusIcon';
import { StyledWidgetToolBar } from '../../WidgetComponents/StyledWidgetToolBar';
import { WidgetDropdownList } from '../../WidgetComponents/WidgetDropdownList';
import { WidgetTitle } from '../../WidgetComponents/WidgetTitle';
import { WidgetWrapper } from '../../WidgetComponents/WidgetWrapper';
import {
  getWidgetBaseStyle,
  getWidgetTitle,
} from '../../WidgetManager/utils/utils';
import { WidgetInfoContext } from '../../WidgetProvider/WidgetInfoProvider';
import { HiddenUploader } from './HiddenUploader';
import { ImageWidgetCore } from './ImageWidgetCore';
import { Picture } from './Picture';

export const ImageWidget: React.FC<{ hideTitle: boolean }> = memo(
  ({ hideTitle }) => {
    const dispatch = useDispatch();
    const widget = useContext(WidgetContext);
    const widgetInfo = useContext(WidgetInfoContext);
    const { editing } = useContext(BoardContext);
    const title = getWidgetTitle(widget.config.customConfig.props);
    title.title = widget.config.name;
    const { background, border, padding } = getWidgetBaseStyle(
      widget.config.customConfig.props,
    );
    const showBackground =
      !background.image && background.color === 'transparent';
    const uploaderRef = useRef<any>();

    useEffect(() => {
      if (widgetInfo.editing) {
        uploaderRef.current?.onClick();
      }
    }, [widgetInfo.editing]);

    const uploaderChange = useCallback(
      (url: string) => {
        dispatch(
          editBoardStackActions.updateWidgetStyleConfigByPath({
            ancestors: [0, 0],
            configItem: {
              key: 'background',
              comType: 'background',
              label: 'background.background',
              value: { ...background, image: url },
            },
            wid: widget.id,
          }),
        );
        dispatch(editWidgetInfoActions.closeWidgetEditing(widget.id));
      },
      [dispatch, widget.id, background],
    );

    return (
      <>
        <WidgetWrapper
          background={background}
          border={border}
          padding={padding}
        >
          <div style={ZIndexStyle}>
            {!hideTitle && <WidgetTitle title={title} />}

            <div style={FlexStyle}>
              <ImageWidgetCore />
            </div>
          </div>
          {editing && <EditMask />}
          <StyledWidgetToolBar>
            <Space size={0}>
              <LockIconFn
                boardEditing={editing}
                wid={widget.id}
                lock={widget.config?.lock}
              />
              <WidgetDropdownList widget={widget} />
            </Space>
          </StyledWidgetToolBar>
        </WidgetWrapper>
        {editing && (
          <HiddenUploader onChange={uploaderChange} ref={uploaderRef} />
        )}
        {editing && showBackground && (
          <ImageWidgetBackground>
            <Picture />
          </ImageWidgetBackground>
        )}
      </>
    );
  },
);

const ImageWidgetBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
