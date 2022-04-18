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
import { Empty } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { UploadDragger } from 'app/pages/DashBoardPage/pages/BoardEditor/components/SlideSetting/SettingItem/BasicSet/ImageUpload';
import produce from 'immer';
import { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components/macro';
import { WidgetActionContext } from '../../ActionProvider/WidgetActionProvider';
import { WidgetInfoContext } from '../../WidgetProvider/WidgetInfoProvider';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';

export const ImageWidgetCore: React.FC<{}> = () => {
  const widget = useContext(WidgetContext);
  const { editing } = useContext(WidgetInfoContext);
  const { onWidgetUpdate } = useContext(WidgetActionContext);

  const widgetBgImage = widget.config.background.image;

  const t = useI18NPrefix(`viz.board.setting`);

  const onChange = useCallback(
    value => {
      const nextWidget = produce(widget, draft => {
        draft.config.background.image = value;
      });
      onWidgetUpdate(nextWidget);
    },
    [widget, onWidgetUpdate],
  );

  const renderImage = useMemo(() => {
    return editing ? (
      <UploadDragger
        value={widgetBgImage}
        onChange={onChange}
        placeholder={t('uploadTip')}
      />
    ) : widgetBgImage ? null : (
      <Empty description="" />
    );
  }, [editing, onChange, t, widgetBgImage]);
  return <Wrap>{renderImage}</Wrap>;
};

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .ant-upload-list {
    display: none;
  }
`;
