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
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { BoardContext } from 'app/pages/DashBoardPage/components/BoardProvider/BoardProvider';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { FC, memo, useContext } from 'react';
import { NameSet } from './SettingItem/NameSet';
import { RectSet } from './SettingItem/RectSet';
import { SettingPanel } from './SettingPanel';
import { WidgetConfigPanel } from './WidgetConfigPanel';

export const WidgetSetting: FC = memo(() => {
  const t = useI18NPrefix(`viz.board.setting`);
  const { boardType } = useContext(BoardContext);
  const widget = useContext(WidgetContext);

  return (
    <SettingPanel title={`${t('widget')}${t('setting')}`}>
      <>
        <NameSet wid={widget.id} name={widget.config.name} />
        {boardType === 'free' && (
          <RectSet wid={widget.id} rect={widget.config.rect} />
        )}

        <WidgetConfigPanel />
      </>
    </SettingPanel>
  );
});

export default WidgetSetting;
