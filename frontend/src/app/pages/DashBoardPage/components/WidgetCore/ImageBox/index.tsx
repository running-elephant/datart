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
import useClientRect from 'app/pages/DashBoardPage/hooks/useClientRect';
import {
  MediaWidgetContent,
  Widget,
  WidgetInfo,
} from 'app/pages/DashBoardPage/pages/Board/slice/types';
import { convertImageUrl } from 'app/pages/DashBoardPage/utils';
import React, { useMemo } from 'react';
import styled from 'styled-components/macro';

export interface ImageBoxProps {
  widgetConfig: Widget;
  widgetInfo: WidgetInfo;
}
const widgetSize: React.CSSProperties = {
  width: '100%',
  height: '100%',
};
const ImageBox: React.FC<ImageBoxProps> = ({ widgetConfig }) => {
  const { imageConfig } = widgetConfig.config.content as MediaWidgetContent;

  const [rect, refDom] = useClientRect<HTMLDivElement>(32);

  const widthBigger = useMemo(() => {
    return rect.width >= rect.height;
  }, [rect]);

  const imageRatioCss: React.CSSProperties = useMemo(() => {
    return widthBigger
      ? {
          width: 'auto',
          height: '100%',
        }
      : {
          width: '100%',
          height: 'auto',
        };
  }, [widthBigger]);
  const imageSize = useMemo(() => {
    return imageConfig?.type === 'IMAGE_RATIO' ? imageRatioCss : widgetSize;
  }, [imageRatioCss, imageConfig?.type]);

  return (
    <Wrap ref={refDom}>
      {imageConfig?.src && (
        <img style={imageSize} src={convertImageUrl(imageConfig?.src)} alt="" />
      )}
    </Wrap>
  );
};
export default ImageBox;

const Wrap = styled.div`
  width: 100%;
  height: 100%;
`;
